from flask import Flask, jsonify, request
import json
import requests
import time
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

test_output = [
    { 'output' : 'hello guys!'}
]

@app.route('/hello', methods=['GET'])
def get_output():
    return jsonify(test_output)

API_KEY = ''
with open('watson_key.json') as f:
    js = json.load(f)
    API_KEY = js['WATSON_API_KEY']

IBM_ACCESS_TOKEN = None
TOKEN_EXPIRATION = None

def get_access_token():
    global IBM_ACCESS_TOKEN, TOKEN_EXPIRATION
    url = "https://iam.cloud.ibm.com/identity/token"
    headers = {
        "Content-Type": "application/x-www-form-urlencoded",
        "Accept": "application/json"
    }
    data = {
        "grant_type": "urn:ibm:params:oauth:grant-type:apikey",
        "apikey": API_KEY
    }
    response = requests.post(url, headers=headers, data=data)
    response_json = response.json()
    IBM_ACCESS_TOKEN = response_json['access_token']
    TOKEN_EXPIRATION = time.time() + response_json['expires_in'] - 60  # Refresh 1 minute before expiration

def get_valid_token():
    if IBM_ACCESS_TOKEN is None or time.time() > TOKEN_EXPIRATION:
        get_access_token()
    return IBM_ACCESS_TOKEN

@app.route('/generate-proposal', methods=['POST'])
def generate_proposal():
    try:
        input_data = request.json
        if not input_data or "input_text" not in input_data:
            return jsonify({"error": "Invalid input, 'input_text' is required"}), 400

        url = "https://us-south.ml.cloud.ibm.com/ml/v1/text/generation?version=2023-05-29"

        body = {
            "input": input_data.get("input_text"),
            "parameters": {
                "decoding_method": "greedy",
                "max_new_tokens": 900,
                "repetition_penalty": 1
            },
            "model_id": "meta-llama/llama-3-70b-instruct",
            "project_id": "b3089672-982a-4cff-ba0b-798a7ce6f018"
        }

        headers = {
            "Accept": "application/json",
            "Content-Type": "application/json",
            "Authorization": f"Bearer {get_valid_token()}"
        }

        response = requests.post(url, headers=headers, json=body)

        if response.status_code != 200:
            return jsonify({"error": "Non-200 response", "details": response.text}), response.status_code

        data = response.json()
        return jsonify(data)

    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(port=5000)