# Sign Photo Upload URL

Sign an AWS S3 URL for the given user to upload a new photo. This will create an unconfirmed photo for the user that can be confirmed with the [Confirm Photo Upload](confirm-upload.md) endpoint once the upload is completed. See the tests for the confirm upload endpoint in order to see an example photo upload.

**URL** : `/api/photos/sign-url`

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

**Code**: `200 OK`

**Content Example**

```json
{
    "status": "SIGN_URL__SUCCESS",
    "data": {
        "url": "https://s3.amazonaws.com/projectgem-dev",
        "fields": {
            "key": "photos/development/43a0fa39-bfd1-4afe-a5ab-f2a130219eb2",
            "bucket": "projectgem-dev",
            "X-Amz-Algorithm": "AWS4-HMAC-SHA256",
            "X-Amz-Credential": "AKIAIFDBBAE2RB3D6GQA/20190202/us-east-1/s3/aws4_request",
            "X-Amz-Date": "20190202T230311Z",
            "Policy": "eyJleHBpcmF0aW9uIjoiMjAxOS0wMi0wMlQyMzoxMzoxMVoiLCJjb25kaXRpb25zIjpbeyJhY2wiOiJhdXRoZW50aWNhdGVkLXJlYWQifSx7IkNvbnRlbnQtVHlwZSI6ImltYWdlL2pwZWcifSxbImNvbnRlbnQtbGVuZ3RoLXJhbmdlIiwxLDUwMDAwMF0seyJrZXkiOiJwaG90b3MvZGV2ZWxvcG1lbnQvNDNhMGZhMzktYmZkMS00YWZlLWE1YWItZjJhMTMwMjE5ZWIyIn0seyJidWNrZXQiOiJwcm9qZWN0Z2VtLWRldiJ9LHsiWC1BbXotQWxnb3JpdGhtIjoiQVdTNC1ITUFDLVNIQTI1NiJ9LHsiWC1BbXotQ3JlZGVudGlhbCI6IkFLSUFJRkRCQkFFMlJCM0Q2R1FBLzIwMTkwMjAyL3VzLWVhc3QtMS9zMy9hd3M0X3JlcXVlc3QifSx7IlgtQW16LURhdGUiOiIyMDE5MDIwMlQyMzAzMTFaIn1dfQ==",
            "X-Amz-Signature": "2f742f6cd47f2943d8128089bfce730823763d43145ba5d77ef7e8f1e2ee38fc",
            "acl": "authenticated-read"
        }
    }
}
```

## Error Response

There are no built in errors for this endpoint. Only a server error would cause this action to fail.
