const db_connection = require('../configuration/db_connection');

module.exports = app => {
    app.route('/api/cards/request').post((req, res) => {
        const id = req.headers['id'];
        db_connection.query(`SELECT id, IF(tipo=0,'Tarjeta de Débito','Tarjeta de Crédito') as type, compania as company, concat('XXXX-XXXX-XXXX-',substring(numero,16)) as number, titular as owner, concat(mes_vencimiento,'/',substring(anio_vencimiento,3)) as date FROM tarjeta WHERE activo=1 and id_usuario=${ id }`, (err, result) => {
            if (err) throw err;
            if (result.length === 0) {
                res.send();
            }
            else {
                res.send(result);
            }
        });
    });
    app.route('/api/cards/delete').post((req, res) => {
        const id = req.headers['id'];
        db_connection.query(`UPDATE tarjeta set activo=0 WHERE id=${ id }`, (err, result) => {
            if (err) throw err;
            res.send( true );
        });
    });
}