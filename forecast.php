<?php

include "includes/_forecast.php";
include "includes/_forecastapi.php";

use Forecast\Forecast;

if(!isset($_GET['lat']) || !isset($_GET['long']) || !isset($forecastapi)) {
  die();
}

$forecast = new Forecast($forecastapi);

echo json_encode($forecast->get($_GET['lat'], $_GET['long'], null, array('exclude' => 'flags,minutely,hourly,daily,alerts')));

?>
