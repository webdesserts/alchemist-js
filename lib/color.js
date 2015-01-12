'use strict'

var _ = require('./helpers')

/**
 * Color is our heavy lifter. In order for a Color to be convertable you need a
 * converter, conversions, a space, and a value to all be defined. This is a lot
 * of pre-requisites so Color was designed to be built over 3 stages of
 * inheritance, including a few of the requirements at a time.
 *
 * BaseSpace (converter)
 *   V
 * ColorSpace (conversions, space)
 *   V
 * Color (value)
 *
 * Example:
 * - All colors should have their own values
 * - All "rgb" colors should have the same set of conversions
 * - All colors in general should have common conversion logic contained in a
 *   converter.
 *
 * Color methods should be defined on the BaseSpace to ensure all colors up
 * the chain receive the same methods without having to add them on the fly
 * during Color creation
 */

var Color = _.Createable.create()

/**
 * Initializes Color's state. Is called on create()
 */

Color.init = function init (value, options) {
  if (_.isPlainObject(arguments[0])) {
    options = arguments[0]
  } else if (value !== undefined) {
    if (this.limits) this.value = this.limits.check(value);
    else this.value = value;
  }

  options = options || {}

  // BaseSpace
  if (options.limiter) this.limits = options.limiter;
  if (options.precision) this.precision = options.precision;
  if (options.converter) this.converter = options.converter;

  // ColorSpace
  if (options.conversions) this.conversions = options.conversions;
  if (options.space) this.space = options.space;

  // this is actually specific to xyz and it's adjecant color spaces
  // eventually this should somehow be retreivable from the xyz color space
  if (options.white) this.white = options.white;

  this.is_concrete = !options.abstract
}

/**
 * Converts a color and returns its values
 */

Color.to = function to (target_name, options) {
  options = options || {}
  var color = this.as(target_name)
  if (options.precision === null) return color.val;
  else return color.round(options.precision)
}

/**
 * Converts a color and returns the new color
 */

Color.as = function as (target_name) {
  return this.converter.convert(this, target_name)
}

/**
 * Rounds the value to the given precision.
 * If a precision isn't provided, it uses the default
 */

Color.round = function round (precision) {
  return _.round(this.value, precision || this.precision)
}

module.exports = Color
