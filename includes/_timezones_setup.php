<?php
date_default_timezone_set("UTC");

// set up vars
$now = date("Y-m-d H:i:s");
$datetime = new DateTime($now, new DateTimeZone('UTC'));
$locations = array();

// our locations
array_push($locations, array("name" => "Paris", "timezone" => "Europe/Paris", "emoji" => "🇫🇷", "lat" => 48.866667, "long" => 2.333333, "offset" => 0));
array_push($locations, array("name" => "Manchester", "timezone" => "Europe/London", "emoji" => "🇬🇧", "lat" => 53.4808, "long" => 2.2426, "offset" => 0));
array_push($locations, array("name" => "Tucumán", "timezone" => "America/Argentina/Tucuman", "emoji" => "🇦🇷", "lat" => -26.8166667, "long" => -65.2166667, "offset" => 0));
array_push($locations, array("name" => "New York", "timezone" => "America/New_York", "emoji" => "🇺🇸", "lat" => 40.7141667, "long" => -74.0063889, "offset" => 0));
array_push($locations, array("name" => "Memphis", "timezone" => "America/Chicago", "emoji" => "🇺🇸", "lat" => 35.6331, "long" => -88.8208, "offset" => 0));
array_push($locations, array("name" => "San Francisco", "timezone" => "America/Los_Angeles", "emoji" => "🇺🇸", "lat" => 37.775, "long" => -122.4183333, "offset" => 0));

// add offset in seconds for each
foreach ($locations as $location => $locationinfo) {
  $timeInLocation = new DateTime($now, new DateTimeZone($locations[$location]["timezone"]));
  $locations[$location]["offset"] = $timeInLocation->getOffset();
}
?>
