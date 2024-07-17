# pip install langchain-huggingface==0.0.3
# pip install ibm-watsonx-ai==1.0.6
# pip install langchain-ibm==0.1.7
# conda install conda-forge::langchain=0.2.3
from pprint import pprint
import queue
import sys
import threading
from typing import Any, Dict, List
from flask import Response
from langchain.callbacks.streaming_stdout import StreamingStdOutCallbackHandler
from datetime import datetime
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
import json
import logging
from utils.promptTemplate import create_prompt
from utils.streaming import StreamingStdOutCallbackHandlerYield, generate
from utils.util import logTime
from langchain.chains.combine_documents import create_stuff_documents_chain
from langchain.chains.retrieval import create_retrieval_chain
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.prompts import MessagesPlaceholder
from langchain_core.messages import HumanMessage, AIMessage
from langchain_core.documents import Document
from langchain.chains.llm import LLMChain
from langchain_core.prompts import PromptTemplate
from langchain_core.output_parsers import StrOutputParser
# Andrew:
# /Users/yenshuohsu/ibm_cfc_2024/rita-cfc-2024/ai/course-prep/RAG/vector-stores/kang_math_5th_1st_vector_store_with_info
# /Users/yenshuohsu/ibm_cfc_2024/rita-cfc-2024/ai/course-prep/RAG/.env
# Jim:
# r"C:\Users\User\Desktop\Code\ibm\rita-cfc-2024\ai\course-prep\RAG\vector-stores\kang_math_5th_1st_vector_store_with_info"
# r"C:\Users\User\Desktop\Code\ibm\rita-cfc-2024\ai\course-prep\RAG\.env"


# embedding_path = r"C:\Users\User\Desktop\Code\ibm\rita-cfc-2024\ai\course-prep\RAG\vector-stores\kang_math_5th_1st_vector_store_with_info"
# dotenv_path = r"C:\Users\User\Desktop\Code\ibm\rita-cfc-2024\ai\course-prep\RAG\.env"

# Get the directory of the current script
curr_dir = os.path.dirname(os.path.abspath(__file__))
embedding_path = os.path.join(curr_dir, '..', '..', 'ai', 'course-prep', 'RAG', 'vector-stores', 'kang_math_5th_1st_vector_store_with_info')

def initRetriever():    
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
        GenParams.MAX_NEW_TOKENS: 4095,
        GenParams.DECODING_METHOD: DecodingMethods.GREEDY,
        GenParams.REPETITION_PENALTY: 1.1, # TODO this should prob be in config file
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
        callbacks=[StreamingStdOutCallbackHandlerYield(queue.Queue())], # unnecessary
    )
    return llm
    

system_intro = (
"You are a helpful AI teaching assistant chatbot. Your name is Rita."
"You are suppose to help the user, who is a teacher, to plan their courses."
)

system_instructions = (
    "Answer the user's questions based on the below context: {context}."
    "If the input is irrelevant, suggest ways that you can help to plan a lesson."
)
def llm_stream_response(data, user_prompt, retriever, llm):
    prompt = create_prompt(data, user_prompt) # generate prompt
    chat_history = [] # TODO: Save chat history (or return from gui)

    prompt_template = ChatPromptTemplate.from_messages([
        ("system", system_intro),
        MessagesPlaceholder(variable_name="chat_history"),
        ("user", "{input}"),
        ("system", system_instructions),
        ("ai", ""), # WHY IS THIS NEEDED? LIKE ITS ACTUALLY NEEDED!! BUT IT'S NOT MENTIONED ANYWHERE ONLINE
        ]) 
    
    
    document_chain=create_stuff_documents_chain(llm = llm, prompt = prompt_template)
    
    retrieval_chain = create_retrieval_chain(retriever = retriever, combine_docs_chain = document_chain)

    out = ""
    # for chunk in retrieval_chain.stream({
    #     "context": [],
    #     "chat_history": [],
    #     "input": user_prompt
    # }):
    #     print(chunk)
    #     print("===========")
    #     out+=str(chunk)
    r = retrieval_chain.invoke({
        "context": [],
        "chat_history": [],
        "input": prompt,
    })
    pprint(r)
    response = Response(r["answer"], content_type='text/plain')
    return response


