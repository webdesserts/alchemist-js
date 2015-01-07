'use strict'

var Storage = require('../lib/storage')
var expect = require('chai').expect

describe('Storage', function () {
  var storage, a, b, c;

  beforeEach(function () {
    storage = Storage.create()
    a = { x: 1 }
    b = { x: 2 }
    c = { x: 3 }
  })

  describe('.add(name, value)', function () {
    it('adds <value> to the store under the given <key>', function () {
      storage.add('a', a)
      expect(storage.store.a).to.eq(a)
    })
    it('throws an error when <key> already exists', function () {
      storage.add('a', a)
      expect(function () {
        storage.add('a', a)
      }).to.throw(Error)
    })
  })

  describe('.find(key)', function () {
    beforeEach(function () {
      storage.add('a', a)
    })
    it('returns the value associated with the given <key>', function () {
      expect(storage.find('a')).to.eq(a)
    })
    it('returns null if <key> is not yet set', function () {
      expect(storage.find('b')).to.be.null
    })
  })

  describe('.has(key)', function () {
    beforeEach(function () {
      storage.add('a', a)
    })
    it('returns true if the <key> is present', function () {
      expect(storage.has('a')).to.be.true
    })
    it('returns false if the <key> is not present', function () {
      expect(storage.has('b')).to.be.false
    })
  })

  describe('.remove(key)', function () {
    beforeEach(function () {
      storage.add('a', a)
      storage.add('b', b)
    })
    it('safely removes the <key> and its associated value', function () {
      storage.remove('a')
      expect(storage.store.a).to.be.undefined
      expect(storage.store.b).to.eq(b)
    })
  })

  describe('.each(function, [context])', function () {
    beforeEach(function () {
      storage.add('a', a)
      storage.add('b', b)
      storage.add('c', c)
    })

    it('calls <function> with the value and key for each item', function () {
      storage.each(function (value, key) {
        value.x = key + value.x;
      })
      expect(storage.store).to.deep.eql({
        a: { x: 'a1' },
        b: { x: 'b2' },
        c: { x: 'c3' }
      })
    })
    it('returns any value returned from <function> and stops iterating', function () {
      var result = storage.each(function (value, key) {
        if (value === b) return value;
        if (value === c) throw new Error('I did not stop iterating');
      })
      expect(result).to.eq(b)
    })

    it('binds the <function> with <context> if present', function () {
      var that;
      var my_context = {}

      storage.each(function (key, value) {
        that = this
        return
      }, my_context)

      expect(that).to.eq(my_context)
    })
  })
  describe('.merge(foreign_store)', function () {
    var a2, d, foreign_store;
    beforeEach(function () {
      var merge = function (other) {
        this.x += other.x;
      }
      a.merge = merge
      a2 = { x: 7 }
      d = { x: 4 }
      storage.add('a', a)
      storage.add('b', b)
      foreign_store = Storage.create()
      foreign_store.add('d', d)
      foreign_store.add('a', a2)
    })
    it('adds the key if it does not yet exist in this store', function () {
      storage.merge(foreign_store)
      expect(storage.store.d.x).to.eq(4)
    })
    it('calls merge() on the value of the current key if that key already exists', function () {
      storage.merge(foreign_store)
      expect(storage.store.a.x).to.eq(8)
    })
  })
})
