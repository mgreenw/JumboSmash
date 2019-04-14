# Python client


The python client is used as auxilarily testing client to validate and test with something other then jmeter.



## Getting Started


1. Make sure `virtualenv` is installed via pip at a global scope.
2. Create a virtualenv with `virtualenv -p python3 env`
3. Activate the environment with `source env/bin/activate`
4. Navigate to this directory
5. Install dependencies with `pip install -r requirements.txt`
6. Define the test you want to run in the `thread_entrypoint` function.
7. Run `python main.py`
