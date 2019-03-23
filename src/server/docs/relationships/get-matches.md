# Get Matches

Get the current user's matches across all scenes. Exclude any blocked users
in either direction, and include a list of the scenes in which the users are matched.
The results are ordered by 1) most recent messages, with no messages coming first then 2) for the matches with no messages, by the date of the most recent match with the user.

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
            "scenes": {
                "smash": "2019-01-27 13:25:43.162-05",
                "social": null,
                "stone": null
            },
            "mostRecentMessage": {
                "messageId": 2,
                "content": "Well hello there",
                "timestamp": "2019-02-17T16:01:08.078696",
                "sender": "match"
            }
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
            "scenes": {
                "smash": null,
                "social": "2019-01-27 13:25:43.162-05",
                "stone": null
            },
            "mostRecentMessage": null
        }
    ]
}
```

## Error Responses

There are no specific error conditions for this endpoint.
