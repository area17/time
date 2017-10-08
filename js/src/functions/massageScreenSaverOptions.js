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
  if (queryStringObj.temperatureunits) {
    if (queryStringObj.temperatureunits.toLowerCase() === 'fahrenheit') {
      queryStringObj.TemperatureUnit = 'f';
    } else {
      queryStringObj.TemperatureUnit = 'c';
    }
    delete queryStringObj.temperatureunits;
  }
  if (queryStringObj.temperature) {
    queryStringObj.ShowTemperature = (queryStringObj.temperature.toLowerCase() === 'yes') ? 'true' : 'false';
    delete queryStringObj.temperature;
  }
  if (queryStringObj.weather) {
    queryStringObj.ShowCurrentWeather = (queryStringObj.weather.toLowerCase() === 'yes') ? 'true' : 'false';
    delete queryStringObj.weather;
  }
  return queryStringObj;
};
