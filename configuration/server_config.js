const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const cors = require('cors')
const cookieSession = require('cookie-session')

const app = express();

//Settings
app.set('port', 8000);

//Session
app.set('trust proxy', 1);
app.use(cookieSession({
    name: 'session',
    keys: ['key1','key2'],

    // Cookie Options
    maxAge: 24 * 60 * 60 * 1000 // 24 hours
}))

//Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var corsOptions = {
    origin: 'http://localhost:4200',
    credentials: true,
    optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
}
app.use(cors(corsOptions))

module.exports = app;