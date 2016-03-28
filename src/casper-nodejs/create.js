// casper-nodejs/create.js

var http = require('http');
var spawn = require('child_process').spawn;

function stripTrailingNewLine(str) {
  if(str.substr(-1) === "\n") {
    return str.substr(0, str.length - 1);
  }
  return str;
}

function create(url, params) {
  // spawn a child with casperjs    

  var process = spawn('casperjs', [
    __dirname + '/../casper-child/index.js',
    "--mlc-casper-options=" + JSON.stringify(params), 
    "--mlc-casper-url=" + JSON.stringify(url)
  ]);

  process.stdout.on('data', (data) => {
    data = stripTrailingNewLine(data.toString('utf-8'));
    console.log(`[casperjs]: ${data}`);
  });

  process.stderr.on('data', (data) => {
    data = stripTrailingNewLine(data.toString('utf-8'));
    console.log(`[casperjs err]: ${data}`);
  });

  process.on('close', (code) => {
    console.log(`child process exited with code ${code}`);
  });

  return {
    _process: process,

    start: function(callback) {
      //sleep.sleep(2);

      //console.log('TO IMPLEMENT: start ');
      var body = JSON.stringify({
        'action': 'start', 
        'url': 'http://google.com',
        'callback': (callback == null) ? null : callback.toString()
      });
      var req = http.request({
        host: '127.0.0.1',
        port: 8085,
        path: '/',
        method: 'POST',
        headers : {
          'Content-Type': 'application/json',
          'Content-Length': Buffer.byteLength(body)
        }
      }, function(response) {

        var str = '';
        
        response.on('data', function(chunk) {
          str += chunk;
        });
        response.on('end', function() {
          console.log("réponse reçue: " + str);
        });
      });
      req.write(body);
      req.end();
    },
    then: function(callback) {
      //sleep.sleep(2);

      //console.log('TO IMPLEMENT: start ');
      var body = JSON.stringify({
        'action': 'then',
        'callback': (callback == null) ? null : callback.toString()
      });
      var req = http.request({
        host: '127.0.0.1',
        port: 8085,
        path: '/',
        method: 'POST',
        headers : {
          'Content-Type': 'application/json',
          'Content-Length': Buffer.byteLength(body)
        }
      }, function(response) {

        var str = '';
        
        response.on('data', function(chunk) {
          str += chunk;
        });
        response.on('end', function() {
          console.log("réponse reçue: " + str);
        });
      });
      req.write(body);
      req.end();
    },
    run: function() {
      console.log('TO IMPLEMENT: run');
    }
  };
}


module.exports = create;

