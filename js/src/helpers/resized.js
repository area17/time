A17.Helpers.resized = function() {
  // Doc: https://code.area17.com/mike/a17-js-helpers/wikis/A17-Helpers-resized

  var resizeTimer;
  var mediaQueryUpdated = false;

  window.addEventListener('resize', function() {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(function() {
      // check media query
      var newMediaQuery = A17.Helpers.getCurrentMediaQuery();

      // is it different? if so, update global var
      if (A17.currentMediaQuery !== newMediaQuery) {
        A17.currentMediaQuery = newMediaQuery;
        mediaQueryUpdated = true;
      }

      // tell everything resized happened
      A17.Helpers.triggerCustomEvent(document, 'resized');

      // if media query changed, tell everything
      if (mediaQueryUpdated) {
        A17.Helpers.triggerCustomEvent(document, 'mediaQueryUpdated');
      }
    }, 250);
  });

};
