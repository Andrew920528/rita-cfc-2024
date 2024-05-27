import json
from flask import Flask, jsonify, request

from ibm_watsonx_ai.foundation_models.utils.enums import ModelTypes
import json

print( json.dumps( ModelTypes._member_names_, indent=2 ) )

from ibm_watsonx_ai import APIClient
from ibm_watsonx_ai import Credentials

credentials = Credentials(
                   url = "https://us-south.ml.cloud.ibm.com",
                   api_key = "ly56_0ykPds79Fd4TlYPgNL1Ya_HuqyZxKe5wsPEb2Yl"
                  )

client = APIClient(credentials)
print(client)
app = Flask(__name__)

test_output = [
    { 'output' : 'hello guys!'}
]

@app.route('/api/me', methods=['GET'])
def get_output():
    return jsonify(test_output)

# @app.route('/api/ibm', methods=['GET'])
# def get_client():
#     return jsonify(client)

if __name__ == '__main__':
    app.run(port=5000)