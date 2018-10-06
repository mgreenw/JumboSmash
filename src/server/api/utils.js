// @flow

const request = require('request');

/* eslint-disable arrow-body-style */
function postForm(urlFormData: Object): Promise<any> {
  return new Promise((resolve, reject) => {
    request.post(urlFormData, (err, httpResponse, body) => {
      if (err) reject();
      resolve({ body, httpResponse });
    });
  });
}

function get(url: string): Promise<any> {
  return new Promise((resolve, reject) => {
    request(url, (err, _, body) => {
      if (err) reject();
      resolve(body);
    });
  });
}
/* eslint-enable arrow-body-style */

module.exports = {
  get,
  postForm,
};
