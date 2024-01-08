<?php
  include 'includes/_timezones_setup.php';
  header('Content-Type: application/json');

  /*
  test with curl:

  curl -H "Content-Type: application/json" -X POST -d '{"token":"gIkuvaNzQIHg97ATvDxqgjtO", "team_id":"T0001", "team_domain":"example", "enterprise_id":"E0001", "enterprise_name":"Globular%20Construct%20Inc", "channel_id":"C2147483705", "channel_name":"test", "user_id":"U2147483697", "user_name":"Steve", "command":"/time", "text":"5:12pm London", "response_url":"https://hooks.slack.com/commands/1234/5678", "trigger_id":"13345224609.738474920.8088930838d88f008e0"}' https://time.area17.com/slack.php

  curl -H "Content-Type: application/json" -X POST -d '{"token":"gIkuvaNzQIHg97ATvDxqgjtO", "team_id":"T0001", "team_domain":"example", "enterprise_id":"E0001", "enterprise_name":"Globular%20Construct%20Inc", "channel_id":"C2147483705", "channel_name":"test", "user_id":"U2147483697", "user_name":"Steve", "command":"/time", "text":"paris", "response_url":"https://hooks.slack.com/commands/1234/5678", "trigger_id":"13345224609.738474920.8088930838d88f008e0"}' https://time.area17.com/slack.php

  curl -H "Content-Type: application/json" -X POST -d '{"token":"gIkuvaNzQIHg97ATvDxqgjtO", "team_id":"T0001", "team_domain":"example", "enterprise_id":"E0001", "enterprise_name":"Globular%20Construct%20Inc", "channel_id":"C2147483705", "channel_name":"test", "user_id":"U2147483697", "user_name":"Steve", "command":"/time", "text":"", "response_url":"https://hooks.slack.com/commands/1234/5678", "trigger_id":"13345224609.738474920.8088930838d88f008e0"}' https://time.area17.com/slack.php
  */

  // determining if there is useful POST info
  $post_msg = $_POST['text'];

  if(isset($post_msg)) {
    $time_properties = parseString($post_msg);
    $message_str = generateResponseString($time_properties,"text");
  } else {
    $message_str = generateResponseString(null,"text");
  }

  $json = array();
  $json['response_type'] = "in_channel";
  $json['text'] = $message_str;

  die(json_encode($json)); // exit JSON with die()
?>
