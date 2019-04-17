// @flow

import { type Capabilities } from '../admin/review-profile';

const _ = require('lodash');

// About 30 years old.
const oldestBirthday = new Date('01/01/1988');
const displayNameMaxLength = 50;
const bioMaxLength = 500;

// Profile Errors
const profileErrorMessages = {
  DISPLAY_NAME_TOO_LONG: 'DISPLAY_NAME_TOO_LONG',
  BIRTHDAY_NOT_VALID: 'BIRTHDAY_NOT_VALID',
  BIRTHDAY_UNDER_18: 'BIRTHDAY_UNDER_18',
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
    const [year, month, day] = birthday.split('-').map(dateComponentStr => Number.parseInt(dateComponentStr, 10));

    // Note the "month - 1": Javascript's month is 0-indexed. Oof.
    const birthdayDate = new Date(year, month - 1, day);
    const now = new Date();


    if (
      // This ensures that the given birthdayDate is not an "Invalid Date"
      Number.isNaN(birthdayDate.getTime())
      // This checks if the birthday is within the reasonable range.
      || birthdayDate < oldestBirthday
      || birthdayDate > now
      // The final check below ensures that the Date that javascript coalesces the given birthday
      // to is actually on the same day as the given birthday. Also duh.
      // https://medium.com/@esganzerla/simple-date-validation-with-javascript-caea0f71883c
      || birthdayDate.getDate() !== day
    ) {
      throw profileErrorMessages.BIRTHDAY_NOT_VALID;
    }

    // Ensure the user is older than 18.
    const eighteenthBirthday = new Date(year + 18, month - 1, day);

    // Logic: if it is currently before the 18th birthday
    if (now < eighteenthBirthday) {
      throw profileErrorMessages.BIRTHDAY_UNDER_18;
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

const DefaultProfileOptions = {
  tableAlias: '',
  buildJSON: false,
};

/*
This function defines the select statement for the profile fields.
It allows some options:
  tableAlias: the name of the alias for the table in the query. Example: 'they_profile'
  buildJSON: instead of returning teh fields directly, this builds the entire profile
             into a JSON object which can then be named and returned as desired.
             See "get-scene-candidates.js" for an example of this
*/
function profileSelectQuery(
  userIdMatch: string, /* The query paramater or other match for the user's profile to get.
                          e.g: $1 or they_profile.user_id */
  options: typeof DefaultProfileOptions = DefaultProfileOptions, // See options above
) {
  const opts = {
    ...DefaultProfileOptions,
    ...options,
  };
  const tableName = opts.tableAlias === '' ? '' : `${opts.tableAlias}.`;

  const fields = `
    json_build_object(
      'displayName', ${tableName}display_name,
      'birthday', to_char(${tableName}birthday, 'YYYY-MM-DD'),
      'bio', ${tableName}bio,
      'postgradRegion', ${tableName}postgrad_region,
      'freshmanDorm', ${tableName}freshman_dorm,
      'springFlingAct', ${tableName}spring_fling_act
    )
  `;

  const photoUuids = `
    ARRAY(
      SELECT uuid
      FROM photos
      WHERE user_id = ${userIdMatch}
      ORDER BY index
    )
  `;

  if (opts.buildJSON) {
    return `
      json_build_object(
        'fields', ${fields},
        'photoUuids', ${photoUuids}
      )
    `;
  }

  return `
      ${fields} AS fields,
      ${photoUuids} AS "photoUuids"
    `;
}

/*
This function allows the selection of a user's settings in a reusable way! Use it in a SELECT
or RETURNING statement.
  - settingsTableAlias: the alias for the settings table for the user. E.g. user_setttings
*/
function settingsSelectQuery(settingsTableAlias: string = '') {
  const tableName = settingsTableAlias === '' ? '' : `${settingsTableAlias}.`;

  return `
    json_build_object(
      'man', ${tableName}want_he,
      'woman', ${tableName}want_she,
      'nonBinary', ${tableName}want_they
    ) AS "lookingForGenders",
    json_build_object(
      'man', ${tableName}use_he,
      'woman', ${tableName}use_she,
      'nonBinary', ${tableName}use_they
    ) AS "identifyAsGenders",
    json_build_object(
      'smash', ${tableName}active_smash,
      'social', ${tableName}active_social,
      'stone', ${tableName}active_stone
    ) AS "activeScenes",
    expo_push_token AS "expoPushToken",
    notifications_enabled AS "notificationsEnabled",
    ${tableName}admin_password IS NOT NULL AS "isAdmin"
  `;
}

// Account Updates

type Admin = {
  id: number,
  utln: string,
};

type ProfileReview = {
  type: 'PROFILE_REVIEW',
  reviewer: Admin,
  comment: string | null,
  capabilities: Capabilities,
};

type AccountTermination = {
  type: 'ACCOUNT_TERMINATION',
  admin: Admin | 'server', // Null here means the server did it
  reason: string,
};

type ProfileUpdate = {
  type: 'PROFILE_UPDATE',
  changedFields: Profile,
};

type NewPhoto = {
  type: 'NEW_PHOTO',
  photoUUID: string,
}

type AccountUpdate = ProfileReview | AccountTermination | ProfileUpdate | NewPhoto;

type AccountUpdateMeta = {
  timestamp: string,
  update: AccountUpdate
};

function constructAccountUpdate(update: AccountUpdate): AccountUpdateMeta {
  return {
    timestamp: new Date().toISOString(),
    update,
  };
}

module.exports = {
  validateProfile,
  profileErrorMessages,
  getFieldTemplates,
  profileSelectQuery,
  settingsSelectQuery,
  constructAccountUpdate,
};
