import queue
import sys
from typing import Any, Dict, List, Union

from langchain.callbacks.streaming_stdout import StreamingStdOutCallbackHandler
from langchain.schema import LLMResult

from utils.util import split_chunk

STOP_ITEM = "[END]"
"""
This is a special item that is used to signal the end of the stream.
"""


class StreamingStdOutCallbackHandlerYield(StreamingStdOutCallbackHandler):
    """
    This is a callback handler that yields the tokens as they are generated.
    For a usage example, see the :func:`generate` function below.
    """

    q: queue.Queue
    buffer: str = ""
    """
    The queue to write the tokens to as they are generated.
    """

    def __init__(self, q: queue.Queue) -> None:
        """
        Initialize the callback handler.
        q: The queue to write the tokens to as they are generated.
        """
        super().__init__()
        self.q = q
        self.buffer = ""

    def on_llm_start(
        self, serialized: Dict[str, Any], prompts: List[str], **kwargs: Any
    ) -> None:
        """Run when LLM starts running."""
        with self.q.mutex:
            self.q.queue.clear()
            self.buffer = ""

    def on_llm_new_token(self, token: str, **kwargs: Any) -> None:
        """Run on new LLM token. Only available when streaming is enabled."""
        # Writes to stdout
        # sys.stdout.write(token + " || ")
        # sys.stdout.flush()
        
        # define token as a "word" separated by spaces
        
        self.buffer += token
        wordList = split_chunk(self.buffer, 10)
        print(f"wordlist: {wordList}")
        if len(wordList) > 1:
            for i in range(len(wordList)-1):
                self.q.put(wordList[i]) # Pass the token to the generator
            self.buffer = wordList[-1]
        
        

    def on_llm_end(self, response: LLMResult, **kwargs: Any) -> None:
        """Run when LLM ends running."""
        self.q.put(self.buffer)
        self.q.put(STOP_ITEM)

    def on_llm_error(
        self, error: Union[Exception, KeyboardInterrupt], **kwargs: Any
    ) -> None:
        """Run when LLM errors."""
        self.q.put("%s: %s" % (type(error).__name__, str(error)))
        self.q.put(STOP_ITEM)


def generate(rq: queue.Queue):
    """
    This is a generator that yields the items in the queue until it reaches the stop item.

    Usage example:
    ```
    def askQuestion(callback_fn: StreamingStdOutCallbackHandlerYield):
        llm = OpenAI(streaming=True, callbacks=[callback_fn])
        return llm(prompt="Write a poem about a tree.")

    @app.route("/", methods=["GET"])
    def generate_output():
        q = Queue()
        callback_fn = StreamingStdOutCallbackHandlerYield(q)
        threading.Thread(target=askQuestion, args=(callback_fn,)).start()
        return Response(generate(q), mimetype="text/event-stream")
    ```
    """
    while True:
        result: str = rq.get()
        if result == STOP_ITEM or result is None:
            break
        yield result