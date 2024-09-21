from langchain.chains.combine_documents import create_stuff_documents_chain
from langchain.chains.retrieval import create_retrieval_chain
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.prompts import MessagesPlaceholder
from utils.LlmTester import LlmTester
from utils.util import format_chat_history
import json

class BaseAgent:
    def __init__(self, llm, retriever, verbose=False) -> None:
        self.llm = llm
        self.retriever = retriever
        self.logger = LlmTester(name="Rita", on=verbose)

    def stream(self, user_prompt, data):
        prompt = self._get_prompt(user_prompt, data)
        self.logger.log(f"Prompt: {prompt}")
        in_stream = self._get_runnable().stream(prompt)

        return in_stream

    def _get_runnable(self):
        prompt_template = self._get_template()
        document_chain = create_stuff_documents_chain(
            llm=self.llm, prompt=prompt_template)
        retrieval_chain = create_retrieval_chain(
            retriever=self.retriever, combine_docs_chain=document_chain)
        return retrieval_chain

    def _get_agent_setup_input(self):
        return {} , {}

    def _get_template(self):

        SYSTEM_INTRO, SYSTEM_BASE_INSTRUCTION = self._get_agent_setup_input()

        messages = [
            ("system", SYSTEM_INTRO),
            MessagesPlaceholder(variable_name="chat_history"),
            ("user", "{input}"),
            ("system", SYSTEM_BASE_INSTRUCTION),
            ("ai", ""),
        ]
        prompt_template = ChatPromptTemplate.from_messages(messages)

        # NOTE: It is intersteing how adding an empty ai prompt in the end help generating the prompt significantly be
        # When it is not present, llama tries to auto complete the user's question,
        # or just repeat what the system says.
        # This is just my theory, but adding the ai placeholder in the end enforces conversation order,
        # which let llama knows it is suppose to speak next as an assistant.
        # This is interesting because no examples on the internet has this, so I'm not
        # sure if there are better practices, or will there be drawbacks with this approach.
        return prompt_template

    def _get_prompt(self, user_prompt, data):
        chat_history = format_chat_history(data["chat_history"])

        return {
            "context": [],
            "chat_history": chat_history,
            "input": user_prompt,
            "subject": data["classroom"]["data"]["subject"],
            "grade": data["classroom"]["data"]["grade"],
            "credits": data["classroom"]["data"]["credits"],
            # "widget_id": data["widget"]["id"],
            # "widget_content": json.dumps(data["widget"]["content"]),
        }

class GeneralAgent(BaseAgent):

    def _get_agent_setup_input(self):
        SYSTEM_INTRO = (
            "You are a helpful AI teaching assistant chatbot."
            "You are suppose to help the user, who is a teacher, to plan their courses."
        )

        SYSTEM_BASE_INSTRUCTION = (
            "Answer the user's questions based on the below context: {context}."
            "The context is a teacher's guide, which covers course content and methodologies."

            "Below are information about the course you are helping with:"
            "Subject: {subject}"
            "Grade level: {grade}"
            "Number of classes per week: {credits}."

            "If the subject is irrelevant to the provided context, try your best to help without using the context."

            "Unless specified otherwise, if asked to provide a semester plan, assume the user wants to cover the content of the entire textbook within the semester. "

            "If the input is irrelevant to the context, answer the user's prompt as it is and suggest ways that you can help to plan a lesson. "
            "Use proper markdown formatting for list items. "
            "When giving an external url, please specify the domain name of the website. "

            "Bold important contents appropriately."
        )

        return SYSTEM_INTRO, SYSTEM_BASE_INSTRUCTION
    
class LectureAgent(BaseAgent):

    def _get_agent_setup_input(self):
        SYSTEM_INTRO = (
            "You are a helpful AI teaching assistant chatbot."
            "You are supposed to help the user, who is a teacher, to plan their courses."
            "You are supposed to answer the user's questions on how to use Rita."
        )
        SYSTEM_BASE_INSTRUCTION = (
            "Answer the user's questions based on the below context: {context}"
            "You can use the learning goals widget to view the key learning points of each course"
            "You can use the course weekly schedule widget to view the classes in a week"
            "You can use the course content schedule widget to make a chart of what to do each week"
            "You can use the worksheet widget to make a worksheets for the course"
            "We also have a note widget for you to take notes"
            "To use these widgets, use the panel on the left"
            "You can use the chatroom on the bottom right to modify all these widgets"
            "The context is a guide to use Rita."

            "If the subject is irrelevant to the provided context, try your best to help without using the context."

            "Use proper markdown formatting for list items. "
            "When giving an external url, please specify the domain name of the website. "

            "Bold important contents appropriately."
        )

        return SYSTEM_INTRO, SYSTEM_BASE_INSTRUCTION
    def _get_prompt(self, user_prompt, data):
        chat_history = format_chat_history(data["chat_history"])

        return {
            "context": [],
            "chat_history": chat_history,
            "input": user_prompt,
            # "widget_id": data["widget"]["id"],
            # "widget_content": json.dumps(data["widget"]["content"]),
        }

class WorksheetAgent(BaseAgent):

    def _get_agent_setup_input(self):
        SYSTEM_INTRO = (
                "You are a helpful AI teaching assistant chatbot."
                "Your task is to assist the user, who is a teacher, in generating questions for their course worksheet to be assigned to students."
                "Please also provide answers to the questions."
            )
        SYSTEM_BASE_INSTRUCTION = (
            "Generate questions for students based on the content described in the course guide: {context}."
            "The context is provided in markdown format and includes details of the course content."
            "Questions should only focus on course content, key concepts, and topics relevant to the subject."
            "Do NOT generate questions based on methodologies or instructional approaches outlined in the teacher's guide."
            "Below is the context information about the course you are assisting with:"
            "Subject: {subject}"
            "Grade level: {grade}"
            "Number of classes per week: {credits}."
            "The questions should be in one of these formats: multiple choice, matching, or fill in the blanks."
            "Do NOT generate extra text besides the title, questions, and answers"
        )

        return SYSTEM_INTRO, SYSTEM_BASE_INSTRUCTION