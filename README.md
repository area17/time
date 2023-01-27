# A17 Timezones

AREA 17 covers multiple timezones around the world. This project displays each timezone, shows the current weather and temperature in the city using Forecast.io and allows you to type a time to see what that time is in the other A17 timezones.

<a href="https://time.area17.com/" target="blank">time.area17.com</a>

Default settings are:
* digital clock
* 12 hour time format
* temperature displayed
* degrees Celsius

Optionally can:
* show an analogue clock
* show 24 hour time format for the digital clocks
* hide the current temperature
* show weather information (with rain chance %age, feels like temperature)

## Timezone conversion

Timezone conversion, in page and in Hipchat can accept:

* `5:12pm NYC` which will convert 5:12pm to the other time zones
* `Paris` which will show you the current time in Paris
* `Tim` which will show you the current time in Tennessee
* `6pm Pablo` which will convert 6pm Tucumán to the other time zones

The A17 locale info is [reasonably loose](https://github.com/area17/time/blob/master/includes/_timezones_setup.php#L48) - you can use city, country, state, local airport code and in some instances staff member names. 

NB: If Pablo is in the New York office, time.area17.com doesn't know that and so will always show his time as being in Tucumán.

### In Slack

For A17 staff who use Slack, there is a `/time` command available in project rooms:

* `/time` which prints out the current time in all timezones
* `/time Paris` which prints out the current time in Paris
* `/time 3:30pm NYC` which will convert 3:30pm NYC to the other time zones
* `/time Tim` which prints out the current time for Tim in Tennessee
* `/time 6pm Mike` which will convert 6pm UK to the other time zones

## Screen saver mode

Appending `?screensaver=true` to the URL switches the JavaScript to check for query string parameters for its settings and for the CSS to hide the conversion and settings prompt: <a href="https://time.area17.com/" target="blank">time.area17.com?screensaver=true</a>.

Used in [A17TimeZones-ScreenSaver](https://github.com/area17/A17TimeZones-ScreenSaver).

Additional parameters set different options:

* `&clocktype=analogue` - sets the clock type to analogue
* `&digitalformat=24` - sets the digital time format to 24 hour
* `&temperature=false` - hides the temperature display
* `&weather=true` - shows the weather info
* `&temperatureunits=fahrenheit` - switches temperature units to Fahrenheit


## 2017 Refresh 1 (v2)

* Redesigned to reflect new AREA17 website,
* Added HipChat integration with hook '/time' which is powered by a PHP file,
* Timezone differences and conversions are done via shared PHP now,
* Written out moment.js and moment-timezones.js and replaced with using PHP to provide timezone info. Takes 130kb off the JS weight,
* Written out ForecastIO.js which caused a hang on load. Replaced with a different PHP proxy to ajax weather info. Much faster, no hang and reduces JS by 20kb,
* Added display of feels like temperature and % chance of rain, with emoji.

## 2017 Refresh 2 (v3)

* Redesigned to reflect [David's](https://area17.com/about/david-lamothe) art direction,
* Written out skycons.js to use emoji to display the weather instead, looses 20kb (7kb minified) JavaScript,
* Written out min.js as it was using an old version, looses 3kb (1kb minified) JavaScript,
* Split the clock types up into separate behaviors
* Updated settings panel
* Updated JavaScript and SCSS to be A17 Boilerplate structure,
* Updated SCSS to use BEM,
* Added moon phase display of the moon on clear nights,
* Settings method revamped to use an internal object,
* Added screen saver mode with parameter controlled options,
* Somehow dropped the minified CSS down another 2kb

### v3.0.1

* updated footer links

### v3.0.2

* using SVG use to repeat icons rather than have an animated safe list. First step to icon optimisation.

### v3.0.5

* added Los Angeles as Myles is out in LA
* renamed Memphis to Jackson as Tim is in Jackson TN and not Memphis TN

### v3.0.6

* `npm audit fix`

### v3.0.7

* Added Lagos, Cairo, Nairobi and Shanghai (to make an even 10)

### v3.0.8

* Digital clock layout fix
* adding package.json version number to CSS and JS file src to combat cache for screen savers

### v3.0.9

* Refactored analogue clock JS to have more accurate display and removed `-webkit` prefixed props
* Dropping Cairo and Shaghai timezones

### v3.0.10

* Added Australia Eastern Standard time for Jen
* Also added Doha to balance the list out

### v3.0.11

* Added Amsterdam as Liv is currently living there
* Added Cairo for our new hire, Yasien
* Moved Luis back to Paris
* Removed Doha and Australia - Jen is now in London

### v3.1.0

* Moved to a Webpack build process from Grunt
* `sw.js` created from dedicated `workbox` task

### v3.1.1

* include re-exported icons with paths split out
* adds animated snow, fog and wind
* updates animated sun, cloudy day, cloudy night

### v3.2.0

* migrate away from Dark Sky weather API to Visual Crossing weather API
* removed Cairo and Taipai
* added London and Montreal
* on time convert, guess a location ID not a timezone, so we can have multiple locations in a single timezone
* reveal more weather data when hovering location weather
* style scrollbars

### v3.2.1

* removed Montreal, added Tbilisi
* showing weather API credit in screen saver mode (its been removed from the latest version of the screen saver)

## Developing

### API key

For the weather conditions time.area17.com uses [Visual Crossing](https://www.visualcrossing.com/) which needs an API key. The API key lives in `/includes/_visualCrossingApiKey.php` and can be found in the A17 Redux vault.

### Node Tasks:

    $ npm install
    $ npm run build

For dev purposes: concats but doesn't minify CSS/JS and places the compiled files in `/css/` and `/js/`. These files are not committed to the GIT repo.

    $ npm run prod

Concats and minifies CSS/JS and places the compiled files in /css/ and /js/. These files are not committed to the GIT repo.


### When starting development:

You'll probably want to run:

    $ npm run watch


### Breakpoints

We have some very very basic responsive happening. There is a $breakpoints sassmap in the _variables.scss. To target a breakpoint in the SASS you need to:

    @include breakpoint(small) {
      .foo { ... }
    }

These values are read by JavaScript and stored in a variable:

    timezones.currentMediaQuery

This variable is updated as breakpoints are crossed.

Currently _body.scss manually lists the breakpoints. When grunt-sass supports looping of maps we can use:

    @each $name, $point in $breakpoints {
      @include breakpoint('#{$name}') {
        head {
          font-family: '#{$name}';
        }
        body:after {
          content: '#{$name}';
        }
      }
    }

### git ignored

Among other things:

* compiled CSS
* compiled JS
* minified SVG
* env file

