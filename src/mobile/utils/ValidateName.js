// @flow

// See server/users/utils.js
const displayNameMaxLength = 20;
type NameValidityReason = 'INVALID__EMPTY_NAME' | 'INVALID__TOO_LONG' | 'VALID';
/**
 *
 * @param {string} displayName returns `INVALID__EMPTY_NAME`, `INVALID__TOO_LONG`, or `VALID`
 */
export function validateName(
  displayName: string
): { valid: boolean, reason: NameValidityReason } {
  if (displayName.trim().length === 0) {
    return { valid: false, reason: 'INVALID__EMPTY_NAME' };
  }
  if (displayName.trim().length > displayNameMaxLength) {
    return { valid: false, reason: 'INVALID__TOO_LONG' };
  }
  return { valid: true, reason: 'VALID' };
}

/**
 *
 * @param {NameValidityReason} reason map a name error enum to an error message
 */
export function nameErrorCopy(reason: NameValidityReason): string {
  switch (reason) {
    case 'INVALID__TOO_LONG': {
      return 'Name Too Long';
    }

    case 'INVALID__EMPTY_NAME': {
      return 'Required';
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
