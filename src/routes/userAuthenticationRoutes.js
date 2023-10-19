const express = require('express');

const { validateRequestBody } = require('../middlewares/validates');
const { schemaUser } = require('../utils/schemas');
const { editUser, detailUser } = require('../controllers/user');

const userAuthenticationRoutes = express();

userAuthenticationRoutes.put(
  '/usuario',
  validateRequestBody(schemaUser),
  editUser
);
userAuthenticationRoutes.get('/usuario', detailUser);

module.exports = userAuthenticationRoutes;
