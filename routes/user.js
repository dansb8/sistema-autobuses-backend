const db_connection = require('../configuration/db_connection');

module.exports = app => {
    app.route('/api/cats/:id').get((req, res) => {
        const requestedCatName = req.params['id'];
        db_connection.query(`SELECT nombre FROM persona WHERE id=${requestedCatName}`, (err, result) => {
            //console.log(result[0].nombre);
            res.send({ name: result[0].nombre });
        });
    });

    app.route('/api/cats').post((req, res) => {
        const usuario = req.headers['name'];
        //db_connection.query('INSERT INTO persona SET?', { nombre: usuario.name } , (err, result) => {
            //Tratamiento de errores
        //});
        res.status(201).send({ name: usuario });
    });
}
