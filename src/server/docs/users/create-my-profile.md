# Create My Profile

Create a profile for the current user. Only allow this if a user has not yet created a profile.

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
* `image1Url`
  * Type: `string`
  * Description: User's profile image 1: Must be a valid URL to an image.
  * Required: `true`
* `image2Url`
  * Type: `string`
  * Description: User's profile image 2: Must be a valid URL to an image.
  * Required: `false`
* `image3Url`
  * Type: `string`
  * Description: User's profile image 3: Must be a valid URL to an image.
  * Required: `false`
* `image4Url`
  * Type: `string`
  * Description: User's profile image 4: Must be a valid URL to an image.
  * Required: `false`
* `bio`
  * Type: `string`
  * Description: The user's bio. Max Length: 500 characters
  * Required: `true`

**Request body example**

```json
{
    "displayName": "Max",
    "birthday": "1997-09-30",
    "image1Url": "https://static1.squarespace.com/static/55ba4b1be4b03f052fff1bf7/t/5a0a3ba04192029150cb2aeb/1510620084146/bubs-max.jpg?format=1000w",
    "bio": "He's a guy"
}
```

## Success Response

**Condition** : If the profile was successfully created.

**Code** : `201 Created`

**Content Example**

```json
{
    "status": "CREATE_PROFILE__SUCCESS",
}
```

## Error Responses

**Condition** : The user's profile has alreday been created. The caller should use PATCH instead to update the profile

**Code** : `400 BAD REQUEST`

**Content** :
```json
{
    "status": "CREATE_PROFILE__PROFILE_ALREADY_CREATED"
}
```

### OR

**Condition** : The `displayName` is too long (greater than 50 chars)

**Code** : `400 BAD REQUEST`

**Content** :
```json
{
    "status": "CREATE_PROFILE__INVALID_REQUEST",
    "message": "DISPLAY_NAME_TOO_LONG"
}
```

### OR

**Condition** : The birthday is not in the correct range or is not of a valid format. Correct range means that the user is above 18 years old but not older than 30.

**Code** : `400 BAD REQUEST`

**Content** :
```json
{
    "status": "CREATE_PROFILE__INVALID_REQUEST",
    "message": "BIRTHDAY_NOT_VALID"
}
```

### OR

**Condition** : The user's bio is too long (greater than 500 characters)

**Code** : `400 BAD REQUEST`

**Content** :
```json
{
    "status": "CREATE_PROFILE__INVALID_REQUEST",
    "message": "BIO_TOO_LONG"
}
```

### OR

**Condition** : A url that the user supplied is invalid (not a valid url, requires HTTPS)

**Code** : `400 BAD REQUEST`

**Content Examle** :
```json
{
    "status": "CREATE_PROFILE__INVALID_REQUEST",
    "message": "IMAGE_URL_NOT_VALID"
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
