# Post Yak

Post a Yak.

**URL** : `/api/yaks`

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

* `content`
  * Type: `string`
  * Description: The yak content! Max 300 chars, min 5 chars (for now).
  * Required: `true`

**Request body example**

```json
{
	"content": "This is a yak",
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
