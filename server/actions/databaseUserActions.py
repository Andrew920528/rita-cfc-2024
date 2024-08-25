import os
from dotenv import load_dotenv
import pymysql
import json
from flask import jsonify, request
import random
from datetime import datetime
import string

host = ''
databaseuser = ''
databasepassword = ''
database = ''
port=0

def generate_random_string(length=16):
    characters = string.ascii_letters + string.digits
    random_string = ''.join(random.choice(characters) for _ in range(length))
    return random_string

def getDatabaseDetails():
    global host, databaseuser, databasepassword, database, port
    load_dotenv()
    host = os.getenv("DB_HOST")
    databaseuser = os.getenv("DB_USER")
    databasepassword = os.getenv("DB_PASSWORD")
    database = os.getenv("DB_NAME")
    port = int(os.getenv("DB_PORT"))


def sessionCheck(sessionId):
    getDatabaseDetails()
    # check if this session exists
    try:
        connection = pymysql.connect(host=host, user=databaseuser, password=databasepassword, database=database, port=port)
        with connection.cursor() as cursor:

            query = 'SELECT * FROM Log_Table WHERE Session_ID=%s'
            values = (sessionId)

            cursor.execute(query, values)
            results = cursor.fetchall()

            if len(results) == 0:
                connection.close()
                response = { 
                    'status' : 'error',
                    'data' : 'Not logged in'
                }
                return response

            timestamp = results[0][1]
            userId = results[0][2]

            #maybe do something with the timestamp

            connection.close()
            response = {
                'status' : 'success',
                'data' : userId
            }
            return response
    
    except Exception as e:
        print("Error: {}".format(e))
        connection.close()
        response = { 
            'status' : 'error',
            'data' : str(e)
        }
        return response

def createUser(username, password, school, alias, occupation, schedule):
    def verifyString(str) :
        if len(str) < 6:
            return False
        if ' ' in str:
            return False
        return True
    getDatabaseDetails()
    if not verifyString(username):
        response = { 
            'status' : 'error',
            'data' : {
                'Error' : 'Invalid username. Username must contain at least 6 characters and must not contain spaces.'
            }
        }
        return response
    
    if not verifyString(password):
        response = { 
            'status' : 'error',
            'data' : 'Invalid password. Password must contain at least 6 characters and must not contain spaces.'
        }
        return response

    try:
        connection = pymysql.connect(host=host, user=databaseuser, password=databasepassword, database=database, port=port)
        with connection.cursor() as cursor:

            # see if the username already exists
            query = 'SELECT User_ID FROM User_Table WHERE Username=%s'
            values = (username)
            cursor.execute(query, values)

            if len(cursor.fetchall()) != 0:
                connection.close()
                response = { 
                    'status' : 'error',
                    'data' : 'username existed'
                }
                return response

            userId = generate_random_string()
            
            # if not exist, then create user
            query = 'INSERT INTO User_Table (User_ID, Username, Pass'
            values = [userId, username, password]

            if school != None:
                query += ', School'
                values.append(school)
            
            if alias != None:
                query += ', Alias'
                values.append(alias)
            
            if occupation != None:
                query += ', Occupation'
                values.append(occupation)

            if schedule != None:
                query += ', Schedule_Content'
                values.append(schedule)

            query += ') VALUES (' + ('%s,' * len(values))[:-1] + ')'
            values = tuple(values)

            cursor.execute(query, values)
            connection.commit() 
            connection.close()
            response = { 
                'status' : 'success',
                'data' : 'Account created'
            }
            return response
    
    except Exception as e:
        print("Error: {}".format(e))
        connection.close()
        response = { 
            'status' : 'error',
            'data' : str(e)
        }
        return response

def getUser(username, password):
    getDatabaseDetails()
    try:
        connection = pymysql.connect(host=host, user=databaseuser, password=databasepassword, database=database, port=port)
        with connection.cursor() as cursor:

            query = 'SELECT * FROM User_Table WHERE Username=%s AND Pass=%s'
            values = (username, password)

            cursor.execute(query, values)
            results = cursor.fetchall()

            if len(results) == 0:
                connection.close()
                response = { 
                    'status' : 'error',
                    'data' : 'Username or password is incorrect. Please try again.'
                }
                return response

            connection.close()
            response = { 
                'status' : 'success',
                'data' : results
            }
            return response
    
    except Exception as e:
        print("Error: {}".format(e))
        connection.close()
        response = { 
            'status' : 'error',
            'data' : str(e)
        }
        return response

