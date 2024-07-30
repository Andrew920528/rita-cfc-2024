from server.utils.widget_prompts.WidgetPromptSelector import WidgetPromptSelector
from langchain.schema.output_parser import StrOutputParser

widget_prompts = WidgetPromptSelector()


class TestFunctions:
    def __init__(self, llm):
        self.llm = llm

    # Two testing functions for displaying whether LLM classifies the input as "modify" or "non-modify"
    def semester_plan_modify(self, widget_type, x):
        print(f"Semester Plan Modify's x: {x}")
        print(x)
        return widget_prompts.getWidgetPrompt(widget_type, can_classified=True, to_modify=True) | self.llm | StrOutputParser()

    def semester_plan_non_modify(self, widget_type, x):
        print(f"Semester Plan Non-Modify's x: {x}")
        print(x)
        return widget_prompts.getWidgetPrompt(widget_type, can_classified=True, to_modify=False) | self.llm | StrOutputParser()
