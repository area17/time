<!DOCTYPE html>
<?php
  $meta_title = "time.area17.com - AREA 17";
  $meta_social_title = "AREA 17";
  $meta_description = "Time, weather and timezone conversion between international A17 locations.";
  $meta_url = "http://time.area17.com/";
  $meta_image = "http://time.area17.com/img/og.png";
?>
<html dir="ltr" lang="en-US">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title><?php echo $meta_title; ?></title>
    <link href="/css/timezones.css" rel="stylesheet" />

    <?php if(isset($meta_social_title)) { ?>
    <meta property="og:title" content="<?php echo $meta_social_title ?>" />
    <meta name="twitter:title" content="<?php echo $meta_social_title ?>" />
    <meta itemprop="name" content="<?php echo $meta_social_title ?>">
    <?php } ?>

    <?php if(isset($meta_description)) { ?>
    <meta name="description" content="<?php echo $meta_description ?>">
    <meta property="og:description" content="<?php echo $meta_description ?>" />
    <meta name="twitter:description" content="<?php echo $meta_description ?>" />
    <meta itemprop="description" content="<?php echo $meta_description ?>">
    <?php } ?>

    <?php if(isset($meta_url)) { ?>
    <meta property="og:url" content="<?php echo $meta_url ?>" />
    <link rel="canonical" href="<?php echo $meta_url ?>" />
    <meta name="twitter:url" content="<?php echo $meta_url ?>" />
    <?php } ?>

    <?php if(isset($meta_image)) { ?>
    <meta property="og:image" content="<?php echo $meta_image ?>" />
    <meta property="og:image:width" content="1200" />
    <meta property="og:image:height" content="630" />
    <meta name="twitter:image" content="<?php echo $meta_image ?>">
    <meta itemprop="image" content="<?php echo $meta_image ?>">
    <?php } ?>

    <meta name="copyright" content="(c) <?php date_default_timezone_set('UTC'); echo date("Y"); ?> AREA 17" />

    <meta property="og:type" content="website" />
    <meta property="og:site_name" content="AREA 17" />
    <meta property="og:author" content="https://www.facebook.com/area17/" />
    <meta property="fb:admins" content="288673154639" />

    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:site" content="@opticalcortex" />
    <meta name="twitter:domain" content="area17.com" />
    <meta name="twitter:creator" content="@opticalcortex" />

    <link href="//www.area17.com/favicon-16.png" rel="icon" sizes="16x16" type="image/png">
    <link href="//www.area17.com/favicon-32.png" rel="icon" sizes="32x32" type="image/png">
    <link href="//www.area17.com/favicon-96.png" rel="icon" sizes="96x96" type="image/png">
    <link href="//www.area17.com/favicon-57.png" rel="apple-touch-icon" sizes="57x57">
    <link href="//www.area17.com/favicon-72.png" rel="apple-touch-icon" sizes="72x72">
    <link href="//www.area17.com/favicon-120.png" rel="apple-touch-icon" sizes="120x120">
    <link href="//www.area17.com/favicon-144.png" rel="apple-touch-icon" sizes="144x144">
    <link href="//www.area17.com/favicon-152.png" rel="apple-touch-icon" sizes="152x152">
    <link href="//www.area17.com/favicon-180.png" rel="apple-touch-icon-precomposed" sizes="180x180">

    <meta name="apple-mobile-web-app-title" content="AREA 17" />
    <meta name="format-detection" content="telephone=no" />

    <meta name="theme-color" content="#000000" />

    <meta name="msapplication-TileColor" content="#000000">
    <meta name="msapplication-TileImage" content="//www.area17.com/favicon-144.png">
  </head>
  <body>
    <div id="timezones">
