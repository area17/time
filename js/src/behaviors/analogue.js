A17.Behaviors.analogue = function(container) {

  var minuteInterval;
  var timezonesStyleBlock = document.getElementById('animations');

  function _transformString(num) {
    return 'transform:rotate(' + num + 'deg);';
  }

  function _animationString(hand,num) {
    return '@keyframes time_' + hand + ' { from { transform: rotate(' + num + 'deg); } to { transform: rotate(' + (num + 360) + 'deg); } }\n';
  }

  function _setClock() {
    var str = '';
    var h = 0;
    var m = 0;
    var s = 0;
    var time;

    // safari seems to need this thrash, otherwise it won't animate the hands
    timezonesStyleBlock.textContent = '.m-analogue__hour, .m-analogue__minute, .m-analogue__second { animation: none; }';

    window.requestAnimationFrame(function() {
      //
      time = new Date();
      h = time.getHours();
      m = time.getMinutes();
      s = time.getSeconds();
      ms = time.getMilliseconds();
      //
      h = (h > 12) ? h - 12 : h; // 24h/12h fix
      h = 0.5 * (60 * h + m); // https://en.wikipedia.org/wiki/Clock_angle_problem
      //
      m = (m * 6) + (s / 60 * 6); // 60 minutes in 360 degrees, adjusted for how many seconds have passed
      //
      s = (s + (ms / 1000)) * 6; // 60 seconds in 360 degrees accounting for milliseconds
      //
      //
      str = _animationString('hours', h);
      str += _animationString('minutes', m);
      str += _animationString('seconds', s);
      // set
      container.querySelector('.m-analogue__hour').setAttribute('style', _transformString(h));
      container.querySelector('.m-analogue__minute').setAttribute('style', _transformString(m));
      container.querySelector('.m-analogue__second').setAttribute('style', _transformString(s));
      // update
      window.requestAnimationFrame(function() {
        timezonesStyleBlock.textContent = str;
      });
    });
  }

  function _setIntervals() {
    // updates once a minute to maintain accuracy
    minuteInterval = setInterval(_setClock, (1 * 1000));
  }

  function _handleVisibilityChange(event) {
    if (document.hidden) {
      clearInterval(minuteInterval);
      _setClock();
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
      container.querySelector('.m-analogue__hour').removeAttribute('style');
      container.querySelector('.m-analogue__minute').removeAttribute('style');
      container.querySelector('.m-analogue__second').removeAttribute('style');
      timezonesStyleBlock.textContent = '';
    }
  }

  this.init = function() {
    _init();
    document.addEventListener('updateClockType', _init, false);
    document.addEventListener('visibilitychange', _handleVisibilityChange, false);
  };
};
