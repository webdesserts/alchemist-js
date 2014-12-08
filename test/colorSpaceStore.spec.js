var ColorSpace = require('../lib/colorSpace')
var ColorSpaceStore = require('../lib/colorSpaceStore')
var expect = require('chai').expect

describe('ColorSpaceStore', function () {
  var color_spaces, rgb, xyz, hsl;

  before(function () {
    rgb = ColorSpace.create('rgb')
    xyz = ColorSpace.create('xyz')
    hsl = ColorSpace.create('hsl')
  })

  describe('add', function () {
    it('adds a ColorSpace', function () {
      color_spaces = ColorSpaceStore.create()
      color_spaces.add(rgb)

      expect(color_spaces.store).to.contain(rgb)
    })
  })

  describe('remove', function () {
    before(function () {
      color_spaces = ColorSpaceStore.create()
      color_spaces.add(rgb)
      color_spaces.add(xyz)
      color_spaces.add(hsl)
      color_spaces.remove('rgb')
    })
    it('safely removes a ColorSpace from the store', function () {
      expect(color_spaces.store).to.not.contain(rgb)
      expect(color_spaces.store).to.contain(xyz)
      expect(color_spaces.store).to.contain(hsl)
    })
  })

  describe('findIndex', function () {
    before(function () {
      color_spaces = ColorSpaceStore.create()
      color_spaces.add(rgb)
      color_spaces.add(xyz)
      color_spaces.add(hsl)
    })
    it('returns the index of a ColorSpace if it exists', function () {
      expect(color_spaces.findIndex('rgb')).to.eq(0)
      expect(color_spaces.findIndex('xyz')).to.eq(1)
      expect(color_spaces.findIndex('hsl')).to.eq(2)
    })
    it('returns null if the ColorSpace doesn\'t exist', function () {
      expect(color_spaces.findIndex('lab')).to.be.null
    })
  })

  describe('find', function () {
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

  describe('has', function () {
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

  describe('merge', function () {
    var store1, store2, noop, rgb1, rgb2, hsl, xyz;
    beforeEach(function () {
      store1 = ColorSpaceStore.create()
      store2 = ColorSpaceStore.create()
      rgb = ColorSpace.create('rgb')
      hsl = ColorSpace.create('hsl')
      noop = function () {}
    })
    it('adds the space if it doesn\'t exist yet', function () {
      rgb.defineConvTo('hsl', noop)
      hsl.defineConvTo('rgb', noop)
      store1.add(rgb)
      store2.add(hsl)
      store1.merge(store2)
      expect(store1.has('rgb')).to.be.true
      expect(store1.has('hsl')).to.be.true
    })
    it('concrete spaces always win over abstract spaces', function () {
      var abstract_rgb = ColorSpace.create('rgb', { abstract: true })
      var concrete_rgb = ColorSpace.create('rgb')
      var abstract_hsl = ColorSpace.create('hsl', { abstract: true })
      var concrete_hsl = ColorSpace.create('hsl')

      abstract_rgb.defineConvTo('hsl', function () { return 'abstract' })
      concrete_rgb.defineConvTo('hsl', function () { return 'concrete' })
      abstract_hsl.defineConvTo('rgb', function () { return 'abstract' })
      concrete_hsl.defineConvTo('rgb', function () { return 'concrete' })

      store1.add(concrete_hsl)
      store1.add(abstract_hsl)
      store2.add(abstract_rgb)
      store2.add(concrete_rgb)

      store1.merge(store2)

      expect(store1.find('rgb').to('hsl')()).to.be.eq('concrete')
      expect(store1.find('hsl').to('rgb')()).to.be.eq('concrete')
    })
    it('uses the receiving space rather than the giving space if they\'re the same', function () {
      var rgb1 = ColorSpace.create('rgb', { abstract: true })
      var rgb2 = ColorSpace.create('rgb', { abstract: true })
      var hsl1 = ColorSpace.create('hsl')
      var hsl2 = ColorSpace.create('hsl')

      rgb1.defineConvTo('hsl', function () { return 'original' })
      rgb2.defineConvTo('hsl', function () { return 'foreign' })
      rgb2.defineConvTo('xyz', function () { return 'foreign' })
      hsl1.defineConvTo('rgb', function () { return 'original' })
      hsl2.defineConvTo('rgb', function () { return 'foreign' })
      hsl2.defineConvTo('hsb', function () { return 'foreign' })

      store1.add(hsl1)
      store1.add(rgb1)
      store2.add(hsl2)
      store2.add(rgb2)

      store1.merge(store2)

      expect(store1.find('rgb').to('hsl')()).to.be.eq('original')
      expect(store1.find('hsl').to('rgb')()).to.be.eq('original')
      expect(store1.find('hsl').to('hsb')()).to.be.eq('foreign')
      expect(store1.find('rgb').to('xyz')()).to.be.eq('foreign')
    })
  })
  describe('findNeighbors', function () {
    it('returns an array of neighboring color spaces', function () {
      var store = ColorSpaceStore.create()
      var rgb = ColorSpace.create('rgb')
      var luv = ColorSpace.create('luv')
      var xyz = ColorSpace.create('xyz')
      var lab = ColorSpace.create('lab', { abstract: true })

      xyz.defineConvTo('rgb', function () {})
      xyz.defineConvTo('lab', function () {})
      xyz.defineConvTo('xyz', function () {})
      xyz.defineConvTo('luv', function () {})

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
  describe('purge', function () {
    it('removes all mention of a color space')
  })
})
