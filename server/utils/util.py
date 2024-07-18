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
    
    
