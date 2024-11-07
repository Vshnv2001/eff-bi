---
title: Backend Setup
description: Backend Setup
position: 3
---
## Navigate to the backend directory

```bash
cd backend
```

## Requirements

- Python 3.10
- Docker
- Docker Compose

## Environment Variables

You need to fill in the following environment variables into `.env` file:

- `SECRET_KEY`: A secret key for Django.
- `OPENAI_API_KEY`: Your OpenAI API key.
- `SUPERTOKENS_CONNECTION_URI`: The connection URI for SuperTokens.
- `SUPERTOKENS_API_KEY`: The API key for SuperTokens.
- `API_DOMAIN`: The domain of the API (e.g. `http://localhost:8000` if you are running locally on port 8000).
- `WEBSITE_DOMAIN`: The frontend domain (e.g. `http://localhost:3000` if you are running locally on port 3000).

## Setup Virtual Environment

This won't be used to run your server, but it's required to install the dependencies so that your IDE can understand the code.

```bash
python -m venv .venv
```

## Install Dependencies

```bash
pip install -r requirements.txt
```

## Run the development server

```bash
python manage.py runserver
```
