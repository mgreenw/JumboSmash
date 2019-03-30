# Read Message

Read a message. This will update the read receipt for the other user.

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
    "status": "READ_MESSAGE__SUCCESS",
    "data": {
        "readTimestamp": "2019-03-30T20:07:05.291Z"
    }
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
        "code": "CANNOT_REREAD_MESSAGE"
    }
}
```

##### Failure Codes
The codes are as follows. They are divided into two categories: ones to potentially handle on mobile and ones that should really never be returned by this endpoint. The ones that should not be returned are safety checks by the database but would be very hard to reach from this endpoint.

###### Likely Codes
  - `NOT_FROM_SYSTEM_OR_MATCH`
  - `ALREADY_READ_MESSAGE`
  - `GIVEN_MESSAGE_BEFORE_CURRENTLY_READ_MESSAGE`

###### Unlikely Codes
  - `RECEIPT_TIME_BEFORE_MESSAGE_TIMESTAMP`
  - `CANNOT_DELETE_READ_RECEIPT`
  - `NEW_TIMESTAMP_BEFORE_OLD_TIMESTAMP`

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
