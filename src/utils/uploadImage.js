const s3 = require('../aws');

const uploadImage = async (image) => {
  const file = await s3
    .upload({
      Bucket: 'projeto-pdv',
      Key: `products/${image.originalname}`,
      Body: image.buffer,
      ContentType: image.mimetype,
    })
    .promise();
  return file.Location;
};

module.exports = uploadImage;
