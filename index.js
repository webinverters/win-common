/**
 * Created by justin on 2015-03-16.
 */

var _ = require('lodash');

module.exports = function construct(config) {
  var m = {};

  config = config || {};
  config = _.defaults(config, {
    projectRoot: null,
    useGlobals: true,
    useTestConfig: false,
    apiTestServer: null, // if you want the api test framework setup with super test and authentication helpers, pass in your server module here.
    logging: {
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
    }
  });

  /** Define rrequire
   *
   */
  if (config.projectRoot) {
    if (!global.rrequire) {
      global.rrequire = function(name) {
        var m;
        _.each(global.rrequire.basePaths, function(basedir) {
          try {
            m = require(path.join(basedir, name));
            return false; // break out of loop if the require succeeded.
          } catch(ex) {
            // intentionally swallow since some of the paths are expected to fail.
          }
        });

        if (m) return m;
        else {
          throw new Error('rrequire could not find module: ' + name);
        }
      };
      global.rrequire.basePaths = [];
    }
    global.rrequire.basePaths.push(config.projectRoot);
  }

  /**
   * Global.error is being used as a guard to prevent reinitializing if
   * win-common has already been initialized.
   */
  if (!global.error) {
    /** Setup Logging
     *
     */
    m.logger = require('./src/logging/log')(config.logging);

    /** Add globals if configured.
     *
     */
    if (config.useGlobals) {
      require('./src/globals');
      _.extend(global, m.logger);
      global.logger = m.logger;
    }

    /**
     * Add an error function that can be thrown
     * @param code
     * @param errDetails
     * @returns {Error}
     */
    global.error = function(code, errDetails) {
      m.logger.logError({errorCode: code, errorDetails: errDetails});
      return new Error(code);
    };

    /** Add test globals if configured
     *
     */
    if (config.useTestGlobals) {
      require('./src/testing/test-globals');

      if (config.apiTestServer) {
        var apiTestHelper = rrequire('server/test/api-test-helper')(require('supertest'), config.apiTestServer);
        global.testAuthHelper = apiTestHelper.authenticate;
        global.request = apiTestHelper.request;
      }
    }


    m.batcher = require('./src/utils/batcher');
  }

  return m;
};

