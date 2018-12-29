# Deploy

Deploy is a python based webserver that exposes endpoints related to project gem's deployment processes. It mainly serves to control the updating of containers and various environments.

* When a new application image is pushed to a dockerhub repository, dockerhub automatically sends a `POST` request to the api endpoint specified in the dockerhub repository's settings.

* That endpoint is defined in `deploy.py` and can contain any logic associated with the building of a new image such as:
  * Automatically pull down the new image, stop the old one, and start the new one.  
  * Wait a specific amount of time to pull down the new image, stop the old one, and start the new one.
  * Log relevant information internally and externally.


#### Complications / TODOs

* Secure the deploy webhook endpoints.
  * Right now, and likely for most of what we need to do, this server exposes unauthenticated webhooks for automatic deployment.
  * It's not ideal since an attacker if they knew the endpoints could trigger unplanned behavior or constantly trigger code.
  * Solutions could include rate limiting, token authentication (not sure we have the control necessary here), or verifying the dockerhub host somehow.

#### Getting Started Locally

In order to test locally one needs to have a python3 binary set to the default `python` path. One can check they have the right python version by invoking the interpreter with `python`. Once confirmed,

1. Create a virtual environment with `python -m venv .venv`
2. Activate the virtual environment with `. .venv/bin/activate` in the directory with the `.venv` folder.
3. Upgrade pip with `pip install --upgrade pip setuptools`
4. Install the dependencies with `pip install -r requirements.txt`
5. Run locally with `python deploy.py`

While running the server locally as instructed above, flask uses its internal web server. In production however, the flask application sits behind a gunicorn web server. To run gunicorn as well as the flask app, run the `sh boot.sh` script.

On the distinction between a web server and a web framework in the context of python, this is a decent [resource](https://docs.python-guide.org/scenarios/web/).
