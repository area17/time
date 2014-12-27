/**
 * Helper Class for forecast.io webservice
 * Requires moment.js for date help.
 */

function ForecastIO() {
  PROXY_SCRIPT = '/proxy.php';

  this.requestData = function(latitude, longitude) {
    request_url = PROXY_SCRIPT + '?url=' + latitude + ',' + longitude + '?exclude=minutely,hourly,daily,alerts,flags';
    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function() {
      if(xhr.readyState==4 && xhr.status==200) {
            content = xhr.responseText;
          }
    }
    xhr.open('GET', request_url, false);
    xhr.send();

        if(content != '' && (content)) {
      return JSON.parse(content);
    } else {
      return false;
    }
  }
  /**
   * Will return the current conditions
   *
   * @param float $latitude
   * @param float $longitude
   * @return \ForecastIOConditions|boolean
   */
  this.getCurrentConditions = function(latitude, longitude) {
    var data = this.requestData(latitude, longitude);
    if(data !== false) {
      return new ForecastIOConditions(data.currently);
    } else {
      return false;
    }
  }
  /**
   * Will return conditions on hourly basis for today
   *
   * @param type $latitude
   * @param type $longitude
   * @return \ForecastIOConditions|boolean
   */
  this.getForecastToday = function(latitude, longitude) {
    data = this.requestData(latitude, longitude);
    if(data !== false) {
      conditions = [];
      today = moment().format("YYYY-MM-DD");
      for(i=0; i<data.hourly.data.length; i++) {
        raw_data = data.hourly.data[i];
        if(moment.unix(raw_data.time).format("YYYY-MM-DD") == today) {
          conditions.push(new ForecastIOConditions(raw_data));
        }
      }
      return conditions;
    } else {
      return false;
    }
  }
  /**
   * Will return daily conditions for next seven days
   *
   * @param float $latitude
   * @param float $longitude
   * @return \ForecastIOConditions|boolean
   */
  this.getForecastWeek = function(latitude, longitude) {
    data = this.requestData(latitude, longitude);
    if(data !== false) {
      conditions = [];
      for(i=0; i<data.daily.data.length; i++) {
        raw_data = data.daily.data[i];
        conditions.push(new ForecastIOConditions(raw_data));
      }
      return conditions;
    } else {
      return false;
    }
  }
}
/**
 * Wrapper for get data by getters
 */

function ForecastIOConditions(raw_data) {
  ForecastIOConditions.prototype = {
    raw_data: raw_data
  }
  /**
   * Will return the temperature
   *
   * @return String
   */
  this.getTemperature = function() {
    return raw_data.temperature;
  }
  /**
   * Get the summary of the conditions
   *
   * @return String
   */
  this.getSummary = function() {
    return raw_data.summary;
  }
  /**
   * Get the icon of the conditions
   *
   * @return String
   */
  this.getIcon = function() {
    return raw_data.icon;
  }
  /**
   * Get the time, when $format not set timestamp else formatted time
   *
   * @param String $format
   * @return String
   */
  this.getTime = function(format) {
    if(!format) {
      return raw_data.time;
    } else {
      return moment.unix(raw_data.time).format(format);
    }
  }
  /**
   * Get the pressure
   *
   * @return String
   */
  this.getPressure = function() {
    return raw_data.pressure;
  }
  /**
   * get humidity
   *
   * @return String
   */
  this.getHumidity = function() {
    return raw_data.humidity;
  }
  /**
   * Get the wind speed
   *
   * @return String
   */
  this.getWindSpeed = function() {
    return raw_data.windSpeed;
  }
  /**
   * Get wind direction
   *
   * @return type
   */
  this.getWindBearing = function() {
    return raw_data.windBearing;
  }
  /**
   * get precipitation type
   *
   * @return type
   */
  this.getPrecipitationType = function() {
    return raw_data.precipType;
  }
  /**
   * get the probability 0..1 of precipitation type
   *
   * @return type
   */
  this.getPrecipitationProbability = function() {
    return raw_data.precipProbability;
  }
  /**
   * Get the cloud cover
   *
   * @return type
   */
  this.getCloudCover = function() {
    return raw_data.cloudCover;
  }
  /**
   * get the min temperature
   *
   * only available for week forecast
   *
   * @return type
   */
  this.getMinTemperature = function() {
    return raw_data.temperatureMin;
  }
  /**
   * get max temperature
   *
   * only available for week forecast
   *
   * @return type
   */
  this.getMaxTemperature = function() {
    return raw_data.temperatureMax;
  }
  /**
   * get sunrise time
   *
   * only available for week forecast
   *
   * @return type
   */
  this.getSunrise = function() {
    return raw_data.sunriseTime;
  }
  /**
   * get sunset time
   *
   * only available for week forecast
   *
   * @return type
   */
  this.getSunset = function() {
    return raw_data.sunsetTime;
  }
  /**
   * get precipitation intensity
   *
   * @return number
   */
  this.getPrecipIntensity = function() {
    return raw_data.precipIntensity;
  }
  /**
   * get dew point
   *
   * @return number
   */
  this.getDewPoint = function() {
    return raw_data.dewPoint;
  }
  /**
   * get the ozone
   *
   * @return number
   */
  this.getOzone = function() {
    return raw_data.ozone;
  }
}