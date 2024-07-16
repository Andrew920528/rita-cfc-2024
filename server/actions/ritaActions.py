# pip install langchain-huggingface==0.0.3
# pip install ibm-watsonx-ai==1.0.6
# pip install langchain-ibm==0.1.7
# conda install conda-forge::langchain=0.2.3
import queue
import sys
import threading
from typing import Any, Dict, List
from flask import Response
from langchain.callbacks.streaming_stdout import StreamingStdOutCallbackHandler
from datetime import datetime
import time
from langchain_huggingface import HuggingFaceEmbeddings
from langchain.vectorstores import FAISS
from ibm_watsonx_ai import Credentials
from ibm_watsonx_ai.metanames import GenTextParamsMetaNames as GenParams
from ibm_watsonx_ai.foundation_models.utils.enums import ModelTypes, DecodingMethods
from langchain.chains import RetrievalQA
from langchain_ibm import WatsonxLLM
from dotenv import load_dotenv
import os
import json
import logging
from utils.streaming import StreamingStdOutCallbackHandlerYield, generate
from utils.util import logTime



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

API_KEY = ''
URL = ''
PROJECT_ID = ''

def initializeSetup():
    global embedding_path, dotenv_path, API_KEY, URL, PROJECT_ID
    load_details()
    
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

def load_details():
    global embedding_path, dotenv_path, API_KEY, URL, PROJECT_ID
    load_dotenv()
    API_KEY = os.getenv("WATSONX_API_KEY")
    URL = os.getenv("WATSONX_URL")
    PROJECT_ID = os.getenv("WATSONX_PROJECT_ID")

def create_prompt(input):
    global embedding_path, dotenv_path, API_KEY, URL, PROJECT_ID
    load_details()
    input_str = json.dumps(input, indent=4, ensure_ascii=False)
    input_output_instruction = """
    
    Sample LLM Input: 

    input = {
        "prompt": "幫我在這個計畫的第一周及第三周後裡面安插第一次和第二次段考",
        "widget": {
            "id": "12",
            "type": 1,
            "content": {
                "headings": ["週目", "目標", "教材"],
                "rows": [
                    {"週目": 1, "目標": "讓學生能認識多位小數與比較小數", "教材": "1-1, 1-2"},
                    {"週目": 2, "目標": "讓學生學習多位小數的加減及日常應用", "教材": "1-3"},
                    {"週目": 3, "目標": "讓學生了解小數與概數", "教材": "1-4"}]
            }
        },
        "classroom": {
            "name": "親愛的511班",
            "subject": "數學",
            "grade": "五上",
            "publisher": "康軒",
            "credits": 5
        },
        "lecture": {
            "name": "string",
            "type": 0
        }
    }

    Sample LLM Output:

    output = {
        "reply": '沒問題!已幫你在這個計畫的第一周及第三周後裡面安插第一次和第二次段考',
        "widgetId": '12',
        "content": {
            "headings": ["週目", "目標", "教材"],
            "rows": [
                {"週目": "1", "目標": "讓學生能認識多位小數與比較小數", "教材": "1-1, 1-2"},
                {"週目": "2", "目標": "第一次段考", "教材": "無"},
                {"週目": "3", "目標": "讓學生學習多位小數的加減及日常應用", "教材": "1-3"},
                {"週目": "4", "目標": "讓學生了解小數與概數", "教材": "無"},
                {"週目": "5", "目標": "第二次段考", "教材": "1-3, 1-4"}
            ]
        }
    }
    
    Use the fields "subject", "grade" and "publisher" to locate the relevant information in the textbook when performing the retrieval. Fill the "reply" field with the answer to the question and "widgetId" and "content" fields with the "id" and "content" from input's "widget".
    
    Return a utf-8 formatted response and please return it in a JSON, not string

    Help me generate a output based on my input below:"""

    return input_output_instruction + input_str

def llm_handle_input(input, retriever):
    start_time = time.time()
    global embedding_path, dotenv_path, API_KEY, URL, PROJECT_ID
    
    load_details()
    #Initialize WatsonX LLM Interface
    credentials = Credentials.from_dict({"url": URL, "apikey": API_KEY}) 
    params = {
        GenParams.MAX_NEW_TOKENS: 4095,
        GenParams.DECODING_METHOD: DecodingMethods.GREEDY,
        GenParams.REPETITION_PENALTY: 1.0,
    }   

    logTime(start_time, "loaded IBM watsonX credentials")

    prompt = create_prompt(input)
    logTime(start_time, "Generated prompt")

    # TODO: we should be able to init chatbot only once as well
    def ask_question(callback_fn):
        # Initialize the LLM model
        llm = WatsonxLLM(
            model_id=ModelTypes.LLAMA_3_70B_INSTRUCT.value,
            params=params,
            url=credentials.get("url"),
            apikey=credentials.get("apikey"),
            streaming=True,
            project_id=PROJECT_ID,
            callbacks=[callback_fn],
        )
        logTime(start_time, "Created LLM")
        qa = RetrievalQA.from_chain_type(llm=llm, chain_type="stuff", retriever=retriever)
        logTime(start_time, "Created QA")
        return qa.run(prompt)

    q = queue.Queue()
    callback_fn = StreamingStdOutCallbackHandlerYield(q)
    threading.Thread(target=ask_question, args=(callback_fn,)).start()

    response = Response(generate(q), content_type='text/plain')

    return response


