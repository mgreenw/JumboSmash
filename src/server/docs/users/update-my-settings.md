# Update My Settings

Update the current user's settings. No fields are required, and fields that
are omitted will not be updated.

**URL** : `/api/users/me/settings`

**Method** : `PATCH`

**Auth required** : YES

**Permissions required** : Any verified user.

**Request body fields**

Provide updated settings fields

* `identifyAsGenders`
  * Type: `object`
  * Description: The genders that the user identifies as
  * Required: `false`
  * Properties:
    * `man`
      * Type: `boolean`
      * Description: If the user identifies as a man
      * Required: `false`
    * `woman`
      * Type: `boolean`
      * Description: If the user identifies as a woman
      * Required: `false`
    * `nonBinary`
      * Type: `boolean`
      * Description: If the user identifies as non-binary
      * Required: `false`
* `lookingForGenders`
  * Type: `object`
  * Description: The genders that the user is looking for to match with on Smash
  * Required: `false`
  * Properties:
    * `man`
      * Type: `boolean`
      * Description: If the user wants to match with men
      * Required: `false`
    * `woman`
      * Type: `boolean`
      * Description: If the user wants to match with women
      * Required: `false`
    * `nonBinary`
      * Type: `boolean`
      * Description: If the user wants to match with non-binary people.
      * Required: `false`
* `expoPushToken`
  * Type: `string`
  * Description: The push token that expo gives on mobile
  * Required: `false`
* `notificationsEnabled`
  * Type: `boolean`
  * Description: If the user would like to receive push notifications
  * Required: `false`

**Request body examples**

```json
{
    "lookingForGenders": {
        "man": false,
        "nonBinary": true,
    },
    "identifyAsGenders": {
        "man": true,
    }
}
```

### OR

```json
{
    "lookingForGenders": {
        "man": true,
        "nonBinary": true,
        "woman": true
    },
    "identifyAsGenders": {
        "man": true,
        "nonBinary": true
    },
    "expoPushToken": "thisisatokenitreallyisipromise",
    "notificationsEnabled": true
}
```

## Success Response

**Condition** : If the user settings were successfully updated.

**Code** : `201 CREATED`

**Content Example**

```json
{
    "status": "UPDATE_SETTINGS__SUCCESS",
    "data": {
        "lookingForGenders": {
            "man": false,
            "woman": false,
            "nonBinary": false
        },
        "identifyAsGenders": {
            "man": false,
            "woman": false,
            "nonBinary": false
        },
        "activeScenes": {
            "smash": false,
            "social": false,
            "stone": false
        },
        "expoPushToken": "thisisatokenitreallyisipromise",
        "notificationsEnabled": true,
    }
}
```


## Error Responses

**Condition** : The request body had an invalid structure/type

**Code** : `400 BAD REQUEST`

**Content** :
```json
{
    "status": "BAD_REQUEST",
    "message": "identifyAsGenders should be of expected type 'object'"
}
```
