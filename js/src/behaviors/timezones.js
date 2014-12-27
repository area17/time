timezones.Behaviors.timezones = function(container) {

  var location_html = '<li id="{{locationID}}">\n<b>{{name}}</b>\n<div class="time">{{time}}</div>\n<div class="weather"><canvas class="icon loading" id="{{iconID}}" width="64" height="64"></canvas>\n<i>{{temp}} <span>&deg;{{unit}}</span></i>\n</div>\n</li>\n';
  var lis = "";
  var skycons = new Skycons({"color": "white"});
  var now = moment.utc();

  timezones.locations.forEach(function(location,index){
    location.id = "location-"+index;
    location.time = now.tz(location.timezone).format("HH:mm");
    location.temperature = "-";
    location.icon = Skycons.CLOUDY;
    location.unit = timezones.units_current.unit;

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

  timezones.locations.forEach(function(location,index){
    var forecast = new ForecastIO();
    var condition = forecast.getCurrentConditions(location.lat, location.long);
    location.temperature = Math.round( convert_f_to_c( condition.getTemperature() ) );
    location.time = condition.getTime("HH:mm");
    location.icon = condition.getIcon();
    //
    $("#location-"+index+" .time",container).textContent = location.time;
    $("#location-"+index+" i",container).innerHTML = location.temperature + "<span>&deg;"+location.unit+"</span>";
    //
    skycons.add("icon-"+index, location.icon);
  });

  $(".icon.loading",container).removeClass("loading");
  skycons.play();

  setInterval(function(){
    now = moment.utc();
    timezones.locations.forEach(function(location,index){
      location.time = now.tz(location.timezone).format("HH:mm");
      $("#location-"+index+" .time",container).textContent = location.time;
    });
  },1000);

  function convert_f_to_c(f){
    return (f - 32)*(5/9);
  }
};