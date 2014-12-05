var ColorSpace = require('../lib/colorSpace')
var expect = require('chai').expect

describe('ColorSpace', function () {
  it('should have a name', function () {
    var color_space = ColorSpace.create('rgb')
    expect(color_space.name).to.eq('rgb')
  })
  describe('Conversions', function () {
    var rgb, conv;
    beforeEach(function () {
      rgb = ColorSpace.create('rgb')
      conv = function () { return true }
    })
    describe('defineConvTo', function () {
      it('should create a conversion function', function () {
        rgb.defineConvTo('xyz', conv)
        expect(rgb.to('xyz')).to.be.eq(conv)
      })
    })
    describe('to', function () {
      beforeEach(function () { rgb.defineConvTo('xyz', conv) })
      it('should return a function if that conversion is present', function () {
        expect(rgb.to('xyz')).to.be.a('function')
      })
      it('should return null if that conversion is absant', function () {
        expect(rgb.to('hsl')).to.be.null
      })
    })
    describe('merge', function () {
      describe('when an abstract is merging a concrete', function () {
        var abstract_rgb, concrete_rgb;
        before(function () {
          abstract_rgb = ColorSpace.create('rgb', { abstract: true })
          abstract_rgb.defineConvTo('hsl', function () { return 'original' })
          abstract_rgb.defineConvTo('xyz', function () { return 'original' })

          concrete_rgb = ColorSpace.create('rgb')
          concrete_rgb.defineConvTo('hsl', function () { return 'foreign' })
          concrete_rgb.defineConvTo('hsb', function () { return 'foreign' })

          abstract_rgb.merge(concrete_rgb)
        })
        it('uses a strong merge', function () {
          expect(abstract_rgb.to('hsl')()).to.be.eq('foreign')
          expect(abstract_rgb.to('xyz')()).to.be.eq('original')
          expect(abstract_rgb.to('hsb')()).to.be.eq('foreign')
        })
        it('turns the abstract color space into a concrete color space', function () {
          expect(abstract_rgb.isAbstract).to.be.false
        })
      })
      describe('when a concrete is merging an abstract', function () {
        var concrete_rgb, abstract_rgb;
        before(function () {
          concrete_rgb = ColorSpace.create('rgb')
          concrete_rgb.defineConvTo('hsl', function () { return 'original' })
          concrete_rgb.defineConvTo('xyz', function () { return 'original' })

          abstract_rgb = ColorSpace.create('rgb', { abstract: true })
          abstract_rgb.defineConvTo('hsl', function () { return 'foreign' })
          abstract_rgb.defineConvTo('hsb', function () { return 'foreign' })

          concrete_rgb.merge(abstract_rgb)
        })
        it('uses a weak merge', function () {
          expect(concrete_rgb.to('hsl')()).to.be.eq('original')
          expect(concrete_rgb.to('xyz')()).to.be.eq('original')
          expect(concrete_rgb.to('hsb')()).to.be.eq('foreign')
        })
        it('leaves the original concrete', function () {
          expect(concrete_rgb.isAbstract).to.be.false
        })
      })
      describe('when merging two concrete', function () {
        var concrete_rgb1, concrete_rgb2;
        before(function () {
          concrete_rgb1 = ColorSpace.create('rgb')
          concrete_rgb1.defineConvTo('hsl', function () { return 'original' })
          concrete_rgb1.defineConvTo('xyz', function () { return 'original' })

          concrete_rgb2 = ColorSpace.create('rgb')
          concrete_rgb2.defineConvTo('hsl', function () { return 'foreign' })
          concrete_rgb2.defineConvTo('hsb', function () { return 'foreign' })

          concrete_rgb1.merge(concrete_rgb2)
        })
        it('uses a weak merge', function () {
          expect(concrete_rgb1.to('hsl')()).to.be.eq('original')
          expect(concrete_rgb1.to('xyz')()).to.be.eq('original')
          expect(concrete_rgb1.to('hsb')()).to.be.eq('foreign')
        })
        it('leaves the original concrete', function () {
          expect(concrete_rgb1.isAbstract).to.be.false
        })
      })
      describe('when merging two abstract', function () {
        var abstract_rgb1, abstract_rgb2;
        before(function () {
          abstract_rgb1 = ColorSpace.create('rgb', { abstract: true })
          abstract_rgb1.defineConvTo('hsl', function () { return 'original' })
          abstract_rgb1.defineConvTo('xyz', function () { return 'original' })

          abstract_rgb2 = ColorSpace.create('rgb', { abstract: true })
          abstract_rgb2.defineConvTo('hsl', function () { return 'foreign' })
          abstract_rgb2.defineConvTo('hsb', function () { return 'foreign' })

          abstract_rgb1.merge(abstract_rgb2)
        })
        it('uses a weak merge', function () {
          expect(abstract_rgb1.to('hsl')()).to.be.eq('original')
          expect(abstract_rgb1.to('xyz')()).to.be.eq('original')
          expect(abstract_rgb1.to('hsb')()).to.be.eq('foreign')
        })
        it('leaves the original concrete', function () {
          expect(abstract_rgb1.isAbstract).to.be.true
        })
      })
    })
  })
})
