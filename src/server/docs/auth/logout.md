# Logout

Logout the current user. Tnvalidate the user's login token and push token.

**URL** : `/api/auth/logout`

**Method** : `POST`

**Auth required** : YES

**Permissions required** : Any user.

**Request body**

No request body.

## Success Response

**Condition** : The logout was completed successfully.

**Code** : `200 OK`

**Content Example**

```json
{
    "status": "LOGOUT__SUCCESS",
}
```

## Error Responses

There are no specific error cases for this endpoint. If the logout failed, a generic response `SERVER_ERROR` or `UNAUTHORIZED` will be returned.
