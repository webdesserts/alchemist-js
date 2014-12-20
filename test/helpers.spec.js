var helpers = require('../lib/helpers')
var expect = require('chai').expect

describe('helpers', function () {
  describe('.round(value, [precision])', function () {
    describe('when given a number', function () {
      it('rounds the number', function () {
        var rounded = helpers.round(6.6666666)
        expect(rounded).to.eq(6.6667)
      })
      it('rounds to a specific decimal place if a precision is provided', function () {
        var rounded = helpers.round(6.6666666, 2)
        expect(rounded).to.eq(6.67)
      })
    })
    describe('when given something else', function () {
      it('it returns it untouched', function () {
        var rounded = helpers.round('10.24057')
        expect(rounded).to.eq('10.24057')
      })
    })
    describe('when given an array', function () {
      it('attempts to round its contents', function () {
        var array = [6.66666, 'bla', 8.88888]
        var rounded = helpers.round(array)
        expect(rounded).to.deep.eq([6.6667, 'bla', 8.8889])
      })
    })
  })

  describe('.each(collection, function, [context])', function () {
    var array, obj;

    beforeEach(function () {
      array = [1, 0, 3, 4]
      obj = { a: 1, b: 0, c: 3, d: 4 }
    })

    describe('when given an array', function () {
      it('calls <function> with the value and index for each item', function () {
        helpers.each(array, function (val, i) {
          array[i] = val + 5
        })
        expect(array).to.deep.eql([6, 5, 8, 9])
      })
      it('returns any value returned from <function> and stops iterating', function () {
        var result = helpers.each(array, function (val, i) {
          if (val === 0) return val;
          if (val === 3) throw new Error('I did not stop iterating');
        })
        expect(result).to.eq(0)
      })
    })

    describe('when given an object', function () {
      it('calls <function> with the value and key for each item', function () {
        helpers.each(obj, function (val, key) {
          obj[key] = key + val
        })
        expect(obj).to.deep.eq({ a: 'a1', b: 'b0', c: 'c3', d: 'd4' })
      })
      it('returns any value returned from <function> and stops iterating', function () {
        var result = helpers.each(obj, function (val, key) {
          if (val === 0) return key;
          if (val === 3) throw new Error('I did not stop iterating');
        })
        expect(result).to.eq('b')
      })
    })

    it('binds the <function> with <context> if present', function () {
      var that;
      var my_context = {}

      helpers.each(array, function (val, i) {
        return that = this
      }, my_context)

      expect(that).to.eq(my_context)
    })
  })

  describe('.clone(obj)', function () {
    it('can clone Strings', function () {
      var obj1 = { val: 'hello' }
      var cloned = helpers.clone(obj1.val)
      expect(typeof cloned).to.eq('string')
      cloned += ' world'
      expect(cloned).to.not.eq(obj1.val)
    })
    it('can clone Numbers', function () {
      var obj1 = { val: 5 }
      var cloned = helpers.clone(obj1.val)
      expect(typeof cloned).to.eq('number')
      cloned += 6
      expect(cloned).to.not.eq(obj1.val)
    })
    it('can clone Arrays', function () {
      var obj1 = { val: [1, 2, 3] }
      var cloned = helpers.clone(obj1.val)
      cloned.push(4)
      expect(cloned).to.not.deep.eq(obj1.val)
    })
    it('throws an error if it\'s anything else', function () {
      obj = { val: 'hello', val2: 'world' }
      expect(helpers.clone.bind(obj)).to.throw(TypeError)
    })
  })

  describe('.isArray(obj)', function () {
    var array, obj, string;
    before(function () {
      array = [1, 2, 3]
      obj = { an: 'array', I: 'swear' }
      string = 'an array, I swear'
    })
    it('returns true if <obj> is an array', function () {
      expect(helpers.isArray(array)).to.be.true
    })
    it('returns false if <obj> is not an array', function () {
      expect(helpers.isArray(obj)).to.be.false
      expect(helpers.isArray(string)).to.be.false
    })
  })

  describe('.Createable', function () {
    var Obj;
    before(function () {
      Obj = Object.create(helpers.Createable)
    })
    describe('.create([params...])', function () {
      it('calls Object.create on itself and returns the result', function () {
        var new_obj = Obj.create()
        expect(Obj.isPrototypeOf(new_obj)).to.be.true
      })

      it('will call that object\'s init() on the result if available', function () {
        Obj.init = function () { this.message = 'hello world' }
        var new_obj = Obj.create()
        expect(new_obj.message).to.eq('hello world')
        expect(Obj.message).to.be.undefined
      })

      it('will pass any arguments to the init() function', function () {
        Obj.init = function (message) { this.message = message }
        var new_obj = Obj.create('hello world')
        expect(new_obj.message).to.eq('hello world')
        expect(Obj.message).to.be.undefined
      })
    })
    describe('.proto', function () {
      it('references the prototype of this object', function () {
        expect(Obj.proto).to.eq(helpers.Createable)
      })
      it('cannot be set', function () {
        expect(function () {
          Obj.proto = {}
        }).to.throw(Error)
      })
    })
  })
})
