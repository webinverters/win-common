/**
 * @module random
 * @summary: Provides random number/string helpers and unique id (GUIDs, etc...) generators.
 *
 * @description:
 *
 * Author: justin
 * Created On: 2015-03-27.
 * @license Apache-2.0
 */

"use strict";
var uuid = require('node-uuid');
module.exports = function construct(config) {
  var m = {};
  config = config || {};
  config = _.defaults(config, {});

  m.getGUID = function() {
    return uuid.v1();
  };

  m.randomIntBetween = function (min, max) {
    return Math.floor(Math.random()*max + min);
  };

  return m;
};