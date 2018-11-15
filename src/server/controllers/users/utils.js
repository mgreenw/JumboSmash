// @flow

const _ = require('lodash');

const apiUtils = require('../utils');

const minBirthday = new Date('01/01/1988');
const maxBirthday = new Date('01/01/2001');
const displayNameMaxLength = 50;
const bioMaxLength = 500;

// Profile Errors
const profileErrorMessages = {
  DISPLAY_NAME_TOO_LONG: 'DISPLAY_NAME_TOO_LONG',
  BIRTHDAY_NOT_VALID: 'BIRTHDAY_NOT_VALID',
  BIO_TOO_LONG: 'BIO_TOO_LONG',
  IMAGE_URL_NOT_VALID: 'IMAGE_URL_NOT_VALID',
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
  image1Url: ?string,
  image2Url: ?string,
  image3Url: ?string,
  image4Url: ?string,
  bio: ?string,
}

// Given a profile, validate the fields. If there is an error, throw an error
// with the "message" as the error
function validateProfile(profile: Profile) {
  const {
    displayName,
    birthday,
    image1Url,
    image2Url,
    image3Url,
    image4Url,
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

  // Ensure all supplied urls are valid urls
  const urls = [image1Url, image2Url, image3Url, image4Url];
  for (let i = 0; i < urls.length; i += 1) {
    const url = urls[i];
    // If the url is undefined, don't check it - it was not included in the request
    if (url && !apiUtils.isValidUrl(url)) {
      throw profileErrorMessages.IMAGE_URL_NOT_VALID;
    }
  }
}

function getFieldTemplates(definedFields: Array<[string, any]>) {
  // Get an array of the fields themselves
  const fields = _.map(definedFields, field => _.nth(field, 1));

  // Get all the fields with their respective template strings. fieldTemplates
  // is a string like 'display_name = $1, birthday = $2, bio = $3'
  const templateString = _.join(
    _.map(definedFields, (field, i) => `${_.nth(field, 0)} = $${i + 1}`),
    ', ',
  );

  const fieldTemplate = {
    templateString: templateString,
    fields: fields,
  };

  return fieldTemplate;
}

module.exports = {
  validateProfile,
  profileErrorMessages,
  getFieldTemplates,
};
