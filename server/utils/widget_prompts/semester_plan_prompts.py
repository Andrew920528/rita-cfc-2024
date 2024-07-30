ASK_SEMESTER_PLAN_INSTRUCTION = """
Simply provide a reasonable answer to the user's input and place the answer in the "reply" field.
Fill the "widgetId" and "content" fields with the exact same information from the user input. 
Since we don't want to change the content in the widget, return it as is.
"""

MODIFY_SEMESTER_PLAN_INSTRUCTION = """
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
                
                                ###
                Return a accurate output following the user's request.
                ### Notes:
                1. Ensure the content of the widget table accurately reflects the user's request.
                2. Maintain the integrity of existing data while inserting or updating rows.
                3. Use "subject", "grade", and "publisher" fields in "classroom" to locate relevant information in the textbook embedding for RAG (Retrieval-Augmented Generation).

"""
