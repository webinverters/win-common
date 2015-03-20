/**
 * Created by justin on 2015-03-16.
 */

var _ = require('lodash');

module.exports = function construct(config) {
  var m = {};

  config = config || {};
  config = _.defaults(config, {
    useGlobals: true
  });

  m.logger = require('./src/log')(config);
  if (config.useGlobals) {
    require('./src/globals');
    _.extend(global, m.logger);
  }

  return m;
};