def loginUser(username, password):
    userResponse = getUser(username, password)
    userId = None

    if userResponse['status'] == 'error':
        return userResponse
    else:
        userId = userResponse['data'][0][0]
    
    getDatabaseDetails()
    try:
        connection = pymysql.connect(host=host, user=databaseuser, password=databasepassword, database=database, port=port)
        with connection.cursor() as cursor:

            # insert into log table
            
            sessionId = generate_random_string()

            query = 'INSERT INTO Log_Table (User_ID, Session_ID) VALUES (%s, %s)'
            values = (userId, sessionId)

            cursor.execute(query, values)
            connection.commit()

            # get all information from user

            # classroom
            query = 'SELECT * FROM Classroom_Table WHERE Classroom_ID IN (SELECT Classroom_ID FROM User_Classroom_Join_Table WHERE User_ID = %s)'
            values = (userId)

            cursor.execute(query, values)
            results = cursor.fetchall()
            classroomResponse = results
            classroomIds = []

            classroomDetails = {}
            lectureDetails = {}
            widgetDetails = {}

            for classroom in classroomResponse:

                classroomId = classroom[0]

                # lecture
                query = 'SELECT * FROM Lecture_Table WHERE Lecture_ID IN (SELECT Lecture_ID FROM Classroom_Lecture_Join_Table WHERE Classroom_ID = %s)'
                values = (classroomId)

                cursor.execute(query, values)
                results = cursor.fetchall()
                lectureResponse = results
                lectures = []
                lectureIds = []

                for lecture in lectureResponse:
        
                    lectureId = lecture[0]
                    lectureIds.append(lectureId)

                    # widget
                    query = 'SELECT * FROM Widget_Table WHERE Widget_ID IN (SELECT Widget_ID FROM Lecture_Widget_Table WHERE Lecture_ID = %s)'
                    values = (lectureId)

                    cursor.execute(query, values)
                    results = cursor.fetchall()
                    widgetResponse = results
                    widgets = []
                    widgetIds = []

                    for widget in widgetResponse:

                        widgetId = widget[0]
                        widgetIds.append(widgetId)

                        widgets.append(widgetId)
                        widgetDetails.update({
                            widgetId : {
                                'id' : widgetId,
                                'type' : widget[1],
                                'content' : widget[2]
                            }
                        })

                    # end of widget

                    lectures.append(lectureId)
                    lectureDetails.update({
                        lectureId : {
                            'id' : lectureId,
                            'name' : lecture[1],
                            'type' : lecture[2],
                            'widgetIds' : widgetIds
                        }
                    })

                # end of lecture

                classroomIds.append(classroomId)
                classroomDetails.update({
                    classroomId : {
                        'id' : classroomId,
                        'name' : classroom[1],
                        'subject' : classroom[2],
                        'publisher' : classroom[3],
                        'lastOpenedSession' : classroom[4],
                        'grade' : classroom[5],
                        # 'plan' : (False if (classroom[6] == None or classroom[6] == b'\x00') else True),
                        'plan' : classroom[6],
                        'credits' : classroom[7],
                        'chatroomId' : classroom[8],
                        'lectureIds' : lectureIds
                    }
                })

            # end of classroom
            
            connection.close()
            returnResponse = { 
                'status' : 'success',
                'data' : {
                    'sessionId' : sessionId,
                    'user' : {
                        'username' : userResponse['data'][0][1],
                        'school' : userResponse['data'][0][3],
                        'alias' : userResponse['data'][0][4],
                        'occupation' : userResponse['data'][0][5],
                        'schedule' : userResponse['data'][0][6],
                        'classroomIds' : classroomIds 
                    },
                    'classroomsDict' : classroomDetails,
                    'lecturesDict' : lectureDetails,
                    'widgetDict' : widgetDetails
                }
            }
            
            return returnResponse
    
    except Exception as e:
        print("Error: {}".format(e))
        connection.close()
        response = { 
            'status' : 'error',
            'data' : str(e)
        }
        return response

def loginSessionId(sessionId):
    getDatabaseDetails()

    verifySession = sessionCheck(sessionId)

    if verifySession['status'] == 'error':
        response = { 
            'status' : 'error',
            'data' : 'sessionId does not exist'
        }
        return response

    userId = verifySession['data']

    try:
        connection = pymysql.connect(host=host, user=databaseuser, password=databasepassword, database=database, port=port)
        with connection.cursor() as cursor:

            # get all information from user

            query = 'SELECT * FROM User_Table WHERE User_ID=%s'
            values = (userId)

            cursor.execute(query, values)
            results = cursor.fetchall()

            if len(results) == 0:
                connection.close()
                response = { 
                    'status' : 'error',
                    'data' : 'No user associated to this sessionId'
                }
                return response

            userResponse = results[0]

            # classroom
            query = 'SELECT * FROM Classroom_Table WHERE Classroom_ID IN (SELECT Classroom_ID FROM User_Classroom_Join_Table WHERE User_ID = %s)'
            values = (userId)

            cursor.execute(query, values)
            results = cursor.fetchall()
            classroomResponse = results
            classroomIds = []

            classroomDetails = {}
            lectureDetails = {}
            widgetDetails = {}

            for classroom in classroomResponse:

                classroomId = classroom[0]

                # lecture
                query = 'SELECT * FROM Lecture_Table WHERE Lecture_ID IN (SELECT Lecture_ID FROM Classroom_Lecture_Join_Table WHERE Classroom_ID = %s)'
                values = (classroomId)

                cursor.execute(query, values)
                results = cursor.fetchall()
                lectureResponse = results
                lectures = []
                lectureIds = []

                for lecture in lectureResponse:
        
                    lectureId = lecture[0]
                    lectureIds.append(lectureId)

                    # widget
                    query = 'SELECT * FROM Widget_Table WHERE Widget_ID IN (SELECT Widget_ID FROM Lecture_Widget_Table WHERE Lecture_ID = %s)'
                    values = (lectureId)

                    cursor.execute(query, values)
                    results = cursor.fetchall()
                    widgetResponse = results
                    widgets = []
                    widgetIds = []

                    for widget in widgetResponse:

                        widgetId = widget[0]
                        widgetIds.append(widgetId)

                        widgets.append(widgetId)
                        widgetDetails.update({
                            widgetId : {
                                'id' : widgetId,
                                'type' : widget[1],
                                'content' : widget[2]
                            }
                        })

                    # end of widget

                    lectures.append(lectureId)
                    lectureDetails.update({
                        lectureId : {
                            'id' : lectureId,
                            'name' : lecture[1],
                            'type' : lecture[2],
                            'widgetIds' : widgetIds
                        }
                    })

                # end of lecture

                classroomIds.append(classroomId)
                classroomDetails.update({
                    classroomId : {
                        'id' : classroomId,
                        'name' : classroom[1],
                        'subject' : classroom[2],
                        'publisher' : classroom[3],
                        'lastOpenedSession' : classroom[4],
                        'grade' : classroom[5],
                        # 'plan' : (False if (classroom[6] == None or classroom[6] == b'\x00') else True),
                        'plan' : classroom[6],
                        'credits' : classroom[7],
                        'chatroomId' : classroom[8],
                        'lectureIds' : lectureIds
                    }
                })

            # end of classroom
            
            connection.close()
            returnResponse = { 
                'status' : 'success',
                'data' : {
                    'sessionId' : sessionId,
                    'user' : {
                        'username' : userResponse[1],
                        'school' : userResponse[3],
                        'alias' : userResponse[4],
                        'occupation' : userResponse[5],
                        'schedule' : userResponse[6],
                        'classroomIds' : classroomIds 
                    },
                    'classroomsDict' : classroomDetails,
                    'lecturesDict' : lectureDetails,
                    'widgetDict' : widgetDetails
                }
            }
            
            return returnResponse
    
    except Exception as e:
        print("Error: {}".format(e))
        connection.close()
        response = { 
            'status' : 'error',
            'data' : str(e)
        }
        return response

