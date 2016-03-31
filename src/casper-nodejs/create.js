// casper-nodejs/create.js

var spawn = require('child_process').spawn;
var node_uuid = require('node-uuid'); 
var lock = null;
var fs = require('fs');

function stripTrailingNewLine(str) {
  if(str.substr(-1) === "\n") {
    return str.substr(0, str.length - 1);
  }
  return str;
}

function create(url, params) {
  // spawn a child with casperjs

  // - generate the lock filename
  lock = "/tmp/casper-nodejs-" + node_uuid.v4();

  if(params == null)
    params = {};
  if(params.casper == null)
    params.casper = {};

  var port = 8085;

  if(params.config != null) {
    if(params.config.port != null) {
      port = params.config.port;
    }
  }

  console.log('port: ' + port);

  var process = spawn('casperjs', [
    __dirname + '/../casper-child/index.js',
    "--mlc-casper-options=" + JSON.stringify(params.casper), 
    "--mlc-casper-url=" + JSON.stringify(url),
    "--mlc-casper-lock=" + JSON.stringify(lock),
    "--mlc-casper-port=" + JSON.stringify(port)
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
    if(code != 0)
      console.log(`casper-child exited with code ${code}`);
  });

  var action_service = require(__dirname + '/action.js');
  action_service._port = port;

  var service = {
    _port: port,
    _process: process,
    _running: false,
    _action: action_service,
    _actions: require(__dirname + '/action_list.js'),

// casper.then variants:
// ------------------------------------------------------------------------------------------
// casper.then(fn_in_current_context, null)
// casper.then(fn_in_casperjs_context, fn_in_current_context)
// ------------------------------------------------------------------------------------------

    then: function(callback1, callback2) {
    
      // console.log("\033[32m- 'then' action registered\033[0m");
      service._actions.add('then', callback1, callback2);

      if(service._running) {
        service._action.next();
      }
      //sleep.sleep(2);

      /**/
    },
    run: function() {

      // launch only when the 'lock' file has been created

      function waitUntilLockExists() {
        fs.access(lock, fs.R_OK | fs.W_OK, (err) => {
          // lock doesn't exists, we check in 200ms
          if(err)
            setTimeout(waitUntilLockExists, 200);
          // lock exists: casper-child API is ready ! Start to send actions
          else {
            service._running = true;
            service._action.start(service._actions);
          }
        });
      }

      waitUntilLockExists();      
    },
    exit: function() {
      // console.log("\033[32m- 'exit' action registered\033[0m");
      service._actions.add('exit');

      fs.unlink(lock);

      // send the call      
      if(service._running) {
        service._action.next();
      }
    }
  };

  return service;
}


module.exports = create;

