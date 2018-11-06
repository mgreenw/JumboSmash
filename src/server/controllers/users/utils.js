// @flow

const codes = require('../status-codes');
const apiUtils = require('../utils');

const minBirthday = new Date('01/01/1988');
const maxBirthday = new Date('01/01/2001');
const displayNameMaxLength = 50;
const bioMaxLength = 500;

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
    throw codes.PROFILE__DISPLAY_NAME_TOO_LONG;
  }

  // Check that the birthday is in a reasonable range
  if (birthday) {
    const birthdayDate = new Date(birthday);
    if (birthdayDate < minBirthday || birthdayDate > maxBirthday) {
      throw codes.PROFILE__BIRTHDAY_NOT_VALID;
    }
  }

  // Check if the user's bio is too long
  if (bio && bio.length > bioMaxLength) {
    throw codes.PROFILE__BIO_TOO_LONG;
  }

  // Ensure all supplied urls are valid urls
  const urls = [image1Url, image2Url, image3Url, image4Url];
  for (let i = 0; i < urls.length; i += 1) {
    const url = urls[i];
    // If the url is undefined, don't check it - it was not included in the request
    if (url && !apiUtils.isValidUrl(url)) {
      throw codes.PROFILE__IMAGE_URL_NOT_VALID;
    }
  }
}

module.exports = {
  validateProfile,
};
