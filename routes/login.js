const db_connection = require('../configuration/db_connection');

module.exports = app => {
    app.route('/api/login/').post((req, res) => {
        const email = req.headers['email'];
        const password = req.headers['password'];
        db_connection.query(`SELECT id, nombre, tipo FROM usuario WHERE correo='${email}' and contrasena=sha1('${password}') and activo=1`, (err, result) => {
            if (err) throw err;
            if (result.length === 1) {
                res.send({
                        id: result[0].id,
                        userName: result[0].nombre,
                        isAdmin: ((result[0].tipo==0) ? false : true)
                });
            }
            else {
                res.send({
                    id: null,
                    userName: null,
                    isAdmin: null
                });
            }
        });
    });
}