from langchain.prompts import ChatPromptTemplate
from enum import Enum
from utils.widget_prompts.semester_plan_prompts import *


class Intents():
    ASK = "Ask"
    MODIFY = "Modify"
    NONE = "None"


class WidgetTypes():
    FALLTHROUGH = -1
    SEMESTER_GOAL = 0
    SEMESTER_PLAN = 1
    NOTE = 2
    SCHEDULE = 3


class WidgetPromptSelector():
    # widgetType -> 0: SemesterGoal, 1: SemesterPlan, 2: Note, 3: Schedule
    semester_goal_prompts = {
        Intents.ASK: "",
        Intents.MODIFY: "",
    }

    semester_plan_prompts = {
        Intents.ASK: ASK_SEMESTER_PLAN_INSTRUCTION,
        Intents.MODIFY: MODIFY_SEMESTER_PLAN_INSTRUCTION,
    }

    note_prompts = {
        Intents.ASK: "",
        Intents.MODIFY: [
            ("system",
             """
                ### Instruction to LLM:
                You will receive input in the following format:

                {
                    "prompt": "<user_request>",
                    "widget": {
                        "id": "<id>",
                        "type": <type>,
                        "content": {
                            "note": "<existing_note>"
                        }
                    },
                    "classroom": {
                        "name": "<class_name>",
                        "subject": "<subject>",
                        "grade": "<grade>",
                        "publisher": "<publisher>",
                        "credits": <credits>
                    },
                    "lecture": {
                        "name": "<lecture_name>",
                        "type": <lecture_type>
                    }
                }

                ### Task:
                Your task is to update the "note" in the widget content based on the user's prompt and provide a response message. The output format must be strictly followed as below.

                ### Output Format:
                {
                    "reply": "<response_message>",
                    "widgetId": "<id>",
                    "content": {
                        "note": "<updated_note>"
                    }
                }

                ### Explanation of Fields:
                - "prompt": User's input request.
                - "widget": Widget information to be updated.
                    - "id": Unique identifier.
                    - "type": Widget type (0: SemesterGoal, 1: SemesterPlan, 2: Note, 3: Schedule).
                    - "content": Content of the widget.
                        - "note": The note to be updated.
                - "classroom": Classroom details.
                    - "name": Classroom name.
                    - "subject": Subject taught.
                    - "grade": Grade level.
                    - "publisher": Textbook publisher.
                    - "credits": Number of classes per week.
                - "lecture": Lecture details.
                    - "name": Lecture name.
                    - "type": Lecture type.

                ### Example:

                #### Input:
                {
                    "prompt": "在第六堂課前提醒學生拿回連絡簿, 把12/24號改成12/27",
                    "widget": {
                        "id": "9",
                        "type": 2,
                        "content": {
                            "note": "12/24號第四和五堂課要準備2-3學習單"
                        }
                    },
                    "classroom": {
                        "name": "可愛的407班",
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

                #### Output:
                {
                    "reply": "好的老師，已經把12/24號改成12/27，並在第六堂課前提醒學生拿回連絡簿",
                    "widgetId": "9",
                    "content": {
                        "note": "12/27號第四和五堂課要準備2-3學習單, 在第六堂課前提醒學生拿回連絡簿"
                    }
                }

                ### Notes:
                - Ensure that the updated note includes changes requested in the user prompt.
                - Maintain the context and ensure clarity in the reply message.
                """)],
    }

    schedule_prompts = {
        Intents.ASK: "",
        Intents.MODIFY: "",
    }

    @classmethod
    def getWidgetPrompt(cls, widget_type, intent):
        if widget_type == WidgetTypes.FALLTHROUGH:
            return ""  # no widget selected, no extra instruction needed
        if widget_type == WidgetTypes.SEMESTER_GOAL:
            return ""
        if widget_type == WidgetTypes.SEMESTER_PLAN:
            return ""
        if widget_type == WidgetTypes.NOTE:
            return ""
        if widget_type == WidgetTypes.SCHEDULE:
            return ""
        return ""
