import Color from '../../lib/color'
import plugins from '../../lib/plugins'
import Converter from '../../lib/converter'
import ColorSpaceStore from '../../lib/colorSpaceStore'

describe('Converter', function () {
  var color_spaces, converter;

  beforeEach(function () {
    color_spaces = ColorSpaceStore.create()

    var tracePath = function (space) {
      return function (path) {
        return [path, space].join(' ')
      }
    }

    color_spaces.merge(plugins.serializeColorSpace({
      name: 'xyz',
      to: {}
    }, Color))
    color_spaces.merge(plugins.serializeColorSpace({
      name: 'rgb',
      to:   { 'xyz': tracePath('xyz') },
      from: { 'xyz': tracePath('rgb') }
    }, Color))
    color_spaces.merge(plugins.serializeColorSpace({
      name: 'cmy',
      to:   { 'rgb': tracePath('rgb') },
      from: { 'rgb': tracePath('cmy') }
    }, Color))
    color_spaces.merge(plugins.serializeColorSpace({
      name: 'cmyk',
      to:   { 'cmy': tracePath('cmy') },
      from: { 'cmy': tracePath('cmyk') }
    }, Color))
    color_spaces.merge(plugins.serializeColorSpace({
      name: 'hsl',
      to:   { 'rgb': tracePath('rgb') },
      from: { 'rgb': tracePath('hsl') }
    }, Color))
    color_spaces.merge(plugins.serializeColorSpace({
      name: 'lab',
      to:   { 'xyz': tracePath('xyz') },
      from: { 'xyz': tracePath('lab') }
    }, Color))
    color_spaces.merge(plugins.serializeColorSpace({
      name: 'lchab',
      to:   { 'lab': tracePath('lab') },
      from: { 'lab': tracePath('lchab') }
    }, Color))
    color_spaces.merge(plugins.serializeColorSpace({
      name: 'luv',
      to:   { 'xyz': tracePath('xyz') },
      from: { 'xyz': tracePath('luv') }
    }, Color))
    color_spaces.merge(plugins.serializeColorSpace({
      name: 'lchuv',
      to:   { 'luv': tracePath('luv') },
      from: { 'luv': tracePath('lchuv') }
    }, Color))

    converter = Converter.create(color_spaces)
  })

  describe('.convert(color, target_name)', function () {
    describe('when the current space is the target color space', function () {
      it('just returns the color', function () {
        var color = color_spaces.find('rgb').create('stuff')
        var not_so_new_color = converter.convert(color, 'rgb')
        expect(not_so_new_color.space).to.eq('rgb')
      })
    })
    describe('when the target color space is adjacet', function () {
      it('converts the color', function () {
        var color = color_spaces.find('rgb').create('rgb')
        var new_color = converter.convert(color, 'xyz')
        expect(new_color.value).to.eq('rgb xyz')
      })
    })
    describe('when the target color space is a few steps away', function () {
      it('figures out the conversion path', function () {
        var color = color_spaces.find('rgb').create('rgb')
        var new_color = converter.convert(color, 'lab')
        expect(new_color.value).to.eq('rgb xyz lab')
      })
      it('safely passes null through', function () {
        var color_spaces = ColorSpaceStore.create()

        color_spaces.merge(plugins.serializeColorSpace({
          name: 'rgb',
          to: { 'xyz': function (r, g, b) { return null } }
        }, Color))
        color_spaces.merge(plugins.serializeColorSpace({
          name: 'xyz',
          to: { 'lab': function (x, y, z) { return [x, y, z] } }
        }, Color))
        color_spaces.merge(plugins.serializeColorSpace({
          name: 'lab', to: { }
        }, Color))

        var converter = Converter.create(color_spaces)

        var color = color_spaces.find('rgb').create([265, 255, 180])
        var new_color = converter.convert(color, 'lab')
        expect(new_color.value).to.eq(null)
      })
    })
  })

  describe('.applyConversion(color, target_name)', function () {
    it('applies the conversion to the color', function () {
      var color = color_spaces.find('rgb').create('rgb')
      var result = converter.applyConversion(color, 'xyz')
      expect(result.value).to.eq('rgb xyz')
    })
    it('calls the conversion with the color as its "this" value', function () {
      color_spaces.merge(plugins.serializeColorSpace({ name: 'myrgb', to: {} }, Color))
      var color = color_spaces.find('rgb').create([255, 255, 255])
      color.conversions.add('myrgb', function (r, g, b) {
        expect(this).to.eq(color)
        expect(this.value).to.deep.eq([255, 255, 255])
        expect(this.space).to.eq('rgb')
      })
      converter.applyConversion(color, 'myrgb')
    })
    it('creates a new color from the color space it was converted to', function () {
      var color = color_spaces.find('rgb').create('rgb')
      var new_color = converter.applyConversion(color, 'hsl')
      expect(new_color.proto).to.eq(color_spaces.find('hsl'))
    })
  })

  describe('.mapConversionPath(current_name, target_name)', function () {
    it('adds "next step" strings on all applicable color spaces', function () {
      converter.mapConversionPath('lchuv', 'hsl')
      expect(converter.spaces.find('lchuv').conversions.find('hsl')).to.eq('luv')
      expect(converter.spaces.find('luv').conversions.find('hsl')).to.eq('xyz')
      expect(converter.spaces.find('xyz').conversions.find('hsl')).to.eq('rgb')
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

  describe('.findConversionPath(current_name, target_name)', function () {
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
