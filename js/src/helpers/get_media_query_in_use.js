timezones.Helpers.get_media_query_in_use = function() {

  if (window.opera){
    return parse(window.getComputedStyle(document.body,':after').getPropertyValue('content')) || "large";
  } else if (window.getComputedStyle) {
    return parse(window.getComputedStyle(document.head,null).getPropertyValue('font-family')) || "large";
  } else {
    return "large";
  }

  function parse(str) {
    return str.replace(/'/gi,"").replace(/"/gi,"");
  }
};