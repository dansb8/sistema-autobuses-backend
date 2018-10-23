const db_connection = require('../configuration/db_connection');

module.exports = app => {
    app.route('/api/login/').post((req, res) => {
        const email = req.headers['email'];
        const password = req.headers['password'];
        db_connection.query(`SELECT id, nombre, tipo FROM usuario WHERE correo='${email}' and contrasena=sha1('${password}')`, (err, result) => {
            if (err) throw err;
            if (result.length === 1) {
                res.send({
                    user: [ {
                        id: result[0].id,
                        name: result[0].nombre,
                        type: result[0].tipo
                    } ]
                });
            }
            else {
                res.send({
                    user: [ {
                        id: null
                    } ]
                });
            }
        });
    });
}