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
    "candidates": [
        {
            "userId": 4,
            "displayName": "Tony",
            "birthday": "1996-11-13",
            "bio": "The Real President",
            "image1Url": "https://static1.squarespace.com/static/55ba4b1be4b03f052fff1bf7/t/5a0a3ba04192029150cb2aeb/1510620084146/bubs-max.jpg?format=1000w",
            "image2Url": null,
            "image3Url": null,
            "image4Url": null
        },
        {
            "userId": 2,
            "displayName": "Monaco",
            "birthday": "1997-08-12",
            "bio": "Mr. President",
            "image1Url": "https://static1.squarespace.com/static/55ba4b1be4b03f052fff1bf7/t/5a0a3ba04192029150cb2aeb/1510620084146/bubs-max.jpg?format=1000w",
            "image2Url": null,
            "image3Url": null,
            "image4Url": null
        }
    ]
}
```

## Error Responses

There are no specific error conditions for this endpoint.
