# Report Yak

Report a yak for bad content.

**URL** : `/api/yaks/:id/report`

**Method** : `POST`

**Auth required** : YES

**Permissions required** : Any authenticated user with a profile

**Request Headers**

Provide the normal `Authorization` token in the request header.

* `Authorization`
  * Type: `string`
  * Description: Auth token from `/api/auth/verify`
  * Required: `true`

**Request body fields**

Provide the message content and a unique uuid (v4) for the message that is generated client-side.

* `message`
  * Type: `string`
  * Description: The user's comment on the yak's content.
  * Required: `true`
* `reasonCode`
  * Type: `string`
  * Description: The standard reason why the content is bad (multiple choice).
  * Required: `true`

**Request body example**

```json
{
	"message": "Bad yak because it's dumb",
	"reasonCode": "NOT_GOOD"
}
```

## Success Response

**Condition**: The yak was posted.

**Code**: `201 CREATED`

**Content Example**:

```json
{
    "status": "POST_YAK__SUCCESS",
    "data": {
        "yak": {
            "id": 16,
            "score": 1,
            "content": "test-yak",
            "timestamp": "2019-05-11T17:59:18.862Z",
            "postedByClient": true,
            "clientVote": true
        },
        "remainingYaks": 1
    },
    "version": "2.3.2"
}
```

## Error Response

**Condition**: Too many yaks have been posted.

**Code** : `400 BAD REQUEST`

**Content**

```json
{
    "status": "POST_YAK__TOO_MANY_YAKS",
    "data": {
        "nextPostTimestamp": "2019-05-11T17:48:01.882Z"
    },
    "version": "2.3.2"
}
```
