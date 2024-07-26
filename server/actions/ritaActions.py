# pip install langchain-huggingface
# pip install ibm-watsonx-ai
# pip install langchain-ibm
# pip install langchain
import queue
import threading
from flask import Response
import time
from langchain_huggingface import HuggingFaceEmbeddings
from langchain_community.vectorstores import FAISS
from ibm_watsonx_ai import Credentials
from ibm_watsonx_ai.metanames import GenTextParamsMetaNames as GenParams
from ibm_watsonx_ai.foundation_models.utils.enums import ModelTypes, DecodingMethods
from langchain.chains import RetrievalQA
from langchain_ibm import WatsonxLLM
from dotenv import load_dotenv
import os
from config.llm_param import MAX_NEW_TOKENS, REPETITION_PENALTY
from utils.RitaPromptHandler import RitaPromptHandler
from utils.RitaOutputParser import RitaOutputParser
from utils.util import logTime
from langchain.chains.combine_documents import create_stuff_documents_chain
from langchain.chains.retrieval import create_retrieval_chain

def initRetriever(): 
    # Get the absolute path of the embedding path with system independent path selectors
    curr_dir = os.path.dirname(os.path.abspath(__file__))
    embedding_path = os.path.join(curr_dir, '..', '..', 'ai', 'course-prep', 'RAG', 'vector-stores', 'kang_math_5th_1st_vector_store_with_info')
   
    embedding_model = HuggingFaceEmbeddings(
        model_name="sentence-transformers/paraphrase-multilingual-MiniLM-L12-v2"
    )

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

    #Initialize WatsonX LLM Interface
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
    

def llm_stream_response(data, user_prompt, retriever, llm):
    
    # Generate prompt based on retrieved data and user input
    promptHandler = RitaPromptHandler(data, user_prompt)
    prompt = promptHandler.get_prompt()
    prompt_template = promptHandler.get_template()
    
    # Chain together components (LLM, prompt, RAG retriever)
    document_chain = create_stuff_documents_chain(llm = llm, prompt = prompt_template)
    retrieval_chain = create_retrieval_chain(retriever = retriever, combine_docs_chain = document_chain)

    # Call the LLM and stream its response
    rita_reply = retrieval_chain.stream(prompt)
    
    # Parse the streamed response
    output_parser = RitaOutputParser()
    threading.Thread(target=output_parser.output_buffer, args=(rita_reply,)).start()
    response = Response(output_parser.yield_stream(), content_type='text/plain')
    return response


