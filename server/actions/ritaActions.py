# pip install langchain-huggingface
# pip install ibm-watsonx-ai
# pip install langchain-ibm
# pip install langchain
# pip install translate
# pip install -U deep-translator
import queue
from flask_sse import sse
from datetime import datetime
import threading
from flask import Response
import time
from langchain_community.vectorstores import FAISS
from ibm_watsonx_ai import Credentials
from ibm_watsonx_ai.metanames import GenTextParamsMetaNames as GenParams
from ibm_watsonx_ai.foundation_models.utils.enums import ModelTypes, DecodingMethods
from langchain_ibm import WatsonxLLM
from dotenv import load_dotenv
import os
from config.llm_param import MAX_NEW_TOKENS, REPETITION_PENALTY
from agents.Rita import Rita
from agents.IntentClassifier import IntentClassifier
from agents.WidgetModifier import WidgetModifier
from utils.LlmTester import LlmTester
from utils.RitaStreamHandler import RitaStreamHandler
from langchain_cohere import CohereEmbeddings
import json
import re

from langchain.chains.combine_documents import create_stuff_documents_chain
from langchain.chains.retrieval import create_retrieval_chain
from deep_translator import GoogleTranslator


def initRetriever():
    # Get the absolute path of the embedding path with system independent path selectors
    curr_dir = os.path.dirname(os.path.abspath(__file__))
    embedding_path = os.path.join(
        curr_dir, '..', '..', 'ai', 'rag', 'vector-stores', 'test_vector_store')

    env_path = os.path.join(os.path.dirname(curr_dir), '.env')
    load_dotenv(dotenv_path=env_path)
    COHERE_KEY = os.getenv("COHERE_KEY")

    embedding_model = CohereEmbeddings(
        cohere_api_key=COHERE_KEY, model="embed-multilingual-v3.0")
    # Load FAISS store from disk
    faiss_store = FAISS.load_local(
        embedding_path, embedding_model, allow_dangerous_deserialization=True
    )

    # Create a retriever chain
    retriever = faiss_store.as_retriever(search_kwargs={"k": 3})
    return retriever


def initLLM():
    tester = LlmTester(name="init ibm watsonX", on=True)

    load_dotenv()
    API_KEY = os.getenv("WATSONX_API_KEY")
    URL = os.getenv("WATSONX_URL")
    PROJECT_ID = os.getenv("WATSONX_PROJECT_ID")

    # Initialize WatsonX LLM Interface
    credentials = Credentials.from_dict({"url": URL, "apikey": API_KEY})
    params = {
        GenParams.MAX_NEW_TOKENS: MAX_NEW_TOKENS,
        GenParams.DECODING_METHOD: DecodingMethods.GREEDY,
        GenParams.REPETITION_PENALTY: REPETITION_PENALTY,
    }
    tester.log_start_timer("loaded IBM watsonX credentials")

    # Initialize the LLM model
    llm = WatsonxLLM(
        model_id=ModelTypes.LLAMA_3_70B_INSTRUCT.value,
        params=params,
        url=credentials.get("url"),
        apikey=credentials.get("apikey"),
        streaming=True,
        project_id=PROJECT_ID,
    )
    return llm


def llm_stream_response(data, user_prompt, retriever, llm):
    """
    https://www.figma.com/design/xiYG1qIDmu9S1KSapuJQb9/Rita-%7C-CFC-2024?node-id=350-1636&t=BZfXxoQSRUG081uy-0
    data (dict): context data, in the following format:
        {
            widget: {
                id: string
                type: int
                content: any
            }
            classroom: {
                name: string
                subject: string
                publisher: string
                grade: string
                plan: int
                credits: int
            }
            lecture: {
                name: string
                type: string
            }
            chat_history: List({
                sender: string
                text: string
            }
        }
    """
    ##########################  Logging Controllers #############################
    LOG_OUTPUT = True   # Enable to log time and output of the entire process
    # Enable to log detail output of each agent
    RITA_VERBOSE = True
    INTENT_VERBOSE = False
    WID_VERBOSE = False
    #############################################################################

    time_logger = LlmTester(name="llm process", on=LOG_OUTPUT)
    time_logger.log_start_timer("Start llm process")

    response_queue = queue.Queue()
    stream_handler = RitaStreamHandler(response_queue)
    # Agent 1: Response to the user
    rita_agent = Rita(llm=llm, retriever=retriever, verbose=RITA_VERBOSE)
    complete_rita_response = ""
    rita_response_done = False

    def run_rita_agent():
        nonlocal rita_response_done
        nonlocal complete_rita_response
        in_stream = rita_agent.stream(user_prompt, data)
        retriever_tester = LlmTester(
            name="retriever tester", on=RITA_VERBOSE)

        for chunk in in_stream:
            if "answer" not in chunk:
                retriever_tester.log(chunk)
                continue
            stream_handler.add_to_stream(
                agent="Rita", data=chunk["answer"])
            complete_rita_response += chunk["answer"]
        time_logger.log_latency(
            f"Rita reply completed.{complete_rita_response}")
        rita_response_done = True
    t = threading.Thread(target=run_rita_agent)
    t.start()

    time_logger.log_latency("First token entered")

    def run_widget_modifier():
        nonlocal complete_rita_response
        nonlocal complete_rita_response

        while not rita_response_done:
            time.sleep(0.1)

        # Agent 2: Determine user's intent
        intent_classifier = IntentClassifier(llm, verbose=INTENT_VERBOSE)
        intent = intent_classifier.invoke(
            user_prompt, data, complete_rita_response)

        time_logger.log_latency(f"Finished detecting intent.")

        # Agent 3: Modify widget if needed
        widget_modifier = WidgetModifier(llm, verbose=WID_VERBOSE)
        stream_handler.add_to_stream(
            agent="Widget Modifier", data="WIDGET_MODIFIER_STARTED")
        modified_widget = widget_modifier.invoke(
            user_prompt, data, intent, complete_rita_response)
        time_logger.log_latency(
            f"Modified widget generated.")
        stream_handler.add_to_stream(
            agent="Widget Modifier", data=modified_widget)
        stream_handler.end_stream()
        time_logger.log_latency("Stream completed")

    t2 = threading.Thread(target=run_widget_modifier)
    t2.start()

    response = Response(stream_handler.yield_stream(),
                        content_type="application/json")
    return response


def split_text(text, max_chars=5000):
    chunks = []
    current_chunk = ""

    # Split the text into sentences (ends with . ! ?)
    sentences = re.split(r'(?<=[.!?])\s+', text)

    for sentence in sentences:
        if len(current_chunk) + len(sentence) < max_chars:
            current_chunk += sentence + " "
        else:
            # If adding this sentence exceeds the limit, store the current chunk
            chunks.append(current_chunk.strip())
            current_chunk = sentence + " "

    # Add the last chunk if it's not empty
    if current_chunk:
        chunks.append(current_chunk.strip())

    return chunks


def translateText(text):
    try:
        translator = GoogleTranslator(source='en', target='zh-TW')
        completeTranslation = ""
        chunks = split_text(text)

        for textChunk in chunks:
            completeTranslation += translator.translate(textChunk)

        return {
            'status': 'success',
            'data': completeTranslation
        }

    except Exception as e:
        response = {
            'status': 'error',
            'data': str(e)
        }
        return response
