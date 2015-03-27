/**
 * @module file-storage
 * @summary: Provides local file storage APIs.
 *
 * @description:
 *
 * Author: justin
 * Created On: 2015-03-27.
 * @license Apache-2.0
 */

"use strict";

var
//StringStream = require('string-stream'),
  mv = require('mv'),
  mkdirp = require('mkdirp')
  ;

module.exports = function construct(config) {
  var m = {};
  config = config || {};
  config = _.defaults(config, {});

  m = _.extend({}, p.promisifyAll(require('fs-extra'))); //_.extend({}, , p.promisifyAll(require('graceful-fs')));

  /**
   *
   * @param src
   * @param dst
   * @param opts - mkdirp (creates dir if it doesnt exist), clobber (overwrite)
   * @returns promise
   */
  m.move =  function(src, dst, opts) {
    var deferred = p.defer();
    opts = opts || {mkdirp: true, clobber: true};
    mv(src,dst, opts, function(err) {
      if (err) {
        return deferred.reject(err);
      }
      deferred.resolve();
    });
    return deferred.promise;
  };

  /**
   * Provide it with a full path and it will create the entire directory structure
   * necessar to write the file.
   * @param filePath
   * @param data
   * @returns {*}
   */
  m.writeFileTrailblaze = function(filePath, data) {
    var tmp = filePath.replace(path.basename(filePath),'');
    return m.createDirStructure(tmp).then(function() {
      return m.writeFileAsync(filePath, data)
    });
  };

  m.createDirStructure = function(filePath) {
    if (filePath[filePath.length-1] == '/') {
      return p.promisify(mkdirp)(filePath);
    }
    return p.promisify(mkdirp)(path.dirname(filePath));
  };

  return m;
};