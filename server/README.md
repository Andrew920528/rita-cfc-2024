# Read me

Please put your own API_KEY for Watsonx in watson_key.json!\

After inserting it, you can do ```git update-index --skip-worktree .\server\watson_key.json``` to "ignore" the file

# Local Website

http://localhost:5000

# Endpoints

- GET /hello
  - Purpose : Tests if everything is setup correctly.

- POST /generate-proposal
  - Input : { "input_text" : "your prompt" }
  - Purpose : Receives AI Response from Watsonx
