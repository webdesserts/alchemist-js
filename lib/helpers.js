/**
 * If <target> is a String or Number create a new object with those values.
 * If <target> is an Array, recursively call this function on all of it's contents
 */

export function clone (target) {
  var cloned;

  var obj = Object(target)

  switch (obj.constructor) {
    case String:
      cloned = obj.toString()
      break;
    case Number:
      cloned = Number(obj)
      break;
    case Array:
      cloned = []
      each(obj, function (item, i) {
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
 */

export function isArray (object) {
  return Array.isArray(object)
}

export function isObject (object) {
  return Boolean(object && typeof object === 'object')
}

export function isFunction (func) {
  return typeof func === 'function'
}

/**
 * Tests to see if an object is a Plain Object produced from an object literal.
 * This is good for testing things like function options.
 */

export function isPlainObject (object) {
  if (!(object && toString.call(object) === '[object Object]')) return false
  return Object.getPrototypeOf(object) === Object.prototype
}

/**
 * Tests if an object is a string literal
 */

export function isString (object) {
  return typeof object === 'string'
}

/**
 * takes an array or object, iterates over it, and calls <func> on each iteration
 * if the function returns anything, the iteration is halted and the result is returned
 */

export function each (collection, func, context) {
  var result;
  context = context || null
  if (isArray(collection)) {
    var length = collection.length
    for (var i = 0; i < length; i++) {
      result = func.call(context, collection[i], i)
      if (result !== undefined) return result
    }
  } else {
    for (var key in collection) {
      result = func.call(context, collection[key], key)
      if (result !== undefined) return result
    }
  }
  return null
}

/**
 * If <value> is a number, it will round it. If <value> is an
 * Array it will try to round it's contents. If <precision> is present, it will
 * round to that decimal value. The default <precision> is 4.
 */

export function round (value, precision) {
  precision = precision || 4
  if (isArray(value)) {
    for (var i = 0; i < value.length; i++) {
      value[i] = this.roundIfNumber(value[i], precision)
    }
  } else {
    value = roundIfNumber(value, precision)
  }
  return value
}

/**
 * If <value> is a number, we round it to whatever the current <precision> setting
 * is at.
 */

export function roundIfNumber (value, precision) {
  if (typeof value === 'number') {
    value = Number(value.toPrecision(precision))
  }
  return value
}
