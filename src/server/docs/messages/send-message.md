# Send Message

Send a message to another user

**URL** : `/api/messages/:userId`

**Method** : `POST`

**Auth required** : YES

**Permissions required** : Any authenticated user.

**Request Headers**

Provide the normal `Authorization` token in the request header.

* `Authorization`
  * Type: `string`
  * Description: Auth token from `/api/auth/verify`
  * Required: `true`

**URL Paramaters**:
* `userId`
  * Type: `number`
  * Description: The user id to send a message to
  * Required: `true`

**Request body fields**

Provide the message content and a unique uuid (v4) for the message that is generated client-side.

* `content`
  * Type: `string`
  * Description: The message content! Max 500 chars, min 1 char.
  * Required: `true`
* `unconfirmedMessageUuid`
  * Type: `string`
  * Description: The client uuid for the message, helpful for confirming the message has not been aquired in another location.
  * Required: `true`

**Request body example**

```json
{
	"content": "This is fun",
	"unconfirmedMessageUuid": "e27195f8-4451-4561-96a5-83e82ecc4dd3"
}
```

## Success Response

**Condition**: The other user exists and the request is valid

**Code**: `200 OK`

**Content Example**:

```json
{
    "status": "SEND_MESSAGE__SUCCESS",
    "data": {
        "messageId": 12,
        "timestamp": "2019-02-21T02:12:15.082Z",
        "content": "This is fun",
        "unconfirmedMessageUuid": "e27195f8-4451-4561-96a5-83e82ecc4dd4",
        "fromClient": true,
        "previousMessageId": 9
    }
}
```

### OR

**Condition**: Same as above, but there is no previous message in the conversation

**Code**: `200 OK`

**Content Example**:

```json
{
    "status": "SEND_MESSAGE__SUCCESS",
    "data": {
        "messageId": 12,
        "timestamp": "2019-02-21T02:12:15.082Z",
        "content": "This is fun",
        "unconfirmedMessageUuid": "e27195f8-4451-4561-96a5-83e82ecc4dd4",
        "fromClient": true,
        "previousMessageId": null
    }
}
```

## Error Response

**Condition**: The other user does not exist

**Code** : `400 BAD REQUEST`

**Content**

```json
{
    "status": "SEND_MESSAGE__USER_NOT_FOUND"
}
```

### OR

**Condition**: The unconfirmed message uuid is a duplicate of one already stored.

**Code** : `400 BAD REQUEST`

**Content Example**

```json
{
    "status": "SEND_MESSAGE__DUPLICATE_UNCONFIRMED_MESSAGE_UUID"
}
```

### OR

**Condition**: The request body is invalid - the content is bad (not between 1 and 500 chars) or does not exist in the body

**Code** : `400 BAD REQUEST`

**Content Example**

```json
{
    "status": "BAD_REQUEST",
    "message": "data.content should NOT be shorter than 1 characters"
}
```

### OR

**Condition**: The unconfirmed message uuid is not a valid uuid/v4

**Code** : `400 BAD REQUEST`

**Content Example**

```json
{
    "status": "BAD_REQUEST",
    "message": "data.unconfirmedMessageUuid should match format \"uuid\""
}
```
