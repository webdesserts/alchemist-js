var expect = require('chai').expect
var Alchemist = require('../')

/**===========
 * Alchemist *
 ===========**/

describe('Alchemist', function () {
  describe('use()', function () {
    var alchemist, rgb, xyz
    before(function () {
      xyz = { name: 'xyz', from: { }, to: { } }
      rgb = {
        name: 'rgb',
        to: {
          xyz: function () { return 'to xyz from rgb' },
          hsl: function () { return 'to hsl from rgb' }
        },
        from: {
          xyz: function () { return 'from xyz to rgb' },
          hsl: function () { return 'from hsl to rgb' }
        }
      }
      alchemist = Alchemist.create()
      alchemist.use(xyz)
      alchemist.use(rgb)
    })

    it('should create a color space', function () {
      expect(alchemist.spaces).to.exist
      expect(alchemist.spaces).to.have.property('rgb')
      expect(alchemist.spaces.rgb).to.be.an('object')
      expect(alchemist.spaces.rgb).to.have.property('to')
      expect(alchemist.spaces.rgb).to.not.have.property('from')
      expect(alchemist.spaces.rgb.to.xyz).to.be.a('function')
      expect(alchemist.spaces.rgb.to).to.not.have.property('hsl')
    })

    it('should allow a color space to teach another space how to convert to it')

    it('should prefer a local "to" conversion over a foreign "from" conversion')

    it('should store conversions to abstract spaces', function () {
      expect(alchemist.spaces.rgb.to).to.not.have.property('hsl')
      expect(alchemist.spaces.hsl).to.not.exist
      expect(alchemist.abstract_spaces.hsl).to.exist
      expect(alchemist.abstract_spaces.hsl.to.rgb()).to.eq('from hsl to rgb')
      expect(alchemist.abstract_spaces.hsl.from.rgb()).to.eq('to hsl from rgb')
    })
    it('should throw an error when the name is already used by a private method', function () {
      plugin = { name: 'use' }
      expect(alchemist.use.bind(null, plugin)).to.throw(Error)
    })
  })
})

/**=======
 * Color *
 =======**/

describe('Color', function () {
  describe('color()', function () {
    var color, alchemist;
    before(function () {
      color = new Alchemist.Color('rgb', [255, 255, 255])
      alchemist = Alchemist.create()
    })
    it('should have a reference white', function () {
      expect(color.white).to.exist()
    })

    it('should have a color space', function () {
      expect(color.color_space).to.equal('rgb')
    })

    it('should have values', function () {
      expect(color.value).to.deep.equal([255, 255, 255])
    })
  })

  describe('prototype.color()', function () {
    var alchemist, color;
    before(function () {
      alchemist = Alchemist.create()
      color = new alchemist.Color('rgb', [255, 255, 255])
    })

    it('should have a color space', function () {
      expect(color.color_space).to.equal('rgb')
    })

    it('should have values', function () {
      expect(color.value).to.deep.equal([255, 255, 255])
    })
  })
})

/**=============
 * Conversions *
 =============**/

describe('Conversions', function () {
  var alchemist, rgb, xyz, color

  beforeEach(function () {
    xyz = { name: 'xyz', to: {} }
    rgb = {
      name: 'rgb',
      to: { xyz: function (value) { return value + ' xyz' } },
      from: { xyz: function (value) { return value + ' rgb' } }
    }
    lab = {
      name: 'lab',
      to: { xyz: function (value) { return value + ' xyz' } },
      from: { xyz: function (value) { return value + ' lab' } }
    }
    alchemist = Alchemist.create()
    color = new alchemist.Color('rgb', 'some values')
    alchemist.use(xyz)
    alchemist.use(rgb)
    alchemist.use(lab)
  })

  describe('an initial call to a color space function', function () {
    it('should return a color', function () {
      expect(alchemist.xyz()).to.be.an.instanceof(alchemist.Color)
    })

    it('should return a color with the associated color space and values passed', function () {
      var color = alchemist.xyz([1, 2, 3])
      expect(color.value).to.deep.equal([1, 2, 3])
      expect(color.color_space).to.equal('xyz')
    })
  })

  describe('a following call to a color space function', function () {
    it('should call the provided conversion function', function () {
      expect(alchemist.xyz('xyz').rgb()).to.eq('xyz rgb')
    })

    it('should throw an error if there is not a provided conversion function', function () {
      expect(function () {
        alchemist.xyz('xyz').hsl()
      }).to.throw(Error)
    })
  })

  it('it should figure out the quickest conversion path if a direct conversion is not supplied', function () {
    expect(alchemist.lab('lab').rgb()).to.eq('lab xyz rgb')
  })
})

/**=========
 * Mapping *
 =========**/

describe('Mapping', function () {
  var alchemist, xyz, rgb, cmy, cmyk, hsl, lab, lchab, luv, lchuv

  beforeEach(function () {
    xyz =  { name: 'xyz', to: {} }
    rgb =  {
      name: 'rgb',
      to:   { 'xyz': function () {} },
      from: { 'xyz': function () {} }
    }
    cmy =  {
      name: 'cmy',
      to:   { 'rgb': function () {} },
      from: { 'rgb': function () {} }
    }
    cmyk = {
      name: 'cmyk',
      to:   { 'cmy': function () {} },
      from: { 'cmy': function () {} }
    }
    hsl =  {
      name: 'hsl',
      to:   { 'rgb': function () {} },
      from: { 'rgb': function () {} }
    }
    lab =  {
      name: 'lab',
      to:   { 'xyz': function () {} },
      from: { 'xyz': function () {} }
    }
    lchab =  {
      name: 'lchab',
      to:   { 'lab': function () {} },
      from: { 'lab': function () {} }
    }
    luv =  {
      name: 'luv',
      to:   { 'xyz': function () {} },
      from: { 'xyz': function () {} }
    }
    lchuv =  {
      name: 'lchuv',
      to:   { 'luv': function () {} },
      from: { 'luv': function () {} }
    }
    alchemist = Alchemist.create()
    alchemist.use(xyz)
    alchemist.use(rgb)
    alchemist.use(cmy)
    alchemist.use(cmyk)
    alchemist.use(hsl)
    alchemist.use(lab)
    alchemist.use(lchab)
    alchemist.use(luv)
    alchemist.use(lchuv)
  })

  describe('mapConversionPath', function () {
    it('should add "next step" strings on all applicable color spaces', function () {
      alchemist.mapConversionPath('lchuv', 'hsl')
      expect(alchemist.spaces.lchuv.to.hsl).to.eq('luv')
      expect(alchemist.spaces.luv.to.hsl).to.eq('xyz')
      expect(alchemist.spaces.xyz.to.hsl).to.eq('rgb')
    })
    it('should return the next step', function () {
      var next_step = alchemist.mapConversionPath('lchuv', 'hsl')
      expect(next_step).to.eq('luv')
    })
  })
})
