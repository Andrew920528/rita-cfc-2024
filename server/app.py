from flask import Flask, request
from flask_cors import CORS
from watsonx import getWatsonxResponse
from databaseUserActions import getUser, createUser, modifyUser, deleteUser, loginUser

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

######################################################################################################## users
@app.route('/get-user', methods=['GET'])
def get_user():
    username = request.args['username']
    password = request.args['password']
    return getUser(username, password)

@app.route('/create-user', methods=['POST'])
def create_user():
    username = request.form['username']
    password = request.form['password']
    school = request.form.get('school', None)
    alias = request.form.get('alias', None)
    occupation = request.form.get('occupation', None)
    schedule_content = request.form.get('schedule_content', None)
    return createUser(username, password, school, alias, occupation, schedule_content)

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

@app.route('/login', methods=['GET'])
def login():
    username = request.args['username']
    password = request.args['password']
    return loginUser(username, password)


if __name__ == '__main__':
    app.run(port=5000)