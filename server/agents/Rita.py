from langchain.chains.combine_documents import create_stuff_documents_chain
from langchain.chains.retrieval import create_retrieval_chain
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.prompts import MessagesPlaceholder
from utils.util import format_chat_history
import json


class Rita:
    def __init__(self, llm, retriever) -> None:
        self.llm = llm
        self.retriever = retriever

    def stream(self, user_prompt, data):
        prompt = self._get_prompt(user_prompt, data)
        in_stream = self._get_runnable().stream(prompt)
        return in_stream

    def _get_runnable(self):
        prompt_template = self._get_template()
        document_chain = create_stuff_documents_chain(
            llm=self.llm, prompt=prompt_template)
        retrieval_chain = create_retrieval_chain(
            retriever=self.retriever, combine_docs_chain=document_chain)
        return retrieval_chain

    def _get_template(self):
        SYSTEM_INTRO = (
            "You are a helpful AI teaching assistant chatbot. Your name is Rita. "
            "You are suppose to help the user, who is a teacher, to plan their courses. "
        )
        SYSTEM_BASE_INSTRUCTION = (
            "Answer the user's questions based on the below context: {context}. "
            "The context is given in markdown format. It is a teacher's guide, which covers course content and methodologies."
            "If the input is irrelevant, suggest ways that you can help to plan a lesson. "
            "Answer the question with concise sentences."  # decrease unnecessary token
        )

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
            "widget_id": data["widget"]["id"],
            "widget_content": json.dumps(data["widget"]["content"]),
        }
