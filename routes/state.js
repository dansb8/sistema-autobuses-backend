const db_connection = require('../configuration/db_connection');

module.exports = app => {
    app.route('/api/state/:name').get((req, res) => {
        const requestedStateName = req.params['name'];
        db_connection.query(`SELECT id, nombre, activo FROM estado WHERE nombre='${requestedStateName}'`, (err, result) => {
            if (err) throw err;
            if (result.length === 1) {
                res.send({
                    state: [ {
                        id: result[0].id,
                        name: result[0].nombre,
                        active: result[0].activo,
                    } ]
                });
            }
            else {
                res.send({
                    state: [ {
                        id: null
                    } ]
                });
            }
        });
    });

    app.route('/api/state/').get((req, res) => {
        db_connection.query(`SELECT id, nombre, activo FROM estado WHERE activo=1 ORDER BY nombre`, (err, result) => {
            if (err) throw err;
            if (result.length === 0) {
                res.send({
                    state: [ {
                        id: null
                    } ]
                });
            }
            else {
                res.send({
                    state: result
                });
            }
        });
    });

    app.route('/api/state/add').post((req, res) => {
        const name = req.headers['name'];
        db_connection.query(`SELECT id FROM estado WHERE nombre='${ name }'`, (err, result) => {
            //Tratamiento de errores
            if (err) throw err;
            if (result.length === 1) {
                db_connection.query(`UPDATE estado SET activo=1 WHERE nombre='${ name }'`, (err, result) => {
                    //Tratamiento de errores
                    if (err) throw err;
                    res.status(200).send({ name: name });
                });
            }
            else {
                db_connection.query('INSERT INTO estado SET?', { nombre: name, activo: 1 } , (err, result) => {
                    //Tratamiento de errores
                    if (err) throw err;
                    res.status(201).send({ name: name });
                });
            }
        });
    });

    app.route('/api/state/change/:name').put((req, res) => {
        const requestedStateName = req.params['name'];
        const newStateName = req.headers['name'];
        db_connection.query(`UPDATE estado SET nombre='${ newStateName }' WHERE nombre='${ requestedStateName }'`, (err, result) => {
            //Tratamiento de errores
            if (err) throw err;
            res.status(200).send({ name: newStateName });
        });
    });

    app.route('/api/state/delete/:name').delete((req, res) => {
        const deletedStateName = req.params['name'];
        db_connection.query(`UPDATE estado SET activo=0 WHERE nombre='${ deletedStateName }'`, (err, result) => {
            //Tratamiento de errores
            if (err) throw err;
            res.status(204).send({ name: deletedStateName });
        });
    });
}