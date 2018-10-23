var mysql = require('mysql');

var con = mysql.createConnection({
    host: "localhost",
    port: 3306,
    database: "prueba",
    user: "root",
    password: "hola1234"
});
con.connect(function(err) {
    if (err) throw err;
    console.log("Connected!");
    con.query('SELECT nombre FROM persona WHERE id=2', (err, result) => {
        // if (err) throw err;
        console.log(result[0].nombre);
     });
});

/*https://www.w3schools.com/nodejs/nodejs_mysql.asp*/
/*https://www.howtoforge.com/setting-changing-resetting-mysql-root-passwords*/