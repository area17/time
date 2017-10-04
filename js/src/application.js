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
A17.settings.ClockType = 'digital';
A17.settings.DigitalFormat = '12';
A17.settings.ShowTemperature = 'true';
A17.settings.ShowCurrentWeather = 'false';
A17.settings.TemperatureUnit = 'c';

// set up and trigger looking for the behaviors on DOM ready
A17.onReady = function(){

  if (A17.screensaver) {
    A17.settings = A17.Helpers.extend(A17.settings, A17.Helpers.turnQueryStringToObject(window.location.search));
  } else {
    A17.settings.ClockType = localStorage.ClockType || A17.settings.ClockType;
    A17.settings.DigitalFormat = localStorage.DigitalFormat || A17.settings.DigitalFormat;
    A17.settings.ShowTemperature = localStorage.ShowTemperature || A17.settings.ShowTemperature;
    A17.settings.ShowCurrentWeather = localStorage.ShowCurrentWeather || A17.settings.ShowCurrentWeather;
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
