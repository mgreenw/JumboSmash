# Get Photo

Get the given photo by id.

**URL** : `/api/photos/:photoId`

**Method** : `GET`

**Auth required** : YES

**Permissions required** : Any authenticated user.

**Request Headers**

Provide the normal `Authorization` token in the request header.

* `Authorization`
  * Type: `string`
  * Description: Auth token from `/api/auth/verify`
  * Required: `true`

## Success Response

**Condition**: The photo with the given id exists.

**Code**: `200 OK`

**Content**: The photo itself!

**NOTE**: The server will return a 303 redirect to AWS with a signed url. In this case, follow the redirect to get the actual image (and the 200).

## Error Response

**Condition** : A photo with the given id does not exist

**Code** : `400 BAD REQUEST`

**Content**

```json
{
    "status": "GET_PHOTO__NOT_FOUND"
}
```
