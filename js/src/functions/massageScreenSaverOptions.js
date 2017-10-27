A17.Functions.massageScreebSaverOptions = function() {
  var queryStringObj = A17.Helpers.turnQueryStringToObject(window.location.search);
  // need to massage options coming in from screen saver options
  if (queryStringObj.clocktype) {
    if (queryStringObj.clocktype.toLowerCase() === 'analogue') {
      queryStringObj.ClockType = 'analogue';
    } else {
      queryStringObj.ClockType = 'digital';
    }
    delete queryStringObj.clocktype;
  }
  if (queryStringObj.digitalformat) {
    queryStringObj.DigitalFormat = (parseInt(queryStringObj.digitalformat) === 24) ? '24' : '12';
    delete queryStringObj.digitalformat;
  }
  if (queryStringObj.temperatureunit) {
    if (queryStringObj.temperatureunit.toLowerCase() === 'fahrenheit') {
      queryStringObj.TemperatureUnit = 'f';
    } else {
      queryStringObj.TemperatureUnit = 'c';
    }
    delete queryStringObj.temperatureunits;
  }
  if (queryStringObj.showcurrentweather) {
    queryStringObj.ShowCurrentWeather = queryStringObj.showcurrentweather.toLowerCase();
    delete queryStringObj.showcurrentweather;
  }
  if (queryStringObj.animtedicons) {
    queryStringObj.AnimatedIcons = queryStringObj.animtedicons.toLowerCase();
    delete queryStringObj.animtedicons;
  }
  return queryStringObj;
};
