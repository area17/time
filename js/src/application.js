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
A17.settings = {};

// defaults
A17.settings.ClockType = 'analogue';
A17.settings.DigitalFormat = '24';
A17.settings.ShowCurrentWeather = 'true';
A17.settings.AnimatedIcons = 'false';
A17.settings.TemperatureUnit = 'c';

// set up and trigger looking for the behaviors on DOM ready
A17.onReady = function(){
  // shift icons to top of DOM
  document.body.insertBefore(document.getElementById('icons'),document.body.childNodes[0]);

  if (A17.screensaver) {
    A17.settings = A17.Helpers.extend(A17.settings, A17.Functions.massageScreebSaverOptions());
  } else {
    A17.settings.ClockType = localStorage.ClockType || A17.settings.ClockType;
    A17.settings.DigitalFormat = localStorage.DigitalFormat || A17.settings.DigitalFormat;
    A17.settings.ShowCurrentWeather = localStorage.ShowCurrentWeather || A17.settings.ShowCurrentWeather;
    A17.settings.AnimatedIcons = localStorage.AnimatedIcons || A17.settings.AnimatedIcons;
    A17.settings.TemperatureUnit = localStorage.TemperatureUnit || A17.settings.TemperatureUnit;
  }

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
