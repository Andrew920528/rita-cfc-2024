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

def createUser(username, password, school, alias, occupation, schedule_content):
    getDatabaseDetails()
    try:
        connection = pymysql.connect(host=host, user=databaseuser, password=databasepassword, database=database, port=port)
        with connection.cursor() as cursor:

            # see if the username already exists

            query = 'SELECT User_ID FROM User_Table WHERE Username=%s'
            values = (username)
            cursor.execute(query, values)

            if len(cursor.fetchall()) != 0:
                connection.close()
                return {'Response' : "Username exists!"}
            
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
            return {'Response' : "Successfully created account!"}
    
    except Exception as e:
        print("Error: {}".format(e))
        connection.close()
        return {'Response' : "Failed to create account!"}

def getUser(username, password):
    getDatabaseDetails()
    try:
        connection = pymysql.connect(host=host, user=databaseuser, password=databasepassword, database=database, port=port)
        with connection.cursor() as cursor:

            query = 'SELECT User_ID FROM User_Table WHERE Username=%s AND Pass=%s'
            values = (username, password)

            cursor.execute(query, values)
            results = cursor.fetchall()

            if len(results) == 0:
                connection.close()
                return {'Response' : "No account found!"}

            connection.close()
            return {'Response' : results[0][0]}
    
    except Exception as e:
        print("Error: {}".format(e))
        connection.close()
        return {'Response' : "Failed to get account!"}
        


def modifyUser(username, password, updatedUsername, updatedPassword):
    getDatabaseDetails()
    try:
        connection = pymysql.connect(host=host, user=databaseuser, password=databasepassword, database=database, port=port)
        with connection.cursor() as cursor:

            # see if there is entry first

            query = 'SELECT User_ID FROM User_Table WHERE Username=%s AND Pass=%s'
            values = (username, password)
            cursor.execute(query, values)

            if len(cursor.fetchall()) == 0:
                connection.close()
                return {'Response' : "Account does not exist or Incorrect password!"}

            # see if updatedUsername already exists

            query = 'SELECT User_ID FROM User_Table WHERE Username=%s'
            values = (updatedUsername)
            cursor.execute(query, values)

            if len(cursor.fetchall()) != 0:
                connection.close()
                return {'Response' : "Updated Username exists!"}

            query = 'UPDATE User_Table SET Username=%s, Pass=%s WHERE Username=%s AND Pass=%s'
            values = (updatedUsername, updatedPassword, username, password)

            cursor.execute(query, values)
            connection.commit()
            connection.close()   
            return {'Response' : "Successfully modified account!"}
    
    except Exception as e:
        print("Error: {}".format(e))
        connection.close()
        return {'Response' : "Failed to modify account!"}


def deleteUser(username, password):
    getDatabaseDetails()
    try:
        connection = pymysql.connect(host=host, user=databaseuser, password=databasepassword, database=database, port=port)
        with connection.cursor() as cursor:

            # see if there is entry first

            query = 'SELECT User_ID FROM User_Table WHERE Username=%s AND Pass=%s'
            values = (username, password)
            cursor.execute(query, values)

            if len(cursor.fetchall()) == 0:
                connection.close()
                return {'Response' : "Account does not exist or Incorrect password!"}

            query = 'DELETE FROM User_Table WHERE Username=%s AND Pass=%s'
            values = (username, password)

            cursor.execute(query, values)
            connection.commit()
            connection.close()
            return {'Response' : "Successfully deleted account!"}
    
    except Exception as e:
        print("Error: {}".format(e))
        connection.close()
        return {'Response' : "Failed to delete account!"}

def loginUser(username, password):

    response = getUser(username, password)
    userid = None

    # valid user id?
    if not isinstance(response['Response'], int):
        return response
    else:
        userid = response['Response']
    
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

            connection.close()
            return { 'Response' : 
                {
                    'Session_ID' : results[0][0]
                }
            }
    
    except Exception as e:
        print("Error: {}".format(e))
        connection.close()
        return {'Response' : "Failed to get account!"}