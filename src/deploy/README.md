# Deploy

Deploy is a python library that handles some considerations of our deployment process.
 
1) It documents the necessary files to deploy our various applications and environments. 

2) It exposes a webserver whose endpoints allow dockerhub to [automatically](https://docs.docker.com/docker-hub/webhooks/) send `POST` requests and information to it. 
When a new application image is pushed to a dockerhub repository, dockerhub sends a `POST` request to the endpoint specified in the dockerhub repository's settings.
    That endpoint is defined in `app.py` and can contain any logic associated with a new image.

    We can:
    
    1. Automatically pull down the new image, stop the old one, and start the new one.  
    2. Wait a specific amount of time to pull down the new image, stop the old one, and start the new one.
    3. Log the new image push locally
    4. Log the new image push to an external logging service via http.  
    5. Interact with deployment processes over http (if ever desired)
    
    Complications / TODOs:
    
    1. Secure the deploy webhook endpoints. Right now, and likely for most of what we need to do, this server simply exposes webhooks for automatic deployment. It's not ideal since an attacker if they knew the endpoints could trigger unplanned behavior. Might be worth authenticating these down the road or especially if we add other functionality to the service.   