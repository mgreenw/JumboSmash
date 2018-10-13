// @flow

// SHARED
const SERVER_ERROR = 'SERVER_ERROR';
const BAD_REQUEST = 'BAD_REQUEST';

// AUTH

// Register
const REGISTER__NEED_TO_VERIFY = 'REGISTER__NEED_TO_VERIFY';
const REGISTER__ALREADY_VERIFIED = 'REGISTER__ALREADY_VERIFIED';
const REGISTER__UTLN_NOT_FOUND = 'REGISTER__UTLN_NOT_FOUND';
const REGISTER__INVALID_UTLN = 'REGISTER__INVALID_UTLN';
const REGISTER__PASSWORD_WEAK = 'REGISTER__PASSWORD_WEAK';

module.exports = {
  // Shared
  SERVER_ERROR,
  BAD_REQUEST,

  // AUTH
  // Register
  REGISTER__NEED_TO_VERIFY,
  REGISTER__ALREADY_VERIFIED,
  REGISTER__UTLN_NOT_FOUND,
  REGISTER__INVALID_UTLN,
  REGISTER__PASSWORD_WEAK,
};