def updateUser(sessionId, alias, school, occupation, schedule):
    getDatabaseDetails()
    
    verifySession = sessionCheck(sessionId)

    if verifySession['status'] == 'error':
        return verifySession

    userId = verifySession['data']

    try:
        connection = pymysql.connect(host=host, user=databaseuser, password=databasepassword, database=database, port=port)
        with connection.cursor() as cursor:

            # see if there is entry first
            query = 'SELECT * FROM User_Table WHERE User_ID=%s'
            values = (userId)
            cursor.execute(query, values)

            if len(cursor.fetchall()) == 0:
                connection.close()
                response = { 
                    'status' : 'error',
                    'data' : 'User does not exist'
                }
                return response

            query = 'UPDATE User_Table SET '
            values = []

            if school != None:
                query += 'School=%s, '
                values.append(school)

            if alias != None:
                query += 'Alias=%s, '
                values.append(alias)

            if occupation != None:
                query += 'Occupation=%s, '
                values.append(occupation)

            if schedule != None:
                query += 'Schedule_Content=%s, '
                values.append(schedule)

            if len(values) == 0:
                response = {
                    'status' : 'error',
                    'response' : 'Nothing to change'
                }
                return response

            query = query[:-2] + " WHERE User_ID=%s"
            values.append(userId)
            values = tuple(values)

            # query = 'UPDATE User_Table SET Alias=%s, School=%s, Occupation=%s WHERE Username=%s'
            # values = (alias, school, occupation, username)

            cursor.execute(query, values)
            connection.commit()
            connection.close()
            response = { 
                'status' : 'success',
                'data' : 'User updated'
            }
            return response
    except Exception as e:
        print("Error: {}".format(e))
        connection.close()
        response = { 
            'status' : 'error',
            'data' : str(e)
        }
        return response

def createClassroom(sessionId, classroomId, classroomName, subject, publisher, grade, plan, credit):
    getDatabaseDetails()

    verifySession = sessionCheck(sessionId)

    if verifySession['status'] == 'error':
        return verifySession

    userId = verifySession['data']
    
    chatroomResponse = createChatroom();
    chatroomId = ""

    if chatroomResponse['data'] == 'error':
        return chatroomResponse
    else:
        chatroomId = chatroomResponse['data']['chatroomId']
        
    try:
        connection = pymysql.connect(host=host, user=databaseuser, password=databasepassword, database=database, port=port)
        with connection.cursor() as cursor:

            # see if there is entry first
            query = 'SELECT * FROM Classroom_Table WHERE Classroom_ID=%s'
            values = (classroomId)
            cursor.execute(query, values)

            if len(cursor.fetchall()) != 0:
                connection.close()
                response = { 
                    'status' : 'error',
                    'data' : 'classroomId already exists'
                }
                return response

            # create classroom

            query = 'INSERT INTO Classroom_Table (Classroom_ID, Chatroom_ID'
            values = [classroomId, chatroomId]

            if classroomName != None:
                query += ', Classroom_Name'
                values.append(classroomName)

            if subject != None:
                query += ', Subject_Name'
                values.append(subject)

            if publisher != None:
                query += ', Subject_Publisher'
                values.append(publisher)

            if grade != None:
                query += ', Grade'
                values.append(grade)

            if plan != None:
                query += ', Plan'
                values.append(plan)

            if credit != None:
                query += ', Credits'
                values.append(credit)

            query += ') VALUES (' + ('%s,' * len(values))[:-1] + ')'
            values = tuple(values)

            cursor.execute(query, values)
            connection.commit()

            # connect classroom to user

            query = 'INSERT INTO User_Classroom_Join_Table (User_ID, Classroom_ID) VALUES(%s, %s)'
            values = (userId, classroomId)

            cursor.execute(query, values)
            connection.commit()

            connection.close()
            response = { 
                'status' : 'success',
                'data' : {
                    'message' : 'Classroom created',
                    'chatroomId' : chatroomId
                }
            }
            return response
    except Exception as e:
        print("Error: {}".format(e))
        connection.close()
        response = { 
            'status' : 'error',
            'data' : str(e)
        }
        return response


