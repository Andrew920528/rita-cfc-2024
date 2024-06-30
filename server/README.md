# Read me

Please put your own API_KEY for Watsonx in watson_key.json!\

After inserting it, you can do `git update-index --skip-worktree .\server\watson_key.json` to "ignore" the file

Database details not put in!

# Local Website

http://localhost:5000

# Accessible Endpoints

## Debug

- GET /hello

## User
- POST /create-user
- POST /update-user
- POST /login

## Classroom
- POST /create-classroom
- POST /update-classroom

## Lecture
- POST /create-lecture
- POST /update-lecture
- DELETE /delete-lecture

## Widget
- POST /create-widget
- POST /update-widget
- POST /update-widget-bulk
- DELETE /delete-widget
  
## Watsonx
- POST /message-rita
