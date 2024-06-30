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
    with open('database_key.json') as f:
        global host, databaseuser, databasepassword, database, port
        js = json.load(f)
        host = js['host']
        databaseuser = js['databaseuser']
        databasepassword = js['databasepassword']
        database = js['database']
        port=3306

def verifyString(str) :
    if len(str) < 6:
        return False
    if ' ' in str:
        return False
    return True

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

def createUser(username, password, school, alias, occupation, schedule_content):
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

            if schedule_content != None:
                query += ', Schedule_Content'
                values.append(schedule_content)

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

            # # get most recent, which is the one we just created for this user

            # query = 'SELECT Session_ID FROM Log_Table WHERE `Created_Time` = (SELECT MAX(Created_Time) FROM Log_Table WHERE User_ID = %s)'
            # values = (userId)

            # cursor.execute(query, values)
            # results = cursor.fetchall()
            # session_Id = results[0][0]

            # get all information from user

            # classroom
            query = 'SELECT * FROM Classroom_Table WHERE Classroom_ID IN (SELECT Classroom_ID FROM User_Classroom_Join_Table WHERE User_ID = %s)'
            values = (userId)

            cursor.execute(query, values)
            results = cursor.fetchall()
            classroomResponse = results
            classroomIds = []

            classroomDetails = []
            lectureDetails = []
            widgetDetails = []

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
                        widgetDetails.append({
                            widgetId : {
                                'id' : widgetId,
                                'type' : widget[1],
                                'content' : widget[2]
                            }
                        })

                    # end of widget

                    lectures.append(lectureId)
                    lectureDetails.append({
                        lectureId : {
                            'id' : lectureId,
                            'name' : lecture[1],
                            'type' : lecture[2],
                            'widgetIds' : widgetIds
                        }
                    })

                # end of lecture

                classroomIds.append(classroomId)
                classroomDetails.append({
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

def updateUser(sessionId, alias, school, occupation, scheduleContent):
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

            if scheduleContent != None:
                query += 'Schedule_Content=%s, '
                values.append(scheduleContent)

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

            query = 'INSERT INTO Widget_Table (Widget_ID, Widget_Type, Widget_Content) VALUES(%s, %s, %s)'
            values = (widgetId, widgetType, widgetContent)

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
                'data' : 'Widget created'
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

            query = 'DELETE FROM Widget_Table WHERE Widget_ID=%s'
            values = (widgetId)
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

def getWatsonxRequest(prompt, widgetResponse, lectureId, classroomId):

    classroomResponse = getClassroom(classroomId)

    if classroomResponse['status'] == 'error':
        return classroomResponse
    
    lectureResponse = getLecture(lectureId)

    if lectureResponse['status'] == 'error':
        return lectureResponse

    response = {
        'status' : 'success',
        'data' : {
            'prompt' : prompt,
            'widget' : widgetResponse,
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


# def modifyUser(username, password, updatedUsername, updatedPassword):
#     getDatabaseDetails()
#     try:
#         connection = pymysql.connect(host=host, user=databaseuser, password=databasepassword, database=database, port=port)
#         with connection.cursor() as cursor:

#             # see if there is entry first

#             query = 'SELECT User_ID FROM User_Table WHERE Username=%s AND Pass=%s'
#             values = (username, password)
#             cursor.execute(query, values)

#             if len(cursor.fetchall()) == 0:
#                 connection.close()
#                 return {'data' : "Account does not exist or Incorrect password!"}

#             # see if updatedUsername already exists

#             query = 'SELECT User_ID FROM User_Table WHERE Username=%s'
#             values = (updatedUsername)
#             cursor.execute(query, values)

#             if len(cursor.fetchall()) != 0:
#                 connection.close()
#                 return {'data' : "Updated Username exists!"}

#             query = 'UPDATE User_Table SET Username=%s, Pass=%s WHERE Username=%s AND Pass=%s'
#             values = (updatedUsername, updatedPassword, username, password)

#             cursor.execute(query, values)
#             connection.commit()
#             connection.close()   
#             return {'data' : "Successfully modified account!"}
    
#     except Exception as e:
#         print("Error: {}".format(e))
#         connection.close()
#         return {'data' : "Failed to modify account!"}