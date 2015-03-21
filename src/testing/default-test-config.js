/**
 * @module default-test-config
 * @summary: Provides test framework defaults and adds globals for tests.
 *
 * @description:
 *
 * Author: justin
 * Created On: 2015-03-21.
 * @license Apache-2.0
 */


global.chai = require("chai");
var chaiAsPromised = require("chai-as-promised");

global.p = require('bluebird');
global._ = require('lodash');
global.sinon = require("sinon");
global.sinonChai = require("sinon-chai");
global.sinonAsPromised = require('sinon-as-promised')(p);

chai.use(chaiAsPromised);
chai.use(sinonChai);
chai.config.includeStack = true;

global.expect = chai.expect;

var mocks = require('./common-mocks')();
global.mocks = mocks;


/**
 * The cool thing about expectCalledWith is that the args that you expect
 * are tested for only the keys they possess.  The main flaw with deepEqual
 * is that every property must match.  With this expect, only the properties
 * specified in args need to match.
 *
 * @param stub - the stub or spy you expect to be called
 * @param args - the arguments you expect it to be called with
 * @param params
 */
global.expectCalledWith = function(stub, args, params) {
  if (!_.isArray(args)) {
    args = [args];
  }
  if (!params) {
    params = {};
  }
  var allArgsMatch = false;

  _.each(args, function(arg, idx) {
    if (!stub.getCall(0)) throw "method was not called...";
    var actualArg, callInfo, callNumber;
    if (params.callNumber !== undefined) {
      callNumber = params.callNumber;
    } else {
      callNumber = 0;
    }

    // to keep this method flexible, it loops through all calls to match
    // that it was indeed called at some point with the args expected.
    do {
      allArgsMatch = true;
      callInfo = stub.getCall(callNumber);
      if (callInfo) {
        actualArg = callInfo.args[idx];
        if (_.isObject(arg) || _.isArray(arg)) {
          _.each(arg, function(val, key) {
            if (arg[key] != actualArg[key]) {
              allArgsMatch = false;
            }
          });
        } else {
          if (arg != actualArg) {
            allArgsMatch = false;
          }
        }
        callNumber++;
        if (allArgsMatch) {
          return false;
        }
      }
      allArgsMatch = false;
    } while (params.callNumber === undefined && callInfo);
  });
  if (!allArgsMatch) {
    console.log('AssertCalled Failed: ', stub, args);
    throw new Error('AssertMethodCalledWith Failed: '+ stub + ' was not called with: ' + args);
  }
};
