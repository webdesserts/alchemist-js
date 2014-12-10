var ColorSpace = require('./colorSpace')
var helpers = require('./helpers')

var ColorSpaceStore = Object.create(helpers.Createable)

ColorSpaceStore.init = function init () {
  this.store = []
}

ColorSpaceStore.add = function add (color_space) {
  this.store.push(color_space)
}

ColorSpaceStore.find = function find (space_name) {
  var i = this.findIndex(space_name)
  return this.store[i] || null
}

ColorSpaceStore.findIndex = function findIndex (space_name) {
  var result = this.each(function (space, i) {
    if (space.name === space_name) return i;
  })
  return result
}

ColorSpaceStore.findNeighbors = function findNeighbors (space_name) {
  var neighbors = []
  var color_space = this.find(space_name)

  if (color_space === null) return neighbors;

  var conversions = color_space.conversions

  for (var target in conversions) {
    var target_space = this.find(target)
    if (target_space && !target_space.isAbstract)
      neighbors.push(target);
  }
  return neighbors
}

ColorSpaceStore.has = function has (space_name) {
  var i = this.findIndex(space_name)
  return Boolean(i || i === 0)
}

ColorSpaceStore.remove = function remove (space_name) {
  var i = this.findIndex(space_name)
  this.store.splice(i, 1)
}

ColorSpaceStore.each = function each (func, context) {
  return helpers.each.call(this, this.store, func, context)
}

ColorSpaceStore.merge = function merge (external_store) {
  external_store.each(function (color_space) {
    this.mergeColorSpace(color_space)
  }.bind(this))
}

ColorSpaceStore.mergeColorSpace = function mergeColorSpace (color_space) {
  var name = color_space.name
  local_space = this.find(name)
  if (!local_space) {
    this.add(color_space)
  } else {
    local_space.merge(color_space)
  }
}

module.exports = ColorSpaceStore
