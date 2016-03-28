/*
  Liste d'actions pour CasperJS:
  - on ne peut pas appeler casper.{method} qd on n'est pas ds le contexte de CasperJS 
  (setTimeout, event server etc...).
  - utiliser casper.on
*/

var AL = {
  
  actions: [],
  
  add_action: function(call_context_web, call_context_casperjs, call_context_nodejs) {
    AL.actions.push({
      call_context_web: call_context_web, 
      call_context_casperjs: call_context_casperjs, 
      call_context_nodejs: call_context_nodejs
    });

    return AL;
  },

  next_action: function() {
    return AL.actions.splice(1);
  }

};

module.exports = AL;
