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
        db_connection.query(`SELECT id FROM usuario WHERE id=${id} and contrasena=sha1('${contrasena}')`, (err, result) => {
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
    app.route('/api/admin/getbuses/').post((req, res) => {
        db_connection.query(`SELECT id, modelo as model, capacidad as capacity, placa as plate, IF(tipo=0,"Austero","De lujo") as type FROM camion WHERE activo=1`, (err, result) => {
            if (err) throw err;
            res.send(result);
        });
    });
    app.route('/api/admin/updatebus/').post((req, res) => {
        const id = req.headers['id'];
        const modelo = req.headers['model'];
        const capacidad = req.headers['capacity'];
        const placa = req.headers['plate'];
        var tipo = (req.headers['type']=='De lujo')?1:0;
        console.log(id);
        console.log(modelo);
        console.log(capacidad);
        console.log(placa);
        console.log(tipo);
        db_connection.query(`UPDATE camion SET modelo='${modelo}', capacidad=${capacidad}, placa='${placa}', tipo=${tipo} WHERE id=${id}`, (err, result) => {
            if (err) throw err;
            if(req.headers['type']!="De lujo" && req.headers['type']!="Austero"){
                res.send(false);
            }
            else{
                res.send(true);
            }
        });
    });

    app.route('/api/admin/deletebus/').post((req, res) => {
        const id = req.headers['id'];
        db_connection.query(`UPDATE camion SET activo=0 WHERE id=${ id }`, (err, result) => {
            if (err) throw err;
            res.send( true );
        });
    });

    app.route('/api/admin/addbus/').post((req, res) => {
        const modelo = req.headers['model'];
        const capacidad = req.headers['capacity'];
        const placa = req.headers['plate'];
        var tipo = (req.headers['type']=='De lujo')?1:0;
        db_connection.query(`INSERT INTO camion (id,modelo,capacidad,placa,tipo,activo) VALUES (id,'${modelo}',${capacidad},'${placa}',${tipo},1)`, (err, result) => {
            if (err) throw err;
            res.send(true);
        });
    });
}