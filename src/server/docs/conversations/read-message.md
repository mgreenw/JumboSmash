# Read Message

Read a message. This will update the read receipt for the other user via a socket update.

NOTE: System messages SHOULD BE READ in order to remove the badge for that conversation. However, they will not show up as a read receipt for the other user.

**URL** : `/api/conversations/:matchUserId/messages/:messageId`

**Method** : `PATCH`

**Auth required** : YES

**Permissions required** : Any user with profile.

**Request Headers**

Provide the normal `Authorization` token in the request header.

* `Authorization`
  * Type: `string`
  * Description: Auth token from `/api/auth/verify`
  * Required: `true`

**URL Paramaters**:
* `matchUserId`
  * Type: `number`
  * Description: The conversation's match user id in which the message resides
  * Required: `true`
* `messageId`
  * Type: `number`
  * Description: The message id to read
  * Required: `true`

**Request body fields**

No request body

## Success Response

**Condition**: The other user exists, a match exists, and the message was successfully read.

**Code**: `200 OK`

**Content Example**:

```json
{
    "status": "READ_MESSAGE__SUCCESS"
}
```

## Error Response

**Condition**: There was a failure in reading the message. See the "message" and "code" for more details.

**Code** : `409 CONFLICT`

**Content Example**

```json
{
    "status": "READ_MESSAGE__FAILURE",
    "data": {
        "message": "Cannot read the same message twice.",
        "code": "ALREADY_READ_MESSAGE"
    }
}
```

##### Failure Codes
The codes are as follows. They are divided into two categories: ones to potentially handle on mobile and ones that should really never be returned by this endpoint. The ones that should not be returned are safety checks by the database but would be very hard to reach from this endpoint.

NOTE: These are defined under one status `READ_MESSAGE__FAILURE` because these codes come directly from the database. We could return something like `READ_MESSAGE__NOT_FROM_SYSTEM_OR_MATCH`, but it would not work with our current status code definitions file because these constants are not declared in JavaScript code and do not contain status codes. Therefore, they are returned under this `READ_MESSAGE__FAILURE` case so this error could be handled generically or it could be essentially ignored. If mobile wants to use these very specific errors, they are more than welcome.

###### Likely Codes
  - `CANNOT_READ_SENT_MESSAGE` - The message is not the supplied match or the system.
  - `ALREADY_READ_MESSAGE` - The message has already been read.
  - `GIVEN_MESSAGE_BEFORE_CURRENTLY_READ_MESSAGE` - The message was sent before the currently read message.
  - `MESSAGE_NOT_IN_CONVERSATION` - The message is not in the conversation between the requesting user and the supplied match.

###### Unlikely Codes
  - `READ_TIMESTAMP_BEFORE_MESSAGE_TIMESTAMP` - The read timestamp is before the message's timestamp.
  - `NEW_TIMESTAMP_BEFORE_OLD_TIMESTAMP` - The read timestamp (now) is before the previous read timestamp (should have been sometime in the past).

###### Impossible Codes
 - `CANNOT_READ_SYSTEM_MESSAGE` - A system message technically cannot be part of a read receipt. However, we allow them to be read because it reading it should remove the notification.
 - `CANNOT_DELETE_READ_RECEIPT` - The `critic_read_message_id` is null but was not before.

### OR

**Condition**: The requesting user is not matched with the matchUserId

**Code** : `400 BAD REQUEST`

**Content Example**

```json
{
    "status": "READ_MESSAGE__NOT_MATCHED"
}
```

### OR

**Condition**: The given message does not exist in the messages table.

**Code** : `400 BAD REQUEST`

**Content Example**

```json
{
    "status": "READ_MESSAGE__MESSAGE_NOT_FOUND"
}
```
