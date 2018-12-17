const db_connection = require('../configuration/db_connection');

module.exports = app => {
    app.route('/api/ticketinfo/').post((req, res) => {
        const seat = req.headers['seat'];
        const cost = req.headers['cost'];
        const date = req.headers['fecha'];
        const iva_compra = req.headers['iva'];
        const id_ruta_horario_compra = req.headers['id_route'];
        const id_usuario_compra = req.headers['id_user'];
        const id_tarjeta_compra = req.headers['id_card'];
        const nombre = req.headers['name'];
        const ap_pat = req.headers['apepat'];
        const ap_mat = req.headers['apemat'];
        const tipo = req.headers['type'];
        db_connection.query(`select num_viajes from usuario where id=${ id_usuario_compra }`, (err, result) => {
            if (err) throw err;
            if (result.length === 0) {
                res.send({
                    success: false
                });
            }
            else {
                console.log("Si llego aqui");
                db_connection.query(`update usuario set num_viajes=IF(num_viajes=9,0,num_viajes+1) where id=${ id_usuario_compra }`, (err3, result3) => {//Sustituir por trigger
                    if(result[0].num_viajes==0){
                        db_connection.query(`insert into boleto (id,asiento,costo,fecha,iva,id_ruta_horario,id_usuario,id_tarjeta,nombre_viajero,ap_pat_viajero,ap_mat_viajero,descuento,estudiante) 
                    values (id,${seat},${cost},'${date}','${iva_compra*100}',${id_ruta_horario_compra},${id_usuario_compra},${id_tarjeta_compra},'${nombre}','${ap_pat}','${ap_mat}',1,0)`, (err2, result2) => {
                            res.send({
                                result: true,
                                total: cost*0.5*(1+iva_compra)
                            });
                        });
                    }
                    else{
                        if(tipo=="estudiante"){
                            db_connection.query(`insert into boleto (id,asiento,costo,fecha,iva,id_ruta_horario,id_usuario,id_tarjeta,nombre_viajero,ap_pat_viajero,ap_mat_viajero,descuento,estudiante) 
                    values (id,${seat},${cost},'${date}','${iva_compra*100}',${id_ruta_horario_compra},${id_usuario_compra},${id_tarjeta_compra},'${nombre}','${ap_pat}','${ap_mat}',0,1)`, (err2, result2) => {
                                res.send({
                                    result: true,
                                    total: cost*0.2*(1+iva_compra)
                                });
                            });
                        }
                        else{
                            db_connection.query(`insert into boleto (id,asiento,costo,fecha,iva,id_ruta_horario,id_usuario,id_tarjeta,nombre_viajero,ap_pat_viajero,ap_mat_viajero,descuento,estudiante) 
                    values (id,${seat},${cost},'${date}','${iva_compra*100}',${id_ruta_horario_compra},${id_usuario_compra},${id_tarjeta_compra},'${nombre}','${ap_pat}','${ap_mat}',0,0)`, (err2, result2) => {
                                res.send({
                                    result: true,
                                    total: cost*(1+iva_compra)
                                });
                            });
                        }
                    }
                });
            }
        });
    });
}