console.log("Hi, you spawned me :)");

var casper = require('casper').create();

console.log(JSON.stringify(casper.cli.options, null, 2));

casper.start('http://google.com');

casper.run(function() {
  this.echo('casper run() callback called');

  this.exit();
});


