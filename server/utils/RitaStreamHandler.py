import queue
from typing import Any, Dict, List, Union

from langchain.callbacks.streaming_stdout import StreamingStdOutCallbackHandler
from langchain.schema import LLMResult
from flask_sse import sse
import re
import json
""" RitaStreamHandler is a custom parser that formats the output of an LLM.

Example usage:
    # define a stream handler object
    stream_handler = StreamHandler()
    
    # invoke the llm to output a stream iterator object
    rita_reply = retrieval_chain.stream({
            "context": [],
            "chat_history": [],
            "input": user_prompt
        })
    
    # asyncronously formats and puts chunks into the queue
    threading.Thread(target=stream_handler.output_buffer, args=(rita_reply,)).start()
    
    # the response is streamed as the async thread puts chunks into the queue
    response = Response(stream_handler.yield_stream(), content_type='text/plain')
"""


def stream_json(agent, data):
    obj = {
        "agent": agent,
        "data": data
    }
    return json.dumps(obj)


class RitaStreamHandler:
    END_TOKEN = "[END]"

    def __init__(self, out_stream):
        self.out_stream = out_stream

    def end_stream(self):
        self.out_stream.put(RitaStreamHandler.END_TOKEN)

    def add_to_stream(self, agent: str, data: str, ):
        self.out_stream.put(stream_json(agent, data))

    def yield_stream(self):
        """yields the stream from the queue until it is emptied

        Yields:
            str: chunks of the stream
        """
        delimiter = "|T|"
        while True:
            result: str = self.out_stream.get()
            if result is None or result == RitaStreamHandler.END_TOKEN:
                break
            yield result + delimiter
