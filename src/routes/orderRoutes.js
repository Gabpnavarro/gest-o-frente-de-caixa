const express = require('express');

const {
  validateExistClientOrder,
  validateStock,
  validateRequestOrder,
  validateExistProductOrder,
} = require('../middlewares/validates');

const { registerOrder, listOrders } = require('../controllers/order');

const routesOrder = express();

routesOrder.get('/pedido', listOrders);
routesOrder.post(
  '/pedido',
  validateRequestOrder,
  validateExistClientOrder,
  validateExistProductOrder,
  validateStock,
  registerOrder
);

module.exports = routesOrder;
