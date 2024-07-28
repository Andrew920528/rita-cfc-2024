from langchain.prompts import ChatPromptTemplate

class NoteWidgetPrompts:
    def __init__(self) -> None:
        self.non_modify_improved_by_gpt = ""
        self.non_modify_original = ""
        self.modify_improved_by_gpt = ""
        self.modify_original = ""

class ScheduleWidgetPrompts:
    def __init__(self) -> None:
        self.non_modify_improved_by_gpt = ""
        self.non_modify_original = ""
        self.modify_improved_by_gpt = ""
        self.modify_original = ""

class SemesterGoalWidgetPrompts:
    def __init__(self) -> None:
        self.non_modify_improved_by_gpt = ""
        self.non_modify_original = ""
        self.modify_improved_by_gpt = ""
        self.modify_original = ""

class SemesterPlanWidgetPrompts:
    def __init__(self) -> None:
        self.cannot_classified_prompt = ChatPromptTemplate.from_messages(
            [
                ("system", "In this case, whether user's input is relevant to modifying the semester plan widgets or not cannot be determined"),
                ("user", "Generate a message to ask the user to provide a more specific input to specify if he/she wants to make changes to the semester plan widgets or ask other questions relevant to the textbook, classroom, lecture, what you are capable of doing, etc."),
            ]
        )

        # ONE-SHOT non-modify prompt improved by GPT
        self.non_modify_improved_by_gpt = ChatPromptTemplate.from_messages(
            [
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
            ]
        )
        # Edison's ONE-SHOT non-modify prompt
        self.non_modify_original = ChatPromptTemplate.from_messages(
            [
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
                        "name": "好奇的的520班",
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
                However, in this case, the user input suggests that no changes are required to the widget. Therefore, the LLM should return the same widget content without any modifications.

                ### The following is an example:

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
                    "reply": '老師早安，請問有甚麼可以幫忙的嗎?',
                    "widgetId": '12',
                    "content": {
                        "headings": ["週目", "目標", "教材"],
                        "rows": [
                            {"週目": 1, "目標": "讓學生能認識多位小數與比較小數", "教材": "1-1, 1-2"},
                            {"週目": 2, "目標": "讓學生學習多位小數的加減及日常應用", "教材": "1-3"},
                            {"週目": 3, "目標": "讓學生了解小數與概數", "教材": "1-4"}]
                    }
                }
            
                """),
                ("user",
                """
                ### 
                Simply provide a reasonable answer answering the user's input, and put the answer in the "reply" field. Fill the "widgetId" and "content" fields with the exact same information from user input. Since in this case we don't want to change the content in the widget
                """),
            ]
        )
        # ONE-SHOT modify prompt improved by GPT
        self.modify_improved_by_gpt = ChatPromptTemplate.from_messages(
            [
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
            ]
        )
        # Edison's ONE-SHOT modify prompt
        self.modify_original = ChatPromptTemplate.from_messages(
            [
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
                        "name": "好奇的的520班",
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
                This functionality aims to help teachers make semester-long teaching plans. The plan will be displayed by the widget in the frontend in a table format

                ### 
                We will use this input to generate an output response. The response will be used to update or change the widget table content in the frontend. So the following the output format is of the utmost importance.

                ###
                Explanation of the fields in input:
                # "prompt": the user's typed input into the LLM
                # "widget": the data structure storing all information in the widget table. The frontend of this app uses these contents to fill in the information required in the widget table. It contains the following fields:
                    # "id": the widget's unique identifier
                    # "type": the type of the widget represented by a number (0: SemesterGoal widget, 1: SemesterPlan widget, 2: Note widget, 3: Schedule widget)
                    # "content": the data structure storing the content of the widget table. It contains the following fields:
                        # "headings": a list containing column names of the widget table to be displayed in the frontend
                        # "rows": a list containing rows of the widget table to be displayed in the frontend. Each row is a dictionary containing the following fields (these fields match the column names in "headings" field for displaying in the frontend):
                            # "週目": the week number of the semester
                            # "目標": the teaching goal of the week
                            # "教材": the teaching material of the week
                # "classroom": Defines the information of the current classroom. It contains the following fields:
                    # "name": the name of the classroom
                    # "subject": the subject of the classroom
                    # "grade": the grade level of the classroom
                    # "publisher": the publisher of the textbook used in the classroom
                    # "credits": the credits of the course, which is the number of classes per week

                ### For the LLM to retrieve relevant information via RAG (Retrieval-Augmented Generation), "subject", "grade", and "publisher" fields in "classroom" are used to locate the relevant information in the textbook embedding.

                ### The following is an example:

                ### 
                Sample LLM Input: 
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
                            {"週目": "2", "目標": "第一次段考", "教材": "1-1, 1-2"},
                            {"週目": "3", "目標": "讓學生學習多位小數的加減及日常應用", "教材": "1-3"},
                            {"週目": "4", "目標": "讓學生了解小數與概數", "教材": "1-4"},
                            {"週目": "5", "目標": "第二次段考", "教材": "1-3, 1-4"}
                        ]
                    }
                }
                
                ###
                In this Sample Input/Output case, we did the following two operations:
                1. 
                # Insert {"週目": "2", "目標": "第一次段考", "教材": "1-1, 1-2"} after {"週目": "1", "目標": "讓學生能認識多位小數與比較小數", "教材": "1-1, 1-2"} 
                # This is because we want to follow the input's intent "在這個計畫的第一周後安插第一次段考."
                # Notice "教材" is "1-1, 1-2" in {"週目": "2", "目標": "第一次段考", "教材": "1-1, 1-2"} since all "教材" appear before "第一次段考" contain only "1-1, 1-2".
                2. 
                # Insert {"週目": "5", "目標": "第二次段考", "教材": "1-3, 1-4"} after {"週目": "4", "目標": "讓學生了解小數與概數", "教材": "1-4"}
                # This is because we want to follow the input's intent "在這個計畫的第三周後安插第二次段考."
                # Notice "教材" is "1-3, 1-4" in {"週目": "5", "目標": "第二次段考", "教材": "1-3, 1-4"} since all "教材" appear before "第二次段考" and after "第一次段考" contain "1-3" and "1-4".
                """),
                ("human",
                """
                ### Perform operations on the widget table based on the user's input and reply to the user. The operations could include inserting a new row, changing the content of a row, or adding a new week to the semester plan and more.
                """),
            ]
        )
