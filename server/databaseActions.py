import pymysql
from flask import jsonify, request

host = ''
databaseuser = ''
databasepassword = ''
database = ''
port = 0

def createUser(username, password):

    try:
        connection = pymysql.connect(host=host, user=databaseuser, password=databasepassword, database=database, port=port)
        with connection.cursor() as cursor:

            # see if the username already exists

            query = 'SELECT User_ID FROM User_Table WHERE Username=%s'
            values = (username)
            cursor.execute(query, values)

            if len(cursor.fetchall()) != 0:
                return {'Response' : "Username exists!"}
            
            # if not exist, then create user

            query = 'INSERT INTO User_Table (Username, Pass) VALUES (%s, %s)'
            values = (username, password)

            cursor.execute(query, values)
            connection.commit() 
            return {'Response' : "Successfully created account!"}
    
    except Exception as e:
        print("Error: {}".format(e))
        return {'Response' : "Failed to create account!"}

    finally:
        connection.close()

def getUser(username, password):
    try:
        connection = pymysql.connect(host=host, user=databaseuser, password=databasepassword, database=database, port=port)
        with connection.cursor() as cursor:

            query = 'SELECT User_ID FROM User_Table WHERE Username=%s AND Pass=%s'
            values = (username, password)

            cursor.execute(query, values)
            results = cursor.fetchall()

            if len(results) == 0:
                return {'Response' : "No account found!"}

            return {'Response' : results}
    
    except Exception as e:
        print("Error: {}".format(e))
        return {'Response' : "Failed to get account!"}
    
    finally:
        connection.close()
        


def modifyUser(username, password, updatedUsername, updatedPassword):
    try:
        connection = pymysql.connect(host=host, user=databaseuser, password=databasepassword, database=database, port=port)
        with connection.cursor() as cursor:

            # see if there is entry first

            query = 'SELECT User_ID FROM User_Table WHERE Username=%s AND Pass=%s'
            values = (username, password)
            cursor.execute(query, values)

            if len(cursor.fetchall()) == 0:
                return {'Response' : "Account does not exist or Incorrect password!"}

            # see if updatedUsername already exists

            query = 'SELECT User_ID FROM User_Table WHERE Username=%s'
            values = (updatedUsername)
            cursor.execute(query, values)

            if len(cursor.fetchall()) != 0:
                return {'Response' : "Updated Username exists!"}

            query = 'UPDATE User_Table SET Username=%s, Pass=%s WHERE Username=%s AND Pass=%s'
            values = (updatedUsername, updatedPassword, username, password)

            cursor.execute(query, values)
            connection.commit()             
            return {'Response' : "Successfully modified account!"}
    
    except Exception as e:
        print("Error: {}".format(e))
        return {'Response' : "Failed to modify account!"}
    
    finally:
        connection.close()


def deleteUser(username, password):
    try:
        connection = pymysql.connect(host=host, user=databaseuser, password=databasepassword, database=database, port=port)
        with connection.cursor() as cursor:

            # see if there is entry first

            query = 'SELECT User_ID FROM User_Table WHERE Username=%s AND Pass=%s'
            values = (username, password)
            cursor.execute(query, values)

            if len(cursor.fetchall()) == 0:
                return {'Response' : "Account does not exist or Incorrect password!"}

            query = 'DELETE FROM User_Table WHERE Username=%s AND Pass=%s'
            values = (username, password)

            cursor.execute(query, values)
            connection.commit()
            return {'Response' : "Successfully deleted account!"}
    
    except Exception as e:
        print("Error: {}".format(e))
        return {'Response' : "Failed to delete account!"}

    finally:
        connection.close()