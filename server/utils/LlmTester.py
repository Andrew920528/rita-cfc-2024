import os
import json
import time
from datetime import datetime


class LlmTester:
    def __init__(self, name: str, on: bool):
        self.name = name
        self.on = on
        self.start_time = time.time()

    def log_start_timer(self, msg: str):
        if not self.on:
            return
        self.start_time = time.time()
        now_formatted = datetime.fromtimestamp(
            self.start_time).strftime('%H:%M:%S.%f')[:-3]
        print(f"{self.name} | {now_formatted} |  {msg}")

    def log_time(self,  message):
        if not self.on:
            return
        latency = time.time() - self.start_time
        now_formatted = datetime.fromtimestamp(
            time.time()).strftime('%H:%M:%S.%f')[:-3]
        latency_formatted = datetime.fromtimestamp(
            latency).strftime('%S.%f')[:-3]
        print(
            f"{self.name} | {now_formatted} | Time passed = {latency_formatted} | {message}")

    def get_example_data(self, file_name):
        if not self.on:
            return
        current_dir = os.path.dirname(os.path.abspath(__file__))
        file_path = os.path.join(current_dir, "..", "..", "ai",
                                 "agents", "data_examples", f"{file_name}.json")
        # Open the file and load its content as a Python object
        with open(file_path, 'r') as file:
            watsonxRequest = json.load(file)
        return watsonxRequest

    def save_example_data(self,  watsonxRequest, file_name=None):
        if not self.on:
            return
        if not watsonxRequest:
            return
        if not file_name:
            file_name = datetime.fromtimestamp(
                time.time()).strftime('%H:%M:%S.%f')[:-3]
        current_dir = os.path.dirname(os.path.abspath(__file__))
        path = os.path.join(current_dir, "..", "..", "ai", "agents",
                            "data_examples", f"{file_name}.json")
        with open(path, 'w') as f:
            json.dump(watsonxRequest, f, ensure_ascii=False)

    def execute(self, func, *args, **kwargs):
        if not self.on:
            return None
        return func(*args, **kwargs)
