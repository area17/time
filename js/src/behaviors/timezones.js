A17.Behaviors.timezones = function(container) {

  var locationTemplate = '<li id="{{locationID}}" class="m-timezone s-loading">\n<strong class="m-timezone__name">{{name}}</strong>\n<em class="m-timezone__time">{{time}}</em>\n<span class="m-timezone__weather">\n</span>\n</li>\n';
  var iconTemplate = '<svg class="icon" aria-hidden="true"><use xlink:href="#{{name}}" /></svg>';
  var liHtml = '';
  var mTemp = 99; // initial value out of range
  var updatingWeather = false;
  var lastWeatherCheck = 0;
  var officeOpen = 9;
  var officeClosed = 19;
  var time, secondInterval, weatherInterval, weatherRecievedCounter;
  var animatedIcons = ['clear-day','partly-cloudy-day','partly-cloudy-night','rain'];

  function _convertFtoC(f) {
    return (f - 32) * (5 / 9);
  }

  function _updateTemperatures(location,index) {
    var locationEl = document.getElementById('location-'+index);
    if (locationEl) {
      var rainChanceClass = '';
      var rainChanceClass = (location.rainChance > 49) ? ' m-timezone__rain-chance--raining' : '';
      // show umbrella emoji to illustrate rain chance
      var umbrellaEmoji = '🌂'; // default, low chance of rain
      var umbrellaClass = '';
      if (location.rainChance > 20) {
        umbrellaEmoji = '☂️'; // some chance of rain
      }
      if (location.rainChance > 80) {
        umbrellaEmoji = '☔'; // high chance of rain
      }
      if (/snow/i.test(location.icon)) {
        umbrellaEmoji = '⛄️'; // override for snowing
      } else {
        if (/rain|sleet/i.test(location.icon)) {
          umbrellaEmoji = '☔'; // override for raining or sleeting
        }
        if ((/wind/i.test(location.icon) || /wind/i.test(location.summary)) && location.rainChance > 80) {
          umbrellaClass = ' m-timezone__emoji--windy'; // if windy and high rain chance
        }
      }
      // add class for high/low temps, frustratingly DarkSky returns temps in °F
      // WTF is a °F
      var temperatureClass = '';
      if (location.feelsLike <= 33) {
        // 33°F is 0°C
        temperatureClass = ' m-timezone__feels-like--cold';
      } else if (location.feelsLike > 86) {
        // I'm British, 86°F is hot for me
        temperatureClass = ' m-timezone__feels-like--hot';
      } else if (location.feelsLike > 100) {
        // Americans go bananas about 100+°F temperatures
        temperatureClass = ' m-timezone__feels-like--really-hot';
      }
      //
      var tempUnit = A17.settings.TemperatureUnit || 'c';
      var temp = Math.round( (tempUnit === 'c') ? _convertFtoC(location.temperature) : location.temperature );
      var tempFeelsLike = Math.round( (tempUnit === 'c') ? _convertFtoC(location.feelsLike) : location.feelsLike );
      var moonPhase = A17.Functions.moonPhase();
      var weatherSummary = location.summary[0].toUpperCase() + location.summary.substring(1).toLowerCase() + '.';
      var weatherEmoji = (location.icon !== 'clear-night') ? iconTemplate.replace('{{name}}',location.icon) : iconTemplate.replace('{{name}}',moonPhase.icon);
      if (A17.settings.AnimatedIcons === 'true' && location.icon !== 'clear-night' && (animatedIcons.indexOf(location.icon) !== -1)) {
        weatherEmoji = iconTemplate.replace('{{name}}',location.icon + '--animated');
      }
      weatherSummary = (location.icon !== 'clear-night') ? weatherSummary : weatherSummary + ' Moon phase is ' + moonPhase.phase.toLowerCase() + ' ' + moonPhase.emoji + '.';
      var emojiClass = (location.icon === 'clear-day') ? ' m-timezone__emoji--sunny' : '';
      //
      tempUnit = tempUnit.toUpperCase();
      //
      locationEl.querySelector('.m-timezone__weather').innerHTML = '<span class="m-timezone__feels-like' + temperatureClass + '" title="feels like"><span class="m-timezone__emoji' + emojiClass + '" title="' + weatherSummary + ' Feels like ' + tempFeelsLike + '°' + tempUnit + '">' + weatherEmoji + '</span>' + temp + '&deg;' + tempUnit + '</span>\n<span class="m-timezone__rain-chance' + rainChanceClass + '"><span class="m-timezone__emoji' + umbrellaClass + '" title="Precipitation probability in the next hour: ' + location.rainChance + '% ' + umbrellaEmoji + '">' + iconTemplate.replace('{{name}}', 'rain-drops') + '</span>' + location.rainChance + '%</span>';
      //
      locationEl.classList.remove('s-loading');
    }
  }

  function _updateWeather() {
    if ((A17.settings.ShowCurrentWeather === 'true') && !updatingWeather) {
      if (new Date().getTime() > lastWeatherCheck + 1800000) {
        updatingWeather = true;
        weatherRecievedCounter = 0;
        A17.locations.forEach(_getWeather);
      } else {
        A17.locations.forEach(function(location, index){
          _updateTemperatures(location, index);
        });
      }
    }
  }

  function _recievedWeather() {
    weatherRecievedCounter++;
    if (weatherRecievedCounter === A17.locations.length) {
      updatingWeather = false;
      lastWeatherCheck = new Date().getTime();
      _updateWeather();
    }
  }

  function _getWeather(location,index) {
    A17.Helpers.ajaxRequest({
      url: '/forecast.php',
      type: 'GET',
      data: {
        lat: location.lat,
        long: location.long
      },
      onSuccess: function(data){
        data = JSON.parse(data);
        //
        location.temperature = Math.round(data.currently.temperature);
        location.icon = data.currently.icon;
        location.feelsLike = Math.round(data.currently.apparentTemperature);
        location.rainChance = Math.round(data.currently.precipProbability * 100);
        location.summary = data.currently.summary;
        //
        _updateTemperatures(location, index);
        //
        _recievedWeather();
      },
      onError: function(data){
        console.log(data);
        _recievedWeather();
      }
    });
  }

  function _updateTimes(override) {
    time = new Date();
    var systemH = time.getHours();
    var systemM = time.getMinutes();
    time = new Date(time.getUTCFullYear(), time.getUTCMonth(), time.getUTCDate(), time.getUTCHours(), time.getUTCMinutes(), time.getUTCSeconds());
    time = time.getTime()/1000;
    //
    if (mTemp !== systemM || override) {
      mTemp = systemM;
      A17.locations.forEach(function(location,index){
        var locationEl = document.getElementById('location-'+index);
        var format = A17.settings.DigitalFormat || '24';
        var thisTime = new Date((time + location.offset) * 1000);
        var thisH = thisTime.getHours();
        var thisM = thisTime.getMinutes();
        var thisDay = thisTime.getDay();
        var isCurrent = (thisH === systemH);
        var isOpen = (thisH >= officeOpen && thisH < officeClosed && thisDay !== 0 && thisDay !== 6);
        var str = '';
        //
        if (thisM < 10) {
          thisM = '0' + thisM; // leading zero minutes
        }
        //
        if (format !== '24') {
          str = (thisH > 12 ? thisH - 12 : thisH) + ':' + thisM + (thisH > 12 ? ' pm' : ' am');
        } else {
          str = thisH + ':' + thisM;
        }
        if (isCurrent) {
          locationEl.classList.add('s-current');
        } else {
          locationEl.classList.remove('s-current');
        }
        if (isOpen) {
          locationEl.classList.add('s-open');
        } else {
          locationEl.classList.remove('s-open');
        }
        //
        locationEl.querySelector('.m-timezone__time').innerHTML = str;
      });
    }
  }

  //
  function _updateDigitalFormat() {
    _updateTimes(true);
  }

  function _hideshowWeather() {
    var showWeather = A17.settings.ShowCurrentWeather || 'true';
    if (showWeather === 'false') {
      document.documentElement.classList.add('s-hide-weather');
    } else {
      document.documentElement.classList.remove('s-hide-weather');
      _updateWeather();
    }
  }

  function _updateTemperatureUnit() {
    A17.locations.forEach(function(location, index){
      _updateTemperatures(location, index);
    });
  }

  function _setIntervals() {
    secondInterval = setInterval(_updateTimes, 1000);
    weatherInterval = setInterval(_updateWeather, 60 * 30 * 1000);
  }

  function _handleVisibilityChange() {
    if (document.hidden) {
      clearInterval(secondInterval);
      clearInterval(weatherInterval);
      container.innerHTML = '';
    } else {
      container.innerHTML = liHtml;
      _updateTimes(true);
      _updateWeather();
      _setIntervals();
    }
  }

  function _windowLoad() {
    _hideshowWeather();
  }

  function _init() {
    //
    A17.locations.forEach(function(location,index){
      location.id = 'location-'+index;
      location.time = '';
      location.temperature = '';
      //
      var thisLocationTemplate = locationTemplate;
      thisLocationTemplate = thisLocationTemplate.replace('{{time}}',location.time);
      thisLocationTemplate = thisLocationTemplate.replace('{{name}}',location.name);
      thisLocationTemplate = thisLocationTemplate.replace('{{iconID}}','icon-'+index);
      thisLocationTemplate = thisLocationTemplate.replace('{{locationID}}',location.id);
      //
      liHtml += thisLocationTemplate;
    });

    container.innerHTML = liHtml;

    _updateTimes(true);

    _setIntervals();
  }

  this.init = function() {
    _init();

    document.addEventListener('updateDigitalFormat', _updateDigitalFormat, false);
    document.addEventListener('updateShowCurrentWeather', _hideshowWeather, false);
    document.addEventListener('updateTemperatureUnit', _updateTemperatureUnit, false);
    document.addEventListener('updateAnimatedIcons', _hideshowWeather, false);
    document.addEventListener('visibilitychange', _handleVisibilityChange, false);
    window.addEventListener('load', _windowLoad, false);
  };
};
