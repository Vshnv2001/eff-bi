#!/bin/bash

# python manage.py makemigrations effbi_api --no-input --name="curr_migration_$(date +%Y%m%d%H%M%S)"
python manage.py migrate --no-input --run-syncdb

echo "Starting server"
python manage.py runserver_plus 0.0.0.0:8000
