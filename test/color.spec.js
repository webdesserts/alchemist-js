'use strict'

var Color = require('../lib/color')
var expect = require('chai').expect

describe('Color', function () {
  describe('.to(target_name)', function () {
    it('converts to a color and returns it\'s value', function () {
      var converter = { convert: function (color, dest) { return Color.create('converted to ' + dest) } }
      var color = Color.create({ converter: converter })
      expect(color.to('hsl')).to.eq('converted to hsl')
    })
  })
  describe('.as(target_name)', function () {
    it('converts to a color and returns a color', function () {
      var converter = { convert: function (color, dest) { return Color.create('converted to ' + dest) } }
      var color = Color.create({ converter: converter })
      var new_color = color.as('hsl')
      expect(Color.isPrototypeOf(new_color)).to.be.true
      expect(new_color.value).to.eq('converted to hsl')
    })
  })
})
