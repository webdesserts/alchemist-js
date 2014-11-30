var ColorSpace = require('../lib/colorSpace')
var AbstractSpace = require('../lib/abstractSpace')
var expect = require('chai').expect

describe('AbstractSpace', function () {
  it('should have ColorSpace as it\'s prototype', function () {
    expect(ColorSpace.isPrototypeOf(AbstractSpace)).to.be.true
  })
  describe('conversions', function () {
    var rgb, xyz, hsl, conv;
    beforeEach(function () {
      rgb = AbstractSpace.create('rgb')
      xyz = AbstractSpace.create('xyz')
      hsl = AbstractSpace.create('hsl')
      conv = function () { return true }
    })
    describe('defineConvTo', function () {
      it('should create a conversion function', function () {
        rgb.defineConvTo(xyz, conv)
        expect(rgb.to(xyz)).to.be.eq(conv)
      })
    })
    describe('defineConvFrom', function () {
      it('should create a conversion function', function () {
        rgb.defineConvFrom(xyz, conv)
        expect(rgb.from(xyz)).to.be.eq(conv)
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
    describe('from', function () {
      beforeEach(function () { rgb.defineConvFrom(xyz, conv) })
      it('should return a function if that conversion is present', function () {
        expect(rgb.from(xyz)).to.be.a('function')
      })
      it('should return null if that conversion is absent', function () {
        expect(rgb.from(hsl)).to.be.null
      })
    })
  })
})
