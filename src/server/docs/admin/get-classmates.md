# Get Classmates

Gets all the classmates in the app. This includes banned users and users that are not logged in.

**URL** : `/api/admin/classmates`

**Method** : `GET`

**Auth required** : YES

**Admin required** : YES

**Permissions required** : Any user with a profile

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
    "status": "GET_CLASSMATES__SUCCESS",
    "data": {
        "classmates": [
            {
                "id": 12,
                "utln": "jjaffe01",
                "email": "Jacob.Jaffe@tufts.edu",
                "isBanned": false,
                "activeScenes": {
                    "smash": true,
                    "social": true,
                    "stone": true
                },
                "isAdmin": false
            },
            {
                "id": 6,
                "utln": "jfasse01",
                "email": "Julia.Fasse@tufts.edu",
                "isBanned": false,
                "activeScenes": {
                    "smash": true,
                    "social": true,
                    "stone": true
                },
                "isAdmin": false
            },
            {
                "id": 1,
                "utln": "mgreen14",
                "email": "Max.Greenwald@tufts.edu",
                "isBanned": false,
                "activeScenes": {
                    "smash": true,
                    "social": true,
                    "stone": true
                },
                "isAdmin": true
            }
        ]
    },
    "version": "1.3.1"
}
```

## Error Responses

If the admin password is incorrect, the `UNAUTHORIZED` status will be returned. Otherwise, there are no specific error conditions for this endpoint.
