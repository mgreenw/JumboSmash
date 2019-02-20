# Get Member Info

Get the information about a community member based on their UTLN.

**URL** : `/api/member-info/:utln`

**Method** : `GET`

**Auth required** : None

## Success Response

**Condition** : If the member was found in the LDAP database and has a class year.

**Code** : `200 OK`

**Content example**

```json
{
    "status": "MEMBER_INFO__SUCCESS",
    "member": {
        "utln":"bvoelz01",
        "exists":true,
        "email":"Brendan.Voelz@tufts.edu",
        "college":"A&S",
        "trunkId":"B8290C07737235941A76370EE5433A3E",
        "classYear":"19",
        "givenName":"Brendan O.",
        "lastName":"Voelz",
        "displayName":"Brendan O. Voelz",
        "major":"Computer Science (BS)"
    }
}
```

### OR

**Condition** : If the member was found in the LDAP database and does NOT have a class year

**Code** : `200 OK`

**Content example**

```json
{
    "status":"GET_MEMBER_INFO__SUCCESS",
    "member":{
        "utln":"skhour01",
        "exists":true,
        "email":"Stephanie.Khoury@tufts.edu",
        "college":null,
        "trunkId":"06C40808A893D7F80BE6F9C076A57397",
        "classYear":null,
        "givenName":"Stephanie",
        "lastName":"Khoury",
        "displayName":"Stephanie Khoury",
        "major":null
    }
}
```

## Error Responses

**Condition** : If the member is not found in the LDAP Server

**Code** : `404 NOT FOUND`

**Content** :
```json
{
    "status": "GET_MEMBER_INFO__NOT_FOUND"
}
```

### OR

**Condition** : The email format is bad or otherwise does not contain '@tufts.edu'

**Code** : `404 NOT FOUND`

**Content** :
```json
{
    "status": "GET_MEMBER_INFO__NOT_TUFTS_EMAIL"
}
```
