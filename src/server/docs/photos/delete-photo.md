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

**Condition**: The photo with the given id exists. The photo will be deleted. The return data is the updated list of photo ids.

**Code**: `200 OK`

**Content Example**

```json
{
    "status": "DELETE_PHOTO__SUCCESS",
    "data": [1, 2, 3]
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
