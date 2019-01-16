// @flow
// See server/users/utils.js
const displayNameMaxLength = 50;

export default function validateName(displayName: string) {
  return displayName && displayName.length < displayNameMaxLength;
}
