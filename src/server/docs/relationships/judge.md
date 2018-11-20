# Judge

As the critic, judge another user (the candidate) in a specific scene by either "liking" them or "disliking" them. The candidate user must have a setup profile. If two users are matched, one user disliking the other will unmatch them.

**URL** : `/api/relationships/judge`

**Method** : `POST`

**Auth required** : YES

**Permissions required** : A user with a profile setup.

**Request body fields**

* `candidateUserId`
  * Type: `integer`
  * Description: The candidate to judge's userId.
  * Required: `true`
* `scene`
  * Type: `string`
  * Description: The scene in which to judge the candidate. Must be one of ['smash', 'social', 'stone']
  * Required: `true`
* `liked`
  * Type: `boolean`
  * Description: Whether the critic (requesting user) "liked" the candidate or not.
  * Required: `true`

**Request body example**

```json
{
	"candidateUserId": 7,
	"scene": "smash",
	"liked": true
}
```

## Success Response

**Condition** : If the judgement was completed successfully.

**Code** : `200 OK`

**Content Example**

```json
{
    "status": "JUDGE_SUCCESS",
}
```

## Error Responses

**Condition** : The candidate user does not exist or does not have a profile setup.

**Code** : `400 BAD REQUEST`

**Content** :
```json
{
    "status": "JUDGE__CANDIDATE_NOT_FOUND"
}
```

### OR

**Condition** : One of the request body fields is invalid.

**Code** : `400 BAD REQUEST`

**Content Example** :
```json
{
    "status": "BAD_REQUEST",
    "message": "data.candidateUserId should be multiple of 1"
}
```
