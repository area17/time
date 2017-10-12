A17.Behaviors.settings = function(container){

  var $trigger = document.querySelector('.settings-trigger');
  var $checkboxes = container.querySelectorAll('input[type=checkbox]');
  var radiosArr = ['ClockType', 'DigitalFormat','TemperatureUnit'];
  var $clockType = container.querySelector('input[type=radio][name=ClockType]');
  var $digitalFormat = container.querySelectorAll('input[type=radio][name=DigitalFormat]');
  var $temperatureUnit = container.querySelectorAll('input[type=radio][name=TemperatureUnit]');

  function _checkboxClicked(event) {
    localStorage[this.value] = this.checked;
    A17.settings[this.value] = this.checked.toString();
    A17.Helpers.triggerCustomEvent(document, 'update'+this.value);
  }

  function _showHideSettings(event) {
    event.preventDefault();
    this.blur();
    if (document.documentElement.classList.contains('s-settings-active')) {
      document.documentElement.classList.remove('s-settings-active');
    } else {
      document.documentElement.classList.add('s-settings-active');
    }
  }

  function _escapeToClose(event) {
    if (document.documentElement.classList.contains('s-settings-active') && event.keyCode === 27) {
      document.documentElement.classList.remove('s-settings-active');
    }
  }

  function _radioClicked(event) {
    localStorage[this.name] = this.value;
    A17.settings[this.name] = this.value;
    A17.Helpers.triggerCustomEvent(document, 'update'+this.name);
  }

  function _init() {
    var i, j, input;
    // check for locally stored setting
    for (i = 0; i < $checkboxes.length; i++) {
      input = $checkboxes[i];
      input.checked = (A17.settings[input.value] === 'true') ? true : false;
      $checkboxes[i].addEventListener('click', _checkboxClicked, false);
    }

    for (i = 0; i < radiosArr.length; i++) {
      var name = radiosArr[i];
      var inputs = container.querySelectorAll('input[type=radio][name='+name+']');
      container.querySelector('input[type=radio][name='+name+'][value=\''+A17.settings[name]+'\']').checked = true;
      for (j = 0; j < inputs.length; j++) {
        inputs[j].addEventListener('click', _radioClicked, false);
      }
    }
  }

  this.init = function() {
    if (!A17.screensaver) {
      _init();
      $trigger.addEventListener('click', _showHideSettings, false);
      document.addEventListener('keyup', _escapeToClose, false);
    }
  };
};
