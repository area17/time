A17.Behaviors.showHideAnimatedIconsToggler = function(container) {

  function _hideshowWeather() {
    var showWeather = A17.settings.ShowCurrentWeather || 'false';
    if (showWeather === 'false') {
      container.querySelector('input').setAttribute('disabled','disabled');
    } else {
      container.querySelector('input').removeAttribute('disabled');
    }
  }

  this.init = function() {
    _hideshowWeather();
    document.addEventListener('updateShowCurrentWeather', _hideshowWeather, false);
  };
};
