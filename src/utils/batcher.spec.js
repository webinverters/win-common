/**
 * Created by justin on 2014-12-03.
 */

var batcher = require('./batcher');


function initArray(size) {
  return Array.apply(null, {length: size}).map(Number.call, Number);
}

function checkChunksCorrectly(buff, chunkSize) {
  var tot = 0;
  // we determine if all the items were indeed sent by summing them altogether.
  batcher.chunk(buff, chunkSize, function(chunk) {
    tot += _.reduce(chunk, function(sum,num) {
      return sum+num;
    })
  });
  // the array contains 0 - 99 therefore the sum of its parts is the nth triangle equation:
  // (n^2 + n) / 2  where n = 99
  expect(tot).to.equal(Math.floor((Math.pow(buff.length-1,2)+buff.length-1)/2));
}

describe('batcher.js', function() {
  var buff100, buff1000, buff10000;
  beforeEach(function() {
    buff100 = initArray(100);
  });
  describe('batcher.chunk(collection, chunkSize, func)', function() {
    it('sends maximum of chunksize to the func', function() {
      batcher.chunk(buff100, 5, function(chunk) {
        expect(chunk.length).to.be.below(6);
      });
    });

    it('sends all the items, even if length is not divisible by chunksize', function() {
      checkChunksCorrectly(buff100, 20);
      checkChunksCorrectly(buff100, 90);
      checkChunksCorrectly(buff100, 99);
      checkChunksCorrectly(buff100, 98);
      checkChunksCorrectly(buff100, 100);
      checkChunksCorrectly(buff100, 3);
      checkChunksCorrectly(buff100, 4);
    });
  });
});