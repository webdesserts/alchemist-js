var helpers = require('../lib/helpers')
var expect = require('chai').expect

describe('helpers', function () {
  describe('each', function () {
    it('iterates over an array, returning the value and index for each item', function () {
      var array = [1, 2, 3]
      helpers.each(array, function (val, i) {
        array[i] = val + 5
      })
      expect(array).to.deep.eql([6, 7, 8])
    })
    it('stops iterating and return a result if a something is returned', function () {
      var array = [1, 0, 3, 4]
      var result = helpers.each(array, function (val, i) {
        if (val === 0) return val
      })
      expect(result).to.eq(0)
    })
  })
})
