# Get Scene Candidates

Get the current user's relationship candidates in the given scene. Return a list
of user profiles in order they should be displayed. Do not include blocked
users, users that are inactive in the given scene, and users that the requesting
user has already liked in that scene. This endpoint returns at most 10 results.

**URL** : `/api/relationships/candidates/:scene`

**URL Paramaters**:
* `scene`
  * Type: `string`
  * Description: The scene id that the user is requesting. Options: `['smash', 'social', 'stone']`
  * Required: `true`

**Query Paramaters**:
* `exclude[]`
  * Type: `number`
  * Description: A user id to exclude from the candidate list
  * Required: `false`
  * Note: Multiple `exclude[]` parameters can be included in one query (it becomes an array). E.g. `?exclude[]=1&exclude[]=2`

**Method** : `GET`

**Auth required** : YES

**Permissions required** : Any user with a profile

**Request Headers**

Provide the normal `Authorization` token in the request header.

* `Authorization`
  * Type: `string`
  * Description: Auth token from `/api/auth/verify`
  * Required: `true`

## Success Response

**Condition** : The current user exists and has a profile.

**Code** : `200 OK`

**Content example**

```json
{
    "status": "GET_SCENE_CANDIDATES__SUCCESS",
    "data": [
        {
            "userId": 2,
            "profile": {
                "fields": {
                    "displayName": "Anthony",
                    "birthday": "2019-02-19",
                    "bio": "He is the president"
                },
                "photoUuids": ["5e6f2885-8539-4460-a7f0-af80eef662cf"]
            }
        }
    ]
}
```

## Error Responses

**Condition** : The scene requested does not exist.

**Code** : `400 BAD REQUEST`

**Content** :
```json
{
    "status": "GET_SCENE_CANDIDATES__INVALID_SCENE"
}
```

### OR

**Condition** : The query string contains non-integers or is otherwise invalid.

**Code** : `400 BAD REQUEST`

**Content** :
```json
{
    "status": "BAD_REQUEST",
    "message": "Exclude parameters includes a non-integer"
}
```
