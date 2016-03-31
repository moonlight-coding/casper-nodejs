/*
  List of the actions to execute
*/

var AL = {
  
  actions: [],
  
  _uniformize_arg: function(arg) {
    if(arg == null)
      return arg; // null or undefined

    if(typeof arg == "function") {
      return [arg, []];
    }
    else { // array
      return arg;
    }
  },

  add: function(type, arg1, arg2) {
    
    var action = {type: type};
  
    if(action.type == 'then') {
      action.callbacks = [ 
        AL._uniformize_arg(arg1), 
        AL._uniformize_arg(arg2)
      ];
    }

    AL.actions.push(action);

    // console.log(AL.actions.length + ' actions enregistrées');

    return AL;
  },

  next: function() {
    return (AL.actions.length > 0) ? AL.actions.splice(0, 1)[0] : null;
  }

};

module.exports = AL;
