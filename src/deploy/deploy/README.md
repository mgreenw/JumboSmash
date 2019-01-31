# Deploy

Deploy is a node based webserver that exposes endpoints related to project gem's deployment processes. It mainly serves to control the updating of containers and various environments.

* When a new application image is pushed to a dockerhub repository, dockerhub automatically sends a `POST` request to the api endpoint specified in the dockerhub repository's settings.

* That endpoint is defined in `app.js` and can contain any logic associated with the building of a new image such as:
  * Automatically pull down the new image, stop the old one, and start the new one.  
  * Wait a specific amount of time to pull down the new image, stop the old one, and start the new one.
  * Log relevant information internally and externally.

### Deployment Procedures

These are the various deployment flows for each service.

* **koh**

* **arthura**
  1. A new website image is built
  2. Automatically pull down the new image from dockerhub.
  3. Stop the current container running the old image.
  4. Start a new container with the new image.

* **jumbosmash**

* **server**

#### Complications / TODOs

* Secure the deploy webhook endpoints.
  * Right now, and likely for most of what we need to do, this server exposes unauthenticated webhooks for automatic deployment.
  * It's not ideal since an attacker if they knew the endpoints could trigger unplanned behavior or constantly trigger code.
  * Solutions could include rate limiting, token authentication (not sure we have the control necessary here), or verifying the dockerhub host somehow.

#### Getting Started Locally
TODO
