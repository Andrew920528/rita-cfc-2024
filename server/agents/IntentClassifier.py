from langchain_core.prompts.few_shot import FewShotPromptTemplate
from langchain_core.prompts.prompt import PromptTemplate
from langchain_core.pydantic_v1 import BaseModel, Field, validator
from langchain_core.output_parsers import PydanticOutputParser
from typing import Literal, List
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.prompts import MessagesPlaceholder
from langchain.schema import AIMessage, HumanMessage
from langchain_core.prompts.chat import SystemMessagePromptTemplate
from config.llm_param import MEMORY_CUTOFF
from utils.widget_prompts.WidgetPromptSelector import WidgetTypes
from utils.util import format_chat_history
from utils.LlmTester import LlmTester


class IntentClassifier:
    def __init__(self, llm, agent_type, verbose=False) -> None:
        self.llm = llm  # llm used for intent classification
        self.logger = LlmTester(name="Intent Classifier", on=verbose)
        self.agent_type = agent_type

    def invoke(self, user_prompt, data, reply):
        chain = self._get_runnable()
        prompt = self._get_prompt(user_prompt, data, reply)
        self.logger.log(f"Prompt: {prompt}")
        try:
            output = chain.invoke(prompt)
            self.logger.log(f"Output of intent classifier: {output}")
            intent = output.intent
        except Exception as e:
            print(e)
            intent = "None"
        self.logger.log(f"Output: {intent}")
        return intent

    def _get_runnable(self):
        chat_prompt = self._get_tempate()
        chain = chat_prompt | self.llm | self._get_parser()
        return chain

    def _get_tempate(self):
        CLASSIFY_INSTRUCTION = (
            "You are a classification assistant for determining what's the best course of action to help the user with preparing a lesson. "
            "From the above conversation, determine the action as 'Modify', or 'None'. "
            "In this context, a 'widget' is referred to as a tool in the app."
            "The user can ask for a widget to be modified, or simply ask a question that might or might not be related to a widget."
            "Given the conversation, classify the intent into one of the following categories: "
            "Modify or None."
            "The current widget involves {widget_purpose}. "
            "The action is 'Modify' when the conversation contains information to modify the widget. "
            "Some key words might be relevant to modifying the widgets are:"
            "add, delete, insert, alter, change, modify, update, edit, remove, replace, adjust, revise, amend, correct, fix, improve, enhance, refine, fill, complete"
            "{format_instructions}"
            "The output should solely contain a json object, with no additional text."
        )
        if self.agent_type == "Worksheet":
            CLASSIFY_INSTRUCTION = (
                "You are a classification assistant for determining what's the type of each questions generated. "
                "From the above conversation, determine each question type as 'Multiple Choices', 'Matching', or 'Fill in the Blanks'. "
                "{format_instructions}"
            )
        format_instruction = self._get_parser().get_format_instructions()

        intent_classifier_template = PromptTemplate(
            template=CLASSIFY_INSTRUCTION,
            partial_variables={"format_instructions": format_instruction},
        )
        messages = [
            MessagesPlaceholder(variable_name="chat_history"),
            ("user", "{user_input}"),
            ("ai", "{reply}"),
            SystemMessagePromptTemplate(prompt=intent_classifier_template),
            ("ai", ""),
        ]
        chat_prompt = ChatPromptTemplate.from_messages(messages)
        return chat_prompt

    def _get_prompt(self, user_prompt, data, reply):
        chat_history = format_chat_history(data["chat_history"])
        widget_purpose = WidgetTypes.getPrompt(data["widget"]["type"])
        return {"user_input": user_prompt, "chat_history": chat_history, "reply": reply, "widget_purpose": widget_purpose}

    def _get_parser(self):
        class Intent(BaseModel):
            intent: Literal["Ask", "Modify", "None"] = Field(
                description="the user's intent")
            if self.agent_type == "Worksheet":
                intent: List[Literal["Multiple Choices", "Matching", "Fill in the Blanks"]] = Field(
                    description="question types")

        parser = PydanticOutputParser(pydantic_object=Intent)
        return parser
