define(function (require) {
  var expect = require('vendor/chai/chai').expect
  var Alchemist = require('dist/alchemist')

  describe('hsl', function () {
    var alchemize, hsl, rgb

    before(function () {
      hsl = [173, .55, .42]
      rgb = [48, 166, 152]
      alchemize = Alchemist.create()
    })

    it('to rgb', function () {
      expect(alchemize.hsl(hsl).rgb()).to.deep.eq(rgb)
    })

    it('from rgb', function () {
      expect(alchemize.rgb(rgb).hsl()).to.deep.eq(hsl)
    })
  })
})