def updateClassroom(sessionId, classroomId, classroomName, subject, publisher, grade, plan, credit):
    getDatabaseDetails()

    verifySession = sessionCheck(sessionId)

    if verifySession['status'] == 'error':
        return verifySession
    
    userId = verifySession['data']

    try:
        connection = pymysql.connect(host=host, user=databaseuser, password=databasepassword, database=database, port=port)
        with connection.cursor() as cursor:

            # see if there is entry first
            query = 'SELECT * FROM Classroom_Table WHERE Classroom_ID=%s'
            values = (classroomId)
            cursor.execute(query, values)

            if len(cursor.fetchall()) == 0:
                connection.close()
                response = { 
                    'status' : 'error',
                    'data' : 'classroomId does not exist'
                }
                return response

            # update classroom

            query = 'UPDATE Classroom_Table SET '
            values = []

            if classroomName != None:
                query += 'Classroom_Name=%s, '
                values.append(classroomName)

            if subject != None:
                query += 'Subject_Name=%s, '
                values.append(subject)

            if publisher != None:
                query += 'Subject_Publisher=%s, '
                values.append(publisher)

            if grade != None:
                query += 'Grade=%s, '
                values.append(grade)

            if plan != None:
                query += 'Plan=%s, '
                values.append(plan)

            if credit != None:
                query += 'Credits=%s, '
                values.append(credit)

            if len(values) == 0:
                response = {
                    'status' : 'error',
                    'response' : 'Nothing to change'
                }
                return response

            query = query[:-2] + " WHERE Classroom_ID=%s"
            values.append(classroomId)
            values = tuple(values)

            cursor.execute(query, values)
            connection.commit()

            # connect classroom to user

            query = 'INSERT INTO User_Classroom_Join_Table (User_ID, Classroom_ID) VALUES(%s, %s)'
            values = (userId, classroomId)

            cursor.execute(query, values)
            connection.commit()

            connection.close()
            response = { 
                'status' : 'success',
                'data' : 'Classroom updated'
            }
            return response
    except Exception as e:
        print("Error: {}".format(e))
        connection.close()
        response = { 
            'status' : 'error',
            'data' : str(e)
        }
        return response

def getClassroom(classroomId): 
    getDatabaseDetails()
    try:
        connection = pymysql.connect(host=host, user=databaseuser, password=databasepassword, database=database, port=port)
        with connection.cursor() as cursor:

            query = 'SELECT * FROM Classroom_Table WHERE Classroom_ID=%s'
            values = (classroomId)

            cursor.execute(query, values)
            results = cursor.fetchall()

            if len(results) == 0:
                connection.close()
                response = { 
                    'status' : 'error',
                    'data' : 'classroomId does not exist'
                }
                return response

            classroomResponse = results[0]
            connection.close()
            response = { 
                'status' : 'success',
                'data' : {
                    'name': classroomResponse[1],
                    'subject':classroomResponse[2],
                    'publisher': classroomResponse[3],
                    'grade': classroomResponse[5],
                    'plan': classroomResponse[6],
                    'credits' : classroomResponse[7],
                }
            }
            return response
    except Exception as e:
        print("Error: {}".format(e))
        connection.close()
        response = { 
            'status' : 'error',
            'data' : str(e)
        }
        return response

def createLecture(sessionId, classroomId, lectureId, lectureName, lectureType): 
    getDatabaseDetails()

    verifySession = sessionCheck(sessionId)

    if verifySession['status'] == 'error':
        return verifySession
    
    userId = verifySession['data']

    try:
        connection = pymysql.connect(host=host, user=databaseuser, password=databasepassword, database=database, port=port)
        with connection.cursor() as cursor:

            # see if the classroom exists

            query = 'SELECT Classroom_ID FROM Classroom_Table WHERE Classroom_ID=%s'
            values = (classroomId)
            cursor.execute(query, values)

            if len(cursor.fetchall()) == 0:
                connection.close()
                response = { 
                    'status' : 'error',
                    'data' : 'classroomId does not exist'
                }
                return response

            # see if there is entry first
            query = 'SELECT * FROM Lecture_Table WHERE Lecture_ID=%s'
            values = (lectureId)
            cursor.execute(query, values)

            if len(cursor.fetchall()) != 0:
                connection.close()
                response = { 
                    'status' : 'error',
                    'data' : 'lectureId already exist'
                }
                return response

            # create lecture

            query = 'INSERT INTO Lecture_Table (Lecture_ID, Lecture_Name, Lecture_Type) VALUES(%s, %s, %s)'
            values = (lectureId, lectureName, lectureType)

            cursor.execute(query, values)
            connection.commit()

            # connect lecture to classroom

            query = 'INSERT INTO Classroom_Lecture_Join_Table (Classroom_ID, Lecture_ID) VALUES(%s, %s)'
            values = (classroomId, lectureId)

            cursor.execute(query, values)
            connection.commit()

            connection.close()
            response = { 
                'status' : 'success',
                'data' : 'Lecture created'
            }
            return response
    except Exception as e:
        print("Error: {}".format(e))
        connection.close()
        response = { 
            'status' : 'error',
            'data' : str(e)
        }
        return response

