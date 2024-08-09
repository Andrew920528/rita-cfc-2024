from datetime import datetime
import logging
import time
from langchain.schema import AIMessage, HumanMessage
from config.llm_param import MEMORY_CUTOFF
# Set up a module-specific logger
logger = logging.getLogger(__name__)


def format_chat_history(messages):
    chat_history = []
    cutoff = MEMORY_CUTOFF
    for message in messages[-cutoff:]:
        if message["sender"] == "user":
            chat_history.append(HumanMessage(content=message["text"]))
        elif message["sender"] == "ai":
            chat_history.append(AIMessage(content=message["text"]))

    return chat_history
