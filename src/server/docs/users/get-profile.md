# Get Profile

Get a user's profile

**URL** : `/api/users/:userId/profile`

**URL Paramaters**:
* `userId`
  * Type: `integer`
  * Description: The id of the user whose profile is being requested
  * Required: `true`

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

**Condition** : The user with id `userId` exists, and has created a profile.

**Code** : `200 OK`

**Content example**

```json
{
    "status": "GET_PROFILE__SUCCESS",
    "profile": {
        "displayName": "Max Greenwald",
        "birthday": "1997-10-10",
        "bio": "Cool"
    }
}
```

## Error Responses

**Condition** : The provided user id is not an integer

**Code** : `400 BAD REQUEST`

**Content** :
```json
{
    "status": "GET_PROFILE__BAD_USER_ID"
}
```

### OR

**Condition** : The user does not exist or has not setup a profile

**Code** : `404 NOT FOUND`

**Content** :
```json
{
    "status": "GET_PROFILE__PROFILE_NOT_FOUND"
}
```
