# Finalize Profile setup

Finalize the profile setup for the requesting user. Only allow this if a user has not yet created a profile. A user must have a confirmed uploaded photo to run this endpoint. The endpoint takes the profile "fields" and returns the finalized profile.

**URL** : `/api/users/me/profile`

**Method** : `POST`

**Auth required** : YES

**Permissions required** : A user with no profile setup.

**Request body fields**

Provide the user's initial profile fields.

* `displayName`
  * Type: `string`
  * Description: The user's preferred display name, ideally their first name
  * Required: `true`
* `birthday`
  * Type: `string`
  * Description: The users birthday in the format 'YYYY-MM-DD'
  * Required: `true`
* `bio`
  * Type: `string`
  * Description: The user's bio. Max Length: 500 characters
  * Required: `true`

**Request body example**

```json
{
    "displayName": "Max",
    "birthday": "1997-09-30",
    "bio": "He's a guy"
}
```

## Success Response

**Condition** : If the profile was successfully created.

**Code** : `201 Created`

**Content Example**

```json
{
    "status": "FINALIZE_PROFILE_SETUP__SUCCESS",
    "data": {
        "fields": {
            "displayName": "Max",
            "birthday": "1999-01-27",
            "bio": "Already has 2 friends so..."
        },
        "photoUuids": [
            "8c67b20d-5dd6-4597-80dc-0250bc6cad2c"
        ]
    }
}
```

## Error Responses

**Condition** : The user's profile has alreday been created. The caller should use PATCH instead to update the profile

**Code** : `409 CONFLICT`

**Content** :
```json
{
    "status": "FINALIZE_PROFILE_SETUP__PROFILE_ALREADY_CREATED"
}
```

### OR

**Condition** : The `displayName` is too long (greater than 50 chars)

**Code** : `400 BAD REQUEST`

**Content** :
```json
{
    "status": "FINALIZE_PROFILE_SETUP__INVALID_REQUEST",
    "message": "DISPLAY_NAME_TOO_LONG"
}
```

### OR

**Condition** : The birthday is not in the correct range or is not of a valid format. Correct range means that the user is above 18 years old but not older than 30.

**Code** : `400 BAD REQUEST`

**Content** :
```json
{
    "status": "FINALIZE_PROFILE_SETUP__INVALID_REQUEST",
    "message": "BIRTHDAY_NOT_VALID"
}
```

### OR

**Condition** : The user's bio is too long (greater than 500 characters)

**Code** : `400 BAD REQUEST`

**Content** :
```json
{
    "status": "FINALIZE_PROFILE_SETUP__INVALID_REQUEST",
    "message": "BIO_TOO_LONG"
}
```

### OR

**Condition** : The user's display name must not be only whitespace.

**Code** : `400 BAD REQUEST`

**Content** :
```json
{
    "status": "UPDATE_PROFILE__INVALID_REQUEST",
    "message": "DISPLAY_NAME_REQUIRED"
}
```

### OR

**Condition** : The user's bio must not be only whitespace.

**Code** : `400 BAD REQUEST`

**Content** :
```json
{
    "status": "UPDATE_PROFILE__INVALID_REQUEST",
    "message": "BIO_REQUIRED"
}
```


### OR

**Condition**: The required fields were not supplied.

**Code** : `400 BAD REQUEST`

**Content example**

```json
{
    "status": "BAD_REQUEST",
    "message": "data should have required property 'utln'"
}
```

### OR

**Condition**: The user has no uploaded and confirmed photos.

**Code** : `409 CONFLICT`

**Content example**

```json
{
    "status": "FINALIZE_PROFILE_SETUP__PHOTO_REQUIRED"
}
```
