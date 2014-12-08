
/**=========
 * Helpers *
 =========**/

/**
 * copy the original object's properties onto a new object and returns it
 *
 * @param {object} original object to be cloned
 */

exports.clone = function clone (target) {
  "use strict";
  var cloned;

  var obj = Object(target);

  switch (obj.constructor) {
    case String:
      cloned = obj.toString()
      break;
    case Number:
      cloned = Number(obj)
      break;
    case Array:
      cloned = []
      this.each(obj, function (item, i) {
        cloned[i] = clone(item)
      })
      break;
    default:
      throw new TypeError('Alchemist does not know how to clone ' + target)
  }
  return cloned;
}

/**
 * I don't think Array.isArray is well supported. Use this function instead for
 * now so that if we need to add a fallback it won't take as much effort.
 *
 * @param {object} object possibly an array?
 */

exports.isArray = function isArray (object) {
  return Array.isArray(object)
}

exports.each = function each (array, func, context) {
  var length = array.length
  var result;
  context = context || null
  for (var i = 0; i < length; i++) {
    result = func.call(context, array[i], i)
    if (result != undefined) return result
  }
return null
}

/**
 * If the passed value is a number, it will round it. If the passed value is an
 * Array it will try to round each of it's values. the rounding is based on
 * Alchemist's precision option
 *
 * @param {object} value the object we will try to round
 */

exports.round = function (value, precision) {
  precision = precision || 4
  if (exports.isArray(value)) {
    for (var i = 0; i < value.length; i++) {
      value[i] = this.roundIfNumber(value[i], precision)
    }
  } else {
    value = this.roundIfNumber(value, precision)
  }
  return value
}

/**
 * If the value is a number, we round it to whatever the current precision setting
 * is at.
 *
 * @param {object} value the possible number to be rounded
 */

exports.roundIfNumber = function (value, precision) {
  if (typeof value === 'number') {
    value = Number(value.toFixed(precision))
  }
  return value
}

exports.Createable = {
  create: function () {
    var obj = Object.create(this)
    if (obj.init) obj.init.apply(obj, arguments);
    return obj
  }
}
