# Check Token Valid

Check if an authentication token is valid. Additionally, check that the supplied utln that corresponds to that token matches.

**URL** : `/api/auth/check-token-valid`

**Method** : `POST`

**Auth required** : NO

**Permissions required** : None

**Request body fields**

Provide the token string as well as the utln of the account associed with that token.

* `utln`
  * Type: `string`
  * Description: 8 character Tufts UTLN
  * Required: `true`
* `token`
  * Type: `string`
  * Description: Auth token from `/api/auth/verify`
  * Required: `true`

**Request body example** All fields must be sent.

```json
{
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NiwiaWF0IjopNTQwNDAyNDA0LCJleHAiOjE1NzE5NDI0MDR9.fjEgYTiGlnAEDYUlSR6SPgKWT1f3d2JfJ4Cjjyt-KkI",
    "utln": "mgreen14"
}
```

## Success Response

**Condition** : If the token is valid and the user account matches the supplied UTLN.

**Code** : `200 OK`

**Content**

```json
{
    "status": "AUTHORIZED"
}
```

## Error Responses

**Condition** : If the token is expired, invalid, or does not match the UTLN.

**Code** : `401 UNAUTHORIZED`

**Headers** : None.

**Content** :
```json
{
    "status": "UNAUTHORIZED"
}
```

### Or

**Condition** : If the required fields are not supplied.

**Code** : `400 BAD REQUEST`

**Content example**

```json
{
    "status": "BAD_REQUEST",
    "message": "data should have required property 'utln'"
}
```
