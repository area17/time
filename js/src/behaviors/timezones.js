timezones.Behaviors.timezones = function(container) {

  var location_html = '<li id="{{locationID}}" class={{current}}>\n<div class="clock">\n<div class="hours"></div>\n<div class="minutes"></div>\n<div class="seconds"></div>\n</div>\n<b>{{name}}</b>\n<div class="time">{{time}}</div>\n<div class="weather js-loading"><canvas class="icon" id="{{iconID}}" width="32" height="32"></canvas>\n<i></i>\n</div>\n</li>\n';
  var lis = "";
  var skycons = new Skycons({"color": "#111111"});
  var now = new Date().getTime()/1000;
  var innitted = false;
  var timezones_style_block_id = "timezones_clock_anim";
  var minutes_temp = 99; // initial value out of range
  var updating_weather = false;
  var lastWeatherCheck = 0;
  var hidden, visibilityChange, secondInterval, hourInterval, weatherTimeout, weatherRecievedCounter;

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

  var init = function() {
    var timezones_style_block = document.createElement("style");
    timezones_style_block.id = timezones_style_block_id;
    $("head").appendChild(timezones_style_block);
    //
    var tempTimeHours = new Date();
    tempTimeHours = tempTimeHours.getHours();
    //
    timezones.locations.forEach(function(location,index){
      location.id = "location-"+index;
      location.time = "";
      location.temperature = "65";
      location.icon = Skycons.CLOUDY;
      location.isCurrent = (location.offset === 0);
      //
      var this_location_html = location_html;
      this_location_html = this_location_html.replace("{{time}}",location.time);
      this_location_html = this_location_html.replace("{{name}}",location.name);
      this_location_html = this_location_html.replace("{{current}}",(location.isCurrent) ? "current" : "");
      this_location_html = this_location_html.replace("{{iconID}}","icon-"+index);
      this_location_html = this_location_html.replace("{{locationID}}",location.id);
      //
      lis += this_location_html;
    });

    container.innerHTML = lis;

    update_digital_time();
    update_analogue_time();

    hideShow_analog();
    hideShow_digital();

    setIntervals();

    window.on("load",function(){
      hideShow_weather();
      hideShow_temperature();
    });

  }();

  function updateTemperatures(location,index) {
    var rainChanceClass = (location.rainChance > 49) ? " raining" : "";
    //
    umbrellaEmoji = (location.rainChance < 20) ? "🌂" : "☂️";
    umbrellaEmoji = (location.rainChance > 80) ? "☔" : umbrellaEmoji;
    var umbrellaClass = ((/wind/i.test(location.icon) || /wind/i.test(location.summary)) && location.rainChance > 80) ? " windy" : "";
    umbrellaEmoji = (/rain|sleet|snow/i.test(location.icon)) ? "☔" : umbrellaEmoji;
    //
    var temperatureClass = (location.feelsLike < 33) ? " cold" : "";
    temperatureClass = (location.feelsLike > 86) ? " hot" : temperatureClass;
    temperatureClass = (location.feelsLike > 100) ? " really-hot" : temperatureClass;
    //
    var temp_unit = localStorage["temperature_unit"] || "c";
    var temp = Math.round( (temp_unit === "c") ? timezones.Helpers.convert_f_to_c(location.temperature) : location.temperature );
    var tempFeelsLike = Math.round( (temp_unit === "c") ? timezones.Helpers.convert_f_to_c(location.feelsLike) : location.feelsLike );
    //
    $("#location-"+index+" i",container).innerHTML = "<span class=\"temperature"+temperatureClass+"\">"+ temp + "<sup>&deg;"+temp_unit+"</sup></span> &bull; <span class=\"feelsLike"+temperatureClass+"\" title=\"feels like\">"+tempFeelsLike+"<sup>&deg;"+temp_unit+"</sup></span><span class=\"rainchance"+rainChanceClass+"\"><br><span class=\"umbrella"+umbrellaClass+"\">"+umbrellaEmoji+"</span> "+location.rainChance+"%</span>";
    $("#location-"+index+" .weather.js-loading").removeClass("js-loading");
  }

  function get_weather(location,index) {
    timezones.Helpers.ajaxRequest({
      url: '/proxy.php',
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
        if (innitted) {
          skycons.set("icon-"+index, location.icon);
        } else {
          skycons.add("icon-"+index, location.icon);
          innitted = true;
        }
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
      skycons.play();
      updating_weather = false;
      lastWeatherCheck = new Date().getTime();
    }
  }

  function update_weather() {
    if ((localStorage["show_current_weather"] === "true" || localStorage["show_temperature"] === "true") && !updating_weather && new Date().getTime() > lastWeatherCheck + 1800000) {
      updating_weather = true;
      weatherRecievedCounter = 0;
      timezones.locations.forEach(get_weather);
    }
  }

  function update_digital_time(override) {
    now = new Date();
    var minutes_now = now.getMinutes();
    now = now.getTime()/1000;
    if (minutes_now !== minutes_temp || override) {
      minutes_temp = minutes_now;
      timezones.locations.forEach(function(location,index){
        var format = localStorage["digital_format"] || "24";
        var this_time = new Date((now+location.offset) * 1000);
        var this_hour = this_time.getHours();
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
        $("#location-"+index+" .time",container).innerHTML = time_str;
      });
    }
  }

  function update_analogue_time(){
    now = new Date();
    var seconds_now = new Date().getSeconds() * 6;
    now = now.getTime()/1000;
    //
    var css_anims = "@-webkit-keyframes time_seconds { to { -webkit-transform: rotate(" + (seconds_now+360) + "deg); } }\n@keyframes time_seconds { to { transform: rotate(" + (seconds_now+360) + "deg); } }\n";
    //
    timezones.locations.forEach(function(location,index){
      var hour = location.hour;
      var minute = location.minute * 6 + seconds_now / 60;
      //
      hour = (hour > 12) ? hour - 12 : hour;
      hour = (hour * 30) + (minute / 12);
      hour = (hour >= 360) ? hour - 360 : hour;
      //
      $("#location-"+index+" .hours",container).css("-webkit-transform", "rotate(" + hour + "deg)").css("transform", "rotate(" + hour + "deg)");
      $("#location-"+index+" .minutes",container).css("-webkit-transform", "rotate(" + minute + "deg)").css("transform", "rotate(" + minute + "deg)");
      $("#location-"+index+" .seconds",container).css("-webkit-transform", "rotate(" + seconds_now + "deg)").css("transform", "rotate(" + seconds_now + "deg)");
      //
      css_anims += "@-webkit-keyframes time_hours_"+(index+1)+" { to { -webkit-transform: rotate(" + (hour+360) + "deg); } }\n@keyframes time_hours_"+(index+1)+" { to { transform: rotate(" + (hour+360) + "deg); } }\n";
      css_anims += "@-webkit-keyframes time_minutes_"+(index+1)+" { to { -webkit-transform: rotate(" + (minute+360) + "deg); } }\n@keyframes time_minutes_"+(index+1)+" { to { transform: rotate(" + (minute+360) + "deg); } }\n";
    });

    $("#"+timezones_style_block_id).textContent = css_anims;
  }

  //
  function hideShow_analog() {
    var show_analog = localStorage["show_analog"] || "true";
    if (show_analog === "false") {
      container.addClass("hide_analog");
    } else {
      container.removeClass("hide_analog");
    }
  }
  function hideShow_digital() {
    var show_digital = localStorage["show_digital"] || "true";
    if (show_digital === "false") {
      container.addClass("hide_digital");
    } else {
      container.removeClass("hide_digital");
    }
  }
  function update_digital_format() {
    update_digital_time(true);
  }
  function hideShow_weather() {
    var show_weather = localStorage["show_current_weather"] || "true";
    if (show_weather === "false") {
      container.addClass("hide_weather");
    } else {
      container.removeClass("hide_weather");
      update_weather();
    }
  }
  function hideShow_temperature() {
    var show_temperature = localStorage["show_temperature"] || "true";
    if (show_temperature === "false") {
      container.addClass("hide_temperature");
    } else {
      container.removeClass("hide_temperature");
      update_weather();
    }
  }
  function hideShow_rainchance() {
    var show_temperature = localStorage["show_rainchance"] || "true";
    if (show_temperature === "false") {
      container.addClass("hide_rainchance");
    } else {
      container.removeClass("hide_rainchance");
    }
  }
  function update_temperature_unit() {
    timezones.locations.forEach(function(location,index){
      updateTemperatures(location,index);
    });
  }
  function setIntervals() {
    secondInterval = setInterval(update_digital_time,1000);
    hourInterval = setInterval(update_analogue_time,3600000);
    weatherInterval = setInterval(update_weather,1800000);
  }
  function handle_visibility_change() {
    if (document[hidden]) {
      skycons.pause();
      //clearInterval(secondInterval);
      //clearInterval(hourInterval);
      //clearInterval(weatherTimeout);
    } else {
      //update_digital_time(true);
      //update_analogue_time();
      //setIntervals();
      skycons.play();
    }
  }

  document.on("update_show_analog",hideShow_analog);
  document.on("update_show_digital",hideShow_digital);
  document.on("update_digital_format",update_digital_format);
  document.on("update_show_current_weather",hideShow_weather);
  document.on("update_show_temperature",hideShow_temperature);
  document.on("update_show_rainchance",hideShow_rainchance);
  document.on("update_temperature_unit",update_temperature_unit);

  if (typeof document[hidden]) {
    document.on(visibilityChange, handle_visibility_change);
  }
};
