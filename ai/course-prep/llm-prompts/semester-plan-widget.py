# Notes to Consider:
"""
1. In the extracted textbook file, we can clearly list out the chapter sections and their corresponding contents for more effective retrieval. 
2. If the user demand LLM perform operations causing chapter sections and contents mismatching, LLM better inform the user of this.
3. LLM ask the user again before performing more risky action (like deleting the whole table)? 
"""

# 0. Generic explanation, provide to LLM if input is relevant to widget operations:
# DONE
semester_plan_widget_operation_generic_info = """
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
    We will use this input to generate an output response. The response will be used to update or change the widget content in the frontend. So the output format is of the utmost importance.

    ###
    Explanation of the input fields:
    # "prompt": the user's typed input into the LLM
    # "widget": the data structure storing the widget's all information. The frontend of this app uses these contents to fill in the information required in the widget.
    # "id": unique identifier for the widget
    # "type": the type of the widget represented by a number
    # "content": the data defining the structure of the widget and contains the information to be displayed in the widget
    # "headings": a list containing column names of the widget table to be displayed in the frontend
    # "rows": a list containing the rows of the widget table to be displayed in the frontend
    # "classroom": defines the information of the current classroom
    
"""

# 1. Base Case: user's task is irrelevant to semester plan widget
# will finalize after Ellen's search implementation

"""
    The user input is :
"""
# + input
"""
    ###
    This user input is irrelevant to making any changes to the widget, simply return a output following the "Sample Return Format" below

    ###
    Sample Return Format (ignore the semantic information inside): 

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
    

    ###
    Fill the "reply" field with the answer to user's input.

    ###
    Fill the "widgetId" and "content" fields with the exact same information from user input. Since in this case we don't want to change the content in the widget
    
    ###
    Return a utf-8 formatted response and please return it in a JSON, not string

"""

# 2. 周內前後安插段考
# DONE

"""
    ### 
    Sample LLM Input 1: 
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

    Sample LLM Output 1:
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

    ### 
    Sample LLM Input 2:
    input = {
        "prompt": "協助我在這個計畫的第一周前安插第一次段考，也在第三周後面再安排一次段考",
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
            "name": "好動的608班",
            "subject": "數學",
            "grade": "五上",
            "publisher": "康軒",
            "credits": 3
        },
        "lecture": {
            "name": "string",
            "type": 0
        }
    }

    Sample LLM Output 2:
    output = {
        "reply": '沒問題!已幫你在這個計畫的第一周前安插第一次段考，也在第三周後面再安排一次段考',
        "widgetId": '12',
        "content": {
            "headings": ["週目", "目標", "教材"],
            "rows": [
                {"週目": "1", "目標": "第一次段考", "教材": ""},
                {"週目": "2", "目標": "讓學生能認識多位小數與比較小數", "教材": "1-1, 1-2"},
                {"週目": "3", "目標": "讓學生學習多位小數的加減及日常應用", "教材": "1-3"},
                {"週目": "4", "目標": "讓學生了解小數與概數", "教材": "1-4"},
                {"週目": "5", "目標": "第二次段考", "教材": "1-3, 1-4"}
            ]
        }
    }

    ###
    Use the fields "subject", "grade" and "publisher" to locate the relevant information in the textbook when performing the retrieval. Fill the "reply" field with the answer to the question and "widgetId" and "content" fields with the "id" and "content" from input's "widget".

    ###
    Return a utf-8 formatted response and please return it in a JSON, not string

    ###
    Help me generate an output based on my input below:"""

# 3. 更改段考範圍
# DONE

