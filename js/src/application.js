/*

  Timezones

*/

// --------------------------------------------------------------------------------------------------------------

// set up a master object
var A17 = window.A17 || {};

// set up some objects within the master one, to hold my Helpers and behaviors
A17.Behaviors = {};
A17.Helpers = {};
A17.Functions = {};
A17.currentMediaQuery = 'large';
A17.activeBehaviors = {};


// set up and trigger looking for the behaviors on DOM ready
A17.onReady = function(){

  // sort out which media query we're using
  A17.currentMediaQuery = A17.Helpers.getCurrentMediaQuery();

  // on resize, check
  A17.Helpers.resized();

  // go go go
  A17.Helpers.manageBehaviors();
};

document.addEventListener('DOMContentLoaded', function(){
  A17.onReady();
});

// make console.log safe
if (typeof console === 'undefined') {
  window.console = {
    log: function () {
      return;
    }
  };
}
