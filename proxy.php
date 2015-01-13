<?php
// File Name: proxy.php
// get a Forecast.io key here: https://developer.forecast.io/
$api_key = 'forecast api key';

$API_ENDPOINT = 'https://api.forecast.io/forecast/';
$url = $API_ENDPOINT . $api_key . '/';

if(!isset($_GET['url'])) die();
$url = $url . urldecode($_GET['url']);
$url = file_get_contents($url);

print_r($url);

?>