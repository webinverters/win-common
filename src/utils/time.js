/**
 * Created by justin on 2015-03-08.
 */
var moment = require('moment-timezone');

var common = {};

module.exports = common;


common.SECONDS_PER_DAY = 86400;
common.SECONDS_PER_HOUR = 3600;
common.SECONDS_PER_15_MINUTES=900;
common.MINUTES_PER_DAY=1440;


common.JAN_1st_2014 = 1388552400;  //'Jan 1st 0:0:0 GMT Epoch'
common.JAN_1st_2014_GMT = 1388534400;

common.SEPT_1st_2014 = 1409529600;
common.SEPT_1st_2014_EDT = 1409544000;

common.SEPT_10th_2014 = 1410307200;
common.SEPT_10th_2014_EDT = 1410321600;


common.NOV_1st_2014 = 1414814400; // EDT
common.MARCH_8th_2014 = 1394254800; // EST

common.tz = {
  toronto: 'America/Toronto'
};

var defaultTimezone = common.tz.toronto;

common.calendarMonth = function (timestamp, tz) {
  tz = tz || defaultTimezone;  // HACK that we are specifying Toronto here by default...
  return moment(timestamp*1000).tz(tz).month();
};

common.daysInMonth = function (timestamp, tz) {
  tz = tz || defaultTimezone;  // HACK that we are specifying Toronto here by default...
  return moment(timestamp*1000).tz(tz).daysInMonth();
};

common.isMidnightGMT = function(epoch) {
  return epoch % common.SECONDS_PER_DAY == 0;
};

common.dayOfWeek = function(epoch, tz) {
  tz = tz || defaultTimezone;  // HACK that we are specifying Toronto here by default...
  return moment(epoch*1000).tz(tz).day();
};

common.range = function(start, end, period) {
  var values = [start];
  while (start < end) {
    start += period;
    values.push(start);
  }
  return values;
};

common.getMonthRangesForTouchingMonths = function(start, end, tz) {
  var result = [];
  tz = tz || defaultTimezone;
  var monthStart = moment.unix(start).tz(tz).startOf('month');
  var endMonthStart = moment.unix(end).tz(tz).startOf('month');

  var currMonth = monthStart;
  do  {
    result.push({
      month: currMonth.format('MMM'),
      idx: currMonth.month(),
      start: currMonth.unix(),
      end: currMonth.endOf('month').unix()
    });
    currMonth.startOf('month').add(1, 'month');
  } while (currMonth <= endMonthStart);

  return result;
};

common.duplicate = function(val, numberOfTimes) {
  var expected = [];
  for(var i=0;i<numberOfTimes;i++){
    expected.push(val);
  }
  return expected;
};

common.epoch = function(dateStr, tz) {
  tz = tz || defaultTimezone;
  return moment.tz(dateStr, 'MM/DD/YYYY',tz).unix();
};

common.getEpochTime = function(dateStr, tz) {
  tz = tz || defaultTimezone;
  return moment.tz(dateStr,tz).unix();
};

common.beginningOfDayGMT = function(time) {
  return Math.floor(time/common.SECONDS_PER_DAY)*common.SECONDS_PER_DAY;
};

common.beginningOfDayEpoch = function(time, tz) {
  tz = tz || defaultTimezone;  // HACK that we are specifying Toronto here by default...
  return moment(time*1000).tz(tz).startOf('day').unix();
};

common.toUnixTimestamp = function(num) {
  return Math.floor(num/1000);
};

common.addDays = function(start, dayCount) {
  return moment.unix(start).add(dayCount, 'day').unix();
};

common.generateIntervals = function(config) {
  var result = [];
  var currTime = config.start;
  while(currTime < config.end) {
    var start = currTime;
    var duration = common.getIntervalDuration(config, start);
    var end = currTime + duration;
    if (end > config.end) {
      end = config.end;
      duration = end-start;
    }

    result.push({
      start: start,
      end: end,
      duration: duration
    });

    currTime += duration;
  }

  return result;
};

common.getIntervalDuration = function(config, start) {
  if (_.isNumber(config.resolution) && config.resolution < common.SECONDS_PER_DAY) {
    return config.resolution;
  }

  if (config.resolution == 'month') {
    var startMoment = moment.tz(start*1000,config.timezone);
    var endMoment = moment.tz(start*1000,config.timezone).add(1, "month");
    return endMoment.diff(startMoment) / 1000;
  }

  if (config.resolution == 'day' || config.resolution == common.SECONDS_PER_DAY) {
    var startMoment = moment.tz(start*1000,config.timezone);
    var endMoment = moment.tz(start*1000,config.timezone).add(1, "day");
    return endMoment.diff(startMoment) / 1000;
  }
};

common.getCurrentTime=function(){
  return moment().unix();
};