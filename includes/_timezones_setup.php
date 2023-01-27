<?php
date_default_timezone_set("UTC");

// set up vars
$now = date("Y-m-d H:i:s");
$datetime = new DateTime($now, new DateTimeZone('UTC'));
$locations = array();
$format = 'h:i a';

// our locations
//array_push($locations, array("name" => "Sydney", "timezone" => "Australia/Sydney", "emoji" => "🇦🇺", "lat" => -33.8688, "long" => 151.2093, "offset" => 0, "id" => "AU-NSW"));
//array_push($locations, array("name" => "Taipei", "timezone" => "Asia/Taipei", "emoji" => "🇹🇼", "lat" => 25.0330, "long" => 121.5654, "offset" => 0, "id" => "TW-TPE"));
//array_push($locations, array("name" => "Shanghai", "timezone" => "Asia/Shanghai", "emoji" => "🇨🇳", "lat" => 31.2304, "long" => 121.4737, "offset" => 0, "id" => "CN-SH"));
//array_push($locations, array("name" => "Doha", "timezone" => "Asia/Qatar", "emoji" => "🇶🇦", "lat" => 25.2854, "long" => 51.5310, "offset" => 0, "id" => "QA"));
array_push($locations, array("name" => "Tbilisi", "timezone" => "Asia/Tbilisi", "emoji" => "🇬🇪", "lat" => 41.7151, "long" => 44.8271, "offset" => 0, "id" => "GE-TB"));
array_push($locations, array("name" => "Nairobi", "timezone" => "Africa/Nairobi", "emoji" => "🇰🇪", "lat" => -1.2921, "long" => 36.8219, "offset" => 0, "id" => "KE-30"));
//array_push($locations, array("name" => "Cairo", "timezone" => "Africa/Cairo", "emoji" => "🇪🇬", "lat" => 30.0444, "long" => 31.2357, "offset" => 0, "id" => "EG-C"));
array_push($locations, array("name" => "Lagos", "timezone" => "Africa/Lagos", "emoji" => "🇳🇬", "lat" => 6.5244, "long" => 3.3792, "offset" => 0, "id" => "NG-LA"));
array_push($locations, array("name" => "Paris", "timezone" => "Europe/Paris", "emoji" => "🇫🇷", "lat" => 48.8728, "long" => 2.3701, "offset" => 0, "id" => "FR-IDF"));
//array_push($locations, array("name" => "Amsterdam", "timezone" => "Europe/Amsterdam", "emoji" => "🇳🇱", "lat" => 52.3673, "long" => 4.8998, "offset" => 0, "id" => "NL-AMS"));
array_push($locations, array("name" => "London", "timezone" => "Europe/London", "emoji" => "🇬🇧", "lat" => 51.5072, "long" => -0.1276, "offset" => 0, "id" => "GB-LND"));
array_push($locations, array("name" => "Manchester", "timezone" => "Europe/London", "emoji" => "🇬🇧", "lat" => 53.701, "long" => -2.282, "offset" => 0, "id" => "GB-MAN"));
array_push($locations, array("name" => "Tucumán", "timezone" => "America/Argentina/Tucuman", "emoji" => "🇦🇷", "lat" => -26.8326, "long" => -65.2128, "offset" => 0, "id" => "AR-TUC"));
array_push($locations, array("name" => "New York", "timezone" => "America/New_York", "emoji" => "🇺🇸", "lat" => 40.7186, "long" => -73.948, "offset" => 0, "id" => "US-NY"));
//array_push($locations, array("name" => "Montreal", "timezone" => "America/Toronto", "emoji" => "🇨🇦", "lat" => 45.5019, "long" => -73.5674, "offset" => 0, "id" => "CA-MON"));
array_push($locations, array("name" => "Jackson", "timezone" => "America/Chicago", "emoji" => "🇺🇸", "lat" => 35.6331, "long" => -88.8208, "offset" => 0, "id" => "US-TN"));
array_push($locations, array("name" => "Los Angeles", "timezone" => "America/Los_Angeles", "emoji" => "🇺🇸", "lat" => 37.8024, "long" => -122.4058, "offset" => 0, "id" => "US-CA"));
// testing timezones not on whole hour offsets from UTC
//array_push($locations, array("name" => "Sri Lanka", "timezone" => "Asia/Colombo", "emoji" => "🇱🇰", "lat" => 37.775, "long" => -122.4183333, "offset" => 0, "id" => "LK-11"));
//array_push($locations, array("name" => "Kathmandu", "timezone" => "Asia/Kathmandu", "emoji" => "🇳🇵", "lat" => 37.775, "long" => -122.4183333, "offset" => 0, "id" => "NP"));

