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

def createUser(username, password):
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

            query = 'INSERT INTO User_Table (Username, Pass) VALUES (%s, %s)'
            values = (username, password)

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
            return {'Response' : results}
    
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