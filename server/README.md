# Read me

Please put your own API_KEY for Watsonx in watson_key.json!\

After inserting it, you can do `git update-index --skip-worktree .\server\watson_key.json` to "ignore" the file

Database details not put in!

# Local Website

http://localhost:5000

# Endpoints

- GET /hello
  - Purpose : Tests if everything is setup correctly.

- POST /generate-proposal
  - Body : { "input_text" : "your prompt" }
  - Purpose : Receives AI Response from Watsonx

- GET /get-user
  - Query : { "username" : "account username", "password" : "account password" }
  - Purpose : Get User_ID if found
- POST /create-user
  - Body : { "username" : "account username", "password" : "account password" }
  - Purpose : Create an account if username not taken
- POST /modify-user
  - Body : { "username" : "account username", "password" : "account password", "updatedUsername" : "account updated username", "updatedPassword : "account updated password" }
  - Purpose : Modify an account if account found and updated username not taken
- DELETE /delete-user
  - Body : { "username" : "account username", "password" : "account password" }
  - Purpose : Delete an account if account found