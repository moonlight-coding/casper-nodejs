/*
  01-load-page

  Load a 
*/

var casper_nodejs = require('../../index.js');

var url = "http://google.com";

var casper = casper_nodejs.create(url);

// casper.then variants:
// ------------------------------------------------------------------------------------------
// casper.then(fn_in_current_context, null)
// casper.then(fn_in_casperjs_context, fn_in_current_context)
// ------------------------------------------------------------------------------------------

casper.then(function executed_in_this_context() {
  console.log("page loaded");
});

casper.then([function executed_in_this_context(param1) {
  console.log("test param1 = " + param1);
}, [42]]);

casper.then([function executed_in_casperjs_context(param) {

  return {'test' : 45, 'param': param};
}, ['Param !']], function executed_after_in_this_context(ret) {
  console.log('[REPONSE 1] ' + JSON.stringify(ret) );
});

// Start casper

casper.run();

// Exit in 6 seconds

setTimeout(function() {
  console.log('exit :)');
  casper.exit();
}, 6000);

