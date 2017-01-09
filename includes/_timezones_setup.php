<?php
date_default_timezone_set("UTC");

// set up vars
$now = date("Y-m-d H:i:s");
$datetime = new DateTime($now, new DateTimeZone('UTC'));
$locations = array();
$format = 'h:i a';
$hourEmoji = array("0" => "🕛", "1" => "🕐", "2" => "🕑", "3" => "🕒", "4" => "🕓", "5" => "🕔", "6" => "🕕", "7" => "🕖", "8" => "🕗", "9" => "🕘", "10" => "🕙", "11" => "🕚", "12" => "🕛");

// our locations
array_push($locations, array("name" => "Paris", "timezone" => "Europe/Paris", "emoji" => "🇫🇷", "lat" => 48.866667, "long" => 2.333333, "offset" => 0));
array_push($locations, array("name" => "Manchester", "timezone" => "Europe/London", "emoji" => "🇬🇧", "lat" => 53.4808, "long" => -2.2426, "offset" => 0));
array_push($locations, array("name" => "Tucumán", "timezone" => "America/Argentina/Tucuman", "emoji" => "🇦🇷", "lat" => -26.8166667, "long" => -65.2166667, "offset" => 0));
array_push($locations, array("name" => "New York", "timezone" => "America/New_York", "emoji" => "🇺🇸", "lat" => 40.7141667, "long" => -74.0063889, "offset" => 0));
array_push($locations, array("name" => "Memphis", "timezone" => "America/Chicago", "emoji" => "🇺🇸", "lat" => 35.6331, "long" => -88.8208, "offset" => 0));
array_push($locations, array("name" => "San Francisco", "timezone" => "America/Los_Angeles", "emoji" => "🇺🇸", "lat" => 37.775, "long" => -122.4183333, "offset" => 0));
// testing timezones not on whole hour offsets from UTC
//array_push($locations, array("name" => "Sri Lanka", "timezone" => "Asia/Colombo", "emoji" => "🇱🇰", "lat" => 37.775, "long" => -122.4183333, "offset" => 0));
//array_push($locations, array("name" => "Kathmandu", "timezone" => "Asia/Kathmandu", "emoji" => "🇳🇵", "lat" => 37.775, "long" => -122.4183333, "offset" => 0));

// add offset in seconds for each
foreach ($locations as $location => $locationinfo) {
  $timeInLocation = new DateTime($now, new DateTimeZone($locations[$location]["timezone"]));
  $locations[$location]["offset"] = $timeInLocation->getOffset();
}

function parseString($str) {
  // replace any . with :
  $str = preg_replace('/\./i', ':', $str);
  // guess if its am or pm
  $am = preg_match('/\Sam|\d\sam/i', $str) ? true : false;
  $pm = preg_match('/\Spm|\d\spm/i', $str) ? true : false;
  // really crudely get the hour by parsing the string for an integer
  $hour = preg_match('/^\s\d|^\d/i', $str) ? intval($str) : -1;
  // and now crudely get the minute by looking for a colon and a number
  $minutes = array();
  preg_match('/:(\d*)/i', $str, $minutes);
  $minutes = isset($minutes[1]) ? intval($minutes[1]) : 0;
  //
  $timezone = false;

  if ($hour > -1) {
    // fix for 12/24 conversion
    $hour = ($hour < 12 && $pm && !$am) ? $hour + 12 : $hour;
  }

  // begin guessing the timezone
  if (preg_match('/(paris|par|france|fr|cet|cest|cdg)$/i', $str)) {
    $timezone = "Europe/Paris";
  }

  if (preg_match('/(london|manchester|britain|england|uk|gb|bst|gmt|mike|man|lhr)$/i', $str)) {
    $timezone = "Europe/London";
  }

  if (preg_match('/(tucumán|tucuman|argentina|ar|art|luis|pablo|bernardo)$/i', $str)) {
    $timezone = "America/Argentina/Tucuman";
  }

  if (preg_match('/(ny|nyc|new york|new york city|edt|est|jfk)$/i', $str)) {
    $timezone = "America/New_York";
  }

  if (preg_match('/(memphis|tennessee|nashville|tn|cst|cdt|tim)$/i', $str)) {
    $timezone = "America/Chicago";
  }

  if (preg_match('/(la|los angeles|san francisco|sf|lax|sfo|pst|pdt|ca)$/i', $str)) {
    $timezone = "America/Los_Angeles";
  }

  return array("am" => $am, "pm" => $pm, "timezone" => $timezone, "hour" => $hour, "minutes" => $minutes);
}

function generateResponseString($time_properties,$linebreak) {
  global $locations, $datetime, $hourEmoji, $format;
  $time_str = "";
  // if we got timezone convert, else just show times
  if(isset($time_properties) && isset($time_properties['timezone']) && $time_properties['timezone'] !== false) {
    // timezone specified
    $datetime->setTimezone(new DateTimeZone($time_properties['timezone']));
    // do we have an hour?
    if ($time_properties['hour'] > -1) {
      $datetime->setTime($time_properties['hour'], $time_properties['minutes']);
      foreach ($locations as $location) {
        if ($time_properties['timezone'] === $location["timezone"]) {
          $time_str = $time_str."\n".$location["emoji"]." ".$hourEmoji[$datetime->format('g')]." ".$datetime->format($format)." in ".$location["name"]." is:".$linebreak.$linebreak;
        }
      }
      foreach ($locations as $location) {
        if ($time_properties['timezone'] !== $location["timezone"]) {
          $datetime->setTimezone(new DateTimeZone($location["timezone"]));
          $time_str = $time_str.$location["emoji"]." ".$hourEmoji[$datetime->format('g')]." ".$datetime->format($format)." - ".$location["name"].$linebreak;
        }
      }
    } else {
      // no hour, but a city given
      foreach ($locations as $location) {
        if ($time_properties['timezone'] === $location["timezone"]) {
          $time_str = $time_str.$location["emoji"]." ".$hourEmoji[$datetime->format('g')]." The time in ".$location["name"]." is ".$datetime->format($format).$linebreak;
        }
      }
    }
  } else {
    // no timezone specified
    foreach ($locations as $location) {
      $datetime->setTimezone(new DateTimeZone($location["timezone"]));
      $time_str = $time_str.$location["emoji"]." ".$hourEmoji[$datetime->format('g')]." ".$datetime->format($format)." - ".$location["name"].$linebreak;
    }
  }

  return $time_str;
}
?>
