var spawn = require('child_process').spawn;

function stripTrailingNewLine(str) {
  if(str.substr(-1) === "\n") {
    return str.substr(0, str.length - 1);
  }
  return str;
}

function create(params) {
  // spawn a child with casperjs    

  var process = spawn('casperjs', [
    __dirname + '/../casper-child/index.js',
    "--mlc-casper-options=" + JSON.stringify(params)
  ]);

  process.stdout.on('data', (data) => {
    data = stripTrailingNewLine(data.toString('utf-8'));
    console.log(`[casperjs]: ${data}`);
  });

  process.stderr.on('data', (data) => {
    data = stripTrailingNewLine(data.toString('utf-8'));
    console.log(`[casperjs err]: ${data}`);
  });

  process.on('close', (code) => {
    console.log(`child process exited with code ${code}`);
  });  

  return {
    _process: process,

    start: function() {
      console.log('TO IMPLEMENT: start ');
    },
    then: function() {
      console.log('TO IMPLEMENT: then ');
    },
    run: function() {
      console.log('TO IMPLEMENT: run');
    }
  };
}


module.exports = create;

