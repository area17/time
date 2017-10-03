timezones.Behaviors.analogue = function(container) {

  var timezonesStyleBlock, minuteInterval;
  var hourHand = container.querySelector('.systemtime-analogue__hour');
  var minuteHand = container.querySelector('.systemtime-analogue__minute');
  var secondHand = container.querySelector('.systemtime-analogue__second');

  function transformString(num) {
    return '-webkit-transform:rotate(' + num + 'deg);transform:rotate(' + num + 'deg);';
  }

  function animationString(hand,num) {
    return '@-webkit-keyframes time_' + hand + ' { from { -webkit-transform: rotate(' + num + 'deg); } to { -webkit-transform: rotate(' + (num + 360) + 'deg); } }\n@keyframes time_' + hand + ' { from { transform: rotate(' + num + 'deg); } to { transform: rotate(' + (num + 360) + 'deg); } }\n';
  }

  function setClock(reset) {
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
      str = animationString('hours', h);
      str += animationString('minutes', m);
      str += animationString('seconds', s);
    }
    // reset
    timezonesStyleBlock.textContent = '';
    // position hands to new location
    window.requestAnimationFrame(function(){
      hourHand.setAttribute('style', transformString(h));
      minuteHand.setAttribute('style', transformString(m));
      secondHand.setAttribute('style', transformString(s));
      // start animating
      window.requestAnimationFrame(function(){
        timezonesStyleBlock.textContent = str;
      });
    });
  }

  function setIntervals() {
    // updates once a minute to maintain accuracy
    minuteInterval = setInterval(setClock, (60 * 1000));
  }

  function handleVisibilityChange(event) {
    if (document.hidden) {
      clearInterval(minuteInterval);
      setClock(false, false, false);
    } else {
      setClock();
      setIntervals();
    }
  }

  function init() {
    timezonesStyleBlock = document.createElement('style');
    document.head.appendChild(timezonesStyleBlock);
    //
    if (localStorage.ClockType === 'analogue') {
      document.documentElement.classList.add('s-analogue');
      setClock();
      setIntervals();
    } else {
      document.documentElement.classList.remove('s-analogue');
      clearInterval(minuteInterval);
      setClock(true);
    }
  }

  init();

  document.addEventListener('updateClockType', init, false);
  document.addEventListener('visibilitychange', handleVisibilityChange, false);
};
