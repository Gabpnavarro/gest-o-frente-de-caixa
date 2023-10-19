const aws = require('aws-sdk');

const endpoint = new aws.Endpoint(process.env.BACKBLAZE_S3_ENDPOINT);

const s3 = new aws.S3({
  endpoint,
  credentials: {
    accessKeyId: process.env.BACKBLAZE_KEY_ID,
    secretAccessKey: process.env.BACKBLAZE_APP_KEY,
  },
});

module.exports = s3;
