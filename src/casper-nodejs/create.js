// casper-nodejs/create.js

// spawn: fork and execute another program
var spawn = require('child_process').spawn;
// node_uuid: allows to generate uuid
var node_uuid = require('node-uuid'); 
// lock: the lockfile created by casper-child, before we start sending requests
var lock = null;
var fs = require('fs');

// remove the last \n
function stripTrailingNewLine(str) {
  if(str.substr(-1) === "\n") {
    return str.substr(0, str.length - 1);
  }
  return str;
}
/* create:
 * parameters: 
 *  - url: string
 *  - params: null | object
 *    full structure: 
 *    {
 *      casper: {}, // sent to casperjs .create
 *      config: {
 *        port: 8085 // port by default
 *      }
 *    }
 */

function create(url, params) {
  
  // - generate the lock filename
  lock = "/tmp/casper-nodejs-" + node_uuid.v4();

  // uniformize params
  if(params == null)
    params = {};
  if(params.casper == null)
    params.casper = {};

  var port = 8085;

  // load the port if defined in params
  if(params.config != null) {
    if(params.config.port != null) {
      port = params.config.port;
    }
  }

  // spawn casperjs-child which launchs an http 
  // server once the page is loaded

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

  // load the action service: responsible for executing the actions

  var action_service = require(__dirname + '/action.js');
  action_service._port = port;

  // creating the service 'casper' accessible from your nodejs application.
  var service = {
    _port: port,
    _process: process,
    _running: false,
    _action: action_service,
    _actions: require(__dirname + '/action_list.js'), // action container, it uniformizes them

// casper.then variants:
// ------------------------------------------------------------------------------------------
// casper.then(fn_in_current_context, null)
// casper.then(fn_in_casperjs_context, fn_in_current_context)
// ------------------------------------------------------------------------------------------

    // execute a function in casperjs and nodejs contexts
    then: function(callback1, callback2) {
    
      // console.log("\033[32m- 'then' action registered\033[0m");
      service._actions.add('then', callback1, callback2);

      // if the service is running, we have to launch the action
      // (if an action is being executed, this call is stopped)
      if(service._running) {
        service._action.next();
      }
    },

    // start to run the actions
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

      // let's go, we wait until the file is created
      waitUntilLockExists();
    },
    exit: function() {
      // console.log("\033[32m- 'exit' action registered\033[0m");
      service._actions.add('exit');
      
      // remove the lockfile
      fs.unlink(lock);

      // send the call if it is running
      if(service._running) {
        service._action.next();
      }
    }
  };

  return service;
}


module.exports = create;

