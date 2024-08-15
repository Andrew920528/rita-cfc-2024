import os
import json
import time
from datetime import datetime


def check_on(func):
    def wrapper(self, *args, **kwargs):
        if self.on:
            return func(self, *args, **kwargs)
        else:
            return None
    return wrapper


def apply_check_on(cls):
    for attr_name, attr_value in cls.__dict__.items():
        if callable(attr_value) and not attr_name.startswith("__"):
            setattr(cls, attr_name, check_on(attr_value))
    return cls


@apply_check_on
class LlmTester:
    def __init__(self, name: str, on: bool):
        self.name = name
        self.on = on
        self.start_time = time.time()

    def return_if_not_on(self):
        if not self.on:
            return

    def log_start_timer(self, msg: str):
        self.start_time = time.time()
        now_formatted = datetime.fromtimestamp(
            self.start_time).strftime('%H:%M:%S.%f')[:-3]
        print(f"{self.name} | {now_formatted} |  {msg}")

    def log_latency(self,  message):
        latency = time.time() - self.start_time
        now_formatted = datetime.fromtimestamp(
            time.time()).strftime('%H:%M:%S.%f')[:-3]
        latency_formatted = datetime.fromtimestamp(
            latency).strftime('%M:%S.%f')[:-3]
        print(
            f"{self.name} | {now_formatted} | Time passed = {latency_formatted} | {message}")

    def log(self,  message):
        start_time = time.time()
        now_formatted = datetime.fromtimestamp(
            start_time).strftime('%H:%M:%S.%f')[:-3]
        print(f"{self.name} | {now_formatted} |  {message}")

    def get_example_data(self, file_name):
        current_dir = os.path.dirname(os.path.abspath(__file__))
        file_path = os.path.join(current_dir, "..", "..", "ai",
                                 "agents", "data_examples", f"{file_name}.json")
        # Open the file and load its content as a Python object
        with open(file_path, 'r') as file:
            watsonxRequest = json.load(file)
        return watsonxRequest

    def save_example_data(self,  watsonxRequest=None, file_name=None):
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
        return func(*args, **kwargs)
