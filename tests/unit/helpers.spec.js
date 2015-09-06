import * as helpers from '../../lib/helpers'

describe('helpers', function () {
  describe('.round(value, [precision])', function () {
    describe('when given a number', function () {
      it('rounds the number', function () {
        var rounded = helpers.round(6.6666666)
        expect(rounded).to.eq(6.667)
      })
      it('rounds to a specific decimal place if a precision is provided', function () {
        var rounded = helpers.round(6.6666666, 2)
        expect(rounded).to.eq(6.7)
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
        expect(rounded).to.deep.eq([6.667, 'bla', 8.889])
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
        that = this
        return
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
      var obj = { val: 'hello', val2: 'world' }
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

  describe('.isPlainObject(obj)', function () {
    it('returns true if <obj> is an object', function () {
      expect(helpers.isPlainObject({ a: 1, b: 2, c: 3 })).to.be.true
      expect(helpers.isPlainObject({})).to.be.true
    })
    it('returns false if <obj> is an instantiated Object', function () {
      var Shape = function () {}
      expect(helpers.isPlainObject(new Shape())).to.be.false
    })
    it('returns false if <obj> is null or undefined', function () {
      expect(helpers.isPlainObject(null)).to.be.false
      expect(helpers.isPlainObject(undefined)).to.be.false
    })
    it('returns false if <obj> is an array', function () {
      expect(helpers.isPlainObject(['totally', 'an', 'object'])).to.be.false
    })
    it('returns false if <obj> other things', function () {
      expect(helpers.isPlainObject('an object, I swear')).to.be.false
      expect(helpers.isPlainObject(1)).to.be.false
      expect(helpers.isPlainObject(0)).to.be.false
    })
  })
})
