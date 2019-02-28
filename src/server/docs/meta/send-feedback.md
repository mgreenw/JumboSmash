# Report User

Send a report about another user.

**URL** : `/api/meta/feedback`

**Method** : `POST`

**Auth required** : YES

**Permissions required** : Any user.

**Request body fields**

* `message`
  * Type: `string`
  * Description: The feedback message to send
  * Required: `true`
* `reasonCode`
  * Type: `string`
  * Description: The standardized reason code for the feedback. Must be < 100 chars
  * Required: `true`

**Request body example**

```json
{
    "message": "Here is some helpful feedback!!",
    "reasonCode": "BAD_APP"
}
```

## Success Response

**Condition** : If the feedback was sent successfully.

**Code** : `200 OK`

**Content Example**

```json
{
    "status": "SEND_FEEDBACK_SUCCESS",
}
```

## Error Responses

**Condition** : One of the request body fields is invalid.

**Code** : `400 BAD REQUEST`

**Content Example** :
```json
{
    "status": "BAD_REQUEST",
    "message": "data.message should be a string"
}
```
