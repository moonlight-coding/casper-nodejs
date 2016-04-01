/*
  01-load-page

  Load a 
*/

var casper_nodejs = require('../../index.js');

var url = "http://google.com";

var casper = casper_nodejs.create(url);

casper.then(function executed_in_this_context() {
  console.log("page loaded");
});

casper.then([function executed_in_casperjs_context() {
  return Object.keys(this);
}], function executed_after_in_this_context(ret) {
  console.log(ret);
  casper.exit();
});


casper.run();

