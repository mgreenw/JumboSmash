// @flow

/* eslint-disable lines-between-class-members */
class AuthenticationError extends Error {
  terminated: boolean;
  terminationReason: ?string;

  constructor(message: string, terminated: boolean = false, terminationReason: ?string = null) {
    super(message);
    this.terminated = terminated;
    this.terminationReason = terminationReason;
  }
}

module.exports = AuthenticationError;
