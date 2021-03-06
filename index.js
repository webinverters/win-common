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
    apiTestServer: null // if you want the api test framework setup with super test and authentication helpers, pass in your server module here.
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
  if (!global.wincommon) {
    /** Add globals if configured.
     *
     */
    if (config.useGlobals) {
      require('./src/globals');
    }

    /**
     * Add an error function that can be thrown
     * @param code
     * @param errDetails
     * @returns {Error}
     */
    global.error = function(code, errDetails) {
      console.error(code, errDetails);
      return new Error(code);
    };
  }

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

  /**
   * Add a while loop to the bluebird promises...
   * @param condition function which returns truthy if the action should be called again.
   * @param action   function to call as the loop implementation.
   * @returns {*}
   */
  m.while =
    function(condition, action) {
      var resolver = p.defer();

      var loop = function() {
        if (!condition()) return resolver.resolve();
        return p.cast(action())
          .then(loop)
          .catch(function(err) {
            resolver.reject(err);
          });
      };

      process.nextTick(loop);

      return resolver.promise;
    };

  if (!global.wincommon) {
    global.wincommon = _.extend({}, m);
  }

  return m;
};

