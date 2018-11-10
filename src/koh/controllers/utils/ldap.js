// @flow

const ldap = require('ldapjs');

const base = 'ou=people,dc=tufts,dc=edu';

async function bind(client) {
  return new Promise((resolve, reject) => {
    client.bind('', '', (err, res) => {
      if (err) {
        console.log('Error binding to ldap', err);
        reject(err);
      }
      resolve(res);
    });
  });
}


// Can throw SizeLimitExceededError
function search(filter, attributes) {
  return new Promise((resolve, reject) => {

    const client = ldap.createClient({
      url: 'ldap://ldap.tufts.edu',
    });

    bind(client).then((bindResult) => {
      const opts = {
        filter,
        attributes,
        scope: 'sub',
      };

      client.search(base, opts, (err, res) => {
        if (err) reject(err);
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
      })
    .catch((err) => {
      reject(err);
    });
  });
}

// async function runSearch() {
//   const attributes = ['givenName', 'mail', 'tuftsEduCollege', 'uid', 'tuftsEduTrunk', 'tuftsEduClassYear', 'sn', 'cn', 'displayName', 'tuftsEduMajor'];
//   const filter = '(&(tuftsEduClassYear=19)(|(tuftsEduCollege=COLLEGE OF LIBERAL ARTS)(tuftsEduCollege=SCHOOL OF ENGINEERING))(sn=A*))';
//   const result = await search(filter, attributes);
// }

module.exports = {
  search,
};
