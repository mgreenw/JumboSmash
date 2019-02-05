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


## Success Response

**Condition**: The other user exists and the request is valid

**Code**: `200 OK`

**Content Example**:

```json
{
    "status": "SEND_MESSAGE__SUCCESS",
    "data": {
        "id": 17,
        "timestamp": "2019-01-27T17:43:51.031Z",
        "content": "haha",
        "senderUserId": 1,
        "receiverUserId": 6
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

**Condition**: The request body is invalid - the content is bad (not between 1 and 500 chars) or does not exist in the body

**Code** : `400 BAD REQUEST`

**Content**

```json
{
    "status": "BAD_REQUEST",
    "message": "data.content should NOT be shorter than 1 characters"
}
```
