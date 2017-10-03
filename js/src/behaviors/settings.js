timezones.Behaviors.settings = function(container){

  var $settings = $("#settings");
  var $checkboxes = $("input[type=checkbox]",$settings);
  var radios_arr = ["ClockType", "DigitalFormat","TemperatureUnit"];
  var $clockType = $("input[type=radio][name=ClockType]",$settings);
  var $digitalFormat = $("input[type=radio][name=DigitalFormat]",$settings);
  var $temperature_unit = $("input[type=radio][name=TemperatureUnit]",$settings);

  // check for locally stored setting
  $checkboxes.forEach(function(input,index){
    if (localStorage[input.value] === undefined) {
      localStorage[input.value] = input.checked;
    } else {
      input.checked = (localStorage[input.value] == "true") ? true : false;
      input.parentNode.className = input.checked ? "checked" : "";
    }
  });
  // do some clicks
  $checkboxes.on("click",function(event){
    localStorage[this.value] = this.checked;
    this.parentNode.className = this.checked ? "checked" : "";
    document.trigger("update"+this.value);
  });


  radios_arr.forEach(function(radio_name,index){
    // check for locally stored
    var inputs = $("input[type=radio][name="+radio_name+"]",$settings);
    var input = (inputs[0].checked) ? inputs[0] : inputs[1];
    if (localStorage[input.name] === undefined) {
      localStorage[input.name] = input.value;
    } else {
      $("input[type=radio][name="+radio_name+"][value=\""+localStorage[input.name]+"\"]",$settings).checked = true;
    }
    // do some clicks
    inputs.on("click",function(event){
      localStorage[this.name] = this.value;
      document.trigger("update"+this.name);
    });
  });

  // hide show settings
  container.on("click",function(event){
    event.preventDefault();
    if ($settings.hasClass("active")) {
      $settings.removeClass("active");
    } else {
      $settings.addClass("active");
    }
  });

  document.on("keyup",function(event) {
    if ($settings.hasClass("active") && event.keyCode == 27) {
      $settings.removeClass("active");
    }
  });

};
