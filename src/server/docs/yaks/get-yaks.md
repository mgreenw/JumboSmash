# Get Yaks

Get the yaks from the last 24 hours.

**URL** : `/api/yaks`

**Method** : `GET`

**Auth required** : YES

**Permissions required** : Any authenticated user with a profile.

**Request Headers**

Provide the normal `Authorization` token in the request header.

* `Authorization`
  * Type: `string`
  * Description: Auth token from `/api/auth/verify`
  * Required: `true`

## Success Response

**Condition**: The yaks have been retrieved.

**Code**: `200 OK`

**Content Example**:

```json
{
    "status": "GET_YAKS__SUCCESS",
    "data": {
        "yaks": [
            {
                "id": 15,
                "score": 1,
                "content": "test-yak",
                "timestamp": "2019-05-11T17:48:01.882Z",
                "postedByClient": true,
                "clientVote": true
            },
            {
                "id": 16,
                "score": 1,
                "content": "test-yak",
                "timestamp": "2019-05-11T17:59:18.862Z",
                "postedByClient": true,
                "clientVote": true
            },
            {
                "id": 17,
                "score": 1,
                "content": "test-yak",
                "timestamp": "2019-05-11T17:59:58.845Z",
                "postedByClient": true,
                "clientVote": true
            }
        ]
    },
    "version": "2.3.2"
}
```
