

import threading
import requests
import time
import pandas as pd

from timeit import default_timer as timer


results = []
errors = []


lock = threading.Lock()
error_lock = threading.Lock()

def create_header(token):
    return {'Authorization': token, 'Content-Type': 'application/json'}

def parse_users(csv='../test_data/dummy_staging_users.csv'):

    users = []
    df = pd.read_csv(csv)

    for index, row in df.iterrows():
        users.append(row)
    return users


def get_candidates(utln, token):

    headers = create_header(token)

    try:
        start = timer()
        res = requests.get('https://stagingserver.jumbosmash.com/api/relationships/candidates/smash', headers=headers)
        end = timer()

        code = res.status_code

        if code != 200:
            body = res.text
            with error_lock:
                errors.append({"utln": utln, "latency": end - start, "status_code": code, "body": body})
        else:
            body = res.json()
            with lock:
                results.append({"utln": utln, "latency": end - start, "status_code": code, "body": body})

    except Exception as e:
        errors.append({"utln": utln, "err": e})



def complete_profile(utln, token):

    headers = create_header(token)

    data = {'displayName': utln, "bio": "it's a damn fake profile", "birthday": "1997-01-04"}

    try:
        start = timer()
        res = requests.post('http://stagingserver.jumbosmash.com/api/users/me/profile/', headers=headers, json=data)
        end = timer()

        code = res.status_code

        if code != 201:
            body = res.text
            with error_lock:
                errors.append({"utln": utln, "latency": end - start, "status_code": code, "body": body})

        else:
            body = res.json()
            with lock:
                results.append({"utln": utln, "latency": end - start, "status_code": code, "body": body})

    except Exception as e:
        errors.append({"utln": utln, "err": e})


def thread_entrypoint(user):

    token = user['token']
    utln = user['utln']

    get_candidates(utln, token)


def spawn_threads(users):

    threads = [threading.Thread(target=thread_entrypoint, args=[user]) for user in users]

    for thread in threads:
        thread.start()
        time.sleep(0.01)

    for thread in threads:
        thread.join()

    #print(results)
    print("\n\n")
    print(errors)








if __name__ == '__main__':

    users = parse_users()
    spawn_threads(users)
