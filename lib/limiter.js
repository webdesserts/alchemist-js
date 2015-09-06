import * as _ from './helpers'
import Stateless from 'stateless'

var Limiter = Stateless.extend()

Limiter.init = function init (min, max, handler) {
  if (min) this.min = min
  if (max) this.max = max
  if (handler) this.handler = handler
}

/**
 * Check whether a value set breaks the provided limits
 */

Limiter.check = function check (values) {
  values = this.checkBoundary('min', values)
  values = this.checkBoundary('max', values)
  return values
}

/**
 * Checks one side of the provided limits (either 'max' or 'min') and returns the
 * resulting values (or throws an error in the case of 'strict')
 */

Limiter.checkBoundary = function (boundary, values) {
  var limits = this[boundary]
  if (!values || !limits || this.handler === 'raw') return values;

  _.each(limits, function (limit, i) {
    if (this.breaks(limit, values[i], boundary)) {
      if (this.handler === 'clip') {
        values[i] = limit
      } else if (this.handler === 'nullify') {
        values = null
        return values
      } else if (this.handler === 'strict') {
        var gt_or_lt = this.handler === 'max' ? 'less' : 'greater'
        throw new Error('Expected ' + values[i] + ' to be ' + gt_or_lt + ' than or equal to ' + limit)
      }
    }
  }, this)
  return values
}

/**
 * Returns true if <value> breaks a given <limit>
 */

Limiter.breaks = function breaksLimit (limit, value, boundary) {
  if (boundary === 'max') {
    return value > limit
  } else if (boundary === 'min') {
    return value < limit
  }
}

/**
 * Merges two Limiters. Always prefers teh min/max definitions of the foreign store
 */

Limiter.merge = function merge (foreign_limiter) {
  if (foreign_limiter.min !== undefined) this.min = foreign_limiter.min
  if (foreign_limiter.max !== undefined) this.max = foreign_limiter.max
}

export default Limiter
