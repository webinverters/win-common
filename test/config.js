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
global.AssertionError = chai.AssertionError;
global.Assertion = chai.Assertion;
global.assert = chai.assert;