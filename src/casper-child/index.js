var casper = require('casper').create();

casper.start('http://google.com', function() {
  this.emit('testeuh');
  this.emit('testeuh');
});

casper.on('testeuh', function() {
  this.echo("testeuh received");
  this.then(function() {
    this.echo ("yeah");
  });
});

casper.run(function() {
  this.echo('casper run() callback called');
  // le code des then n'est plus exécuté à partir du moment où run() est exécuté 
  //this.exit();
});

setTimeout(function() {
  casper.emit('testeuh');
}, 500);

/*
console.log("Hi, you spawned me :)");

var casper = require('casper').create();

try {

  //console.log(JSON.stringify(casper.cli.options, null, 2));

  // load the options from the command line

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
  casper.on('mlc.event', function() {
    this.log('received mlc.event !');
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
*/
