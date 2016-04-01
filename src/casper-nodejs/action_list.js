/*
 * List of the actions to execute
 * Main goal: check and uniformize the input
 */

var AL = {

  // the list of actions  
  actions: [],
  
  // uniformize a callback arg:
  // can be:
  // - undefined : arg not set
  // - null: arg set at null explicitly
  // - function : the callback to execute
  // - [function, array]: the callback to execute and the parameters to give it
  _uniformize_arg: function(arg) {
    if(arg == null)
      return arg; // null or undefined

    if(typeof arg == "function") {
      return [arg, []];
    }
    else { // array
      if(arg.length == 1) {
        return [arg[0], []];
      }
      else 
        return arg;
    }
  },

  // add an action in the list (added at the end, it's a FIFO)
  add: function(type, arg1, arg2) {
    
    var action = {type: type};
  
    if(action.type == 'then') {
      action.callbacks = [ 
        AL._uniformize_arg(arg1), 
        AL._uniformize_arg(arg2)
      ];
    }

    AL.actions.push(action);

    return AL;
  },

  next: function() {
    return (AL.actions.length > 0) ? AL.actions.splice(0, 1)[0] : null;
  }

};

module.exports = AL;
