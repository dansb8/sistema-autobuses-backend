const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const cors = require('cors')

const app = express();

//Settings
app.set('port', 8000);

//Middleware
app.use(bodyParser.urlencoded({ extended: false }));

var corsOptions = {
    origin: 'http://localhost:4200',
    optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
}
app.use(cors(corsOptions))

module.exports = app;