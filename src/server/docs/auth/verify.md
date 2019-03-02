# Verify

Verify/login a user given their utln and the code sent to their emil

**URL** : `/api/auth/verify`

**Method** : `POST`

**Auth required** : NO

**Permissions required** : None

**Request body fields**

Provide the user's Tufts utln and the 6 digit numeric code that was sent to their email.

* `utln`
  * Type: `string`
  * Description: 8 character Tufts EMAIL
  * Required: `true`
* `code`
  * Type: `string`
  * Description: 6 digit numeric code sent to the user's email.
  * Required: `true`
* `expoPushToken`
  * Type: `string`
  * Description: The push token that expo gives on mobile
  * Required: `false`

**Request body example**

```json
{
    "utln": "mgreen14",
    "code": 26405
}
```

### OR

```json
{
    "utln": "mgreen14",
    "code": 26405,
    "expoPushToken": "xasonetuhaoesuntaohexnahbqe;suntadoeu"
}
```

## Success Response

**Condition** : If the utln is valid and the code matches the code that was sent to the user's email.

**Code** : `200 OK`

**Content Example**

```json
{
    "status": "VERIFY__SUCCESS",
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NiwiaWF0IjoxNTQwNDA0MDU2LCJleHAiOjE1NzE5NDQwNTZ9.3ae7z225ariCP1yItpiY-IxuFkEiFFOmdPlHn9y5AFM"
}
```

## Error Responses

**Condition** : The code is expired (after 10 minutes of email send) or too many attempts have been made on the code (more than 3).

**Code** : `400 BAD REQUEST`

**Content Example**

```json
{
    "status": "VERIFY__EXPIRED_CODE"
}
```

### OR

**Condition** : A valid code exists for the supplied utln but the code given is incorrect.

**Code** : `400 BAD REQUEST`

**Content Example**

```json
{
    "status": "VERIFY__BAD_CODE"
}
```

### OR

**Condition** : If the required fields are not supplied.

**Code** : `400 BAD REQUEST`

**Content example**

```json
{
    "status": "BAD_REQUEST",
    "message": "data should have required property 'code'"
}
```
