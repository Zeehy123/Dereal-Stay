#!/usr/bin/env bash
# Build step used by Render (or run manually before starting gunicorn).
set -o errexit

pip install -r requirements.txt
python manage.py collectstatic --no-input
python manage.py migrate --no-input

# Create the first admin from DJANGO_SUPERUSER_* env vars (no-op if it already exists).
python manage.py createsuperuser --no-input || true
