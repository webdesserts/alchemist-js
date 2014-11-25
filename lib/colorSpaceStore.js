
/**===================
 * Color Space Store *
 ===================**/

var ColorSpaceStore = {}

/**
 * Runs a breadth first search across the conversion tree to find the
 * quickest path from the source color space to the provided destination space.
 * It collects a crawlable list of parents to each space as it steps through
 * the tree. This can be used to retrace out steps once the destination space
 * is found.
 *
 * The parent array for a conversion path from rgb to cmyk might look something
 * like this:
 *
 * [ hsl: 'rgb', cmy: 'rgb', cmyk: 'cmy' ]
 *
 * If a path can be found it returns the parent array
 * If a path could not be found it returns null
 *
 * @param {object} src_space source space
 * @param {object} dest_space destination space
 */

ColorSpaceStore.findConversionPath = function Search (src_space, dest_space) {
  var Q = []
  var explored = []
  var parent = {}
  Q.push(src_space)
  explored.push(src_space)

  while (Q.length) {
    var space = Q.pop()
    if (space === dest_space) { return parent }
    var neighbors = this.findNeighbors(space)

    for (var i = 0; i < neighbors.length; i++) {
      var neighbor = neighbors[i]

      // if this space hasn't been explored yet
      if (explored.indexOf(neighbor) === -1) {
        parent[neighbor] = space
        explored.push(neighbor)
        Q.push(neighbor)
      }
    }
  }
  return null
}

/**
 * For a given color space, collect a list of neighboring color spaces
 *
 * @param {string} color_space the name of the color space to be searched
 */

ColorSpaceStore.findNeighbors = function findNeighbors (color_space) {
  var neighbors = []
  var conversions = this.spaces[color_space].to
  for (conv_space in conversions) {
    if (typeof conversions[conv_space] === 'function') {
      neighbors.push(conv_space)
    }
  }
  return neighbors
}

/**
 * Short Description:
 * Maps the steps necessary to convert from one color space to another
 *
 * Long Description:
 * First tries to find a path. If there is none, we return null
 *
 * Then steps backward through the path found in findConversionPath and sets the
 * crawlable path by defining a "next step" pointer on color spaces along the
 * path of a conversion
 *
 * If you couldn't tell already this function is super fucking confusing because
 * it's hard to think backwards and because I am horrible at writing code so gl;hf
 *
 * @param {string} current_space start of the conversion path
 * @param {string} target_space end of the conversion path
 */

ColorSpaceStore.mapConversionPath = function mapConversionPath (current_space, target_space) {
  // Is there a path?
  var parents = this.findConversionPath(current_space, target_space)
  // if not return null
  if (!parents) return null;

  var next_space = parents[target_space]
  var space = parents[next_space]

  var steps_taken = 0

  // step backwards through the parent array and leave "next step" instructions along the way
  while (steps_taken < 100) {
    if (!this.spaces[space].to[target_space] || typeof this.spaces[space].to[target_space] !== 'function') {
      this.spaces[space].to[target_space] = next_space
    }

    // if we're finished mapping, go ahead and tell us how to start the conversion
    if (space === current_space) return next_space;
    else if (!parents[space]) return null;

    // take a step backwards
    next_space = space
    space = parents[space]
    steps_taken++
  }

  throw new Error('something went wrong while mapping the path from' + current_space + ' to ' + target_space)
}

/**
 * Creates a Color Space
 *
 * If there are any included conversions for a Color Space that
 * do not already exist, it will store them in an Abstract Space.
 *
 * @param {object} color_space
 */

ColorSpaceStore.defineColorSpace = function (color_space) {
  var mine = color_space.name

  // make sure the name doesn't exist yet
  this.validateName(mine)
  // if space already exists as an abstract space
  if (this.isAbstractSpace(mine))
    this.makeConcrete(mine)
  else
    this.createSpace(mine)

  for (var theirs in color_space.to) {
    var conversion = color_space.to[theirs]
    if (this.isColorSpace(theirs))
      this.defineConversion(mine, theirs, conversion)
    else
      this.defineAbstractConversion(theirs, mine, 'from', conversion)
  }
  for (var theirs in color_space.from) {
    var conversion = color_space.from[theirs]
    if (this.isColorSpace(theirs))
      this.defineConversion(theirs, mine, conversion)
    else
      this.defineAbstractConversion(theirs, mine, 'to', conversion)
  }
}

/**
 * Stores a Conversion between two spaces
 * Expects both spaces to already be included
 *
 * @param {string} mine
 * @param {string} theirs
 * @param {object} conversion
 */

ColorSpaceStore.defineConversion = function (mine, theirs, conversion) {
  this.spaces[mine].to[theirs] = conversion
}

/**
 * Stores a Conversion that we know about, but are not yet using
 * Creates an Abstract Space for the conversion, if one does not already exist
 *
 * @param {string} mine
 * @param {string} theirs
 * @param {string} direction
 * @param {function} conversion
 */

ColorSpaceStore.defineAbstractConversion = function (mine, theirs, direction, conversion) {
  var abstract_spaces = this.abstract_spaces
  if (!abstract_spaces[mine]) this.createAbstractSpace(mine);

  abstract_spaces[mine][direction][theirs] = conversion
}

/**
 * Validates to make sure that we are not overriding any existing methods
 *
 * @param {string} name
 */

ColorSpaceStore.validateName = function (name) {
  if (this[name]) {
    if (!this.spaces[name]) throw new Error('Invalid Name:', name, 'is already the name of one of alchemist\'s private functions and can not be used as a the name of an color space')
      else throw new Error('"' + name + '" Already Exists: there is a space with the same name already in use')
  }
}

/**
 * creates the initial Color Space object
 *
 * @param {string} color_space the name of the color space
 */

ColorSpaceStore.createSpace = function (color_space) {
  this.spaces[color_space] = { to: {} }
}

/**
 * Does this Color Space exist yet?
 *
 * @param {string} color_space the name of the color space
 * @returns {Boolean}
 */

ColorSpaceStore.isColorSpace = function (color_space) {
  return Boolean(this.spaces[color_space])
}

/**
 * Creates the initial Abstract Space object
 *
 * @param {string} abstract_space the name of the abstract space
 */

ColorSpaceStore.createAbstractSpace = function (abstract_space) {
  this.abstract_spaces[abstract_space] = { to: {}, from: {} }
}

/**
 * Is this currently defined as an Abstract Space?
 *
 * @param {string} color_space the name of the color space
 * @returns {Boolean}
 */

ColorSpaceStore.isAbstractSpace = function (color_space) {
  return Boolean(this.abstract_spaces[color_space])
}

/**
 * Turn an Abstract Space into a normal Color Space
 *
 * @param {string} abstract_space
 */

ColorSpaceStore.makeConcrete = function (abstract_space) {
  var space_obj = this.abstract_spaces[abstract_space]
  delete this.abstract_spaces[abstract_space]
  space_obj.name = abstract_space
  this.defineColorSpace(space_obj)
}

/**
 * If the given color space exists already, it will return that colorspace,
 * else it will return null
 *
 * @param {string} color_space
 * @returns {object}
 */

ColorSpaceStore.findColorSpace = function (color_space) {
  return this.spaces[color_space] || null
}


module.exports = ColorSpaceStore
