const route = require('express').Router();
const routesCategories = require('./categoriesRoutes');
const userAuthenticationRoutes = require('./userAuthenticationRoutes');
const userNoAuthenticationRoutes = require('./userNoAuthenticationRoutes');
const routesClient = require('./clientRoutes');
const routesProduct = require('./productRoutes');
const routesOrder = require('./orderRoutes');
const { validateToken } = require('../middlewares/validates');

route.use(routesCategories);
route.use(userNoAuthenticationRoutes);
route.use(routesOrder);
route.use(routesProduct);
route.use(validateToken);
route.use(userAuthenticationRoutes);
route.use(routesClient);

module.exports = { route };
