timezones.Helpers.moonphase = function() {
  /*
  A rehashed version of https://gist.github.com/L-A/3497902
  */
  var AG = 0;
  var phase = "";
  var phaseEmojis = ["🌑","🌒","🌓","🌔","🌕","🌖","🌗","🌘"];
  var emoji = "🌘";
  var now = new Date();
  var year = now.getUTCFullYear();
  var month = now.getUTCMonth() + 1;
  var day = now.getUTCDate();
  var YY = 0,
    MM = 0,
    K1 = 0,
    K2 = 0,
    K3 = 0,
    JD = 0,
    IP = 0;

  // calculate the Julian date at 12h UT
  YY = year - Math.floor((12 - month) / 10);
  MM = month + 9;
  if(MM >= 12) {
    MM = MM - 12;
  }

  K1 = Math.floor(365.25 * ( YY + 4712 ));
  K2 = Math.floor(30.6 * MM + 0.5);
  K3 = Math.floor(Math.floor((YY / 100) + 49) * 0.75) - 38;

  JD = K1 + K2 + day + 59;            // for dates in Julian calendar
  if(JD > 2299160) {
    JD = JD - K3;      // for Gregorian calendar
  }

  // calculate moon's age in days
  IP = (JD - 2451550.1) / 29.530588853;
  IP = IP - Math.floor(IP);
  if(IP < 0) {
    IP = IP + 1;
  }
  AG = IP * 29.53;

  if(AG < 1.84566) {
    phase = "A new moon";
    emoji = phaseEmojis[0];
  } else if(AG <  5.53699) {
    phase = "An evening crescent";
    emoji = phaseEmojis[1];
  } else if(AG < 9.22831) {
    phase = "A first quarter";
    emoji = phaseEmojis[2];
  } else if(AG < 12.91963) {
    phase = "A waxing gibbous";
    emoji = phaseEmojis[3];
  } else if(AG < 16.61096) {
    phase = "A full moon";
    emoji = phaseEmojis[4];
  } else if(AG < 20.30228) {
    phase = "A waning gibbous";
    emoji = phaseEmojis[5];
  } else if(AG < 23.99361) {
    phase = "A Last quarter";
    emoji = phaseEmojis[6];
  } else if(AG < 27.68493) {
    phase = "A Morning crescent";
    emoji = phaseEmojis[7];
  } else {
    phase = "A new moon";
    emoji = phaseEmojis[0];
  }

  return {
    phase: phase,
    emoji: emoji,
  };
};
