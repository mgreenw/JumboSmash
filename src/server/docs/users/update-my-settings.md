# Update My Settings

Update the current user's settings. No fields are required, and fields that
are omitted will not be updated.

**URL** : `/api/users/me/settings`

**Method** : `PATCH`

**Auth required** : YES

**Permissions required** : A user with a profile already setup.

**Request body fields**

Provide updated settings fields

* `usesPronouns`
  * Type: `object`
  * Description: The pronouns that the user uses
  * Required: `false`
  * Properties:
    * `he`
      * Type: `boolean`
      * Description: If the user uses the he series pronouns
      * Required: `false`
    * `she`
      * Type: `boolean`
      * Description: If the user uses the she series pronouns
      * Required: `false`
    * `they`
      * Type: `boolean`
      * Description: If the user uses the they series pronouns
      * Required: `false`
* `usesPronouns`
  * Type: `object`
  * Description: The pronouns that the user wants to match with in Smash
  * Required: `false`
  * Properties:
    * `he`
      * Type: `boolean`
      * Description: If the user wants to match with users that use the `he` series.
      * Required: `false`
    * `she`
      * Type: `boolean`
      * Description: If the user wants to match with users that use the `she` series.
      * Required: `false`
    * `they`
      * Type: `boolean`
      * Description: If the user wants to match with users that use the `they` series.
      * Required: `false`

**Request body example**

```json
{
    "wantsPronouns": {
        "he": false,
        "they": true,
    },
    "usesPronouns": {
        "he": true,
    }
}
```

## Success Response

**Condition** : If the user settings were successfully updated.

**Code** : `201 CREATED`

**Content Example**

```json
{
    "status": "UPDATE_SETTINGS__SUCCESS",
}
```


## Error Responses

**Condition** : The request body had an invalid structure/type

**Code** : `400 BAD REQUEST`

**Content** :
```json
{
    "status": "BAD_REQUEST",
    "message": "usesPronouns should be of expected type 'object'"
}
```
