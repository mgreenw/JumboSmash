// @flow

exports.validate = (password: string) => {
  return password.length >= 8;
};
