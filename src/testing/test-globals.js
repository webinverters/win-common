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

require('../globals');
global.sinon = require("sinon");
global.sinonChai = require("sinon-chai");
global.sinonAsPromised = require('sinon-as-promised')(p);

var chaiSubset = require('chai-subset');
chai.use(chaiSubset);
chai.use(chaiAsPromised);
chai.use(sinonChai);
chai.config.includeStack = true;

global.expect = chai.expect;

var mocks = require('./mocks')();
global.mocks = mocks;
