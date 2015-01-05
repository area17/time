timezones.Behaviors.timezones = function(container) {

  var location_html = '<li id="{{locationID}}" class={{current}}>\n<b>{{name}}</b>\n<div class="clock">\n<div class="hours"></div>\n<div class="minutes"></div>\n<div class="seconds"></div>\n</div>\n<div class="time">{{time}}</div>\n<div class="weather"><canvas class="icon loading" id="{{iconID}}" width="64" height="64"></canvas>\n<i></i>\n</div>\n</li>\n';
  var lis = "";
  var skycons = new Skycons({"color": "white"});
  var now = moment.utc();
  var innitted = false;
  var timezones_style_block_id = "timezones_clock_anim";

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
      location.temperature = "";
      location.icon = Skycons.CLOUDY;
      location.isCurrent = (now.tz(location.timezone).hours() === tempTimeHours) ? true : false;
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

    hideShow_analog();
    hideShow_digital();
    hideShow_weather();
    hideShow_temperature();

    update_digital_time();
    update_analogue_time();

    setInterval(function(){
      update_digital_time();
    },1000);

    setInterval(function(){
      update_analogue_time();
    },(30*60*1000));

    setTimeout(function(){
      update_weather();
      $(".icon.loading",container).removeClass("loading");
      skycons.play();
      innitted = true;
    },50);

  }();

  function update_weather() {
    timezones.locations.forEach(function(location,index){
      var forecast = new ForecastIO();
      var condition = forecast.getCurrentConditions(location.lat, location.long);
      location.temperature = condition.getTemperature();
      location.icon = condition.getIcon();
      //
      var temp_unit = localStorage["temperature_unit"] || "c";
      var temp = Math.round( (temp_unit === "c") ? timezones.Helpers.convert_f_to_c(location.temperature) : location.temperature );
      //
      $("#location-"+index+" i",container).innerHTML = temp + "<span>&deg;"+temp_unit+"</span>";
      //
      if (innitted) {
        skycons.set("icon-"+index, location.icon);
      } else {
        skycons.add("icon-"+index, location.icon);
      }
    });
    setTimeout(function(){
      update_weather();
    },(30*60*1000));
  }

  function update_digital_time() {
    now = moment.utc();
    timezones.locations.forEach(function(location,index){
      location.time = now.tz(location.timezone);
      var format = localStorage["digital_format"] || "24";
      var time_str = (format === "24") ? location.time.format("HH:mm") : location.time.format("h:mm") + "<span>" + location.time.format("a") + "<span>"
      $("#location-"+index+" .time",container).innerHTML = time_str;
    });
  }

  function update_analogue_time(){
    timezones.locations.forEach(function(location,index){
      var this_timezone = now.tz(location.timezone);
      var second = now.seconds() * 6;
      var minute = this_timezone.minutes() * 6 + second / 60;
      var hour = this_timezone.hours();
      hour = (hour > 12) ? hour - 12 : hour;
      hour = (hour * 30) + (minute / 12);
      //
      $("#location-"+index+" .hours",container).css("-webkit-transform", "rotate(" + hour + "deg)").css("transform", "rotate(" + hour + "deg)");
      $("#location-"+index+" .minutes",container).css("-webkit-transform", "rotate(" + minute + "deg)").css("transform", "rotate(" + minute + "deg)");
      $("#location-"+index+" .seconds",container).css("-webkit-transform", "rotate(" + second + "deg)").css("transform", "rotate(" + second + "deg)");
      //
      var css_anims = "@-webkit-keyframes time_hours { to { -webkit-transform: rotate(" + (hour+360) + "deg); } }\n@keyframes time_hours { to { transform: rotate(" + (hour+360) + "deg); } }\n";
      css_anims += "@-webkit-keyframes time_minutes { to { -webkit-transform: rotate(" + (minute+360) + "deg); } }\n@keyframes time_minutes { to { transform: rotate(" + (minute+360) + "deg); } }\n";
      css_anims += "@-webkit-keyframes time_seconds { to { -webkit-transform: rotate(" + (second+360) + "deg); } }\n@keyframes time_seconds { to { transform: rotate(" + (second+360) + "deg); } }\n";
       $("#"+timezones_style_block_id).textContent = css_anims;
    });
  }

  //
  function hideShow_analog() {
    var show_analog = localStorage["show_analog"] || "true";
    if (show_analog === "false") {
      container.addClass("hide_analog");
    } else {
      container.removeClass("hide_analog");
      update_analogue_time();
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
    update_digital_time();
  }
  function hideShow_weather() {
    var show_weather = localStorage["show_current_weather"] || "true";
    if (show_weather === "false") {
      container.addClass("hide_weather");
    } else {
      container.removeClass("hide_weather");
    }
  }
  function hideShow_temperature() {
    var show_temperature = localStorage["show_temperature"] || "true";
    if (show_temperature === "false") {
      container.addClass("hide_temperature");
    } else {
      container.removeClass("hide_temperature");
    }
  }
  function update_temperature_unit() {
    timezones.locations.forEach(function(location,index){
      var temp_unit = localStorage["temperature_unit"] || "c";
      var temp = Math.round( (temp_unit=== "c") ? timezones.Helpers.convert_f_to_c(location.temperature) : location.temperature );
      $("#location-"+index+" i",container).innerHTML = temp + "<span>&deg;"+temp_unit+"</span>";
    });
  }

  document.on("update_show_analog",hideShow_analog);
  document.on("update_show_digital",hideShow_digital);
  document.on("update_digital_format",update_digital_format);
  document.on("update_show_current_weather",hideShow_weather);
  document.on("update_show_temperature",hideShow_temperature);
  document.on("update_temperature_unit",update_temperature_unit);
};