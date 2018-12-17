FROM python:3.6-alpine

RUN adduser -D deploy

WORKDIR /home/deploy

COPY requirements.txt requirements.txt
RUN python -m venv venv
RUN venv/bin/pip install -r requirements.txt
RUN venv/bin/pip install gunicorn

COPY __init__.py config.py wsgi.py deploy.py boot.sh ./
RUN chmod +x boot.sh

ENV FLASK_APP deploy.py

RUN chown -R deploy:deploy ./
USER deploy

EXPOSE 3004
ENTRYPOINT ["./boot.sh"]
