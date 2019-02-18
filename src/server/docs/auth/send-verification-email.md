# Send Verification Email

Send a verification email to the user with the given UTLN.

**URL** : `/api/auth/send-verification-email`

**Method** : `POST`

**Auth required** : NO

**Permissions required** : None

**Request body fields**

Provide the user's Tufts utln. If the user would like to resend the email because they did not receieve it, include `forceResend` set to `true`.

* `email`
  * Type: `string`
  * Description: The user's Tufts email. Can be first.last@tufts.edu OR utln@tufts.edu
  * Required: `true`
* `forceResend`
  * Type: `boolean`
  * Description: Force email resend if possible
  * Required: `false`

**Request body example** Only UTLN

```json
{
    "email": "mgreen14@tufts.edu"
}
```

### OR

**Request body example** UTLN and forceResend

```json
{
    "utln": "max.greenwald@tufts.edu",
    "forceResend": true
}
```

## Success Response

**Condition** : If the utln is a valid Tufts UTLN and an email has been sent to the user.

**Code** : `200 OK`

**Content Example**

```json
{
    "status": "SEND_VERIFICATION_EMAIL__SUCCESS",
    "data": {
        "email": "Max.Greenwald@tufts.edu",
        "utln": "mgreen14"
    }
}
```

### OR

**Condition** : If the utln is a valid Tufts UTLN and an email has already been sent to the user. No `forceResend` was found in the request body.

**Code** : `200 OK`

**Content Example**

```json
{
    "status": "SEND_VERIFICATION_EMAIL__EMAIL_ALREADY_SENT",
    "data": {
        "email": "Max.Greenwald@tufts.edu",
        "utln": "mgreen14"
    }
}
```


## Error Responses

**Condition** : The UTLN is valid but not in the Class of 2019

**Code** : `400 BAD REQUEST`

**Content Example** :
```json
{
    "status": "SEND_VERIFICATION_EMAIL__UTLN_NOT_2019",
    "data": {
        "classYear": "20"
    }
}
```

### OR

**Condition** : The UTLN is valid but the member is not a student

**Code** : `400 BAD REQUEST`

**Content Example** :
```json
{
    "status": "SEND_VERIFICATION_EMAIL__UTLN_NOT_STUDENT"
}
```

### OR

**Condition** : The UTLN is valid but the member is not an undergraduate

**Code** : `400 BAD REQUEST`

**Content Example** :
```json
{
    "status": "SEND_VERIFICATION_EMAIL__UTLN_NOT_UNDERGRAD",
    "data": {
        "classYear": "19",
        "college": "THE FLETCHER SCHOOL"
    }
}
```

### OR

**Condition** : The UTLN is invalid (not found in the White Pages)

**Code** : `400 BAD REQUEST`

**Content** :
```json
{
    "status": "SEND_VERIFICATION_EMAIL__UTLN_NOT_FOUND"
}
```

### OR

**Condition** : If the required fields are not supplied.

**Code** : `400 BAD REQUEST`

**Content example**

```json
{
    "status": "BAD_REQUEST",
    "message": "data should have required property 'utln'"
}
```
