# Block

Block another user. The user to be blocked will be immediately unmatched from the requesting user and not allowed to view the requesting user's profile

**URL** : `/api/relationships/block`

**Method** : `POST`

**Auth required** : YES

**Permissions required** : A user with a profile setup.

**Request body fields**

* `blockedUserId`
  * Type: `integer`
  * Description: The id of the user to block
  * Required: `true`

**Request body example**

```json
{
	"blockedUserId": 7
}
```

## Success Response

**Condition** : If the block was completed successfully.

**Code** : `200 OK`

**Content Example**

```json
{
    "status": "BLOCK__SUCCESS",
}
```

## Error Responses

**Condition** : The user to block does not exist

**Code** : `400 BAD REQUEST`

**Content** :
```json
{
    "status": "JUDGE__CANDIDATE_NOT_FOUND"
}
```

### OR

**Condition** : The request body is invalid.

**Code** : `400 BAD REQUEST`

**Content Example** :
```json
{
    "status": "BAD_REQUEST",
    "message": "data.blockedUserId should be multiple of 1"
}
```
