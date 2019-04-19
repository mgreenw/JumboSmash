# Get My Settings

Get the current user's settings, based on the user's auth token.

**URL** : `/api/users/me/settings`

**Method** : `GET`

**Auth required** : YES

**Permissions required** : Any verified user.
**Request Headers**

Provide the normal `Authorization` token in the request header.

* `Authorization`
  * Type: `string`
  * Description: Auth token from `/api/auth/verify`
  * Required: `true`

## Success Response

**Condition** : The current user exists.

**Code** : `200 OK`

**Content example**

```json
{
    "status": "GET_SETTINGS__SUCCESS",
    "data": {
        "lookingForGenders": {
            "man": false,
            "woman": false,
            "nonBinary": false
        },
        "identifyAsGenders": {
            "man": false,
            "woman": false,
            "nonBinary": false
        },
        "activeScenes": {
            "smash": false,
            "social": false,
            "stone": false
        },
        "expoPushToken": "SOME_EXPO_TOKEN",
        "notificationsEnabled": true,
        "isAdmin": false,
        "canBeActiveInScenes": true
    }
}
```

## Error Responses

If the user has not created settings, this endpoint will respond with one of the
generic authentication or settings not created responses. See the main doc
`README.md` for more information.
