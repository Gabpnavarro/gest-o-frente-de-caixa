const s3 = require('../aws');

const deleteImage = async (image) => {
  try {
    return await s3
      .deleteObject({
        Bucket: 'projeto-pdv',
        Key: `products/${image}`,
      })
      .promise();
  } catch (error) {
    throw new Error('Erro ao excluir imagem do S3');
  }
};

module.exports = deleteImage;
