/**
 * @module myModule
 * @summary: This module's one and only purpose is to:
 * <explain as concisely as possible the single purpose of this module.>
 *
 * @description:  more detailed information here
 *
 * Author: tonyle
 * Created On: 2015-03-26
 * @license Apache-2.0
 */

var exec = require('child_process').exec;

module.exports = function construct(config) {
  var m = {};

  config = config || {};
  config = _.defaults(config, {
    cwd: undefined
  });

  m.run = function(command) {
    var deferred = p.defer();
    exec(command, {cwd:config.cwd}, function(err, stdout, stderr) {
      if (err) {
        deferred.reject(error(err));
      } else {
        deferred.resolve(stdout);
      }
    });
    return deferred.promise;
  };

  return m;
};