from flask import Flask, jsonify, request
from flask_cors import CORS


app = Flask(__name__)
CORS(app)

test_output = [
    { 'output' : 'hello guys!'}
]

@app.route('/hello', methods=['GET'])
def get_output():
    return jsonify(test_output)

if __name__ == '__main__':
    app.run(port=5000)