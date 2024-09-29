# Setting up Backend on local

1. In the Backend folder, run `python3.10 -m venv env` to create your virtual environment.
2. Run `source env/bin/activate` to activate the environment
3. Run `pip install -r requirements.txt` to install dependencies
4. Run `uvicorn main:app --reload` to run the server
5. Run `deactivate` to terminate the running environment

# FYI

- `localhost/docs` on browser will redner all available apis
