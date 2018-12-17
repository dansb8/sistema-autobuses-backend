var exec = require('child_process').exec, child;
// Creamos la función y pasamos el string pwd
// que será nuestro comando a ejecutar
child = exec('ssh root@192.168.1.71 gammu sendsms TEXT 3461000444 -text "Halooo2"',
// Pasamos los parámetros error, stdout la salida
// que mostrara el comando
    function (error, stdout, stderr) {
        // Imprimimos en pantalla con console.log
        console.log(stdout);
        // controlamos el error
        if (error !== null) {
            console.log('exec error: ' + error);
        }
    });