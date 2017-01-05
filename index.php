<?php include "includes/_html_header.php"; ?>
<header id="header">
  <svg class="logo" width="84px" height="53px" viewBox="0 0 84 53">
    <path d="M30.711,0l21.2,53h-10.6l-4.476-12H15.165l-4.476,12h-10.6l21.2-53H30.711z M33.773,33L26,12.484L18.227,33H33.773z
       M83.8,0L62.6,53h-5.3L78.5,0H83.8z"/>
  </svg>
  <span class="instruction">Type a time and place, eg: 15:00 Paris, 3pm New York, 9:30 Tucumán</span>
  <a href="#settings" class="settings" data-behavior="settings">⚙</a>
</header>
<section class="container">
  <ul class="timezones js-invisible" data-behavior="timezones">
  </ul>
  <div class="times" data-behavior="times">
    <input type="text" placeholder="Paris, 2:30pm New York">
    <p></p>
    <a href="#" class="close">╳</a>
  </div>
  <div id="settings">
    <p>Time</p>
    <ul>
      <li><label><input type="checkbox" value="show_analog" checked> Analogue</label></li>
      <li class="sublist">
        <label><input type="checkbox" value="show_digital" checked> Digital</label>
        <ul>
          <li><label><input type="radio" name="digital_format" value="12"> 12 hour</label></li>
          <li><label><input type="radio" name="digital_format" value="24" checked> 24 hour</label></li>
        </ul>
      </li>
    </ul>
    <p>Weather</p>
    <ul>
      <li><label><input type="checkbox" value="show_current_weather" checked> Current weather</label></li>
      <li class="sublist">
        <label><input type="checkbox" value="show_temperature" checked> Temperature</label>
        <ul>
          <li><label><input type="radio" name="temperature_unit" value="c" checked> &deg;C</label></li>
          <li><label><input type="radio" name="temperature_unit" value="f"> &deg;F</label></li>
          <li><label><input type="checkbox" value="show_rainchance" checked> Chance of rain</label></li>
        </ul>
      </li>
    </ul>
  </div>
  <p class="powered_by"><a href="http://forecast.io/">Powered by Forecast.io</a></p>
  <small class="legal">Copyright &copy; 2015 &ndash; <?php date_default_timezone_set('UTC'); echo date("Y"); ?> AREA 17</small>
</section>
<?php include "includes/_html_footer.php"; ?>
