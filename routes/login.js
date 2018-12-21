const db_connection = require('../configuration/db_connection');
module.exports = app => {
    app.route('/api/login/').post((req, res) => {
        const email = req.headers['email'];
        const password = req.headers['password'];
        db_connection.query(`call log('${email}',sha1('${password}'))`, (err, result) => {
        //db_connection.query(`SELECT id, nombre, tipo FROM usuario WHERE correo='${email}' and contrasena=sha1('${password}') and activo=1`, (err, result) => {
            var aux = result[0];
            var aux2 = aux[0];
            if (err) throw err;
            if (aux2.result === 1) {
                console.log(aux2);
                req.session.id_user = aux2.id;
                session=req.session.id_user;
                console.log('Sesion iniciada: '+req.session.id_user);
                res.send({
                        id: aux2.id,
                        userName: aux2.nombre,
                        isAdmin: ((aux2.tipo==0) ? false : true)
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