from flask import Flask, request
from flask_cors import CORS
from watsonx import getWatsonxResponse
from databaseUserActions import getUser, createUser, loginUser, updateUser, createClassroom, createLecture, createWidget, updateWidget, getWatsonxRequest

app = Flask(__name__)
CORS(app)

######################################################################################################## debug
@app.route('/hello', methods=['GET'])
def get_output():
    return { 'output' : 'hello guys!'}

######################################################################################################## watsonx
@app.route('/message-rita', methods=['PUT'])
def message_rita():
    prompt = request.json['prompt']
    widget = request.json['widget']
    lectureId = request.json['lectureId']
    classroomId = request.json['classroomId']
    watsonxRequest = getWatsonxRequest(prompt, widget, lectureId, classroomId)

    # call API to Watsonx with watsonxRequest
    watsonxResponse = {
        'Status' : 'success',
        'Response' : ''
    }
    # return watsonxResponse
    return watsonxRequest
    
######################################################################################################## users
@app.route('/create-user', methods=['PUT'])
def create_user():
    username = request.form['username']
    password = request.form['password']
    school = request.form.get('school', None)
    alias = request.form.get('alias', None)
    occupation = request.form.get('occupation', None)
    schedule_content = request.form.get('schedule_content', None)
    return createUser(username, password, school, alias, occupation, schedule_content)

@app.route('/update-user', methods=['PUT'])
def update_user():
    username = request.form['username']
    alias = request.form['alias']
    school = request.form['school']
    occupation = request.form['occupation']
    return updateUser(username, alias, school, occupation)

@app.route('/login', methods=['PUT'])
def login():
    username = request.form['username']
    password = request.form['password']
    return loginUser(username, password)

@app.route('/create-classroom', methods=['PUT'])
def create_classroom():
    userId = request.form['userId']
    classroomId = request.form['classroomId']
    classroomName = request.form['classroomName']
    subject = request.form['subject']
    publisher = request.form['publisher']
    return createClassroom(userId, classroomId, classroomName, subject, publisher)

@app.route('/create-lecture', methods=['PUT'])
def create_lecture():
    classroomId = request.form['classroomId']
    lectureId = request.form['lectureId']
    name = request.form['name']
    type = request.form['type']
    return createLecture(classroomId, lectureId, name, type)

@app.route('/create-widget', methods=['PUT'])
def create_widget():
    lectureId = request.form['lectureId']
    widgetId = request.form['widgetId']
    type = request.form['type']
    content = request.form['content']
    return createWidget(lectureId, widgetId, type, content)

@app.route('/update-widget', methods=['PUT'])
def update_weight():
    widgetId = request.form['widgetId']
    content = request.form['content']
    return updateWidget(widgetId, content)


# @app.route('/get-user', methods=['GET'])
# def get_user():
#     username = request.args['username']
#     password = request.args['password']
#     return getUser(username, password)

# @app.route('/modify-user', methods=['POST'])
# def modify_user():
#     username = request.form['username']
#     password = request.form['password']
#     updatedUsername = request.form['updatedUsername']
#     updatedPassword = request.form['updatedPassword']
#     return modifyUser(username, password, updatedUsername, updatedPassword)

# @app.route('/delete-user', methods=['DELETE'])
# def delete_user():
#     username = request.form['username']
#     password = request.form['password']
#     return deleteUser(username, password)


if __name__ == '__main__':
    app.run(port=5000)