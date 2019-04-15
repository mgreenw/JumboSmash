# Get Artist

Get an artist by Spotify id.

**URL** : `/api/artists/:artistId`

**Method** : `GET`

**Auth required** : YES

**Admin required** : NO

**Permissions required** : Any user with a profile.

**Request Headers**

Provide the normal `Authorization` token in the request header.

* `Authorization`
  * Type: `string`
  * Description: Auth token from `/api/auth/verify`
  * Required: `true`


## Success Response

**Condition** : The artist exists.

**Code** : `200 OK`

**Content example**

```json
{
    "status": "GET_ARTIST__SUCCESS",
    "data": {
        "artist": {
            "external_urls": {
                "spotify": "https://open.spotify.com/artist/2TI7qyDE0QfyOlnbtfDo7L"
            },
            "followers": {
                "href": null,
                "total": 1012882
            },
            "genres": [
                "jam band",
                "neo mellow",
                "pop rock"
            ],
            "href": "https://api.spotify.com/v1/artists/2TI7qyDE0QfyOlnbtfDo7L",
            "id": "2TI7qyDE0QfyOlnbtfDo7L",
            "images": [
                {
                    "height": 640,
                    "url": "https://i.scdn.co/image/925ec2ed973dc956f2b13ad171334538463bafa7",
                    "width": 640
                },
                {
                    "height": 320,
                    "url": "https://i.scdn.co/image/9960cc6a5cfc3990b05e198a32d58bce9103cf1f",
                    "width": 320
                },
                {
                    "height": 160,
                    "url": "https://i.scdn.co/image/de438a4da43c165505cf1dc1ecac5e49f3028585",
                    "width": 160
                }
            ],
            "name": "Dave Matthews Band",
            "popularity": 71,
            "type": "artist",
            "uri": "spotify:artist:2TI7qyDE0QfyOlnbtfDo7L"
        }
    },
    "version": "1.4.1"
}
```

## Error Responses

**Condition** : The artist id is not found from Spotify

**Code** : `404 NOT FOUND`

**Content**

```json
{
    "status": "GET_ARTIST__NOT_FOUND"
}
```
