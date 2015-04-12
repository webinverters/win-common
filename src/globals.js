/**
 * Defines a list of globals which will exist in your application if you require this library.
 */
'use strict';


global._ = require('lodash');
global.p = require('bluebird');
/**
 * Add a while loop to the bluebird promises...
 * @param condition function which returns truthy if the action should be called again.
 * @param action   function to call as the loop implementation.
 * @returns {*}
 */
p.while = function(condition, action) {
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

global.path = require('path');
global.fs = require('./kernel/file-storage')();
global.assert = require('assert-plus');
global.time = require('./utils/time');
global.timer = require('performance-now');
global.moment = require('moment-timezone');
global.util = require('util');
global.random = require('./utils/random')();
global.shell = require('./kernel/shell')();