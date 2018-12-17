const db_connection = require('../configuration/db_connection');

module.exports = app => {
    app.route('/api/cards/add').post((req, res) => {
        const id = req.headers['id_user'];
        const tipo = req.headers['type'];
        const compania = req.headers['company'];
        const numero = req.headers['card_num'];
        const titular = req.headers['name'];
        const mes = req.headers['expmonth'];
        const anio = req.headers['expyear'];
        console.log(anio);
        const cvc = req.headers['cvc'];
        db_connection.query(`SELECT count(id) as total FROM tarjeta WHERE numero='${numero}' and id_usuario=${id}`, (err, result) => {
            if (result[0].total == 1) {
                db_connection.query(`SELECT count(id) as total FROM tarjeta WHERE numero='${numero}' and id_usuario=${id} and activo=1`, (err2, result2) => {
                    if (result2[0].total == 1) {
                        res.send({
                            result: false,
                            message: "No puedes registrar tarjetas que ya tienes registradas."
                        });
                    }
                    else{
                        db_connection.query(`UPDATE tarjeta SET 
                                            activo=1,tipo=${tipo},compania='${compania}',titular='${titular}',mes_vencimiento='${mes}',anio_vencimiento='${anio}',cvc='${cvc}' 
                                            WHERE numero='${numero}' and id_usuario=${id}`, (err3, result3) => {
                            res.send({
                                result: true,
                                message: "Tu tarjeta ha quedado activada nuevamente."
                            });
                        });
                    }
                });
            }
            else{
                db_connection.query(`INSERT INTO tarjeta (id,tipo,compania,numero,id_usuario,activo,titular,mes_vencimiento,anio_vencimiento,cvc)
                            VALUES (id,${tipo},'${compania}','${numero}',${id},1,'${titular}','${mes}','${anio}','${cvc}')`, (err, result) => {
                    if (err) throw err;
                    res.send({
                        result: true,
                        message: "Tu tarjeta ha sido añadida."
                    });
                });
            }
        });
    });
    app.route('/api/cards/request').post((req, res) => {
        const id = req.headers['id'];
        db_connection.query(`SELECT id, IF(tipo=0,'Tarjeta de Débito','Tarjeta de Crédito') as type, compania as company, concat('XXXX-XXXX-XXXX-',substring(numero,16)) as number, titular as owner, concat(mes_vencimiento,'/',substring(anio_vencimiento,3)) as date FROM v_tarjeta WHERE id_usuario=${ id }`, (err, result) => {
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
        console.log("Entro a delete");
        db_connection.query(`UPDATE tarjeta SET activo=0 WHERE id=${ id }`, (err, result) => {
            if (err) throw err;
            res.send( true );
        });
    });
    app.route('/api/cards/details').post((req, res) => {
        const id = req.headers['id_card'];
        db_connection.query(`SELECT mensaje as message, concat(day(fecha),'/',month(fecha),'/',year(fecha)) as date, hora as time from transaccion where id_tarjeta=${id}`, (err, result) => {
            if (err) throw err;
            res.send(result);
        });
    });
}