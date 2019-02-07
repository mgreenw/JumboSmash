# Get Matches

Get the current user's matches across all scenes. Exclude any blocked users
in either direction, and include a list of the scenes in which the users are matched.
Return the result as an unordered list. NOTE: The ordering of the result will most likely change
with messaging, such that the results will be order in the order of matches with no messages, which
will be ordered by the date of the match (aka the most recent swipe date) followed by the order
of most recent message.

**URL** : `/api/relationships/matches`

**Method** : `GET`

**Auth required** : YES

**Permissions required** : Any user with a profile

**Request Headers**

Provide the normal `Authorization` token in the request header.

* `Authorization`
  * Type: `string`
  * Description: Auth token from `/api/auth/verify`
  * Required: `true`

## Success Response

**Condition** : The current user exists and has a profile.

**Code** : `200 OK`

**Content example**

```json
{
    "status": "GET_MATCHES__SUCCESS",
    "data": [
        {
            "userId": 6,
            "profile": {
                "fields": {
                     "displayName": "Emily",
                    "birthday": "1997-10-10",
                    "bio": "Cool"
                },
                "photoIds": [1, 2, 3]
            },
            "scenes": [
                "smash"
            ]
        },
        {
            "userId": 8,
            "profile": {
                "fields": {
                    "displayName": "Jacob",
                    "birthday": "1997-10-10",
                    "bio": "Cool"
                },
                "photoIds": [4, 5, 6]
            },
            "scenes": [
                "social",
                "stone"
            ]
        }
    ]
}
```

## Error Responses

There are no specific error conditions for this endpoint.
