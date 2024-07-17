from datetime import datetime
import logging
import time
import json
import re
# Set up a module-specific logger
logger = logging.getLogger(__name__)
def logTime(start_time, description):
    latency = time.time() - start_time
    now_formatted = datetime.fromtimestamp(time.time()).strftime('%H:%M:%S.%f')[:-3]
    latency_formatted = datetime.fromtimestamp(latency).strftime('%S.%f')[:-3]
    logger.info(f"Time = {now_formatted}, time passed = {latency_formatted} | {description}")
    
    
def split_chunk(text, max_length):
    """Splits a string by space, (most) chinese characters, and break up strings longer than max_length

    Args:
        text (_str_): text to split
        max_length (_int_): max length a single chunk can be

    Returns:
        _list_
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