"""
    ### 
    Sample LLM Input 1: 
   input = {
        "prompt": "幫我更改第一次段考範圍為1-1, 1-3, 1-4",
        "widget": {
            "id": "9",
            "type": 1,
            "content": {
                "headings": ["週目", "目標", "教材"],
                "rows": [
                    {"週目": 1, "目標": "讓學生能認識多位小數與比較小數", "教材": "1-1, 1-2"},
                    {"週目": 2, "目標": "讓學生學習多位小數的加減及日常應用", "教材": "1-3"},
                    {"週目": 3, "目標": "讓學生了解小數與概數", "教材": "1-4"}
                    {"週目": 4, "目標": "第一次段考", "教材": "1-1, 1-2, 1-3, 1-4"}
                    {"週目": 5, "目標": "讓學生熟悉整除的意義", "教材": "2-1"},
                    {"週目": 6, "目標": "讓學生知道甚麼是因數、公因數和最大公因數", "教材": "2-2, 2-3"}
                    ]
            }
        },
        "classroom": {
            "name": "糟糕的504班",
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

    Sample LLM Output 1:
    output = {
        "reply": '好的，我已照你的指示更改第一次段考範圍為1-1, 1-3, 1-4',
        "widgetId": '9',
        "content": {
            "headings": ["週目", "目標", "教材"],
            "rows": [
                    {"週目": 1, "目標": "讓學生能認識多位小數與比較小數", "教材": "1-1, 1-2"},
                    {"週目": 2, "目標": "讓學生學習多位小數的加減及日常應用", "教材": "1-3"},
                    {"週目": 3, "目標": "讓學生了解小數與概數", "教材": "1-4"}
                    {"週目": 4, "目標": "第一次段考", "教材": "1-1, 1-3, 1-4"}
                    {"週目": 5, "目標": "讓學生熟悉整除的意義", "教材": "2-1"},
                    {"週目": 6, "目標": "讓學生知道甚麼是因數、公因數和最大公因數", "教材": "2-2, 2-3"}
            ]
        }
    }
    
    ###
    In this Sample Input/Output case, we change the "教材" in the entry relevant to "第一次段考" from the original "1-1, 1-2, 1-3, 1-4" to "1-1, 1-3, 1-4", since we want to "更改第一次段考範圍為1-1, 1-3, 1-4"

    ###
    Use the fields "subject", "grade" and "publisher" to locate the relevant information in the textbook when performing the retrieval. Fill the "reply" field with the answer to the question and "widgetId" and "content" fields with the "id" and "content" from input's "widget".

    ###
    Return a utf-8 formatted response and please return it in a JSON, not string

    ###
    Help me generate an output based on my input below:"""

# 4. 周內前後安排進度
# DONE

