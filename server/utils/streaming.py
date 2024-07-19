import queue
from typing import Any, Dict, List, Union

from langchain.callbacks.streaming_stdout import StreamingStdOutCallbackHandler
from langchain.schema import LLMResult

import re

""" StreamHander is a utility class that helps to stream output from the llm.

Example usage:
    # define a stream handler object
    stream_handler = StreamHandler(queue.Queue())
    
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
class StreamHandler:
    END_TOKEN = "[END]"
    def __init__(self, stream: queue.Queue):
        self.out_stream = stream

    def output_buffer(self, in_stream):
        """format the irredular chunks sent by the llm into tokens defined by the split_chunk function

        Args:
            in_stream (Iterator): streamed output of a llm
        """
        buffer = ""
        for chunk in in_stream:
            if "answer" not in chunk:
                continue
            buffer += chunk["answer"]
            wordList = self.split_chunk(buffer, 10)
            if len(wordList) > 1:
                for i in range(len(wordList)-1):
                    self.out_stream.put(wordList[i]) # Pass the token to the generator
                buffer = wordList[-1]
        self.out_stream.put(buffer)
        self.out_stream.put(StreamHandler.END_TOKEN)

    
    def yield_stream(self):
        """yields the stream from the queue until it is emptied

        Yields:
            str: chunks of the stream
        """
        while True:
            
            result: str = self.out_stream.get()
            if result is None or result == StreamHandler.END_TOKEN:
                break
            yield result
            
    
    @staticmethod
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
