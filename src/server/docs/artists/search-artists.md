# Search artists

Search for an artist by name and get a list of results ordered by relevence.

**URL** : `/api/artists?name=Dave%20Matthews%20Band`

**Method** : `GET`

**Auth required** : YES

**Admin required** : YES

**Permissions required** : Any user with a profile.

**Request Headers**

Provide the normal `Authorization` token in the request header.

* `Authorization`
  * Type: `string`
  * Description: Auth token from `/api/auth/verify`
  * Required: `true`


## Success Response

**Condition** : The search succeeded. NOTE: Artists can be an empty array.

**Code** : `200 OK`

**Content example**

```json
{
    "status": "SEARCH_ARTISTS__SUCCESS",
    "data": {
        "artists": [
            {
                "external_urls": {
                    "spotify": "https://open.spotify.com/artist/1uNFoZAHBGtllmzznpCI3s"
                },
                "followers": {
                    "href": null,
                    "total": 27209384
                },
                "genres": [
                    "canadian pop",
                    "dance pop",
                    "pop",
                    "post-teen pop"
                ],
                "href": "https://api.spotify.com/v1/artists/1uNFoZAHBGtllmzznpCI3s",
                "id": "1uNFoZAHBGtllmzznpCI3s",
                "images": [
                    {
                        "height": 1000,
                        "url": "https://i.scdn.co/image/5c3cf2ee3494e2da71dcf26303202ec491b26213",
                        "width": 1000
                    },
                    {
                        "height": 640,
                        "url": "https://i.scdn.co/image/2e451efa87b706098553583cffac821b7ebac450",
                        "width": 640
                    },
                    {
                        "height": 200,
                        "url": "https://i.scdn.co/image/ca283ddea2afc65c15d802d45ee3d3fd255ab4e2",
                        "width": 200
                    },
                    {
                        "height": 64,
                        "url": "https://i.scdn.co/image/ce41eb4beaad8d07fd55a68aba16b27e341a2e4f",
                        "width": 64
                    }
                ],
                "name": "Justin Bieber",
                "popularity": 89,
                "type": "artist",
                "uri": "spotify:artist:1uNFoZAHBGtllmzznpCI3s"
            },
            {
                "external_urls": {
                    "spotify": "https://open.spotify.com/artist/6tsJx0uLuthk2a6MsSIxTQ"
                },
                "followers": {
                    "href": null,
                    "total": 242
                },
                "genres": [],
                "href": "https://api.spotify.com/v1/artists/6tsJx0uLuthk2a6MsSIxTQ",
                "id": "6tsJx0uLuthk2a6MsSIxTQ",
                "images": [],
                "name": "Justin Bieber's Karaoke Band",
                "popularity": 0,
                "type": "artist",
                "uri": "spotify:artist:6tsJx0uLuthk2a6MsSIxTQ"
            },
            {
                "external_urls": {
                    "spotify": "https://open.spotify.com/artist/4MxPfrznCu6spQU6FAvCty"
                },
                "followers": {
                    "href": null,
                    "total": 254
                },
                "genres": [
                    "fake"
                ],
                "href": "https://api.spotify.com/v1/artists/4MxPfrznCu6spQU6FAvCty",
                "id": "4MxPfrznCu6spQU6FAvCty",
                "images": [
                    {
                        "height": 640,
                        "url": "https://i.scdn.co/image/7935f5aeab856896ff8f8fa307f7e41e54a4b354",
                        "width": 640
                    },
                    {
                        "height": 300,
                        "url": "https://i.scdn.co/image/8776f7cc03360649abb54bdf5705edf6286a8028",
                        "width": 300
                    },
                    {
                        "height": 64,
                        "url": "https://i.scdn.co/image/747d34e76629ec711628d2c3b0ab54fc3026926e",
                        "width": 64
                    }
                ],
                "name": "Justin Bieber Tribute Team",
                "popularity": 0,
                "type": "artist",
                "uri": "spotify:artist:4MxPfrznCu6spQU6FAvCty"
            },
            {
                "external_urls": {
                    "spotify": "https://open.spotify.com/artist/7IfN1vxLIF5uJF4yDnTd20"
                },
                "followers": {
                    "href": null,
                    "total": 550
                },
                "genres": [],
                "href": "https://api.spotify.com/v1/artists/7IfN1vxLIF5uJF4yDnTd20",
                "id": "7IfN1vxLIF5uJF4yDnTd20",
                "images": [
                    {
                        "height": 640,
                        "url": "https://i.scdn.co/image/d5cbe1835371d73dd874488adbdcf365b18f7c9d",
                        "width": 640
                    },
                    {
                        "height": 300,
                        "url": "https://i.scdn.co/image/d91c31a1c3521a0112c26ce96daa8cc83625e499",
                        "width": 300
                    },
                    {
                        "height": 64,
                        "url": "https://i.scdn.co/image/1aae9338a0cbda83c24dd8a6e091bc12f657e6cf",
                        "width": 64
                    }
                ],
                "name": "Justin Bieber Cover Band",
                "popularity": 0,
                "type": "artist",
                "uri": "spotify:artist:7IfN1vxLIF5uJF4yDnTd20"
            },
            {
                "external_urls": {
                    "spotify": "https://open.spotify.com/artist/7vgrMNpaUviiEcAA3lFRvL"
                },
                "followers": {
                    "href": null,
                    "total": 385
                },
                "genres": [],
                "href": "https://api.spotify.com/v1/artists/7vgrMNpaUviiEcAA3lFRvL",
                "id": "7vgrMNpaUviiEcAA3lFRvL",
                "images": [
                    {
                        "height": 640,
                        "url": "https://i.scdn.co/image/c5d683a3dd506662af5a7faba17cb3e0ee754000",
                        "width": 640
                    },
                    {
                        "height": 300,
                        "url": "https://i.scdn.co/image/90a3d407a73eb123fb14cde9de58bf1fafd5aaca",
                        "width": 300
                    },
                    {
                        "height": 64,
                        "url": "https://i.scdn.co/image/5eaa73af471e426bc9a67b0992515f97e866328d",
                        "width": 64
                    }
                ],
                "name": "Justin Bieber Karaoke Band",
                "popularity": 0,
                "type": "artist",
                "uri": "spotify:artist:7vgrMNpaUviiEcAA3lFRvL"
            },
            {
                "external_urls": {
                    "spotify": "https://open.spotify.com/artist/0O3VwDvtOTxaBihhg7NvJt"
                },
                "followers": {
                    "href": null,
                    "total": 248
                },
                "genres": [],
                "href": "https://api.spotify.com/v1/artists/0O3VwDvtOTxaBihhg7NvJt",
                "id": "0O3VwDvtOTxaBihhg7NvJt",
                "images": [
                    {
                        "height": 640,
                        "url": "https://i.scdn.co/image/eb62edfc87cf6599a025f3f5463b02df6da463c6",
                        "width": 640
                    },
                    {
                        "height": 300,
                        "url": "https://i.scdn.co/image/3cad06e618c3941c384046ef5b264b82e4a36db8",
                        "width": 300
                    },
                    {
                        "height": 64,
                        "url": "https://i.scdn.co/image/17d9be299923cbac9a4679a4582715cd689c52ec",
                        "width": 64
                    }
                ],
                "name": "The Justin Bieber Tribute Band",
                "popularity": 4,
                "type": "artist",
                "uri": "spotify:artist:0O3VwDvtOTxaBihhg7NvJt"
            },
            {
                "external_urls": {
                    "spotify": "https://open.spotify.com/artist/792s0OARICNjc56t9Fe7Gb"
                },
                "followers": {
                    "href": null,
                    "total": 107
                },
                "genres": [],
                "href": "https://api.spotify.com/v1/artists/792s0OARICNjc56t9Fe7Gb",
                "id": "792s0OARICNjc56t9Fe7Gb",
                "images": [],
                "name": "Made famous by Justin Bieber",
                "popularity": 1,
                "type": "artist",
                "uri": "spotify:artist:792s0OARICNjc56t9Fe7Gb"
            },
            {
                "external_urls": {
                    "spotify": "https://open.spotify.com/artist/0vlIuYjEGV7T6daxEvuym5"
                },
                "followers": {
                    "href": null,
                    "total": 36
                },
                "genres": [],
                "href": "https://api.spotify.com/v1/artists/0vlIuYjEGV7T6daxEvuym5",
                "id": "0vlIuYjEGV7T6daxEvuym5",
                "images": [],
                "name": "Made famous by Justin Bieber & Ludacris",
                "popularity": 4,
                "type": "artist",
                "uri": "spotify:artist:0vlIuYjEGV7T6daxEvuym5"
            },
            {
                "external_urls": {
                    "spotify": "https://open.spotify.com/artist/5aEOHYe03xDrSOphmE6y0b"
                },
                "followers": {
                    "href": null,
                    "total": 101
                },
                "genres": [],
                "href": "https://api.spotify.com/v1/artists/5aEOHYe03xDrSOphmE6y0b",
                "id": "5aEOHYe03xDrSOphmE6y0b",
                "images": [
                    {
                        "height": 640,
                        "url": "https://i.scdn.co/image/1f494a2b36571a8d0a4061c20502a93029e2b7db",
                        "width": 640
                    },
                    {
                        "height": 300,
                        "url": "https://i.scdn.co/image/6465db4c7c0ee357dff3e31a90a3c66c35fd0013",
                        "width": 300
                    },
                    {
                        "height": 64,
                        "url": "https://i.scdn.co/image/89d5b48bf080193f662be485041909a5998dd5a7",
                        "width": 64
                    }
                ],
                "name": "Tribute to Justin Bieber Feat. Chance The Rapper",
                "popularity": 0,
                "type": "artist",
                "uri": "spotify:artist:5aEOHYe03xDrSOphmE6y0b"
            }
        ]
    },
    "version": "1.4.1"
}
```

## Error Responses

No specific error case.
