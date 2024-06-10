from flask import Flask, request
from flask_cors import CORS
from watsonx import getWatsonxResponse
from databaseActions import getUser, createUser, modifyUser, deleteUser

app = Flask(__name__)
CORS(app)

######################################################################################################## debug
@app.route('/hello', methods=['GET'])
def get_output():
    return { 'output' : 'hello guys!'}

######################################################################################################## watsonx
@app.route('/generate-proposal', methods=['POST'])
def generate_proposal():
    return getWatsonxResponse()

######################################################################################################## aws rds
@app.route('/get-user', methods=['GET'])
def get_user():
    username = request.args['username']
    password = request.args['password']
    return getUser(username, password)

@app.route('/create-user', methods=['POST'])
def create_user():
    username = request.form['username']
    password = request.form['password']
    return createUser(username, password)

@app.route('/modify-user', methods=['POST'])
def modify_user():
    username = request.form['username']
    password = request.form['password']
    updatedUsername = request.form['updatedUsername']
    updatedPassword = request.form['updatedPassword']
    return modifyUser(username, password, updatedUsername, updatedPassword)

@app.route('/delete-user', methods=['DELETE'])
def delete_user():
    username = request.form['username']
    password = request.form['password']
    return deleteUser(username, password)


if __name__ == '__main__':
    app.run(port=5000)