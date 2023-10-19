const express = require('express');
const { route } = require('./routes');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());
app.use(route);

module.exports = { app };
