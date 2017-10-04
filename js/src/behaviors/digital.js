A17.Behaviors.digital = function(container) {

  var minutes_temp = 99;
  var secondInterval, str;

  function _updateDigitalTime(override) {
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
      newStr = newStr + ' <sup>' + (pm ? 'PM' : 'AM') + '</sup>';
    }
    //
    if(format === '24') {
      container.classList.add('m-digital--24');
    } else {
      container.classList.remove('m-digital--24');
    }
    //
    if (str !== newStr) {
      str = newStr;
      container.innerHTML = str;
    }
  }

  function _updateDigitalFormat() {
    _updateDigitalTime(true);
  }

  function _setIntervals() {
    secondInterval = setInterval(_updateDigitalTime, 1000);
  }

  function _handleVisibilityChange() {
    if (document.hidden) {
      clearInterval(secondInterval);
      container.innerHTML = '';
    } else {
      _updateDigitalTime(true);
      _setIntervals();
    }
  }


  function _init() {
    if (localStorage.ClockType === 'digital') {
      document.documentElement.classList.add('s-digital');
      _updateDigitalTime();
      _setIntervals();
    } else {
      document.documentElement.classList.remove('s-digital');
      clearInterval(secondInterval);
      container.innerHTML = '';
    }
  }

  this.init = function() {
    _init();

    document.addEventListener('updateDigitalFormat', _updateDigitalFormat, false);
    document.addEventListener('updateClockType', _init, false);
    document.addEventListener('visibilitychange', _handleVisibilityChange, false);
  };
};