def getLecture(lectureId): 
    getDatabaseDetails()
    try:
        connection = pymysql.connect(host=host, user=databaseuser, password=databasepassword, database=database, port=port)
        with connection.cursor() as cursor:

            query = 'SELECT * FROM Lecture_Table WHERE Lecture_ID=%s'
            values = (lectureId)

            cursor.execute(query, values)
            results = cursor.fetchall()

            if len(results) == 0:
                connection.close()
                response = { 
                    'status' : 'error',
                    'data' : 'lectureId does not exist'
                }
                return response

            lectureResponse = results[0]
            connection.close()
            response = { 
                'status' : 'success',
                'data' : {
                    'name': lectureResponse[1],
                    'type': lectureResponse[2]
                }
            }
            return response

    except Exception as e:
        print("Error: {}".format(e))
        connection.close()
        response = { 
            'status' : 'error',
            'data' : str(e)
        }
        return response

def updateLecture(sessionId, lectureId, name, type):
    getDatabaseDetails()

    verifySession = sessionCheck(sessionId)

    if verifySession['status'] == 'error':
        return verifySession
    
    userId = verifySession['data']

    try:
        connection = pymysql.connect(host=host, user=databaseuser, password=databasepassword, database=database, port=port)
        with connection.cursor() as cursor:

            # see if there is entry first
            query = 'SELECT * FROM Lecture_Table WHERE Lecture_ID=%s'
            values = (lectureId)
            cursor.execute(query, values)

            if len(cursor.fetchall()) == 0:
                connection.close()
                response = { 
                    'status' : 'error',
                    'data' : 'lectureId does not exist'
                }
                return response

            ###

            query = 'UPDATE Lecture_Table SET '
            values = []

            if name != None:
                query += 'Lecture_Name=%s, '
                values.append(name)

            if type != None:
                query += 'Lecture_Type=%s, '
                values.append(type)


            if len(values) == 0:
                response = {
                    'status' : 'error',
                    'response' : 'Nothing to change'
                }
                return response

            query = query[:-2] + " WHERE Lecture_ID=%s"
            values.append(lectureId)
            values = tuple(values)

            cursor.execute(query, values)
            connection.commit()
            connection.close()
            response = { 
                'status' : 'success',
                'data' : 'Lecture updated'
            }
            return response
            
    except Exception as e:
        print("Error: {}".format(e))
        connection.close()
        response = { 
            'status' : 'error',
            'data' : str(e)
        }
        return response

def deleteClassroom(sessionId, classroomId):
    getDatabaseDetails()

    verifySession = sessionCheck(sessionId)

    if verifySession['status'] == 'error':
        return verifySession
    
    userId = verifySession['data']

    try:
        connection = pymysql.connect(host=host, user=databaseuser, password=databasepassword, database=database, port=port)
        with connection.cursor() as cursor:

             # see if classroomId exists

            query = 'SELECT Classroom_ID FROM Classroom_Table WHERE Classroom_ID=%s'
            values = (classroomId)
            cursor.execute(query, values)

            if len(cursor.fetchall()) == 0:
                connection.close()
                response = { 
                    'status' : 'error',
                    'data' : 'classroomId does not exist'
                }
                return response

            # find corresponding lectureId from classroom

            query = 'SELECT Lecture_ID FROM Classroom_Lecture_Join_Table WHERE Classroom_ID=%s'
            values = (classroomId)
            cursor.execute(query, values)

            lectureIds = cursor.fetchall()

            for lectureId in lectureIds:

                # find corresponding widgets from lectureId

                query = 'SELECT Widget_ID FROM Lecture_Widget_Table WHERE Lecture_ID=%s'
                values = (lectureId[0])
                cursor.execute(query, values)

                widgetIds = cursor.fetchall()

                for widgetId in widgetIds:

                    # get chatroomId in Widget_Table

                    query = 'SELECT Chatroom_ID FROM Widget_Table WHERE Widget_ID=%s'
                    values = (widgetId[0])
                    cursor.execute(query, values)
                    chatroomId = cursor.fetchall()

                    # delete widget in Lecture_Widget_Table

                    query = 'DELETE FROM Lecture_Widget_Table WHERE Lecture_ID=%s AND Widget_ID=%s'
                    values = (lectureId[0], widgetId[0])
                    cursor.execute(query, values)
                    connection.commit()

                    # delete widget

                    query = 'DELETE FROM Widget_Table WHERE Widget_ID=%s'
                    values = (widgetId[0])
                    cursor.execute(query, values)
                    connection.commit()

                    # delete chatroomId in Chatroom_Table

                    query = 'DELETE FROM Chatroom_Table WHERE Chatroom_ID=%s'
                    values = (chatroomId[0][0])
                    cursor.execute(query, values)
                    connection.commit()

                # delete lecture in Classroom_Lecture_Join_Table

                query = 'DELETE FROM Classroom_Lecture_Join_Table WHERE Classroom_ID=%s AND Lecture_ID=%s'
                values = (classroomId, lectureId[0])
                cursor.execute(query, values)
                connection.commit()

                # delete lecture

                query = 'DELETE FROM Lecture_Table WHERE Lecture_ID=%s'
                values = (lectureId[0])
                cursor.execute(query, values)
                connection.commit()

            # get chatroomId in Classroom_Table

            query = 'SELECT Chatroom_ID FROM Classroom_Table WHERE Classroom_ID=%s'
            values = (classroomId)
            cursor.execute(query, values)
            chatroomId = cursor.fetchall()

            # delete classroom in User_Classroom_Join_Table

            query = 'DELETE FROM User_Classroom_Join_Table WHERE User_ID=%s AND Classroom_ID=%s'
            values = (userId, classroomId)
            cursor.execute(query, values)
            connection.commit()

            # delete classroom

            query = 'DELETE FROM Classroom_Table WHERE Classroom_ID=%s'
            values = (classroomId)
            cursor.execute(query, values)
            connection.commit()

            # delete chatroomId in Chatroom_Table

            query = 'DELETE FROM Chatroom_Table WHERE Chatroom_ID=%s'
            values = (chatroomId[0][0])
            cursor.execute(query, values)
            connection.commit()

            connection.close()
            response = { 
                'status' : 'success',
                'data' : 'Classroom deleted'
            }
            return response

    except Exception as e:
        print("Error: {}".format(e))
        connection.close()
        response = { 
            'status' : 'error',
            'data' : str(e)
        }
        return response

