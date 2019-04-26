// @flow
import moment from 'moment';

// See server/users/utils.js
const oldestBirthday = new Date('01/01/1988');

type Reason = 'VALID' | 'NOT_REAL_DATE' | 'FUTURE' | 'TOO_OLD';
type BirthdayValidation = { valid: boolean, reason: Reason };

export function validateBirthday(birthday: string): BirthdayValidation {
  const [, , day] = birthday
    .split('-')
    .map(dateComponentStr => Number.parseInt(dateComponentStr, 10));

  // Note the "month - 1": Javascript's month is 0-indexed. Oof.
  const birthdayDate = new Date(birthday);
  const now = new Date();

  if (
    Number.isNaN(birthdayDate.getTime()) ||
    birthdayDate.getUTCDate() !== day
  ) {
    return { valid: false, reason: 'NOT_REAL_DATE' };
  }

  if (birthdayDate < oldestBirthday) return { valid: false, reason: 'TOO_OLD' };
  if (birthdayDate > now) return { valid: false, reason: 'FUTURE' };
  return { valid: true, reason: 'VALID' };
}

/**
 *
 * @param {Reason} reason map a name error enum to an error message
 */
export function birthdayErrorCopy(reason: Reason): string {
  switch (reason) {
    case 'FUTURE': {
      return "Oops, that's in the future!";
    }

    case 'NOT_REAL_DATE': {
      return "Oops, that's not a real date!";
    }

    case 'TOO_OLD': {
      return "Oops, you're not that old!";
    }

    case 'VALID': {
      return '';
    }

    default: {
      // eslint-disable-next-line no-unused-expressions
      (reason: empty); // ensures we have handled all cases
      return '';
    }
  }
}

export function getAge(birthday: string): number {
  const birthdayDate = new Date(birthday);

  // if this fails, this is an invalid date FORMAT
  if (Number.isNaN(birthdayDate)) {
    throw new Error('Error getting age in years: Birthday is null');
  }

  return moment().diff(birthdayDate, 'years');
}
