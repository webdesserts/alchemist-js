var helpers = require('./helpers')

var Converter = Object.create(helpers.Createable)

Converter.init = function init (color_spaces, context) {
  this.spaces = color_spaces
  this.context = context || null
}

Converter.convert = function convert (color, target_name) {
  var current_name = color.color_space
  var current_space = this.spaces.find(current_name)
  var target_space = this.spaces.find(target_name)

  if (!current_space) throw new Error('could not find the ' + current_name + ' color space');
  if (!target_space) throw new Error('could not find the ' + target_name + ' color space');

  var conversion = current_space.to(target_name)
  // Test to see if the current space knows how to convert to target
  if (typeof conversion === 'function') {
    return this.applyConversion(color, target_name, conversion)
  // if the conversion is a another color space
  } else if (typeof conversion === 'string') {
    var next_color = this.followPointer(color, current_space, conversion)
    return this.convert(next_color, target_name)
  } else {
    // attempt to find path
    var next_space = this.mapConversionPath(current_name, target_name)

    // if we find the path begin stepping down it
    if (next_space) return this.convert(color, target_name);

    // else throw an error
    else throw new Error('Alchemist does not know how to convert from ' + current_space.name + ' to ' + target_space.name)
  }
}

Converter.applyConversion = function applyConversion (color, target, conversion) {
  var value;
  if (helpers.isArray(color.value)) {
    value = conversion.apply(this.context, helpers.clone(color.value).concat(color));
  } else {
    value = conversion(helpers.clone(color.value), color)
  }
  value = helpers.round(value)
  color.color_space = target
  color.value = value
  return color
}

Converter.followPointer = function followPointer (color, current_space, pointer) {
  // that should mean that color space knows how to convert, so convert to
  // that one and try from there
  var conversion = current_space.to(pointer)
  if (typeof conversion !== 'function') throw new TypeError('Expected the pointer, ' + pointer  + ', to point to a function; Instead found  ' + conversion )
  return this.applyConversion(color, pointer, conversion)
}

Converter.mapConversionPath = function mapConversionPath (current, target) {
  var conversion
  // Is there a path?
  var parents = this.findConversionPath(current, target)
  // if not return null
  if (!parents) return null;

  var next_space = parents[target]
  var space = parents[next_space]

  var steps_taken = 0

  // step backwards through the parent array and leave "next step" instructions along the way
  while (steps_taken < 100) {
    conversion = this.spaces.find(space).to(target)

    if (!conversion || typeof conversion !== 'function') {
      this.spaces.find(space).definePointerTo(target, next_space)
    }

    // if we're finished mapping, go ahead and tell us how to start the conversion
    if (space === current) return next_space;
    else if (!parents[space]) return null;

    // take a step backwards
    next_space = space
    space = parents[space]
    steps_taken++
  }

  throw new Error('something went wrong while mapping the path from' + current_space + ' to ' + target_space)
}

Converter.findConversionPath = function findConversionPath (current_space, target_space) {
  var Q = []
  var explored = []
  var parent = {}
  Q.push(current_space)
  explored.push(current_space)

  while (Q.length) {
    var space = Q.pop()
    if (space === target_space) { return parent }
    var neighbors = this.spaces.findNeighbors(space)

    // for each neighbor
    for (var i = 0; i < neighbors.length; i++) {
      var neighbor = neighbors[i]

      // if this neighbor hasn't been explored yet
      if (explored.indexOf(neighbor) === -1) {
        parent[neighbor] = space
        explored.push(neighbor)
        Q.push(neighbor)
      }
    }
  }
  return null
}

module.exports = Converter
