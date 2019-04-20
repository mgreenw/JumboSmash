// @flow
import moment from 'moment';

// See server/users/utils.js
const oldestBirthday = new Date('01/01/2001');

export function validateBirthday(birthday: string) {
  const [year, month, day] = birthday
    .split('-')
    .map(dateComponentStr => Number.parseInt(dateComponentStr, 10));

  // Note the "month - 1": Javascript's month is 0-indexed. Oof.
  const birthdayDate = new Date(year, month - 1, day);
  const now = new Date();

  if (
    // This ensures that the given birthdayDate is not an "Invalid Date"
    Number.isNaN(birthdayDate.getTime()) ||
    // This checks if the birthday is within the reasonable range.
    birthdayDate < oldestBirthday ||
    birthdayDate > now ||
    // The final check below ensures that the Date that javascript coalesces the given birthday
    // to is actually on the same day as the given birthday. Also duh.
    // https://medium.com/@esganzerla/simple-date-validation-with-javascript-caea0f71883c
    birthdayDate.getDate() !== day
  ) {
    return false;
  }

  return true;
}

export function getAge(birthday: string): number {
  const birthdayDate = new Date(birthday);

  // if this fails, this is an invalid date FORMAT
  if (Number.isNaN(birthdayDate)) {
    throw new Error('Error getting age in years: Birthday is null');
  }

  return moment().diff(birthdayDate, 'years');
}
