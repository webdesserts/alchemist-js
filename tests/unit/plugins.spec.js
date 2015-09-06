import plugins from '../../lib/plugins'
import ColorSpaceStore from '../../lib/colorSpaceStore'
import Color from '../../lib/color'

describe('plugins', function () {
  describe('.identify(plugin)', function () {
    it('returns "space" when it\'s a color space', function () {
      var rgb = { name: 'rgb', to: {}, from: {} }
      expect(plugins.identify(rgb)).to.eq('space')
    })
    it('returns "method" when it\'s a color method', function () {
      var lighten = {
        name: 'lighten',
        methods: {
          'color': function () {}
        }
      }
      expect(plugins.identify(lighten)).to.eq('method')
    })
    it('throws an error if we can\'t recognize the plugin', function () {
      var func = function () {}
      var invalid = { naem: 'arrgeebea' }
      expect(plugins.identify.bind(null, func)).to.throw(Error)
      expect(plugins.identify.bind(null, invalid)).to.throw(Error)
    })
  })
  describe('.serializeColorSpace(plugin)', function () {
    var rgb, unnamed, broken, BaseSpace;

    before(function () {
      BaseSpace = Color.create()
      BaseSpace.limits = { handler: 'nullify' }
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
      var color_spaces = plugins.serializeColorSpace(rgb, BaseSpace)

      expect(ColorSpaceStore.isPrototypeOf(color_spaces)).to.be.true
    })

    it('has a set of derived color spaces in it\'s result set', function () {
      var color_spaces = plugins.serializeColorSpace(rgb, BaseSpace)

      expect(color_spaces.has('xyz')).to.be.true
      expect(color_spaces.find('xyz').is_concrete).to.be.false

      expect(color_spaces.has('hsl')).to.be.true
      expect(color_spaces.find('hsl').is_concrete).to.be.false

      expect(color_spaces.has('rgb')).to.be.true
      expect(Color.isPrototypeOf(color_spaces.find('rgb'))).to.be.true
    })

    it('throws an error if the plugin is missing a name', function () {
      expect(function () {
        plugins.serializeColorSpace(unnamed, BaseSpace)
      }).to.throw(Error)
    })

    it('throws an error if a conversion is not a function', function () {
      expect(function () {
        plugins.serializeColorSpace(broken, BaseSpace)
      }).to.throw(Error)
    })
  })
})