"""
    ### 
    Sample LLM Input 1: 
    input = {
        "prompt": "幫我在這個計畫的第一周後新增一週，我想教導關於教材1-2的內容",
        "widget": {
            "id": "3",
            "type": 1,
            "content": {
                "headings": ["週目", "目標", "教材"],
                "rows": [
                    {"週目": 1, "目標": "讓學生能認識多位小數與比較小數", "教材": "1-1"},
                    {"週目": 2, "目標": "讓學生學習多位小數的加減及日常應用", "教材": "1-3"},
                    {"週目": 3, "目標": "讓學生了解小數與概數", "教材": "1-4"}
                    {"週目": 4, "目標": "讓學生熟悉整除的意義", "教材": "2-1"},
                    {"週目": 5, "目標": "讓學生知道甚麼是因數、公因數和最大公因數", "教材": "2-2, 2-3"}
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

    Sample LLM Output 1:
    output = {
        "reply": '沒問題!已幫你在這個計畫的第一周後新增一週，並輸入關於課本中1-2的相關內容',
        "widgetId": '3',
        "content": {
            "headings": ["週目", "目標", "教材"],
            "rows": [
                    {"週目": 1, "目標": "讓學生能認識多位小數與比較小數", "教材": "1-1"},
                    {"週目": 2, "目標": "讓學生了解比較小數", "教材": "1-2"},
                    {"週目": 3, "目標": "讓學生學習多位小數的加減及日常應用", "教材": "1-3"},
                    {"週目": 4, "目標": "讓學生了解小數與概數", "教材": "1-4"}
                    {"週目": 5, "目標": "讓學生熟悉整除的意義", "教材": "2-1"},
                    {"週目": 6, "目標": "讓學生知道甚麼是因數、公因數和最大公因數", "教材": "2-2, 2-3"}
            ]
        }
    }
    
    ###
    #
    In this Sample Input/Output case, the LLM search in the vector embedding for content relevant to section "1-2".
    # 
    The LLM then add an entry after "第一週". In the entry, it enters information relevant to section 1-2 in the textbook embedding file, which is about "比較小數"
    

    ### 
    Sample LLM Input 2:
    input = {
        "prompt": "在這個計畫的第一週前安插一週，進度為1-1。也在計畫的最後一周後增加一週，進度為2-1和2-2",
        "widget": {
            "id": "1",
            "type": 1,
            "content": {
                "headings": ["週目", "目標", "教材"],
                "rows": [
                    {"週目": 1, "目標": "讓學生能比較小數", "教材": "1-2"},
                    {"週目": 2, "目標": "讓學生學習多位小數的加減及日常應用", "教材": "1-3"},
                    {"週目": 3, "目標": "讓學生了解小數與概數", "教材": "1-4"}]
            }
        },
        "classroom": {
            "name": "好動的608班",
            "subject": "數學",
            "grade": "五上",
            "publisher": "康軒",
            "credits": 3
        },
        "lecture": {
            "name": "string",
            "type": 0
        }
    }

    Sample LLM Output 2:
    output = {
        "reply": "已經幫你在這個計畫的第一週前安插一週，進度為1-1。也幫您在計畫的最後一周後增加一週，進度為2-1和2-2。",
        "widgetId": "1",
        "content": {
            "headings": ["週目", "目標", "教材"],
            "rows": [
                {"週目": 1, "目標": "讓學生能認識多位小數", "教材": "1-1"},
                {"週目": 2, "目標": "讓學生能比較小數", "教材": "1-2"},
                {"週目": 3, "目標": "讓學生學習多位小數的加減及日常應用", "教材": "1-3"},
                {"週目": 4, "目標": "讓學生了解小數與概數", "教材": "1-4"},
                {"週目": 5, "目標": "讓學生熟悉整除的意義", "教材": "2-1"},
                {"週目": 6, "目標": "讓學生知道甚麼是因數, "教材": "2-2"}
            ]
        }
    }

    ###
    Use the fields "subject", "grade" and "publisher" to locate the relevant information in the textbook when performing the retrieval. Fill the "reply" field with the answer to the question and "widgetId" and "content" fields with the "id" and "content" from input's "widget".

    ###
    Return a utf-8 formatted response and please return it in a JSON, not string

    ###
    Help me generate an output based on my input below:"""


# 5. 延長主題進度時間
# DONE

