timezones.Helpers.resized = function() {
  document.trigger("resized");

  var new_media_query = timezones.Helpers.get_media_query_in_use();
  if (timezones.media_query_in_use != new_media_query) {
    timezones.media_query_in_use = timezones.Helpers.get_media_query_in_use();
    // update the image sizes
    document.trigger("media_query_updated");
  }
};