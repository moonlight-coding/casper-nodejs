/*
  01-load-page

  Load a 
*/

var casper_nodejs = require('../../index.js');

var casper = casper_nodejs.create({
  casper: {
    'logLevel' : 'debug',
    'verbose': true
  }
});

var url = "http://google.com";

casper.start(url, function() {
  console.log("page loaded");
});

// casper.then variants:
// ------------------------------------------------------------------------------------------
// casper.then(fn_in_current_context, null, null)
// casper.then(fn_in_casperjs_context, fn_in_current_context, null)
// casper.then(fn_in_phantomjs_context, fn_in_casperjs_context, fn_in_current_context, null)
// ------------------------------------------------------------------------------------------

casper.then(function executed_in_casperjs_context() {

  return {'test' : 42};
}, function executed_after_in_this_context(ret) {
  console.log('test = ' + ret.test);
});

casper.then(function executed_in_casperjs_context() {

  return {'test' : 42};
}, function executed_after_in_this_context(ret) {
  console.log('test = ' + ret.test);
});

casper.run(function() {
  console.log("this is the last function to be called");
});

