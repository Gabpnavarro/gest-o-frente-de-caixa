const express = require('express');
const multer = require('../multer');

const {
  validateRequestBody,
  validateExistProduct,
  validateExistCategory,
  validateImage,
  validateDeleteProduct,
} = require('../middlewares/validates');

const { schemaProduct } = require('../utils/schemas');

const {
  listProducts,
  detailProduct,
  updateProduct,
  deleteProduct,
  registerProduct,
} = require('../controllers/product');

const routesProduct = express();

routesProduct.get('/produto', validateExistCategory, listProducts);
routesProduct.get('/produto/:id', validateExistProduct, detailProduct);
routesProduct.post(
  '/produto/',
  multer.single('produto_imagem'),
  validateRequestBody(schemaProduct),
  validateImage,
  validateExistCategory,
  registerProduct
);
routesProduct.put(
  '/produto/:id',
  multer.single('produto_imagem'),
  validateRequestBody(schemaProduct),
  validateExistProduct,
  validateExistCategory,
  updateProduct
);
routesProduct.delete(
  '/produto/:id',
  validateExistProduct,
  validateDeleteProduct,
  deleteProduct
);

module.exports = routesProduct;
