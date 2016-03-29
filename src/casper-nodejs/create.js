// casper-nodejs/create.js

var spawn = require('child_process').spawn;
var node_uuid = require('node-uuid'); 

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

  var service = {
    _process: process,
    _running: false,
    _action: require(__dirname + '/action.js'),
    _actions: require(__dirname + '/action_list.js'),

// casper.then variants:
// ------------------------------------------------------------------------------------------
// casper.then(fn_in_current_context, null, null)
// casper.then(fn_in_casperjs_context, fn_in_current_context, null)
// casper.then(fn_in_web_context, fn_in_casperjs_context, fn_in_current_context, null)
// ------------------------------------------------------------------------------------------

    then: function(callback1, callback2, callback3) {
    
      console.log("\033[32m- 'then' action registered\033[0m");
      service._actions.add('then', callback1, callback2, callback3);

      if(service._running) {
        service._action.next();
      }
      //sleep.sleep(2);

      /**/
    },
    run: function() {
      service._running = true;
      service._action.start(service._actions);
    },
    exit: function() {
      console.log("\033[32m- 'exit' action registered\033[0m");
      service._actions.add('exit');

      // send the call      
      if(service._running) {
        service._action.next();
      }
    }
  };

  return service;
}


module.exports = create;

