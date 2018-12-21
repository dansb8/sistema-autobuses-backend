const db_connection = require('../configuration/db_connection');

module.exports = app => {
    app.route('/api/bill/new/').post((req, res) => {
        db_connection.query(`SELECT COUNT(id) as total FROM factura`, (err, result) => {
            console.log(result);
            if (err) throw err;
            if(result[0].total === 0){
                db_connection.query(`insert into factura (id, folio, subtotal, total) values (id,10000000,0,0)`, (err2, result2) => {
                    if (err) throw err;
                    db_connection.query(`select max(id) as id from factura`, (err3, result3) => {
                        if (err) throw err;
                        res.send({
                            id: result3[0].id
                        });
                    });
                });
            }
            else{
                console.log("Entro aqui");
                db_connection.query(`select folio from factura where id=(select max(id) as id from factura)`, (err2, result2) => {
                    if (err) throw err;
                    db_connection.query(`insert into factura (id, folio, subtotal, total) values (id,${result2[0].folio+1},0,0)`, (err3, result3) => {
                        if (err) throw err;
                        db_connection.query(`select max(id) as id from factura`, (err4, result4) => {
                            res.send({
                                id: result4[0].id
                            });
                        });
                    });
                });
            }
        });
    });
    app.route('/api/bill/report/').post((req, res) => {
        const id = req.headers['id'];
        db_connection.query(`SELECT DISTINCT(a.id) as id, a.folio as folio, a.total as total, a.subtotal as subtotal, f.nombre as origen, g.nombre as destino, h.horario as horario, b.fecha as fecha, i.titular as titular, concat('XXXX-XXXX-XXXX-',substring(i.numero,16)) as numero
                            FROM factura a JOIN boleto b JOIN usuario c JOIN ruta_horario d JOIN ruta e JOIN terminal f JOIN terminal g JOIN horario h JOIN tarjeta i
                            ON a.id=b.id_factura AND b.id_usuario=c.id and c.id=${id} and b.id_ruta_horario=d.id and d.id_ruta=e.id and d.id_horario=h.id and e.id_terminal_origen=f.id and e.id_terminal_destino=g.id and b.id_tarjeta=i.id`, (err, result) => {
            console.log(result.length);
            res.send(result);
        });
    });
}