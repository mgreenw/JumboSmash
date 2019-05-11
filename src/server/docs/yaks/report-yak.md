# Report Yak

Report a yak for bad content.

**URL** : `/api/yaks/:id/report`

**Method** : `POST`

**Auth required** : YES

**Permissions required** : Any authenticated user with a profile

**Request Headers**

Provide the normal `Authorization` token in the request header.

* `Authorization`
  * Type: `string`
  * Description: Auth token from `/api/auth/verify`
  * Required: `true`

**Request body fields**

* `message`
  * Type: `string`
  * Description: The user's comment on the yak's content.
  * Required: `true`
* `reasonCode`
  * Type: `string`
  * Description: The standard reason why the content is bad (multiple choice).
  * Required: `true`

**Request body example**

```json
{
	"message": "Bad yak because it's dumb",
	"reasonCode": "NOT_GOOD"
}
```

## Success Response

**Condition**: The yak was reported.

**Code**: `201 CREATED`

**Content Example**:

```json
{
    "status": "REPORT_YAK__SUCCESS",
    "version": "2.3.2"
}
```

## Error Response

**Condition**: The yak does not exist.

**Code** : `404 NOT FOUND`

**Content**

```json
{
    "status": "REPORT_YAK__YAK_NOT_FOUND",
    "version": "2.3.2"
}
```
