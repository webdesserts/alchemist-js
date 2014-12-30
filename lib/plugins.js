var Color = require('./color')
var ColorSpaceStore = require('./colorSpaceStore')
var ConversionStore = require('./conversionStore')
var helpers = require('./helpers')

plugins = {}

/**
 * Identifies the type of plugin passed. If type() can't identify the <plugin>
 * it throws an error.
 */

plugins.identify = function identify (plugin) {
  this.validatePlugin(plugin)
  if (plugin.to || plugin.from) {
    this.validateColorSpacePlugin(plugin)
    return 'space'
  } else if (plugin.methods) {
    this.validateMethodPlugin(plugin)
    return 'method'
  } else throw new Error('Unrecognized plugin format');
}

/**
 * Validates any generic plugin
 */

plugins.validatePlugin = function validatePlugin (plugin) {
  if (!helpers.isObject(plugin)) throw new Error('Expected plugin to be an object; instead got: ' + plugin);
  if (!helpers.isString(plugin.name)) throw new Error('Expect plguin.name to be a string; instead got: ' + plugin.name)
}

/**
 * Validates a colorspace-plugin
 */

plugins.validateColorSpacePlugin = function validateColorSpacePlugin (plugin) {
  if (!(plugin.to || plugin.from)) throw new Error('Conversions were not defined for the "' + plugin.name + '" colorspace plugin');
}

/**
 * Validates a method-plugin
 */

plugins.validateMethodPlugin = function validateMethodPlugin (plugin) {
  if (!(plugin.methods.color || plugin.methods.global)) throw new Error('Missing methods for method plugin');
  if (plugin.methods.color && !helpers.isFunction(plugin.methods.color)) throw new Error('Expected color method to be a function; instead got ' + plugin.methods.color);
  if (plugin.methods.global && !helpers.isFunction(plugin.methods.global)) throw new Error('Expected color method to be a function; instead got ' + plugin.methods.color);
}

/**
 * Converts a colorspace plugin into a usable ColorSpaceStore that can be merged
 * with the main store.
 *
 * All conversions defined in the "to" object will be added under the main
 * colorspace. An abstract colorspace is created for each conversion in the
 * "from" object.
 */

plugins.serializeColorSpace = function serializeColorSpace (plugin, BaseSpace) {
  var results, color_space, abstract_space, conversion;

  if (!helpers.isString(plugin.name)) throw new Error('color-space plugin is missing a name')

  results = ColorSpaceStore.create()
  color_space = BaseSpace.create({
    type: plugin.name,
    conversions: ConversionStore.create()
  })
  results.add(color_space)

  for (var dest_name in plugin.to) {
    conversion = plugin.to[dest_name]
    if (typeof conversion !== 'function') throw new Error('expected ' + conversion + ' to be a function')
    color_space.conversions.add(dest_name, plugin.to[dest_name])
  }

  for (var src_name in plugin.from) {
    conversion = plugin.from[src_name]
    if (typeof conversion !== 'function') throw new Error('expected ' + conversion + ' to be a function')

    abstract_space = BaseSpace.create({
      type: src_name,
      abstract: true,
      conversions: ConversionStore.create()
    })

    abstract_space.conversions.add(plugin.name, plugin.from[src_name])
    results.add(abstract_space)
  }

  return results
}

module.exports = plugins
