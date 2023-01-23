<?php

include "includes/_visualCrossingApiKey.php";

function getForecast($latitude, $longitude) {

  $endPoint = 'https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/';

  $options = [
    'unitGroup' => 'metric',
    'elements' => 'tempmax,tempmin,temp,feelslike,precipprob,sunrise,sunset,moonphase,conditions,icon',
    'include' => 'fcst,current',
    'key' => getenv('KEY'),
    'contentType' => 'json',
  ];

  $request_url = $endPoint.$latitude.'%2C'.$longitude.'/today?'.http_build_query($options);

  $response = json_decode(file_get_contents($request_url));
  $response->headers = $http_response_header;
  return $response;
}


if(!isset($_GET['lat']) || !isset($_GET['long'])) {
  die();
}

echo json_encode(getForecast($_GET['lat'], $_GET['long']));

?>
