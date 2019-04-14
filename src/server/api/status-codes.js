// @flow

// SHARED
exports.SERVER_ERROR = {
  status: 'SERVER_ERROR',
  code: 500,
};
exports.BAD_REQUEST = {
  status: 'BAD_REQUEST',
  code: 400,
};
exports.AUTHORIZED = {
  status: 'AUTHORIZED',
  code: 200,
};
exports.UNAUTHORIZED = {
  status: 'UNAUTHORIZED',
  code: 401,
};
exports.PROFILE_SETUP_INCOMPLETE = {
  status: 'PROFILE_SETUP_INCOMPLETE',
  code: 403,
};
exports.BANNED = {
  status: 'BANNED',
  code: 401,
};
// AUTH

// Send Verification Email
exports.SEND_VERIFICATION_EMAIL__SUCCESS = {
  status: 'SEND_VERIFICATION_EMAIL__SUCCESS',
  code: 200,
};
exports.SEND_VERIFICATION_EMAIL__EMAIL_NOT_FOUND = {
  status: 'SEND_VERIFICATION_EMAIL__EMAIL_NOT_FOUND',
  code: 400,
};
exports.SEND_VERIFICATION_EMAIL__EMAIL_NOT_2019 = {
  status: 'SEND_VERIFICATION_EMAIL__EMAIL_NOT_2019',
  code: 400,
};
exports.SEND_VERIFICATION_EMAIL__EMAIL_NOT_STUDENT = {
  status: 'SEND_VERIFICATION_EMAIL__EMAIL_NOT_STUDENT',
  code: 400,
};
exports.SEND_VERIFICATION_EMAIL__EMAIL_NOT_UNDERGRAD = {
  status: 'SEND_VERIFICATION_EMAIL__EMAIL_NOT_UNDERGRAD',
  code: 400,
};
exports.SEND_VERIFICATION_EMAIL__EMAIL_ALREADY_SENT = {
  status: 'SEND_VERIFICATION_EMAIL__EMAIL_ALREADY_SENT',
  code: 200,
};
exports.SEND_VERIFICATION_EMAIL__NOT_TUFTS_EMAIL = {
  status: 'SEND_VERIFICATION_EMAIL__NOT_TUFTS_EMAIL',
  code: 400,
};

// Verify
exports.VERIFY__SUCCESS = {
  status: 'VERIFY__SUCCESS',
  code: 200,
};
exports.VERIFY__BAD_CODE = {
  status: 'VERIFY__BAD_CODE',
  code: 400,
};
exports.VERIFY__EXPIRED_CODE = {
  status: 'VERIFY__EXPIRED_CODE',
  code: 400,
};
exports.VERIFY__NO_EMAIL_SENT = {
  status: 'VERIFY__NO_EMAIL_SENT',
  code: 400,
};

// Logout
exports.LOGOUT__SUCCESS = {
  status: 'LOGOUT__SUCCESS',
  code: 200,
};

// USERS

// Create Profile
exports.FINALIZE_PROFILE_SETUP__SUCCESS = {
  status: 'FINALIZE_PROFILE_SETUP__SUCCESS',
  code: 201,
};
exports.FINALIZE_PROFILE_SETUP__PROFILE_ALREADY_CREATED = {
  status: 'FINALIZE_PROFILE_SETUP__PROFILE_ALREADY_CREATED',
  code: 409,
};
exports.FINALIZE_PROFILE_SETUP__INVALID_REQUEST = {
  status: 'FINALIZE_PROFILE_SETUP__INVALID_REQUEST',
  code: 400,
};
exports.FINALIZE_PROFILE_SETUP__PHOTO_REQUIRED = {
  status: 'FINALIZE_PROFILE_SETUP__PHOTO_REQUIRED',
  code: 409,
};
exports.FINALIZE_PROFILE__BIRTHDAY_UNDER_18 = {
  status: 'FINALIZE_PROFILE__BIRTHDAY_UNDER_18',
  code: 406,
};

