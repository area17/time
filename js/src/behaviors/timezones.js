A17.Behaviors.timezones = function(container) {

  var locationTemplate = '<li id="{{locationID}}" class="m-timezone s-loading">\n<div class="m-timezone__inner">\n<strong class="m-timezone__name">{{name}}</strong>\n<em class="m-timezone__time">{{time}}</em>\n<span class="m-timezone__weather">\n</span>\n</div>\n</li>\n';
  var iconTemplate = '<svg class="icon" aria-hidden="true"><use xlink:href="#{{name}}" /></svg>';
  var liHtml = '';
  var mTemp = 99; // initial value out of range
  var updatingWeather = false;
  var lastWeatherCheck = 0;
  var officeOpen = 9;
  var officeClosed = 19;
  var time, secondInterval, weatherInterval, weatherRecievedCounter;

  function _convertFtoC(f) {
    return (f - 32) * (5 / 9);
  }

  function _convertCtoF(c) {
    return c * 9 / 5 + 32;
  }

  function _uvindexRating(i) {
    if (i < 3) {
      return 'low';
    }
    if (i < 6) {
      return 'moderate';
    }
    if (i < 8) {
      return 'high';
    }
    return 'very high'
  }

  function _updateTemperatures(location,index) {
    var locationEl = document.getElementById(location.id);
    if (locationEl) {
      var rainChanceClass = '';
      var rainChanceClass = (location.conditions.rainChance > 49) ? ' m-timezone__rain-chance--raining' : '';
      // show umbrella emoji to illustrate rain chance
      var umbrellaEmoji = '🌂'; // default, low chance of rain
      var umbrellaClass = '';
      if (location.conditions.rainChance > 20) {
        umbrellaEmoji = '☂️'; // some chance of rain
      }
      if (location.conditions.rainChance > 80) {
        umbrellaEmoji = '☔'; // high chance of rain
      }
      if (/snow/i.test(location.conditions.icon)) {
        umbrellaEmoji = '⛄️'; // override for snowing
      } else {
        if (/rain|sleet/i.test(location.conditions.icon)) {
          umbrellaEmoji = '☔'; // override for raining or sleeting
        }
        if ((/wind/i.test(location.conditions.icon) || /wind/i.test(location.conditions.summary)) && location.conditions.rainChance > 80) {
          umbrellaClass = ' m-timezone__emoji--windy'; // if windy and high rain chance
        }
      }
      // add class for high/low temps
      var temperatureClass = '';
      if (location.conditions.feelsLike <= 0) {
        // 0°C is 33°F
        temperatureClass = ' m-timezone__feels-like--cold';
      } else if (location.conditions.feelsLike > 30) {
        // I'm British, 30°C/86°F is hot for me
        temperatureClass = ' m-timezone__feels-like--hot';
      } else if (location.conditions.feelsLike > 37.78) {
        // Americans go bananas about 100+°F temperatures
        temperatureClass = ' m-timezone__feels-like--really-hot';
      }
      //
      var tempUnit = A17.settings.TemperatureUnit || 'c';
      var temp = Math.round( (tempUnit === 'c') ? location.conditions.temperature : _convertCtoF(location.conditions.temperature) );
      var tempFeelsLike = Math.round( (tempUnit === 'c') ? location.conditions.feelsLike : _convertCtoF(location.conditions.feelsLike) );
      var tempMin = Math.round( (tempUnit === 'c') ? location.conditions.tempmin : _convertCtoF(location.conditions.tempmin) );
      var tempMax = Math.round( (tempUnit === 'c') ? location.conditions.tempmax : _convertCtoF(location.conditions.tempmax) );
      var moonPhase = A17.Functions.moonPhase();
      var weatherSummary = location.conditions.summary[0].toUpperCase() + location.conditions.summary.substring(1).toLowerCase() + '.';
      var weatherEmoji = (location.conditions.icon !== 'clear-night') ? iconTemplate.replace('{{name}}',location.conditions.icon) : iconTemplate.replace('{{name}}',moonPhase.icon);
      if (A17.settings.AnimatedIcons === 'true' && location.conditions.icon !== 'clear-night') {
        weatherEmoji = iconTemplate.replace('{{name}}',location.conditions.icon + '--animated');
      }
      weatherSummary = (location.conditions.icon !== 'clear-night') ? weatherSummary : weatherSummary + ' Moon phase is ' + moonPhase.phase.toLowerCase() + ' ' + moonPhase.emoji + '.';
      var emojiClass = (location.conditions.icon === 'clear-day') ? ' m-timezone__emoji--sunny' : '';
      var sunglasses = location.conditions.uvindex > 6 ? '🕶️' : '';
      //
      tempUnit = tempUnit.toUpperCase();
      //
      var $weatherSpan = locationEl.querySelector('.m-timezone__weather');
      var weatherSpanHTML = '';
      weatherSpanHTML += '<span class="m-timezone__feels-like' + temperatureClass + '"><span class="m-timezone__emoji' + emojiClass + '">' + weatherEmoji + '</span>' + temp + '&deg;' + tempUnit + '</span>\n';
      weatherSpanHTML += '<span class="m-timezone__rain-chance' + rainChanceClass + '""><span class="m-timezone__emoji' + umbrellaClass + '">' + iconTemplate.replace('{{name}}', 'rain-drops') + '</span>' + location.conditions.rainChance + '%</span>';
      //
      var title = weatherSummary + ' \nMinimum ' + tempMin + '°' + tempUnit + ', maximum ' + tempMax + '°' + tempUnit + ',  feels like ' + tempFeelsLike + '°' + tempUnit + '. \nProbability of ' + location.conditions.preciptype + ' in the next hour: ' + location.conditions.rainChance + '% ' + umbrellaEmoji + '.\nSunrise at ' + location.conditions.sunrise + ', sunset at ' + location.conditions.sunset + '. \nUV index ' + location.conditions.uvindex + ' (' + _uvindexRating(location.conditions.uvindex) + ') ' + sunglasses;
      //
      $weatherSpan.parentNode.title = title;
      $weatherSpan.innerHTML = weatherSpanHTML;
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
        location.conditions = location.conditions || {};
        location.conditions.temperature = Math.round(data.currentConditions.temp);
        location.conditions.icon = data.currentConditions.icon;
        location.conditions.feelsLike = Math.round(data.currentConditions.feelslike);
        location.conditions.rainChance = Math.round(data.currentConditions.precipprob);
        location.conditions.summary = data.currentConditions.conditions;
        location.conditions.tempmax = data.days[0].tempmax;
        location.conditions.tempmin = data.days[0].tempmin;
        location.conditions.sunrise = data.currentConditions.sunrise;
        location.conditions.sunset = data.currentConditions.sunset;
        location.conditions.uvindex = data.currentConditions.uvindex;
        location.conditions.preciptype = data.currentConditions.preciptype || 'rain';
        location.conditions.moonphase = data.currentConditions.moonphase;
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
        var locationEl = document.getElementById(location.id);
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
    secondInterval = setInterval(_updateTimes, 1000 * 20);
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
      //
      var thisLocationTemplate = locationTemplate;
      thisLocationTemplate = thisLocationTemplate.replace('{{time}}','');
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
