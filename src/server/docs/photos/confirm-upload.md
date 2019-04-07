# Confirm Photo Upload

Confirm the current unconfirmed photo has been uploaded. The server will performa verification on AWS that the current unconfirmed photo has indeed been uploaded. The user must not already have 4 confirmed uploaded photos before using this endpoint. Use of this endpoint should follow the use of the [Sign Photo Upload URL](sign-url.md) endpoint.

**URL** : `/api/photos/confirm-upload`

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

**Condition**: An unconfirmed photo exists AND a corresponding photo has been successfully been uploaded to AWS S3. In this case, the uploaded photo will be added to the requesting user's confirmed photos. The data is the new list if photoUuids for the user

**Code**: `200 OK`

**Content**

```json
{
    "status": "CONFIRM_UPLOAD__SUCCESS",
    "data": [
        "70228bb4-9387-44d5-938c-46c3369e8ec0",
        "6ed8c5c4-251a-4933-912d-0143162d0d70",
        "fd246025-361b-48a0-b7c4-3193a67ddcd6"
    ]
}
```

## Error Responses

**Condition** : There is no current unconfirmed photo for the requesting user.

**Code** : `400 BAD REQUEST`

**Content**

```json
{
    "status": "CONFIRM_UPLOAD__NO_UNCONFIRMED_PHOTO"
}
```

### OR

**Condition** : There is an unconfirmed photo for the requseting user, but the user has not completed the photos upload to AWS S3.

**Code** : `400 BAD REQUEST`

**Content**

```json
{
    "status": "CONFIRM_UPLOAD__NO_UPLOAD_FOUND"
}
```

### OR

**Condition** : The requesting user already has 4 confirmed uploaded photos.

**Code** : `400 BAD REQUEST`

**Content**

```json
{
    "status": "CONFIRM_UPLOAD__NO_AVAILABLE_SLOT"
}
```
