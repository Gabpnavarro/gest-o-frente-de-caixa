const express = require('express');
const { route } = require('./routes');
const cors = require('cors');
const app = express();
const swaggerUi = require('swagger-ui-express');
const swaggerFile = require('../swagger.json');

app.use(cors());
app.use(express.json());
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerFile));
app.use(route);

module.exports = { app };
