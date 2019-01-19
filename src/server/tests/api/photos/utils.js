const request = require('request');
const fs = require('fs');

async function uploadTestPhoto(payload) {
  return new Promise((resolve, reject) => {
    const params = {
      url: payload.url,
      formData: {
        ...payload.fields,
        'Content-Type': 'image/jpeg',
        file: fs.createReadStream(`${__dirname}/assets/max.jpg`),
      },
    };

    request.post(params, (err, res, body) => {
      if (err) return reject();
      return resolve(body);
    });
  });
}

module.exports = {
  uploadTestPhoto,
};