// Update Profile
exports.UPDATE_PROFILE__SUCCESS = {
  status: 'UPDATE_PROFILE__SUCCESS',
  code: 201,
};
exports.UPDATE_PROFILE__INVALID_REQUEST = {
  status: 'UPDATE_PROFILE__INVALID_REQUEST',
  code: 400,
};

// Get profile
exports.GET_PROFILE__SUCCESS = {
  status: 'GET_PROFILE__SUCCESS',
  code: 200,
};
exports.GET_PROFILE__PROFILE_NOT_FOUND = {
  status: 'GET_PROFILE__PROFILE_NOT_FOUND',
  code: 404,
};
exports.GET_PROFILE__BAD_USER_ID = {
  status: 'GET_PROFILE__BAD_USER_ID',
  code: 400,
};

// Get My Photos
exports.GET_MY_PHOTOS__SUCCESS = {
  status: 'GET_MY_PHOTOS__SUCCESS',
  code: 200,
};

// Get Scene Candidates
exports.GET_SCENE_CANDIDATES__SUCCESS = {
  status: 'GET_SCENE_CANDIDATES__SUCCESS',
  code: 200,
};
exports.GET_SCENE_CANDIDATES__INVALID_SCENE = {
  status: 'GET_SCENE_CANDIDATES__INVALID_SCENE',
  code: 400,
};

// Get Matches
exports.GET_MATCHES__SUCCESS = {
  status: 'GET_MATCHES__SUCCESS',
  code: 200,
};

// Judge
exports.JUDGE__SUCCESS = {
  status: 'JUDGE__SUCCESS',
  code: 200,
};
exports.JUDGE__CANDIDATE_NOT_FOUND = {
  status: 'JUDGE__CANDIDATE_NOT_FOUND',
  code: 400,
};

exports.UNMATCH__SUCCESS = {
  status: 'UNMATCH__SUCCESS',
  code: 200,
};
exports.UNMATCH__NOT_MATCHED = {
  status: 'UNMATCH__NOT_MATCHED',
  code: 403,
};

// Report
exports.REPORT__SUCCESS = {
  status: 'REPORT__SUCCESS',
  code: 200,
};
exports.REPORT__USER_NOT_FOUND = {
  status: 'REPORT__USER_NOT_FOUND',
  code: 400,
};

// Update Settings
exports.UPDATE_SETTINGS__SUCCESS = {
  status: 'UPDATE_SETTINGS__SUCCESS',
  code: 201,
};

// Get Settings
exports.GET_SETTINGS__SUCCESS = {
  status: 'GET_SETTINGS__SUCCESS',
  code: 200,
};

// PHOTOS
// Sign Url
exports.SIGN_URL__SUCCESS = {
  status: 'SIGN_URL__SUCCESS',
  code: 200,
};

// Get Photo
exports.GET_PHOTO__SUCCESS = {
  status: 'GET_PHOTO__SUCCESS',
  code: 200,
};
exports.GET_PHOTO__NOT_FOUND = {
  status: 'GET_PHOTO__NOT_FOUND',
  code: 400,
};

// Confirm Upload
exports.CONFIRM_UPLOAD__SUCCESS = {
  status: 'CONFIRM_UPLOAD__SUCCESS',
  code: 200,
};
exports.CONFIRM_UPLOAD__NO_UNCONFIRMED_PHOTO = {
  status: 'CONFIRM_UPLOAD__NO_UNCONFIRMED_PHOTO',
  code: 400,
};
exports.CONFIRM_UPLOAD__NO_UPLOAD_FOUND = {
  status: 'CONFIRM_UPLOAD__NO_UPLOAD_FOUND',
  code: 400,
};
exports.CONFIRM_UPLOAD__NO_AVAILABLE_SLOT = {
  status: 'CONFIRM_UPLOAD__NO_AVAILABLE_SLOT',
  code: 400,
};

// Delete Photo
exports.DELETE_PHOTO__SUCCESS = {
  status: 'DELETE_PHOTO__SUCCESS',
  code: 200,
};
exports.DELETE_PHOTO__NOT_FOUND = {
  status: 'DELETE_PHOTO__NOT_FOUND',
  code: 400,
};

