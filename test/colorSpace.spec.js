var ColorSpace = require('../lib/colorSpace')
var expect = require('chai').expect

describe('ColorSpace', function () {
  it('should have a name', function () {
    var color_space = ColorSpace.create('rgb')
    expect(color_space.name).to.eq('rgb')
  })
  describe('Conversions', function () {
    var rgb, xyz, hsl, conv;
    beforeEach(function () {
      rgb = ColorSpace.create('rgb')
      xyz = ColorSpace.create('xyz')
      hsl = ColorSpace.create('hsl')
      conv = function () { return true }
    })
    describe('defineConvTo', function () {
      it('should create a conversion function', function () {
        rgb.defineConvTo(xyz, conv)
        expect(rgb.to(xyz)).to.be.eq(conv)
      })
    })
    describe('to', function () {
      beforeEach(function () { rgb.defineConvTo(xyz, conv) })
      it('should return a function if that conversion is present', function () {
        expect(rgb.to(xyz)).to.be.a('function')
      })
      it('should return null if that conversion is absant', function () {
        expect(rgb.to(hsl)).to.be.null
      })
    })
  })
})
