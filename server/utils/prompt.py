import json
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.prompts import MessagesPlaceholder

class RitaPromptHandler:
    def __init__(self, data, user_prompt):
        self.data = data # TODO define data to contain what you need
        self.user_prompt = user_prompt
    
    def get_template(self):
        SYSTEM_INTRO = (
        "You are a helpful AI teaching assistant chatbot. Your name is Rita."
        "You are suppose to help the user, who is a teacher, to plan their courses."
        ) #TODO: can add more description about what rita is capable of

        prompt_template = ChatPromptTemplate.from_messages([
        ("system", SYSTEM_INTRO),
        MessagesPlaceholder(variable_name="chat_history"),
        ("user", "{input}"),
        ("system", "{system_instructions}"),
        ("ai", ""), 
        ])
        # NOTE: It is intersteing how adding an empty ai prompt in the end help generating the prompt significantly be
        # When it is not present, llama tries to auto complete the user's question, 
        # or just repeat what the system says.
        # This is just my theory, but adding the ai placeholder in the end enforces conversation order,
        # which let llama knows it is suppose to speak next as an assistant.
        # This is interesting because no examples on the internet has this, so I'm not 
        # sure if there are better practices, or will there be drawbacks with this approach.
        return prompt_template
    
    def get_prompt(self):
        # TODO create prompt based on data and user_prompt
        # NOTE: Use helper methods to build the prompt
        return {
            "context": [],
            "chat_history": [],
            "input": self.user_prompt,
            "system_instructions": self._get_instructions()
        }
    
    def _get_instructions(self):
        # TODO: The original prompt where you specify output format should go here
        # TODO: Look into few-shot prompting formating with langchain instead of hard coding them   
        system_instructions = (
            "Answer the user's questions based on the below context: {context}."
            "If the input is irrelevant, suggest ways that you can help to plan a lesson."
            # "If the user input is Chinese, speak to the user in Chinese." # TODO Language constraints works weidly sometimes
            )
        return system_instructions

    def _identify_intent(self):
        pass #TODO: Ellen's function should be here
    
    
    

    

# TODO: OLD PROMPT, should be removed
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
