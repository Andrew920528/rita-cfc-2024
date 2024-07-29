from langchain.prompts import ChatPromptTemplate

class WidgetPrompts():
    # widgetType -> 0: SemesterGoal, 1: SemesterPlan, 2: Note, 3: Schedule
    def __init__(self) -> None:
        self.cannot_classified_prompts = {
            0: "", 
            1: ChatPromptTemplate.from_messages([
                ("system", "In this case, whether user's input is relevant to modifying the semester plan widgets or not cannot be determined"),
                ("user", "Generate a message to ask the user to provide a more specific input to specify if he/she wants to make changes to the semester plan widgets or ask other questions relevant to the textbook, classroom, lecture, what you are capable of doing, etc."),
            ]), 
            2: "",
            3: ""}
        self.non_modify_improved_by_gpt_prompts = {
            0: "", 
            1: ChatPromptTemplate.from_messages([
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
            ]),
            2: "",
            3: ""}
        self.non_modify_original_prompts = {
            0: "", 
            1: ChatPromptTemplate.from_messages([
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
            ]), 
            2: ChatPromptTemplate.from_messages([
                ("system", 
                """
                ###
                This LLM will receive an input with the following format:

                input = {
                    "prompt": "明天回家後我要做甚麼？",
                    "widget": {
                        "id": "2",
                        "type": 2,
                        "content": {
                            "note": "明天上課前記得要把1-4學習單印出來, 放學前要發聯絡簿, 回家後準備後天段考考卷"
                        }
                    },
                    "classroom": {
                        "name": "好動的507班",
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

                ###
                This functionality aims to help teachers make a note. The note will be displayed by the widget in the frontend.

                ### 
                We will use this input to generate an output response. The response will be used to render the widget content in the frontend. So the following the output format is of the utmost importance.

                ###
                Explanation of the fields in input:
                # "prompt": the user's typed input into the LLM
                # "widget": the data structure storing all information in the widget table. The frontend of this app uses these contents to fill in the information required in the widget table. It contains the following fields:
                    # "id": the widget's unique identifier
                    # "type": the type of the widget represented by a number (0: SemesterGoal widget, 1: SemesterPlan widget, 2: Note widget, 3: Schedule widget)
                    # "content": the data structure storing the content of the widget table. It contains the following fields:
                        # "note": the note content to be displayed in the frontend, in a string format. This provides information for the LLM to refer to when generating the response to the teacher
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
                    "prompt": "明天回家後我要做甚麼？",
                    "widget": {
                        "id": "2",
                        "type": 2,
                        "content": {
                            "note": "明天上課前記得要把1-4學習單印出來, 放學前要發聯絡簿, 回家後準備後天段考考卷"
                        }
                    },
                    "classroom": {
                        "name": "好動的507班",
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
                    "reply": '明天回家後你要準備後天段考的考卷',
                    "widgetId": '9',
                    "content": {
                        "note": "明天上課前記得要把1-4學習單印出來, 放學前要發聯絡簿, 回家後準備後天段考考卷"
                    }
                }

                ###
                In this Sample Input/Output case, we did the following operation(s):
                1. 
                According to the user's request, we changed "12/24號" to "12/27" in the note content and add additional texts ", 在第六堂課前提醒學生拿回連絡簿"
                """)
            ]),
            3: ""}
        self.modify_improved_by_gpt_prompts = {
            0: "", 
            1: ChatPromptTemplate.from_messages([
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
            ]), 
            2: ChatPromptTemplate.from_messages([
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
                """)]),
            3: ""}
        self.modify_original = {
            0: "", 
            1: ChatPromptTemplate.from_messages([
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
            ]), 
            2: ChatPromptTemplate.from_messages([
                ("system", 
                """
                ###
                This LLM will receive an input with the following format:

                input = {
                    "prompt": "幫我把1-4改成1-5, 也提醒我明天放學前要發聯絡簿",
                    "widget": {
                        "id": "9",
                        "type": 2,
                        "content": {
                            "note": "明天上課前記得要把1-4學習單印出來"
                        }
                    },
                    "classroom": {
                        "name": "活潑的301班",
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

                ###
                This functionality aims to help teachers make a note. The note will be displayed by the widget in the frontend.

                ### 
                We will use this input to generate an output response. The response will be used to update or change the widget content in the frontend. So the following the output format is of the utmost importance.

                ###
                Explanation of the fields in input:
                # "prompt": the user's typed input into the LLM
                # "widget": the data structure storing all information in the widget table. The frontend of this app uses these contents to fill in the information required in the widget table. It contains the following fields:
                    # "id": the widget's unique identifier
                    # "type": the type of the widget represented by a number (0: SemesterGoal widget, 1: SemesterPlan widget, 2: Note widget, 3: Schedule widget)
                    # "content": the data structure storing the content of the widget table. It contains the following fields:
                        # "note": the note content to be displayed in the frontend, in a string format. This is what we want to change in this case according to the user's input
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

                Sample LLM Output:
                output = {
                    "reply": '好的老師，已經把12/24號改成12/27，並在第六堂課前提醒學生拿回連絡簿',
                    "widgetId": '9',
                    "content": {
                        "note": "12/27號第四和五堂課要準備2-3學習單, 在第六堂課前提醒學生拿回連絡簿"
                    }
                }

                ###
                In this Sample Input/Output case, we did the following operation(s):
                1. 
                According to the user's request, we changed "12/24號" to "12/27" in the note content and add additional texts ", 在第六堂課前提醒學生拿回連絡簿"
                """)
            ]),
            3: ""}
        self.classification_template = ChatPromptTemplate.from_messages(
            [
                (
                    "system",
                    """
                    ###
                    You are a helpful assistant in an app that helps a teacher with course planning.
                    Your name is Rita.
                    This app contains some widgets in table formats that you could modify following the user's input.
                    However, the user's input might not always be relevant to modifying the widgets.
                    ###
                    Some key words might be relevant to modifying the widgets are:
                    add, delete, insert, alter, change, modify, update, edit, remove, replace, adjust, revise, amend, correct, fix, improve, enhance, refine, fill, complete
                    """
                ),
                (
                    "human",
                    """Classify whether this user input is relevant to interacting the widgets or not, simply and strictly return "modify" or "non-modify": 
                    {user_input}.
                    """
                ),
            ]
        )

    def getWidgetPrompt(self, widget_type, can_classified, to_modify):
        if not can_classified: # cannot be classified as either "modify" or "non-modify"
            return self.cannot_classified_prompts[widget_type]

        if to_modify:
            return self.modify_improved_by_gpt_prompts[widget_type]
        else:
            return self.non_modify_improved_by_gpt_prompts[widget_type]
        
    def getClassificationTemplate(self):
        return self.classification_template
