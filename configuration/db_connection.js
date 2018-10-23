var mysql = require('mysql');

var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    database: "prueba",
    user: "root",
    password: "hola1234"
});

module.exports = connection;