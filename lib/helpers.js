
/**=========
 * Helpers *
 =========**/

/**
 * Mix all the things!
 *
 * Defines all the properties of the giving_obj on the receiving_obj. This
 * does not include properties higher up in the prototype chain.
 *
 * Also allows you to name the methods you want mixed
 *
 * @param {object} receiving_obj object receiving the properties
 * @param {object} giving_obj object that the properties will be taken from
 *
 * (thanks addyosamani)
 */

exports.mixin = function (receiving_obj, giving_obj) {
  // allows you to only mix in a set set of methods
  if (arguments[2]) {
    for (var i = 2, len = arguments.length; i < len; i++) {
      receiving_obj[arguments[i]] = giving_obj[arguments[i]]
    }
    // otherwise, mix all the things! (does not mix existing properties)
  } else {
    for (var method_name in giving_obj) {
      if (!Object.hasOwnProperty.call(receiving_obj, method_name)) {
        receiving_obj[method_name] = giving_obj[method_name]
      }
    }
    receiving_obj
  }
  return receiving_obj
}

/**
 * copy the original object's properties onto a new object and returns it
 *
 * @param {object} original object to be cloned
 */

exports.clone = function (original) {
  var Con = original.constructor

  if (typeof original === 'string' || typeof original === 'number')
    return new Con(original)

  if (isArray(original)) {
    var cloned_array = []
    for (var i = 0; i < original.length; i++) {
      cloned_array[i] = original[i]
    }
    return cloned_array
  }

  if (typeof original == 'object')
    return mixin({}, original)

  return null
}

/**
 * Same as clone, but just returns the original object when it doesn't recognize
 * the object. This is a dangerous function and should be used scarecely if at
 * all
 *
 * @param {object} orignal object to be cloned
 */

exports.attemptClone = function (original) {
  var cloned = this.clone(original);
  return cloned || original
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
