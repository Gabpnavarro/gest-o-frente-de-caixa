const express = require('express');

const {
  validateRequestBody,
  validateExistClient,
  validateExistEmailCpf,
} = require('../middlewares/validates');
const { schemaClient } = require('../utils/schemas');

const {
  listClients,
  updateClient,
  registerClient,
  detailClient,
} = require('../controllers/client');

const routesClient = express();

routesClient.get('/cliente', listClients);
routesClient.get('/cliente/:id', validateExistClient, detailClient);
routesClient.post(
  '/cliente/',
  validateRequestBody(schemaClient),
  validateExistEmailCpf,
  registerClient
);
routesClient.put(
  '/cliente/:id',
  validateRequestBody(schemaClient),
  validateExistClient,
  validateExistEmailCpf,
  updateClient
);

module.exports = routesClient;
