# Ban User

Ban a user. The user will no longer be able to use JumboSmash and will be logged out.

NOTE: This will automatically post an update to #admin in slack.

**URL** : `/api/admin/ban/:userId`

**Method** : `POST`

**Auth required** : YES

**Admin required** : YES

**Permissions required** : Any user with a profile

**Request Headers**

Provide the normal `Authorization` token in the request header. Additionally, include `Admin-Authorization` with the admin's password.

* `Authorization`
  * Type: `string`
  * Description: Auth token from `/api/auth/verify`
  * Required: `true`
* `Admin-Authorization`
  * Type: `string`
  * Description: The admin's password
  * Required: `true`

**Request body fields**

* `reason`
  * Type: `string`
  * Description: The reason to ban the user. This should be an enum of sorts.
  * Required: `true`

**Request body example**

```json
{
  "reason": "SPAM_OR_SCAM"
}
```

## Success Response

**Condition** : The list of all classmates

**Code** : `200 OK`

**Content Example**

```json
{
    "status": "BAN_USER__SUCCESS",
    "version": "1.3.1"
}
```

## Error Responses

**Condition** : The given userId does not exist.

**Code** : `400 BAD REQUEST`

**Content example**

```json
{
    "status": "BAN_USER__USER_NOT_FOUND",
    "version": "1.3.1"
}
```

### OR

**Condition** : The user is already banned. The reason has not been updated.

**Code** : `409 CONFLICT`

**Content example**

```json
{
    "status": "BAN_USER__ALREADY_BANNED",
    "version": "1.3.1"
}
```
