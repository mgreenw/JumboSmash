# Terminate User

Terminate a user. The user will no longer be able to use JumboSmash and will be logged out.

NOTE: This will automatically post an update to #admin in slack.

**URL** : `/api/admin/classmates/:userId/terminate`

**Method** : `POST`

**Auth required** : YES

**Admin required** : YES

**Permissions required** : Any admin with a profile

**Request Headers**

Provide the normal `Authorization` token in the request header. Additionally, include `Admin-Authorization` with the admin's password.

* `Authorization`
  * Type: `string`
  * Description: Auth token from `/api/auth/verify`
  * Required: `true`
* `Admin-Authorization`
  * Type: `string`
  * Description: The admin's password
  * Required: `true`

**Request body fields**

* `reason`
  * Type: `string`
  * Description: The reason to terminate the user. This should be an enum of sorts.
  * Required: `true`

**Request body example**

```json
{
  "reason": "SPAM_OR_SCAM"
}
```

## Success Response

**Condition** : The list of all classmates

**Code** : `200 OK`

**Content Example**

```json
{
    "status": "TERMINATE_USER__SUCCESS",
    "data": {
        "classmate": {
            "id": 1,
            "utln": "jfasse01",
            "email": "Julia.Fasse@tufts.edu",
            "isTerminated": true,
            "canBeSwipedOn": false,
            "canBeActiveInScenes": true,
            "accountUpdates": [
                {
                    "update": {
                        "type": "ACCOUNT_TERMINATION",
                        "admin": {
                            "id": 2469,
                            "utln": "jjaffe01"
                        },
                        "reason": "BAD_PERSON"
                    },
                    "timestamp": "2019-04-14T23:15:15.995Z"
                }
            ],
            "profileStatus": "unreviewed",
            "hasProfile": true,
            "activeScenes": {
                "smash": true,
                "social": true,
                "stone": false
            },
            "isAdmin": false,
            "blockedRequestingAdmin": false
        }
    },
    "version": "1.5.0"
}
```

## Error Responses

**Condition** : The given userId does not exist.

**Code** : `400 BAD REQUEST`

**Content example**

```json
{
    "status": "TERMINATE_USER__USER_NOT_FOUND",
    "version": "1.3.1"
}
```

### OR

**Condition** : The user is already terminated. The reason has not been updated.

**Code** : `409 CONFLICT`

**Content example**

```json
{
    "status": "TERMINATE_USER__ALREADY_TERMINATED",
    "version": "1.3.1"
}
```
