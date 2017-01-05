<?php
  include 'includes/_timezones_setup.php';

  /*
  test with curl:
  curl http://a17_timezones.localip/convert.php
  curl http://a17_timezones.localip/convert.php?str=London
  curl http://a17_timezones.localip/convert.php?str=5.12pm%20London
  curl http://a17_timezones.localip/convert.php?str=5.12%20pm%20London
  */

  if(isset($_GET['str'])) {
    $time_properties = parseString(urldecode($_GET['str']));
    $message_str = generateResponseString($time_properties,"<br>");
  } else {
    $message_str = generateResponseString(null,"<br>");
  }

  echo $message_str;
?>
