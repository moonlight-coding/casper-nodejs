var casper_nodejs = require('../../index.js');

var casper = casper_nodejs.create('http://google.fr/', {
  casper: {
    'logLevel' : 'debug',
    'verbose': true
  }
});
var links = [];

casper.then(function() {
  console.log('page loaded');
});

casper.then(function() {
   // search for 'casperjs' from google form
   this.fill('form[action="/search"]', { q: 'casperjs' }, true);

   return 1;
}, function(ret) {
  console.log("premier fill de form: fait");
});

casper.then(function() {
    function getLinks() {
      var links = document.querySelectorAll('h3.r a');
      return Array.prototype.map.call(links, function(e) {
          return e.getAttribute('href');
      });
    }

    // aggregate results for the 'casperjs' search
    var links = this.evaluate(getLinks);
    // now search for 'phantomjs' by filling the form again
    this.fill('form[action="/search"]', { q: 'phantomjs' }, true);

    return links;
}, function(ret) {
  console.log("récupération des links");
  //console.log(ret);
  links = ret;
});

casper.then(function() {

    function getLinks() {
      var links = document.querySelectorAll('h3.r a');
      return Array.prototype.map.call(links, function(e) {
          return e.getAttribute('href');
      });
    }

    // aggregate results for the 'phantomjs' search
    var links = this.evaluate(getLinks);
    return links;
}, function(ret) {
  console.log("concaténation des links");
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
