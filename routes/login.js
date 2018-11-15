const db_connection = require('../configuration/db_connection');
module.exports = app => {
    app.route('/api/login/').post((req, res) => {
        const email = req.headers['email'];
        const password = req.headers['password'];
        db_connection.query(`SELECT id, nombre, tipo FROM usuario WHERE correo='${email}' and contrasena=sha1('${password}') and activo=1`, (err, result) => {
            if (err) throw err;
            if (result.length === 1) {
                req.session.id_user = result[0].id;
                session=req.session.id_user;
                console.log('Sesion iniciada: '+req.session.id_user);
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

    app.route('/api/logged/').post((req, res) => {
        console.log('Sesion actual: '+req.session.id_user);
        if(req.session.id_user){
            res.send(true);
        }
        else{
            res.send(false);
        }
    });

    app.route('/api/logout/').post((req, res) => {
        console.log('Sesion cerrada: '+req.session.id_user);
        req.session = null;
        res.send(true);
    });

    app.route('/api/recover/').post((req, res) => {
        db_connection.query(`SELECT id, nombre, tipo FROM usuario WHERE id=${req.session.id_user}`, (err, result) => {
            if (err) throw err;
            if (result.length === 1) {
                console.log('recovery');
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