<!DOCTYPE html>
<?php
  $meta_title = "time.area17.com - AREA 17";
  $meta_social_title = "AREA 17";
  $meta_description = "Time, weather and timezone conversion between international A17 locations.";
  $meta_url = "https://time.area17.com/";
  $meta_image = "https://time.area17.com/img/og.png";
?>
<html dir="ltr" lang="en-US">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title><?php echo $meta_title; ?></title>
    <script>
      var A17 = window.A17 || {};
      if (window.location.search.indexOf('screensaver=true') > 0) {
        A17.screensaver = true;
        document.documentElement.classList.add('s-screensaver');
      } else {
        A17.screensaver = false;
      }
    </script>
    <link href="/css/timezones.css" rel="stylesheet" />
    <style id="animations"></style>

    <?php if(isset($meta_social_title)) { ?>
    <meta property="og:title" content="<?php echo $meta_social_title ?>" />
    <meta name="twitter:title" content="<?php echo $meta_social_title ?>" />
    <meta itemprop="name" content="<?php echo $meta_social_title ?>">
    <?php } ?>

    <?php if(isset($meta_description)) { ?>
    <meta name="description" content="<?php echo $meta_description ?>">
    <meta property="og:description" content="<?php echo $meta_description ?>" />
    <meta name="twitter:description" content="<?php echo $meta_description ?>" />
    <meta itemprop="description" content="<?php echo $meta_description ?>">
    <?php } ?>

    <?php if(isset($meta_url)) { ?>
    <meta property="og:url" content="<?php echo $meta_url ?>" />
    <link rel="canonical" href="<?php echo $meta_url ?>" />
    <meta name="twitter:url" content="<?php echo $meta_url ?>" />
    <?php } ?>

    <?php if(isset($meta_image)) { ?>
    <meta property="og:image" content="<?php echo $meta_image ?>" />
    <meta property="og:image:width" content="1200" />
    <meta property="og:image:height" content="630" />
    <meta name="twitter:image" content="<?php echo $meta_image ?>">
    <meta itemprop="image" content="<?php echo $meta_image ?>">
    <?php } ?>

    <meta name="copyright" content="(c) <?php date_default_timezone_set('UTC'); echo date("Y"); ?> AREA 17" />

    <meta property="og:type" content="website" />
    <meta property="og:site_name" content="AREA 17" />
    <meta property="og:author" content="https://www.facebook.com/area17/" />
    <meta property="fb:admins" content="288673154639" />

    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:site" content="@opticalcortex" />
    <meta name="twitter:domain" content="area17.com" />
    <meta name="twitter:creator" content="@opticalcortex" />

    <link href="//www.area17.com/favicon-16.png" rel="icon" sizes="16x16" type="image/png">
    <link href="//www.area17.com/favicon-32.png" rel="icon" sizes="32x32" type="image/png">
    <link href="//www.area17.com/favicon-96.png" rel="icon" sizes="96x96" type="image/png">
    <link href="//www.area17.com/favicon-57.png" rel="apple-touch-icon" sizes="57x57">
    <link href="//www.area17.com/favicon-72.png" rel="apple-touch-icon" sizes="72x72">
    <link href="//www.area17.com/favicon-120.png" rel="apple-touch-icon" sizes="120x120">
    <link href="//www.area17.com/favicon-144.png" rel="apple-touch-icon" sizes="144x144">
    <link href="//www.area17.com/favicon-152.png" rel="apple-touch-icon" sizes="152x152">
    <link href="//www.area17.com/favicon-180.png" rel="apple-touch-icon-precomposed" sizes="180x180">

    <meta name="apple-mobile-web-app-title" content="AREA 17" />
    <meta name="format-detection" content="telephone=no" />

    <meta name="theme-color" content="#000000" />

    <meta name="msapplication-TileColor" content="#000000">
    <meta name="msapplication-TileImage" content="//www.area17.com/favicon-144.png">
  </head>
  <body>
    <div class="o-clocks">
      <a href="http://www.area17.com/" class="logo" target="_blank"><svg aria-hidden="true"><use xlink:href="#logo" /></svg></a>
      <button class="instruction">Convert</button>
      <button class="settings-trigger">Settings</button>
      <p class="m-digital" data-behavior="digital"></p>
      <svg class="m-analogue" data-behavior="analogue" viewBox="0 0 425 425">
        <use xlink:href="#clock-face" class="m-analogue__face" />
        <use xlink:href="#hours" class="m-analogue__hour" />
        <use xlink:href="#minutes" class="m-analogue__minute" />
        <use xlink:href="#seconds" class="m-analogue__second" />
        <circle cx="212.5" cy="212.5" r="1.5" stroke="none" />
      </svg>
      <ul class="o-timezones" data-behavior="timezones"></ul>
      <small class="legal">&copy; <a href="http://area17.com/" target="_blank">AREA 17</a> <?php date_default_timezone_set('UTC'); echo date("Y"); ?> &ndash; <a href="/downloads/A17TimeZones.saver.zip" class="screensaver-link">Download screensaver</a><span class="screensaver-link"> &ndash; </span><a href="https://darksky.net/poweredby/" target="_blank">Weather powered by Dark Sky</a></small>
    </div>
    <div class="o-conversion" data-behavior="conversion">
      <p>Type a time to convert:</p>
      <input type="text" placeholder="eg: 15:00 Paris, 3pm New York, 9:30 Tucumán">
      <p></p>
      <a href="#" class="o-conversion__close">╳</a>
    </div>
    <div class="o-settings" data-behavior="settings">
      <p>Type</p>
      <ul>
        <li><label><input type="radio" name="ClockType" value="analogue" checked> Analog</label></li>
        <li><label><input type="radio" name="ClockType" value="digital"> Digital</label></li>
      </ul>
      <p>Format</p>
      <ul>
        <li><label><input type="radio" name="DigitalFormat" value="12" checked> 12 hour</label></li>
        <li><label><input type="radio" name="DigitalFormat" value="24"> 24 hour</label></li>
      </ul>
      <p>Information</p>
      <ul>
        <li><label><input type="checkbox" value="ShowCurrentWeather" checked> Weather</label></li>
        <li setting-dependant-on-weather data-behavior="showHideAnimatedIconsToggler"><label><input type="checkbox" value="AnimatedIcons"> Animated icons</label></li>
      </ul>
      <p>Degrees</p>
      <ul>
        <li><label><input type="radio" name="TemperatureUnit" value="c" checked> &deg;C</label></li>
        <li><label><input type="radio" name="TemperatureUnit" value="f"> &deg;F</label></li>
      </ul>
      <p class="o-settings__save"><button class="close-settings-trigger">Save settings</button></p>
    </div>
    <?php include "includes/_icons.php" ?>
    <script src="/js/timezones.js"></script>
    <?php include "includes/_timezones_setup.php" ?>
    <script>A17.locations = <?php echo json_encode(array_reverse($locations)); ?>;</script>
  </body>
</html>

