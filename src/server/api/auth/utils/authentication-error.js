// @flow

/* eslint-disable lines-between-class-members */
class AuthenticationError extends Error {
  banned: boolean;
  bannedReason: ?string;

  constructor(message: string, banned: boolean = false, bannedReason: ?string = null) {
    super(message);
    this.banned = banned;
    this.bannedReason = bannedReason;
  }
}

module.exports = AuthenticationError;
