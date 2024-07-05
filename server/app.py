from flask import Flask, request
from flask_cors import CORS
from watsonx import getWatsonxResponse
from databaseUserActions import getUser, createUser, loginUser, updateUser, createClassroom, createLecture, updateLecture, createWidget, updateWidget, getWatsonxRequest, updateClassroom, deleteLecture, deleteWidget, updateWidgetBulk
from handle_input import create_prompt, llm_handle_input

app = Flask(__name__)
CORS(app)

######################################################################################################## debug
@app.route('/hello', methods=['GET'])
def get_output():
    return { 'output' : 'hello guys!'}

######################################################################################################## watsonx
@app.route('/message-rita', methods=['POST'])
def message_rita():
    prompt = request.json['prompt']
    widget = request.json['widget']
    lectureId = request.json['lectureId']
    classroomId = request.json['classroomId']
    watsonxRequest = getWatsonxRequest(prompt, widget, lectureId, classroomId)
    # check if output is correct
    if watsonxRequest['status'] == 'error':
        return watsonxRequest
    
    try:
        llmOutput = llm_handle_input(watsonxRequest['data']) # returns rita's reply asdict
    except Exception as e:
        response = { 
            'status' : 'error',
            'data' : str(e)
        }
        return response

    # return watsonxResponse
    response = {
        'status' : 'success',
        'data' : llmOutput
    }
    return response
    
######################################################################################################## users
@app.route('/create-user', methods=['POST'])
def create_user():
    try:
        username = request.json['username']
        password = request.json['password']
        school = request.json.get('school', None)
        alias = request.json.get('alias', None)
        occupation = request.json.get('occupation', None)
        schedule = request.json.get('schedule', None)
        return createUser(username, password, school, alias, occupation, schedule)
    except Exception as e:
        response = { 
            'status' : 'error',
            'data' : 'Missing ' + str(e)
        }
        return response

@app.route('/update-user', methods=['POST'])
def update_user():
    try:
        sessionId = request.json['sessionId']
        alias = request.json.get('alias', None)
        school = request.json.get('school', None)
        occupation = request.json.get('occupation', None)
        schedule = request.json.get('schedule', None)
        return updateUser(sessionId, alias, school, occupation, schedule)
    except Exception as e:
        response = { 
            'status' : 'error',
            'data' : 'Missing ' + str(e)
        }
        return response

@app.route('/login', methods=['POST'])
def login():
    try:
        username = request.json['username']
        password = request.json['password']
        return loginUser(username, password)
    except Exception as e:
        response = { 
            'status' : 'error',
            'data' : 'Missing ' + str(e)
        }
        return response

@app.route('/create-classroom', methods=['POST'])
def create_classroom():
    try:
        sessionId = request.json['sessionId']
        classroomId = request.json['classroomId']
        classroomName = request.json.get('classroomName', None)
        subject = request.json.get('subject', None)
        publisher = request.json.get('publisher', None)
        grade = request.json.get('grade', None)
        plan = request.json.get('plan', None)
        credit = request.json.get('credits', None)
        return createClassroom(sessionId, classroomId, classroomName, subject, publisher, grade, plan, credit)
    except Exception as e:
        response = { 
            'status' : 'error',
            'data' : 'Missing ' + str(e)
        }
        return response

@app.route('/update-classroom', methods=['POST'])
def update_classroom():
    try:
        sessionId = request.json['sessionId']
        classroomId = request.json['classroomId']
        classroomName = request.json.get('classroomName', None)
        subject = request.json.get('subject', None)
        publisher = request.json.get('subject', None)
        grade = request.json.get('grade', None)
        plan = request.json.get('plan', None)
        credit = request.json.get('credits', None)
        return updateClassroom(sessionId, classroomId, classroomName, subject, publisher, grade, plan, credit)
    except Exception as e:
        response = { 
            'status' : 'error',
            'data' : 'Missing ' + str(e)
        }
        return response

@app.route('/create-lecture', methods=['POST'])
def create_lecture():
    try:
        sessionId = request.json['sessionId']
        classroomId = request.json['classroomId']
        lectureId = request.json['lectureId']
        name = request.json['name']
        type = request.json['type']
        return createLecture(sessionId, classroomId, lectureId, name, type)
    except Exception as e:
        response = { 
            'status' : 'error',
            'data' : 'Missing ' + str(e)
        }
        return response

@app.route('/update-lecture', methods=['POST'])
def update_lecture():
    try:
        sessionId = request.json['sessionId']
        lectureId = request.json['lectureId']
        name = request.json.get('name', None)
        type = request.json.get('type', None)
        return updateLecture(sessionId, lectureId, name, type)
    except Exception as e:
        response = { 
            'status' : 'error',
            'data' : 'Missing ' + str(e)
        }
        return response

@app.route('/delete-lecture', methods=['DELETE'])
def delete_lecture():
    try:
        sessionId = request.json['sessionId']
        classroomId = request.json['classroomId']
        lectureId = request.json['lectureId']
        return deleteLecture(sessionId, classroomId, lectureId)
    except Exception as e:
        response = { 
            'status' : 'error',
            'data' : 'Missing ' + str(e)
        }
        return response

@app.route('/create-widget', methods=['POST'])
def create_widget():
    try:
        sessionId = request.json['sessionId']
        lectureId = request.json['lectureId']
        widgetId = request.json['widgetId']
        type = request.json['type']
        content = request.json['content']
        return createWidget(sessionId, lectureId, widgetId, type, content)
    except Exception as e:
        response = { 
            'status' : 'error',
            'data' : 'Missing ' + str(e)
        }
        return response

@app.route('/update-widget', methods=['POST'])
def update_widget():
    try:
        sessionId = request.json['sessionId']
        widgetId = request.json['widgetId']
        content = request.json['content']
        return updateWidget(sessionId, widgetId, content)
    except Exception as e:
        response = { 
            'status' : 'error',
            'data' : 'Missing ' + str(e)
        }
        return response

@app.route('/update-widget-bulk', methods=['POST'])
def update_widget_bulk():
    try:
        sessionId = request.json['sessionId']
        widgetIds = request.json['widgetIds']
        contents = request.json['contents']
        return updateWidgetBulk(sessionId, widgetIds, contents)
    except Exception as e:
        response = { 
            'status' : 'error',
            'data' : 'Missing ' + str(e)
        }
        return response

@app.route('/delete-widget', methods=['DELETE'])
def delete_widget():
    try:
        sessionId = request.json['sessionId']
        lectureId = request.json['lectureId']
        widgetId = request.json['widgetId']
        return deleteWidget(sessionId, lectureId, widgetId)
    except Exception as e:
        response = { 
            'status' : 'error',
            'data' : 'Missing ' + str(e)
        }
        return response

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