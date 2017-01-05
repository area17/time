<?php

include "includes/_forecast.php";

use Forecast\Forecast;

if(!isset($_GET['lat']) || !isset($_GET['long'])) {
  die();
}

$forecast = new Forecast('7eb59add2436baa58f08399b9fc177e7');

echo json_encode($forecast->get($_GET['lat'], $_GET['long'], null, array('exclude' => 'flags,minutely,hourly,daily,alerts')));

?>
