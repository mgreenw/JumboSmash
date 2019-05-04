# Get Classmates

Gets a single classmate's information.

**URL** : `/api/admin/classmates/:id`

**Method** : `GET`

**Auth required** : YES

**Admin required** : YES

**Permissions required** : Any admin with a profile

**Request Headers**

Provide the normal `Authorization` token in the request header. Additionally, include `Admin-Authorization` with the admin's password.

* `Authorization`
  * Type: `string`
  * Description: Auth token from `/api/auth/verify`
  * Required: `true`
* `Admin-Authorization`
  * Type: `string`
  * Description: The admin's password
  * Required: `true`

## Success Response

**Condition** : The list of all classmates

**Code** : `200 OK`

**Content example**

```json
{
    "status": "GET_CLASSMATE__SUCCESS",
    "data": {
        "classmate": {
            "id": 1,
            "utln": "mgreen14",
            "email": "Max.Greenwald@tufts.edu",
            "isTerminated": false,
            "capabilities": {
                "canBeSwipedOn": true,
                "canBeActiveInScenes": true
            },
            "profileStatus": "updated",
            "hasProfile": true,
            "activeScenes": {
                "smash": true,
                "social": true,
                "stone": false
            },
            "isAdmin": true,
            "blockedRequestingAdmin": false,
            "notificationInfo": {
                "notificationsEnabled": true,
                "hasToken": true
            },
            "accountUpdates": [
                {
                    "update": {
                        "type": "PROFILE_NEW_PHOTO",
                        "photoUUID": "de5718fc-bb35-48a5-9f73-e989d8ebfb75"
                    },
                    "timestamp": "2019-04-27T04:54:26.789Z"
                },
                {
                    "update": {
                        "type": "PROFILE_FIELDS_UPDATE",
                        "changedFields": {
                            "bio": "Dhdud",
                            "birthday": "1997-09-09",
                            "displayName": "Max"
                        }
                    },
                    "timestamp": "2019-04-27T04:55:04.150Z"
                },
                {
                    "update": {
                        "type": "PROFILE_FIELDS_UPDATE",
                        "changedFields": [
                            [
                                "display_name",
                                "Max"
                            ],
                            [
                                "birthday",
                                "1997-09-09"
                            ],
                            [
                                "bio",
                                "r\n\nHehehe\nE"
                            ],
                            [
                                "postgrad_region",
                                null
                            ],
                            [
                                "freshman_dorm",
                                null
                            ],
                            [
                                "spring_fling_act",
                                null
                            ],
                            [
                                "spring_fling_act_artist",
                                null
                            ]
                        ]
                    },
                    "timestamp": "2019-05-04T17:43:20.382Z"
                },
                {
                    "update": {
                        "type": "PROFILE_FIELDS_UPDATE",
                        "changedFields": [
                            [
                                "display_name",
                                "Max"
                            ],
                            [
                                "birthday",
                                "1997-09-09"
                            ],
                            [
                                "bio",
                                "r\nsss\nHehehe\nE"
                            ],
                            [
                                "postgrad_region",
                                null
                            ],
                            [
                                "freshman_dorm",
                                null
                            ],
                            [
                                "spring_fling_act",
                                null
                            ],
                            [
                                "spring_fling_act_artist",
                                null
                            ]
                        ]
                    },
                    "timestamp": "2019-05-04T17:44:10.688Z"
                },
                {
                    "update": {
                        "type": "PROFILE_FIELDS_UPDATE",
                        "changedFields": [
                            [
                                "display_name",
                                "Max"
                            ],
                            [
                                "birthday",
                                "1997-09-09"
                            ],
                            [
                                "bio",
                                "r\nsss\nHehehe\nE"
                            ],
                            [
                                "postgrad_region",
                                null
                            ],
                            [
                                "freshman_dorm",
                                null
                            ],
                            [
                                "spring_fling_act",
                                null
                            ],
                            [
                                "spring_fling_act_artist",
                                null
                            ]
                        ]
                    },
                    "timestamp": "2019-05-04T17:45:31.680Z"
                },
                {
                    "update": {
                        "type": "PROFILE_FIELDS_UPDATE",
                        "changedFields": {
                            "bio": "r\n   \nHehehe\nE"
                        }
                    },
                    "timestamp": "2019-05-04T18:22:34.601Z"
                },
                {
                    "update": {
                        "type": "PROFILE_FIELDS_UPDATE",
                        "changedFields": {}
                    },
                    "timestamp": "2019-05-04T18:22:45.696Z"
                },
                {
                    "update": {
                        "type": "PROFILE_FIELDS_UPDATE",
                        "changedFields": {}
                    },
                    "timestamp": "2019-05-04T18:22:56.829Z"
                },
                {
                    "update": {
                        "type": "PROFILE_FIELDS_UPDATE",
                        "changedFields": {
                            "displayName": "Maxxxx"
                        }
                    },
                    "timestamp": "2019-05-04T18:23:02.876Z"
                },
                {
                    "update": {
                        "type": "PROFILE_FIELDS_UPDATE",
                        "changedFields": {
                            "bio": "r\n     \nHehehe\nE"
                        }
                    },
                    "timestamp": "2019-05-04T18:23:13.540Z"
                }
            ]
        }
    },
    "version": "2.3.0"
}
```

## Error Responses

**Condition** : The classmate with the given id does not exist.

If the admin password is incorrect, the `UNAUTHORIZED` status will be returned. Otherwise, there are no specific error conditions for this endpoint.

**Code** : `404 NOT FOUND`

**Content**

```json
{
    "status": "GET_CLASSMATE__NOT_FOUND",
    "version": "2.3.0"
}
```
