console.log("Hi, you spawned me :)");

var casper = require('casper').create({/*,
  verbose: true,
  logLevel: "debug"*/
});

casper.start('http://google.com');

casper.run(function() {
  this.echo('casper run() callback called');

  this.exit();
});
