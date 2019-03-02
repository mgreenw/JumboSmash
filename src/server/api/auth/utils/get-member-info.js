// @flow

const request = require('request');
const config = require('config');

// Use Koh to get a member's info given a utln.
const getMemberInfo = (email: string): Promise<any> => {
  return new Promise((resolve, reject) => {
    // Make the request to Koh.
    request(`${config.get('koh_host')}/api/member-info/${email}`, (err, res, body) => {
      // If there is an error or no response, reject
      if (err) return reject(err);
      if (!res) return reject(new Error('No response from koh.'));

      // Parse the JSON from the response
      const bodyJson = JSON.parse(body);

      // Use the response's 'status' key to return the appropriate value. If
      // status is unexpected, reject.
      return resolve(bodyJson);
    });
  });
};

module.exports = getMemberInfo;