// add offset in seconds for each
foreach ($locations as $location => $locationinfo) {
  $timeInLocation = new DateTime($now, new DateTimeZone($locations[$location]["timezone"]));
  $locations[$location]["offset"] = $timeInLocation->getOffset();
}

function parseString($str = "", $guessedtz = false) {
  // replace any . with :
  $str = preg_replace('/\./i', ':', $str);
  // guess if its am or pm
  $am = preg_match('/\Sam|\d\sam/i', $str) ? true : false;
  //$pm = preg_match('/\Spm|\d\spm/i', $str) ? true : false;
  $pm = !$am;
  // really crudely get the hour by parsing the string for an integer
  $hour = preg_match('/^\s\d|^\d/i', $str) ? intval($str) : -1;
  // and now crudely get the minute by looking for a colon and a number
  $minutes = array();
  preg_match('/:(\d*)/i', $str, $minutes);
  $minutes = isset($minutes[1]) ? intval($minutes[1]) : 0;
  //
  $timezone = false;
  $id = false;

  if ($hour > -1) {
    // fix for 12/24 conversion
    $hour = ($hour < 12 && $pm && !$am) ? $hour + 12 : $hour;
  }

  // begin guessing the timezone
  /*
  if (preg_match('/(australia|aus|sydney|melbourne|brisbane|aest|syd|nsw|jen|koala|kangaroo|dingo)$/i', $str)) {
    $timezone = "Australia/Sydney";
    $id = "AU-NSW";
  }

  if (preg_match('/(china|ch|chn|shanghai|beijing|cst|pvg|pek)$/i', $str)) {
    $timezone = "Asia/Shanghai";
    $id = "CN-SH";
  }

  if (preg_match('/(qatar|doha|dia|dfi)$/i', $str)) {
    $timezone = "Asia/Qatar";
    $id = "QA";
  }
  if (preg_match('/(taipei|taiwan|chlo|chlovis|tpe|twn)$/i', $str)) {
    $timezone = "Asia/Taipei";
    $id = "TW-TPE";
  }
  */
  if (preg_match('/(tbilisi|georgia|get|tsb)$/i', $str)) {
    $timezone = "Asia/Tbilisi";
    $id = "GE-TB";
  }

  if (preg_match('/(nairobi|kenya|ken|eat|nbo)$/i', $str)) {
    $timezone = "Africa/Nairobi";
    $id = "KE-30";
  }
  /*
  if (preg_match('/(cairo|eqypt|egy|eest|cai|yasien|pyramids)$/i', $str)) {
    $timezone = "Africa/Cairo";
    $id = "EG-C";
  }
  */
  if (preg_match('/(lagos|nigeria|nga|wast|los|mazi)$/i', $str)) {
    $timezone = "Africa/Lagos";
    $id = "NG-LA";
  }
  /*
  if (preg_match('/(amsterdam|ams|holland|netherlands|liv|lieveke|ein|rtm)$/i', $str)) {
    $timezone = "Europe/Amsterdam";
    $id = "FR-IDF";
  }
  */
  if (preg_match('/(paris|par|france|fr|cet|cest|cdg|luis)$/i', $str)) {
    $timezone = "Europe/Paris";
    $id = "FR-IDF";
  }

  if (preg_match('/(london|britain|england|uk|gb|bst|gmt|lhr|ldn|thomas)$/i', $str)) {
    $timezone = "Europe/London";
    $id = "GB-LND";
  }

  if (preg_match('/(manchester|mike|man|manc|🐝|bee|joe)$/i', $str)) {
    $timezone = "Europe/London";
    $id = "GB-MAN";
  }

  if (preg_match('/(tucumán|tucuman|tuc|argentina|ar|art|pablo)$/i', $str) && !preg_match('/(qatar)$/i', $str)) {
    // "ar" was matching the "ar" in "qatar" and returning this instead of "Asia/Qatar"
    // need a better "matching" system
    $timezone = "America/Argentina/Tucuman";
    $id = "AR-TUC";
  }

  /*
  if (preg_match('/(toronto|montreal|mon|patrick|yul|yyz)$/i', $str)) {
    $timezone = "America/Toronto";
    $id = "CA-MON";
  }
  */

  if (preg_match('/(ny|nyc|new york|new york city|edt|est|jfk)$/i', $str)) {
    $timezone = "America/New_York";
    $id = "US-NY";
  }

  if (preg_match('/(jackson|memphis|tennessee|nashville|tn|cst|cdt|tim)$/i', $str)) {
    $timezone = "America/Chicago";
    $id = "US-TN";
  }

  if (preg_match('/(la|los angeles|san francisco|sf|lax|sfo|pst|pdt|ca|myles)$/i', $str) && !preg_match('/(koala)$/i', $str)) {
    $timezone = "America/Los_Angeles";
    $id = "US-CA";
  }

  return array("am" => $am, "pm" => $pm, "timezone" => $timezone, "hour" => $hour, "minutes" => $minutes, "guessed_timezone" => $guessedtz, "id" => $id);
}

