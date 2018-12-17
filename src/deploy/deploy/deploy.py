#
#  app.py
#



from flask import Flask
from flask import request, Response

import subprocess

app = Flask(__name__)

#
# Home
#

@app.route('/')
def home():
    return 'Project Gem Deploy Service!'


#
# Gets called when new website image is pushed
#

@app.route('/website',  methods=['POST'])
def website():
    try:
        data = request.json()
        app.logger.info("New Website Image! \n{0}".format(data))
        subprocess.check_call('sh beta/beta.sh')
        return Response(status=200)
    except OSError as e:
        app.logger.error("Issue with Running script! \n{0}".format(e))
        return Response(status=400)
    except Exception as e:
        app.logger.error("Bad Request to /website \n{0}".format(e))
        return Response(status=400)


#
# Gets called when new koh image is pushed
#

@app.route('/koh',  methods=['POST'])
def koh():
    try:
        data = request.json()
        app.logger.info("New Image Pushed to Koh! \n{0}".format(data))
        return Response(status=200)
    except Exception as e:
        app.logger.error("Bad Request to /koh \n")
        return Response(status=400)


#
# Gets called when new server image is pushed
#

@app.route('/server',  methods=['POST'])
def server():
    try:
        data = request.json()
        app.logger.info("New Image Pushed to Server! \n{0}".format(data))
        return Response(status=200)
    except Exception as e:
        app.logger.error("Bad Request to /server \n")
        return Response(status=400)

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=3004)
