A17.Behaviors.analogue = function(container) {

  var minuteInterval;
  var timezonesStyleBlock = document.getElementById('animations');

  function _transformString(num) {
    return '-webkit-transform:rotate(' + num + 'deg);transform:rotate(' + num + 'deg);';
  }

  function _animationString(hand,num) {
    return '@-webkit-keyframes time_' + hand + ' { from { -webkit-transform: rotate(' + num + 'deg); } to { -webkit-transform: rotate(' + (num + 360) + 'deg); } }\n@keyframes time_' + hand + ' { from { transform: rotate(' + num + 'deg); } to { transform: rotate(' + (num + 360) + 'deg); } }\n';
  }

  function _setClock(reset) {
    var str = '';
    var h = 0;
    var m = 0;
    var s = 0;
    var time;
    //
    if (!reset) {
      time = new Date();
      h = time.getHours();
      m = time.getMinutes();
      s = time.getSeconds();
      //
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
      str = _animationString('hours', h);
      str += _animationString('minutes', m);
      str += _animationString('seconds', s);
    }
    // set
    container.querySelector('.m-analogue__hour').setAttribute('style', _transformString(h));
    container.querySelector('.m-analogue__minute').setAttribute('style', _transformString(m));
    container.querySelector('.m-analogue__second').setAttribute('style', _transformString(s));
    timezonesStyleBlock.textContent = str;
  }

  function _setIntervals() {
    // updates once a minute to maintain accuracy
    minuteInterval = setInterval(_setClock, (60 * 1000));
  }

  function _handleVisibilityChange(event) {
    if (document.hidden) {
      clearInterval(minuteInterval);
      _setClock(false, false, false);
    } else {
      _setClock();
      _setIntervals();
    }
  }

  function _init() {
    if (A17.settings.ClockType === 'analogue') {
      document.documentElement.classList.add('s-analogue');
      _setClock();
      _setIntervals();
    } else {
      document.documentElement.classList.remove('s-analogue');
      clearInterval(minuteInterval);
      _setClock(true);
    }
  }

  this.init = function() {
    _init();
    document.addEventListener('updateClockType', _init, false);
    document.addEventListener('visibilitychange', _handleVisibilityChange, false);
  };
};
