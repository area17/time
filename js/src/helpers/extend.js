A17.Helpers.extend = function () {
  // Doc: https://code.area17.com/mike/a17-js-helpers/wikis/A17-Helpers-extend

  var obj = {};
  var i = 0;
  var argumentsLength = arguments.length;
  var key;

  for (; i < argumentsLength; i++) {
    for (key in arguments[i]) {
      if (arguments[i].hasOwnProperty(key)) {
        obj[key] = arguments[i][key];
      }
    }
  }

  return obj;

};
