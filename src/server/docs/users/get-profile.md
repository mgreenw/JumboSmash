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
        "display_name": "Max",
        "birthday": "1997-10-09",
        "bio": "I am a dev",
        "image1_url": "https://static1.squarespace.com/static/55ba4b1be4b03f052fff1bf7/t/5a0a3ba04192029150cb2aeb/1510620084146/bubs-max.jpg?format=1000w",
        "image2_url": null,
        "image3_url": null,
        "image4_url": null
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
