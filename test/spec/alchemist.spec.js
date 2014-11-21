define(function (require) {
  var expect = require('vendor/chai/chai').expect
  var Alchemist = require('dist/alchemist')

  /**============
   * Alchemizer *
   ============**/

  describe('Alchemizer', function () {
    describe('use()', function () {
      var alchemize, rgb, xyz
      before(function () {
        Alchemist.removeAll()
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
        alchemize = Alchemist.create()
        alchemize.use(xyz)
        alchemize.use(rgb)
      })

      it('should create a color space', function () {
        expect(alchemize.spaces).to.exist
        expect(alchemize.spaces).to.have.property('rgb')
        expect(alchemize.spaces.rgb).to.be.an('object')
        expect(alchemize.spaces.rgb).to.have.property('to')
        expect(alchemize.spaces.rgb).to.not.have.property('from')
        expect(alchemize.spaces.rgb.to.xyz).to.be.a('function')
        expect(alchemize.spaces.rgb.to).to.not.have.property('hsl')
      })

      it('should allow a color space to teach another space how to convert to it')

      it('should prefer a local "to" conversion over a foreign "from" conversion')

      it('should store conversions to abstract spaces', function () {
        expect(alchemize.spaces.rgb.to).to.not.have.property('hsl')
        expect(alchemize.spaces.hsl).to.not.exist
        expect(alchemize.abstract_spaces.hsl).to.exist
        expect(alchemize.abstract_spaces.hsl.to.rgb()).to.eq('from hsl to rgb')
        expect(alchemize.abstract_spaces.hsl.from.rgb()).to.eq('to hsl from rgb')
      })
      it('should throw an error when the name is already used by a private method', function () {
        plugin = { name: 'use' }
        expect(alchemize.use.bind(null, plugin)).to.throw(Error)
      })
    })
  })

  /**===========
   * Alchemist *
   ===========**/

  describe('Alchemist', function () {
    describe('use()', function () {
      var alchemize1, alchemize2

      before(function () {
        Alchemist.removeAll()

        var rgb = { name: 'rgb', to: {}, from: {} }
        var xyz = { name: 'xyz', to: {}, from: {} }
        var hsl = { name: 'hsl', to: {}, from: {} }
        var lab = { name: 'lab', to: {}, from: {} }

        Alchemist.use(lab)

        alchemize1 = Alchemist.create()
        alchemize2 = Alchemist.create()

        alchemize1.use(rgb)
        alchemize2.use(hsl)
        Alchemist.use(xyz)
      })

      it('should attach those plugins to all of it\'s children', function () {
        expect(alchemize1.findColorSpace('lab')).to.be.ok
        expect(alchemize1.findColorSpace('xyz')).to.not.be.ok

        expect(alchemize2.findColorSpace('lab')).to.be.ok
        expect(alchemize2.findColorSpace('xyz')).to.not.be.ok

        expect(Alchemist.findColorSpace('lab')).to.be.ok
        expect(Alchemist.findColorSpace('xyz')).to.be.ok
      })

      it('should not be affected by it children\'s', function () {
        expect(Alchemist.findColorSpace('rgb')).to.not.be.ok
        expect(Alchemist.findColorSpace('hsl')).to.not.be.ok
      })

      it('children should not be affected by eachother', function () {
        expect(alchemize1.findColorSpace('rgb')).to.be.ok
        expect(alchemize1.findColorSpace('hsl')).to.not.be.ok

        expect(alchemize2.findColorSpace('hsl')).to.be.ok
        expect(alchemize2.findColorSpace('rgb')).to.not.be.ok
      })

      it('should not affect it\'s children after they\'ve been created', function () {
        expect(alchemize1.findColorSpace('xyz')).to.not.be.ok
        expect(alchemize2.findColorSpace('xyz')).to.not.be.ok
      })

      after(function () {
        Alchemist.removeAll()
      })
    })
  })

  /**=======
   * Color *
   =======**/

  describe('Color', function () {
    describe('color()', function () {
      var color, alchemize;
      before(function () {
        color = new Alchemist.Color('rgb', [255, 255, 255])
        alchemize = Alchemist.create()
      })

      it('should have a color space', function () {
        expect(color.color_space).to.equal('rgb')
      })

      it('should have values', function () {
        expect(color.value).to.deep.equal([255, 255, 255])
      })

      it('should be an instance of Alchemist.Color', function () {
        expect(color).to.be.an.instanceof(Alchemist.Color)
        expect(color).to.not.be.an.instanceof(alchemize.Color)
      })
    })

    describe('prototype.color()', function () {
      var alchemize, color;
      before(function () {
        alchemize = Alchemist.create()
        color = new alchemize.Color('rgb', [255, 255, 255])
      })

      it('should have a color space', function () {
        expect(color.color_space).to.equal('rgb')
      })

      it('should have values', function () {
        expect(color.value).to.deep.equal([255, 255, 255])
      })

      it('should be an instance of alchemize.Color', function () {
        expect(color).to.be.an.instanceof(alchemize.Color)
        expect(color).to.not.be.an.instanceof(Alchemist.Color)
      })
    })
  })

  /**=============
   * Conversions *
   =============**/

  describe('Conversions', function () {
    var alchemize, rgb, xyz, color

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
      alchemize = Alchemist.create()
      color = new alchemize.Color('rgb', 'some values')
      alchemize.use(xyz)
      alchemize.use(rgb)
      alchemize.use(lab)
    })

    describe('an initial call to a color space function', function () {
      it('should return a color', function () {
        expect(alchemize.xyz()).to.be.an.instanceof(alchemize.Color)
      })

      it('should return a color with the associated color space and values passed', function () {
        var color = alchemize.xyz([1, 2, 3])
        expect(color.value).to.deep.equal([1, 2, 3])
        expect(color.color_space).to.equal('xyz')
      })
    })

    describe('a following call to a color space function', function () {
      it('should call the provided conversion function', function () {
        expect(alchemize.xyz('xyz').rgb()).to.eq('xyz rgb')
      })

      it('should throw an error if there is not a provided conversion function', function () {
        expect(function () {
          alchemize.xyz('xyz').hsl()
        }).to.throw(Error)
      })
    })

    it('it should figure out the quickest conversion path if a direct conversion is not supplied', function () {
      expect(alchemize.lab('lab').rgb()).to.eq('lab xyz rgb')
    })
  })

  /**=========
   * Mapping *
   =========**/

  describe('Mapping', function () {
    var alchemize, xyz, rgb, cmy, cmyk, hsl, lab, lchab, luv, lchuv

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
      alchemize = Alchemist.create()
      alchemize.use(xyz)
      alchemize.use(rgb)
      alchemize.use(cmy)
      alchemize.use(cmyk)
      alchemize.use(hsl)
      alchemize.use(lab)
      alchemize.use(lchab)
      alchemize.use(luv)
      alchemize.use(lchuv)
    })

    describe('mapConversionPath', function () {
      it('should add "next step" strings on all applicable color spaces', function () {
        alchemize.mapConversionPath('lchuv', 'hsl')
        expect(alchemize.spaces.lchuv.to.hsl).to.eq('luv')
        expect(alchemize.spaces.luv.to.hsl).to.eq('xyz')
        expect(alchemize.spaces.xyz.to.hsl).to.eq('rgb')
      })
      it('should return the next step', function () {
        var next_step = alchemize.mapConversionPath('lchuv', 'hsl')
        expect(next_step).to.eq('luv')
      })
    })
  })
})
