timezones.Helpers.turnObjectToQueryString = function(obj) {
  // Doc: https://code.area17.com/mike/a17-js-helpers/wikis/A17-Helpers-turnObjectToQueryString

  var queryString = '';
  var count = 0;

  if (Object.getOwnPropertyNames(obj).length > 0) {
    queryString = '?';
    for (var key in obj) {
      if (!obj.hasOwnProperty(key)) {
        continue;
      }
      queryString += ((count > 0) ? '&' : '') + key + '=' + encodeURIComponent(obj[key]).replace(/[!'()]/g, '').replace(/\*/g, '%2A').replace(/%2B/ig, '+');
      count++;
    }
  }

  return queryString;
};
