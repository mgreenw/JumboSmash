# Update My Settings

Update settings for the current user. No fields are required, and omitted fields will not be updated.

**URL** : `/api/users/me/settings`

**Method** : `PATCH`

**Auth required** : YES

**Permissions required** : A user who has been verified.

**Request body fields**

Provide the user's updated settings fields.

* `want_he`
  * Type: `boolean`
  * Description: A boolean representing whether the user is interested in he series.
  * Required: `false`
  
* `want_she`
  * Type: `boolean`
  * Description: A boolean representing whether the user is interested in she series.
  * Required: `false`
  
* `want_they`
  * Type: `boolean`
  * Description: A boolean representing whether the user is interested in they series.
  * Required: `false`
  
* `use_he`
  * Type: `boolean`
  * Description: A boolean representing whether the user identifies as he series.
  * Required: `false`
  
* `use_she`
  * Type: `boolean`
  * Description: A boolean representing whether the user identifies as she series.
  * Required: `false`
  
* `use_they`
  * Type: `boolean`
  * Description: A boolean representing whether the user identifies as they series.
  * Required: `false`


**Request body example**

```json
{
    "want_he": "true",
    "want_they": "true",
    "use_he": "false",
    "use_they": "true",
}
```

## Success Response

**Condition** : If the settings were successfully updated.

**Code** : `201 Created`

**Content Example**

```json
{
    "status": "UPDATE_SETTINGS__SUCCESS",
}
```

## Error Responses

**Condition** : The format of one field is incorrect.

**Code** : `400 BAD REQUEST`

**Content** :
```json
{
    "status": "UPDATE_SETTINGS__BAD_REQUEST"
}
```
