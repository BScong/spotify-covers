var fs = require('fs'),
    spawn = require('child_process').spawn,
    out = fs.openSync('./out.log', 'a'),
    err = fs.openSync('./out.log', 'a');

spawn('node', ['server.js'], {
    stdio: [ 'ignore', out, err ], // piping stdout and stderr to out.log
    detached: true
}).unref();