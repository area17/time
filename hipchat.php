<?php
  include 'includes/_timezones_setup.php';

  /*
  test with curl:
  curl -H "Content-Type: application/json" -X POST -d '{"item":{"message":{"date":"2016-12-21T14:22:06.878382+00:00","message":"/time 5.12pm London"}}}' http://a17_timezones.localip/hipchat.php

  curl -H "Content-Type: application/json" -X POST -d '{"item":{"message":{"date":"2016-12-21T14:22:06.878382+00:00","message":"/time Paris"}}}' http://a17_timezones.localip/hipchat.php

  curl -H "Content-Type: application/json" -X POST -d '{"item":{"message":{"date":"2016-12-21T14:22:06.878382+00:00","message":"/time"}}}' http://a17_timezones.localip/hipchat.php
  */

  // determining if there is useful POST info
  $post = file_get_contents('php://input');
  $post_json = json_decode($post);
  $post_msg = $post_json->item->message->message;

  if(isset($post_msg)) {
    // replace out the "/time" bit
    $post_msg = preg_replace('/\/time/i', '', $post_msg);
    //
    $time_properties = parseString($post_msg);
    $message_str = generateResponseString($time_properties,"text");
  } else {
    $message_str = generateResponseString(null,"text");
  }

  $json = array('color' => 'gray', "message" => $message_str, "notify" => "false", "message_format" => "text", "from" => "http://time.area17.com/");
  echo json_encode($json);
  //echo $message_str;
?>
