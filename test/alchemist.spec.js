'use strict'

var Alchemist = require('../')
var Color = require('../lib/color')
var expect = require('chai').expect

/**===========
 * Alchemist *
 ===========**/

describe('Alchemist', function () {
  var alchemist, rgb, xyz;

  before(function () {
    var tracePath = function (space) {
      return function (path) {
        return [path, space].join(' ')
      }
    }
    xyz = { name: 'xyz', from: { }, to: { } }
    rgb = {
      name: 'rgb',
      to: {
        xyz: tracePath('xyz'),
        hsl: tracePath('hsl')
      },
      from: {
        xyz: tracePath('rgb'),
        hsl: tracePath('rgb')
      }
    }

    alchemist = Alchemist.create()
    alchemist.use(xyz)
    alchemist.use(rgb)
  })

  describe('.use(plugin)', function () {
    describe('when given a color space plugin', function () {
      it('creates a method on alchemist associated to that color space', function () {
        expect(alchemist.rgb).to.be.a('function')
      })

      it('throws an error when the name is already used by a private method', function () {
        var plugin = { name: 'use', to: {} }
        expect(alchemist.use.bind(null, plugin)).to.throw(Error)
      })
    })
  })

  describe('.[color space](values)', function () {
    it('returns a color', function () {
      var color = alchemist.rgb([255, 255, 255])
      expect(Color.isPrototypeOf(color)).to.be.true
    })
    it('accepts a single value', function () {
      var color = alchemist.rgb('#f8f8f8')
      expect(color.value).to.deep.eq('#f8f8f8')
    })
    it('accepts a list of values', function () {
      var color = alchemist.rgb(255, 255, 255)
      expect(color.value).to.deep.eq([255, 255, 255])
    })
    it('accepts an array of values', function () {
      var color = alchemist.rgb([255, 255, 255])
      expect(color.value).to.deep.eq([255, 255, 255])
    })
    it('should have a conversion method to non-abstract color spaces', function () {
      var color = alchemist.rgb('test')
      expect(color.xyz).to.be.a('function')
      expect(color.hsl).to.not.be.a('function')
    })
  })

  describe('[color space].[conversion]()', function () {
    it('creates a conversion to that color', function () {
      var color = alchemist.rgb('rgb')
      var result = color.xyz()
      expect(result).to.eq('rgb xyz')
    })
  })

  describe('[color space].[color method]()', function () {
    it('is just a normal method', function () {
      alchemist.init({ precision: 2 })
      alchemist.use(alchemist.common())
      alchemist.use({
        name: 'lighten',
        methods: {
          color: function (amount) {
            var lab = this.as('lab')
            lab.value[0] += amount
            return lab
          }
        }
      })
      expect(alchemist.rgb(150, 150, 160).lighten(5).rgb()).to.deep.equal([164.45, 162.52, 173.45])
    })
  })
  describe('.[global method]()', function () {
    it('is just a normal method', function () {
      alchemist.init()
      alchemist.use(alchemist.common())
      alchemist.use({
        name: 'lightest',
        methods: {
          global: function () {
            var lightest = arguments[0].as('lab')
            var lightness = 0
            var len = arguments.length
            for (var i = 1; i < len; i++) {
              var current = arguments[i].as('lab')
              lightness = current.value[0]
              if (lightness > lightest.value[0]) lightest = current;
            }
            return lightest
          }
        }
      })
      var red = alchemist.rgb(72, 56, 57)
      var green = alchemist.rgb(52, 76, 57)
      var blue = alchemist.rgb(52, 56, 77)
      var result = alchemist.lightest(red, green, blue)
      expect(result.as('rgb').value).to.deep.equal([52.0638, 75.9548, 57.0371])
    })
  })

  describe('limits', function () {
    var rgb;
    before(function () {
      rgb = {
        name: 'rgb',
        limits: {
          max: [255, 255, 255],
          min: [0, 0, 0]
        },
        to: {}
      }
    })
    describe('when set to "nullify"', function () {
      before(function () {
        alchemist.init({ limits: 'nullify' })
        alchemist.use(rgb)
      })
      it('returns null if the color is out of bounds', function () {
        var overboard = alchemist.rgb(267, 80, -20)
        expect(overboard.value).to.eq(null)
      })
      it('returns the color when in bounds', function () {
        var inbounds = alchemist.rgb(255, 150, 0)
        expect(inbounds.value).to.deep.eq([255, 150, 0])
      })
    })
    describe('when set to "clip"', function () {
      before(function () {
        alchemist.init({ limits: 'clip' })
        alchemist.use(rgb)
      })
      it('returns the limit if the color is out of bounds', function () {
        var overboard = alchemist.rgb(267, 80, -20)
        expect(overboard.value).to.deep.eq([255, 80, 0])
      })
      it('returns the color when in bounds', function () {
        var inbounds = alchemist.rgb(255, 150, 0)
        expect(inbounds.value).to.deep.eq([255, 150, 0])
      })
    })
    describe('when set to "strict"', function () {
      before(function () {
        alchemist.init({ limits: 'strict' })
        alchemist.use(rgb)
      })
      it('throws an error when the color is out of bounds', function () {
        expect(function () {
          alchemist.rgb(267, 80, -20)
        }).to.throw(Error, 'Expected -20 to be greater than or equal to 0')
      })
      it('returns the color when in bounds', function () {
        var inbounds = alchemist.rgb(255, 150, 0)
        expect(inbounds.value).to.deep.eq([255, 150, 0])
      })
    })
  })
})
