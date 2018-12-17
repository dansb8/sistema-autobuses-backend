const db_connection = require('../configuration/db_connection');

module.exports = app => {
    app.route('/api/admin/report/year/').post((req, res) => {
        const year = req.headers['year'];
        db_connection.query(`select sum(round(IF(descuento=1,costo*0.5+costo*0.5*iva/100,IF(estudiante=1,costo*0.8+costo*0.8*iva/100,costo+costo*iva/100)),2)) as total, sum(round(IF(descuento=1,costo*0.5+costo*0.5*iva/100,0),2)) as discount, sum(round(IF(estudiante=1,costo*0.8+costo*0.8*iva/100,0),2)) as student, sum(round(IF(descuento=1,0,IF(estudiante=1,0,costo+costo*iva/100)),2)) as normal, month(fecha) as month from boleto where year(fecha)=${year} group by month(fecha)`, (err, result) => {
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
            db_connection.query(`select sum(round(IF(descuento=1,costo*0.5+costo*0.5*iva/100,IF(estudiante=1,costo*0.8+costo*0.8*iva/100,costo+costo*iva/100)),2)) as total,  day(fecha) as day from boleto where year(fecha)=${year} and month(fecha)=${month} group by day(fecha) order by day(fecha)`, (err2, result2) => {
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
}