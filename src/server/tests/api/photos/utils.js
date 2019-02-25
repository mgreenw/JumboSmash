const request = require('request');
const fs = require('fs');

const config = require('config');
const aws = require('../../../aws');

const s3 = new aws.S3({ region: 'us-east-1', signatureVersion: 'v4' });
const bucket = config.get('s3_bucket');

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

async function deletePhoto(key) {
  return new Promise((resolve, reject) => {
    const params = {
      Bucket: bucket,
      Key: key,
    };
    s3.deleteObject(params, (err, data) => {
      if (err) return reject(err);
      return resolve(data);
    });
  });
}

module.exports = {
  uploadTestPhoto,
  deletePhoto,
};
