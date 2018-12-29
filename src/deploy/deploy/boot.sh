#!/bin/sh
. .venv/bin/activate
exec gunicorn -b 0.0.0.0:3004 --access-logfile - --error-logfile - --timeout 120 --log-level debug --keep-alive 5 wsgi:app
