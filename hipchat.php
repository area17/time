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
  $hours = array("0" => "🕛", "1" => "🕐", "2" => "🕑", "3" => "🕒", "4" => "🕓", "5" => "🕔", "6" => "🕕", "7" => "🕖", "8" => "🕗", "9" => "🕘", "10" => "🕙", "11" => "🕚", "12" => "🕛");

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
    $post_msg = preg_replace('/\/time/i', '', $post_msg);
    // guess if its am or pm
    $am = preg_match('/\Sam/i', $post_msg) ? true : false;
    $pm = preg_match('/\Spm/i', $post_msg) ? true : false;
    // really crudely get the hour by parsing the string for an integer
    $hour = preg_match('/^\s\d/i', $post_msg) ? intval($post_msg) : -1;
    if ($hour > -1) {
      // fix for 12/24 conversion
      $hour = ($hour < 12 && $pm && !$am) ? $hour + 12 : $hour;
    }

    // begin guessing the timezone
    if (preg_match('/\s(paris|par|france|fr|cet|cest|cdg)$/i', $post_msg)) {
      $timezone = "Europe/Paris";
    }

    if (preg_match('/\s(london|manchester|britain|england|uk|gb|bst|gmt|mike|man|lhr)$/i', $post_msg)) {
      $timezone = "Europe/London";
    }

    if (preg_match('/\s(tucumán|tucuman|argentina|ar|art|luis|pablo|bernardo)$/i', $post_msg)) {
      $timezone = "America/Argentina/Tucuman";
    }

    if (preg_match('/\s(ny|nyc|new york|new york city|edt|est|jfk)$/i', $post_msg)) {
      $timezone = "America/New_York";
    }

    if (preg_match('/\s(memphis|tennessee|nashville|tn|cst|cdt|tim)$/i', $post_msg)) {
      $timezone = "America/Chicago";
    }

    if (preg_match('/\s(la|los angeles|san francisco|sf|lax|sfo|pst|pdt|ca)$/i', $post_msg)) {
      $timezone = "America/Los_Angeles";
    }
  }

  // if we got a post message and a timezone convert, else just show times
  if(isset($post_msg) && isset($timezone)) {
    // timezone specified
    $datetime->setTimezone(new DateTimeZone($timezone));
    // do we have an hour?
    if ($hour > -1) {
      $datetime->setTime($hour, '00');
      foreach ($locations as $location) {
        if ($timezone === $location["timezone"]) {
          $time_str = $time_str."\n".$location["emoji"]." ".$hours[$datetime->format('g')]." ".$datetime->format($format)." in ".$location["name"]." is:\n\n";
        }
      }
      foreach ($locations as $location) {
        if ($timezone !== $location["timezone"]) {
          $datetime->setTimezone(new DateTimeZone($location["timezone"]));
          $time_str = $time_str.$location["emoji"]." ".$hours[$datetime->format('g')]." ".$datetime->format($format)." - ".$location["name"]."\n";
        }
      }
    } else {
      foreach ($locations as $location) {
        if ($timezone === $location["timezone"]) {
          $time_str = $time_str.$location["emoji"]." ".$hours[$datetime->format('g')]." The time in ".$location["name"]." is ".$datetime->format($format)."\n";
        }
      }
    }
  } else {
    // no time specified
    foreach ($locations as $location) {
      $datetime->setTimezone(new DateTimeZone($location["timezone"]));
      //$time_str = $time_str.$location["emoji"]." ".$datetime->format($format)." - ".$location["name"]."\n";
      $time_str = $time_str.$location["emoji"]." ".$hours[$datetime->format('g')]." ".$datetime->format($format)." - ".$location["name"]."\n";
    }
  }

  $json = array('color' => 'gray', "message" => $time_str, "notify" => "false", "message_format" => "text", "from" => "http://time.area17.com/");
  echo json_encode($json);
  //echo $time_str;
?>
