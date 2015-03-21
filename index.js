/**
 * Created by justin on 2015-03-16.
 */

var _ = require('lodash');

module.exports = function construct(config) {
  var m = {};

  config = config || {};
  config = _.defaults(config, {
    useGlobals: true,
    useTestConfig: false,
    apiTestServer: null // if you want the api test framework setup with super test and authentication helpers, pass in your server module here.
  });

  m.logger = require('./src/log')(config);


  if (config.useGlobals) {
    require('./src/globals');
    _.extend(global, m.logger);
  }

  if (config.useTestConfig) {
    require('./src/testing/default-test-config');

    if (config.apiTestServer) {
      var apiTestHelper = rrequire('server/test/api-test-helper')(require('supertest'), config.apiTestServer);
      global.testAuthHelper = apiTestHelper.authenticate;
      global.request = apiTestHelper.request;
    }
  }

  return m;
};

