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
        console.log(titular);
        const cvc = req.headers['cvc'];
        db_connection.query(`call addCard(${id},${tipo},'${compania}','${numero}','${titular}','${mes}','${anio}','${cvc}')`, (err, result) => {
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