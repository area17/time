A17.Behaviors.timezones = function(container) {

  var locationTemplate = '<li id="{{locationID}}" class="s-loading">\n<strong>{{name}}</strong>\n<em class="time">{{time}}</em>\n<span class="temperature"></span>\n<span class="weather">\n</span>\n</li>\n';
  var liHtml = '';
  var mTemp = 99; // initial value out of range
  var updatingWeather = false;
  var lastWeatherCheck = 0;
  var weatherEmojis = {
    'clear-day' : '☀️',
    'clear-night' : '🌙',
    'partly-cloudy-day' : '⛅',
    'partly-cloudy-night' : '☁️',
    'cloudy' : '☁️',
    'rain' : '🌧️',
    'sleet' : '🌨️',
    'snow' : '🌨️',
    'wind' : '🌬',
    'fog' : '🌫️'
  };
  var officeOpen = 9;
  var officeClosed = 19;
  var time, secondInterval, weatherTimeout, weatherRecievedCounter;

  function _convertFtoC(f) {
    return (f - 32) * (5 / 9);
  }

  function _updateTemperatures(location,index) {
    var locationEl = document.getElementById('location-'+index);
    if (locationEl) {
      var rainChanceClass = (location.rainChance > 49) ? ' raining' : '';
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
          umbrellaClass = ' windy'; // if windy and high rain chance
        }
      }
      // add class for high/low temps, frustratingly DarkSky returns temps in °F
      // WTF is a °F
      var temperatureClass = '';
      if (location.feelsLike <= 33) {
        // 33°F is 0°C
        temperatureClass = ' cold';
      } else if (location.feelsLike > 86) {
        // I'm British, 86°F is hot for me
        temperatureClass = ' hot';
      } else if (location.feelsLike > 100) {
        // Americans go bananas about 100+°F temperatures
        temperatureClass = ' really-hot';
      }
      //
      var tempUnit = localStorage.TemperatureUnit || 'c';
      var temp = Math.round( (tempUnit === 'c') ? _convertFtoC(location.temperature) : location.temperature );
      var tempFeelsLike = Math.round( (tempUnit === 'c') ? _convertFtoC(location.feelsLike) : location.feelsLike );
      var moonPhase = A17.Functions.moonPhase();
      var weatherSummary = location.summary[0].toUpperCase() + location.summary.substring(1).toLowerCase() + '.';
      var weatherEmoji = (location.icon !== 'clear-night') ? weatherEmojis[location.icon] : moonPhase.emoji;
      weatherSummary = (location.icon !== 'clear-night') ? weatherSummary : weatherSummary + ' Moon phase is ' + moonPhase.phase.toLowerCase() + '.';
      var emojiClass = (location.icon === 'clear-day') ? ' sunny' : '';
      //
      tempUnit = tempUnit.toUpperCase();
      //
      locationEl.querySelector('.temperature').innerHTML = temp + '&deg;'+tempUnit;
      locationEl.querySelector('.weather').innerHTML = '<span class="feelsLike' + temperatureClass + '" title="feels like"><span class="emoji' + emojiClass + '" title="' + weatherSummary + '">' + weatherEmoji + '</span>' + tempFeelsLike + '&deg;' + tempUnit + '</span>\n<span class="rainchance' + rainChanceClass + '"><span class="emoji' + umbrellaClass + '" title="Precipitation probability in the next hour: ' + location.rainChance + '%">' + umbrellaEmoji + '</span>' + location.rainChance + '%</span>';
      //
      locationEl.classList.remove('s-loading');
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

  function _recievedWeather() {
    weatherRecievedCounter++;
    if (weatherRecievedCounter === timezones.locations.length) {
      updatingWeather = false;
      lastWeatherCheck = new Date().getTime();
    }
  }

  function _updateWeather() {
    if ((localStorage.ShowCurrentWeather === 'true' || localStorage.ShowTemperature === 'true') && !updatingWeather) {
      if (new Date().getTime() > lastWeatherCheck + 1800000) {
        updatingWeather = true;
        weatherRecievedCounter = 0;
        timezones.locations.forEach(_getWeather);
      } else {
        timezones.locations.forEach(function(location, index){
          _updateTemperatures(location, index);
        });
      }
    }
  }

  function _updateDigitalTime(override) {
    time = new Date();
    var systemH = time.getHours();
    var systemM = time.getMinutes();
    time = new Date(time.getUTCFullYear(), time.getUTCMonth(), time.getUTCDate(), time.getUTCHours(), time.getUTCMinutes(), time.getUTCSeconds());
    time = time.getTime()/1000;
    //
    if (mTemp !== systemM || override) {
      mTemp = systemM;
      timezones.locations.forEach(function(location,index){
        var locationEl = document.getElementById('location-'+index);
        var format = localStorage.DigitalFormat || '24';
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
        locationEl.querySelector('.time').innerHTML = str;
      });
    }
  }

  //
  function _updateDigitalFormat() {
    _updateDigitalTime(true);
  }

  function _hideshowWeather() {
    var showWeather = localStorage.ShowCurrentWeather || 'true';
    if (showWeather === 'false') {
      document.documentElement.classList.add('s-hide-weather');
    } else {
      document.documentElement.classList.remove('s-hide-weather');
      _updateWeather();
    }
  }

  function _hideshowTemperature() {
    var showTemperature = localStorage.ShowTemperature || 'true';
    if (showTemperature === 'false') {
      document.documentElement.classList.add('s-hide-temperature');
    } else {
      document.documentElement.classList.remove('s-hide-temperature');
      _updateWeather();
    }
  }

  function _updateTemperatureUnit() {
    timezones.locations.forEach(function(location, index){
      _updateTemperatures(location, index);
    });
  }

  function _setIntervals() {
    secondInterval = setInterval(_updateDigitalTime, 1000);
    weatherInterval = setInterval(_updateWeather, 60 * 30 * 1000);
  }

  function _handleVisibilityChange() {
    if (document.hidden) {
      clearInterval(secondInterval);
      clearInterval(weatherTimeout);
      container.innerHTML = '';
    } else {
      container.innerHTML = liHtml;
      _updateDigitalTime(true);
      _updateWeather();
      _setIntervals();
    }
  }

  function _windowLoad() {
    _hideshowWeather();
    _hideshowTemperature();
  }

  function _init() {
    //
    timezones.locations.forEach(function(location,index){
      location.id = 'location-'+index;
      location.time = '';
      location.temperature = '';
      //
      var this_locationTemplate = locationTemplate;
      this_locationTemplate = this_locationTemplate.replace('{{time}}',location.time);
      this_locationTemplate = this_locationTemplate.replace('{{name}}',location.name);
      this_locationTemplate = this_locationTemplate.replace('{{iconID}}','icon-'+index);
      this_locationTemplate = this_locationTemplate.replace('{{locationID}}',location.id);
      //
      liHtml += this_locationTemplate;
    });

    container.innerHTML = liHtml;

    _updateDigitalTime();

    _setIntervals();
  }

  this.init = function() {
    _init();

    document.addEventListener('updateDigitalFormat', _updateDigitalFormat, false);
    document.addEventListener('updateShowCurrentWeather', _hideshowWeather, false);
    document.addEventListener('updateShowTemperature', _hideshowTemperature, false);
    document.addEventListener('updateTemperatureUnit', _updateTemperatureUnit, false);
    document.addEventListener('visibilitychange', _handleVisibilityChange, false);
    window.addEventListener('load', _windowLoad, false);
  };
};
