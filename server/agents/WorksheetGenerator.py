import time
from langchain_core.prompts.few_shot import FewShotPromptTemplate
from langchain_core.prompts.prompt import PromptTemplate
from langchain_core.pydantic_v1 import BaseModel, Field, validator
from langchain_core.output_parsers import JsonOutputParser
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
from typing import List, Dict, Union
from utils.LlmTester import LlmTester
from utils.Worksheet import Worksheet

class MultipleChoices(BaseModel):
    type: str = "Multiple Choices"
    questionId: str = Field(description="Id of the question")
    question: str = Field(description="question of the multiple choices question")
    choices: List[str] = Field(description="choices of the multiple choices question")
    answer: int = Field(description="index of the correct answer")
class FillInTheBlanks(BaseModel):
    type: str = "Fill in the Blanks"
    question: str = Field(description="question of the fill in the blanks question")
    answer: List[str] = Field(description="answer of the fill in the blanks question")
class Matching(BaseModel):
    type: str = "Matching"
    question: str = Field(description="question of the matching question")
    leftList: List[str] = Field(description="premises of the matching question")
    rightList: List[str] = Field(description="options of the matching question")
    
class WorksheetGenerator:
    def __init__(self, llm, verbose=False) -> None:
        self.llm = llm  # llm used for intent classification
        self.logger = LlmTester(name="Worksheet Generator", on=verbose)

    def invoke(self, user_prompt, data, reply):
        chain = self._get_runnable()
        prompt = self._get_prompt(user_prompt, data, reply)
        self.logger.log(f"Prompt: {prompt}")

        output = chain.invoke(prompt)
        self.logger.log(f"Output: {output}")

        self._to_latex(output)
        return output

    def _get_runnable(self):
        chat_prompt = self._get_template()
        chain = chat_prompt | self.llm | self._get_parser()
        return chain

    def _get_template(self):
        FORMAT_INSTRUCTION = (
            """
            You are part of a team of teaching assistants whose goal is to help teachers prepare for courses.
            Pervious assistants had generated different kinds of questions based on teacher's need.
            There are three types of question: 'Multiple Choices', 'Matching', or 'Fill in the Blanks'.
            Your task is to identify the type of each generated question and then format the output according to {format_instructions}
            You shouldn't response with any additional text.
            """
        )

        format_instruction = self._get_parser().get_format_instructions()

        worsheet_generator_template = PromptTemplate(
            template=FORMAT_INSTRUCTION,
            partial_variables={"format_instructions": format_instruction},
        )
        messages = [
            MessagesPlaceholder(variable_name="chat_history"),
            ("user", "{user_input}"),
            ("ai", "{reply}"),
            SystemMessagePromptTemplate(prompt=worsheet_generator_template),
            ("ai", ""),
        ]
        chat_prompt = ChatPromptTemplate.from_messages(messages)
        return chat_prompt

    def _get_prompt(self, user_prompt, data, reply):
        chat_history = format_chat_history(data["chat_history"])
        prompt = {"user_input": user_prompt, "chat_history": chat_history, "reply": reply}
        return prompt

    def _get_parser(self):
        class Questions(BaseModel):
            questions : List[Union[MultipleChoices, Matching, FillInTheBlanks]]

        parser = JsonOutputParser(pydantic_object=Questions)
        return parser

    def _to_latex(self, output):
        self.logger.log(f"{output.questions}")