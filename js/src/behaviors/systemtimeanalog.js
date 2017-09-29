timezones.Behaviors.systemtimeanalog = function(container) {

  var timezones_style_block_id = "timezones_clock_anim";
  var now, hidden, visibilityChange;

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

  function update_analogue_time(){
    now = new Date();
    var seconds_now = new Date().getSeconds() * 6;
    now = new Date( now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate(), now.getUTCHours(), now.getUTCMinutes(), now.getUTCSeconds() );
    now = now.getTime()/1000;
    //
    var this_time = new Date((now) * 1000);
    var this_hour = this_time.getHours();
    var this_minute = this_time.getMinutes();
    var this_second = this_time.getSeconds();
    //
    this_minute = this_minute * 6 + this_second / 60;
    //
    this_hour = (this_hour > 12) ? this_hour - 12 : this_hour;
    this_hour = (this_hour * 30) + (this_minute / 12);
    this_hour = (this_hour >= 360) ? this_hour - 360 : this_hour;
    //
    var css_anims = "@-webkit-keyframes time_seconds { to { -webkit-transform: rotate(" + (this_second+360) + "deg); } }\n@keyframes time_seconds { to { transform: rotate(" + (this_second+360) + "deg); } }\n";
    //
    $(".systemtime-analog__hour",container).css("-webkit-transform", "rotate(" + this_hour + "deg)").css("transform", "rotate(" + this_hour + "deg)");
    $(".systemtime-analog__minute",container).css("-webkit-transform", "rotate(" + this_minute + "deg)").css("transform", "rotate(" + this_minute + "deg)");
    $(".systemtime-analog__second",container).css("-webkit-transform", "rotate(" + this_second + "deg)").css("transform", "rotate(" + this_second + "deg)");
    //
    css_anims += "@-webkit-keyframes time_hours { to { -webkit-transform: rotate(" + (this_hour+360) + "deg); } }\n@keyframes time_hours { to { transform: rotate(" + (this_hour+360) + "deg); } }\n";
    css_anims += "@-webkit-keyframes time_minutes { to { -webkit-transform: rotate(" + (this_minute+360) + "deg); } }\n@keyframes time_minutes { to { transform: rotate(" + (this_minute+360) + "deg); } }\n";

    document.getElementById(timezones_style_block_id).textContent = css_anims;
  }

  function handle_visibility_change() {
    if (document[hidden]) {
      document.getElementById(timezones_style_block_id).textContent = '';
    } else {
      update_analogue_time();
    }
  }

  function init() {
    var timezones_style_block = document.createElement("style");
    timezones_style_block.id = timezones_style_block_id;
    $("head").appendChild(timezones_style_block);
    //
    if (localStorage['clock_type'] === 'analog') {
      document.documentElement.classList.add('s-analog');
      update_analogue_time();
    } else {
      document.documentElement.classList.remove('s-analog');
    }
  }

  document.on("update_clock_type",init);

  init();

  if (typeof document[hidden]) {
    document.on(visibilityChange, handle_visibility_change);
  }
};
