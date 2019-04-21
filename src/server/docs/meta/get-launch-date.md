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
        "launchDate": "2019-04-18T04:23:49.561Z"
    },
    "version": "1.6.1"
}
```

