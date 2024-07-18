import queue
from typing import Any, Dict, List, Union

from langchain.callbacks.streaming_stdout import StreamingStdOutCallbackHandler
from langchain.schema import LLMResult

import re

""" This file contains utility functions to stream output from the llm.

Example usage:
    # define a queue reference to the stream
    stream = queue.Queue()
    
    # invoke the llm to output a stream iterator object
    rita_reply = retrieval_chain.stream({
            "context": [],
            "chat_history": [],
            "input": user_prompt
        })
    
    # asyncronously formats and puts chunks into the queue
    threading.Thread(target=stream_buffer, args=(stream,rita_reply)).start()
    
    # the response is streamed as the async thread puts chunks into the queue
    response = Response(yield_stream(stream), content_type='text/plain')
"""

def stream_buffer(out_stream: queue.Queue, in_stream):
    """format the irredular chunks sent by the llm into tokens defined by the split_chunk function

    Args:
        out_stream (Queue): contains a list of tokens
        in_stream (Iterator): streamed output of a llm
    """
    buffer = ""
    for chunk in in_stream:
        if "answer" not in chunk:
            continue
        buffer += chunk["answer"]
        wordList = split_chunk(buffer, 10)
        if len(wordList) > 1:
            for i in range(len(wordList)-1):
                print(wordList[i] + "|")
                out_stream.put(wordList[i]) # Pass the token to the generator
            buffer = wordList[-1]

def split_chunk(text: str, max_length : int):
    """Splits a string by space, (most) chinese characters, and break up strings longer than max_length

    Args:
        text (str): text to split
        max_length (int): max length a single chunk can be

    Returns:
        list
    """
    # split by space and (most) chinese characters
    pattern =  r"(?<=[\s\u4e00-\u9fff])"
    chunks = re.split(pattern, text)
    
    final_chunks = []
    for segment in chunks:
        if len(segment) > max_length:
            # Split the segment into chunks of max_length
            final_chunks.extend([segment[i:i + max_length] for i in range(0, len(segment), max_length)])
        else:
            final_chunks.append(segment)
    
    return final_chunks

def yield_stream(rq: queue.Queue):
    """yields the stream from the queue until it is emptied

    Args:
        rq (queue.Queue): the output stream

    Yields:
        str: chunks of the stream
    """
    STOP_ITEM = "[END]"
    while True:
        result: str = rq.get()
        if result == STOP_ITEM or result is None:
            break
        yield result