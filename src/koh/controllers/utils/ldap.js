// @flow

const ldap = require('ldapjs');

const base = 'ou=people,dc=tufts,dc=edu';

// Given an ldap client, bind to the client
async function bind(client) {
  return new Promise((resolve, reject) => {
    client.bind('', '', (err, res) => {
      if (err) {
        reject(err);
      }
      resolve(res);
    });
  });
}

// Search the base ldap given a filter and attributes to return.
// Can throw SizeLimitExceededError
function search(filter: string, attributes: string[]): Promise<any> {
  return new Promise((resolve, reject) => {
    // Initialize the client
    const client = ldap.createClient({
      url: 'ldap://ldap.tufts.edu',
    });

    // Bind to the client, then complete the search
    // Reject on bind error
    bind(client).then(() => {
      const opts = {
        filter,
        attributes,
        scope: 'sub',
      };

      // Search the client server.
      client.search(base, opts, (err, res) => {
        if (err) reject(err);

        // Accumulate a list of entries found from the search
        const entries = [];
        res.on('searchEntry', (entry) => {
          entries.push(entry.object);
        });

        res.on('error', (error) => {
          client.unbind();
          reject(error);
        });

        res.on('end', (status) => {
          client.unbind();
          resolve({
            entries,
            status,
          });
        });
      });
    }).catch((err) => {
      reject(err);
    });
  });
}

module.exports = {
  search,
};