def deleteLecture(sessionId, classroomId, lectureId):
    getDatabaseDetails()

    verifySession = sessionCheck(sessionId)

    if verifySession['status'] == 'error':
        return verifySession
    
    userId = verifySession['data']

    try:
        connection = pymysql.connect(host=host, user=databaseuser, password=databasepassword, database=database, port=port)
        with connection.cursor() as cursor:

            # see if lectureId exists

            query = 'SELECT Lecture_ID FROM Lecture_Table WHERE Lecture_ID=%s'
            values = (lectureId)
            cursor.execute(query, values)

            if len(cursor.fetchall()) == 0:
                connection.close()
                response = { 
                    'status' : 'error',
                    'data' : 'lectureId does not exist'
                }
                return response

            # see if classroomId exists

            query = 'SELECT Classroom_ID FROM Classroom_Table WHERE Classroom_ID=%s'
            values = (classroomId)
            cursor.execute(query, values)

            if len(cursor.fetchall()) == 0:
                connection.close()
                response = { 
                    'status' : 'error',
                    'data' : 'classroomId does not exist'
                }
                return response

            # see if the join table entry exists

            query = 'SELECT * FROM Classroom_Lecture_Join_Table WHERE Classroom_ID=%s AND Lecture_ID=%s'
            values = (classroomId, lectureId)
            cursor.execute(query, values)

            if len(cursor.fetchall()) == 0:
                connection.close()
                response = { 
                    'status' : 'error',
                    'data' : 'classroomId and lectureId already is not connected'
                }
                return response

            # find corresponding widgetId from lectureId

            query = 'SELECT Widget_ID FROM Lecture_Widget_Table WHERE Lecture_ID=%s'
            values = (lectureId)
            cursor.execute(query, values)

            widgetIds = cursor.fetchall()

            for widgetId in widgetIds:

                # get chatroomId in Widget_Table

                query = 'SELECT Chatroom_ID FROM Widget_Table WHERE Widget_ID=%s'
                values = (widgetId[0])
                cursor.execute(query, values)
                chatroomId = cursor.fetchall()

                # delete widget in Lecture_Widget_Table

                query = 'DELETE FROM Lecture_Widget_Table WHERE Lecture_ID=%s AND Widget_ID=%s'
                values = (lectureId[0], widgetId[0])
                cursor.execute(query, values)
                connection.commit()

                # delete widget

                query = 'DELETE FROM Widget_Table WHERE Widget_ID=%s'
                values = (widgetId[0])
                cursor.execute(query, values)
                connection.commit()

                # delete chatroomId in Chatroom_Table

                query = 'DELETE FROM Chatroom_Table WHERE Chatroom_ID=%s'
                values = (chatroomId[0][0])
                cursor.execute(query, values)
                connection.commit()

            # delete -> join table first, then lecture tables

            query = 'DELETE FROM Classroom_Lecture_Join_Table WHERE Classroom_ID=%s AND Lecture_ID=%s'
            values = (classroomId, lectureId)
            cursor.execute(query, values)
            connection.commit()

            query = 'DELETE FROM Lecture_Table WHERE Lecture_ID=%s'
            values = (lectureId)
            cursor.execute(query, values)
            connection.commit() 

            connection.close()
            response = { 
                'status' : 'success',
                'data' : 'Lecture deleted'
            }
            return response

    except Exception as e:
        print("Error: {}".format(e))
        connection.close()
        response = { 
            'status' : 'error',
            'data' : str(e)
        }
        return response