"""
    ###
    Sample LLM Input 1: 
    input = {
        "prompt": "將這個計畫的第六周目標延長到第七周，並將第六周教材改為2-2, 第七周為2-3",
        "widget": {
            "id": "12",
            "type": 1,
            "content": {
                "headings": ["週目", "目標", "教材"],
                "rows": [
                    {"週目": 1, "目標": "讓學生能認識多位小數", "教材": "1-1"},
                    {"週目": 2, "目標": "讓學生能比較小數", "教材": "1-2"},
                    {"週目": 3, "目標": "讓學生學習多位小數的加減及日常應用", "教材": "1-3"},
                    {"週目": 4, "目標": "讓學生了解小數與概數", "教材": "1-4"},
                    {"週目": 5, "目標": "讓學生了解甚麼是整除", "教材": "2-1"},
                    {"週目": 6, "目標": "讓學生知道因數、公因數及最大公因數之概念及應用", "教材": "2-2, 2-3"}
                ]
            }
        },
        "classroom": {
            "name": "討厭的307班",
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

    Sample LLM Output 1:
    output = {
        "reply": '沒問題!已幫你將這個計畫的第六周目標延長到第七周，並將第六周教材改為2-2, 第七周為2-3',
        "widgetId": '12',
        "content": {
            "headings": ["週目", "目標", "教材"],
            "rows": [
                    {"週目": 1, "目標": "讓學生能認識多位小數", "教材": "1-1"},
                    {"週目": 2, "目標": "讓學生能比較小數", "教材": "1-2"},
                    {"週目": 3, "目標": "讓學生學習多位小數的加減及日常應用", "教材": "1-3"},
                    {"週目": 4, "目標": "讓學生了解小數與概數", "教材": "1-4"},
                    {"週目": 5, "目標": "讓學生了解甚麼是整除", "教材": "2-1"},
                    {"週目": 6, "目標": "讓學生知道因數之概念及應用", "教材": "2-2"},
                    {"週目": 7, "目標": "讓學生知道公因數及最大公因數之概念及應用", "教材": "2-3"}
            ]
        }
    }
    
    ###
    In this Sample Input/Output case, we did the following operations:
    1.
    # Add {"週目": 7, "目標": "讓學生知道公因數及最大公因數之概念及應用", "教材": "2-3"} after {"週目": 6, "目標": "讓學生知道因數、公因數及最大公因數之概念及應用", "教材": "2-2, 2-3"} since we want to "將這個計畫的第六周目標延長到第七周"
    # Change "教材" in {"週目": 6, "目標": "讓學生知道因數、公因數及最大公因數之概念及應用", "教材": "2-2, 2-3"} from "2-2, 2-3" to just "2-2" and move "2-3" to {"週目": 7, "目標": "讓學生知道公因數及最大公因數之概念及應用", "教材": "2-3"} since we want to "將第六周教材改為2-2, 第七周為2-3"
    
    ### 
    Sample LLM Input 2:
    input = {
        "prompt": "把這個計畫的第三周延長到第四周",
        "widget": {
            "id": "7",
            "type": 1,
            "content": {
                "headings": ["週目", "目標", "教材"],
                "rows": [
                    {"週目": 1, "目標": "讓學生能認識多位小數", "教材": "1-1"},
                    {"週目": 2, "目標": "讓學生能比較小數", "教材": "1-2"},
                    {"週目": 3, "目標": "讓學生學習多位小數的加減及日常應用", "教材": "1-3"}                
                  ]
            }
        },
        "classroom": {
            "name": "積極向上地的501班",
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

    Sample LLM Output 2:
    output = {
    "reply": '好的，已經照您的指示把這個計畫的第三周延長到第四周',
    "widgetId": '7',
    "content": {
        "headings": ["週目", "目標", "教材"],
        "rows": [
            {"週目": 1, "目標": "讓學生能認識多位小數", "教材": "1-1"},
            {"週目": 2, "目標": "讓學生能比較小數", "教材": "1-2"},
            {"週目": 3, "目標": "讓學生學習多位小數的加減及日常應用", "教材": "1-3"},
            {"週目": 4, "目標": "讓學生學習多位小數的加減及日常應用", "教材": "1-3"}
        ]
      }
    }

    ###
    Use the fields "subject", "grade" and "publisher" to locate the relevant information in the textbook when performing the retrieval. Fill the "reply" field with the answer to the question and "widgetId" and "content" fields with the "id" and "content" from input's "widget".
    
    ###
    Return a utf-8 formatted response and please return it in a JSON, not string

    ###
    Help me generate an output based on my input below:"""


# 6. 縮短主題進度時間
# DONE

