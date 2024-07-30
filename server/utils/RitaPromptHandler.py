from enum import Enum
import json
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.prompts import MessagesPlaceholder
from langchain.schema import HumanMessage, AIMessage
from langchain_core.pydantic_v1 import BaseModel, Field, validator
from langchain_core.output_parsers import JsonOutputParser
from config.llm_param import MEMORY_CUTOFF
from utils.util import format_chat_history
from utils.widget_prompts import WidgetPrompts
from enum import Enum
import json
from click import prompt
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.prompts import MessagesPlaceholder
from langchain.schema import HumanMessage, AIMessage
from utils.widget_prompts import WidgetPrompts
from langchain.schema.runnable import RunnableBranch
from langchain.schema.output_parser import StrOutputParser

# Initialize widget prompts
widget_prompts = WidgetPrompts()

class RitaPromptHandler:
    """Defines the prompt and template for Rita

    Args:
        data (dict): context data, in the following format:
            {
                widget: {
                    id: string
                    type: int
                    content: any
                }
                classroom: {
                    name: string
                    subject: string
                    publisher: string
                    grade: string
                    plan: int
                    credits: int
                }
                lecture: {
                    name: string
                    type: string
                }
                chat_history: List({
                    sender: string
                    text: string
                }
            }
        user_prompt (str): user prompt
    """
    def __init__(self, data, user_prompt, intent):
        self.data = data
        self.user_prompt = user_prompt
        self.intent = intent

    def get_template(self):
        SYSTEM_INTRO = (
        "You are a helpful AI teaching assistant chatbot. Your name is Rita. "
        "You are suppose to help the user, who is a teacher, to plan their courses. "
        ) 
        SYSTEM_BASE_INSTRUCTION = (
        "Answer the user's questions based on the below context: {context}. "
        "The context is given in markdown format. It is a teacher's guide, which covers course content and methodologies."
        "If the input is irrelevant, suggest ways that you can help to plan a lesson. "
        "Answer the question with concise sentences." # decrease unnecessary token
        )
        FORMAT_INSTRUCTION = (
            """
            Your answer will contain two parts. 
            The first part is the string response to the user.
            The second part is formatted text will directly changes the frontend widgets.
            Widgets are refered to a tool the user has access to for course planning.
            You will be given a widget_id with id {widget_id}. The widget is formatted as 
            {widget_content}. You are expected to modify this content based on the user's question.
            You should format your response by surrounding widget_id and widget_content within tags.
            The tags are <wid> and <wCont>.
            For example, you should respond like this:
            {{response to the user}} <wid> {{widget id}} </wid> <wCont> {{widget content}} </wCont>
            where things inside <wid> tag is the given widget id and <wCont> is a stringified json object
            that has the same format as the given widget content. The tags should be have a space before and after, e.g ' <wid> '.
            """ # TODO: the second part should be completely ommited if the prompt is irrelevant. Perhaps we need a second agent.
        )
        messages = [
            ("system", SYSTEM_INTRO),
            MessagesPlaceholder(variable_name="chat_history"),
            ("user", "{input}"),
            ("system", SYSTEM_BASE_INSTRUCTION + FORMAT_INSTRUCTION + "{extra_instruction}"),
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

    def get_prompt(self):
        extra_instruction = "" # self._get_instructions()
        chat_history = format_chat_history(self.data["chat_history"])
        
        return {
            "context": [],
            "chat_history": chat_history,
            "input": self.user_prompt,
            "extra_instruction": extra_instruction,
            "widget_id": self.data["widget"]["id"],
            "widget_content": json.dumps(self.data["widget"]["content"]),
        }

    def _get_instructions(self):
        if self.data["widget"]["type"] == -1:
            return "" # no widget selected, no extra instruction needed
        
        instruction = widget_prompts.getWidgetPrompt(self.intent, self.data["widget"]["type"])
        return instruction

    
    
    
    # debugging tools
    def print_prompt(self):
        # For debugging. Prints out the actual prompt given to the llm.
        # This gives good approximation of token usage: https://token-counter.app/meta/llama-3
        formatted = self.get_template().format(**self.get_prompt())
        print("Formatted prompt:")
        print(formatted)