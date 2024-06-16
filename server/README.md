# Read me

Please put your own API_KEY for Watsonx in watson_key.json!\

After inserting it, you can do `git update-index --skip-worktree .\server\watson_key.json` to "ignore" the file

Database details not put in!

# Local Website

http://localhost:5000

# Accessible Endpoints

- GET /hello
  - Purpose : Tests if everything is setup correctly.

- POST /generate-proposal
  - Purpose : Receives AI Response from Watsonx
  - Body : { "input_text" : "your prompt" }

- POST /create-user
  - Purpose : Create an account if username not taken
  - Body : { "username" : "account username", "password" : "account password" }
  - Optional Body : { "school" : "user school name", "alias" : "account alias", "occupation" : "user occupation", "schedule_content" : "content used in schedule" }

- GET / login
  - Purpose : Login into an account. Receives a Session_ID for this user if logged in.
  - Body : { "username" : "account username", "password" : "account password" }