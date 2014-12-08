var plugins = require('../lib/plugins')
var ColorSpace = require('../lib/colorSpace')
var ColorSpaceStore = require('../lib/colorSpaceStore')
var expect = require('chai').expect

describe('plugins', function () {
  describe('serializeColorSpace', function () {
    var rgb, unnamed, broken;

    before(function () {
      rgb = {
        name: 'rgb',
        to: {
          'xyz': function () { return 'rgb xyz' },
          'hsl': function () { return 'rgb hsl' }
        },
        from: {
          'xyz': function () { return 'xyz rgb' },
          'hsl': function () { return 'hsl rgb' }
        }
      }
      unnamed = {
        to: {
          'xyz': function () { return 'rgb xyz' }
        }
      }
      broken = {
        name: 'broken',
        to: {
          'xyz': 'I do what I like'
        },
        from: {
          'xyz': ['because', 'reasons']
        }
      }
    })

    it('returns a ColorSpaceStore', function () {
      var color_spaces = plugins.serializeColorSpace(rgb)

      expect(ColorSpaceStore.isPrototypeOf(color_spaces)).to.be.true
    })

    it('has a set of derived color spaces in it\'s result set', function () {
      var color_spaces = plugins.serializeColorSpace(rgb)

      expect(color_spaces.has('xyz')).to.be.true
      expect(color_spaces.find('xyz').isAbstract).to.be.true

      expect(color_spaces.has('hsl')).to.be.true
      expect(color_spaces.find('hsl').isAbstract).to.be.true

      expect(color_spaces.has('rgb')).to.be.true
      expect(ColorSpace.isPrototypeOf(color_spaces.find('rgb'))).to.be.true
    })

    it('throws an error if the plugin is missing a name', function () {
      expect(function () {
        var abstract_space = plugins.serializeColorSpace(unnamed)
      }).to.throw(Error)
    })

    it('throws an error if a conversion is not a function', function () {
      expect(function () {
        var abstract_space = plugins.serializeColorSpace(broken)
      }).to.throw(Error)
    })
  })
})