def createWidget(sessionId, lectureId, widgetId, widgetType, widgetContent): 
    getDatabaseDetails()
    
    verifySession = sessionCheck(sessionId)

    if verifySession['status'] == 'error':
        return verifySession
    
    userId = verifySession['data']

    chatroomResponse = createChatroom();
    chatroomId = ""

    if chatroomResponse['data'] == 'error':
        return chatroomResponse
    else:
        chatroomId = chatroomResponse['data']['chatroomId']

    try:
        connection = pymysql.connect(host=host, user=databaseuser, password=databasepassword, database=database, port=port)
        with connection.cursor() as cursor:

             # see if the lecture exists

            query = 'SELECT Lecture_ID FROM Lecture_Table WHERE Lecture_ID=%s'
            values = (lectureId)
            cursor.execute(query, values)

            if len(cursor.fetchall()) == 0:
                connection.close()
                response = { 
                    'status' : 'error',
                    'data' : 'lectureId does not exist'
                }
                return response

            # see if there is entry first
            query = 'SELECT * FROM Widget_Table WHERE Widget_ID=%s'
            values = (widgetId)
            cursor.execute(query, values)

            if len(cursor.fetchall()) != 0:
                connection.close()
                response = { 
                    'status' : 'error',
                    'data' : 'widgetId already exists'
                }
                return response

            # create widget

            query = 'INSERT INTO Widget_Table (Widget_ID, Widget_Type, Widget_Content, Chatroom_ID) VALUES(%s, %s, %s, %s)'
            values = (widgetId, widgetType, widgetContent, chatroomId)

            cursor.execute(query, values)
            connection.commit()

            # connect widget to lecture

            query = 'INSERT INTO Lecture_Widget_Table (Lecture_ID, Widget_ID) VALUES(%s, %s)'
            values = (lectureId, widgetId)

            cursor.execute(query, values)
            connection.commit()

            connection.close()
            response = { 
                'status' : 'success',
                'data' : {
                    'message' : 'Widget created',
                    'chatroomId' : chatroomId
                }
            }
            return response
    except Exception as e:
        print("Error: {}".format(e))
        connection.close()
        response = { 
            'status' : 'error',
            'data' : str(e)
        }
        return response

def updateWidget(sessionId, widgetId, widgetContent):
    getDatabaseDetails()

    verifySession = sessionCheck(sessionId)

    if verifySession['status'] == 'error':
        return verifySession
    
    userId = verifySession['data']

    try:
        connection = pymysql.connect(host=host, user=databaseuser, password=databasepassword, database=database, port=port)
        with connection.cursor() as cursor:

            # see if there is entry first
            query = 'SELECT * FROM Widget_Table WHERE Widget_ID=%s'
            values = (widgetId)
            cursor.execute(query, values)

            if len(cursor.fetchall()) == 0:
                connection.close()
                response = { 
                    'status' : 'error',
                    'data' : 'widgetId does not exist'
                }
                return response

            query = 'UPDATE Widget_Table SET Widget_Content=%s WHERE Widget_ID=%s'
            values = (widgetContent, widgetId)

            cursor.execute(query, values)
            connection.commit()
            connection.close()
            response = { 
                'status' : 'success',
                'data' : 'widget updated'
            }
            return response
            
    except Exception as e:
        print("Error: {}".format(e))
        connection.close()
        response = { 
            'status' : 'error',
            'data' : str(e)
        }
        return response

def updateWidgetBulk(sessionId, widgetIds, widgetContents):
    
    if len(widgetIds) != len(widgetContents):
        response = { 
            'status' : 'error',
            'data' : 'Array sizes do not match'
        }
        return response

    getDatabaseDetails()

    verifySession = sessionCheck(sessionId)

    if verifySession['status'] == 'error':
        return verifySession
    
    userId = verifySession['data']

    try:
        connection = pymysql.connect(host=host, user=databaseuser, password=databasepassword, database=database, port=port)
        with connection.cursor() as cursor:

            # see if there is entry first
            query = 'SELECT * FROM Widget_Table WHERE Widget_ID in ('
            query += ('%s,' * len(widgetIds))[:-1] + ")"
            values = tuple(widgetIds)
            cursor.execute(query, values)

            if len(cursor.fetchall()) != len(widgetIds):
                connection.close()
                response = { 
                    'status' : 'error',
                    'data' : 'some widgetIds are not found'
                }
                return response

            # update bulk
            # widgetIds definitely exist at this point. Wont have errors due to former checks
            for index in range(len(widgetIds)):
                query = 'UPDATE Widget_Table SET Widget_Content=%s WHERE Widget_ID=%s'
                values = (widgetContents[index], widgetIds[index])

                cursor.execute(query, values)
                connection.commit()

            connection.close()
            response = { 
                'status' : 'success',
                'data' : 'All widgets updated'
            }
            return response
    except Exception as e:
        print("Error: {}".format(e))
        connection.close()
        response = { 
            'status' : 'error',
            'data' : str(e)
        }
        return response

