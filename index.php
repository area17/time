<?php include "includes/_html_header.php"; ?>
<header id="header">
  <span class="logo">A17</span>
  <span class="instruction">Type a time, eg: 15:00, 3pm</span>
  <a href="#settings" class="settings" data-behavior="settings">Settings</a>
</header>
<section class="container">
  <ul class="timezones" data-behavior="timezones">
  </ul>
  <div class="times" data-behavior="times">
    <input type="text">
    <ul>
    </ul>
    <a href="#" class="close">Close</a>
  </div>
  <div id="settings">
    <p>Time</p>
    <ul>
      <li><label><input type="checkbox" value="show_analog" checked> Analogue</label></li>
      <li><label><input type="checkbox" value="show_digital" checked> Digital</label></li>
      <li><label><input type="radio" name="digital_format" value="12"> 12 hour</label></li>
      <li><label><input type="radio" name="digital_format" value="24" checked> 24 hour</label></li>
    </ul>
    <p>Weather</p>
    <ul>
      <li><label><input type="checkbox" value="show_current_weather" checked> Current weather</label></li>
      <li><label><input type="checkbox" value="show_temperature" checked> Temperature</label></li>
      <li><label><input type="radio" name="temperature_unit" value="c" checked> &deg;C</label></li>
      <li><label><input type="radio" name="temperature_unit" value="f"> &deg;F</label></li>
    </ul>
  </div>
  <p class="powered_by"><a href="http://forecast.io/">Powered by Forecast.io</a></p>
</section>
<?php include "includes/_html_footer.php"; ?>