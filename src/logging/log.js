/**
 * @module log
 * @summary: Provides comprehensive logging facilities.
 *
 * @description:
 *
 * Author: justin
 * Created On: 2015-03-27.
 * @license Apache-2.0
 */
'use strict';
var bunyan = require('bunyan');
var _ = require('lodash');

module.exports = function construct(config, logProvider) {
  var m = {};

  config = config || {};
  config = _.defaults(config, {
    name: 'AppLog',
    errorFile: './errors.log',
    logFile: './info.log',
    debug: true,
    slackLoggingEnabled: false,
    slackConfig:{
      webhook_url: "https://hooks.slack.com/services/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",
      channel: "shopswithoutstops",
      username: "sws-platform"
    },
    global: true
  });

  var bunyanConf = {
    src: config.debug,
    name: config.name,
    streams: [
      {
        level: 'info',
        stream: process.stdout            // log INFO and above to stdout
      }
    ],
    serializers: {
      err: bunyan.stdSerializers.err
    }
  };

  if (config.errorFile) {
    bunyanConf.streams.push({
      level: 'error',
      type: 'rotating-file',
      period: '1d',
      count: 30,
      path: config.errorFile
    });
  }

  if (config.logFile) {
    bunyanConf.streams.push({
      level: 'info',
      type: 'rotating-file',
      period: '1d',
      count: 7,
      path: config.logFile
    });
  }

  if (config.slackLoggingEnabled) {
    var BunyanSlack = require('bunyan-slack');
    bunyanConf.stream = new BunyanSlack(config.slackConfig, function(error){
      console.log(error);
    });
  }

  var log = logProvider || bunyan.createLogger(bunyanConf);

  /**
   * Often you may be using external log rotation utilities like logrotate on Linux
   * or logadm on SmartOS/Illumos. In those cases, unless your are ensuring "copy and truncate"
   * sematics (via copytruncate with logrotate or -c with logadm) then the fd for your
   * 'file' stream will change. You can tell bunyan to reopen the file stream with code
   * like this in your app:
   */
  process.on('SIGUSR2', function () {
    log.reopenFileStreams();
  });

  m.log = function() {
    log.info.apply(log,arguments);
  };

  m.debug = function() {
    log.debug.apply(log,arguments);
  };

  m.logWarn = function() {
    log.warn.apply(log, arguments);
  };

  /**
   * Logs errors to errorFile (if specified).  By default this will be "errors.log".
   */
  m.logError = function() {
    log.error.apply(log,arguments);
  };

  m.logFatal = function() {
    log.fatal.apply(log,arguments);
  };

  return m;
};