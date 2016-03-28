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
// casper.then variants:
// ------------------------------------------------------------------------------------------
// casper.then(fn_in_current_context, null, null)
// casper.then(fn_in_casperjs_context, fn_in_current_context, null)
// casper.then(fn_in_web_context, fn_in_casperjs_context, fn_in_current_context, null)
// ------------------------------------------------------------------------------------------

    then: function(callback1, callback2, callback3) {
      //sleep.sleep(2);

      var callback_current = null;
      var callback_casper = null;
      var callback_web = null;

      if(callback3 != null) {
        callback_web = callback1;
        callback_casper = callback2;
        callback_current = callback3;
      }
      else if(callback2 != null) {
        callback_casper = callback1;
        callback_current = callback2;
      }
      else {
        callback_current = callback1;
      }

      //console.log('TO IMPLEMENT: start ');
      var body = JSON.stringify({
        'action': 'then',
        'callback': (callback_casper == null) ? null : callback_casper.toString()
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
          callback_current(JSON.parse(str));
        });
      });

      req.on('error', (e) => {
        console.log(`problem with request: ${e.message}`);
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

