A17.Helpers.turnQueryStringToObject = function(url) {
  // Doc: https://code.area17.com/mike/a17-js-helpers/wikis/A17-Helpers-turnQueryStringToObject
  if (typeof url !== 'string') {
    return {};
  }
  var qsObj = {};
  var search = (url && url.indexOf('?') > -1) ? url.split('?')[1] : location.search;
  search.replace(
    new RegExp('([^?=&]+)(=([^&]*))?', 'g'), function($0, $1, $2, $3) {
      qsObj[$1] = $3;
    }
  );
  return qsObj;
};
