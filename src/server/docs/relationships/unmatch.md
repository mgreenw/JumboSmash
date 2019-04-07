# Unmatch

Unmatch another user. This endpoint will remove all likes for both users on each other so each user must re-match again. The two users must already be matched to call this endpoint.

**URL** : `/api/relationships/unmatch/:matchUserId`

**Method** : `POST`

**Auth required** : YES

**Permissions required** : A user with a profile setup.

**URL Paramaters**:
* `matchUserId`
  * Type: `number`
  * Description: The userId of the match to unmatch with
  * Required: `true`

**Request body example**

Anything you want.

## Success Response

**Condition** : If the unmatch was completed successfully.

**Code** : `200 OK`

**Content Example**

```json
{
    "status": "UNMATCH__SUCCESS",
}
```

## Error Responses

**Condition** : The user represented by matchUserId is not matched with the requesting user.

**Code** : `403 FORBIDDEN`

**Content** :
```json
{
    "status": "UNMATCH__NOT_MATCHED"
}
```
