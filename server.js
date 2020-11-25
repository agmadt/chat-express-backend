require('dotenv').load();

const express = require('express');
const bodyParser = require('body-parser');
const routes = require('./routes');
const helmet = require('helmet');
const cors = require('cors');

const app = express();

app.use(helmet());

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(routes);

module.exports = app;