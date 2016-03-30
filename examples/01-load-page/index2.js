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

// casper.then variants:
// ------------------------------------------------------------------------------------------
// casper.then(fn_in_current_context, null)
// casper.then(fn_in_casperjs_context, fn_in_current_context)
// ------------------------------------------------------------------------------------------

casper.then(function executed_in_casperjs_context() {

  return {'test' : 45};
}, function executed_after_in_this_context(ret) {
  console.log('[RESPONSE 1] ' + JSON.stringify(ret.test) );
});

casper.then(function executed_in_casperjs_context() {
  // get the title of the document
  return {'test' : this.getTitle() };
}, function executed_after_in_this_context(ret) {
  console.log('[RESPONSE 2] ' + ret.test);

  casper.then(function () {

    var t = this.evaluate(function() {
      return 'it works';
    });

    return {'test' : t};
  }, function executed_after_in_this_context(ret) {

    console.log('[RESPONSE 3] ' + JSON.stringify(ret.test) );

    casper.exit();
  });
});


casper.run();

