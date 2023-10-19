const express = require('express');
const { getAllCategories } = require('../controllers/categories');

const routesCategories = express();

routesCategories.get('/categoria', getAllCategories);

module.exports = routesCategories;
