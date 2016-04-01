# casper-nodejs

Control CasperJS from your nodejs application.

## Objective

Allow you to write powerful scraping scripts in nodeJs, by using CasperJS from nodeJs.

## Requirements

- PhantomJS
- CasperJs
- NodeJS

## How to Use

### Installation 

Install the dependencies:

- `sudo npm install -g phantomjs casperjs`
- `npm install`

### Usage

Create a nodejs script. 

``` 

var casper_nodejs = require('../../index.js');

var url = "http://google.com";
// load the page refered with 'url' with casper
var casper = casper_nodejs.create(url, {});

// once the page is loaded, execute that in our current nodejs context
casper.then(function executed_in_this_context() {
  console.log("page loaded");
});

// then, execute that in casperjs, and the second callback in the current nodejs context
casper.then(function executed_in_casperjs_context() {
  return 42;
}, function executed_in_this_context(ret) {
  console.log("it works: " + ret);
  
  // casper.exit() can be placed here too, instead of in the bottom :)
  // casper.exit();
});

// exit casper after executing the 2 previous 'then'
casper.exit();

```

## How it works

casper.create() spawns a child (casper-child), which:

- listens on port 8085, waiting for POST requests
- keep the casperjs context open (by doing casper.waitFor() in loop)
- creates a lock file once the server is listening ( /tmp/casper-nodejs-XXXXX)

In the nodejs context:

- All the casper.then() and casper.exit() calls are added in an array.
- The call to casper.run() tells to the library that now it can send the POST requests to the child
- If the lock file hasn't been created, casper.run() call setTimeout in order to verify in an 
async way, until the file is created.

## Advantages

- casperjs never exits until you specify it from the nodejs script
- you can use 'then' whenever you want

## Disavantages

- [casperjs]: [info] [phantom] Step anonymous 5/5 http://www.google.fr/?gfe_rd=cr&ei=ky38VvejHfTt8wfViZxQ (HTTP 200)

## See Also

- SpookyJs : the current main nodejs library allowing to use CasperJS. Unmaintained.

## License

Project under MIT License (see the file LICENSE).

