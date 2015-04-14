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
  config = config || {};
  config = _.defaults(config, {
    name: 'AppLog',
    errorFile: './errors.log',
    logFile: './info.log',
    debug: false,
    slackLoggingEnabled: false,
    slackConfig: {
      webhook_url: "",
      channel: "",
      username: "bot"
    }
  });

  var bunyanConf = {
    src: config.debug,
    name: config.name,
    streams: [],
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
      level: config.debug ? 'debug' : 'info',
      type: 'rotating-file',
      period: '1d',
      count: 7,
      path: config.logFile
    });
  }

  var PrettyStream = require('bunyan-prettystream');
  var prettyStdOut = new PrettyStream();
  prettyStdOut.pipe(process.stdout);
  if (config.debug) {
    bunyanConf.streams.push(
    {
      level: 'info',  // dont show debug level in console since it is going to the logFile by default anyways.
      type: 'raw',
      stream: prettyStdOut
    });
    console.warn('Debug Logging Is Enabled.  This is OK if it is not production');
  } else {
    bunyanConf.streams.push({
      level: 'info',
      stream: prettyStdOut           // log INFO and above to stdout
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

  log.log = log.info;

  log.debug = log.debug;

  log.logWarn = log.warn;

  /**
   * Logs errors to errorFile (if specified).  By default this will be "errors.log".
   */
  log.logError = log.error;

  log.logFatal = log.fatal;

  return log;
};