# Get Conversation

Get the messages in a converasation with another user

**URL** : `/api/conversations/:userId`

**Method** : `GET`

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
  * Description: The user id of the user in which the requesting user is in a conversation with
  * Required: `true`

**Query Paramaters**:
* `most-recent-message-id`
  * Type: `number`
  * Description: The id of the most recent message the client has in the conversation
  * Required: `false`
  * Note: The endpoint will return all messages AFTER the message with the given id in the conversation. This shortens API response body sizes.

## Success Response

**Condition**: The conversation exists.

**Code**: `200 OK`

**Content Example**:

```json
{
    "status": "GET_CONVERSATION__SUCCESS",
    "data": {
        "messages": [
            {
                "messageId": 13,
                "content": "aoeuaoeu",
                "timestamp": "2019-01-27T16:53:43.337Z",
                "sender": "client"
            },
            {
                "messageId": 14,
                "content": "aoeuaoeu",
                "timestamp": "2019-01-27T16:54:02.715Z",
                "sender": "match"
            },
            {
                "messageId": 15,
                "content": "aoeuaoeu",
                "timestamp": "2019-01-27T17:04:50.704Z",
                "sender": "client"
            }
        ],
        "readReceipt": {
            "messageId": 14,
            "timestamp": "2019-01-27T17:04:50.704Z"
        },
        "conversationIsRead": false
}
```

### OR

```json
{
    "status": "GET_CONVERSATION__SUCCESS",
    "data": {
        "messages": [
            {
                "messageId": 13,
                "content": "aoeuaoeu",
                "timestamp": "2019-01-27T16:53:43.337Z",
                "sender": "client"
            },
            {
                "messageId": 14,
                "content": "aoeuaoeu",
                "timestamp": "2019-01-27T16:54:02.715Z",
                "sender": "match"
            },
            {
                "messageId": 15,
                "content": "aoeuaoeu",
                "timestamp": "2019-01-27T17:04:50.704Z",
                "sender": "client"
            }
        ],
        "readReceipt": null,
        "conversationIsRead": false
}
```

## Error Response

**Condition** :The most recent message id is malformed (not a positive integer)

**Code** : `400 BAD REQUEST`

**Content**

```json
{
    "status": "GET_CONVERSATION__INVALID_MOST_RECENT_MESSAGE_ID"
}
```
