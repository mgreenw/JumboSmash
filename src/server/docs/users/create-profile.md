# Create Profile

Create my profile. Only allow this if a user has not yet created a profile.

**URL** : `/api/users/me/profile`

**Method** : `POST`

**Auth required** : YES

**Permissions required** : A user with no profile setup.

**Request body fields**

Provide the user's initial profile fields.

* `displayName`
  * Type: `string`
  * Description: The user's preferred display name, ideally their first name
  * Required: `true`
* `birthday`
  * Type: `date (string)`
  * Description: Force email resend if possible
  * Required: `true`
* `image1Url`
  * Type: `boolean`
  * Description: Force email resend if possible
  * Required: `true`
* `image2Url`
  * Type: `boolean`
  * Description: Force email resend if possible
  * Required: `false`
* `image3Url`
  * Type: `boolean`
  * Description: Force email resend if possible
  * Required: `false`
* `image4Url`
  * Type: `boolean`
  * Description: Force email resend if possible
  * Required: `false`
* `bio`
  * Type: `boolean`
  * Description: Force email resend if possible
  * Required: `true`

**Request body example** Only UTLN

```json
{
    "utln": "mgreen14"
}
```

### OR

**Request body example** UTLN and forceResend

```json
{
    "utln": "mgreen14",
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
    "email": "Max.Greenwald@tufts.edu"
}
```

### OR

**Condition** : If the utln is a valid Tufts UTLN and an email has already been sent to the user. No `forceResend` was found in the request body.

**Code** : `200 OK`

**Content Example**

```json
{
    "status": "SEND_VERIFICATION_EMAIL__EMAIL_ALREADY_SENT",
    "email": "Max.Greenwald@tufts.edu"
}
```


## Error Responses

**Condition** : The UTLN is valid but not in the Class of 2019

**Code** : `400 BAD REQUEST`

**Headers** : None.

**Content** :
```json
{
    "status": "SEND_VERIFICATION_EMAIL__UTLN_NOT_2019"
}
```

### OR

**Condition** : The UTLN is invalid (not found in the White Pages)

**Code** : `400 BAD REQUEST`

**Headers** : None.

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
