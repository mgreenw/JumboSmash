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
    "profile": {
        "displayName": "Max Greenwald",
        "birthday": "1997-10-10",
        "bio": "Cool",
        "image1Url": "https://static1.squarespace.com/static/55ba4b1be4b03f052fff1bf7/t/5a0a3ba04192029150cb2aeb/1510620084146/bubs-max.jpg?format=1000w",
        "image2Url": null,
        "image3Url": null,
        "image4Url": null
    }
}
```

## Error Responses

If the user does not have a profile, this endpoint will respond with one of the
generic authentication or profile not created responses. See the main  doc
`README.md` for more information.
