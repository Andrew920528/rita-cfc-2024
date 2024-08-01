import time
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
from agents.Rita import Rita
from utils.widget_prompts.WidgetPromptSelector import Intents, WidgetTypes
from utils.util import format_chat_history
from langchain_core.output_parsers import StrOutputParser
import json
from typing import List, Dict
from langchain_core.output_parsers import JsonOutputParser


class WidgetModifier:
    def __init__(self, llm) -> None:
        self.llm = llm  # llm used for intent classification

    def invoke(self, user_prompt, data, intent, reply):
        type = data["widget"]["type"]
        if type not in WidgetTypes.values():
            return ""

        chain = self._get_runnable(type)
        prompt = self._get_prompt(user_prompt, data, reply)
        output = chain.invoke(prompt)

        output = {
            "widgetId": data["widget"]["id"],
            "widgetContent": output
        }

        return json.dumps(output)

    def _get_runnable(self, widget_type):
        chat_prompt = self._get_tempate(widget_type)
        chain = chat_prompt | self.llm | self._get_parser(widget_type)
        return chain

    def _get_tempate(self, widget_type):
        FORMAT_INSTRUCTION = (
            """
            You are part of a team of teaching assistants whose goal is to help teachers prepare for courses.
            Teachers have access to "widgets", which are tools that help them organize their work.
            Your job is to modify the content of these widgets based on the user's interaction with another agent, "Rita".
            The above is the conversation between user and Rita.
            The user's current widget looks like this: {widget_content}.
            You should build upon the current widget based on the result of the above conversation.
            {format_instructions}
            You shouldn't response with any additional text.
            """
        )

        format_instruction = self._get_parser(
            widget_type).get_format_instructions()
        print(format_instruction)
        intent_classifier_template = PromptTemplate(
            template=FORMAT_INSTRUCTION,
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
        widget_id = data["widget"]["id"]
        widget_content = json.dumps(data["widget"]["content"])
        prompt = {"user_input": user_prompt, "chat_history": chat_history,
                  "widget_id": widget_id, "widget_content": widget_content, "reply": reply}
        return prompt

    def _get_parser(self, widget_type):
        class Goals(BaseModel):
            goals: List[str] = Field(
                description="List of goals students should achieve")

        class Note(BaseModel):
            note: str = Field(
                description="Any notes the teachers want to write down.")

        class SemesterPlan(BaseModel):
            headings: List[str] = Field(
                description="column headings for the semester plan, such as Week, Task, etc.")
            rows: List[Dict[str, str]] = Field(
                description="rows for the semester plan, such as {{'Week': 'Week 1', 'Task': 'Task 1'}}. Each key of the dictionary should match the headings")

        if widget_type == WidgetTypes.SEMESTER_GOAL:
            parser = JsonOutputParser(pydantic_object=Goals)
        elif widget_type == WidgetTypes.SEMESTER_PLAN:
            parser = JsonOutputParser(pydantic_object=SemesterPlan)
        elif widget_type == WidgetTypes.NOTE:
            parser = JsonOutputParser(pydantic_object=Note)
        else:
            # Provided widget cannot be modified
            parser = JsonOutputParser(pydantic_object=Goals)
        return parser
