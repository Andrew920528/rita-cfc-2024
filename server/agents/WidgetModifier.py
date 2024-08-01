from langchain_core.prompts.few_shot import FewShotPromptTemplate
from langchain_core.prompts.prompt import PromptTemplate
from langchain_core.pydantic_v1 import BaseModel, Field, validator
from langchain_core.output_parsers import PydanticOutputParser
from typing import Literal
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.prompts import MessagesPlaceholder
from langchain.schema import AIMessage, HumanMessage
from langchain_core.prompts.chat import SystemMessagePromptTemplate
from config.llm_param import MEMORY_CUTOFF
from utils.util import format_chat_history
from langchain_core.output_parsers import StrOutputParser
import json


class WidgetModifier:
    def __init__(self, llm) -> None:
        self.llm = llm  # llm used for intent classification

    def invoke(self, user_prompt, data, intent, reply):
        chain = self._get_runnable()
        prompt = self._get_prompt(user_prompt, data)
        output = chain.invoke(prompt)
        return output

    def _get_runnable(self):
        chat_prompt = self._get_tempate()
        chain = chat_prompt | self.llm | StrOutputParser()
        return chain

    def _get_tempate(self):
        FORMAT_INSTRUCTION = (
            """
            You are an agent that modifies widget.
            The above is the conversation between user and another agent, "Rita".
            You are given a widget_id with id {widget_id}. The widget is formatted as 
            {widget_content}. You are expected to modify this content based on the user's interaction with Rita.
            No extra text should be provided.
            """  # TODO: This should be in widget_prompts
        )

        intent_classifier_template = PromptTemplate(
            template=FORMAT_INSTRUCTION,
        )
        messages = [
            MessagesPlaceholder(variable_name="chat_history"),
            ("user", "{user_input}"),
            SystemMessagePromptTemplate(prompt=intent_classifier_template),
            ("ai", ""),
        ]
        chat_prompt = ChatPromptTemplate.from_messages(messages)
        return chat_prompt

    def _get_prompt(self, user_prompt, data):
        chat_history = format_chat_history(data["chat_history"])
        widget_id = data["widget"]["id"]
        widget_content = json.dumps(data["widget"]["content"])
        prompt = {"user_input": user_prompt, "chat_history": chat_history,
                  "widget_id": widget_id, "widget_content": widget_content}
        return prompt

    def _get_parser(self):
        pass
