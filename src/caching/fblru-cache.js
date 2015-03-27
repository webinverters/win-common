/**
 * Created by justin on 2015-03-10.
 */

//cache.set("key", "value")
//cache.get("key") // "value"
//
//cache.reset()    // empty the cache

var zlib = p.promisifyAll(require('zlib')),
  fs = p.promisifyAll(require('fs-extra'));

require('../globals');

/**
 * Persistant cache.
 * @returns {{}}
 */
module.exports = function(config) {
  var m = {};
  var _stats = {
    cacheHits: 0,
    cacheMisses: 0,
    freq: []
  };

  config = config || {};
  config = _.defaults(config, {
    MAX_SIZE: 3000,
    cacheFolderPath: './persistent-cache'
  });

  //log("fslru-cache created with config:", config);

  var LRU = require("lru-cache")
      , options = { max: config.MAX_SIZE + 1  // +1 for the stats.
        // , length: function (n) { return n * 2 }
        // , dispose: function (key, n) { n.close() }  called when stuff is removed.
        , maxAge: undefined}// hopefully it is infinite if left undefined...
      , cache = LRU(options);

  fs.ensureDirSync(config.cacheFolderPath);

  var updateStats = function(hit) {
    _stats.cacheHits += hit;
    _stats.freq.push(hit);
    return m.set('stats', _stats);
  };

  // start-end-meter-res
  m.get = function(key) {
    var v = cache.get(key);
    if (v) {
      //log('m.get()', key, 'hit');
      return updateStats(1).then(function() { return v; });
    }

    //log('m.get()', key, 'miss');
    return updateStats(0).then(function() {
      if (key=='stats') {
        return fs.readFileAsync(path.join(config.cacheFolderPath, key))
            .then(function(json) {
              //log('stats', json.toString('utf8'));
              return JSON.parse(json);
            });
      }

      return fs.readFileAsync(path.join(config.cacheFolderPath, key))
          .then(function(contents) {
            if (contents) {
              return zlib.unzipAsync(contents);
            }
            return '';
          }).then(function(json) {
            //log('cache.get()', json.toString('utf8'));
            var val = JSON.parse(json);
            cache.set(key, val);
            return val;
          });
    });


  };

  m.set = function(key, val) {
    //log('setting val', key);
    cache.set(key, val);
    if (key=='stats') {
      return fs.writeFileAsync(path.join(config.cacheFolderPath, key.toString()), JSON.stringify(val));
    }
    return zlib.deflateAsync(JSON.stringify(val))
        .then(function(compressed) {
          return fs.writeFileAsync(path.join(config.cacheFolderPath, key.toString()), compressed);
        });
  };

  m.clear = function() {
    cache.reset();
  };

  m.getStats = function() {
    _stats.cacheSize = cache.values().length;
    return _stats;
  };

  return m;
};