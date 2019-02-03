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
// AUTH

// Send Verification Email
exports.SEND_VERIFICATION_EMAIL__SUCCESS = {
  status: 'SEND_VERIFICATION_EMAIL__SUCCESS',
  code: 200,
};
exports.SEND_VERIFICATION_EMAIL__UTLN_NOT_FOUND = {
  status: 'SEND_VERIFICATION_EMAIL__UTLN_NOT_FOUND',
  code: 400,
};
exports.SEND_VERIFICATION_EMAIL__UTLN_NOT_2019 = {
  status: 'SEND_VERIFICATION_EMAIL__UTLN_NOT_2019',
  code: 400,
};
exports.SEND_VERIFICATION_EMAIL__UTLN_NOT_STUDENT = {
  status: 'SEND_VERIFICATION_EMAIL__UTLN_NOT_STUDENT',
  code: 400,
};
exports.SEND_VERIFICATION_EMAIL__UTLN_NOT_UNDERGRAD = {
  status: 'SEND_VERIFICATION_EMAIL__UTLN_NOT_UNDERGRAD',
  code: 400,
};
exports.SEND_VERIFICATION_EMAIL__EMAIL_ALREADY_SENT = {
  status: 'SEND_VERIFICATION_EMAIL__EMAIL_ALREADY_SENT',
  code: 200,
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

// Block
exports.BLOCK__SUCCESS = {
  status: 'BLOCK__SUCCESS',
  code: 200,
};
exports.BLOCK__USER_NOT_FOUND = {
  status: 'BLOCK__USER_NOT_FOUND',
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
exports.DELETE_PHOTO__CANNOT_DELETE_LAST_PHOTO = {
  status: 'DELETE_PHOTO__CANNOT_DELETE_LAST_PHOTO',
  code: 409,
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
exports.REORDER_PHOTOS__MISMATCHED_IDS = {
  status: 'REORDER_PHOTOS__MISMATCHED_IDS',
  code: 400,
};
