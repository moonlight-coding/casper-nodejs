var casper_nodejs = require('../../index.js');

var casper = casper_nodejs.create('http://google.fr/');
var links = [];

casper.then(function() {
   // search for 'casperjs' from google form
   this.fill('form[action="/search"]', { q: 'casperjs' }, true);
}, null);

casper.then(function() {
  context.getLinks = function() {
    var links = document.querySelectorAll('h3.r a');
    return Array.prototype.map.call(links, function(e) {
        return e.getAttribute('href');
    });
  }

  // aggregate results for the 'casperjs' search
  var links = this.evaluate(context.getLinks);
  // now search for 'phantomjs' by filling the form again
  this.fill('form[action="/search"]', { q: 'phantomjs' }, true);

  return links;
}, function(ret) {
  links = ret;
});

casper.then(function() {
  // aggregate results for the 'phantomjs' search
  var links = this.evaluate(context.getLinks);
  return links;
}, function(ret) {
  //console.log(ret);
  links = links.concat(ret);
});

casper.then(function() {
  // echo results in some pretty fashion
  console.log(links.length + ' links found:');
  console.log(' - ' + links.join('\n - '));

  casper.exit();
});

casper.run();
