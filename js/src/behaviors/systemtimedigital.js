timezones.Behaviors.systemtimedigital = function(container) {

  var minutes_temp = 99;
  var secondInterval, now, hidden, visibilityChange, time_str;

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

  function update_digital_time(override) {
    now = new Date();
    var hours_now = now.getHours();
    var minutes_now = now.getMinutes();
    now = new Date( now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate(), now.getUTCHours(), now.getUTCMinutes(), now.getUTCSeconds() );
    now = now.getTime()/1000;

    var format = localStorage["digital_format"] || "24";
    var this_time = new Date((now) * 1000);
    var this_hour = this_time.getHours();
    var this_minute = this_time.getMinutes();
    var this_second = this_time.getSeconds();
    var this_pm = (this_hour > 12);
    //
    this_hour = (format !== "24" && this_hour > 12) ? this_hour - 12 : this_hour;
    if (this_minute < 10) {
      this_minute = "0" + this_minute;
    }
    if (this_second < 10) {
      this_second = "0" + this_second;
    }
    //
    var new_time_str = this_hour + ":" + this_minute + ":" + this_second;
    if (format !== "24") {
      new_time_str = new_time_str + "<sup>" + (this_pm ? "PM" : "AM") + "</sup>";
    }
    //
    if (time_str !== new_time_str) {
      time_str = new_time_str;
      container.innerHTML = time_str;
    }
  }

  function update_digital_format() {
    update_digital_time(true);
  }

  function setIntervals() {
    secondInterval = setInterval(update_digital_time,1000);
  }

  function handle_visibility_change() {
    if (document[hidden]) {
      clearInterval(secondInterval);
      container.innerHTML = '';
    } else {
      update_digital_time(true);
      setIntervals();
    }
  }


  function init() {
    if (localStorage['clock_type'] === 'digital') {
      document.documentElement.classList.add('s-digital');
      update_digital_time();
      setIntervals();
    } else {
      document.documentElement.classList.remove('s-digital');
      clearInterval(secondInterval);
      container.innerHTML = '';
    }
  }

  document.on("update_digital_format",update_digital_format);
  document.on("update_clock_type",init);

  init();

  if (typeof document[hidden]) {
    document.addEventListener(visibilityChange, handle_visibility_change, false);
  }
};
