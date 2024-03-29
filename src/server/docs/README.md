# Project GEM API Docs

Note: See the docs for the socket communication protocol [here](socket/README.md).

## Public Endpoints

### Authentication

* [Send Verification Email](auth/send-verification-email.md) : `POST /api/auth/send-verification-email`
* [Verify](auth/verify.md) : `POST /api/auth/verify`

## Private Endpoints

### Admin
* [Get Classmates](admin/get-classmates.md): `GET /api/admin/classmates`
* [Ban User](admin/ban-user.md): `POST /api/admin/ban/:userId`

### Authentication
* [Get Token UTLN](auth/get-token-utln.md) : `GET /api/auth/get-token-utln`
* [Logout](auth/logout.md) : `POST /api/auth/logout`

### Users
* [Finalize Profile Setup](users/finalize-profile-setup.md) : `POST /api/users/me/profile`
* [Update My Profile](users/update-my-profile.md) : `PATCH /api/users/me/profile`
* [Get My Profile](users/get-my-profile.md) : `GET /api/users/me/profile`
* [Get Profile](users/get-profile.md) : `GET /api/users/:userId/profile`
* [Get My Settings](users/get-my-settings.md) : `GET /api/users/me/settings`
* [Update My Settings](users/update-my-settings.md) : `PATCH /api/users/me/settings`

### Relationships
* [Get Scene Candidates](relationships/get-scene-candidates.md) : `GET /api/relationships/candidates/:scene`
* [Get Matches](relationships/get-matches.md) : `GET /api/relationships/matches`
* [Judge](relationships/judge.md) : `POST /api/relationships/judge`
* [Block](relationships/block.md) : `POST /api/relationships/block`

### Photos
* [Sign Photo Upload URL](photos/sign-url.md) : `GET /api/photos/sign-url`
* [Confirm Photo Upload](photos/confirm-upload.md) : `GET /api/photos/confirm-upload`
* [Get Photo](photos/get-photo.md) : `GET /api/photos/:photoUuid`
* [Delete Photo](photos/delete-photo.md) : `DELETE /api/photos/:photoUuid`
* [Reorder Photos](photos/reorder-photos.md) : `PATCH /api/photos/reorder`

### Conversations
* [Get Conversation](conversations/get-conversation.md) : `GET /api/conversations/:userId`
* [Send Message](conversations/send-message.md) : `POST /api/conversations/:userId`
* [Read Message](conversations/read-message.md) : `PATCH /api/conversations/:matchUserId/messages/:messageId`

### Meta
* [Send Feedback](meta/send-feedback.md) : `POST /api/meta/feedback`
* [Report User](meta/report-user.md) : `POST /api/meta/report`

### Yaks
* [Get Yaks](yaks/get-yaks.md): `GET /api/yaks`
* [Post Yak](yaks/post-yak.md): `POST /api/yaks`
* [Get My Yaks](yaks/get-my-yaks.md): `GET /api/yaks/me`
* [Vote On Yak](yaks/vote-on-yak.md): `PATCH /api/yaks/:id`
* [Report Yak](yaks/report-yak.md): `POST /api/yaks/:id/report`
