'strict mode'

var Color = require('../lib/color')
var Converter = require('../lib/converter')
var ColorSpace = require('../lib/colorSpace')
var ColorSpaceStore = require('../lib/colorSpaceStore')
var expect = require('chai').expect

describe('Converter', function () {
  var color_spaces, converter;

  beforeEach(function () {
    color_spaces = ColorSpaceStore.create()

    tracePath = function (space) {
      return function (path) {
        return [path, space].join(' ')
      }
    }

    color_spaces.merge(plugins.serialize({
      name: 'xyz',
      to: {}
    }))
    color_spaces.merge(plugins.serialize({
      name: 'rgb',
      to:   { 'xyz': tracePath('xyz') },
      from: { 'xyz': tracePath('rgb') }
    }))
    color_spaces.merge(plugins.serialize({
      name: 'cmy',
      to:   { 'rgb': tracePath('rgb') },
      from: { 'rgb': tracePath('cmy') }
    }))
    color_spaces.merge(plugins.serialize({
      name: 'cmyk',
      to:   { 'cmy': tracePath('cmy') },
      from: { 'cmy': tracePath('cmyk') }
    }))
    color_spaces.merge(plugins.serialize({
      name: 'hsl',
      to:   { 'rgb': tracePath('rgb') },
      from: { 'rgb': tracePath('hsl') }
    }))
    color_spaces.merge(plugins.serialize({
      name: 'lab',
      to:   { 'xyz': tracePath('xyz') },
      from: { 'xyz': tracePath('lab') }
    }))
    color_spaces.merge(plugins.serialize({
      name: 'lchab',
      to:   { 'lab': tracePath('lab') },
      from: { 'lab': tracePath('lchab') }
    }))
    color_spaces.merge(plugins.serialize({
      name: 'luv',
      to:   { 'xyz': tracePath('xyz') },
      from: { 'xyz': tracePath('luv') }
    }))
    color_spaces.merge(plugins.serialize({
      name: 'lchuv',
      to:   { 'luv': tracePath('luv') },
      from: { 'luv': tracePath('lchuv') }
    }))

    converter = Converter.create(color_spaces)
  })

  describe('convert', function () {
    describe('when the target color space is adjacet', function () {
      it('just converts the color', function () {
        var color = color_spaces.find('rgb').Color.create('rgb')
        var new_color = converter.convert(color, 'xyz')
        expect(new_color.value).to.eq('rgb xyz')
      })
    })
    describe('when the target color space is a few steps away', function () {
      it('figures out the conversion path', function () {
        var color = color_spaces.find('rgb').Color.create('rgb')
        var new_color = converter.convert(color, 'lab')
        expect(new_color.value).to.eq('rgb xyz lab')
      })
    })
  })
  describe('applyConversion', function () {
    it('applys the conversion to the color', function () {
      var color = Color.create([255, 255, 255], 'rgb')
      var conversion = function (r, g, b) {
        r /= 255
        g /= 255
        b /= 255
        return [r, g, b]
      }
      var result = converter.applyConversion(color, 'myrgb', conversion)
      expect(result.value).to.deep.eq([1, 1, 1])
    })
    it('supplies the color obj as the last argument', function () {
      var color = Color.create([255, 255, 255], 'rgb')
      var conversion = function (r, g, b, color) {
        expect(Color.isPrototypeOf(color)).to.be.true
        expect(color.value).to.deep.eq([255, 255, 255])
        expect(color.color_space).to.eq('rgb')
      }
      converter.applyConversion(color, 'myrgb', conversion)
    })
    it('applies assigns the new color to color space it was converted to', function () {
      var color = Color.create([255, 255, 255], 'rgb')
      var conversion = function (r, g, b, color) { return 'bla' }
      var new_color = converter.applyConversion(color, 'myrgb', conversion)
      expect(new_color.color_space).to.eq('myrgb')
    })
  })
  describe('followPointer', function () {
    it('calls the function associated with the color space the pointer refers to.', function () {
      var color = Color.create('rgb', 'rgb')

      var new_color = converter.followPointer(color, color_spaces.find('rgb'), 'xyz')
      expect(new_color.value).to.eq('rgb xyz')
    })
  })
  describe('mapConversionPath', function () {
    it('adds "next step" strings on all applicable color spaces', function () {
      converter.mapConversionPath('lchuv', 'hsl')
      expect(converter.spaces.find('lchuv').to('hsl')).to.eq('luv')
      expect(converter.spaces.find('luv').to('hsl')).to.eq('xyz')
      expect(converter.spaces.find('xyz').to('hsl')).to.eq('rgb')
    })
    it('returns the next step', function () {
      var next_step = converter.mapConversionPath('lchuv', 'hsl')
      expect(next_step).to.eq('luv')
    })
    it('returns null if the conversion doesn\'t exist', function () {
      var next_step = converter.mapConversionPath('rgb', 'huslp')
      expect(next_step).to.be.null
    })
  })
  describe('findConversionPath', function () {
    it('should return an object of child:parent relationships', function () {
      var parents = converter.findConversionPath('lchuv', 'hsl')
      expect(parents.luv).to.eq('lchuv')
      expect(parents.xyz).to.eq('luv')
      expect(parents.rgb).to.eq('xyz')
      expect(parents.hsl).to.eq('rgb')
    })
    it('returns null if teh conversion cannot be found', function () {
      var parents = converter.findConversionPath('rgb', 'huslp')
      expect(parents).to.be.null
    })
  })
})
