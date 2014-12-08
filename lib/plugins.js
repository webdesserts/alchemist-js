var ColorSpace = require('./colorSpace')
var ColorSpaceStore = require('./colorSpaceStore')
var helpers = require('./helpers')

plugins = {}

plugins.serialize = function (plugin) {
  if (plugin.to || plugin.from) {
    return this.serializeColorSpace(plugin)
  } else if (plugin.modifies) {
    return this.serializeModifier(plugin)
  } else throw new Error('unrecognized plugin format');
}

plugins.serializeColorSpace = function serializeColorSpace (plugin) {
  var results, color_space, abstract_space;

  if (typeof plugin.name !== 'string') throw Error('Error: color-space plugin is missing a name')

  results = ColorSpaceStore.create()
  color_space = ColorSpace.create(plugin.name)
  results.add(color_space)

  for (dest_name in plugin.to) {
    color_space.defineConvTo(dest_name, plugin.to[dest_name])
  }

  for (src_name in plugin.from) {
    abstract_space = ColorSpace.create(src_name, { abstract: true })
    abstract_space.defineConvTo(plugin.name, plugin.from[src_name])
    results.add(abstract_space)
  }

  return results
}

plugins.serializeModifier = function serializeModifier (plugin) {
  throw new Error('Modifiers aren\'t implemented yet! Sorry!')
}

module.exports = plugins
