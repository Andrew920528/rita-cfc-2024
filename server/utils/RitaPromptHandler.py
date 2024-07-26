from enum import Enum
import json
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.prompts import MessagesPlaceholder
from langchain.schema import HumanMessage, AIMessage
from langchain_core.pydantic_v1 import BaseModel, Field, validator
from langchain_core.output_parsers import JsonOutputParser
from config.llm_param import MEMORY_CUTOFF

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
    def __init__(self, data, user_prompt):
        self.data = data
        self.user_prompt = user_prompt
    
    def get_template(self):
        SYSTEM_INTRO = (
        "You are a helpful AI teaching assistant chatbot. Your name is Rita. "
        "You are suppose to help the user, who is a teacher, to plan their courses. "
        ) #TODO[Edison]: can add more description about what rita is capable of
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
        extra_instruction = self._get_instructions()
        chat_history = self._format_chat_history()
        
        return {
            "context": [],
            "chat_history": chat_history,
            # NOTE: We are explicitly passing in chat_history here, 
            # instead of relying on langchain's ChatMessageHistory (an automated history manager)
            # because we already have state management implemented, and complicating
            # code with langchain dependencies just doesn't seem worth.
            "input": self.user_prompt,
            "extra_instruction": extra_instruction,
            "widget_id": self.data["widget"]["id"],
            "widget_content": json.dumps(self.data["widget"]["content"]),
        }
    def _get_instructions(self):
        # TODO[Edison]: The original prompt where you specify output format should go here
        # TODO[Edison]: Look into few-shot prompting formating with langchain instead of hard coding them
        # TODO[Edison]: You should be able to identify what instruction to use with self.data.widget.type and self._identify_intent()
        instruction = ""
        return instruction
    
    def _format_chat_history(self):
        chat_history_raw = self.data["chat_history"]
        chat_history = []
        cutoff = MEMORY_CUTOFF
        for message in chat_history_raw[-cutoff:]:
            if message["sender"] == "user":
                chat_history.append(HumanMessage(content=message["text"]))
            elif message["sender"] == "ai":
                chat_history.append(AIMessage(content=message["text"]))
        
        return chat_history
    
    def _identify_intent(self):
         #TODO[Ellen]: given self.user_prompt, return the intent (defined below)
        return Intent.MODIFY
    
    # debugging tools
    def print_prompt(self):
        # For debugging. Prints out the actual prompt given to the llm.
        # can't seem to find a good way to count token in code, 
        # but this gives good approximation: https://token-counter.app/meta/llama-3
        formatted = self.get_template().format(**self.get_prompt())
        print("Formatted prompt:")
        print(formatted)

    
class Intent(Enum): # although this is just T/F, we might have more intents as we scale
    ASK = 0
    MODIFY = 1
       
    
# TODO[Edison]: This function is not used anymore, take what you need and delete this
def create_prompt(data, user_prompt):
    input_str = json.dumps(data, indent=4, ensure_ascii=False)
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
