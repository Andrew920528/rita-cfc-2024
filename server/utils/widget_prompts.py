from langchain.prompts import ChatPromptTemplate
from enum import Enum


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


class WidgetPrompts():
    # widgetType -> 0: SemesterGoal, 1: SemesterPlan, 2: Note, 3: Schedule
    semester_goal_prompts = {
        Intents.ASK: [],
        Intents.MODIFY: [],
    }

    semester_plan_prompts = {
        Intents.ASK: [
            ("system",
             """
                ###
                This LLM will receive an input with the following format:

                input = {
                    "prompt": "幫我在這個計畫的第二周後加入第一次段考",
                    "widget": {
                        "id": "12",
                        "type": 1,
                        "content": {
                            "headings": ["週目", "目標", "教材"],
                            "rows": [
                                {"週目": 1, "目標": "讓學生能認識多位小數與比較小數", "教材": "1-1, 1-2"},
                                {"週目": 2, "目標": "讓學生學習多位小數的加減及日常應用", "教材": "1-3"},
                                {"週目": 3, "目標": "讓學生了解小數與概數", "教材": "1-4"},
                                {"週目": 4, "目標": "讓學生熟悉整除的意義", "教材": "2-1"},
                                {"週目": 5, "目標": "讓學生知道甚麼是因數、公因數和最大公因數", "教材": "2-2, 2-3"}
                            ]
                        }
                    },
                    "classroom": {
                        "name": "好奇的520班",
                        "subject": "數學",
                        "grade": "五上",
                        "publisher": "康軒",
                        "credits": 4
                    },
                    "lecture": {
                        "name": "string",
                        "type": 0
                    }
                }

                ###
                This functionality aims to help teachers make semester-long teaching plans. The plan will be displayed by the widget in the frontend in a table format.

                ###
                In this case, the user input suggests that no changes are required to the widget. Therefore, the LLM should return the same widget content without any modifications.

                ### 
                The following is an example:

                ### 
                Sample LLM Input:
                input = {
                    "prompt": "早上好RiTA!",
                    "widget": {
                        "id": "12",
                        "type": 1,
                        "content": {
                            "headings": ["週目", "目標", "教材"],
                            "rows": [
                                {"週目": 1, "目標": "讓學生能認識多位小數與比較小數", "教材": "1-1, 1-2"},
                                {"週目": 2, "目標": "讓學生學習多位小數的加減及日常應用", "教材": "1-3"},
                                {"週目": 3, "目標": "讓學生了解小數與概數", "教材": "1-4"}
                            ]
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
                    "reply": '老師早安，請問今天我有甚麼可以幫忙的嗎?',
                    "widgetId": '12',
                    "content": {
                        "headings": ["週目", "目標", "教材"],
                        "rows": [
                            {"週目": 1, "目標": "讓學生能認識多位小數與比較小數", "教材": "1-1, 1-2"},
                            {"週目": 2, "目標": "讓學生學習多位小數的加減及日常應用", "教材": "1-3"},
                            {"週目": 3, "目標": "讓學生了解小數與概數", "教材": "1-4"}
                        ]
                    }
                }
                """),
            ("user",
             """
                ### 
                Simply provide a reasonable answer to the user's input and place the answer in the "reply" field. Fill the "widgetId" and "content" fields with the exact same information from the user input. Since we don't want to change the content in the widget, return it as is.
                """),
        ],
        Intents.MODIFY: [
            ("system",
             """
                ###
                This LLM will receive input in the following format to modify the widget table in the frontend to help teachers make semester-long teaching plans.
                The plan will be displayed in the frontend in a table format. 
                The modifying operations can include inserting new rows, updating existing rows, or adding new weeks to the semester plan or more.

                ### Input Format:
                The input will be a dictionary with the following fields:
                - "prompt": The user's request, e.g., "幫我在這個計畫的第二周後加入第一次段考"
                - "widget": Contains the data structure for the widget table:
                    - "id": Unique identifier of the widget
                    - "type": Numeric type of the widget (0: SemesterGoal, 1: SemesterPlan, 2: Note, 3: Schedule)
                    - "content": Contains the table data with:
                        - "headings": List of column names
                        - "rows": List of dictionaries representing each row in the table, with fields matching the headings ("週目", "目標", "教材")
                - "classroom": Information about the classroom:
                    - "name": Name of the classroom
                    - "subject": Subject taught
                    - "grade": Grade level
                    - "publisher": Publisher of the textbook
                    - "credits": Number of classes per week
                - "lecture": Information about the lecture:
                    - "name": Name of the lecture
                    - "type": Type of the lecture

                ### Output Format:
                The output will be a dictionary with the following fields:
                - "reply": A confirmation message based on the user's request
                - "widgetId": The id of the widget being updated
                - "content": The updated table data with:
                    - "headings": List of column names
                    - "rows": List of dictionaries representing each row in the table

                ### Example Input:
                input = {
                    "prompt": "幫我在這個計畫的第一周及第三周後安插第一次和第二次段考",
                    "widget": {
                        "id": "12",
                        "type": 1,
                        "content": {
                            "headings": ["週目", "目標", "教材"],
                            "rows": [
                                {"週目": 1, "目標": "讓學生能認識多位小數與比較小數", "教材": "1-1, 1-2"},
                                {"週目": 2, "目標": "讓學生學習多位小數的加減及日常應用", "教材": "1-3"},
                                {"週目": 3, "目標": "讓學生了解小數與概數", "教材": "1-4"}
                            ]
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

                ### Example Output:
                output = {
                    "reply": '沒問題!已幫你在這個計畫的第一周及第三周後裡面安插第一次和第二次段考',
                    "widgetId": '12',
                    "content": {
                        "headings": ["週目", "目標", "教材"],
                        "rows": [
                            {"週目": "1", "目標": "讓學生能認識多位小數與比較小數", "教材": "1-1, 1-2"},
                            {"週目": "2", "目標": "第一次段考", "教材": "1-1, 1-2"},
                            {"週目": "3", "目標": "讓學生學習多位小數的加減及日常應用", "教材": "1-3"},
                            {"週目": "4", "目標": "讓學生了解小數與概數", "教材": "1-4"},
                            {"週目": "5", "目標": "第二次段考", "教材": "1-3, 1-4"}
                        ]
                    }
                }
                """),
            ("user",
             """
                ###
                Return a accurate output following the user's request.
                ### Notes:
                1. Ensure the content of the widget table accurately reflects the user's request.
                2. Maintain the integrity of existing data while inserting or updating rows.
                3. Use "subject", "grade", and "publisher" fields in "classroom" to locate relevant information in the textbook embedding for RAG (Retrieval-Augmented Generation).
                """)
        ],
    }

    note_prompts = {
        Intents.ASK: [],
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
        Intents.ASK: [],
        Intents.MODIFY: [],
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
