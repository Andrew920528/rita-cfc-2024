from langchain.prompts import ChatPromptTemplate
from enum import Enum


class Intents():
    ASK = "Ask"
    MODIFY = "Modify"
    NONE = "None"

    @classmethod
    def values(cls):
        return list(vars(cls).values())


class WidgetTypes():  # only includes the widgets that can be modified
    # FALLTHROUGH = -1
    SEMESTER_GOAL = 0
    SEMESTER_PLAN = 1
    NOTE = 2
    WORKSHEET = 4
    # SCHEDULE = 3

    @classmethod
    def values(cls):
        return list(vars(cls).values())

    @classmethod
    def getPrompt(cls, type):
        if type == WidgetTypes.SEMESTER_GOAL:

            return "List of goals students should achieve."

        elif type == WidgetTypes.SEMESTER_PLAN:

            return "The schedule of the entire semester."

        elif type == WidgetTypes.NOTE:
            return "Teacher's schedule of the week."
        elif type == WidgetTypes.WORKSHEET:
            return "A worksheet for students."
        else:
            return ""
