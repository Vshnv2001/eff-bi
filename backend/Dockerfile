FROM python:3.9-slim

WORKDIR /backend

COPY requirements.txt .

RUN pip install --no-cache-dir --upgrade -r requirements.txt

# Install uvicorn[standard] for better performance and watchfiles for hot reloading
RUN pip install --no-cache-dir uvicorn[standard] watchfiles

COPY . .

EXPOSE 8000

RUN pip install django-livereload-server

CMD ["python", "manage.py", "runserver", "0.0.0.0:8000"]