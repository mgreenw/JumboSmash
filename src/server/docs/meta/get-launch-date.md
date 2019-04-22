# Get Token UTLN

Get the

**URL** : `/api/meta/launch-date`

**Method** : `GET`

**Auth required** : YES

**Permissions required** : Any user

**Request Headers**

Provide the normal `Authorization` token in the request header.

* `Authorization`
  * Type: `string`
  * Description: Auth token from `/api/auth/verify`
  * Required: `true`

## Success Response

**Condition** : Always if the user's token is valid

**Code** : `200 OK`

**Content example**

```json
{
    "status": "GET_LAUNCH_DATE__SUCCESS",
    "data": {
        "launchDate": "2019-04-23T19:20:37.883Z",
        "currentDate": "2019-04-22T19:21:34.294Z",
        "wallIsUp": true
    },
    "version": "1.9.0"
}
```

