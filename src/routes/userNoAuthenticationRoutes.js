const express = require('express');

const {
  validateExistEmail,
  validateLogin,
  validateRequestBody,
} = require('../middlewares/validates');
const { schemaUser, schemaLogin } = require('../utils/schemas');
const { loginUser, registerUser } = require('../controllers/user');

const userNoAuthenticationRoutes = express();

userNoAuthenticationRoutes.post(
  '/usuario',
  validateRequestBody(schemaUser),
  validateExistEmail,
  registerUser
);
userNoAuthenticationRoutes.post(
  '/login',
  validateRequestBody(schemaLogin),
  validateLogin,
  loginUser
);

module.exports = userNoAuthenticationRoutes;
