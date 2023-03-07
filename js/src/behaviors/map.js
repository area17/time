A17.Behaviors.map = function(container) {

  function _init() {
    if (A17.settings.ClockType === 'map') {
      document.documentElement.classList.add('s-map');
    } else {
      document.documentElement.classList.remove('s-map');
    }
  }

  this.init = function() {
    _init();

    document.addEventListener('updateClockType', _init, false);
  };
};
