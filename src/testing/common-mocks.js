/**
 * @module common-mocks
 * @summary: Contains common mocks that may be needed in very software project.
 *
 * @description:
 *
 * Author: justin
 * Created On: 2015-03-21.
 * @license Apache-2.0
 */


module.exports = function construct(config) {
  var mocks = {};

  mocks.fs = {
    createReadStream: sinon.stub().returns('sher'),
    move: sinon.stub().resolves(true),
    writeFileAsync: sinon.stub().resolves(),
    readFileAsync: sinon.stub().resolves(),
    readdirAsync: sinon.stub().resolves([]),
    createDirStructure: sinon.stub().resolves(),
    existsAsync: sinon.stub().resolves(true),
    writeFileTrailblaze: sinon.stub().resolves()
  };

  mocks.process = {
    exit: sinon.spy()
  };

  return mocks;
};

