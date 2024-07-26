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
from langchain.schema.runnable import RunnableBranch
from langchain.schema.output_parser import StrOutputParser
from langchain.prompts import ChatPromptTemplate
from langchain_ibm import WatsonxLLM
from dotenv import load_dotenv
import os
from utils.prompt import RitaPromptHandler
from utils.streaming import StreamHandler
from utils.util import logTime
from utils.widget_prompts import NoteWidgetPrompts, ScheduleWidgetPrompts, SemesterGoalWidgetPrompts, SemesterPlanWidgetPrompts
from langchain.chains.combine_documents import create_stuff_documents_chain
from langchain.chains.retrieval import create_retrieval_chain

# Initialize widget prompts
note_widget_prompts = NoteWidgetPrompts()
schedule_widget_prompts = ScheduleWidgetPrompts()
semester_goal_widget_prompts = SemesterGoalWidgetPrompts()
semester_plan_widget_prompts = SemesterPlanWidgetPrompts()


def initRetriever():
    # Get the absolute path of the embedding path with system independent path selectors
    curr_dir = os.path.dirname(os.path.abspath(__file__))
    embedding_path = os.path.join(
        curr_dir,
        "..",
        "..",
        "ai",
        "course-prep",
        "RAG",
        "vector-stores",
        "kang_math_5th_1st_vector_store_with_info",
    )

    embedding_model = HuggingFaceEmbeddings(
        model_name="sentence-transformers/paraphrase-multilingual-MiniLM-L12-v2"
    )

    # Load FAISS store from disk
    faiss_store = FAISS.load_local(
        embedding_path, embedding_model, allow_dangerous_deserialization=True
    )

    # Create a retriever chain
    retriever = faiss_store.as_retriever()  # can specify parameters but default is fine
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
        GenParams.MAX_NEW_TOKENS: 4095,
        GenParams.DECODING_METHOD: DecodingMethods.GREEDY,
        GenParams.REPETITION_PENALTY: 1.3,  # TODO this should prob be in config file
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

    print(data)
    # Generate prompt based on retrieved data and user input
    promptHandler = RitaPromptHandler(data, user_prompt)

    # Define the modify vs non-modify classification template
    classification_template = ChatPromptTemplate.from_messages(
        [
            (
                "system",
                """
                ###
                You are a helpful assistant in an app that helps a teacher with course planning.
                Your name is Rita.
                This app contains some widgets in table formats that you could modify following the user's input.
                However, the user's input might not always be relevant to modifying the widgets.
                ###
                Some key words might be relevant to modifying the widgets are:
                add, delete, insert, alter, change, modify, update, edit, remove, replace, adjust, revise, amend, correct, fix, improve, enhance, refine, fill, complete
                """
            ),
            (
                "human",
                """Classify whether this user input is relevant to interacting the widgets or not, simply and strictly return "modify" or "non-modify": 
                {user_input}.
                """
            ),
        ]
    )

    # for testing purposes
    def semester_plan_modify(x):
         print(f"Semester Plan Modify's x: {x}")
         print(x)
         return semester_plan_widget_prompts.modify_improved_by_gpt | llm | StrOutputParser()

    def semester_plan_non_modify(x):
         print(f"Semester Plan Non-Modify's x: {x}")
         print(x)
         return semester_plan_widget_prompts.non_modify_improved_by_gpt | llm | StrOutputParser()

    # instruction = None  # instruction specific to the widget type and modify/non-modify
    branches = None

    if data["widget"]["type"] == -1:
        # user is currently not using widget functionalities
        # in "instruction", add relevant info on Rita's functionalities?
        instruction = """
        You are a helpful AI assistant within an app that assist a teacher in course planning.
        Your name is Rita.
        """
    else:
        # user is currently using widget functionalities
        if data["widget"]["type"] == 0:  # SemesterGoal
            # branches is a list of (condition, Runnable) tuples
            branches = RunnableBranch(
                (lambda x: "modify" in x, semester_goal_widget_prompts.modify_improved_by_gpt | llm | StrOutputParser()),
                (lambda x: "non-modify" in x, semester_goal_widget_prompts.non_modify_improved_by_gpt | llm | StrOutputParser()),
                # semester_goal_widget_prompts.cannot_classified_prompt | llm | StrOutputParser()
            )
        if data["widget"]["type"] == 1:  # SemesterPlan
            branches = RunnableBranch(
                (lambda x: "modify" in x, semester_plan_modify),
                (lambda x: "non-modify" in x, semester_plan_non_modify),
                # (lambda x: "modify" in x, semester_plan_widget_prompts.modify_improved_by_gpt | llm | StrOutputParser()),
                # (lambda x: "non-modify" in x, semester_plan_widget_prompts.non_modify_improved_by_gpt | llm | StrOutputParser()),
                semester_plan_widget_prompts.cannot_classified_prompt | llm | StrOutputParser()
            )
        if data["widget"]["type"] == 2:  # Note
            branches = RunnableBranch(
                (lambda x: "modify" in x, note_widget_prompts.modify_improved_by_gpt | llm | StrOutputParser()),
                (lambda x: "non-modify" in x, note_widget_prompts.non_modify_improved_by_gpt | llm | StrOutputParser()),
                note_widget_prompts.cannot_classified_prompt | llm | StrOutputParser()
            )
        if data["widget"]["type"] == 3:  # Schedule
            branches = RunnableBranch(
                (lambda x: "modify" in x, schedule_widget_prompts.modify_improved_by_gpt | llm | StrOutputParser()),
                (lambda x: "non-modify" in x, schedule_widget_prompts.non_modify_improved_by_gpt | llm | StrOutputParser()),
                schedule_widget_prompts.cannot_classified_prompt | llm | StrOutputParser()
            )


        # pipeline of determining widget type, then determining modify/non-modify, then creating the instruction prompt
        instruction = classification_template | llm | StrOutputParser() | branches

    prompt = promptHandler.get_prompt(instruction)
    prompt_template = promptHandler.get_template()

    # Chain together components (LLM, prompt, RAG retriever)
    document_chain = create_stuff_documents_chain(llm=llm, prompt=prompt_template)
    retrieval_chain = create_retrieval_chain(
        retriever=retriever, combine_docs_chain=document_chain
    )

    # Call the LLM and stream its response
    rita_reply = retrieval_chain.stream(prompt)
    stream_handler = StreamHandler(queue.Queue())
    threading.Thread(target=stream_handler.output_buffer, args=(rita_reply,)).start()
    response = Response(stream_handler.yield_stream(), content_type="text/plain")
    return response
