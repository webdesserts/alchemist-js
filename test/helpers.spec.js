var helpers = require('../lib/helpers')
var expect = require('chai').expect

describe('helpers', function () {
  describe('round', function () {
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

  describe('each', function () {
    it('iterates over an array, returning the value and index for each item', function () {
      var array = [1, 2, 3]
      helpers.each(array, function (val, i) {
        array[i] = val + 5
      })
      expect(array).to.deep.eql([6, 7, 8])
    })

    it('stops iterating and return a result if a something is returned', function () {
      var array = [1, 0, 3, 4]
      var result = helpers.each(array, function (val, i) {
        if (val === 0) return val
      })
      expect(result).to.eq(0)
    })
  })

  describe('clone', function () {
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

  describe('Createable', function () {

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
