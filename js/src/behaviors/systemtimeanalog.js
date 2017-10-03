timezones.Behaviors.systemtimeanalog = function(container) {

  var timezones_style_block_id = "timezones_clock_anim";
  var minuteInterval, now, hidden, visibilityChange;

  function setClock(h,m,s) {
    var str = '';
    if (h && m && s) {
      s = s * 6; // 60 seconds in 360 degrees
      //
      m = m * 6; // 60 minutes in 360 degrees
      m = m + (s / 60); // adjust for how many seconds have passed
      //
      h = (h > 12) ? h - 12 : h; // 24h/12h fix
      h = (h * 30); // 12 hours in 360 degrees plus
      h = h + (m / 60); // adjust for how many minutes have passed
      //
      // lets start at less than 360deg
      m = (m >= 360) ? m - 360 : m;
      h = (h >= 360) ? h - 360 : h;
      //
      str = "@-webkit-keyframes time_seconds { to { -webkit-transform: rotate(" + (s+360) + "deg); } }\n@keyframes time_seconds { to { transform: rotate(" + (s+360) + "deg); } }\n";
      str += "@-webkit-keyframes time_hours { to { -webkit-transform: rotate(" + (h+360) + "deg); } }\n@keyframes time_hours { to { transform: rotate(" + (h+360) + "deg); } }\n";
      str += "@-webkit-keyframes time_minutes { to { -webkit-transform: rotate(" + (m+360) + "deg); } }\n@keyframes time_minutes { to { transform: rotate(" + (m+360) + "deg); } }\n";
    } else {
      h = 0;
      m = 0;
      s = 0;
    }
    $(".systemtime-analog__hour",container).css("-webkit-transform", "rotate(" + h + "deg)").css("transform", "rotate(" + h + "deg)");
    $(".systemtime-analog__minute",container).css("-webkit-transform", "rotate(" + m + "deg)").css("transform", "rotate(" + m + "deg)");
    $(".systemtime-analog__second",container).css("-webkit-transform", "rotate(" + s + "deg)").css("transform", "rotate(" + s + "deg)");
    //
    document.getElementById(timezones_style_block_id).textContent = str;
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
    setClock(this_hour, this_minute, this_second);
  }

  function setIntervals() {
    minuteInterval = setInterval(update_analogue_time,60000);
  }

  function handle_visibility_change(event) {
    if (document.hidden) {
      clearInterval(minuteInterval);
       setClock(false, false, false);
    } else {
      update_analogue_time();
      setIntervals();
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
      setIntervals();
    } else {
      document.documentElement.classList.remove('s-analog');
    }
  }

  init();

  document.addEventListener("update_clock_type",init, false);
  document.addEventListener("visibilitychange", handle_visibility_change, false);
};
