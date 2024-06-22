import pymysql
import json
from flask import jsonify, request

host = ''
databaseuser = ''
databasepassword = ''
database = ''
port=0

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

def createUser(username, password, school, alias, occupation, schedule_content):
    getDatabaseDetails()

    if not verifyString(username):
        response = { 
            'Status' : 'error',
            'Response' : {
                'Error' : 'invalid username. Username must contain at least 6 characters and must not contain spaces.'
            }
        }
        return response
    
    if not verifyString(password):
        response = { 
            'Status' : 'error',
            'Response' : 'invalid password. Passwords must contain at least 6 characters and must not contain spaces.'
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
                    'Status' : 'error',
                    'Response' : 'username existed'
                }
                return response
            
            # if not exist, then create user
            query = 'INSERT INTO User_Table (Username, Pass'
            values = [username, password]

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
                'Status' : 'success',
                'Response' : 'account created'
            }
            return response
    
    except Exception as e:
        print("Error: {}".format(e))
        connection.close()
        response = { 
            'Status' : 'error',
            'Response' : e
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
                    'Status' : 'error',
                    'Response' : 'Username or password is incorrect. Please try again.'
                }
                return response

            connection.close()
            return {'Response' : results}
    
    except Exception as e:
        print("Error: {}".format(e))
        connection.close()
        response = { 
            'Status' : 'error',
            'Response' : e
        }
        return response

def loginUser(username, password):

    userResponse = getUser(username, password)
    userid = None

    # valid user id?
    if not isinstance(userResponse['Response'][0][0], int):
        return userResponse
    else:
        userid = userResponse['Response'][0][0]
    
    getDatabaseDetails()
    try:
        connection = pymysql.connect(host=host, user=databaseuser, password=databasepassword, database=database, port=port)
        with connection.cursor() as cursor:

            # insert into log table

            query = 'INSERT INTO Log_Table (User_ID) VALUES(%s)'
            values = (userid)

            cursor.execute(query, values)
            connection.commit()

            # get most recent, which is the one we just created for this user

            query = 'SELECT Session_ID FROM Log_Table WHERE `Created_Time` = (SELECT MAX(Created_Time) FROM Log_Table WHERE User_ID = %s)'
            values = (userid)

            cursor.execute(query, values)
            results = cursor.fetchall()
            session_Id = results[0][0]

            # get all information from user

            # classroom
            query = 'SELECT * FROM Classroom_Table WHERE Classroom_ID IN (SELECT Classroom_ID FROM User_Classroom_Join_Table WHERE User_ID = %s)'
            values = (userid)

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
                            'chatroom' : lecture[3],
                            'widgets' : widgetIds
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
                        'sessions' : lectureIds
                    }
                })

            # end of classroom
            
            connection.close()
            returnResponse = { 
                'Status' : 'success',
                'Response' : {
                    'sessionId' : session_Id,
                    'user' : {
                        'username' : userResponse['Response'][0][1],
                        'school' : userResponse['Response'][0][3],
                        'alias' : userResponse['Response'][0][4],
                        'occupation' : userResponse['Response'][0][5],
                        'schedule' : userResponse['Response'][0][6],
                        'classroom' : classroomIds 
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
            'Status' : 'error',
            'Response' : e
        }
        return response

def updateUser(username, alias, school, occupation):
    getDatabaseDetails()
    try:
        connection = pymysql.connect(host=host, user=databaseuser, password=databasepassword, database=database, port=port)
        with connection.cursor() as cursor:

            # see if there is entry first
            query = 'SELECT * FROM User_Table WHERE Username=%s'
            values = (username)
            cursor.execute(query, values)

            if len(cursor.fetchall()) == 0:
                connection.close()
                response = { 
                    'Status' : 'error',
                    'Response' : 'username does not exist'
                }
                return response

            query = 'UPDATE User_Table SET Alias=%s, School=%s, Occupation=%s WHERE Username=%s'
            values = (alias, school, occupation, username)

            cursor.execute(query, values)
            connection.commit()
            connection.close()
            response = { 
                'Status' : 'success',
                'Response' : 'user updated'
            }
            return response
    except Exception as e:
        print("Error: {}".format(e))
        connection.close()
        response = { 
            'Status' : 'error',
            'Response' : e
        }
        return response

def createClassroom(userId, classroomId, classroomName, subject, publisher): 
    getDatabaseDetails()
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
                    'Status' : 'error',
                    'Response' : 'classroomId already exist'
                }
                return response

            # create classroom

            query = 'INSERT INTO Classroom_Table (Classroom_ID, Classroom_Name, Subject_Name, Subject_Publisher) VALUES (%s, %s, %s, %s)'
            values = (classroomId, classroomName, subject, publisher)

            cursor.execute(query, values)
            connection.commit()

            # connect classroom to user

            query = 'INSERT INTO User_Classroom_Join_Table (User_ID, Classroom_ID) VALUES(%s, %s)'
            values = (userId, classroomId)

            cursor.execute(query, values)
            connection.commit()

            connection.close()
            response = { 
                'Status' : 'success',
                'Response' : 'classroom created'
            }
            return response
    except Exception as e:
        print("Error: {}".format(e))
        connection.close()
        response = { 
            'Status' : 'error',
            'Response' : e
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
                    'Status' : 'error',
                    'Response' : 'classroomId does not exist'
                }
                return response

            classroomResponse = results[0]
            connection.close()
            response = { 
                'Status' : 'success',
                'Response' : {
                    'name': classroomResponse[1],
                    'subject':classroomResponse[2],
                    'publisher': classroomResponse[3],
                    'grade': classroomResponse[5],
                    'credits': 1 # temp
                }
            }
            return response
    except Exception as e:
        print("Error: {}".format(e))
        connection.close()
        response = { 
            'Status' : 'error',
            'Response' : e
        }
        return response

def createLecture(classroomId, lectureId, lectureName, lectureType): 
    getDatabaseDetails()
    try:
        connection = pymysql.connect(host=host, user=databaseuser, password=databasepassword, database=database, port=port)
        with connection.cursor() as cursor:

            # see if there is entry first
            query = 'SELECT * FROM Lecture_Table WHERE Lecture_ID=%s'
            values = (lectureId)
            cursor.execute(query, values)

            if len(cursor.fetchall()) != 0:
                connection.close()
                response = { 
                    'Status' : 'error',
                    'Response' : 'lectureId already exist'
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
                'Status' : 'success',
                'Response' : 'lecture created'
            }
            return response
    except Exception as e:
        print("Error: {}".format(e))
        connection.close()
        response = { 
            'Status' : 'error',
            'Response' : e
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
                    'Status' : 'error',
                    'Response' : 'lectureId does not exist'
                }
                return response

            lectureResponse = results[0]
            connection.close()
            response = { 
                'Status' : 'success',
                'Response' : {
                    'name': lectureResponse[1],
                    'type': lectureResponse[2]
                }
            }
            return response

    except Exception as e:
        print("Error: {}".format(e))
        connection.close()
        response = { 
            'Status' : 'error',
            'Response' : e
        }
        return response

def createWidget(lectureId, widgetId, widgetType, widgetContent): 
    getDatabaseDetails()
    try:
        connection = pymysql.connect(host=host, user=databaseuser, password=databasepassword, database=database, port=port)
        with connection.cursor() as cursor:

            # see if there is entry first
            query = 'SELECT * FROM Widget_Table WHERE Widget_ID=%s'
            values = (widgetId)
            cursor.execute(query, values)

            if len(cursor.fetchall()) != 0:
                connection.close()
                response = { 
                    'Status' : 'error',
                    'Response' : 'widgetId already exist'
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
                'Status' : 'success',
                'Response' : 'widget created'
            }
            return response
    except Exception as e:
        print("Error: {}".format(e))
        connection.close()
        response = { 
            'Status' : 'error',
            'Response' : e
        }
        return response

def updateWidget(widgetId, widgetContent):
    getDatabaseDetails()
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
                    'Status' : 'error',
                    'Response' : 'widgetId does not exist'
                }
                return response

            query = 'UPDATE Widget_Table SET Widget_Content=%s WHERE Widget_ID=%s'
            values = (widgetContent, widgetId)

            cursor.execute(query, values)
            connection.commit()
            connection.close()
            response = { 
                'Status' : 'success',
                'Response' : 'widget updated'
            }
            return response
    except Exception as e:
        print("Error: {}".format(e))
        connection.close()
        response = { 
            'Status' : 'error',
            'Response' : e
        }
        return response

