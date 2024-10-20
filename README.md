# eff-bi

Full-Stack GenAI Application to replace the long wait for BI developers to get executives the insights they need, powered by LLMs.

## Development

### Backend

#### Requirements

- Python 3.10+
- pip
- Docker, Docker Compose
- Database Client (e.g. TablePlus for Windows, PGAdmin/Postico for Mac)
- WSL2 (Windows only)

#### Setup Development Environment

```bash
cd backend
python3 -m venv venv
source venv/bin/activate
```

#### Install dependencies

```bash
pip install -r requirements.txt
```

#### Run Backend and Database Servers Together

From the root of repo, run the following to start the docker containers

```bash
docker-compose up --build -d
```

If you make any changes to the models, please run the following from the root directory.
This will create a new migration in the migrations file

```bash
python manage.py makemigrations --name=<unique name of migration>
```

Go to `http://127.0.0.1:8000/api/health/` to see if the server is running

If you want to stop the docker containers, run the following

```bash
docker-compose down
```

### Frontend

#### Requirements

- Node.js 18+
- npm

#### Install dependencies

```bash
cd frontend
npm install
```

#### Run the frontend

```bash
npm run dev
```
