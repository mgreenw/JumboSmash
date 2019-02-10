// @flow
import moment from 'moment';

// See server/users/utils.js
const minBirthday = new Date('01/01/1988');
const maxBirthday = new Date('01/01/2001');

export function validateBirthday(birthday: string) {
  const birthdayDate = new Date(birthday);

  // if this fails, this is an invalid date FORMAT
  if (Number.isNaN(birthdayDate)) {
    return false;
  }

  // Check that the birthday is in a reasonable range
  if (birthdayDate < minBirthday || birthdayDate > maxBirthday) {
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
