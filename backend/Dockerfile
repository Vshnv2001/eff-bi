FROM python:3.9-slim

WORKDIR /backend

COPY requirements.txt .

RUN pip install --no-cache-dir --upgrade -r requirements.txt

# Install uvicorn[standard] for better performance and watchfiles for hot reloading
RUN pip install --no-cache-dir uvicorn[standard] watchfiles

COPY . .

EXPOSE 8000

RUN pip install django-livereload-server

CMD ["sh", "-c", "python manage.py migrate effbi_api && python manage.py runserver_plus 0.0.0.0:8000"]