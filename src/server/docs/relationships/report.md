# Report

Send a report about another user. Optionally block the user at the same time

**URL** : `/api/relationships/report`

**Method** : `POST`

**Auth required** : YES

**Permissions required** : Any user.

**Request body fields**

* `userId`
  * Type: `integer`
  * Description: The userId of the user to report.
  * Required: `true`
* `message`
  * Type: `string`
  * Description: The message content to include in the report.
  * Required: `true`
* `reasonCode`
  * Type: `string` (< 100 chars)
  * Description: A standardized reason why the user is reported
  * Required: `true`
* `block`
  * Type: `boolean`
  * Description: Whether or not to block the user
  * Required: `true`

**Request body example**

```json
{
	"userId": 7,
    "message": "I am reporting this user because...",
    "reasonCode": "TOO_OLD",
    "block": true
}
```

## Success Response

**Condition** : If the report was completed successfully.

**Code** : `200 OK`

**Content Example**

```json
{
    "status": "REPORT__SUCCESS",
}
```

## Error Responses

**Condition** : The user that is being reported does not exist

**Code** : `404 NOT FOUND`

**Content** :
```json
{
    "status": "REPORT__USER_NOT_FOUND"
}
```

### OR

**Condition** : One of the request body fields is invalid.

**Code** : `400 BAD REQUEST`

**Content Example** :
```json
{
    "status": "BAD_REQUEST",
    "message": "data.message should be a string"
}
```
