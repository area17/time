timezones.Behaviors.timezones = function(container) {

  var location_html = '<li id="{{locationID}}" class="s-loading">\n<strong>{{name}}</strong>\n<em class="time">{{time}}</em>\n<span class="temperature"></span>\n<span class="weather">\n</span>\n</li>\n';
  var lis = "";
  var minutes_temp = 99; // initial value out of range
  var updating_weather = false;
  var lastWeatherCheck = 0;
  var weatherEmojis = {
    "clear-day" : "☀️",
    "clear-night" : "🌙",
    "partly-cloudy-day" : "⛅",
    "partly-cloudy-night" : "☁️",
    "cloudy" : "☁️",
    "rain" : "🌧️",
    "sleet" : "🌨️",
    "snow" : "🌨️",
    "wind" : "🌬",
    "fog" : "🌫️"
  };
  var officeOpen = 9;
  var officeClosed = 19;
  var now, hidden, visibilityChange, secondInterval, weatherTimeout, weatherRecievedCounter;

  if (typeof document.hidden !== "undefined") { // Opera 12.10 and Firefox 18 and later support
    hidden = "hidden";
    visibilityChange = "visibilitychange";
  } else if (typeof document.msHidden !== "undefined") {
    hidden = "msHidden";
    visibilityChange = "msvisibilitychange";
  } else if (typeof document.webkitHidden !== "undefined") {
    hidden = "webkitHidden";
    visibilityChange = "webkitvisibilitychange";
  }

  function updateTemperatures(location,index) {
    var locationEl = document.getElementById('location-'+index);
    var rainChanceClass = (location.rainChance > 49) ? " raining" : "";
    //
    umbrellaEmoji = (location.rainChance < 20) ? "🌂" : "☂️";
    umbrellaEmoji = (location.rainChance > 80) ? "☔" : umbrellaEmoji;
    var umbrellaClass = ((/wind/i.test(location.icon) || /wind/i.test(location.summary)) && location.rainChance > 80) ? " windy" : "";
    umbrellaEmoji = (/rain|sleet|snow/i.test(location.icon)) ? "☔" : umbrellaEmoji;
    umbrellaEmoji = (/snow/i.test(location.icon)) ? "⛄️" : umbrellaEmoji;
    //
    var temperatureClass = (location.feelsLike < 33) ? " cold" : "";
    temperatureClass = (location.feelsLike > 86) ? " hot" : temperatureClass;
    temperatureClass = (location.feelsLike > 100) ? " really-hot" : temperatureClass;
    //
    var temp_unit = localStorage["temperature_unit"] || "c";
    var temp = Math.round( (temp_unit === "c") ? timezones.Helpers.convert_f_to_c(location.temperature) : location.temperature );
    var tempFeelsLike = Math.round( (temp_unit === "c") ? timezones.Helpers.convert_f_to_c(location.feelsLike) : location.feelsLike );
    var moonphase = timezones.Helpers.moonphase();
    var weatherSummary = location.summary[0].toUpperCase() + location.summary.substring(1).toLowerCase() + ".";
    var weatherEmoji = (location.icon !== 'clear-night') ? weatherEmojis[location.icon] : moonphase.emoji;
    weatherSummary = (location.icon !== 'clear-night') ? weatherSummary : weatherSummary + " Moon phase is " + moonphase.phase.toLowerCase() + ".";
    //
    $(".temperature",locationEl).innerHTML = temp + "<sup>&deg;"+temp_unit+"</sup>";
    $(".weather",locationEl).innerHTML = "<span class=\"feelsLike"+temperatureClass+"\" title=\"feels like\"><span class=\"thermometer\" title=\""+weatherSummary+"\">"+weatherEmoji+"</span>"+tempFeelsLike+"<sup>&deg;"+temp_unit+"</sup></span>\n<span class=\"rainchance"+rainChanceClass+"\"><span class=\"umbrella"+umbrellaClass+"\" title=\"Precipitation probability in the next hour\">"+umbrellaEmoji+"</span>"+location.rainChance+"%</span>";
    locationEl.classList.remove("s-loading");
  }

  function get_weather(location,index) {
    timezones.Helpers.ajaxRequest({
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
        location.rainChance = Math.round(data.currently.precipProbability*100);
        location.summary = data.currently.summary;
        //
        updateTemperatures(location,index);
        //
        recieved_weather();
      },
      onError: function(data){
        console.log(data);
        recieved_weather();
      }
    });
  }

  function recieved_weather() {
    weatherRecievedCounter++;
    if (weatherRecievedCounter === timezones.locations.length) {
      updating_weather = false;
      lastWeatherCheck = new Date().getTime();
    }
  }

  function update_weather() {
    if ((localStorage["show_current_weather"] === "true" || localStorage["show_temperature"] === "true") && !updating_weather) {
      if (new Date().getTime() > lastWeatherCheck + 1800000) {
        updating_weather = true;
        weatherRecievedCounter = 0;
        timezones.locations.forEach(get_weather);
      } else {
        timezones.locations.forEach(function(location,index){
          updateTemperatures(location,index);
        });
      }
    }
  }

  function update_digital_time(override) {
    now = new Date();
    var hours_now = now.getHours();
    var minutes_now = now.getMinutes();
    now = new Date( now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate(), now.getUTCHours(), now.getUTCMinutes(), now.getUTCSeconds() );
    var day = now.getDay();
    now = now.getTime()/1000;
    if (minutes_now !== minutes_temp || override) {
      minutes_temp = minutes_now;
      timezones.locations.forEach(function(location,index){
        var locationEl = document.getElementById('location-'+index);
        var format = localStorage["digital_format"] || "24";
        var this_time = new Date((now+location.offset) * 1000);
        var this_hour = this_time.getHours();
        var is_current = (this_hour === hours_now);
        var is_open = (this_hour >= officeOpen && this_hour < officeClosed && day !== 0 && day !== 6);
        location.hour = this_hour;
        var this_pm = (this_hour > 12);
        this_hour = (format !== "24" && this_hour > 12) ? this_hour - 12 : this_hour;
        var this_minute = this_time.getMinutes();
        location.minute = this_minute;
        if (this_minute < 10) {
          this_minute = "0" + this_minute;
        }
        var time_str = this_hour + ":" + this_minute;
        if (format !== "24") {
          time_str = time_str + "<sup>" + (this_pm ? "pm" : "am") + "</sup>";
        }
        if (is_current) {
          locationEl.classList.add("s-current");
        } else {
          locationEl.classList.remove("s-current");
        }
        if (is_open) {
          locationEl.classList.add("s-open");
        } else {
          locationEl.classList.remove("s-open");
        }
        $(".time",locationEl).innerHTML = time_str;
      });
    }
  }

  //
  function update_digital_format() {
    update_digital_time(true);
  }

  function hideShow_weather() {
    var show_weather = localStorage["show_current_weather"] || "true";
    if (show_weather === "false") {
      document.documentElement.classList.add('s-hide-weather');
    } else {
      document.documentElement.classList.remove('s-hide-weather');
      update_weather();
    }
  }

  function hideShow_temperature() {
    var show_temperature = localStorage["show_temperature"] || "true";
    if (show_temperature === "false") {
      document.documentElement.classList.add('s-hide-temperature');
    } else {
      document.documentElement.classList.remove('s-hide-temperature');
      update_weather();
    }
  }

  function update_temperature_unit() {
    timezones.locations.forEach(function(location,index){
      updateTemperatures(location,index);
    });
  }

  function setIntervals() {
    secondInterval = setInterval(update_digital_time,1000);
    weatherInterval = setInterval(update_weather,1800000);
  }

  function handle_visibility_change() {
    if (document[hidden]) {
      clearInterval(secondInterval);
      clearInterval(weatherTimeout);
      container.innerHTML = '';
    } else {
      container.innerHTML = lis;
      update_digital_time(true);
      update_weather();
      setIntervals();
    }
  }

  function init() {
    //
    timezones.locations.forEach(function(location,index){
      location.id = "location-"+index;
      location.time = "";
      location.temperature = "";
      //
      var this_location_html = location_html;
      this_location_html = this_location_html.replace("{{time}}",location.time);
      this_location_html = this_location_html.replace("{{name}}",location.name);
      this_location_html = this_location_html.replace("{{iconID}}","icon-"+index);
      this_location_html = this_location_html.replace("{{locationID}}",location.id);
      //
      lis += this_location_html;
    });

    container.innerHTML = lis;

    update_digital_time();

    setIntervals();

    window.on("load",function(){
      hideShow_weather();
      hideShow_temperature();
    });
  }

  init();

  document.on("update_digital_format",update_digital_format);
  document.on("update_show_current_weather",hideShow_weather);
  document.on("update_show_temperature",hideShow_temperature);
  document.on("update_temperature_unit",update_temperature_unit);

  if (typeof document[hidden]) {
    document.addEventListener(visibilityChange, handle_visibility_change, false);
  }
};
