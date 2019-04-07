# Get My Photos

Get the current user's settings, based on the user's auth token.

**URL** : `/api/users/me/photos`

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
    "status": "GET_MY_PHOTOS__SUCCESS",
    "data": [
        "70228bb4-9387-44d5-938c-46c3369e8ec0",
        "6ed8c5c4-251a-4933-912d-0143162d0d70",
        "fd246025-361b-48a0-b7c4-3193a67ddcd6"
    ]
}
```

## Error Responses

If the user has not created settings, this endpoint will respond with one of the
generic authentication or settings not created responses. See the main doc
`README.md` for more information.
