# Get My Profile

Get the current user's profile, based on the user's auth token.
This endpoint is an alias for calling `GET /api/users/:userId/profile` where
`userId` is the current user's id which is inferred using the authentication
token.

**URL** : `/api/users/me/profile`

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
    "status": "GET_PROFILE__SUCCESS",
    "data": {
        "fields": {
            "displayName": "Max",
            "birthday": "1999-01-27",
            "bio": "Already has 2 friends so..."
        },
        "photoUuids": [
            "aad898e5-f5fb-458a-a415-b85182e6b564"
        ]
    }
}
```

## Error Responses

If the user does not have a profile, this endpoint will respond with one of the
generic authentication or profile not created responses. See the main  doc
`README.md` for more information.
