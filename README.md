# A17 Timezones

AREA 17 covers multiple timezones around the world. This project displays each timezone, shows the current weather and temperature in the city using Forecast.io and allows you to type a time to see what that time is in the other A17 timezones.

## 2017 Refresh

* Redesigned to reflect new AREA17 website.
* Added HipChat integration with hook '/time' which is powered by a PHP file.
* Timezone differences and conversions are done via shared PHP now.
* Written out moment.js and moment-timezones.js and replaced with using PHP to provide timezone info. Takes 130kb off the JS weight.
* Written out ForecastIO.js which caused a hang on load. Replaced with a different PHP proxy to ajax weather info. Much faster, no hang and reduces JS by 20kb.
* Added display of feels like temperature and % chance of rain, with emoji.

Timezone conversion, in page and in Hipchat can accept:

* `5:12pm NYC` which will convert 5:12pm to the other time zones
* `Paris` which will show you the current time in Paris
* *HipChat only* `/time` which prints out the current time in all timezones

The A17 locale info is reasonably loose - you can use city, country, state, local airport code and in some instances staff member names.


## Developing

### Grunt Tasks:

    $ grunt
    $ grunt watch

For dev purposes: concats but doesn't minify CSS/JS and places the compiled files in /css/ and /js/. These files are not committed to the GIT repo.

    $ grunt dist

Concats and minifies CSS/JS and places the compiled files in /css/ and /js/. These files are not committed to the GIT repo.


### When starting development:

You'll probably want to run:

    $ grunt && grunt watch


### Breakpoints

We have some very very basic responsive happening. There is a $breakpoints sassmap in the _variables.scss. To target a breakpoint in the SASS you need to:

    @include breakpoint(small) {
      .foo { ... }
    }

These values are read by JavaScript and stored in a variable:

    timezones.media_query_in_use

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

### no jQuery

Uses my fork of Remy Sharp's min.js - https://github.com/13twelve/min_v1.js

