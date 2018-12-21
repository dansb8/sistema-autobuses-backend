const db_connection = require('../configuration/db_connection');

module.exports = app => {
    app.route('/api/admin/report/year/').post((req, res) => {
        const year = req.headers['year'];
        db_connection.query(`select sum(round(IF(descuento=1,costo*0.5+costo*0.5*iva/100,IF(estudiante=1,costo*0.8+costo*0.8*iva/100,costo+costo*iva/100)),2)) as total, sum(round(IF(descuento=1,costo*0.5+costo*0.5*iva/100,0),2)) as discount, sum(round(IF(estudiante=1,costo*0.8+costo*0.8*iva/100,0),2)) as student, sum(round(IF(descuento=1,0,IF(estudiante=1,0,costo+costo*iva/100)),2)) as normal, month(fecha) as month from v_boleto where year(fecha)=${year} group by month(fecha)`, (err, result) => {
            console.log(year);
            if (err) throw err;
            if (result.length > 0){
                res.send(result);
            }
            else {
                res.send([
                    {
                        total: 0,
                        discount: 0,
                        student: 0,
                        normal: 0,
                        month: 0
                    }
                ]);
            }
        });
    });
    app.route('/api/admin/report/yearMonth/').post((req, res) => {
        const year = req.headers['year'];
        const month = req.headers['month'];
        db_connection.query(`select day(last_day('${year}-${month}-01')) as days`, (err, result) => {
            db_connection.query(`select sum(round(IF(descuento=1,costo*0.5+costo*0.5*iva/100,IF(estudiante=1,costo*0.8+costo*0.8*iva/100,costo+costo*iva/100)),2)) as total,  day(fecha) as day from v_boleto where year(fecha)=${year} and month(fecha)=${month} group by day(fecha) order by day(fecha)`, (err2, result2) => {
                console.log(year);
                if (err) throw err;
                if (result2.length > 0){
                    res.send({
                        days: result[0].days,
                        result2
                    });
                }
                else {
                    res.send(
                        {
                            days: result[0].days,
                            result2: [{
                                day: 0,
                                total:0
                            }]
                        }
                    );
                }
            });
        });
    });
    app.route('/api/admin/report/dailySales/').post((req, res) => {
        db_connection.query(`select concat(day(curdate()),'/',month(curdate()),'/',year(curdate())) as date`, (err, result) => {
            db_connection.query(`select sum(round(IF(descuento=1,costo*0.5+costo*0.5*iva/100,0),2)) as discount, sum(round(IF(estudiante=1,costo*0.8+costo*0.8*iva/100,0),2)) as student, sum(round(IF(descuento=1,0,IF(estudiante=1,0,costo+costo*iva/100)),2)) as normal from v_boleto where fecha=curdate() group by fecha`, (err2, result2) => {
                if (err) throw err;
                if (result2.length > 0){
                    res.send({
                        date: result[0].date,
                        result2
                    });
                }
                else {
                    res.send(
                        {
                            date: result[0].date,
                            result2: [{
                                discount: 0,
                                student:0,
                                normal: 0
                            }]
                        }
                    );
                }
            });
        });
    });
    app.route('/api/admin/report/terminal/').post((req, res) => {
        const terminal = req.headers['id'];
        const month = req.headers['month'];
        console.log(terminal);
        console.log(month);
        db_connection.query(`select distinct a.id_terminal_destino as id,b.nombre as nombre 
                            FROM ruta a JOIN terminal b ON 
                            a.id_terminal_origen=${terminal} and a.id_terminal_destino=b.id order by id asc`, (err, result) => {
            db_connection.query(`select count(a.id) as total, d.id as id from v_boleto a JOIN ruta_horario b JOIN ruta c JOIN terminal d 
                                ON a.id_ruta_horario=b.id and b.id_ruta=c.id and c.id_terminal_origen=${terminal} and c.id_terminal_destino=d.id and month(a.fecha)=${month} and year(a.fecha)=2017 
                                GROUP BY c.id_terminal_destino order by id asc`, (err2, result2) => {
                if (err) throw err;
                if (result2.length > 0){
                    res.send({
                        terminals: result.length,
                        result,
                        result2
                    });
                }
                else {
                    res.send(
                        {
                            terminals: result.length,
                            result,
                            result2: [{
                                total: 0,
                                id:0
                            }]
                        }
                    );
                }
            });
        });
    });
    app.route('/api/admin/report/terminal2/').post((req, res) => {
        const terminal = req.headers['id'];
        const month = req.headers['month'];
        console.log(terminal);
        console.log(month);
        db_connection.query(`select distinct a.id_terminal_origen as id,b.nombre as nombre 
                            FROM ruta a JOIN terminal b ON 
                            a.id_terminal_destino=${terminal} and a.id_terminal_origen=b.id order by id asc`, (err, result) => {
            db_connection.query(`select count(a.id) as total, d.id as id from v_boleto a JOIN ruta_horario b JOIN ruta c JOIN terminal d 
                                ON a.id_ruta_horario=b.id and b.id_ruta=c.id and c.id_terminal_destino=${terminal} and c.id_terminal_origen=d.id and month(a.fecha)=${month} and year(a.fecha)=2017 
                                GROUP BY c.id_terminal_origen order by id asc`, (err2, result2) => {
                if (err) throw err;
                if (result2.length > 0){
                    res.send({
                        terminals: result.length,
                        result,
                        result2
                    });
                }
                else {
                    res.send(
                        {
                            terminals: result.length,
                            result,
                            result2: [{
                                total: 0,
                                id:0
                            }]
                        }
                    );
                }
            });
        });
    });
    app.route('/api/admin/report/masVendidas/').post((req, res) => {
        db_connection.query(`select  concat(d.nombre,' - ',e.nombre,' (',count(a.id),' boletos)') as terminal, sum(round(IF(a.descuento=1,a.costo*0.5+a.costo*0.5*a.iva/100,IF(a.estudiante=1,a.costo*0.8+a.costo*0.8*a.iva/100,a.costo+a.costo*a.iva/100)),2)) as total
                            FROM v_boleto a JOIN ruta_horario b JOIN ruta c JOIN terminal d JOIN terminal e ON 
                            a.id_ruta_horario=b.id and b.id_ruta=c.id and c.id_terminal_origen=d.id and c.id_terminal_destino=e.id group by b.id_ruta order by total desc limit 5`, (err, result) => {
            res.send(result);
        });
    });
    app.route('/api/admin/report/menosVendidas/').post((req, res) => {
        db_connection.query(`select  concat(d.nombre,' - ',e.nombre,' (',count(a.id),' boletos)') as terminal, sum(round(IF(a.descuento=1,a.costo*0.5+a.costo*0.5*a.iva/100,IF(a.estudiante=1,a.costo*0.8+a.costo*0.8*a.iva/100,a.costo+a.costo*a.iva/100)),2)) as total
                            FROM v_boleto a JOIN ruta_horario b JOIN ruta c JOIN terminal d JOIN terminal e ON 
                            a.id_ruta_horario=b.id and b.id_ruta=c.id and c.id_terminal_origen=d.id and c.id_terminal_destino=e.id group by b.id_ruta order by total asc limit 5`, (err, result) => {
            res.send(result);
        });
    });
    app.route('/api/admin/report/mayorIgualBoletos/').post((req, res) => {
        const boletos = req.headers['boletos'];
        console.log(boletos);
        db_connection.query(`select  concat(d.nombre,' - ',e.nombre) as terminal, f.horario as horario, count(a.id) as boletos, sum(round(IF(a.descuento=1,a.costo*0.5+a.costo*0.5*a.iva/100,IF(a.estudiante=1,a.costo*0.8+a.costo*0.8*a.iva/100,a.costo+a.costo*a.iva/100)),2)) as total
                            FROM v_boleto a JOIN ruta_horario b JOIN ruta c JOIN terminal d JOIN terminal e JOIN horario f ON 
                            a.id_ruta_horario=b.id and b.id_ruta=c.id and c.id_terminal_origen=d.id and c.id_terminal_destino=e.id and b.id_horario=f.id group by b.id having boletos >= ${boletos} order by boletos desc`, (err, result) => {
            res.send(result);
        });
    });
    app.route('/api/admin/report/menorIgualBoletos/').post((req, res) => {
        const boletos = req.headers['boletos'];
        console.log(boletos);
        db_connection.query(`select  concat(d.nombre,' - ',e.nombre) as terminal, f.horario as horario, count(a.id) as boletos, sum(round(IF(a.descuento=1,a.costo*0.5+a.costo*0.5*a.iva/100,IF(a.estudiante=1,a.costo*0.8+a.costo*0.8*a.iva/100,a.costo+a.costo*a.iva/100)),2)) as total
                            FROM v_boleto a JOIN ruta_horario b JOIN ruta c JOIN terminal d JOIN terminal e JOIN horario f ON 
                            a.id_ruta_horario=b.id and b.id_ruta=c.id and c.id_terminal_origen=d.id and c.id_terminal_destino=e.id and b.id_horario=f.id group by b.id having boletos <= ${boletos} order by boletos asc`, (err, result) => {
            res.send(result);
        });
    });

    app.route('/api/admin/report/mayorIgualCantidad/').post((req, res) => {
        const cantidad = req.headers['cantidad'];
        console.log(cantidad);
        db_connection.query(`select  concat(d.nombre,' - ',e.nombre) as terminal, f.horario as horario, count(a.id) as boletos, sum(round(IF(a.descuento=1,a.costo*0.5+a.costo*0.5*a.iva/100,IF(a.estudiante=1,a.costo*0.8+a.costo*0.8*a.iva/100,a.costo+a.costo*a.iva/100)),2)) as total
                            FROM v_boleto a JOIN ruta_horario b JOIN ruta c JOIN terminal d JOIN terminal e JOIN horario f ON 
                            a.id_ruta_horario=b.id and b.id_ruta=c.id and c.id_terminal_origen=d.id and c.id_terminal_destino=e.id and b.id_horario=f.id group by b.id having total >= ${cantidad} order by total desc`, (err, result) => {
            res.send(result);
        });
    });
    app.route('/api/admin/report/menorIgualCantidad/').post((req, res) => {
        const cantidad = req.headers['cantidad'];
        console.log(cantidad);
        db_connection.query(`select  concat(d.nombre,' - ',e.nombre) as terminal, f.horario as horario, count(a.id) as boletos, sum(round(IF(a.descuento=1,a.costo*0.5+a.costo*0.5*a.iva/100,IF(a.estudiante=1,a.costo*0.8+a.costo*0.8*a.iva/100,a.costo+a.costo*a.iva/100)),2)) as total
                            FROM v_boleto a JOIN ruta_horario b JOIN ruta c JOIN terminal d JOIN terminal e JOIN horario f ON 
                            a.id_ruta_horario=b.id and b.id_ruta=c.id and c.id_terminal_origen=d.id and c.id_terminal_destino=e.id and b.id_horario=f.id group by b.id having total <= ${cantidad} order by total asc`, (err, result) => {
            res.send(result);
        });
    });
}