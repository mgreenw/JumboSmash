#!/bin/sh
source venv/bin/activate
exec gunicorn -b 0.0.0.0:3004 --log-file /app/logs/gunicorn.log  --error-logfile - --timeout 120 --log-level debug --keep-alive 5 wsgi:app
