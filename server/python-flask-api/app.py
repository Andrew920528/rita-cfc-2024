import json
from flask import Flask, jsonify, request
app = Flask(__name__)

test_output = [
    { 'output' : 'hello guys!'}
]

# nextEmployeeId = 4

@app.route('/api/me', methods=['GET'])
def get_output():
    return jsonify(test_output)

if __name__ == '__main__':
    app.run(port=5000)  