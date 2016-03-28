console.log("I am the casperjs program, you  spawned me :)");

var casper = require('casper').create();

try {

  //console.log(JSON.stringify(casper.cli.options, null, 2));

  // load the options from the command line
  var casper_url = JSON.stringify(casper.cli.options['mlc-casper-url']);
  var casper_options = JSON.stringify(casper.cli.options['mlc-casper-options']);

  for(var i in casper_options) {
    var option = casper_options[i];

    if(!Array.isArray(option) && (typeof option === 'object') ) {
      for(var j in option) {
        casper.options[i][j] = option[j];
      }
    }
    else 
      casper.options[i] = option;
  }

  // initialize the events
  casper.on('mlc.action', function() {
    this.log('received mlc.action !');
  });

  // 
  casper.start(casper_url, function() {
    this.echo("casper.start executed");
  });

  var waitEventObj = {
    check: function() {
      return false;
    },
    then: function () {
      console.log('end of wait');
    }, 
    onTimeout: function timeout(t) {
      console.log('TIMEOUT ' + t + 'ms elapsed');
      waitEventObj.wait();
    },
    timeout: 1000, // timeout of 10s
    wait: function() {
      casper.waitFor(waitEventObj.check, waitEventObj.then, waitEventObj.onTimeout, waitEventObj.timeout);
    }
  };

  casper.then(function() {
    this.echo("casper.then executed.");
    this.echo("waiting for event");

    waitEventObj.wait(); //casper.waitFor();
  });

  casper.run(function() {
    console.log("casper.run executed: end of the scraper");
    this.exit();
  });

  // store the action lists
  var action_list = require('./action_list.js');

  // listen to requests from nodejs
  var server = require('./server.js');

  server.start(casper, action_list, 8085);

}
catch(err) {
  console.error(err.stack);
  casper.exit(1);
}

