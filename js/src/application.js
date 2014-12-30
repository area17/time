/*

  Timezones

*/

// --------------------------------------------------------------------------------------------------------------

// set up a master object
var timezones = window.timezones || {};

// set up some objects within the master one, to hold my Helpers and behaviors
timezones.Behaviors = {
}
timezones.Helpers = {
}
timezones.Functions = {
}
timezones.media_query_in_use = "large";
timezones.locations = [
  { name: "San Francisco", lat: 37.775, long: -122.4183333, timezone: "America/Los_Angeles" },
  { name: "Tennessee", lat: 35.7449, long: -86.7489, timezone: "America/Chicago" },
  { name: "New York", lat: 40.7141667, long:  -74.0063889, timezone: "America/New_York" },
  { name: "Tucumán", lat: -26.8166667, long: -65.2166667, timezone: "America/Argentina/Tucuman" },
  { name: "London", lat: 51.5, long:  -0.116667, timezone: "Europe/London" },
  { name: "Paris", lat: 48.866667, long: 2.333333, timezone: "Europe/Paris" }
];

// look through the document (or ajax'd in content if "context" is defined) to look for "data-behavior" attributes.
// Initialize a new instance of the method if found, passing through the element that had the attribute
// So in this example it will find 'data-behavior="show_articles"' and run the show_articles method.
timezones.LoadBehavior = function(context){
  if(context === undefined){
    context = document;
  }
  var all = context.querySelectorAll("[data-behavior]");
  var i = -1;
  while (all[++i]) {
    var currentElement = all[i];
    var behaviors = currentElement.getAttribute("data-behavior");
    var splitted_behaviors = behaviors.split(" ");
    for (var j = 0, k = splitted_behaviors.length; j < k; j++) {
      var thisBehavior = timezones.Behaviors[splitted_behaviors[j]];
      if(typeof thisBehavior !== "undefined") {
        thisBehavior.call(currentElement,currentElement);
      }
    }
  }
};

// set up and trigger looking for the behaviors on DOM ready
timezones.onReady = function(){
  // sort out which media query we're using
  timezones.media_query_in_use = timezones.Helpers.get_media_query_in_use();
  // go go go
  timezones.LoadBehavior();
  // on resize, check
  var resize_timer;
  window.on('resize', function(event){
    clearTimeout(resize_timer);
    resize_timer = setTimeout(function(){
      timezones.Helpers.resized();
    },250);
  });
};

document.addEventListener('DOMContentLoaded', function(){
  timezones.onReady();
});

// make console.log safe
if (typeof console === "undefined") {
  console = {
    log: function () {
      return;
    }
  };
}