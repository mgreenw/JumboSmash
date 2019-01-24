// @flow

const _ = require('lodash');

const minBirthday = new Date('01/01/1988');
const maxBirthday = new Date('01/01/2001');
const displayNameMaxLength = 50;
const bioMaxLength = 500;

// Profile Errors
const profileErrorMessages = {
  DISPLAY_NAME_TOO_LONG: 'DISPLAY_NAME_TOO_LONG',
  BIRTHDAY_NOT_VALID: 'BIRTHDAY_NOT_VALID',
  BIO_TOO_LONG: 'BIO_TOO_LONG',
};

// This type here is to ensure that calls to the validateProfile function
// are of the correct type. That being said, the clients of this function may
// have different needs. For example, the 'Create My Profile' endpoint requires
// certain fields such as displayName, and will always include them. However,
// because 'Update My Profile' does not require any fields, they are all given
// as optional in this type.
type Profile = {
  displayName: ?string,
  birthday: ?string,
  bio: ?string,
}

// Given a profile, validate the fields. If there is an error, throw an error
// with the "message" as the error
function validateProfile(profile: Profile) {
  const {
    displayName,
    birthday,
    bio,
  } = profile;

  // Check if the user's display name is too long
  if (displayName && displayName.length > displayNameMaxLength) {
    throw profileErrorMessages.DISPLAY_NAME_TOO_LONG;
  }

  // Check that the birthday is in a reasonable range
  if (birthday) {
    const birthdayDate = new Date(birthday);
    if (birthdayDate < minBirthday || birthdayDate > maxBirthday) {
      throw profileErrorMessages.BIRTHDAY_NOT_VALID;
    }
  }

  // Check if the user's bio is too long
  if (bio && bio.length > bioMaxLength) {
    throw profileErrorMessages.BIO_TOO_LONG;
  }
}

// Given an array of fields to insert into the database, remove any undefined
// fields and generate a template string for the fields for a postgres update
// This is a helper method that can be reused to allow for optional fields
// to be updated with ease
function getFieldTemplates(definedFields: Array<[string, any]>) {
  // Get an array of the fields themselves
  const fields = _.map(definedFields, field => _.nth(field, 1));

  // Get all the fields with their respective template strings. fieldTemplates
  // is a string like 'display_name = $1, birthday = $2, bio = $3'
  const templateString = _.join(
    _.map(definedFields, (field, i) => `${_.nth(field, 0)} = $${i + 1}`),
    ', ',
  );

  return {
    templateString,
    fields,
  };
}

module.exports = {
  validateProfile,
  profileErrorMessages,
  getFieldTemplates,
};
