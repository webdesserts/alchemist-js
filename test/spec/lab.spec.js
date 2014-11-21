define(function (require) {
  var expect = require('vendor/chai/chai').expect
  var Alchemist = require('dist/alchemist')

  describe('lab', function () {
    var alchemize

    before(function () {
      alchemize = Alchemist.create()
    })

    it('to xyz', function () {
      expect(alchemize.lab([80, 10, -10]).xyz()).to.deep.eq([.5787, .5668, .7359])
    })

    it('from xyz', function () {
      expect(alchemize.xyz([.50, .50, .50]).lab()).to.deep.eq([76.0693, 6.7770, 4.4399])
    })
  })
})
