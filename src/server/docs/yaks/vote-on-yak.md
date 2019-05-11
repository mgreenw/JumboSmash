# Vote On Yak

Vote on a yak (up or down).

**URL** : `/api/yaks/:id`

**Method** : `PATCH`

**Auth required** : YES

**Permissions required** : Any authenticated user with a profile

**Request Headers**

Provide the normal `Authorization` token in the request header.

* `Authorization`
  * Type: `string`
  * Description: Auth token from `/api/auth/verify`
  * Required: `true`

**Request body fields**

* `liked`
  * Type: `string`
  * Description: If the user likes or not (up or down votes) the yak.
  * Required: `true`

**Request body example**

```json
{
	"liked": true
}
```

## Success Response

**Condition**: The user voted on the yak.

**Code**: `201 CREATED`

**Content Example**:

```json
{
    "status": "VOTE_ON_YAK__SUCCESS",
    "data": {
        "yak": {
            "id": 15,
            "score": 1,
            "content": "test-yak",
            "timestamp": "2019-05-11T17:48:01.882Z",
            "postedByClient": true,
            "clientVote": true
        }
    },
    "version": "2.3.2"
}
```

## Error Response

**Condition**: The yak was not found

**Code** : `404 NOT FOUND`

**Content**

```json
{
    "status": "VOTE_ON_YAK__YAK_NOT_FOUND",
    "version": "2.3.2"
}
```
