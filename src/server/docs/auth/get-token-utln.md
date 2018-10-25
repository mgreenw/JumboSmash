# Get Token UTLN

Get the

**URL** : `/api/auth/get-token-utln`

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

**Condition** : If the token is valid.

**Code** : `200 OK`

**Content example**

```json
{
    "status": "AUTHORIZED",
    "utln": "mgreen14"
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
