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

Provide the yak content.

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
        "yakPostAvailability": {
            "yaksRemaining": 2,
            "nextPostTimestamp": "2019-05-12T19:30:23.171Z"
        },
        "yak": {
            "id": 29,
            "score": 1,
            "content": "test-yak",
            "timestamp": "2019-05-11T19:30:23.171Z",
            "postedByClient": true,
            "clientVote": true
        }
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
        "yakPostAvailability": {
            "yaksRemaining": 0,
            "nextPostTimestamp": "2019-05-12T19:30:23.171Z"
        }
    },
    "version": "2.3.2"
}
```
