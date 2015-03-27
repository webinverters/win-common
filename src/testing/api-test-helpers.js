/**
 * @module myModule
 * @summary: This module's purpose is to:
 *
 * @description:
 *
 * Author: justin
 * Created On: 2015-03-21.
 * @license Apache-2.0
 */

module.exports = function construct(request, server) {
  var authToken, m={};

  m.authenticate = function authenticate(user, pass) {
    var d = p.defer();

    request(server).post('/api/user/signin')
      .send({
        "name": user,
        "password": pass
      }).end(function(err, res) {
        if (err) return d.reject(err);
        authToken = res.body.token;
        return d.resolve(authToken);
      });

    return d.promise;
  };

  m.request = function() {
    return {
      post: function() {
        return request(server).post.apply(request(server), arguments).set('token', authToken)
      },
      put: function() {
        return request(server).put.apply(request(server), arguments).set('token', authToken)
      },
      get: function() {
        return request(server).get.apply(request(server), arguments).set('token', authToken)
      },
      delete: function() {
        return request(server).delete.apply(request(server), arguments).set('token', authToken)
      }
    };
  };

  return m;
};