timezones.Behaviors.timezones = function(container) {

  var location_html = '<li id="{{locationID}}">\n<b>{{name}}</b>\n<div class="clock">\n<div class="hours"></div>\n<div class="minutes"></div>\n<div class="seconds"></div>\n</div>\n<div class="time">{{time}}</div>\n<div class="weather"><canvas class="icon loading" id="{{iconID}}" width="64" height="64"></canvas>\n<i>{{temp}} <span>&deg;{{unit}}</span></i>\n</div>\n</li>\n';
  var lis = "";
  var skycons = new Skycons({"color": "white"});
  var now = moment.utc();
  var innitted = false;
  var timezones_style_block_id = "timezones_clock_anim";

  var init = function() {
    var timezones_style_block = document.createElement("style");
    timezones_style_block.id = timezones_style_block_id;
    $("head").appendChild(timezones_style_block);

    timezones.locations.forEach(function(location,index){
      location.id = "location-"+index;
      location.time = now.tz(location.timezone).format("HH:mm");
      location.temperature = "-";
      location.icon = Skycons.CLOUDY;
      location.unit = localStorage.getItem("temperature_unit") || "C";

      var this_location_html = location_html;
      this_location_html = this_location_html.replace("{{time}}",location.time);
      this_location_html = this_location_html.replace("{{name}}",location.name);
      this_location_html = this_location_html.replace("{{temp}}",location.temperature);
      this_location_html = this_location_html.replace("{{unit}}",location.unit);
      this_location_html = this_location_html.replace("{{iconID}}","icon-"+index);
      this_location_html = this_location_html.replace("{{locationID}}",location.id);
      //
      lis += this_location_html;
    });

    container.innerHTML = lis;

    update_digital_time();
    update_analogue_time();

    setInterval(function(){
      update_digital_time();
    },1000);

    setInterval(function(){
      update_analogue_time();
    },(30*60*1000));

    setTimeout(function(){
      //update_weather();
      $(".icon.loading",container).removeClass("loading");
      skycons.play();
      innitted = true;
    },50);

  }();

  function update_weather() {
    timezones.locations.forEach(function(location,index){
      var forecast = new ForecastIO();
      var condition = forecast.getCurrentConditions(location.lat, location.long);
      location.temperature = Math.round( timezones.Helpers.convert_f_to_c( condition.getTemperature() ) );
      location.time = condition.getTime("HH:mm");
      location.icon = condition.getIcon();
      //
      $("#location-"+index+" .time",container).textContent = location.time;
      $("#location-"+index+" i",container).innerHTML = location.temperature + "<span>&deg;"+location.unit+"</span>";
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
    timezones.locations.forEach(function(location,index){
      location.time = now.tz(location.timezone).format("HH:mm");
      $("#location-"+index+" .time",container).textContent = location.time;
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
      $("#location-"+index+" .hours",container).css("transform", "rotate(" + hour + "deg)");
      $("#location-"+index+" .minutes",container).css("transform", "rotate(" + minute + "deg)");
      $("#location-"+index+" .seconds",container).css("transform", "rotate(" + second + "deg)");
      //
      var css_anims = "@-webkit-keyframes time_hours { to { transform: rotate(" + (hour+360) + "deg); } }\n@keyframes time_hours { transform: rotate(" + (hour+360) + "deg); }\n";
      css_anims += "@-webkit-keyframes time_minutes { to { transform: rotate(" + (minute+360) + "deg); } }\n@keyframes time_minutes { transform: rotate(" + (minute+360) + "deg); }\n";
      css_anims += "@-webkit-keyframes time_seconds { to { transform: rotate(" + (second+360) + "deg); } }\n@keyframes time_seconds { transform: rotate(" + (second+360) + "deg); }\n";
       $("#"+timezones_style_block_id).textContent = css_anims;
    });
  }
};