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
        console.log(nombre);
        console.log(ap_pat);
        console.log(ap_mat);
        console.log(telefono);
        console.log(correo);
        console.log(contraseña);
        console.log(rfc);



        db_connection.query(`call register('${nombre}','${ap_pat}','${ap_mat}','${rfc}','${correo}','${telefono}',sha1('${contraseña}'))`, (err, result) => {
            var aux = result[0];
            var aux2 = aux[0];
            console.log(aux2.result);
            if(aux2.result==1){
                res.send(true);
            }
            else{
                res.send(false);
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
