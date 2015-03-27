/**
 * Created by justin on 2015-03-09.
 */

var PersistentCache = require('./fblru-cache');

describe('FBLRU-Cache Integration', function() {
  var m = {};

  var cacheFolder = './test-fblru-cache-folder';
  var cacheConfig = {
    cacheFolderPath: cacheFolder,
    compress: 'zlib',
    MAX_SIZE:2
  };
  beforeEach(function() {
    m = PersistentCache(cacheConfig);
  });

  after(function() {
    return fs.removeAsync(cacheFolder);
  });

  describe('set(key, value)', function() {
    it('creates a gzipped file of the value', function() {
      return m.set('testkey', {t:0,v:10}).then(function() {
        return fs.readdirAsync(cacheFolder);
      })
      .then(function(files) {
        expect(files).to.contain('testkey');
      });
    });

    it('releases LFU cached items after the max is reached', function() {
      return p.map(_.range(4), function(i) {
        return m.set('key'+i, {test:1});
      }).then(function() {
        expect(m.getStats().cacheHits).to.equal(0);
        return m.get('key0'); // key0 is the first one so it should be the LFU
      })
      .then(function(v) {
        // the cache is implemented to allow 1 more than the max...
        expect(m.getStats().cacheSize).to.equal(cacheConfig.MAX_SIZE+1);
        expect(m.getStats().cacheHits).to.equal(0);
        // and even though the it was a cache miss, we still get the value!
        expect(v.test).to.equal(1);
      });
    });
  });

  describe('get(key)', function() {
    it('retrieves values currently in memory', function() {
      expect(m.getStats().cacheHits).to.equal(0);
      return m.set('testkey', {t:0,v:10}).then(function() {
        return m.get('testkey');
      }).then(function(val) {
        expect(val.t).to.equal(0);
        expect(val.v).to.equal(10);
        expect(m.getStats().cacheHits).to.equal(1);
      });
    });

    it('retrieves values not currently in memory', function() {
      m.clear(); // clear memory
      return m.get('testkey').then(function(val) {
        expect(val.t).to.equal(0);
        expect(val.v).to.equal(10);
        expect(m.getStats().cacheHits).to.equal(0);
      });
    })
  });
});