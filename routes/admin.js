const db_connection = require('../configuration/db_connection');

module.exports = app => {
    app.route('/api/admin/data/').post((req, res) => {
        const id = req.headers['id'];
        db_connection.query(`SELECT nombre, ap_pat, ap_mat, rfc, correo, telefono FROM usuario WHERE id='${id}'`, (err, result) => {
            if (err) throw err;
            if (result.length === 1) {
                res.send({
                    first_name: result[0].nombre,
                    last_name_p: result[0].ap_pat,
                    last_name_m: result[0].ap_mat,
                    email: result[0].correo,
                    tel: result[0].telefono,
                    rfc: result[0].rfc,
                    password: null
                });
            }
            else {
                res.send({id: null});
            }
        });
    });

    app.route('/api/admin/update/').post((req, res) => {
        const id = req.headers['id'];
        const nombre = req.headers['first_name'];
        const ap_pat = req.headers['last_name_p'];
        const ap_mat = req.headers['last_name_m'];
        const telefono = req.headers['tel'];
        const correo = req.headers['email'];
        const contrasena = req.headers['password'];
        const rfc = req.headers['rfc'];
        db_connection.query(`SELECT id FROM usuario WHERE correo='${correo}' and activo=1 and id<>${id}`, (err, result) => {
            if (err) throw err;
            if (result.length === 1) {
                res.send(false);
            }
            else {
                if(contrasena==""){
                    db_connection.query(`UPDATE usuario SET nombre='${nombre}',ap_pat='${ap_pat}',ap_mat='${ap_mat}',rfc='${rfc}',correo='${correo}',telefono='${telefono}' 
                                    WHERE id=${id}`, (err, result) => {
                        console.log('NO actualice contraseña');
                        res.send(true);
                    });
                }
                else{
                    db_connection.query(`UPDATE usuario SET nombre='${nombre}',ap_pat='${ap_pat}',ap_mat='${ap_mat}',rfc='${rfc}',correo='${correo}',telefono='${telefono}',contrasena=sha1('${contrasena}') 
                                    WHERE id=${id}`, (err, result) => {
                        console.log('SI actualice contraseña');
                        res.send(true);
                    });
                }
            }
        });
    });

    app.route('/api/admin/checkpass/').post((req, res) => {
        const id = req.headers['id'];
        const contrasena = req.headers['password'];
        db_connection.query(`SELECT id FROM usuario WHERE id='${id}' and contrasena=sha1('${contrasena}')`, (err, result) => {
            if (err) throw err;
            if (result.length === 1) {
                console.log(id+' '+contrasena+' true');
                res.send(true);
            }
            else {
                console.log(id+' '+contrasena+' false');
                res.send(false);
            }
        });
    });
}