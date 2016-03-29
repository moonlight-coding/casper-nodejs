/*
  List of the actions to execute
*/

var AL = {
  
  actions: [],
  
  add: function(call_context_web, call_context_casperjs, call_context_nodejs) {
    AL.actions.push([
      call_context_web, 
      call_context_casperjs, 
      call_context_nodejs
    ]);

    console.log(AL.actions.length + ' actions enregistrées');

    return AL;
  },

  next: function() {
    return (AL.actions.length > 0) ? AL.actions.splice(0, 1)[0] : null;
  }

};

module.exports = AL;
