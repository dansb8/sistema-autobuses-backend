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
    app.route('/api/terminal/total/').get((req, res) => {
        db_connection.query(`SELECT count(id) as total FROM terminal WHERE activo=1`, (err, result) => {
            if (err) throw err;
            res.send(result);
        });
    });
    app.route('/api/terminal/directory/').post((req, res) => {
        const pag = req.headers['pag'];
        const start = 6*(pag-1);
        console.log(start);
        db_connection.query(`SELECT a.id as id, b.nombre as city, a.nombre as name, concat(a.colonia,' ',a.calle,' Núm. Ext.',a.num_ext) as address, a.telefono as tel, a.codigo_postal as zip, c.clave as state 
                            FROM terminal a JOIN ciudad b JOIN estado c
                            ON a.id_ciudad=b.id and b.id_estado=c.id and a.activo=1 
                            ORDER BY city LIMIT ${start},6`, (err, result) => {
            if (err) throw err;
            res.send(result);
        });
    });
    app.route('/api/terminal/schedule/').post((req, res) => {
        const id_ori = req.headers['id_ori'];
        const id_dest = req.headers['id_dest'];
        db_connection.query(`SELECT a.id as id, b.costo as cost, b.iva/100 as iva, concat(hour(e.horario),':',minute(e.horario)) as time
                            FROM ruta_horario a JOIN ruta b JOIN terminal c JOIN terminal d JOIN horario e
                            ON a.id_ruta=b.id and b.id_terminal_origen=c.id and b.id_terminal_destino=d.id and b.id_terminal_origen=${id_ori} and b.id_terminal_destino=${id_dest} and a.id_horario=e.id and a.activo=1 and e.activo=1
                            ORDER BY e.horario`, (err, result) => {
            if (err) throw err;
            res.send(result);
        });
    });
    app.route('/api/terminal/seats/').post((req, res) => {
        const id_route = req.headers['id_route'];
        const date = req.headers['fecha'];
        db_connection.query(`SELECT capacidad as capacity
                            FROM ruta_horario a JOIN camion b
                            ON a.id_camion=b.id and a.id=${id_route}`, (err, result) => {
                db_connection.query(`SELECT asiento as seat
                                FROM boleto
                                WHERE fecha='${date}' and id_ruta_horario=${id_route}`, (err2, result2) => {
                    if (err2) throw err2;
                    res.send({
                        capacity: result[0].capacity,
                        seats: result2
                    });
            });
        });
    });
    app.route('/api/terminal/payment/').post((req, res) => {
        const id_card = req.headers['id_card'];
        const cost = req.headers['cost'];
        var message="";
        var resultado=false;
        db_connection.query(`SELECT replace(numero,'-','') as numero,mes_vencimiento,substring(anio_vencimiento,3) as anio_vencimiento, cvc from tarjeta where id = ${id_card}`, (err,result) => {
            var Simplify = require("simplify-commerce"),
                client = Simplify.getClient({
                    publicKey: 'sbpb_ZjExMDZhNmMtNmE3Ny00YWFkLWIzMTUtOGQzNGM4ZmZhZDUw',
                    privateKey: '6XyurAKUb3MaIkRI4/FGx0ankQL90GJbmLru3aEdL/h5YFFQL0ODSXAOkNtXTToq'
                });
            console.log(result[0].mes_vencimiento);
            console.log(result[0].anio_vencimiento);
            console.log(result[0].cvc);
            console.log(result[0].numero);
            client.payment.create({
                amount : cost*100,
                description : "payment description",
                card : {
                    expMonth : result[0].mes_vencimiento,
                    expYear : result[0].anio_vencimiento,
                    cvc : result[0].cvc,
                    number : result[0].numero,
                },
                currency : "USD"
            }, function(errData, data){
                if(errData){
                    console.error("Error Message: " + errData.data.error.message);
                    // handle the error
                    return false;
                }
                if(data.paymentStatus=="APPROVED") {
                    console.log(true);
                    resultado=true;
                    message="¡El pago ha sido efectudado correctamente!";
                }
                else {
                    switch(data.declineReason){
                        case "PICKUP_CARD": message = "Tarjeta ha caducado y no esta en circulación";
                            break;
                        case "HOT_CARD": message = "Tarjeta ha caducado y no esta en circulación";
                            break;
                        case "LOST_CARD_PICKUP": message = "La tarjeta se reporta como perdida";
                            break;
                        case "SUSPECTED_FRAUD": message = "Tarjeta parece ser fraudalenta";
                            break;
                        case "EXPIRED_CARD": message = "Tarjeta ha expirado o fecha es incorrecta";
                            break;
                        case "AVS_ZIP_MISMATCH": message = "No conincide el codigo portal AVS";
                            break;
                        case "AVS_ADDRESS_MISMATCH": message = "No coincide la direccion AVS";
                            break;
                        case "CVC_MISMATCH": message = "Codigo de verificacion no coincide";
                            break;
                        case "INVALID_MERCHANT": message = "Comerciante invalido";
                            break;
                        case "INVALID_CURRENCY": message = "Error en la configuracion de la moneda";
                            break;
                        case "CARD_TYPE_NOT_ENABLED": message = "No puede procesar el tipo de tarjeta especificada";
                            break;
                        case "SYSTEM_ERROR": message = "Error del sistema";
                            break;
                        case "LIMIT_EXCEEDED": message = "Error de formato general";
                            break;
                        case "MERCHANT_LOCKED_OR_CLOSED": message = "Comercio cerrado o bloqueado";
                            break;
                        case "TOO_MANY_DECLINES": message = "Demasiadas intentos rechazados de compra";
                            break;
                        case "INVALID_CARD_NUMBER": message = "Numero de tarjeta invalido";
                            break;
                        case "DO_NOT_HONOUR": message = "transaccion bloqueada por el banco";
                            break;
                        case "RESTRICTED_CARD": message = "Tarjeta restrigida";
                            break;
                        case "INSUFFICIENT_FUNDS": message = "Fondos insuficientes";
                            break;
                        case "INVALID_PIN": message = "Numero de pin invalido";
                            break;
                        case "INVALID_EMV": message = "Problema en el Chip";
                            break;
                        case "UNKNOWN": message = "Error desconocido";
                            break;
                        case "TOO_MANY_RETRIES": message = "Demaciados movimientos con la tarjeta";
                            break;
                        case "TIMED_OUT": message = "Tiempo de espera agotado";
                            break;
                        case "NOT_SUPPORTED": message = "La tarjeta no es soportada";
                            break;
                        case "CANCELLED": message = "Transacion anterior no se puede cancelar";
                            break;
                        case "BLOCKED": message = "Tarjeta bloqeada por el banco";
                            break;
                        case "SECURE_3D_NOT_ENROLLED": message = ""
                            break;
                        case "SECURE_3D_AUTH_FAILED": message = ""
                            break;
                        case "DUPLICATE": message = "La transaccion parece estar duplicada";
                            break;
                        case "OTHER": message = "Ha ocurrido un error";
                            break;
                        case "AUTHORIZATION_EXPIRED": message = "La autorizacion de paypal ya no es valida";
                            break;
                    }
                    console.log(false);
                    resultado=false;
                }
                db_connection.query(`INSERT INTO transaccion (id,mensaje,fecha,id_tarjeta,hora) VALUES (id,'${message}',curdate(),${id_card},curtime())`, (err2,result2) => {
                    res.send({
                        result: resultado,
                        message: message
                    });
                });
            });
        });
    });
}