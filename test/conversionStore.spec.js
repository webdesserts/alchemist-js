'use strict'

var ConversionStore = require('../lib/conversionStore')
var expect = require('chai').expect

describe('ConversionStore', function () {
  var conversions, rgb, xyz, hsl;

  beforeEach(function () {
    conversions = ConversionStore.create()
    rgb = function () {}
    xyz = function () {}
    hsl = function () {}
  })

  describe('.add(dest_name, conversion)', function () {
    it('adds <conversion> to the store under the given <dest_name>', function () {
      conversions.add('rgb', rgb)
      expect(conversions.store.rgb).to.eq(rgb)
    })
    it('throws an error when <dest_name> already exists', function () {
      conversions.add('rgb', rgb)
      expect(function () {
        conversions.add('rgb', rgb)
      }).to.throw(Error)
    })
  })

  describe('.find(dest_name)', function () {
    beforeEach(function () {
      conversions.add('rgb', rgb)
    })
    it('returns the value associated with the given <dest_name>', function () {
      expect(conversions.find('rgb')).to.eq(rgb)
    })
    it('returns null if <dest_name> is not yet set', function () {
      expect(conversions.find('xyz')).to.null
    })
  })

  describe('.has(dest_name)', function () {
    beforeEach(function () {
      conversions.add('rgb', rgb)
    })
    it('returns true if the <dest_name> is present', function () {
      expect(conversions.has('rgb')).to.be.true
    })
    it('returns false if the <dest_name> is not present', function () {
      expect(conversions.has('xyz')).to.be.false
    })
  })

  describe('.remove(dest_name)', function () {
    beforeEach(function () {
      conversions.add('rgb', rgb)
      conversions.add('xyz', xyz)
    })
    it('safely removes the <dest_name> and its associated conversion', function () {
      conversions.remove('rgb')
      expect(conversions.store.rgb).to.be.undefined
      expect(conversions.store.xyz).to.eq(xyz)
    })
  })

  describe('.each(function, [context])', function () {
    beforeEach(function () {
      conversions.add('rgb', rgb)
      conversions.add('xyz', xyz)
      conversions.add('hsl', hsl)
    })

    it('calls <function> with the conversion and dest_name for each item', function () {
      var results = {}

      conversions.each(function (value, key) {
        results[key] = value
      })

      expect(results).to.deep.eql({
        'rgb': rgb,
        'xyz': xyz,
        'hsl': hsl
      })
    })
    it('returns any value returned from <function> and stops iterating', function () {
      var result = conversions.each(function (value, key) {
        if (value === xyz) return value;
        if (value === hsl) throw new Error('I did not stop iterating');
      })
      expect(result).to.eq(xyz)
    })

    it('binds the <function> with <context> if present', function () {
      var that;
      var my_context = {}

      conversions.each(function () {
        that = this
        return
      }, my_context)

      expect(that).to.eq(my_context)
    })
  })
  describe('.merge(foreign_store)', function () {
    var rgb2, lab, luv, foreign_store;
    beforeEach(function () {
      rgb2 = function () {}
      lab = function () {}
      luv = function () {}
      foreign_store = ConversionStore.create()
    })
    it('adds the conversion if it does not yet exist in this store', function () {
      foreign_store.add('lab', lab)
      conversions.merge(foreign_store)

      expect(conversions.store.lab).to.eq(lab)
    })
    it('keeps the current conversion if both stores have the same conversion', function () {
      conversions.add('rgb', rgb)
      foreign_store.add('rgb', rgb2)
      conversions.merge(foreign_store)

      expect(conversions.store.rgb).to.eq(rgb)
    })
    it('uses the a foreign conversion if the local conversion is just a pointer', function () {
      conversions.add('luv', 'xyz')
      foreign_store.add('luv', luv)
      conversions.merge(foreign_store)

      expect(conversions.store.luv).to.eq(luv)
    })
    describe('when options.force is true', function () {
      it('adds the conversion if it does not yet exist in this store', function () {
        foreign_store.add('lab', lab)
        conversions.merge(foreign_store, { force: true })

        expect(conversions.store.lab).to.eq(lab)
      })
      it('uses the foreign store  if both stores have the same conversion', function () {
        conversions.add('rgb', rgb)
        foreign_store.add('rgb', rgb2)
        conversions.merge(foreign_store, { force: true })

        expect(conversions.store.rgb).to.eq(rgb2)
      })
    })
  })
})
