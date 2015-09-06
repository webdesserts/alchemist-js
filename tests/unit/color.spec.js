import Color from '../../lib/color'

describe('Color', function () {
  var converter, space_converter, color;

  beforeEach(function () {
    converter = {
      convert: function (color, dest) {
        return Color.create(color.value + .12345)
      }
    }
    space_converter = {
      convert: function (color, dest) {
        return Color.create('converted to ' + dest)
      }
    }

    color = Color.create(10, { converter: converter, precision: 4 })
  })

  describe('.to(target_name[, options])', function () {
    it('converts to a color and returns it\'s value', function () {
      color.converter = space_converter
      expect(color.to('hsl')).to.eq('converted to hsl')
    })
    it('rounds if given an optional precision', function () {
      expect(color.to('Nether', { precision: 5 })).to.eq(10.123)
    })
    it('rounds to the default precision if the precision option is absant', function () {
      expect(color.to('TheEnd')).to.eq(10.12)
    })
  })
  describe('.as(target_name)', function () {
    it('converts to a color and returns a color', function () {
      color.converter = space_converter
      var new_color = color.as('hsl')
      expect(Color.isPrototypeOf(new_color)).to.be.true
      expect(new_color.value).to.eq('converted to hsl')
    })
  })
  describe('.round([precision])', function () {
    it('rounds the color\'s value to the given precision', function () {
      color.value = 10.123456789
      expect(color.round(2)).to.eq(10)
      expect(color.round(3)).to.eq(10.1)
    })
  })
})
