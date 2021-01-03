const express = require('express');
const cors = require('cors')
const app = express();

const bodyParser = require('body-parser');
const fs = require('fs');

app.use(cors())
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(process.cwd() + '/frontend/dist'));

require('./app/routes/index.js')(app, fs);

module.exports = app
