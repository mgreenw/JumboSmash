# Project GEM API Docs

## Public Endpoints

### Authentication

* [Send Verification Email](auth/send-verification-email.md) : `POST /api/auth/send-verification-email`
* [Verify](auth/verify.md) : `POST /api/auth/verify`

## Private Endpoints

### Authentication
* [Get Token UTLN](auth/get-token-utln.md) : `GET /api/auth/get-token-utln`

### Users
* [Create My Profile](users/create-my-profile.md) : `POST /api/users/me/profile`
* [Update My Profile](users/update-my-profile.md) : `PATCH /api/users/me/profile`
* [Get My Profile](users/get-my-profile.md) : `GET /api/users/me/profile`
* [Get Profile](users/get-profile.md) : `GET /api/users/:userId/profile`
