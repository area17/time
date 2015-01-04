timezones.Behaviors.times = function(container) {

  var $body = $("body");
  var $search_field = $("input[type=text]",container);
  var $search_results = $("ul",container);
  var $close = $(".close",container);
  var result_html = '<li>{{time}} in {{name}}</li>';
  var active_class = "show-times";
  var debouncer;
  var focussed = false;
  var times_active = false;
  var keysDown = {};

  $search_field.on("focus",function(){
    show_times();
  }).on("blur",function(event){
    if (times_active && $search_results.innerHTML == "" || !event.relatedTarget) {
      hide_times();
    }
  }).on("keyup",function(event){
    if($search_field.value.length > 0 && event.keyCode != 27) {
      clearTimeout(debouncer);
      debouncer = setTimeout(function(){
        doSearch($search_field.value);
      },250);
    }
  });

  $close.on("click",function(event){
    event.preventDefault();
    hide_times();
  });

  document.on("keydown",function(event) {
    keysDown[event.keyCode] = true;
    if (event.target.tagName.toLowerCase() !== 'input' && !keysDown["91"] && !keysDown["17"]) {
      if (event.keyCode >= 65 && event.keyCode <= 90 || event.keyCode >= 48 && event.keyCode <= 57) {
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
    var value = value;
    value = value.replace(".",":");
    value = value.replace(",",":");

    var is_pm = (value.match("p") || value.match("pm")) ? true : false;
    var mins = value.split(":")[1] || "0";
    var hours = value.split(":")[0];

    mins = mins.replace("pm","");
    mins = mins.replace("p","");
    hours = hours.replace("pm","");
    hours = hours.replace("p","");

    if (is_pm) {
      hours = (hours*1) + 12;
    }

    if (value > 23) {
      value = 0;
    }

    var now = moment().set('hour',hours).set('minute',mins);
    var lis = "";

    timezones.locations.forEach(function(location,index){
      var this_result_html = result_html;
      var time = now.tz(location.timezone).format("HH:mm");
      //
      this_result_html = this_result_html.replace("{{time}}",time);
      this_result_html = this_result_html.replace("{{name}}",location.name);
      lis += this_result_html;
    });

    $search_results.innerHTML = lis;

  }
};