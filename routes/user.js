const db_connection = require('../configuration/db_connection');

module.exports = app => {
    db_connection.connect(function(err) {
        if (err) throw err;
        app.route('/api/cats/:id').get((req, res) => {
            const requestedCatName = req.params['id'];
            db_connection.query(`SELECT nombre FROM persona WHERE id=${requestedCatName}`, (err, result) => {
                //console.log(result[0].nombre);
                res.send({ name: result[0].nombre });
            });
        });
    });
    app.route('/api/cats').post((req, res) => {
        const { nombre } = req.body;
        //connection.query('INSERT INTO persona SET?', {
        //    nombre: nombre
        //}, (err, result) => {
            //Tratamiento de errores
        //});
        //res.send(201, req.body);
    });
}




/* const express = require('express');
const router = express.Router();

router.route('/api/cats/:name').get((req, res) => {
    const requestedCatName = req.params['name'];
    res.send({ name: requestedCatName });
});

module.exports = router;*/