"""
    ###
    Sample LLM Input 1: 
    input = {
        "prompt": "將這個計畫的第一週即第二週合併",
        "widget": {
            "id": "12",
            "type": 1,
            "content": {
                "headings": ["週目", "目標", "教材"],
                "rows": [
                    {"週目": 1, "目標": "讓學生能認識多位小數", "教材": "1-1"},
                    {"週目": 2, "目標": "讓學生能比較小數", "教材": "1-2"},
                    {"週目": 3, "目標": "讓學生學習多位小數的加減及日常應用", "教材": "1-3"},
                    {"週目": 4, "目標": "讓學生了解小數與概數", "教材": "1-4"},
                    {"週目": 5, "目標": "讓學生了解甚麼是整除", "教材": "2-1"},
                    {"週目": 6, "目標": "讓學生知道因數、公因數及最大公因數之概念及應用", "教材": "2-2, 2-3"}
                ]
            }
        },
        "classroom": {
            "name": "討厭的307班",
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

    Sample LLM Output 1:
    output = {
        "reply": '好的，已幫你將這個計畫的第一週即第二週合併',
        "widgetId": '12',
        "content": {
            "headings": ["週目", "目標", "教材"],
            "rows": [
                    {"週目": 1, "目標": "讓學生能認識多位小數及比較小數", "教材": "1-1, 1-2"},
                    {"週目": 2, "目標": "讓學生學習多位小數的加減及日常應用", "教材": "1-3"},
                    {"週目": 3, "目標": "讓學生了解小數與概數", "教材": "1-4"},
                    {"週目": 4, "目標": "讓學生了解甚麼是整除", "教材": "2-1"},
                    {"週目": 5, "目標": "讓學生知道因數、公因數及最大公因數之概念及應用", "教材": "2-2, 2-3"}
            ]
        }
    }
    
    ###
    In this sample input/output, we did the following operations:
    # 
    Deleted entry {"週目": 2, "目標": "讓學生能比較小數", "教材": "1-2"} since we want to "將這個計畫的第一週即第二週合併"
    #
    Combine contents from the deleted entry {"週目": 2, "目標": "讓學生能比較小數", "教材": "1-2"} to the entry relevant to "第一周", which was originally {"週目": 1, "目標": "讓學生能認識多位小數", "教材": "1-1"} and become {"週目": 1, "目標": "讓學生能認識多位小數及比較小數", "教材": "1-1, 1-2"}
    # 
    Decrement "週目" by 1 in entries 
    {"週目": 3, "目標": "讓學生學習多位小數的加減及日常應用", "教材": "1-3"},
    {"週目": 4, "目標": "讓學生了解小數與概數", "教材": "1-4"},
    {"週目": 5, "目標": "讓學生了解甚麼是整除", "教材": "2-1"},
    {"週目": 6, "目標": "讓學生知道因數、公因數及最大公因數之概念及應用", "教材": "2-2, 2-3"}
    because we deleted the entry {"週目": 2, "目標": "讓學生能比較小數", "教材": "1-2"}. 
    Now, they become:
    {"週目": 2, "目標": "讓學生學習多位小數的加減及日常應用", "教材": "1-3"},
    {"週目": 3, "目標": "讓學生了解小數與概數", "教材": "1-4"},
    {"週目": 4, "目標": "讓學生了解甚麼是整除", "教材": "2-1"},
    {"週目": 5, "目標": "讓學生知道因數、公因數及最大公因數之概念及應用", "教材": "2-2, 2-3"}

    ###
    Sample LLM Input 2:
    input = {
        "prompt": "把這個計畫的第三週到第五周進度全部合併起來",
        "widget": {
            "id": "12",
            "type": 1,
            "content": {
                "headings": ["週目", "目標", "教材"],
                "rows": [
                    {"週目": 1, "目標": "讓學生能認識多位小數", "教材": "1-1"},
                    {"週目": 2, "目標": "讓學生能比較小數", "教材": "1-2"},
                    {"週目": 3, "目標": "讓學生學習多位小數的加減及日常應用", "教材": "1-3"},
                    {"週目": 4, "目標": "讓學生了解小數與概數", "教材": "1-4"},
                    {"週目": 5, "目標": "讓學生了解甚麼是整除", "教材": "2-1"},
                    {"週目": 6, "目標": "讓學生知道因數、公因數及最大公因數之概念及應用", "教材": "2-2, 2-3"},
                    {"週目": 7, "目標": "讓學生熟悉倍數是甚麼", "教材": "3-1"}
                ]
            }
        },
        "classroom": {
            "name": "有素養的511班",
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

    Sample LLM Output 2:
    output = {
        "reply": '好的，已幫你把這個計畫的第三週到第五周進度全部合併起來',
        "widgetId": '12',
        "content": {
            "headings": ["週目", "目標", "教材"],
            "rows": [
                {"週目": 1, "目標": "讓學生能認識多位小數", "教材": "1-1"},
                {"週目": 2, "目標": "讓學生能比較小數", "教材": "1-2"},
                {"週目": 3, "目標": "讓學生學習多位小數的加減及日常應用、了解小數與概數、了解甚麼是整除", "教材": "1-3, 1-4, 2-1"},
                {"週目": 4, "目標": "讓學生知道因數、公因數及最大公因數之概念及應用", "教材": "2-2, 2-3"},
                {"週目": 5, "目標": "讓學生熟悉倍數是甚麼", "教材": "3-1"}
            ]
        }
    }
    
    ###
    Use the fields "subject", "grade" and "publisher" to locate the relevant information in the textbook when performing the retrieval. Fill the "reply" field with the answer to the question and "widgetId" and "content" fields with the "id" and "content" from input's "widget".
    
    ###
    Return a utf-8 formatted response and please return it in a JSON, not string

    ###
    Help me generate an output based on my input below:"""


