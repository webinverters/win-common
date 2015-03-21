/**
 * Created by justin on 2015-03-16.
 */

var _ = require('lodash');

module.exports = function construct(config) {
  var m = {};

  config = config || {};
  config = _.defaults(config, {
    useGlobals: true,
    useTestConfig: false
  });

  m.logger = require('./src/log')(config);


  if (config.useGlobals) {
    require('./src/globals');
    _.extend(global, m.logger);
  }

  if (config.useTestConfig) {
    require('./src/testing/default-test-config');
  }

  return m;
};

