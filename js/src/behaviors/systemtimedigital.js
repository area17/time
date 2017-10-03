timezones.Behaviors.digital = function(container) {

  var minutes_temp = 99;
  var secondInterval, str;

  function updateDigitalTime(override) {
    var format = localStorage.DigitalFormat || '24';
    var time = new Date();
    var h = time.getHours();
    var m = time.getMinutes();
    var s = time.getSeconds();
    var pm = (h > 12);
    //
    h = (format !== '24' && h > 12) ? h - 12 : h;
    if (m < 10) {
      m = '0' + m;
    }
    if (s < 10) {
      s = '0' + s;
    }
    //
    var newStr = h + ':' + m + ':' + s;
    if (format !== '24') {
      newStr = newStr + '<sup>' + (pm ? 'PM' : 'AM') + '</sup>';
    }
    //
    if (str !== newStr) {
      str = newStr;
      container.innerHTML = str;
    }
  }

  function update_digitalFormat() {
    updateDigitalTime(true);
  }

  function setIntervals() {
    secondInterval = setInterval(updateDigitalTime, 1000);
  }

  function handle_visibility_change() {
    if (document.hidden) {
      clearInterval(secondInterval);
      container.innerHTML = '';
    } else {
      updateDigitalTime(true);
      setIntervals();
    }
  }


  function init() {
    if (localStorage.ClockType === 'digital') {
      document.documentElement.classList.add('s-digital');
      updateDigitalTime();
      setIntervals();
    } else {
      document.documentElement.classList.remove('s-digital');
      clearInterval(secondInterval);
      container.innerHTML = '';
    }
  }

  init();

  document.addEventListener('updateDigitalFormat',update_digitalFormat, false);
  document.addEventListener('updateClockType',init, false);
  document.addEventListener('visibilitychange', handle_visibility_change, false);
};
