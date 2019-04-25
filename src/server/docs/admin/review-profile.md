# Review Profile

Review a user's profile.

NOTE: This may automatically post an update to #admin in slack.

**URL** : `/api/admin/classmates/:userId/review`

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

* `updatedCapabilites`
  * Type `object`
  * Description: The new capabilities to give a user
  * Requried: `true`
  * Properties:
    * `canBeSwipedOn`
        * Type: `boolean`
        * Description: If the user can be swiped on by other users
        * Required: `true`
    * `canBeActiveInScenes`
        * Type: `boolean`
        * Description: If the user can be active/can set themselves active in scenes.
        * Required: `true`
* `previousCapabilities`
  * Type `object`
  * Description: The previous capabilities the user had. This is used to ensure the admin does not overwrite capabilites changed by another admin without knowledge of the change.
  * Requried: `true`
  * Properties:
    * `canBeSwipedOn`
        * Type: `boolean`
        * Description: If the user can be swiped on by other users
        * Required: `true`
    * `canBeActiveInScenes`
        * Type: `boolean`
        * Description: If the user can be active/can set themselves active in scenes.
        * Required: `true`
* `comment`
  * Type: `boolean | null`: Cannot be null if either `canBeSwipedOn` or `canBeActiveInScenes` is false in `updatedCapabilites`
  * Description: If the user can be active/can set themselves active in scenes.
  * Required: `true`

**Request body example**

```json
{
    "updatedCapabilites": {
    	"canBeSwipedOn": false,
	"canBeActiveInScenes": true,
    },
    "previousCapabilities": {
        "canBeSwipedOn": false,
	"canBeActiveInScenes": false,
    },
    "comment": "Test review"
}
```

## Success Response

**Condition** : The review was successful.

**Code** : `200 OK`

**Content Example**

```json
{
    "status": "REVIEW_PROFILE__SUCCESS",
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
                        "type": "PROFILE_REVIEW",
                        "comment": "Test review",
                        "reviewer": {
                            "id": 2469,
                            "utln": "jjaffe01"
                        },
                        "canBeSwipedOn": false,
                        "canBeActiveInScenes": true
                    },
                    "timestamp": "2019-04-14T23:44:45.463Z"
                }
            ],
            "profileStatus": "reviewed",
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

**Condition** : The comment must not be null. See "Request Body Fields".

**Code** : `400 BAD REQUEST`

**Content example**

```json
{
    "status": "REVIEW_PROFILE__COMMENT_REQUIRED",
    "version": "1.3.1"
}
```

### OR

**Condition** : The user does not exist

**Code** : `404 NOT FOUND`

**Content example**

```json
{
    "status": "REVIEW_PROFILE__NOT_FOUND",
    "version": "1.3.1"
}
```

### OR

**Condition** : The previous capabilities supplied do not match the "current" capabilities (before update).

**Code** : `404 BAD REQUEST`

**Content example**

```json
{
    "status": "REVIEW_PROFILE__INVALID_PREVIOUS_CAPABILITES",
    "version": "1.3.1"
}
```
