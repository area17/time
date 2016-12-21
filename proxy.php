<?php
// File Name: proxy.php
// get a Forecast.io key here: https://darksky.net/dev/
$api_key = '7eb59add2436baa58f08399b9fc177e7';

$API_ENDPOINT = 'https://api.darksky.net/forecast/';
$url = $API_ENDPOINT . $api_key . '/';

if(!isset($_GET['url'])) die();
$url = $url . urldecode($_GET['url']);
$url = file_get_contents($url);

print_r($url);

?>
