# Delete Photo

Delete the photo with the given id. This photo must be owned by the requesting user.

**URL** : `/api/photos/:photoId`

**Method** : `DELETE`

**Auth required** : YES

**Permissions required** : Any authenticated user.

**Request Headers**

Provide the normal `Authorization` token in the request header.

* `Authorization`
  * Type: `string`
  * Description: Auth token from `/api/auth/verify`
  * Required: `true`

## Success Response

**Condition**: The photo with the given id exists. The photo will be deleted.

**Code**: `200 OK`

**Content**

```json
{
    "status": "DELETE_PHOTO__SUCCESS"
}
```

## Error Responses

**Condition** : A photo with the given id does not exist

**Code** : `400 BAD REQUEST`

**Content**

```json
{
    "status": "DELETE_PHOTO__NOT_FOUND"
}
```

### OR

**Condition** : The photo that was supplied is the only photo the user currently has uploaded. Because users need at least one photo to have a profile, we reject the deleton of this photo. That being said, the photo does exist.

**Code** : `409 CONFLICT`

**Content**

```json
{
    "status": "DELETE_PHOTO__CANNOT_DELETE_LAST_PHOTO"
}
```
