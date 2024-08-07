from flask import Flask, request
from flask_cors import CORS

from utils.word_docs import convert_to_pdf, send_docx, docxToPdfFunction, createBlankDocx, sendDocument
from utils.LlmTester import LlmTester
from actions.databaseUserActions import getUser, createUser, loginUser, updateUser, createClassroom, createLecture, updateLecture, createWidget, updateWidget, getLectureAndClassroom, updateClassroom, deleteLecture, deleteWidget, updateWidgetBulk, loginSessionId, updateChatroom
from actions.ritaActions import initLLM, llm_stream_response, initRetriever, translateText
import time
import logging
from datetime import datetime
import json
import os
app = Flask(__name__)
CORS(app)
logging.basicConfig(level=logging.INFO)

RETRIEVER = ''
LLM = ''


def initialize():
    global RETRIEVER, LLM
    RETRIEVER = initRetriever()
    LLM = initLLM()


@app.route('/hello', methods=['GET'])
def get_output():
    return {'output': 'hello guys!'}


@app.route('/send-word-doc', methods=['GET'])
def get_file():
    try:
        file = send_docx()
        return file
    except Exception as e:
        response = {
            'status': 'error',
            'data': str(e)
        }
    return response


@app.route('/test-get-pdf', methods=['GET'])
def get_pdf():
    return convert_to_pdf()


@app.route('/message-rita', methods=['POST'])
def message_rita():
    global RETRIEVER, LLM
    if RETRIEVER == "" or LLM == "":
        response = {
            'status': 'error',
            'data': "LLM or retriever is not initialized"
        }
        return response

    prompt = request.json['prompt']

    ##########################  Test Controllers ##############################
    # Enable if want to test without db, run frontend in indep mode and commented out the dummy api call
    DB_INDEPENDENT = False  # Should be False on production.
    # Will only save example if DB_INDEPENDENT is False
    SAVE_EXAMPLE = False  # Should be False on production.
    # Will only load example if DB_INDEPENDENT is True
    LOAD_EXAMPLE = True  # Should be False on production.

    fetch_db_tester = LlmTester(
        name="use db to gather context info", on=not DB_INDEPENDENT)

    def organize_context():
        widget = request.json['widget']
        chat_history = request.json['chatHistory']
        lectureId = request.json['lectureId']
        classroomId = request.json['classroomId']

        lectureAndClassroomResponse = getLectureAndClassroom(
            lectureId, classroomId)
        fetch_db_tester.log_latency(
            "Fetched classroom and lecture from the database")
        # check if lecture and classroom are fetched properly
        if lectureAndClassroomResponse['status'] == 'error':
            return lectureAndClassroomResponse

        watsonxRequest = {**lectureAndClassroomResponse['data'],
                          'chat_history': chat_history,
                          "widget": widget}
        return watsonxRequest
    watsonxRequest = fetch_db_tester.execute(organize_context)
    if "status" in watsonxRequest and watsonxRequest['status'] == 'error':
        return watsonxRequest
    ###########################################################################
    # Enable to save example test cases
    llm_tester = LlmTester(name="saves example",
                           on=not DB_INDEPENDENT and SAVE_EXAMPLE)
    llm_tester.save_example_data(watsonxRequest=watsonxRequest)
    ###########################################################################
    # Enable if want to test without db
    llm_tester = LlmTester(name="get example data",
                           on=DB_INDEPENDENT and LOAD_EXAMPLE)
    example = "15:58:29.877"
    exampleRequest = llm_tester.get_example_data(example)
    if exampleRequest:
        watsonxRequest = exampleRequest
    ###########################################################################

    try:
        llmOutput = llm_stream_response(watsonxRequest, prompt, RETRIEVER, LLM)
        return llmOutput
    except Exception as e:
        logging.error("Error: {}".format(e))
        response = {
            'status': 'error',
            'data': str(e)
        }
        return response


@app.route('/translate', methods=['POST'])
def translate():
    text = request.json['text']
    try:
        return translateText(text)
    except Exception as e:
        logging.error("Error: {}".format(e))
        response = {
            'status': 'error',
            'data': str(e)
        }
        return response

# users


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
            'status': 'error',
            'data': 'Missing ' + str(e)
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
            'status': 'error',
            'data': 'Missing ' + str(e)
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
            'status': 'error',
            'data': 'Missing ' + str(e)
        }
        return response


@app.route('/login-with-sid', methods=['POST'])
def login_sessionId():
    try:
        sessionId = request.json['sessionId']
        return loginSessionId(sessionId)
    except Exception as e:
        response = {
            'status': 'error',
            'data': 'Missing ' + str(e)
        }
        return response

# classroom


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
            'status': 'error',
            'data': 'Missing ' + str(e)
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
            'status': 'error',
            'data': 'Missing ' + str(e)
        }
        return response

# lecture


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
            'status': 'error',
            'data': 'Missing ' + str(e)
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
            'status': 'error',
            'data': 'Missing ' + str(e)
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
            'status': 'error',
            'data': 'Missing ' + str(e)
        }
        return response

# widget


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
            'status': 'error',
            'data': 'Missing ' + str(e)
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
            'status': 'error',
            'data': 'Missing ' + str(e)
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
            'status': 'error',
            'data': 'Missing ' + str(e)
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
            'status': 'error',
            'data': 'Missing ' + str(e)
        }
        return response

# chatroom
@app.route('/update-chatroom', methods=['POST'])
def update_chatroom():
    try:
        sessionId = request.json['sessionId']
        chatroomId = request.json['chatroomId']
        content = request.json['content']
        return updateChatroom(sessionId, chatroomId, content)
    except Exception as e:
        response = {
            'status': 'error',
            'data': 'Missing ' + str(e)
        }
        return response

# documents
@app.route('/docxToPdf', methods=['POST'])
def docxToPdf():
    try:
        docxPath = request.json['docxPath']
        pdfPath = request.json['pdfPath']
        docxToPdfFunction(docxPath, pdfPath)
        response = {
            'status': 'success',
            'data': 'success'
        }
        return response
    except Exception as e:
        response = {
            'status': 'error',
            'data': 'Missing ' + str(e)
        }
        return response

@app.route('/create-blank', methods=['POST'])
def createBlank():
    try:
        widgetId = request.json['widgetId']
        documentName = createBlankDocx(widgetId)
        response = {
            'status': 'success',
            'data': documentName
        }
        return response
    except Exception as e:
        response = {
            'status': 'error',
            'data': 'Missing ' + str(e)
        }
        return response

@app.route('/send-file', methods=['POST'])
def sendFile():
    try:
        documentPath = request.json['documentPath']
        document = sendDocument(documentPath)
        return document
    except Exception as e:
        return ""

initialize()
if __name__ == '__main__':
    app.run(port=5000)