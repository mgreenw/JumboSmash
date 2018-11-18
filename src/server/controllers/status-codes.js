// @flow

// SHARED
const SERVER_ERROR = 'SERVER_ERROR';
const BAD_REQUEST = 'BAD_REQUEST';
const AUTHORIZED = 'AUTHORIZED';
const UNAUTHORIZED = 'UNAUTHORIZED';
const PROFILE_SETUP_INCOMPLETE = 'PROFILE_SETUP_INCOMPLETE';
// AUTH

// Send Verification Email
const SEND_VERIFICATION_EMAIL__SUCCESS = 'SEND_VERIFICATION_EMAIL__SUCCESS';
const SEND_VERIFICATION_EMAIL__UTLN_NOT_FOUND = 'SEND_VERIFICATION_EMAIL__UTLN_NOT_FOUND';
const SEND_VERIFICATION_EMAIL__UTLN_NOT_2019 = 'SEND_VERIFICATION_EMAIL__UTLN_NOT_2019';
const SEND_VERIFICATION_EMAIL__UTLN_NOT_STUDENT = 'SEND_VERIFICATION_EMAIL__UTLN_NOT_STUDENT';
const SEND_VERIFICATION_EMAIL__UTLN_NOT_UNDERGRAD = 'SEND_VERIFICATION_EMAIL__UTLN_NOT_UNDERGRAD';
const SEND_VERIFICATION_EMAIL__EMAIL_ALREADY_SENT = 'SEND_VERIFICATION_EMAIL__EMAIL_ALREADY_SENT';

// Verify
const VERIFY__SUCCESS = 'VERIFY__SUCCESS';
const VERIFY__BAD_CODE = 'VERIFY__BAD_CODE';
const VERIFY__EXPIRED_CODE = 'VERIFY__EXPIRED_CODE';
const VERIFY__NO_EMAIL_SENT = 'VERIFY__NO_EMAIL_SENT';

// USERS

// Create Profile
const CREATE_PROFILE__SUCCESS = 'CREATE_PROFILE__SUCCESS';
const CREATE_PROFILE__PROFILE_ALREADY_CREATED = 'CREATE_PROFILE__PROFILE_ALREADY_CREATED';
const CREATE_PROFILE__INVALID_REQUEST = 'CREATE_PROFILE__INVALID_REQUEST';

// Update Profile
const UPDATE_PROFILE__SUCCESS = 'UPDATE_PROFILE__SUCCESS';
const UPDATE_PROFILE__INVALID_REQUEST = 'UPDATE_PROFILE__INVALID_REQUEST';

// Get profile
const GET_PROFILE__SUCCESS = 'GET_PROFILE__SUCCESS';
const GET_PROFILE__PROFILE_NOT_FOUND = 'GET_PROFILE__PROFILE_NOT_FOUND';
const GET_PROFILE__BAD_USER_ID = 'GET_PROFILE__BAD_USER_ID';

// Update Settings
const UPDATE_SETTINGS__SUCCESS = 'UPDATE_SETTINGS_SUCCESS';

// Get Settings
const GET_SETTINGS__SUCCESS = 'GET_SETTINGS__SUCCESS';

module.exports = {
  // Shared
  SERVER_ERROR,
  BAD_REQUEST,
  AUTHORIZED,
  UNAUTHORIZED,
  PROFILE_SETUP_INCOMPLETE,
  // AUTH
  // Send Verification Email
  SEND_VERIFICATION_EMAIL__SUCCESS,
  SEND_VERIFICATION_EMAIL__UTLN_NOT_FOUND,
  SEND_VERIFICATION_EMAIL__UTLN_NOT_2019,
  SEND_VERIFICATION_EMAIL__UTLN_NOT_UNDERGRAD,
  SEND_VERIFICATION_EMAIL__UTLN_NOT_STUDENT,
  SEND_VERIFICATION_EMAIL__EMAIL_ALREADY_SENT,

  // Verify
  VERIFY__SUCCESS,
  VERIFY__BAD_CODE,
  VERIFY__EXPIRED_CODE,
  VERIFY__NO_EMAIL_SENT,

  // USERS
  // Create Profile
  CREATE_PROFILE__SUCCESS,
  CREATE_PROFILE__PROFILE_ALREADY_CREATED,
  CREATE_PROFILE__INVALID_REQUEST,

  // Update Profile
  UPDATE_PROFILE__SUCCESS,
  UPDATE_PROFILE__INVALID_REQUEST,

  // Get Profile
  GET_PROFILE__SUCCESS,
  GET_PROFILE__PROFILE_NOT_FOUND,
  GET_PROFILE__BAD_USER_ID,

  // Update Settings
  UPDATE_SETTINGS__SUCCESS,

  // Get Settings
  GET_SETTINGS__SUCCESS,
};
