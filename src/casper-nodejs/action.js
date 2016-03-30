var http = require('http');

var Action = {
  _action_list: null,
  _doing: false,

  start: function(action_list) {
    Action._action_list = action_list;
    // console.log('starting to execute actions');
    Action.next();
  },
  next: function() {
    //console.log('==> ACTION.NEXT');
    if(Action._doing == true)
      return;

    var n = Action._action_list.next();
    // console.log(' ===> ' + Action._action_list.actions.length);
    if(n) {
      // console.log('==> launching action :) ');
      
      Action._doing = true;
      Action.execute(n);
    }
    else;
  },
  execute: function(action) {

    //console.log("\033[35m-->Sending Action '" + action.type + "' To CasperJS\033[0m");

    if(action.type == 'then') {
      Action._execute_then(action.callbacks);
    }
    else if(action.type == 'exit') {
      Action._execute_exit();
    }
    else {
      console.error('unknonw type "' + action.type + '"');
    }
  },

  _execute_then: function(action) {

    var callback1 = action[0];
    var callback2 = action[1];

    var callback_current = null;
    var callback_casper = null;

    if(callback2 != null) {
      callback_casper = callback1;
      callback_current = callback2;
    }
    else {
      callback_current = callback1;
    }

    if(callback_casper == null) {
      //console.log('callback casper NULL');
      callback_current();
      Action._doing = false;
      return;
    } 
    else 
      ; //console.log('callback casper NOT NULL');

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
        //console.log("réponse reçue: " + str);
        callback_current(JSON.parse(str));

        // console.log("\033[33m--> Action Finished On CasperJS\033[0m");

        // libérer
        Action._doing = false;

        // appeler next si besoin
        Action.next();
      });
    });

    req.on('error', (e) => {
      console.log(`problem with request: ${e.message}`);
    });

    req.write(body);
    req.end();
  },
  _execute_exit: function() {
    // console.log('sending exit ...');
    var body = JSON.stringify({
      'action': 'exit'
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

      response.on('end', function() {

        // console.log("\033[33m--> CasperJS EXIT\033[0m");

        // libérer
        Action._doing = false;

        // appeler next si besoin
        // Action.next();
      });
    });

    req.on('error', (e) => {
      console.log(`problem with request: ${e.message}`);
    });

    req.write(body);
    req.end();    
    // console.log('sent exit ...');
  }
};

module.exports = Action;
