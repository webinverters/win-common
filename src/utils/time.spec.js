/**
 * Created by justin on 2015-03-09.
 */

var common = require('./time');

describe('generateIntervals', function() {
  var config, m;

  beforeEach(function() {
    m = require('./time');
    config = {
      start: common.JAN_1st_2014, end: common.addDays(common.JAN_1st_2014, 5),
      resolution: common.SECONDS_PER_DAY,
      timezone: common.tz.toronto
    };
  });

  it('generates day intervals', function() {
    var intervals = m.generateIntervals(config);
    var curr = config.start;
    expect(intervals.length).to.equal(5);
    _.each(intervals, function(range) {
      expect(range.start).to.equal(curr);
      curr += common.SECONDS_PER_DAY;
      expect(range.end).to.equal(curr);
    });
  });

  it('generates day intervals and handles DST backward', function() {
    config.start = common.NOV_1st_2014;
    config.end = common.addDays(common.NOV_1st_2014, 5);

    var intervals = m.generateIntervals(config);
    var curr = config.start;
    expect(intervals.length).to.equal(5);
    _.each(intervals, function(range, idx) {
      expect(range.start).to.equal(curr);
      curr += common.SECONDS_PER_DAY;
      if (idx == 1) {
        expect(range.duration).to.equal(90000);
        curr += 3600; // DST day gains 1 hour.
      }
      expect(range.end).to.equal(curr);
    });
  });

  it('generates day intervals and handles DST forward', function() {
    config.start = common.MARCH_8th_2014;
    config.end = common.addDays(common.MARCH_8th_2014, 5);

    var intervals = m.generateIntervals(config);
    var curr = config.start;
    expect(intervals.length).to.equal(5);
    _.each(intervals, function(range, idx) {
      expect(range.start).to.equal(curr);
      var start = curr;
      curr += common.SECONDS_PER_DAY;
      if (idx == 1) {
        curr -= 3600; // DST day gains 1 hour.
      }
      expect(range.end).to.equal(curr);
      expect(range.duration).to.equal(curr-start);
    });
  });
});