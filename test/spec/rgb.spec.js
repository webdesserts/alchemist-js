define(function (require) {
  var expect = require('vendor/chai/chai').expect
  var Alchemist = require('dist/alchemist')

  describe('rgb', function () {
    var alchemize

    before(function () {
      alchemize = Alchemist.create()
    })

    it('to xyz', function () {
      expect(alchemize.rgb([50, 150, 200]).xyz()).to.deep.eq([.2264, .2666, .5858])
    })

    it('from xyz', function () {
      expect(alchemize.xyz([.50, .50, .50]).rgb()).to.deep.eq([203.7839, 183.1073, 179.6471])
    })
  })
})