# 7. 刪除表格內容
# DONE

"""
    ###
    Sample LLM Input 1: 
    input = {
        "prompt": "將這個表格的所有內容都刪除",
        "widget": {
            "id": "12",
            "type": 1,
            "content": {
                "headings": ["週目", "目標", "教材"],
                "rows": [
                    {"週目": 1, "目標": "讓學生能認識多位小數", "教材": "1-1"},
                    {"週目": 2, "目標": "讓學生能比較小數", "教材": "1-2"},
                    {"週目": 3, "目標": "讓學生學習多位小數的加減及日常應用", "教材": "1-3"},
                    {"週目": 4, "目標": "讓學生了解小數與概數", "教材": "1-4"},
                    {"週目": 5, "目標": "讓學生了解甚麼是整除", "教材": "2-1"},
                    {"週目": 6, "目標": "讓學生知道因數、公因數及最大公因數之概念及應用", "教材": "2-2, 2-3"}
                ]
            }
        },
        "classroom": {
            "name": "活潑的408班",
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

    Sample LLM Output 1:
    output = {
        "reply": '沒問題!已經協助您將這表個內的所有內容刪除',
        "widgetId": '12',
        "content": {
            "headings": ["週目", "目標", "教材"],
            "rows": [
            ]
        }
    }

    ###
    In this sample input/output, we set the contents in "rows" from
    [
        {"週目": 1, "目標": "讓學生能認識多位小數", "教材": "1-1"},
        {"週目": 2, "目標": "讓學生能比較小數", "教材": "1-2"},
        {"週目": 3, "目標": "讓學生學習多位小數的加減及日常應用", "教材": "1-3"},
        {"週目": 4, "目標": "讓學生了解小數與概數", "教材": "1-4"},
        {"週目": 5, "目標": "讓學生了解甚麼是整除", "教材": "2-1"},
        {"週目": 6, "目標": "讓學生知道因數、公因數及最大公因數之概念及應用", "教材": "2-2, 2-3"}
    ]
    to 
    []
    since we want to "將這個表格的所有內容都刪除"

    ###
    Sample LLM Input 2:
    input = {
        "prompt": "將這個計畫中第二、三、五周的內容都刪除",
        "widget": {
            "id": "12",
            "type": 1,
            "content": {
                "headings": ["週目", "目標", "教材"],
                "rows": [
                    {"週目": 1, "目標": "讓學生能認識多位小數", "教材": "1-1"},
                    {"週目": 2, "目標": "讓學生能比較小數", "教材": "1-2"},
                    {"週目": 3, "目標": "讓學生學習多位小數的加減及日常應用", "教材": "1-3"},
                    {"週目": 4, "目標": "讓學生了解小數與概數及甚麼是整除", "教材": "1-4, 2-1"},
                    {"週目": 5, "目標": "讓學生知道因數之概念及應用", "教材": "2-2"},
                    {"週目": 6, "目標": "讓學了解公因數及最大公因數是甚麼", "教材": "2-3"}
                ]
            }
        },
        "classroom": {
            "name": "老師最愛的513班",
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

    Sample LLM Output 2:
    output = {
        "reply": '沒問題!我以幫忙將這表個內二、三、五周的內容刪除',
        "widgetId": '12',
        "content": {
            "headings": ["週目", "目標", "教材"],
            "rows": [
                    {"週目": 1, "目標": "讓學生能認識多位小數", "教材": "1-1"},
                    {"週目": 2, "目標": "讓學生了解小數與概數及甚麼是整除", "教材": "1-4, 2-1"},
                    {"週目": 3, "目標": "讓學了解公因數及最大公因數是甚麼", "教材": "2-3"}
            ]
        }
    }

    ###
    #
    In this example, we deleted rows corresponding to "二、三、五周", which are {"週目": 2, "目標": "讓學生能比較小數", "教材": "1-2"}, {"週目": 3, "目標": "讓學生學習多位小數的加減及日常應用", "教材": "1-3"}, and {"週目": 5, "目標": "讓學生知道因數之概念及應用", "教材": "2-2"}.
    # 
    After that, we need to set the "週目" fields in the remaining entries 
    {"週目": 1, "目標": "讓學生能認識多位小數", "教材": "1-1"},
    {"週目": 4, "目標": "讓學生了解小數與概數及甚麼是整除", "教材": "1-4, 2-1"},
    {"週目": 6, "目標": "讓學了解公因數及最大公因數是甚麼", "教材": "2-3"} 
    from 1, 4, 6 to 1, 2, 3
    # 
    So the remaining entries become 
    {"週目": 1, "目標": "讓學生能認識多位小數", "教材": "1-1"},
    {"週目": 2, "目標": "讓學生了解小數與概數及甚麼是整除", "教材": "1-4, 2-1"},
    {"週目": 3, "目標": "讓學了解公因數及最大公因數是甚麼", "教材": "2-3"}


    ###
    Use the fields "subject", "grade" and "publisher" to locate the relevant information in the textbook when performing the retrieval. Fill the "reply" field with the answer to the question and "widgetId" and "content" fields with the "id" and "content" from input's "widget".
    
    ###
    Return a utf-8 formatted response and please return it in a JSON, not string

    ###
    Help me generate an output based on my input below:"""


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
                    {"週目": 5, "目標": "讓學生知道甚麼是因數、公因數和最大公因數", "教材": "3-1"}
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
    We will use this input to generate an output response. The response will be used to update or change the widget content in the frontend. So the output format is of the utmost importance.

    ###
    Explanation of the input fields:
    # "prompt": the user's typed input into the LLM
    # "widget": the data structure storing the widget's all information. The frontend of this app uses these contents to fill in the information required in the widget.
    # "id": unique identifier for the widget
    # "type": the type of the widget represented by a number
    # "content": the data defining the structure of the widget and contains the information to be displayed in the widget
    # "headings": a list containing column names of the widget table to be displayed in the frontend
    # "rows": a list containing the rows of the widget table to be displayed in the frontend
    # "classroom": defines the information of the current classroom
    
    ###
    Sample LLM Input: 

    input = {
        "prompt": "將這個計畫的第一週即第二週合併",
        "widget": {
            "id": "12",
            "type": 1,
            "content": {
                "headings": ["週目", "目標", "教材"],
                "rows": [
                    {"週目": 1, "目標": "讓學生能認識多位小數", "教材": "1-1"},
                    {"週目": 2, "目標": "讓學生能比較小數", "教材": "1-2"},
                    {"週目": 3, "目標": "讓學生學習多位小數的加減及日常應用", "教材": "1-3"},
                    {"週目": 4, "目標": "讓學生了解小數與概數", "教材": "1-4"},
                    {"週目": 5, "目標": "讓學生了解甚麼是整除", "教材": "2-1"},
                    {"週目": 6, "目標": "讓學生知道因數、公因數及最大公因數之概念及應用", "教材": "2-2, 2-3"}               ]
            }
        },
        "classroom": {
            "name": "討厭的307班",
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
        "reply": '好的，已幫你將這個計畫的第一週即第二週合併',
        "widgetId": '12',
        "content": {
            "headings": ["週目", "目標", "教材"],
            "rows": [
                    {"週目": 1, "目標": "讓學生能認識多位小數及比較小數", "教材": "1-1, 1-2"},
                    {"週目": 2, "目標": "讓學生學習多位小數的加減及日常應用", "教材": "1-3"},
                    {"週目": 3, "目標": "讓學生了解小數與概數", "教材": "1-4"},
                    {"週目": 4, "目標": "讓學生了解甚麼是整除", "教材": "2-1"},
                    {"週目": 5, "目標": "讓學生知道因數、公因數及最大公因數之概念及應用", "教材": "2-2, 2-3"}
            ]
        }
    }
    
    ###
    In this sample input/output, we did the following operations:
    # 
    Deleted entry {"週目": 2, "目標": "讓學生能比較小數", "教材": "1-2"} since we want to "將這個計畫的第一週即第二週合併"
    #
    Combine contents from the deleted entry {"週目": 2, "目標": "讓學生能比較小數", "教材": "1-2"} to the entry relevant to "第一周", which was originally {"週目": 1, "目標": "讓學生能認識多位小數", "教材": "1-1"} and become {"週目": 1, "目標": "讓學生能認識多位小數及比較小數", "教材": "1-1, 1-2"}
    # 
    Decrement "週目" by 1 in entries 
    {"週目": 3, "目標": "讓學生學習多位小數的加減及日常應用", "教材": "1-3"},
    {"週目": 4, "目標": "讓學生了解小數與概數", "教材": "1-4"},
    {"週目": 5, "目標": "讓學生了解甚麼是整除", "教材": "2-1"},
    {"週目": 6, "目標": "讓學生知道因數、公因數及最大公因數之概念及應用", "教材": "2-2, 2-3"}
    because we deleted the entry {"週目": 2, "目標": "讓學生能比較小數", "教材": "1-2"}. 
    Now, they become:
    {"週目": 2, "目標": "讓學生學習多位小數的加減及日常應用", "教材": "1-3"},
    {"週目": 3, "目標": "讓學生了解小數與概數", "教材": "1-4"},
    {"週目": 4, "目標": "讓學生了解甚麼是整除", "教材": "2-1"},
    {"週目": 5, "目標": "讓學生知道因數、公因數及最大公因數之概念及應用", "教材": "2-2, 2-3"}

    ###
    Use the fields "subject", "grade" and "publisher" to locate the relevant information in the textbook when performing the retrieval. Fill the "reply" field with the answer to the question and "widgetId" and "content" fields with the "id" and "content" from input's "widget".
    
    ###
    Return a utf-8 formatted response and please return it in a JSON, not string

    ###
    Help me generate an output based on my input below:

    input = {
        "prompt": "把這個計畫的第三週到第五周進度全部合併起來",
        "widget": {
            "id": "12",
            "type": 1,
            "content": {
                "headings": ["週目", "目標", "教材"],
                "rows": [
                    {"週目": 1, "目標": "讓學生能認識多位小數", "教材": "1-1"},
                    {"週目": 2, "目標": "讓學生能比較小數", "教材": "1-2"},
                    {"週目": 3, "目標": "讓學生學習多位小數的加減及日常應用", "教材": "1-3"},
                    {"週目": 4, "目標": "讓學生了解小數與概數", "教材": "1-4"},
                    {"週目": 5, "目標": "讓學生了解甚麼是整除", "教材": "2-1"},
                    {"週目": 6, "目標": "讓學生知道因數、公因數及最大公因數之概念及應用", "教材": "2-2, 2-3"},
                    {"週目": 7, "目標": "讓學生熟悉倍數是甚麼", "教材": "3-1"}
                ]
            }
        },
        "classroom": {
            "name": "有素養的511班",
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

"""

"""

"""