function generateResponseString($time_properties, $type = "text") {
  global $locations, $datetime, $format;
  $time_str = "";
  if(isset($time_properties) && isset($time_properties['timezone']) && $time_properties['timezone'] === false && $type === "html") {
    // default to converting time to guessed timezone or UTC on the web
    if (isset($time_properties['guessed_timezone']) && $time_properties['guessed_timezone'] !== false) {
      $time_properties['timezone'] = $time_properties['guessed_timezone'];
    } else {
      $time_properties['timezone'] = "UTC";
    }
  }
  // if we got timezone convert, else just show times
  if(isset($time_properties) && isset($time_properties['timezone']) && $time_properties['timezone'] !== false && isset($time_properties['id']) && $time_properties['id'] !== false) {
    // timezone specified
    $datetime->setTimezone(new DateTimeZone($time_properties['timezone']));
    // do we have an hour?
    if ($time_properties['hour'] > -1) {
      $datetime->setTime($time_properties['hour'], $time_properties['minutes']);
      if ($type === "html") {
        foreach ($locations as $location) {
          $datetime->setTimezone(new DateTimeZone($location["timezone"]));
          $hightlight = ($time_properties['id'] === $location["id"]) ? " o-conversion__highlight" : "";
          $time_str = $time_str."<span class=\"o-conversion__location".$hightlight."\"><span class=\"o-conversion__emoji\">".$location["emoji"]."</span><span class=\"o-conversion__name\">".$location["name"]."</span><span class=\"o-conversion__time\">".$datetime->format("h:i")."</span><span class=\"o-conversion__am-pm\">".$datetime->format("a")."</span></span>";
        }
      } else {
        foreach ($locations as $location) {
          if ($time_properties['id'] === $location["id"]) {
            $time_str = $time_str."\n".$location["emoji"]." ".$datetime->format($format)." in ".$location["name"]." is:"."\n"."\n";
          }
        }
        foreach ($locations as $location) {
          if ($time_properties['id'] !== $location["id"]) {
            $datetime->setTimezone(new DateTimeZone($location["timezone"]));
            $time_str = $time_str.$location["emoji"]." ".$datetime->format($format)." - ".$location["name"]."\n";
          }
        }
      }
    } else {
      // no hour, but a city given
      foreach ($locations as $location) {
        if ($time_properties['id'] === $location["id"]) {
          if ($type === "html") {
            $time_str = $time_str."Time in <span class=\"o-conversion__highlight\">".$location["name"]."</span> is <span class=\"o-conversion__highlight\">".$datetime->format($format)."</span><br>";
          } else {
            $time_str = $time_str.$location["emoji"]." The time in ".$location["name"]." is ".$datetime->format($format)."\n";
          }
        }
      }
    }
  } else {
    // no timezone specified
    foreach ($locations as $location) {
      $datetime->setTimezone(new DateTimeZone($location["timezone"]));
      if ($type === "html") {
        $time_str = $time_str."<span class=\"o-conversion__location\"><span class=\"o-conversion__emoji\">".$location["emoji"]."</span><span class=\"o-conversion__name\">".$location["name"]."</span><span class=\"o-conversion__time\">".$datetime->format("h:i")."</span><span class=\"o-conversion__am-pm\">".$datetime->format("a")."</span></span>";
      } else {
        $time_str = $time_str.$location["emoji"]." ".$datetime->format($format)." - ".$location["name"]."\n";
      }
    }
  }

  return $time_str;
}
?>
