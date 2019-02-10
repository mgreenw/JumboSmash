# Reorder Photos - DEPRICATED

NOTE: This endpoint is currently depricated. If needed, we will update it with a better return value and a more transaction-like implentation.

Reorder the photos of the current user. Provide between 2 and 4 ids in an array.

**URL** : `/api/photos/reorder`

**Method** : `PATCH`

**Auth required** : YES

**Permissions required** : Any authenticated user.

**Request Headers**

Provide the normal `Authorization` token in the request header.

* `Authorization`
  * Type: `string`
  * Description: Auth token from `/api/auth/verify`
  * Required: `true`

**Request body**

Provide an array of photo ids owned by the current user in the order in which they should be rearranged. Provide at least two and no more than 4 photo ids.

Type: `Array of Integers`

**Request body example**

```json
[1,2,3,4]
```

### OR

[10,99]

## Success Response

**Condition**: The ids provided match all of the user's uploaded and confirmed photos. In this case, the photos will be successfully reordered to match the requested order.

**Code**: `200 OK`

**Content Example**

```json
{
    "status": "REORDER_PHOTOS__SUCCESS",
    "data": [1, 2, 3]

}
```

## Error Responses

**Condition** : The provided ids do not match the user's currently uploaded and confirmed photos. Try again by retrieving the user's photos and properly providing them.

**Code** : `400 BAD REQUEST`

**Content**

```json
{
    "status": "REORDER_PHOTOS__MISMATCHED_IDS"
}
```

### OR

**Condition** : The request is not properly formatted. For example, the array contains ids that are not integers or the array has fewer than two or more than four ids.

**Code** : `400 BAD REQUEST`

**Content Example**

```json
{
    "status": "BAD_REQUEST",
    "message": "data should NOT have more than 4 items"
}
```
