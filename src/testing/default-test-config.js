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