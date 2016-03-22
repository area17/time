<?php
  date_default_timezone_set("UTC");

  $time_str = "";
  //$format = 'h:i a j M';
  $format = 'h:i a';
  $datetime = new DateTime(date("Y-m-d H:i:s"),new DateTimeZone('UTC'));
  $locations = array();

  array_push($locations, array("name" => "Paris", "timezone" => "Europe/Paris", "emoji" => "🇫🇷"));
  array_push($locations, array("name" => "London", "timezone" => "Europe/London", "emoji" => "🇬🇧"));
  array_push($locations, array("name" => "Tucumán", "timezone" => "America/Argentina/Tucuman", "emoji" => "🇦🇷"));
  array_push($locations, array("name" => "New York", "timezone" => "America/New_York", "emoji" => "🇺🇸"));
  array_push($locations, array("name" => "Memphis", "timezone" => "America/Chicago", "emoji" => "🇺🇸"));
  array_push($locations, array("name" => "San Francisco", "timezone" => "America/Los_Angeles", "emoji" => "🇺🇸"));

  foreach ($locations as $location) {
    $datetime->setTimezone(new DateTimeZone($location["timezone"]));
    $time_str = $time_str.$location["emoji"]." ".$datetime->format($format)." - ".$location["name"]."\n";
  }

  $json = array('color' => 'gray', "message" => $time_str, "notify" => "false", "message_format" => "text", "from" => "http://time.area17.com/");
  echo json_encode($json);
?>