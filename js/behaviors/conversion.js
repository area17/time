A17.Behaviors.conversion = function(container) {

  var $body = document.body;
  var $searchField = container.querySelector('input[type=text]');
  var $searchResults = container.querySelector('.o-conversion__output');
  var $close = container.querySelector('.o-conversion__close');
  var $instruction = document.querySelector('.conversion-trigger');
  var activeClass = 's-active';
  var debouncer;
  var focussed = false;
  var timesActive = false;
  var keysDown = {};
  var ajaxing = false;
  var lastSearchTime;

  function _showTimes(event){
    if (event && event.target === $instruction) {
      $instruction.blur();
    }
    if (!timesActive) {
      timesActive = true;
      $body.classList.add(activeClass);
      $searchField.focus();
    }
  }

  function _hideTimes(event){
    if (event) {
      event.preventDefault();
    }
    timesActive = false;
    $body.classList.remove(activeClass);
    $searchField.blur();
    $searchField.value = '';
    $searchResults.innerHTML = '';
  }

  function _fixedEncodeURIComponent(str) {
    return encodeURIComponent(str).replace(/[!'()*]/g, function(c) {
      return '%' + c.charCodeAt(0).toString(16);
    });
  }

  function _doSearch(value){
    if (!ajaxing) {
      ajaxing = true;
      lastSearchTime = Date.now();
      var thisSearchTime = lastSearchTime;
      container.classList.add('js-loading');
      A17.Helpers.ajaxRequest({
        url: '/convert.php',
        type: 'GET',
        data: {
          str: _fixedEncodeURIComponent(value),
          tz: _fixedEncodeURIComponent(A17.guessedUserTimeZone),
        },
        onSuccess: function(data){
          if (data.length > 0 && thisSearchTime === lastSearchTime) {
            $searchResults.innerHTML = data;
            container.classList.remove('js-loading');
          }
          ajaxing = false;
        },
        onError: function(data){
          console.log(data);
          ajaxing = false;
        }
      });
    }
  }

  function _searchFieldFocus() {
    _showTimes();
  }

  function _searchFieldBlur(event) {
    if (timesActive && $searchResults.innerHTML === '' || !event.relatedTarget) {
      _hideTimes();
    }
  }

  function _searchFieldKeyUp(event) {
    if($searchField.value.length > 0 && event.keyCode != 27) {
      clearTimeout(debouncer);
      debouncer = setTimeout(function(){
        _doSearch($searchField.value);
      },500);
    }
  }

  function _documentKeyDown(event) {
    keysDown[event.keyCode] = true;
    if (event.target.tagName.toLowerCase() !== 'input' && !keysDown['91'] && !keysDown['17']) {
      if (event.keyCode >= 65 && event.keyCode <= 90 || event.keyCode >= 48 && event.keyCode <= 57 || event.keyCode >= 96 && event.keyCode <= 105) {
        _showTimes();
      }
    }
  }

  function _documentKeyUp(event) {
    keysDown[event.keyCode] = false;
    if (timesActive && event.keyCode == 27) {
      _hideTimes();
    }
  }

  this.init = function() {
    if (!A17.screensaver) {
      $instruction.addEventListener('click', _showTimes, false);
      $searchField.addEventListener('focus', _searchFieldFocus, false);
      $searchField.addEventListener('blur', _searchFieldBlur, false);
      $searchField.addEventListener('keyup', _searchFieldKeyUp, false);
      $close.addEventListener('click', _hideTimes, false);
      document.addEventListener('keydown', _documentKeyDown, false);
      document.addEventListener('keyup', _documentKeyUp, false);
    }
  };
};
