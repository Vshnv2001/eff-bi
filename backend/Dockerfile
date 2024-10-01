# Use the official Python image as a base
FROM python:3.10

# Set the working directory
WORKDIR /app

# Copy the requirements file
COPY requirements.txt .

# Install the dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Copy the project files
COPY . .

# Expose the port the app runs on
EXPOSE 8000

RUN python manage.py makemigrations

# Command to run migrations and then start the Django server
CMD ["sh", "-c", "python manage.py migrate && python manage.py runserver_plus 0.0.0.0:8000"]


