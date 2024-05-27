# Rita - Teaching Assistant for Equitable Education

## Setup & Dev Guide
Make sure you've read this, eventually I'll move this guide somewhere else.
### 1. Frontend (GUI)
First, ``` cd gui ```. If this is the first time you run the gui, or some new package is installed, run
```
npm install
```
To start the gui
```
npm start
```
This will open a new window in your local host with the GUI

### 2. Backend (Server)
#### A) Working with Conda
We are using conda to manage our environment. Make sure you have anaconda [installed](https://docs.anaconda.com/free/anaconda/install/index.html).

If this is the first time you set up the environment, ```cd server``` then 
```
conda env create -f environment.yml
```
Then, to activate the environment:
```
conda activate rita
```
If some packages are updated in `environment.yml`, run
```
conda env update --file environment.yml --prune
```
**Important 很重要!**

1. Use ```conda install``` instead of ```pip install``` whenever possible. Conda automatically resolves dependency conflict, so it is a lot safer to do so.
2. Because conda doesn't update `environment.yml` automatically, whenever you install some new package, run `conda env export > environment.yml` to overwrite the current `environment.yml`. This way, other people can update there environments.

If you're not familiar with conda, I suggest you learn about the [basic commands](https://conda.io/projects/conda/en/latest/commands/index.html), such as `conda activate`, `conda deactivate`, `conda list`, and `conda install`. 
#### B) Working with Flask
To run flask, in `server`, run
```
flask run
```
This is going to open up port 5000 as the api endpoint. You can go to http://127.0.0.1:5000/api/me to see the test result.

### 3. Best Practices
Here are practices we will follow, to avoid chaos
1. **ALWAYS** have descriptive, informative, and professional commit message. (Sorry ptsd from CreateX)
   ```
   Good:
       - Added textbox to gui
       - Fixed issue with server timing out
   Bad:
       - fahefoauewhfavnevnekrjn
       - bruh
       - idk what;s going on LOL
   ```
2. **NEVER** push code that crashes. (Sorry again ptsd from CreateX)
3. When branching, name the branch `<name>-<branch-feature>`. For example, `andrew-chat-room-gui`
4. Send a quick message to group dc if you made some bigger change (even if there is no conflict).

