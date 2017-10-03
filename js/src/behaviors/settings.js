A17.Behaviors.settings = function(container){

  var $settings = document.getElementById('settings');
  var $checkboxes = $settings.querySelectorAll('input[type=checkbox]');
  var radiosArr = ['ClockType', 'DigitalFormat','TemperatureUnit'];
  var $clockType = $settings.querySelector('input[type=radio][name=ClockType]');
  var $digitalFormat = $settings.querySelectorAll('input[type=radio][name=DigitalFormat]');
  var $temperature_unit = $settings.querySelectorAll('input[type=radio][name=TemperatureUnit]');

  function _checkboxClicked(event) {
    localStorage[this.value] = this.checked;
    this.parentNode.className = this.checked ? 'checked' : '';
    A17.Helpers.triggerCustomEvent(document, 'update'+this.value);
  }

  function _showHideSettings(event) {
    event.preventDefault();
    if ($settings.classList.contains('s-active')) {
      $settings.classList.remove('s-active');
    } else {
      $settings.classList.add('s-active');
    }
  }

  function _escapeToClose(event) {
    if ($settings.classList.contains('s-active') && event.keyCode == 27) {
      $settings.classList.remove('s-active');
    }
  }

  function _radioClicked(event) {
    localStorage[this.name] = this.value;
    A17.Helpers.triggerCustomEvent(document, 'update'+this.name);
  }

  function _init() {
    var i, j, value;
    // check for locally stored setting
    for (i = 0; i < $checkboxes.length; i++) {
      input = $checkboxes[i];
      if (localStorage[input.value] === undefined) {
        localStorage[input.value] = input.checked;
      } else {
        input.checked = (localStorage[input.value] == 'true') ? true : false;
        input.parentNode.className = input.checked ? 's-active' : '';
      }
      $checkboxes[i].addEventListener('click', _checkboxClicked, false);
    }

    for (i = 0; i < radiosArr.length; i++) {
      var name = radiosArr[i];
      var inputs = $settings.querySelectorAll('input[type=radio][name='+name+']');
      var checkedInput = (inputs[0].checked) ? inputs[0] : inputs[1];
      if (localStorage[checkedInput.name] === undefined) {
        localStorage[checkedInput.name] = checkedInput.value;
      } else {
        $settings.querySelector('input[type=radio][name='+name+'][value=\''+localStorage[checkedInput.name]+'\']').checked = true;
      }
      for (j = 0; j < inputs.length; j++) {
        inputs[j].addEventListener('click', _radioClicked, false);
      }
    }
  }

  this.init = function() {
    _init();
    container.addEventListener('click', _showHideSettings, false);
    document.addEventListener('keyup', _escapeToClose, false);
  };
};
