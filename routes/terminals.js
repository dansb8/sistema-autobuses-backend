const db_connection = require('../configuration/db_connection');

module.exports = app => {
    app.route('/api/terminal/origins/').post((req, res) => {
        db_connection.query(`SELECT a.id as id, b.nombre as city, a.nombre as name, concat(a.colonia,' ',a.calle,' Núm. Ext.',a.num_ext) as address, a.telefono as tel, a.codigo_postal as zip, c.clave as state 
                            FROM terminal a JOIN ciudad b JOIN estado c
                            ON a.id_ciudad=b.id and b.id_estado=c.id and a.activo=1 
                            ORDER BY city`, (err, result) => {
            if (err) throw err;
            res.send(result);
        });
    });
    app.route('/api/terminal/destinations/').post((req, res) => {
        const id = req.headers['id'];
        db_connection.query(`SELECT c.id as id, d.nombre as city, c.nombre as name, concat(c.colonia,' ',c.calle,' Núm. Ext.',c.num_ext) as address, c.telefono as tel, c.codigo_postal as zip, e.clave as state
                            FROM terminal a JOIN ruta b JOIN terminal c JOIN ciudad d JOIN estado e  
                            ON a.id=${id} and a.id=b.id_terminal_origen and a.activo=1 and b.id_terminal_destino=c.id and c.activo=1 and c.id_ciudad=d.id and d.id_estado=e.id
                            ORDER BY city`, (err, result) => {
            if (err) throw err;
            res.send(result);
        });
    });
}