def getWatsonxRequest(prompt, widgetResponse, lectureId, classroomId):

    classroomResponse = getClassroom(classroomId)

    if classroomResponse['Status'] == 'error':
        return classroomResponse
    
    lectureResponse = getLecture(lectureId)

    if lectureResponse['Status'] == 'error':
        return lectureResponse

    response = {
        'Status' : 'success',
        'Response' : {
            'prompt' : prompt,
            'widget' : widgetResponse,
            'classroom' : classroomResponse,
            'lecture' : lectureResponse
        }
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
#                 return {'Response' : "Account does not exist or Incorrect password!"}

#             # see if updatedUsername already exists

#             query = 'SELECT User_ID FROM User_Table WHERE Username=%s'
#             values = (updatedUsername)
#             cursor.execute(query, values)

#             if len(cursor.fetchall()) != 0:
#                 connection.close()
#                 return {'Response' : "Updated Username exists!"}

#             query = 'UPDATE User_Table SET Username=%s, Pass=%s WHERE Username=%s AND Pass=%s'
#             values = (updatedUsername, updatedPassword, username, password)

#             cursor.execute(query, values)
#             connection.commit()
#             connection.close()   
#             return {'Response' : "Successfully modified account!"}
    
#     except Exception as e:
#         print("Error: {}".format(e))
#         connection.close()
#         return {'Response' : "Failed to modify account!"}

# def deleteUser(username, password):
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
#                 return {'Response' : "Account does not exist or Incorrect password!"}

#             query = 'DELETE FROM User_Table WHERE Username=%s AND Pass=%s'
#             values = (username, password)

#             cursor.execute(query, values)
#             connection.commit()
#             connection.close()
#             return {'Response' : "Successfully deleted account!"}
    
#     except Exception as e:
#         print("Error: {}".format(e))
#         connection.close()
#         return {'Response' : "Failed to delete account!"}