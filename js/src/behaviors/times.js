timezones.Behaviors.times = function(container) {

  var $body = $("body");
  var $search_field = $("input[type=text]",container);
  var $search_results = $("p",container);
  var $close = $(".close",container);
  var active_class = "show-times";
  var debouncer;
  var focussed = false;
  var times_active = false;
  var keysDown = {};
  var ajaxing = false;
  var lastSearchTime;

  $('.instruction').on("click",show_times);

  $search_field.on("focus",function(){
    show_times();
  }).on("blur",function(event){
    if (times_active && $search_results.innerHTML === "" || !event.relatedTarget) {
      hide_times();
    }
  }).on("keyup",function(event){
    if($search_field.value.length > 0 && event.keyCode != 27) {
      clearTimeout(debouncer);
      debouncer = setTimeout(function(){
        doSearch($search_field.value);
      },500);
    }
  });

  $close.on("click",function(event){
    event.preventDefault();
    hide_times();
  });

  document.on("keydown",function(event) {
    keysDown[event.keyCode] = true;
    if (event.target.tagName.toLowerCase() !== 'input' && !keysDown["91"] && !keysDown["17"]) {
      if (event.keyCode >= 65 && event.keyCode <= 90 || event.keyCode >= 48 && event.keyCode <= 57 || event.keyCode >= 96 && event.keyCode <= 105) {
        show_times();
      }
    }
  }).on("keyup",function(event) {
    keysDown[event.keyCode] = false;
    if (times_active && event.keyCode == 27) {
      hide_times();
    }
  });

  function show_times(){
    if (!times_active) {
      times_active = true;
      $body.addClass(active_class);
      $search_field.focus();
    }
  }

  function hide_times(){
    times_active = false;
    $body.removeClass(active_class);
    $search_field.blur();
    $search_field.value = "";
    $search_results.innerHTML = "";
  }

  function doSearch(value){
    if (!ajaxing) {
      ajaxing = true;
      lastSearchTime = Date.now();
      var thisSearchTime = lastSearchTime;
      container.addClass("js-loading");
      timezones.Helpers.ajaxRequest({
        url: '/convert.php',
        type: 'GET',
        data: {
          str: fixedEncodeURIComponent(value)
        },
        onSuccess: function(data){
          if (data.length > 0 && thisSearchTime === lastSearchTime) {
            $search_results.innerHTML = data;
            container.removeClass("js-loading");
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

  function fixedEncodeURIComponent(str) {
    return encodeURIComponent(str).replace(/[!'()*]/g, function(c) {
      return '%' + c.charCodeAt(0).toString(16);
    });
  }
};
