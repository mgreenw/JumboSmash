# Report User

Send a report about another user.

**URL** : `/api/meta/report`

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

**Request body example**

```json
{
	"userId": 7,
	"message": "I am reporting this user because...",
}
```

## Success Response

**Condition** : If the report was completed successfully.

**Code** : `200 OK`

**Content Example**

```json
{
    "status": "REPORT_USER__SUCCESS",
}
```

## Error Responses

**Condition** : The user that is being reported does not exist

**Code** : `404 NOT FOUND`

**Content** :
```json
{
    "status": "REPORT_USER__NOT_FOUND"
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
