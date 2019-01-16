// @flow
// See server/users/utils.js
const minBirthday = new Date("01/01/1988");
const maxBirthday = new Date("01/01/2001");

export default function validateBirthday(birthday: string) {
  const birthdayDate = new Date(birthday);

  // if this fails, this is an invalid date FORMAT
  if (isNaN(birthdayDate)) {
    return false;
  }

  // Check that the birthday is in a reasonable range
  if (birthdayDate < minBirthday || birthdayDate > maxBirthday) {
    return false;
  }
  return true;
}
