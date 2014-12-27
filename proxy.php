<?php
// File Name: proxy.php

$api_key = '545ef329c18ffc30131b99714ec182ca';

$API_ENDPOINT = 'https://api.forecast.io/forecast/';
$url = $API_ENDPOINT . $api_key . '/';

if(!isset($_GET['url'])) die();
$url = $url . urldecode($_GET['url']);
$url = file_get_contents($url);

print_r($url);