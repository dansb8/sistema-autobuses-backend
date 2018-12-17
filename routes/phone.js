const db_connection = require('../configuration/db_connection');

module.exports = app => {
    app.route('/api/phone').post((req, res) => {
        const id = req.headers['id_user'];
        const costo = req.headers['cost'];
        const mensaje = req.headers['message'];
        console.log("sadsada");
        db_connection.query(`select replace(concat('CLIENTE:',nombre,' ',ap_pat,' ',ap_mat,' --- MENSAJE:${mensaje} --- MONTO:${costo}'),' ','_') as mensaje, telefono from usuario where id=${ id }`, (err, result) => {
            if (err) throw err;
            if (result.length === 0) {
                res.send(false);
            }
            else {
                var exec = require('child_process').exec, child;
                var numero = result[0].telefono;
                var cadena = `ssh root@172.20.10.3 gammu sendsms TEXT ${numero} -text "${result[0].mensaje}"`//'ssh root@192.168.1.71 gammu sendsms TEXT 3461000444 -text "Exito"'
                console.log(cadena);
                /*child = exec(cadena,
                    function (error, stdout, stderr) {
                        console.log(stdout);
                        if (error !== null) {
                            console.log('exec error: ' + error);
                        }
                    });*/
                res.send(true);
            }
        });
    });
}