def deleteWidget(sessionId, lectureId, widgetId):
    getDatabaseDetails()

    verifySession = sessionCheck(sessionId)

    if verifySession['status'] == 'error':
        return verifySession
    
    userId = verifySession['data']

    try:
        connection = pymysql.connect(host=host, user=databaseuser, password=databasepassword, database=database, port=port)
        with connection.cursor() as cursor:

            # see if lectureId exists

            query = 'SELECT Lecture_ID FROM Lecture_Table WHERE Lecture_ID=%s'
            values = (lectureId)
            cursor.execute(query, values)

            if len(cursor.fetchall()) == 0:
                connection.close()
                response = { 
                    'status' : 'error',
                    'data' : 'lectureId does not exist'
                }
                return response

            # see if widget exists

            query = 'SELECT Widget_ID FROM Widget_Table WHERE Widget_ID=%s'
            values = (widgetId)
            cursor.execute(query, values)

            if len(cursor.fetchall()) == 0:
                connection.close()
                response = { 
                    'status' : 'error',
                    'data' : 'widgetId does not exist'
                }
                return response

            # see if the join table entry exists

            query = 'SELECT * FROM Lecture_Widget_Table WHERE Widget_ID=%s AND Lecture_ID=%s'
            values = (widgetId, lectureId)
            cursor.execute(query, values)

            if len(cursor.fetchall()) == 0:
                connection.close()
                response = { 
                    'status' : 'error',
                    'data' : 'widgetId and lectureId already is not connected'
                }
                return response

            # delete -> join table first, then lecture tables

            query = 'DELETE FROM Lecture_Widget_Table WHERE Widget_ID=%s AND Lecture_ID=%s'
            values = (widgetId, lectureId)
            cursor.execute(query, values)
            connection.commit()

            # get chatroomId in Widget_Table

            query = 'SELECT Chatroom_ID FROM Widget_Table WHERE Widget_ID=%s'
            values = (widgetId)
            cursor.execute(query, values)
            chatroomId = cursor.fetchall()

            # delete widget

            query = 'DELETE FROM Widget_Table WHERE Widget_ID=%s'
            values = (widgetId)
            cursor.execute(query, values)
            connection.commit()

            # delete chatroomId in Chatroom_Table

            query = 'DELETE FROM Chatroom_Table WHERE Chatroom_ID=%s'
            values = (chatroomId[0][0])
            cursor.execute(query, values)
            connection.commit()

            connection.close()
            response = { 
                'status' : 'success',
                'data' : 'Widget deleted'
            }
            return response

    except Exception as e:
        print("Error: {}".format(e))
        connection.close()
        response = { 
            'status' : 'error',
            'data' : str(e)
        }
        return response

def getLectureAndClassroom(lectureId, classroomId):
    # TODO[Jim]: current latency ~2sec, SQL should be optimized
    classroomResponse = getClassroom(classroomId)

    if classroomResponse['status'] == 'error':
        return classroomResponse
    
    lectureResponse = getLecture(lectureId)

    if lectureResponse['status'] == 'error':
        return lectureResponse

    response = {
        'status' : 'success',
        'data' : {
            'classroom' : classroomResponse,
            'lecture' : lectureResponse
        }
    }

    return response

def createChatroom(content=""): 
    getDatabaseDetails()
    try:
        connection = pymysql.connect(host=host, user=databaseuser, password=databasepassword, database=database, port=port)
        with connection.cursor() as cursor:

            created = False
            chatroomId = ""

            while not created:
                # see if there is entry first
                query = 'SELECT * FROM Chatroom_Table WHERE Chatroom_ID=%s'
                values = (generate_random_string())
                cursor.execute(query, values)

                if len(cursor.fetchall()) == 0:
                    created = True
                    chatroomId = values
            # create chatroom

            query = 'INSERT INTO Chatroom_Table (Chatroom_ID, Content) VALUES(%s, %s)'
            values = (chatroomId, content)

            cursor.execute(query, values)
            connection.commit()

            connection.close()
            response = { 
                'status' : 'success',
                'data' : {
                    'chatroomId' : chatroomId
                }
            }
            return response
    except Exception as e:
        print("Error: {}".format(e))
        connection.close()
        response = { 
            'status' : 'error',
            'data' : str(e)
        }
        return response

def updateChatroom(sessionId, chatoomId, content):
    getDatabaseDetails()

    verifySession = sessionCheck(sessionId)

    if verifySession['status'] == 'error':
        return verifySession
    
    userId = verifySession['data']

    try:
        connection = pymysql.connect(host=host, user=databaseuser, password=databasepassword, database=database, port=port)
        with connection.cursor() as cursor:

            # see if there is entry first
            query = 'SELECT * FROM Chatroom_Table WHERE Chatroom_ID=%s'
            values = (chatoomId)
            cursor.execute(query, values)

            if len(cursor.fetchall()) == 0:
                connection.close()
                response = { 
                    'status' : 'error',
                    'data' : 'chatoomId does not exist'
                }
                return response

            query = 'UPDATE Chatroom_Table SET Content=%s WHERE Chatroom_ID=%s'
            values = (content, chatoomId)

            cursor.execute(query, values)
            connection.commit()
            connection.close()
            response = { 
                'status' : 'success',
                'data' : 'chatroom updated'
            }
            return response
            
    except Exception as e:
        print("Error: {}".format(e))
        connection.close()
        response = { 
            'status' : 'error',
            'data' : str(e)
        }
        return response
