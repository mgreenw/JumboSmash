# Update My Profile

Update the current user's profile! No fields are required, and fields that
are omitted will not be updated.

**URL** : `/api/users/me/profile`

**Method** : `PATCH`

**Auth required** : YES

**Permissions required** : A user with a profile already setup.

**Request body fields**

Provide updated profile fields

* `displayName`
  * Type: `string`
  * Description: The user's preferred display name, ideally their first name
  * Required: `false`
* `birthday`
  * Type: `string`
  * Description: The users birthday in the format 'YYYY-MM-DD'
  * Required: `false`
* `bio`
  * Type: `string`
  * Description: The user's bio. Max Length: 500 characters
  * Required: `false`
* `postgradRegion`
  * Type: `string`
  * Description: The user's postgrad living region. Should be one of the following codes: [LinkedIn Geography Codes](https://developer.linkedin.com/docs/reference/geography-codes). OR, could be one of the following custom codes:
    * `on.the.road` - This is the Jacob Jaffe condition/addition.
    * `idk` - Some people haven't quite figured it out.
  * Required: `false`
  * Length: Between 1 and 100 characters.
* `freshmanDorm`
  * Type: `string`
  * Description: The user's freshman dorm.
  * Required: `false`
  * Length: Between 1 and 100 characters.
* `springFlingAct`
  * Type: `string`
  * Description: The user's desired spring fling act. Optimally, this comes from Spotifiy.
  * Required: `false`
  * Length: Between 1 and 200 characters.

**Request body example**

```json
{
    "displayName": "Max",
    "birthday": "1997-09-09",
    "bio": "hehe",
    "postgradRegion": "na.us.ma.7",
    "freshmanDorm": "Haskell",
    "springFlingAct": "A real group"
}
```

## Success Response

**Condition** : If the profile was successfully updated.

**Code** : `201 CREATED`

**Content Example**

```json
{
    "status": "UPDATE_PROFILE__SUCCESS",
}
```


## Error Responses

**Condition** : The `displayName` is too long (greater than 50 chars)

**Code** : `400 BAD REQUEST`

**Content** :
```json
{
    "status": "UPDATE_PROFILE__INVALID_REQUEST",
    "message": "DISPLAY_NAME_TOO_LONG"
}
```

### OR

**Condition** : The birthday is not in the correct range or is not of a valid format. Correct range means that the user is above 18 years old but not older than 30.

**Code** : `400 BAD REQUEST`

**Content** :
```json
{
    "status": "UPDATE_PROFILE__INVALID_REQUEST",
    "message": "BIRTHDAY_NOT_VALID"
}
```

### OR

**Condition** : The user's bio is too long (greater than 500 characters)

**Code** : `400 BAD REQUEST`

**Content** :
```json
{
    "status": "UPDATE_PROFILE__INVALID_REQUEST",
    "message": "BIO_TOO_LONG"
}
```
