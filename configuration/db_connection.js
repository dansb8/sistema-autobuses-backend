var mysql = require('mysql');

var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    database: "linea_autobuses",
    user: "root",
    password: "hola1234"
});

connection.connect(function(err) {
    if (err) throw err;
});

module.exports = connection;
/*https://www.w3schools.com/nodejs/nodejs_mysql.asp*/
/*https://www.howtoforge.com/setting-changing-resetting-mysql-root-passwords*/