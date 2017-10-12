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
      <svg class="logo" width="84px" height="53px" viewBox="0 0 84 53">
        <path fill="#fff" d="M30.711,0l21.2,53h-10.6l-4.476-12H15.165l-4.476,12h-10.6l21.2-53H30.711z M33.773,33L26,12.484L18.227,33H33.773z
           M83.8,0L62.6,53h-5.3L78.5,0H83.8z"/>
      </svg>
      <a href="/downloads/A17TimeZones.saver.zip" class="screensaver-link">🖥️</a>
      <button class="instruction">🕘 → 🕑</button>
      <button class="settings-trigger">⚙</button>
      <p class="m-digital" data-behavior="digital"></p>
      <svg class="m-analogue" data-behavior="analogue" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 200 200"><defs><symbol id="a"><path d="M99.13 0h1.74v22.087h-1.74z"/></symbol><symbol id="b"><path d="M99.72 0h.557v12.82h-.557z"/></symbol><symbol id="c"><use xlink:href="#a"/><use xlink:href="#b" transform="rotate(6 100 100)"/><use xlink:href="#b" transform="rotate(12 100 100)"/><use xlink:href="#b" transform="rotate(18 100 100)"/><use xlink:href="#b" transform="rotate(24 100 100)"/></symbol><symbol id="d"><use xlink:href="#c"/><use xlink:href="#c" transform="rotate(30 100 100)"/><use xlink:href="#c" transform="rotate(60 100 100)"/></symbol></defs><use xlink:href="#d" fill="#fff" stroke="#fff"/><use xlink:href="#d" transform="rotate(90 100 100)" fill="#fff" stroke="#fff"/><use xlink:href="#d" transform="rotate(180 100 100)" fill="#fff" stroke="#fff"/><use xlink:href="#d" transform="rotate(270 100 100)" fill="#fff" stroke="#fff"/><g class="m-analogue__hour" fill="#fff" stroke="#fff"><path fill="none" d="M0 0h200v200H0z" stroke="none"/><path d="M97.86 46.087h4.28V100h-4.28z"/></g><g class="m-analogue__minute"><path fill="none" d="M0 0h200v200H0z"/><path fill="#fff" stroke="#fff" d="M98.574 18.504h2.852V100h-2.852z"/></g><g class="m-analogue__second"><path fill="none" d="M0 0h200v200H0z"/><path d="M106.49 99.43c-.084-.983-.388-1.9-.86-2.708-.02-.036-.043-.07-.064-.106-.183-.3-.386-.584-.613-.85l-.025-.027c-.177-.21-.368-.4-.57-.58l-.034-.03c-.904-.81-2.03-1.36-3.275-1.56h-.01c-.1-.02-.2-.02-.3-.03l-.38-73.98h-.69l-.23 73.96c-.17.01-.33.01-.49.04h-.02c-.38.06-.75.15-1.11.28h-.02c-.8.28-1.526.71-2.147 1.26l-.03.03c-.204.18-.394.37-.57.576l-.033.033c-.225.263-.426.547-.61.844l-.065.11c-.17.29-.32.596-.44.91l-.055.15c-.12.34-.22.695-.284 1.06 0 .02-.003.04-.01.056-.03.18-.05.358-.07.537-.016.19-.03.38-.03.57 0 .62.095 1.216.256 1.783.004.02.01.044.02.07.15.52.37 1.01.643 1.47l.095.152c.286.457.63.87 1.014 1.24l.1.09c.175.16.36.31.55.45v.004l.09.07c.226.16.46.305.706.435h.01v7.28c0 1.68 1.36 3.046 3.04 3.046s3.04-1.364 3.04-3.044v-7.27l.005-.003c.247-.13.48-.275.707-.435l.094-.07c.19-.14.374-.29.547-.447l.057-.05c.423-.4.792-.85 1.1-1.347l.057-.097c.11-.19.214-.39.31-.592l.02-.046c.12-.27.223-.54.31-.83l.01-.04c.165-.574.26-1.18.26-1.81 0-.192-.01-.382-.03-.57z" fill="#fff" stroke="#fff"/></g><circle cx="100" cy="100" r="1.5" stroke="#000"/></svg>
      <ul class="o-timezones" data-behavior="timezones"></ul>
      <small class="legal"><a href="https://darksky.net/poweredby/">Powered by Dark Sky</a>.<br> Copyright &copy; 2015 &ndash; <?php date_default_timezone_set('UTC'); echo date("Y"); ?> <a href="http://area17.com/">AREA 17</a>.</small>
    </div>
    <div class="o-conversion" data-behavior="conversion">
      <p>Type a time to convert:</p>
      <input type="text" placeholder="eg: 15:00 Paris, 3pm New York, 9:30 Tucumán">
      <p></p>
      <a href="#" class="o-conversion__close">╳</a>
    </div>
    <div class="o-settings" data-behavior="settings">
      <ul>
        <li><label><input type="radio" name="ClockType" value="digital" checked> Digital</label></li>
        <li><label><input type="radio" name="ClockType" value="analogue"> Analog</label></li>
      </ul>
      <ul>
        <li><label><input type="radio" name="DigitalFormat" value="12"> 12 hour</label></li>
        <li><label><input type="radio" name="DigitalFormat" value="24" checked> 24 hour</label></li>
      </ul>
      <ul>
        <li><label><input type="checkbox" value="ShowTemperature" checked> Temperature</label></li>
        <li><label><input type="checkbox" value="ShowCurrentWeather" checked> Feels like/chance of rain</label></li>
      </ul>
      <ul>
        <li><label><input type="radio" name="TemperatureUnit" value="c" checked> &deg;C</label></li>
        <li><label><input type="radio" name="TemperatureUnit" value="f"> &deg;F</label></li>
      </ul>
    </div>
    <script src="/js/timezones.js"></script>
    <?php include "includes/_timezones_setup.php" ?>
    <script>A17.locations = <?php echo json_encode(array_reverse($locations)); ?>;</script>
  </body>
</html>

