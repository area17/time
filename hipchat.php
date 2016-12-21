<?php
  date_default_timezone_set("UTC");

  /*
  test with curl:
  curl -H "Content-Type: application/json" -X POST -d '{"item":{"message":{"date":"2016-12-21T14:22:06.878382+00:00","message":"/time 13:59pm Paris"}}}' http://time.area17.com/hipchat.php
  */

  // set up
  $time_str = "";
  $format = 'h:i a';
  $datetime = new DateTime(date("Y-m-d H:i:s"),new DateTimeZone('UTC'));
  $locations = array();

  // our locations
  array_push($locations, array("name" => "Paris", "timezone" => "Europe/Paris", "emoji" => "🇫🇷"));
  array_push($locations, array("name" => "Manchester", "timezone" => "Europe/London", "emoji" => "🇬🇧"));
  array_push($locations, array("name" => "Tucumán", "timezone" => "America/Argentina/Tucuman", "emoji" => "🇦🇷"));
  array_push($locations, array("name" => "New York", "timezone" => "America/New_York", "emoji" => "🇺🇸"));
  array_push($locations, array("name" => "Memphis", "timezone" => "America/Chicago", "emoji" => "🇺🇸"));
  array_push($locations, array("name" => "San Francisco", "timezone" => "America/Los_Angeles", "emoji" => "🇺🇸"));

  // determining if there is useful POST info
  $post = file_get_contents('php://input');
  $post_json = json_decode($post);
  $post_msg = $post_json->item->message->message;

  if(isset($post_msg)) {
    // replace out the "/time" bit
    $post_msg = preg_replace('/\/time\s/i', '', $post_msg);
    // guess if its am or pm
    $am = preg_match('/\Sam/i', $post_msg) ? true : false;
    $pm = preg_match('/\Spm/i', $post_msg) ? true : false;
    // really crudely get the hour by parsing the string for an integer
    $hour = intval($post_msg);
    // fix for 12/24 conversion
    $hour = ($hour < 12 && $pm && !$am) ? $hour + 12 : $hour;

    // begin guessing the timezone
    if (preg_match('/\sparis$/i', $post_msg) || preg_match('/\sfrance$/i', $post_msg) || preg_match('/\sfr$/i', $post_msg) || preg_match('/\scet$/i', $post_msg) || preg_match('/\scest$/i', $post_msg)) {
      $timezone = "Europe/Paris";
    }

    if (preg_match('/\slondon$/i', $post_msg) || preg_match('/\smanchester$/i', $post_msg) || preg_match('/\sbritain$/i', $post_msg) || preg_match('/\sengland$/i', $post_msg) || preg_match('/\suk$/i', $post_msg) || preg_match('/\sgmt$/i', $post_msg) || preg_match('/\sbst$/i', $post_msg) || preg_match('/\smike$/i', $post_msg)) {
      $timezone = "Europe/London";
    }

    if (preg_match('/\stucumán$/i', $post_msg) || preg_match('/\stucuman$/i', $post_msg) || preg_match('/\sargentina$/i', $post_msg) || preg_match('/\sar$/i', $post_msg) || preg_match('/\sart$/i', $post_msg) || preg_match('/\sluis$/i', $post_msg) || preg_match('/\sbernardo$/i', $post_msg) || preg_match('/\spablo$/i', $post_msg)) {
      $timezone = "America/Argentina/Tucuman";
    }

    if (preg_match('/\sny$/i', $post_msg) || preg_match('/\snyc$/i', $post_msg) || preg_match('/\snew york$/i', $post_msg) || preg_match('/\sedt$/i', $post_msg) || preg_match('/\sest$/i', $post_msg)) {
      $timezone = "America/New_York";
    }

    if (preg_match('/\smemphis$/i', $post_msg) || preg_match('/\stennessee$/i', $post_msg) || preg_match('/\snashville$/i', $post_msg) || preg_match('/\stn$/i', $post_msg) || preg_match('/\scst$/i', $post_msg) || preg_match('/\scdt$/i', $post_msg) || preg_match('/\stim$/i', $post_msg)) {
      $timezone = "America/Chicago";
    }

    if (preg_match('/\sla$/i', $post_msg) || preg_match('/\slos angeles$/i', $post_msg) || preg_match('/\sSF$/i', $post_msg) || preg_match('/\ssan francisco$/i', $post_msg) || preg_match('/\slax$/i', $post_msg) || preg_match('/\ssfo$/i', $post_msg) || preg_match('/\spst$/i', $post_msg) || preg_match('/\spdt$/i', $post_msg)) {
      $timezone = "America/Los_Angeles";
    }
  }

  // if we got a post message, an hour and a timezone convert, else just show times
  if(isset($post_msg) && isset($hour) && isset($timezone)) {
    // time specified
    $datetime->setTimezone(new DateTimeZone($timezone));
    $datetime->setTime($hour, '00');
    foreach ($locations as $location) {
      if ($timezone === $location["timezone"]) {
        if ($hour > 12) {
          $hour = $hour - 12;
          $pm = true;
        }
        $time_str = $time_str."⌚️ ".$hour.(($pm) ? "pm" : "am")." in ".$location["name"]." is:\n";
      }
    }
    foreach ($locations as $location) {
      if ($timezone !== $location["timezone"]) {
        $datetime->setTimezone(new DateTimeZone($location["timezone"]));
        $time_str = $time_str.$location["emoji"]." ".$datetime->format($format)." - ".$location["name"]."\n";
      }
    }

  } else {
    // no time specified
    foreach ($locations as $location) {
      $datetime->setTimezone(new DateTimeZone($location["timezone"]));
      $time_str = $time_str.$location["emoji"]." ".$datetime->format($format)." - ".$location["name"]."\n";
    }
  }

  $json = array('color' => 'gray', "message" => $time_str, "notify" => "false", "message_format" => "text", "from" => "http://time.area17.com/");
  echo json_encode($json);
?>
