const db_connection = require('../configuration/db_connection');

module.exports = app => {
    app.route('/api/terminals/').get((req, res) => {
        db_connection.query(`SELECT a.id as id, b.nombre as ciudad, a.nombre as nombre, concat(a.colonia,' ',a.calle,' Núm. Ext.',a.num_ext), a.telefono as telefono, a.codigo_postal as codigo_postal FROM terminal a JOIN ciudad b ON a.id_ciudad=b.id and a.activo=1 ORDER BY ciudad`, (err, result) => {
            if (err) throw err;
            res.send({
                terminal: result
            });
        });
    });
}