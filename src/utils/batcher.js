/**
 * Created by justin on 2014-12-03.
 */

var p = require('bluebird'),
    _ = require('lodash')
;


function construct() {
  var m = {};

  m.chunk = function(collection, chunkSize, func) {
    var results = [];
    for(var i=0; i<collection.length; i+=chunkSize) {
      var chunk = collection.slice(i, i+chunkSize);
      results.push(func(chunk));
    }
    return results;
  };

  m.retry = function(options, details) {
    var details = details || {
      retryAttemptsSoFar: 0,
          errors: [],
      deferred: p.defer()
    };

    options.action().then(function(result) {
      details.deferred.resolve(result);
    }).then(null, function(err) {
      details.errors.push(err);
      if (details.retryAttemptsSoFar >= options.maxRetryCount) {
        if (options.onError) options.onError(err);
        details.deferred.reject(details);
        return;
      }
      details.retryAttemptsSoFar++;
      setTimeout(function() {
        m.retry(options, details);
      }, options.timeoutMS);
    });

    return details.deferred.promise;
  };
  return m;
};

module.exports = construct();