// Reorder Photos
exports.REORDER_PHOTOS__SUCCESS = {
  status: 'REORDER_PHOTOS__SUCCESS',
  code: 200,
};
exports.REORDER_PHOTOS__MISMATCHED_UUIDS = {
  status: 'REORDER_PHOTOS__MISMATCHED_UUIDS',
  code: 400,
};

// CONVERSATIONS
// Send Message
exports.SEND_MESSAGE__SUCCESS = {
  status: 'SEND_MESSAGE__SUCCESS',
  code: 201,
};
exports.SEND_MESSAGE__USER_NOT_FOUND = {
  status: 'SEND_MESSAGE__USER_NOT_FOUND',
  code: 400,
};
exports.SEND_MESSAGE__DUPLICATE_UNCONFIRMED_MESSAGE_UUID = {
  status: 'SEND_MESSAGE__DUPLICATE_UNCONFIRMED_MESSAGE_UUID',
  code: 400,
};

// Get Conversation
exports.GET_CONVERSATION__SUCCESS = {
  status: 'GET_CONVERSATION__SUCCESS',
  code: 200,
};
exports.GET_CONVERSATION__INVALID_MOST_RECENT_MESSAGE_ID = {
  status: 'GET_CONVERSATION__INVALID_MOST_RECENT_MESSAGE_ID',
  code: 400,
};
exports.GET_CONVERSATION__NOT_MATCHED = {
  status: 'GET_CONVERSATION__NOT_MATCHED',
  code: 403,
};

// Read Message
exports.READ_MESSAGE__SUCCESS = {
  status: 'READ_MESSAGE__SUCCESS',
  code: 200,
};
exports.READ_MESSAGE__NOT_MATCHED = {
  status: 'READ_MESSAGE__NOT_MATCHED',
  code: 400,
};
exports.READ_MESSAGE__MESSAGE_NOT_FOUND = {
  status: 'READ_MESSAGE__MESSAGE_NOT_FOUND',
  code: 400,
};
exports.READ_MESSAGE__FAILURE = {
  status: 'READ_MESSAGE__FAILURE',
  code: 409,
};

// Read Message
exports.READ_MESSAGE__SUCCESS = {
  status: 'READ_MESSAGE__SUCCESS',
  code: 200,
};
exports.READ_MESSAGE__NOT_MATCHED = {
  status: 'READ_MESSAGE__NOT_MATCHED',
  code: 400,
};
exports.READ_MESSAGE__MESSAGE_NOT_FOUND = {
  status: 'READ_MESSAGE__MESSAGE_NOT_FOUND',
  code: 400,
};
exports.READ_MESSAGE__FAILURE = {
  status: 'READ_MESSAGE__FAILURE',
  code: 409,
};


// META

// Send Feedback
exports.SEND_FEEDBACK__SUCCESS = {
  status: 'SEND_FEEDBACK__SUCCESS',
  code: 200,
};


// ADMIN

// Get Classmates
exports.GET_CLASSMATES__SUCCESS = {
  status: 'GET_CLASSMATES__SUCCESS',
  code: 200,
};

// Ban User
exports.BAN_USER__SUCCESS = {
  status: 'BAN_USER__SUCCESS',
  code: 200,
};
exports.BAN_USER__ALREADY_BANNED = {
  status: 'BAN_USER__ALREADY_BANNED',
  code: 409,
};
exports.BAN_USER__USER_NOT_FOUND = {
  status: 'BAN_USER__USER_NOT_FOUND',
  code: 400,
};


// ARTISTS

// Search Artists
exports.SEARCH_ARTISTS__SUCCESS = {
  status: 'SEARCH_ARTISTS__SUCCESS',
  code: 200,
};

// Get Artist
exports.GET_ARTIST__SUCCESS = {
  status: 'GET_ARTIST__SUCCESS',
  code: 200,
};
