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
from utils.RitaStreamHandler import RitaStreamHandler
from utils.util import logTime
from langchain_cohere import CohereEmbeddings
import json


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
    retriever = faiss_store.as_retriever()
    return retriever


def initLLM():
    start_time = time.time()
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

    logTime(start_time, "loaded IBM watsonX credentials")

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


def llm_stream_response(data, user_prompt, retriever, llm, debug=True):
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

    if debug:
        start_time = time.time()
        now_formatted = datetime.fromtimestamp(
            start_time).strftime('%H:%M:%S.%f')[:-3]
        print(f"Start llm process at time = {now_formatted}")
    response_queue = queue.Queue()
    stream_handler = RitaStreamHandler(response_queue)
    # Agent 1: Response to the user
    ritaAgent = Rita(llm=llm, retriever=retriever)
    rita_reply = ritaAgent.stream(user_prompt, data)
    if debug:
        logTime(start_time, "First token entered")

    t = threading.Thread(target=stream_handler.llm_stream_buffer,
                         args=(rita_reply,))
    t.start()

    # Agent 2: Determine user's intent
    intent_classifier = IntentClassifier(llm)
    intent = intent_classifier.invoke(user_prompt, data)
    if debug:
        logTime(start_time, f"Intent: {intent}")

    # Agent 3: Modify widget if needed

    def run_widget_modifier():
        while not stream_handler.rita_response_done:
            time.sleep(0.1)
        widget_modifier = WidgetModifier(llm)

        rita_reply = stream_handler.rita_response
        print("reply", rita_reply)
        print("intent", intent)
        modified_widget = widget_modifier.invoke(
            user_prompt, data, intent, rita_reply)
        print("modified", modified_widget)
        stream_handler.add_to_stream(
            agent="Widget Modifier", data=modified_widget)
        stream_handler.end_stream()

    t2 = threading.Thread(target=run_widget_modifier)
    t2.start()

    response = Response(stream_handler.yield_stream(),
                        content_type="application/json")
    return response
