const db_connection = require('../configuration/db_connection');

module.exports = app => {
    app.route('/api/user/register/').post((req, res) => {
        const nombre = req.headers['first_name'];
        const ap_pat = req.headers['last_name_p'];
        const ap_mat = req.headers['last_name_m'];
        const telefono = req.headers['tel'];
        const correo = req.headers['email'];
        const contraseña = req.headers['password'];
        const rfc = req.headers['rfc'];
        db_connection.query(`SELECT id FROM usuario WHERE correo='${correo}' and activo=1`, (err, result) => {
            if (err) throw err;
            if (result.length === 1) {
                res.send(false);
            }
            else {
                db_connection.query(`call register('${nombre}','${ap_pat}','${ap_mat}','${rfc}','${correo}','${telefono}',sha1('${contraseña}'))`, (err, result) => {
                //db_connection.query(`INSERT INTO usuario (nombre,ap_pat,ap_mat,rfc,tipo,correo,telefono,num_viajes,contrasena,activo)
                //           VALUES ('${nombre}','${ap_pat}','${ap_mat}','${rfc}',0,'${correo}','${telefono}',0,sha1('${contraseña}'),1)`, (err, result) => {
                    res.send(true);
                });
            }
        });
    });














    /*app.route('/api/cats/:id').get((req, res) => {
        const requestedCatName = req.params['id'];
        db_connection.query(`SELECT nombre,tipo FROM usuario WHERE id=${requestedCatName}`, (err, result) => {
            //console.log(result[0].nombre);
            res.send({
                    id: requestedCatName,
                    userName: result[0].nombre,
                    isAdmin: ((result[0].tipo==0) ? false : true)
            });
        });
    });

    app.route('/api/cats').post((req, res) => {
        const usuario = req.headers['name'];
        //db_connection.query('INSERT INTO persona SET?', { nombre: usuario.name } , (err, result) => {
            //Tratamiento de errores
        //});
        res.status(201).send({ name: usuario });
    });*/
}
