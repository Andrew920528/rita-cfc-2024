from datetime import datetime
import logging
import time

# Set up a module-specific logger
logger = logging.getLogger(__name__)
def logTime(start_time, description):
    latency = time.time() - start_time
    now_formatted = datetime.fromtimestamp(time.time()).strftime('%H:%M:%S.%f')[:-3]
    latency_formatted = datetime.fromtimestamp(latency).strftime('%S.%f')[:-3]
    logger.info(f"Time = {now_formatted}, time passed = {latency_formatted} | {description}")
    
    
def extract_json_as_dict(full_string):
    # Find the starting and ending points of the JSON portion
    start_index = full_string.find('{')
    end_index = full_string.rfind('}') + 1

    # Extract the JSON string
    json_string = full_string[start_index:end_index]

    # Convert the JSON string to a dictionary
    json_dict = json.loads(json_string)

    return json_dict