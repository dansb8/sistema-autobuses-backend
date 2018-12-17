const app = require('./configuration/server_config');

require('./routes/user')(app);
require('./routes/admin')(app);
require('./routes/state')(app);
require('./routes/login')(app);
require('./routes/terminals')(app);
require('./routes/cards')(app);
require('./routes/reports')(app);
require('./routes/ticket')(app);
require('./routes/phone')(app);

app.listen(app.get('port'), () => {
    console.log('Server started in port', app.get('port'));
});




//const express = require('express');
//const app = express();

//Routes
//const user = require('./routes/user');

//npm install cors --save
/*const cors = require('cors')
var corsOptions = {
    origin: 'http://localhost:4200',
    optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
}
app.use(cors(corsOptions))*/

//Define of the port, node server.js or npm start to initialize the server
/*app.listen(8000, () => {
    console.log('Server started!');
});*/

/*app.use(user);

app.use((req, res, next) => {
   console.log('request url: ' + req.url);
   next();
});*/

//Request for an object
/*app.route('/api/cats').get((req, res) => {
    res.send({
        user: [{ name: 'lilly' }, { name: 'lucy' }]
    });
});*/


//Creating a new object
/*const bodyParser = require('body-parser');
app.use(bodyParser.json());
app.route('/api/cats').post((req, res) => {
    res.send(201, req.body);
});*/

//Changing an object
/*app.route('/api/cats/:name').put((req, res) => {
    res.send(200, req.body);
});*/

//Deleting an object
/*app.route('/api/cat/:name').delete((req, res) => {
    res.sendStatus(204);
});*/



//https://malcoded.com/posts/angular-backend-express
//npm install morgan --save