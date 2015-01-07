'use strict'

var _ = require('./helpers')

var Limiter = _.Createable.create()

Limiter.init = function init (min, max, handler) {
  if (min) this.min = min
  if (max) this.max = max
  if (handler) this.handler = handler
}

Limiter.check = function check (values) {
  values = this.checkBoundary('min', values)
  values = this.checkBoundary('max', values)
  return values
}

Limiter.checkBoundary = function (boundary, values) {
  var limits = this[boundary]
  if (!values || !limits) return values;

  _.each(limits, function (limit, i) {
    if (this.breaks(limit, values[i], boundary)) {
      if (this.handler === 'clip') {
        values[i] = limit
      } else if (this.handler === 'nullify') {
        values = null
        return
      } else if (this.handler === 'strict') {
        var gt_or_lt = this.handler === 'max' ? 'less' : 'greater'
        throw new Error('Expected ' + values[i] + ' to be ' + gt_or_lt + ' than or equal to ' + limit)
      }
    }
  }, this)
  return values
}

Limiter.breaks = function breaksLimit (limit, value, boundary) {
  if (boundary === 'max') {
    return value > limit
  } else if (boundary === 'min') {
    return value < limit
  }
}

Limiter.merge = function merge (foreign_limiter) {
  if (foreign_limiter.min !== undefined) this.min = foreign_limiter.min
  if (foreign_limiter.max !== undefined) this.max = foreign_limiter.max
}

module.exports = Limiter
