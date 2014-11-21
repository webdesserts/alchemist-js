//
//          Alchemist.js
// ------------------------------
// the Color Manipulation Library
//
// Author: Michael Mullins

(function (root, factory) {
  if (typeof define === 'function' && define.amd) {
    define(factory);
  } else if (typeof exports === 'object') {
    module.exports = factory(require, exports, module);
  } else {
    root.Alchemist = factory();
  }
}(this, function (require, exports, module) {
  /**===========
   * Alchemist *
   ===========**/

  var Alchemist = {}

  Alchemist.use = function (plugin) {
    if (plugin.to || plugin.from) this.defineColorSpace(plugin);
    else if (plugin.modifies) this.defineTransform(plugin);
    else throw new Error('unrecognized plugin format');
  }

  Alchemist.create = function (options) {
    var alchemize = new Alchemizer(options)
    alchemize.spaces = clone(this.spaces)
    alchemize.abstract_spaces = clone(this.abstract_spaces)
    for (space_name in alchemize.spaces) {
      alchemize.makeColorMethod(space_name)
    }
    return alchemize
  }

  Alchemist.Color = function (color_space, value, options) {
    options = options || {}
    this.color_space = color_space
    this.value = value
    this.white = options.white
  }

  Alchemist.removeAll = function () {
    this.spaces = {}
    this.abstract_spaces = {}
  }

  /**============
   * Alchemizer *
   ============**/

  var Alchemizer = function (options) {
    options = options || {}
    this.spaces = {}
    this.abstract_spaces = {}
    this.white = options.white || { X: 0.95047, Y: 1, Z: 1.08883 }
    this.precision = options.precision || 4
  }

  Alchemizer.prototype.use = function (plugin) {
    Alchemist.use.call(this, plugin)
    this.makeColorMethod(plugin.name)
  }

  Alchemizer.prototype.makeColorMethod = function (color_space) {
    this[color_space] = function (value) {
      if (arguments.length > 1) {
        var value = Array.prototype.slice(arguments)
      }
      var color = new this.Color(color_space, value, { white: this.white })
      for (var dest_name in this.spaces) {
        this.makeConversionMethod(color, dest_name)
      }
      return color
    }
  }

  Alchemizer.prototype.makeConversionMethod = function (color, dest_name) {
    var that = this
    color[dest_name] = function () {
      return that.round(that.convert(color, dest_name).value)
    }
  }

  Alchemizer.prototype.Color = function (color_space, value, options) {
    Alchemist.Color.call(this, color_space, value, options)
  }

  /**
   * Converts a color from one color-space to another
   * @param {Color} color
   * @param {string} dest
   */

  Alchemizer.prototype.convert = function (color, dest) {
    var converter, value, next_color, next_space;
    var current_space = this.findColorSpace(color.color_space)
    var dest_space = this.findColorSpace(dest)

    if (!current_space) throw new Error('Internal Error: could not find the ' + current + ' color space');
    if (!dest_space) throw new Error('Internal Error: could not find the ' + dest + ' color space');

    converter = current_space.to[dest]
    // Test to see if the current space knows how to convert to dest
    if (typeof converter === 'function') {
      if (Array.isArray(color.value)) {
        value = converter.apply(this, color.value.concat(color));
      } else {
        value = converter(color.value, color)
      }
      value = this.round(value)
      color.color_space = dest
      color.value = value
      return color
      // if the converter is a another color space
    } else if (typeof converter === 'string') {
      // that should mean that color space knows how to convert, so convert to that one
      // and try from there
      next_color = this.convert(color, converter)
      return this.convert(next_color, dest)
    } else {
      // attempt to find path
      next_space = this.mapConversionPath(color.color_space, dest)
      // if we find the path begin stepping down it
      if (next_space) return this.convert(color, dest);
      // else throw an error
      else throw new Error('Alchemist does not know how to convert from ' + color.color_space + ' to ' + dest)
    }
  }

  Alchemizer.prototype.round = function (value) {
    if (Array.isArray(value)) {
      for (var i = 0; i < value.length; i++) {
        value[i] = this.roundIfNumber(value[i])
      }
    } else {
      value = this.roundIfNumber(value)
    }
    return value
  }

  Alchemizer.prototype.roundIfNumber = function (value) {
    if (typeof value === 'number') {
      value = Number(value.toFixed(this.precision))
    }
    return value
  }

  /**===================
   * Color Space Store *
   ===================**/

  var ColorSpaceStore = {}

  ColorSpaceStore.spaces = {}
  ColorSpaceStore.abstract_spaces = {}

  ColorSpaceStore.findConversionPath = function Search (from, to) {
    var Q = []
    var explored = []
    var parent = {}
    Q.push(from)
    explored.push(from)

    while (Q.length) {
      var space = Q.pop()
      if (space === to) { return parent }
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

  ColorSpaceStore.mapConversionPath = function findPath (current_space, target_space) {
    // this function is super fucking confusing because we are working backwards
    // and because I am horrible at writing code so gl;hf
    var parents = this.findConversionPath(current_space, target_space)
    if (!parents) return null
    var next_space = parents[target_space]
    var space = parents[next_space]

    while (true) {
      if (!this.spaces[space].to[target_space] || typeof this.spaces[space].to[target_space] !== 'function') {
        this.spaces[space].to[target_space] = next_space
      }

      if (space === current_space) return next_space;
      else if (!parents[space]) return null;

      // take a step backwards
      next_space = space
      space = parents[space]
    }
  }

  /**
   * Creates a Color Space
   *
   * If there are any included conversions for a Color Space that
   * does not exist yet, it will store them in an Abstract Space.
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
   * @param {string} color_space
   */

  ColorSpaceStore.createSpace = function (color_space) {
    this.spaces[color_space] = { to: {} }
  }

  /**
   * Does this Color Space exist yet?
   * @param {string} color_space
   */

  ColorSpaceStore.isColorSpace = function (color_space) {
    return Boolean(this.spaces[color_space])
  }

  /**
   * creates the initial Abstract Space object
   * @param {string} abstract_space
   */

  ColorSpaceStore.createAbstractSpace = function (abstract_space) {
    this.abstract_spaces[abstract_space] = { to: {}, from: {} }
  }

  /**
   * Is this currently defined as an Abstract Space?
   * @param {string} color_space
   * @returns {Boolean}
   */

  ColorSpaceStore.isAbstractSpace = function (color_space) {
    return Boolean(this.abstract_spaces[color_space])
  }

  /**
   * Turn an Abstract Space into a normal Color Space
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
   * @param {string} color_space
   * @returns {object}
   */

  ColorSpaceStore.findColorSpace = function (color_space) {
    return this.spaces[color_space] || null
  }

  /**================
   * Modifier Store *
   ================**/

  var ModifierStore = {}

  ModifierStore.defineModifier = function (modifier) {
    throw new Error('Modifiers are not yet implemented')
  }

  /**======================================
   * Now let's throw everything together! *
   ======================================**/

  // Mix all the things!
  // (thanks addyosamani)
  var mixin = function (receiving_obj, giving_obj) {
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
    }
    return receiving_obj
  }

  /**
   * copy the original object's properties onto a new object and returns it
   * @param {object} original
   */
  var clone = function (original) {
    return mixin({}, original)
  }

  mixin(Alchemist, ColorSpaceStore)
  mixin(Alchemist, ModifierStore)
  mixin(Alchemizer.prototype, ColorSpaceStore)
  mixin(Alchemizer.prototype, ModifierStore)

  alchemist = Object.create(Alchemist)

  /**=====================
   * Common Color Spaces *
   =====================**/

  // XYZ
  // ---
  var xyz = function xyz () {
    return {
      name: 'xyz',
      to: {}
    }
  }

  // CIELab
  // ------
  var lab = function lab () {
    var kE = 216 / 24389 // 0.08856
    var kK = 24389 / 27 // 903.3
    var kKE = 8

    return {
      name: 'lab',
      to: {
        'xyz': function (L, a, b, color) {
          var rW = color.white

          var fy = (L + 16.0) / 116.0;
          var fx = 0.002 * a + fy;
          var fz = fy - 0.005 * b;

          var fx3 = fx * fx * fx;
          var fz3 = fz * fz * fz;

          var xr = (fx3 > kE) ? fx3 : ((116.0 * fx - 16.0) / kK);
          var yr = (L > kKE) ? Math.pow((L + 16.0) / 116.0, 3.0) : (L / kK);
          var zr = (fz3 > kE) ? fz3 : ((116.0 * fz - 16.0) / kK);

          var X = xr * rW.X;
          var Y = yr * rW.Y;
          var Z = zr * rW.Z;

          return [X, Y, Z]
        }
      },
      from: {
        'xyz': function (X, Y, Z, color) {
          var rW = color.white
          var f = function f (x) {
            return (x > kE) ? Math.pow(x, 1 / 3) : ((kK * x + 16) / 116)
          }

          // Values adjusted to reference white and ran through adjustment curve
          var fx = f(X / rW.X)
          var fy = f(Y / rW.Y)
          var fz = f(Z / rW.Z)

          var L = 116 * fy - 16
          var a = 500 * (fx - fy)
          var b = 200 * (fy - fz)

          return [L, a, b]
        }
      }
    }
  }

  // RGB
  // ---
  var rgb = function rgb () {
    var inverseCompand = function inverseCompand (companded) {
      return (companded <= 0.04045) ? (companded / 12.92) : Math.pow((companded + 0.055) / 1.055, 2.4)
    }
    var compand = function compand (linear) {
      return (linear <= 0.0031308) ? (linear * 12.92) : (1.055 * Math.pow(linear, 1.0 / 2.4) - 0.055)
    }

    return {
      name: 'rgb',
      to: { 'xyz': function (R, G, B) {
        var r = inverseCompand(R / 255)
        var g = inverseCompand(G / 255)
        var b = inverseCompand(B / 255)
        var X = r * 0.4124564 + g * 0.3575761 + b * 0.1804375
        var Y = r * 0.2126729 + g * 0.7151522 + b * 0.0721750
        var Z = r * 0.0193339 + g * 0.1191920 + b * 0.9503041
        return [X, Y, Z]
      } },
      from: { 'xyz': function (X, Y, Z) {
        var R = compand(X *  3.2404542 + Y * -1.5371385 + Z * -0.4985314) * 255
        var G = compand(X * -0.9692660 + Y *  1.8760108 + Z * 0.0415560) * 255
        var B = compand(X *  0.0556434 + Y * -0.2040259 + Z * 1.0572252) * 255
        return [R, G, B]
      } }
    }
  }

  // HSL
  // ---
  var hsl = function hsl () {
    var hue2rgb = function hue2rgb (m1, m2, h) {
      if (h < 0) h += 1;
      else if (h > 1) h -= 1;
      if (h * 6 < 1) return m1 + (m2 - m1) * h * 6;
      if (h * 2 < 1) return m2;
      if (h * 3 < 2) return m2 + (m2 - m1) * (2 / 3 - h) * 6;
      return m1
    }

    return {
      name: 'hsl',
      to: { 'rgb': function hsl2rgb (h, s, l) {
        h /= 360
        var m2 = l <= 0.5 ? l * (s + 1) : l + s - l * s
        var m1 = l * 2 - m2
        r = hue2rgb(m1, m2, h + 1 / 3) * 255
        g = hue2rgb(m1, m2, h) * 255
        b = hue2rgb(m1, m2, h - 1 / 3) * 255
        return [r, g, b]
      } },
      from: { 'rgb': function rgb2hsl (r, g, b) {
        var min, max, d, h, s, l;
        min = Math.min(r /= 255, g /= 255, b /= 255)
        max = Math.max(r, g, b)
        d = max - min
        l = (max + min) / 2

        if (d) {
          s = l < .5 ? d / (max + min) : d / (2 - max - min);
          if (r == max) h = (g - b) / d + (g < b ? 6 : 0);
          else if (g == max) h = (b - r) / d + 2;
          else h = (r - g) / d + 4;
          h *= 60;
        } else {
          // d3 what does this doooooooooo?
          h = NaN;
          s = l > 0 && l < 1 ? 0 : h;
        }
        return [h, s, l]
      } }
    }
  }

  alchemist.use(xyz())
  alchemist.use(lab())
  alchemist.use(rgb())
  alchemist.use(hsl())

  return alchemist
}));
