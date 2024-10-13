# Rita - Teaching Assistant for Equitable Education

## Setup & Dev Guide

Make sure you've read this, eventually I'll move this guide somewhere else.

### 1. Frontend (GUI)

If this is the first time you run the gui, or a new package is installed by someone else, run the following at root dir:
```
npm run gui:wake-up
```

Otherwise, to open the gui, run the following at root dir:
```
npm run gui:dev
```
To run the gui independently of the frontend (for demo reasons), run
```
npm run gui:indep
```

This will open a new window in your local host with the GUI. Note these are custom scripts I wrote to make life a little easier. You can also do `cd gui`, `npm install`, and `npm start`.

### 2. Backend (Server)

We are using conda to manage our environment. Make sure you have anaconda [installed](https://docs.anaconda.com/free/anaconda/install/index.html).

If this is the first time you set up the environment, at root directory, run
```
conda env create -f server/environment.yml
```

This creates the environment with all the dependencies installed.

Then, to start working with backend:
```
npm server:dev
```

If some packages are updated in `environment.yml`, run
```
npm server:wake-up
```

This is going to open up port 5000 as the api endpoint. You can go to http://127.0.0.1:5000/hello to see the test result. Note that the `npm` command are just scripts for your convinience. Go to `package.json` at root directory to see what commands are actually ran. Also, if you're not familiar with conda, I suggest you learn about the [basic commands](https://conda.io/projects/conda/en/latest/commands/index.html), such as `conda activate`, `conda deactivate`, `conda list`, and `conda install`.

#### Important 很重要!

1. Use `conda install` instead of `pip install` whenever possible. Conda automatically resolves dependency conflict, so it is a lot safer to do so.
2. Because conda doesn't update `environment.yml` automatically, whenever you install some new package, run
   ```
   cd server
   conda env export > environment.yml --from-history
   ```
   to overwrite the current environment.yml`. This way, other people can update their environments.

### 3. Best Practices

Here are practices we will follow, to avoid chaos

1. **ALWAYS** have informative and professional commit message. (Sorry ptsd from CreateX)
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
4. Send a quick message to group dc if you made some bigger change (refactoring, new package install, new merge, etc.).
