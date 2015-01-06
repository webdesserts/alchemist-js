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
        plugin = { name: 'use', to: {} }
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

  describe.only('[color space].[color method]()', function () {
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
  describe.only('.[global method]()', function () {
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
})
