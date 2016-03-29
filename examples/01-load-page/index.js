/*
  01-load-page

  Load a 
*/

var casper_nodejs = require('../../index.js');

var url = "http://google.com";

var casper = casper_nodejs.create(url, {
  casper: {
    'logLevel' : 'debug',
    'verbose': true
  }
});

/*casper.start(function() {
  console.log("page loaded");
});
*/

// casper.then variants:
// ------------------------------------------------------------------------------------------
// casper.then(fn_in_current_context, null, null)
// casper.then(fn_in_casperjs_context, fn_in_current_context, null)
// casper.then(fn_in_phantomjs_context, fn_in_casperjs_context, fn_in_current_context, null)
// ------------------------------------------------------------------------------------------

casper.then(function executed_in_casperjs_context() {

  return {'test' : 45};
}, function executed_after_in_this_context(ret) {
  console.log('[REPONSE 1] ' + JSON.stringify(ret.test) );
});
/*
casper.then(function executed_in_casperjs_context() {

  return {'test' : 48};
}, function executed_after_in_this_context(ret) {
  console.log('test2 = ' + ret.test);
});*/

/*setTimeout(function() {

  casper.then(function () {

    return {'test' : 42};
  }, function executed_after_in_this_context(ret) {
    console.log('[REPONSE 2] ' + JSON.stringify(ret.test) );
  });
}, 2000);

setTimeout(function() {
  //console.log("----> enregistrement :)");
  casper.then(function executed_in_casperjs_context() {

    return {'test' : 45};
  }, function executed_after_in_this_context(ret) {
    console.log('[REPONSE 3] ' + JSON.stringify(ret.test) );
  });

}, 4000);
*/

setTimeout(function() {
  casper.run();
}, 3000);

setTimeout(function() {
  casper.exit();
}, 6000);

