var Color = require('../lib/color')
var ColorSpaceStore = require('../lib/colorSpaceStore')
var ConversionStore = require('../lib/conversionStore')
var expect = require('chai').expect

describe('ColorSpaceStore', function () {
  var color_spaces, rgb, xyz, hsl, ColorSpace;

  before(function () {
    ColorSpace = function ColorSpace (name, abstract) {
      return Color.create({
        type: name,
        abstract: abstract,
        conversions: ConversionStore.create()
      })
    }

    rgb = ColorSpace('rgb')
    xyz = ColorSpace('xyz')
    hsl = ColorSpace('hsl')
  })

  describe('.add(color_space)', function () {
    it('adds a ColorSpace', function () {
      color_spaces = ColorSpaceStore.create()
      color_spaces.add(rgb)

      expect(color_spaces.store.rgb).to.eq(rgb)
    })
  })

  describe('.remove(space_name)', function () {
    before(function () {
      color_spaces = ColorSpaceStore.create()
      color_spaces.add(rgb)
      color_spaces.add(xyz)
      color_spaces.add(hsl)
    })
    it('safely removes a ColorSpace from the store', function () {
      color_spaces.remove('rgb')

      expect(color_spaces.store.rgb).to.be.undefined
      expect(color_spaces.store.xyz).to.eq(xyz)
      expect(color_spaces.store.hsl).to.eq(hsl)
    })
  })

  describe('.find(space_name)', function () {
    before(function () {
      color_spaces = ColorSpaceStore.create()
      color_spaces.add(rgb)
      color_spaces.add(xyz)
      color_spaces.add(hsl)
    })
    it('returns a ColorSpace if it exists', function () {
      expect(color_spaces.find('rgb')).to.eq(rgb)
    })
    it('returns null if the ColorSpace doesn\'t exist', function () {
      expect(color_spaces.find('lab')).to.be.null
    })
  })

  describe('.has(space_name)', function () {
    before(function () {
      color_spaces = ColorSpaceStore.create()
      color_spaces.add(rgb)
      color_spaces.add(xyz)
    })
    it('returns true if the ColorSpace exists', function () {
      expect(color_spaces.has('rgb')).to.be.true
      expect(color_spaces.has('xyz')).to.be.true
    })
    it('returns false if the ColorSpace does not exist', function () {
      expect(color_spaces.has('lab')).to.be.false
    })
  })

  describe('.merge(foreign_store)', function () {
    var store1, store2, noop;

    beforeEach(function () {
      store1 = ColorSpaceStore.create()
      store2 = ColorSpaceStore.create()
      noop = function () {}
    })
    it('adds the space if it doesn\'t exist yet', function () {
      var rgb = ColorSpace('rgb')
      var hsl = ColorSpace('hsl')

      store1.add(rgb)
      store2.add(hsl)
      store1.merge(store2)
      expect(store1.store.rgb).to.be.ok
      expect(store1.store.hsl).to.be.ok
    })
    it('concrete spaces always win over abstract spaces', function () {
      var abstract_rgb = ColorSpace('rgb', true)
      var concrete_rgb = ColorSpace('rgb')
      var abstract_hsl = ColorSpace('hsl', true)
      var concrete_hsl = ColorSpace('hsl')

      abstract_rgb.conversions.add('hsl', function () { return 'abstract' })
      concrete_rgb.conversions.add('hsl', function () { return 'concrete' })
      abstract_hsl.conversions.add('rgb', function () { return 'abstract' })
      concrete_hsl.conversions.add('rgb', function () { return 'concrete' })

      store1.add(concrete_hsl)
      store1.add(abstract_rgb)
      store2.add(abstract_hsl)
      store2.add(concrete_rgb)

      store1.merge(store2)

      expect(store1.find('rgb').conversions.find('hsl')()).to.be.eq('concrete')
      expect(store1.find('hsl').conversions.find('rgb')()).to.be.eq('concrete')
    })
    it('uses the receiving space rather than the giving space if they\'re the same', function () {
      var rgb1 = ColorSpace('rgb', true)
      var rgb2 = ColorSpace('rgb', true)
      var hsl1 = ColorSpace('hsl')
      var hsl2 = ColorSpace('hsl')

      rgb1.conversions.add('hsl', function () { return 'original' })
      rgb2.conversions.add('hsl', function () { return 'foreign' })
      rgb2.conversions.add('xyz', function () { return 'foreign' })
      hsl1.conversions.add('rgb', function () { return 'original' })
      hsl2.conversions.add('rgb', function () { return 'foreign' })
      hsl2.conversions.add('hsb', function () { return 'foreign' })

      store1.add(hsl1)
      store1.add(rgb1)
      store2.add(hsl2)
      store2.add(rgb2)

      store1.merge(store2)

      expect(store1.find('rgb').conversions.find('hsl')()).to.be.eq('original')
      expect(store1.find('hsl').conversions.find('rgb')()).to.be.eq('original')
      expect(store1.find('hsl').conversions.find('hsb')()).to.be.eq('foreign')
      expect(store1.find('rgb').conversions.find('xyz')()).to.be.eq('foreign')
    })
  })
  describe('.findNeighbors(space_name)', function () {
    it('returns an array of neighboring color spaces', function () {
      var store = ColorSpaceStore.create()
      var rgb = ColorSpace('rgb')
      var luv = ColorSpace('luv')
      var xyz = ColorSpace('xyz')
      var lab = ColorSpace('lab', true)

      xyz.conversions.add('rgb', function () {})
      xyz.conversions.add('lab', function () {})
      xyz.conversions.add('xyz', function () {})
      xyz.conversions.add('luv', function () {})

      store.add(rgb)
      store.add(luv)
      store.add(xyz)
      store.add(lab)

      var neighbors = store.findNeighbors('xyz')
      expect(neighbors).to.contain('rgb')
      expect(neighbors).to.contain('luv')
      expect(neighbors).to.contain('xyz')
    })
  })
})
