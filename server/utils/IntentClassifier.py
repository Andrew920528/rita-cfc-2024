from langchain_core.prompts.few_shot import FewShotPromptTemplate
from langchain_core.prompts.prompt import PromptTemplate
from langchain_core.pydantic_v1 import BaseModel, Field, validator
from langchain_core.output_parsers import PydanticOutputParser
from typing import Literal
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.prompts import MessagesPlaceholder
from langchain.schema import SystemMessage
from langchain_core.prompts.chat import SystemMessagePromptTemplate
class IntentClassifier:
    def __init__(self, llm) -> None:
        self.llm = llm # llm used for intent classification
        
    def get_intent(self, user_prompt):
        CLASSIFY_INSTRUCTION = (
            "You are a classification assistant for determining user's intent. "
            "From the above conversation, determine the intent of the user as either 'Ask', 'Modify', or 'None'. "
            "In this context, a 'widget' is referred to as a tool in the app."
            "The user can ask for a widget to be modified, or simply ask a question that might or might not be related to a widget."
            "Given the conversation, classify the intent into one of the following categories: "
            "Ask, Modify, or None."
            "Some key words might be relevant to modifying the widgets are:"
            "add, delete, insert, alter, change, modify, update, edit, remove, replace, adjust, revise, amend, correct, fix, improve, enhance, refine, fill, complete"
            "{format_instructions}"
        )
        
        format_instruction = self.get_parser().get_format_instructions()
        
        intent_classifier_template = PromptTemplate(
            template=CLASSIFY_INSTRUCTION,
            partial_variables={"format_instructions": format_instruction},
        )
        messages = [
            MessagesPlaceholder(variable_name="chat_history"),
            ("user", "{user_input}"),
            SystemMessagePromptTemplate(prompt=intent_classifier_template),
            ("ai", ""), 
        ]
        chat_prompt = ChatPromptTemplate.from_messages(messages)
        
        chain =  chat_prompt | self.llm | self.get_parser()
        try:
            output = chain.invoke({"user_input": user_prompt, "chat_history": []})
            intent = output.intent
        except Exception as e:
            print(e)
            intent = "None"
        return intent

    
    def get_parser(self):
        class Intent(BaseModel):
            intent: Literal["Ask", "Modify", "None"] = Field(description="the user's intent")
            
        parser = PydanticOutputParser(pydantic_object=Intent)
        return parser