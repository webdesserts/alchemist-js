module.exports =
/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__(1);


/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }
	
	var _alchemistCommon = __webpack_require__(2);
	
	var _alchemistCommon2 = _interopRequireDefault(_alchemistCommon);
	
	var _libIndex = __webpack_require__(3);
	
	var _libIndex2 = _interopRequireDefault(_libIndex);
	
	_libIndex2['default'].use(_alchemistCommon2['default']);
	
	var common = function common() {
	  return _alchemistCommon2['default'];
	};
	
	_libIndex2['default'].common = common;
	
	module.exports = _libIndex2['default'];

/***/ },
/* 2 */
/***/ function(module, exports) {

	module.exports = require("alchemist-common");

/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, '__esModule', {
	  value: true
	});
	
	function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj['default'] = obj; return newObj; } }
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }
	
	var _plugins = __webpack_require__(4);
	
	var _plugins2 = _interopRequireDefault(_plugins);
	
	var _color = __webpack_require__(10);
	
	var _color2 = _interopRequireDefault(_color);
	
	var _converter = __webpack_require__(11);
	
	var _converter2 = _interopRequireDefault(_converter);
	
	var _colorSpaceStore = __webpack_require__(5);
	
	var _colorSpaceStore2 = _interopRequireDefault(_colorSpaceStore);
	
	var _Limiter = __webpack_require__(12);
	
	var _Limiter2 = _interopRequireDefault(_Limiter);
	
	var _helpers = __webpack_require__(7);
	
	var helpers = _interopRequireWildcard(_helpers);
	
	var _stateless = __webpack_require__(8);
	
	var _stateless2 = _interopRequireDefault(_stateless);
	
	/**
	 * Alchemist. This is the object that will eventually be exported.
	 * It can be used both as is, and as a constructor with .create()
	 */
	
	var Alchemist = _stateless2['default'].extend();
	
	/**
	 * Initialize all state on Alchemist. Is called on create()
	 */
	
	Alchemist.init = function init(options) {
	  var color_spaces = _colorSpaceStore2['default'].create();
	  options = options || {};
	  this.white = options.white || { X: 0.95047, Y: 1, Z: 1.08883 };
	  this.spaces = color_spaces;
	  this.BaseSpace = _color2['default'].create({
	    converter: _converter2['default'].create(color_spaces),
	    precision: options.precision || 9,
	    limiter: _Limiter2['default'].create(null, null, options.limits || 'nullify')
	  });
	};
	
	/**
	 * Interprets the type of plugin it is and calls the associated plugin installer
	 * if the passed object is an array, it will try to interpret each item in that
	 * array as a plugin, essentially allowing you to create plugin bundles.
	 */
	
	Alchemist.use = function use(plugin) {
	  if (helpers.isArray(plugin)) {
	    for (var i = 0; i < plugin.length; i++) {
	      this.use(plugin[i]);
	    }
	  } else {
	    if (typeof plugin === 'function') plugin = plugin.call(this, this);
	    switch (_plugins2['default'].identify(plugin)) {
	      case 'space':
	        this.attachColorSpace(plugin);break;
	      case 'method':
	        this.attachColorMethod(plugin);break;
	    }
	  }
	};
	
	/**
	 * Stores a valid colorspace <plugin> and creates it's methods
	 */
	
	Alchemist.attachColorSpace = function attachColorSpace(plugin) {
	  var _this = this;
	
	  var existing_plugin = this.spaces.find(plugin.name);
	  if (existing_plugin && existing_plugin.is_concrete) throw new Error('The "' + plugin.name + '" plugin already exists');
	  var plugin_spaces = _plugins2['default'].serializeColorSpace(plugin, this.BaseSpace);
	  this.spaces.merge(plugin_spaces);
	  this.spaces.each(function (color_space) {
	    if (color_space.is_concrete) {
	      _this.makeConstructorMethod(color_space);
	      _this.makeConversionMethod(color_space);
	    }
	  });
	};
	
	/**
	 * Attaches the methods for a valid method <plugin>
	 */
	
	Alchemist.attachColorMethod = function (plugin) {
	  if (plugin.methods.color && this.BaseSpace[plugin.name]) throw new Error('The method name "' + plugin.name + '" already exists for colors');
	  if (plugin.methods.global && this[plugin.name]) throw new Error('The method name "' + plugin.name + '" already exists on alchemist');
	
	  if (plugin.methods.color) {
	    this.BaseSpace[plugin.name] = plugin.methods.color;
	  }
	  if (plugin.methods.global) {
	    this[plugin.name] = plugin.methods.global;
	  }
	};
	
	/**
	 * Creates a Color constructor method on Alchemist for the given <color_space>.
	 * e.g. alchemist.rgb([255, 255, 255])
	 *
	 * This function will return a new Color with the assigned values, any
	 * necessary config, and attached conversion functions.
	 */
	
	Alchemist.makeConstructorMethod = function makeConstructorMethod(color_space) {
	  this[color_space.space] = function createColor(value) {
	    var color_value;
	
	    if (arguments.length > 1) {
	      // I hear this deoptimizes things. Find a way around if necessary.
	      color_value = Array.prototype.slice.call(arguments);
	    } else {
	      color_value = value;
	    }
	
	    return color_space.create(color_value);
	  };
	};
	
	/**
	 * Creates a method on the BaseSpace that can be used to convert directly to the
	 * given <color_space>
	 */
	
	Alchemist.makeConversionMethod = function makeConversionMethod(color_space) {
	  this.BaseSpace[color_space.space] = function convertTo(options) {
	    return this.to(color_space.space, options);
	  };
	};
	
	Alchemist.init();
	
	// export Alchemist!
	exports['default'] = Alchemist;
	module.exports = exports['default'];

/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, '__esModule', {
	  value: true
	});
	
	function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj['default'] = obj; return newObj; } }
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }
	
	var _colorSpaceStore = __webpack_require__(5);
	
	var _colorSpaceStore2 = _interopRequireDefault(_colorSpaceStore);
	
	var _conversionStore = __webpack_require__(9);
	
	var _conversionStore2 = _interopRequireDefault(_conversionStore);
	
	var _helpers = __webpack_require__(7);
	
	var helpers = _interopRequireWildcard(_helpers);
	
	var plugins = {};
	
	/**
	 * Identifies the type of plugin passed. If type() can't identify the <plugin>
	 * it throws an error.
	 */
	
	plugins.identify = function identify(plugin) {
	  this.validatePlugin(plugin);
	  if (plugin.to || plugin.from) {
	    this.validateColorSpacePlugin(plugin);
	    return 'space';
	  } else if (plugin.methods) {
	    this.validateMethodPlugin(plugin);
	    return 'method';
	  } else throw new Error('Unrecognized plugin format');
	};
	
	/**
	 * Validates any generic plugin
	 */
	
	plugins.validatePlugin = function validatePlugin(plugin) {
	  if (!helpers.isObject(plugin)) throw new Error('Expected plugin to be an object; instead got: ' + plugin);
	  if (!helpers.isString(plugin.name)) throw new Error('Expect plguin.name to be a string; instead got: ' + plugin.name);
	};
	
	/**
	 * Validates a colorspace-plugin
	 */
	
	plugins.validateColorSpacePlugin = function validateColorSpacePlugin(plugin) {
	  if (!(plugin.to || plugin.from)) throw new Error('Conversions were not defined for the "' + plugin.name + '" colorspace plugin');
	};
	
	/**
	 * Validates a method-plugin
	 */
	
	plugins.validateMethodPlugin = function validateMethodPlugin(plugin) {
	  if (!(plugin.methods.color || plugin.methods.global)) throw new Error('Missing methods for method plugin');
	  if (plugin.methods.color && !helpers.isFunction(plugin.methods.color)) throw new Error('Expected color method to be a function; instead got ' + plugin.methods.color);
	  if (plugin.methods.global && !helpers.isFunction(plugin.methods.global)) throw new Error('Expected color method to be a function; instead got ' + plugin.methods.color);
	};
	
	/**
	 * Converts a colorspace plugin into a usable ColorSpaceStore that can be merged
	 * with the main store.
	 *
	 * All conversions defined in the "to" object will be added under the main
	 * colorspace. An abstract colorspace is created for each conversion in the
	 * "from" object.
	 */
	
	plugins.serializeColorSpace = function serializeColorSpace(plugin, BaseSpace) {
	  var results, color_space, abstract_space, conversion;
	
	  if (!helpers.isString(plugin.name)) throw new Error('color-space plugin is missing a name');
	
	  results = _colorSpaceStore2['default'].create();
	  color_space = BaseSpace.create({
	    space: plugin.name,
	    conversions: _conversionStore2['default'].create()
	  });
	
	  if (BaseSpace.limits && plugin.limits) {
	    color_space.limits = BaseSpace.limits.create(plugin.limits.min, plugin.limits.max);
	  }
	
	  results.add(color_space);
	
	  for (var dest_name in plugin.to) {
	    conversion = plugin.to[dest_name];
	    if (typeof conversion !== 'function') throw new Error('expected ' + conversion + ' to be a function');
	    color_space.conversions.add(dest_name, plugin.to[dest_name]);
	  }
	
	  for (var src_name in plugin.from) {
	    conversion = plugin.from[src_name];
	    if (typeof conversion !== 'function') throw new Error('expected ' + conversion + ' to be a function');
	    abstract_space = BaseSpace.create({
	      space: src_name,
	      abstract: true,
	      conversions: _conversionStore2['default'].create()
	    });
	
	    abstract_space.conversions.add(plugin.name, plugin.from[src_name]);
	    results.add(abstract_space);
	  }
	
	  return results;
	};
	
	exports['default'] = plugins;
	module.exports = exports['default'];

/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, '__esModule', {
	  value: true
	});
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }
	
	var _storage = __webpack_require__(6);
	
	var _storage2 = _interopRequireDefault(_storage);
	
	/**
	 * Stores a set of ColorSpaces
	 *
	 * A "ColorSpace" is a partially complete Color containing a type, a converter,
	 * and a set of conversions. The converter is preferably inherited from a
	 * BaseSpace. For more info see the description for Color.
	 */
	
	var ColorSpaceStore = _storage2['default'].extend();
	
	/**
	 * Adds a ColorSpace to the store. Throws an Error if the ColorSpace already
	 * exists.
	 */
	
	ColorSpaceStore.add = function (color_space) {
	  var proto = Object.getPrototypeOf(ColorSpaceStore);
	  proto.add.call(this, color_space.space, color_space);
	};
	
	/**
	 * Returns an array of adjacent convertable ColorSpaces.
	 *
	 * It does this by comparing the available conversions on a color space
	 * to the color spaces within the ColorSpaceStore.
	 */
	
	ColorSpaceStore.findNeighbors = function findNeighbors(space_name) {
	  var _this = this;
	
	  var neighbors = [];
	  var color_space = this.find(space_name);
	
	  if (color_space === null) {
	    return neighbors;
	  }
	
	  var conversions = color_space.conversions;
	
	  conversions.each(function (conversion, target_name) {
	    if (typeof conversion !== 'string') {
	      var target_space = _this.find(target_name);
	      if (target_space && target_space.is_concrete) {
	        neighbors.push(target_name);
	      }
	    }
	  });
	
	  return neighbors;
	};
	
	/**
	 * Merges two Stores.
	 *
	 * Loops over the <foreign_store> comparing its values with the local store. If
	 * the <foreign_store> has any keys that the local does not, it adds them. If
	 * both stores have the same key, it calls merge() on the value of the local key
	 */
	
	ColorSpaceStore.merge = function merge(foreign_store) {
	  var _this2 = this;
	
	  foreign_store.each(function (foreign_space, name) {
	    var local_space = _this2.find(name);
	    if (local_space) _this2.mergeSpaces(local_space, foreign_space);else _this2.store[name] = foreign_space;
	  });
	};
	
	/**
	 * Merges two ColorSpaces
	 *
	 * If the <foreign_space> is supplied as the main color space of a plugin, it's
	 * conversions will always be prefered. Otherwise we stay safe and keep the
	 * current conversions
	 *
	 * If either of the passed spaces are concrete (resulting from the "to" object
	 * of a plugin), the resulting space will always be concrete as well.
	 */
	
	ColorSpaceStore.mergeSpaces = function (local_space, foreign_space) {
	  // conversions defined by a colorspace's plugin are prefered over conversions
	  // defined by the other colorspaces
	  var curing = !local_space.is_concrete && foreign_space.is_concrete;
	
	  if (curing && foreign_space.limits) {
	    local_space.limits.merge(foreign_space.limits);
	  }
	
	  local_space.conversions.merge(foreign_space.conversions, { force: curing });
	
	  // when the conversion is over, if the space was abstract make it concrete
	  if (curing) local_space.is_concrete = true;
	};
	
	exports['default'] = ColorSpaceStore;
	module.exports = exports['default'];

/***/ },
/* 6 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, '__esModule', {
	  value: true
	});
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }
	
	function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj['default'] = obj; return newObj; } }
	
	var _helpers = __webpack_require__(7);
	
	var helpers = _interopRequireWildcard(_helpers);
	
	var _stateless = __webpack_require__(8);
	
	var _stateless2 = _interopRequireDefault(_stateless);
	
	var Storage = _stateless2['default'].extend();
	
	/**
	 * Initializes Storage's state. Is called on create()
	 */
	
	Storage.init = function init() {
	  this.store = {};
	};
	
	/**
	 * Adds <key>/<value> to the store. <key> should be a unique identifier. If key
	 * is already present in the store, add will throw an error. This is to prevent
	 * accidental overwrites. In most cases we'll want to use merge() instead anyway
	 */
	
	Storage.add = function add(key, value) {
	  if (this.store[key]) throw new Error('the key "' + key + '" already exists in this store');
	  this.store[key] = value;
	};
	
	/**
	 * Returns the value associated with <key> if it exists, otherwise, return null
	 */
	
	Storage.find = function find(key) {
	  return this.store[key] || null;
	};
	
	/**
	 * Returns true if the key already exists, otherwise, it returns false
	 */
	
	Storage.has = function has(key) {
	  return Boolean(this.find(key));
	};
	
	/**
	 * Removes <key> and it's associated value from the store
	 */
	
	Storage.remove = function remove(key) {
	  delete this.store[key];
	};
	
	/**
	 * iterates over the store, calling <func> on each iteration
	 * if the function returns anything, the iteration is halted and the result is returned
	 */
	
	Storage.each = function each(func, context) {
	  return helpers.each.call(this, this.store, func, context);
	};
	
	/**
	 * loops over the <foreign_store> comparing its values with the local store. If
	 * the <foreign_store> has any keys that the local does not, it adds them. If
	 * both stores have the same key, it calls merge() on the value of the local key
	 */
	
	Storage.merge = function merge(foreign_store) {
	  foreign_store.each(function (value, key) {
	    var local = this.find(key);
	    if (local) local.merge(value);else this.store[key] = value;
	  }, this);
	};
	
	exports['default'] = Storage;
	module.exports = exports['default'];

/***/ },
/* 7 */
/***/ function(module, exports) {

	/**
	 * If <target> is a String or Number create a new object with those values.
	 * If <target> is an Array, recursively call this function on all of it's contents
	 */
	
	'use strict';
	
	Object.defineProperty(exports, '__esModule', {
	  value: true
	});
	exports.clone = clone;
	exports.isArray = isArray;
	exports.isObject = isObject;
	exports.isFunction = isFunction;
	exports.isPlainObject = isPlainObject;
	exports.isString = isString;
	exports.each = each;
	exports.round = round;
	exports.roundIfNumber = roundIfNumber;
	
	function clone(target) {
	  var cloned;
	
	  var obj = Object(target);
	
	  switch (obj.constructor) {
	    case String:
	      cloned = obj.toString();
	      break;
	    case Number:
	      cloned = Number(obj);
	      break;
	    case Array:
	      cloned = [];
	      each(obj, function (item, i) {
	        cloned[i] = clone(item);
	      });
	      break;
	    default:
	      throw new TypeError('Alchemist does not know how to clone ' + target);
	  }
	  return cloned;
	}
	
	/**
	 * I don't think Array.isArray is well supported. Use this function instead for
	 * now so that if we need to add a fallback it won't take as much effort.
	 */
	
	function isArray(object) {
	  return Array.isArray(object);
	}
	
	function isObject(object) {
	  return Boolean(object && typeof object === 'object');
	}
	
	function isFunction(func) {
	  return typeof func === 'function';
	}
	
	/**
	 * Tests to see if an object is a Plain Object produced from an object literal.
	 * This is good for testing things like function options.
	 */
	
	function isPlainObject(object) {
	  if (!(object && toString.call(object) === '[object Object]')) return false;
	  return Object.getPrototypeOf(object) === Object.prototype;
	}
	
	/**
	 * Tests if an object is a string literal
	 */
	
	function isString(object) {
	  return typeof object === 'string';
	}
	
	/**
	 * takes an array or object, iterates over it, and calls <func> on each iteration
	 * if the function returns anything, the iteration is halted and the result is returned
	 */
	
	function each(collection, func, context) {
	  var result;
	  context = context || null;
	  if (isArray(collection)) {
	    var length = collection.length;
	    for (var i = 0; i < length; i++) {
	      result = func.call(context, collection[i], i);
	      if (result !== undefined) return result;
	    }
	  } else {
	    for (var key in collection) {
	      result = func.call(context, collection[key], key);
	      if (result !== undefined) return result;
	    }
	  }
	  return null;
	}
	
	/**
	 * If <value> is a number, it will round it. If <value> is an
	 * Array it will try to round it's contents. If <precision> is present, it will
	 * round to that decimal value. The default <precision> is 4.
	 */
	
	function round(value, precision) {
	  precision = precision || 4;
	  if (isArray(value)) {
	    for (var i = 0; i < value.length; i++) {
	      value[i] = this.roundIfNumber(value[i], precision);
	    }
	  } else {
	    value = roundIfNumber(value, precision);
	  }
	  return value;
	}
	
	/**
	 * If <value> is a number, we round it to whatever the current <precision> setting
	 * is at.
	 */
	
	function roundIfNumber(value, precision) {
	  if (typeof value === 'number') {
	    value = Number(value.toPrecision(precision));
	  }
	  return value;
	}

/***/ },
/* 8 */
/***/ function(module, exports) {

	module.exports = require("stateless");

/***/ },
/* 9 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, '__esModule', {
	  value: true
	});
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }
	
	var _storage = __webpack_require__(6);
	
	var _storage2 = _interopRequireDefault(_storage);
	
	var ConversionStore = _storage2['default'].extend();
	
	/**
	 * Loops over the <foreign_store> comparing its conversions with the local
	 * store's. If the <foreign_store> has any conversions that the local does not,
	 * it adds them. If both stores have the same conversion, it uses the current
	 * conversion. If <options.force> is truthy the merge will always overwrite the
	 * current conversion.
	 */
	
	ConversionStore.merge = function merge(foreign_store, options) {
	  options = options || {};
	  foreign_store.each(function (value, key) {
	    var local = this.find(key);
	    if (options.force || !local || typeof local === 'string') {
	      this.store[key] = value;
	    }
	  }, this);
	};
	
	exports['default'] = ConversionStore;
	module.exports = exports['default'];

/***/ },
/* 10 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, '__esModule', {
	  value: true
	});
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }
	
	function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj['default'] = obj; return newObj; } }
	
	var _helpers = __webpack_require__(7);
	
	var _ = _interopRequireWildcard(_helpers);
	
	var _stateless = __webpack_require__(8);
	
	var _stateless2 = _interopRequireDefault(_stateless);
	
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
	
	var Color = _stateless2['default'].extend();
	
	/**
	 * Initializes Color's state. Is called on create()
	 */
	
	Color.init = function init(value, options) {
	  if (_.isPlainObject(arguments[0])) {
	    options = arguments[0];
	  } else if (value !== undefined) {
	    if (this.limits) this.value = this.limits.check(value);else this.value = value;
	  }
	
	  options = options || {};
	
	  // BaseSpace
	  if (options.limiter) this.limits = options.limiter;
	  if (options.precision) this.precision = options.precision;
	  if (options.converter) this.converter = options.converter;
	
	  // ColorSpace
	  if (options.conversions) this.conversions = options.conversions;
	  if (options.space) this.space = options.space;
	
	  this.is_concrete = !options.abstract;
	};
	
	/**
	 * Converts a color and returns its values
	 */
	
	Color.to = function to(target_name, options) {
	  options = options || {};
	  var color = this.as(target_name);
	  if (options.precision === null) return color.val;else return color.round(options.precision);
	};
	
	/**
	 * Converts a color and returns the new color
	 */
	
	Color.as = function as(target_name) {
	  return this.converter.convert(this, target_name);
	};
	
	/**
	 * Rounds the value to the given precision.
	 * If a precision isn't provided, it uses the default
	 */
	
	Color.round = function round(precision) {
	  return _.round(this.value, precision || this.precision);
	};
	
	exports['default'] = Color;
	module.exports = exports['default'];

/***/ },
/* 11 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, '__esModule', {
	  value: true
	});
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }
	
	function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj['default'] = obj; return newObj; } }
	
	var _helpers = __webpack_require__(7);
	
	var helpers = _interopRequireWildcard(_helpers);
	
	var _stateless = __webpack_require__(8);
	
	var _stateless2 = _interopRequireDefault(_stateless);
	
	var Converter = _stateless2['default'].extend();
	
	/**
	 * Initializes Converter's state. Is called on create()
	 */
	
	Converter.init = function init(color_spaces) {
	  this.spaces = color_spaces;
	};
	
	/**
	 * Converts <color> to a target color space
	 */
	
	Converter.convert = function convert(color, target_name) {
	  var current_name = color.space;
	  if (current_name === target_name) return color;
	
	  if (!this.spaces.has(current_name)) throw new Error('could not find the ' + current_name + ' color space');
	  if (!this.spaces.has(target_name)) throw new Error('could not find the ' + target_name + ' color space');
	
	  var conversion = color.conversions.find(target_name);
	  // Test to see if the current space knows how to convert to target
	
	  if (typeof conversion === 'function') {
	    return this.applyConversion(color, target_name);
	    // if the conversion is a another color space
	  } else if (typeof conversion === 'string') {
	      var next_color = this.applyConversion(color, conversion);
	      return this.convert(next_color, target_name);
	    } else {
	      // attempt to find path
	      var next_space = this.mapConversionPath(current_name, target_name);
	
	      // if we find the path begin stepping down it
	      if (next_space) return this.convert(color, target_name);
	
	      // else throw an error
	      else throw new Error('Alchemist does not know how to convert from ' + current_name + ' to ' + target_name);
	    }
	};
	
	/**
	 * Finds the target color space under the <color>'s conversions, applies
	 * that conversion, and returns a new color.
	 */
	
	Converter.applyConversion = function applyConversion(color, target_name) {
	  var value, new_color;
	  var conversion = color.conversions.find(target_name);
	  if (typeof conversion !== 'function') throw new TypeError('expected ' + conversion + ' to be a function but instead was a ' + typeof conversion);
	
	  if (color.value === null) {
	    value = color.value;
	  } else if (helpers.isArray(color.value)) {
	    value = conversion.apply(color, helpers.clone(color.value));
	  } else {
	    value = conversion.call(color, helpers.clone(color.value));
	  }
	
	  new_color = this.spaces.find(target_name).create(value);
	
	  return new_color;
	};
	
	/**
	 * Leaves a trail of "conversion pointers" that convert() can follow from one
	 * color space to a target color space
	 *
	 * A "pointer" is just a string that tells convert() what color space to convert
	 * to next to get one step closer to the target space
	 */
	
	Converter.mapConversionPath = function mapConversionPath(current_name, target_name) {
	  var conversion;
	  // Is there a path?
	  var parents = this.findConversionPath(current_name, target_name);
	  // if not return null
	  if (!parents) return null;
	
	  var next_space = parents[target_name];
	  var space = parents[next_space];
	
	  var steps_taken = 0;
	
	  // step backwards through the parent array and leave "next step" instructions along the way
	  while (steps_taken < 100) {
	    conversion = this.spaces.find(space).conversions.find(target_name);
	
	    if (!conversion) {
	      this.spaces.find(space).conversions.add(target_name, next_space);
	    }
	
	    // if we're finished mapping, go ahead and tell us how to start the conversion
	    if (space === current_name) return next_space;else if (!parents[space]) return null;
	
	    // take a step backwards
	    next_space = space;
	    space = parents[space];
	    steps_taken++;
	  }
	
	  throw new Error('something went wrong while mapping the path from' + current_name + ' to ' + target_name);
	};
	
	/**
	 * Searches all conversions to find the quickest path between two color spaces.
	 * Returns an array of parent:child relationships that can be walked backwards
	 * to get the path
	 */
	
	Converter.findConversionPath = function findConversionPath(current_name, target_name) {
	  var Q = [];
	  var explored = [];
	  var parent = {};
	  Q.push(current_name);
	  explored.push(current_name);
	
	  while (Q.length) {
	    var space = Q.pop();
	    if (space === target_name) {
	      return parent;
	    }
	    var neighbors = this.spaces.findNeighbors(space);
	
	    // for each neighbor
	    for (var i = 0; i < neighbors.length; i++) {
	      var neighbor = neighbors[i];
	
	      // if this neighbor hasn't been explored yet
	      if (explored.indexOf(neighbor) === -1) {
	        parent[neighbor] = space;
	        explored.push(neighbor);
	        Q.push(neighbor);
	      }
	    }
	  }
	
	  return null;
	};
	
	exports['default'] = Converter;
	module.exports = exports['default'];

/***/ },
/* 12 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, '__esModule', {
	  value: true
	});
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }
	
	function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj['default'] = obj; return newObj; } }
	
	var _helpers = __webpack_require__(7);
	
	var _ = _interopRequireWildcard(_helpers);
	
	var _stateless = __webpack_require__(8);
	
	var _stateless2 = _interopRequireDefault(_stateless);
	
	var Limiter = _stateless2['default'].extend();
	
	Limiter.init = function init(min, max, handler) {
	  if (min) this.min = min;
	  if (max) this.max = max;
	  if (handler) this.handler = handler;
	};
	
	/**
	 * Check whether a value set breaks the provided limits
	 */
	
	Limiter.check = function check(values) {
	  values = this.checkBoundary('min', values);
	  values = this.checkBoundary('max', values);
	  return values;
	};
	
	/**
	 * Checks one side of the provided limits (either 'max' or 'min') and returns the
	 * resulting values (or throws an error in the case of 'strict')
	 */
	
	Limiter.checkBoundary = function (boundary, values) {
	  var limits = this[boundary];
	  if (!values || !limits || this.handler === 'raw') return values;
	
	  _.each(limits, function (limit, i) {
	    if (this.breaks(limit, values[i], boundary)) {
	      if (this.handler === 'clip') {
	        values[i] = limit;
	      } else if (this.handler === 'nullify') {
	        values = null;
	        return values;
	      } else if (this.handler === 'strict') {
	        var gt_or_lt = this.handler === 'max' ? 'less' : 'greater';
	        throw new Error('Expected ' + values[i] + ' to be ' + gt_or_lt + ' than or equal to ' + limit);
	      }
	    }
	  }, this);
	  return values;
	};
	
	/**
	 * Returns true if <value> breaks a given <limit>
	 */
	
	Limiter.breaks = function breaksLimit(limit, value, boundary) {
	  if (boundary === 'max') {
	    return value > limit;
	  } else if (boundary === 'min') {
	    return value < limit;
	  }
	};
	
	/**
	 * Merges two Limiters. Always prefers teh min/max definitions of the foreign store
	 */
	
	Limiter.merge = function merge(foreign_limiter) {
	  if (foreign_limiter.min !== undefined) this.min = foreign_limiter.min;
	  if (foreign_limiter.max !== undefined) this.max = foreign_limiter.max;
	};
	
	exports['default'] = Limiter;
	module.exports = exports['default'];

/***/ }
/******/ ]);
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAgZjc4NDQ4MjQyYzRmZTdkYzhmYjUiLCJ3ZWJwYWNrOi8vLy4vYWxjaGVtaXN0LmpzIiwid2VicGFjazovLy9leHRlcm5hbCBcImFsY2hlbWlzdC1jb21tb25cIiIsIndlYnBhY2s6Ly8vLi9saWIvaW5kZXguanMiLCJ3ZWJwYWNrOi8vLy4vbGliL3BsdWdpbnMuanMiLCJ3ZWJwYWNrOi8vLy4vbGliL2NvbG9yU3BhY2VTdG9yZS5qcyIsIndlYnBhY2s6Ly8vLi9saWIvc3RvcmFnZS5qcyIsIndlYnBhY2s6Ly8vLi9saWIvaGVscGVycy5qcyIsIndlYnBhY2s6Ly8vZXh0ZXJuYWwgXCJzdGF0ZWxlc3NcIiIsIndlYnBhY2s6Ly8vLi9saWIvY29udmVyc2lvblN0b3JlLmpzIiwid2VicGFjazovLy8uL2xpYi9jb2xvci5qcyIsIndlYnBhY2s6Ly8vLi9saWIvY29udmVydGVyLmpzIiwid2VicGFjazovLy8uL2xpYi9MaW1pdGVyLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsdUJBQWU7QUFDZjtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7O0FBR0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7Ozs7Ozs7Ozs7Ozs7Ozs7OzRDQ3RDNkIsQ0FBa0I7Ozs7cUNBQ3pCLENBQWE7Ozs7QUFFbkMsdUJBQVUsR0FBRyw4QkFBa0I7O0FBRS9CLEtBQUksTUFBTSxHQUFHLFNBQVMsTUFBTSxHQUFJO0FBQzlCLHVDQUF1QjtFQUN4Qjs7QUFFRCx1QkFBVSxNQUFNLEdBQUcsTUFBTTs7QUFFekIsT0FBTSxDQUFDLE9BQU8sd0JBQVksQzs7Ozs7O0FDWDFCLDhDOzs7Ozs7Ozs7Ozs7Ozs7O29DQ0FvQixDQUFXOzs7O2tDQUNiLEVBQVM7Ozs7c0NBQ0ws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QUUsSUFBSSxDQUFDLEdBQUcsR0FBRyxlQUFlLENBQUMsR0FBRztBQUNyRSxPQUFJLGVBQWUsQ0FBQyxHQUFHLEtBQUssU0FBUyxFQUFFLElBQUksQ0FBQyxHQUFHLEdBQUcsZUFBZSxDQUFDLEdBQUc7RUFDdEU7O3NCQUVjLE9BQU8iLCJmaWxlIjoiYWxjaGVtaXN0LmpzIiwic291cmNlc0NvbnRlbnQiOlsiIFx0Ly8gVGhlIG1vZHVsZSBjYWNoZVxuIFx0dmFyIGluc3RhbGxlZE1vZHVsZXMgPSB7fTtcblxuIFx0Ly8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbiBcdGZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblxuIFx0XHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcbiBcdFx0aWYoaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0pXG4gXHRcdFx0cmV0dXJuIGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdLmV4cG9ydHM7XG5cbiBcdFx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcbiBcdFx0dmFyIG1vZHVsZSA9IGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdID0ge1xuIFx0XHRcdGV4cG9ydHM6IHt9LFxuIFx0XHRcdGlkOiBtb2R1bGVJZCxcbiBcdFx0XHRsb2FkZWQ6IGZhbHNlXG4gXHRcdH07XG5cbiBcdFx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG4gXHRcdG1vZHVsZXNbbW9kdWxlSWRdLmNhbGwobW9kdWxlLmV4cG9ydHMsIG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG4gXHRcdC8vIEZsYWcgdGhlIG1vZHVsZSBhcyBsb2FkZWRcbiBcdFx0bW9kdWxlLmxvYWRlZCA9IHRydWU7XG5cbiBcdFx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcbiBcdFx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xuIFx0fVxuXG5cbiBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlcyBvYmplY3QgKF9fd2VicGFja19tb2R1bGVzX18pXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm0gPSBtb2R1bGVzO1xuXG4gXHQvLyBleHBvc2UgdGhlIG1vZHVsZSBjYWNoZVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5jID0gaW5zdGFsbGVkTW9kdWxlcztcblxuIFx0Ly8gX193ZWJwYWNrX3B1YmxpY19wYXRoX19cbiBcdF9fd2VicGFja19yZXF1aXJlX18ucCA9IFwiXCI7XG5cbiBcdC8vIExvYWQgZW50cnkgbW9kdWxlIGFuZCByZXR1cm4gZXhwb3J0c1xuIFx0cmV0dXJuIF9fd2VicGFja19yZXF1aXJlX18oMCk7XG5cblxuXG4vKiogV0VCUEFDSyBGT09URVIgKipcbiAqKiB3ZWJwYWNrL2Jvb3RzdHJhcCBmNzg0NDgyNDJjNGZlN2RjOGZiNVxuICoqLyIsImltcG9ydCBhbGNoZW1pc3RfY29tbW9uIGZyb20gJ2FsY2hlbWlzdC1jb21tb24nXG5pbXBvcnQgYWxjaGVtaXN0IGZyb20gJy4vbGliL2luZGV4J1xuXG5hbGNoZW1pc3QudXNlKGFsY2hlbWlzdF9jb21tb24pXG5cbnZhciBjb21tb24gPSBmdW5jdGlvbiBjb21tb24gKCkge1xuICByZXR1cm4gYWxjaGVtaXN0X2NvbW1vblxufVxuXG5hbGNoZW1pc3QuY29tbW9uID0gY29tbW9uXG5cbm1vZHVsZS5leHBvcnRzID0gYWxjaGVtaXN0XG5cblxuXG4vKiogV0VCUEFDSyBGT09URVIgKipcbiAqKiAuL2FsY2hlbWlzdC5qc1xuICoqLyIsIm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZShcImFsY2hlbWlzdC1jb21tb25cIik7XG5cblxuLyoqKioqKioqKioqKioqKioqXG4gKiogV0VCUEFDSyBGT09URVJcbiAqKiBleHRlcm5hbCBcImFsY2hlbWlzdC1jb21tb25cIlxuICoqIG1vZHVsZSBpZCA9IDJcbiAqKiBtb2R1bGUgY2h1bmtzID0gMFxuICoqLyIsImltcG9ydCBwbHVnaW5zIGZyb20gJy4vcGx1Z2lucydcbmltcG9ydCBDb2xvciBmcm9tICcuL2NvbG9yJ1xuaW1wb3J0IENvbnZlcnRlciBmcm9tICcuL2NvbnZlcnRlcidcbmltcG9ydCBDb2xvclNwYWNlU3RvcmUgZnJvbSAnLi9jb2xvclNwYWNlU3RvcmUnXG5pbXBvcnQgTGltaXRlciBmcm9tICcuL0xpbWl0ZXInXG5pbXBvcnQgKiBhcyBoZWxwZXJzIGZyb20gJy4vaGVscGVycydcbmltcG9ydCBTdGF0ZWxlc3MgZnJvbSAnc3RhdGVsZXNzJ1xuXG4vKipcbiAqIEFsY2hlbWlzdC4gVGhpcyBpcyB0aGUgb2JqZWN0IHRoYXQgd2lsbCBldmVudHVhbGx5IGJlIGV4cG9ydGVkLlxuICogSXQgY2FuIGJlIHVzZWQgYm90aCBhcyBpcywgYW5kIGFzIGEgY29uc3RydWN0b3Igd2l0aCAuY3JlYXRlKClcbiAqL1xuXG52YXIgQWxjaGVtaXN0ID0gU3RhdGVsZXNzLmV4dGVuZCgpXG5cbi8qKlxuICogSW5pdGlhbGl6ZSBhbGwgc3RhdGUgb24gQWxjaGVtaXN0LiBJcyBjYWxsZWQgb24gY3JlYXRlKClcbiAqL1xuXG5BbGNoZW1pc3QuaW5pdCA9IGZ1bmN0aW9uIGluaXQgKG9wdGlvbnMpIHtcbiAgdmFyIGNvbG9yX3NwYWNlcyA9IENvbG9yU3BhY2VTdG9yZS5jcmVhdGUoKVxuICBvcHRpb25zID0gb3B0aW9ucyB8fCB7fVxuICB0aGlzLndoaXRlID0gb3B0aW9ucy53aGl0ZSB8fCB7IFg6IDAuOTUwNDcsIFk6IDEsIFo6IDEuMDg4ODMgfVxuICB0aGlzLnNwYWNlcyA9IGNvbG9yX3NwYWNlc1xuICB0aGlzLkJhc2VTcGFjZSA9IENvbG9yLmNyZWF0ZSh7XG4gICAgY29udmVydGVyOiBDb252ZXJ0ZXIuY3JlYXRlKGNvbG9yX3NwYWNlcyksXG4gICAgcHJlY2lzaW9uOiBvcHRpb25zLnByZWNpc2lvbiB8fCA5LFxuICAgIGxpbWl0ZXI6IExpbWl0ZXIuY3JlYXRlKG51bGwsIG51bGwsIG9wdGlvbnMubGltaXRzIHx8ICdudWxsaWZ5JylcbiAgfSlcbn1cblxuLyoqXG4gKiBJbnRlcnByZXRzIHRoZSB0eXBlIG9mIHBsdWdpbiBpdCBpcyBhbmQgY2FsbHMgdGhlIGFzc29jaWF0ZWQgcGx1Z2luIGluc3RhbGxlclxuICogaWYgdGhlIHBhc3NlZCBvYmplY3QgaXMgYW4gYXJyYXksIGl0IHdpbGwgdHJ5IHRvIGludGVycHJldCBlYWNoIGl0ZW0gaW4gdGhhdFxuICogYXJyYXkgYXMgYSBwbHVnaW4sIGVzc2VudGlhbGx5IGFsbG93aW5nIHlvdSB0byBjcmVhdGUgcGx1Z2luIGJ1bmRsZXMuXG4gKi9cblxuQWxjaGVtaXN0LnVzZSA9IGZ1bmN0aW9uIHVzZSAocGx1Z2luKSB7XG4gIGlmIChoZWxwZXJzLmlzQXJyYXkocGx1Z2luKSkge1xuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgcGx1Z2luLmxlbmd0aDsgaSsrKSB7XG4gICAgICB0aGlzLnVzZShwbHVnaW5baV0pXG4gICAgfVxuICB9IGVsc2Uge1xuICAgIGlmICh0eXBlb2YgcGx1Z2luID09PSAnZnVuY3Rpb24nKSBwbHVnaW4gPSBwbHVnaW4uY2FsbCh0aGlzLCB0aGlzKVxuICAgIHN3aXRjaCAocGx1Z2lucy5pZGVudGlmeShwbHVnaW4pKSB7XG4gICAgICBjYXNlICdzcGFjZSc6IHRoaXMuYXR0YWNoQ29sb3JTcGFjZShwbHVnaW4pOyBicmVha1xuICAgICAgY2FzZSAnbWV0aG9kJzogdGhpcy5hdHRhY2hDb2xvck1ldGhvZChwbHVnaW4pOyBicmVha1xuICAgIH1cbiAgfVxufVxuXG4vKipcbiAqIFN0b3JlcyBhIHZhbGlkIGNvbG9yc3BhY2UgPHBsdWdpbj4gYW5kIGNyZWF0ZXMgaXQncyBtZXRob2RzXG4gKi9cblxuQWxjaGVtaXN0LmF0dGFjaENvbG9yU3BhY2UgPSBmdW5jdGlvbiBhdHRhY2hDb2xvclNwYWNlIChwbHVnaW4pIHtcbiAgdmFyIGV4aXN0aW5nX3BsdWdpbiA9IHRoaXMuc3BhY2VzLmZpbmQocGx1Z2luLm5hbWUpXG4gIGlmIChleGlzdGluZ19wbHVnaW4gJiYgZXhpc3RpbmdfcGx1Z2luLmlzX2NvbmNyZXRlKVxuICAgIHRocm93IG5ldyBFcnJvcignVGhlIFwiJyArIHBsdWdpbi5uYW1lICsgJ1wiIHBsdWdpbiBhbHJlYWR5IGV4aXN0cycpXG4gIHZhciBwbHVnaW5fc3BhY2VzID0gcGx1Z2lucy5zZXJpYWxpemVDb2xvclNwYWNlKHBsdWdpbiwgdGhpcy5CYXNlU3BhY2UpXG4gIHRoaXMuc3BhY2VzLm1lcmdlKHBsdWdpbl9zcGFjZXMpXG4gIHRoaXMuc3BhY2VzLmVhY2goKGNvbG9yX3NwYWNlKSA9PiB7XG4gICAgaWYgKGNvbG9yX3NwYWNlLmlzX2NvbmNyZXRlKSB7XG4gICAgICB0aGlzLm1ha2VDb25zdHJ1Y3Rvck1ldGhvZChjb2xvcl9zcGFjZSlcbiAgICAgIHRoaXMubWFrZUNvbnZlcnNpb25NZXRob2QoY29sb3Jfc3BhY2UpXG4gICAgfVxuICB9KVxufVxuXG4vKipcbiAqIEF0dGFjaGVzIHRoZSBtZXRob2RzIGZvciBhIHZhbGlkIG1ldGhvZCA8cGx1Z2luPlxuICovXG5cbkFsY2hlbWlzdC5hdHRhY2hDb2xvck1ldGhvZCA9IGZ1bmN0aW9uIChwbHVnaW4pIHtcbiAgaWYgKHBsdWdpbi5tZXRob2RzLmNvbG9yICYmIHRoaXMuQmFzZVNwYWNlW3BsdWdpbi5uYW1lXSkgdGhyb3cgbmV3IEVycm9yKCdUaGUgbWV0aG9kIG5hbWUgXCInICsgcGx1Z2luLm5hbWUgKyAnXCIgYWxyZWFkeSBleGlzdHMgZm9yIGNvbG9ycycpO1xuICBpZiAocGx1Z2luLm1ldGhvZHMuZ2xvYmFsICYmIHRoaXNbcGx1Z2luLm5hbWVdKSB0aHJvdyBuZXcgRXJyb3IoJ1RoZSBtZXRob2QgbmFtZSBcIicgKyBwbHVnaW4ubmFtZSArICdcIiBhbHJlYWR5IGV4aXN0cyBvbiBhbGNoZW1pc3QnKTtcblxuICBpZiAocGx1Z2luLm1ldGhvZHMuY29sb3IpIHtcbiAgICB0aGlzLkJhc2VTcGFjZVtwbHVnaW4ubmFtZV0gPSBwbHVnaW4ubWV0aG9kcy5jb2xvclxuICB9XG4gIGlmIChwbHVnaW4ubWV0aG9kcy5nbG9iYWwpIHtcbiAgICB0aGlzW3BsdWdpbi5uYW1lXSA9IHBsdWdpbi5tZXRob2RzLmdsb2JhbFxuICB9XG59XG5cbi8qKlxuICogQ3JlYXRlcyBhIENvbG9yIGNvbnN0cnVjdG9yIG1ldGhvZCBvbiBBbGNoZW1pc3QgZm9yIHRoZSBnaXZlbiA8Y29sb3Jfc3BhY2U+LlxuICogZS5nLiBhbGNoZW1pc3QucmdiKFsyNTUsIDI1NSwgMjU1XSlcbiAqXG4gKiBUaGlzIGZ1bmN0aW9uIHdpbGwgcmV0dXJuIGEgbmV3IENvbG9yIHdpdGggdGhlIGFzc2lnbmVkIHZhbHVlcywgYW55XG4gKiBuZWNlc3NhcnkgY29uZmlnLCBhbmQgYXR0YWNoZWQgY29udmVyc2lvbiBmdW5jdGlvbnMuXG4gKi9cblxuQWxjaGVtaXN0Lm1ha2VDb25zdHJ1Y3Rvck1ldGhvZCA9IGZ1bmN0aW9uIG1ha2VDb25zdHJ1Y3Rvck1ldGhvZCAoY29sb3Jfc3BhY2UpIHtcbiAgdGhpc1tjb2xvcl9zcGFjZS5zcGFjZV0gPSBmdW5jdGlvbiBjcmVhdGVDb2xvciAodmFsdWUpIHtcbiAgICB2YXIgY29sb3JfdmFsdWU7XG5cbiAgICBpZiAoYXJndW1lbnRzLmxlbmd0aCA+IDEpIHtcbiAgICAgIC8vIEkgaGVhciB0aGlzIGRlb3B0aW1pemVzIHRoaW5ncy4gRmluZCBhIHdheSBhcm91bmQgaWYgbmVjZXNzYXJ5LlxuICAgICAgY29sb3JfdmFsdWUgPSBBcnJheS5wcm90b3R5cGUuc2xpY2UuY2FsbChhcmd1bWVudHMpXG4gICAgfSBlbHNlIHtcbiAgICAgIGNvbG9yX3ZhbHVlID0gdmFsdWVcbiAgICB9XG5cbiAgICByZXR1cm4gY29sb3Jfc3BhY2UuY3JlYXRlKGNvbG9yX3ZhbHVlKVxuICB9XG59XG5cbi8qKlxuICogQ3JlYXRlcyBhIG1ldGhvZCBvbiB0aGUgQmFzZVNwYWNlIHRoYXQgY2FuIGJlIHVzZWQgdG8gY29udmVydCBkaXJlY3RseSB0byB0aGVcbiAqIGdpdmVuIDxjb2xvcl9zcGFjZT5cbiAqL1xuXG5BbGNoZW1pc3QubWFrZUNvbnZlcnNpb25NZXRob2QgPSBmdW5jdGlvbiBtYWtlQ29udmVyc2lvbk1ldGhvZCAoY29sb3Jfc3BhY2UpIHtcbiAgdGhpcy5CYXNlU3BhY2VbY29sb3Jfc3BhY2Uuc3BhY2VdID0gZnVuY3Rpb24gY29udmVydFRvIChvcHRpb25zKSB7XG4gICAgcmV0dXJuIHRoaXMudG8oY29sb3Jfc3BhY2Uuc3BhY2UsIG9wdGlvbnMpXG4gIH1cbn1cblxuQWxjaGVtaXN0LmluaXQoKVxuXG4vLyBleHBvcnQgQWxjaGVtaXN0IVxuZXhwb3J0IGRlZmF1bHQgQWxjaGVtaXN0XG5cblxuXG4vKiogV0VCUEFDSyBGT09URVIgKipcbiAqKiAuL2xpYi9pbmRleC5qc1xuICoqLyIsImltcG9ydCBDb2xvclNwYWNlU3RvcmUgZnJvbSAnLi9jb2xvclNwYWNlU3RvcmUnXG5pbXBvcnQgQ29udmVyc2lvblN0b3JlIGZyb20gJy4vY29udmVyc2lvblN0b3JlJ1xuaW1wb3J0ICogYXMgaGVscGVycyBmcm9tICcuL2hlbHBlcnMnXG5cbnZhciBwbHVnaW5zID0ge31cblxuLyoqXG4gKiBJZGVudGlmaWVzIHRoZSB0eXBlIG9mIHBsdWdpbiBwYXNzZWQuIElmIHR5cGUoKSBjYW4ndCBpZGVudGlmeSB0aGUgPHBsdWdpbj5cbiAqIGl0IHRocm93cyBhbiBlcnJvci5cbiAqL1xuXG5wbHVnaW5zLmlkZW50aWZ5ID0gZnVuY3Rpb24gaWRlbnRpZnkgKHBsdWdpbikge1xuICB0aGlzLnZhbGlkYXRlUGx1Z2luKHBsdWdpbilcbiAgaWYgKHBsdWdpbi50byB8fCBwbHVnaW4uZnJvbSkge1xuICAgIHRoaXMudmFsaWRhdGVDb2xvclNwYWNlUGx1Z2luKHBsdWdpbilcbiAgICByZXR1cm4gJ3NwYWNlJ1xuICB9IGVsc2UgaWYgKHBsdWdpbi5tZXRob2RzKSB7XG4gICAgdGhpcy52YWxpZGF0ZU1ldGhvZFBsdWdpbihwbHVnaW4pXG4gICAgcmV0dXJuICdtZXRob2QnXG4gIH0gZWxzZSB0aHJvdyBuZXcgRXJyb3IoJ1VucmVjb2duaXplZCBwbHVnaW4gZm9ybWF0Jyk7XG59XG5cbi8qKlxuICogVmFsaWRhdGVzIGFueSBnZW5lcmljIHBsdWdpblxuICovXG5cbnBsdWdpbnMudmFsaWRhdGVQbHVnaW4gPSBmdW5jdGlvbiB2YWxpZGF0ZVBsdWdpbiAocGx1Z2luKSB7XG4gIGlmICghaGVscGVycy5pc09iamVjdChwbHVnaW4pKSB0aHJvdyBuZXcgRXJyb3IoJ0V4cGVjdGVkIHBsdWdpbiB0byBiZSBhbiBvYmplY3Q7IGluc3RlYWQgZ290OiAnICsgcGx1Z2luKTtcbiAgaWYgKCFoZWxwZXJzLmlzU3RyaW5nKHBsdWdpbi5uYW1lKSkgdGhyb3cgbmV3IEVycm9yKCdFeHBlY3QgcGxndWluLm5hbWUgdG8gYmUgYSBzdHJpbmc7IGluc3RlYWQgZ290OiAnICsgcGx1Z2luLm5hbWUpXG59XG5cbi8qKlxuICogVmFsaWRhdGVzIGEgY29sb3JzcGFjZS1wbHVnaW5cbiAqL1xuXG5wbHVnaW5zLnZhbGlkYXRlQ29sb3JTcGFjZVBsdWdpbiA9IGZ1bmN0aW9uIHZhbGlkYXRlQ29sb3JTcGFjZVBsdWdpbiAocGx1Z2luKSB7XG4gIGlmICghKHBsdWdpbi50byB8fCBwbHVnaW4uZnJvbSkpIHRocm93IG5ldyBFcnJvcignQ29udmVyc2lvbnMgd2VyZSBub3QgZGVmaW5lZCBmb3IgdGhlIFwiJyArIHBsdWdpbi5uYW1lICsgJ1wiIGNvbG9yc3BhY2UgcGx1Z2luJyk7XG59XG5cbi8qKlxuICogVmFsaWRhdGVzIGEgbWV0aG9kLXBsdWdpblxuICovXG5cbnBsdWdpbnMudmFsaWRhdGVNZXRob2RQbHVnaW4gPSBmdW5jdGlvbiB2YWxpZGF0ZU1ldGhvZFBsdWdpbiAocGx1Z2luKSB7XG4gIGlmICghKHBsdWdpbi5tZXRob2RzLmNvbG9yIHx8IHBsdWdpbi5tZXRob2RzLmdsb2JhbCkpIHRocm93IG5ldyBFcnJvcignTWlzc2luZyBtZXRob2RzIGZvciBtZXRob2QgcGx1Z2luJyk7XG4gIGlmIChwbHVnaW4ubWV0aG9kcy5jb2xvciAmJiAhaGVscGVycy5pc0Z1bmN0aW9uKHBsdWdpbi5tZXRob2RzLmNvbG9yKSkgdGhyb3cgbmV3IEVycm9yKCdFeHBlY3RlZCBjb2xvciBtZXRob2QgdG8gYmUgYSBmdW5jdGlvbjsgaW5zdGVhZCBnb3QgJyArIHBsdWdpbi5tZXRob2RzLmNvbG9yKTtcbiAgaWYgKHBsdWdpbi5tZXRob2RzLmdsb2JhbCAmJiAhaGVscGVycy5pc0Z1bmN0aW9uKHBsdWdpbi5tZXRob2RzLmdsb2JhbCkpIHRocm93IG5ldyBFcnJvcignRXhwZWN0ZWQgY29sb3IgbWV0aG9kIHRvIGJlIGEgZnVuY3Rpb247IGluc3RlYWQgZ290ICcgKyBwbHVnaW4ubWV0aG9kcy5jb2xvcik7XG59XG5cbi8qKlxuICogQ29udmVydHMgYSBjb2xvcnNwYWNlIHBsdWdpbiBpbnRvIGEgdXNhYmxlIENvbG9yU3BhY2VTdG9yZSB0aGF0IGNhbiBiZSBtZXJnZWRcbiAqIHdpdGggdGhlIG1haW4gc3RvcmUuXG4gKlxuICogQWxsIGNvbnZlcnNpb25zIGRlZmluZWQgaW4gdGhlIFwidG9cIiBvYmplY3Qgd2lsbCBiZSBhZGRlZCB1bmRlciB0aGUgbWFpblxuICogY29sb3JzcGFjZS4gQW4gYWJzdHJhY3QgY29sb3JzcGFjZSBpcyBjcmVhdGVkIGZvciBlYWNoIGNvbnZlcnNpb24gaW4gdGhlXG4gKiBcImZyb21cIiBvYmplY3QuXG4gKi9cblxucGx1Z2lucy5zZXJpYWxpemVDb2xvclNwYWNlID0gZnVuY3Rpb24gc2VyaWFsaXplQ29sb3JTcGFjZSAocGx1Z2luLCBCYXNlU3BhY2UpIHtcbiAgdmFyIHJlc3VsdHMsIGNvbG9yX3NwYWNlLCBhYnN0cmFjdF9zcGFjZSwgY29udmVyc2lvbjtcblxuICBpZiAoIWhlbHBlcnMuaXNTdHJpbmcocGx1Z2luLm5hbWUpKSB0aHJvdyBuZXcgRXJyb3IoJ2NvbG9yLXNwYWNlIHBsdWdpbiBpcyBtaXNzaW5nIGEgbmFtZScpXG5cbiAgcmVzdWx0cyA9IENvbG9yU3BhY2VTdG9yZS5jcmVhdGUoKVxuICBjb2xvcl9zcGFjZSA9IEJhc2VTcGFjZS5jcmVhdGUoe1xuICAgIHNwYWNlOiBwbHVnaW4ubmFtZSxcbiAgICBjb252ZXJzaW9uczogQ29udmVyc2lvblN0b3JlLmNyZWF0ZSgpXG4gIH0pXG5cbiAgaWYgKEJhc2VTcGFjZS5saW1pdHMgJiYgcGx1Z2luLmxpbWl0cykge1xuICAgIGNvbG9yX3NwYWNlLmxpbWl0cyA9IEJhc2VTcGFjZS5saW1pdHMuY3JlYXRlKHBsdWdpbi5saW1pdHMubWluLCBwbHVnaW4ubGltaXRzLm1heClcbiAgfVxuXG4gIHJlc3VsdHMuYWRkKGNvbG9yX3NwYWNlKVxuXG4gIGZvciAodmFyIGRlc3RfbmFtZSBpbiBwbHVnaW4udG8pIHtcbiAgICBjb252ZXJzaW9uID0gcGx1Z2luLnRvW2Rlc3RfbmFtZV1cbiAgICBpZiAodHlwZW9mIGNvbnZlcnNpb24gIT09ICdmdW5jdGlvbicpIHRocm93IG5ldyBFcnJvcignZXhwZWN0ZWQgJyArIGNvbnZlcnNpb24gKyAnIHRvIGJlIGEgZnVuY3Rpb24nKTtcbiAgICBjb2xvcl9zcGFjZS5jb252ZXJzaW9ucy5hZGQoZGVzdF9uYW1lLCBwbHVnaW4udG9bZGVzdF9uYW1lXSlcbiAgfVxuXG4gIGZvciAodmFyIHNyY19uYW1lIGluIHBsdWdpbi5mcm9tKSB7XG4gICAgY29udmVyc2lvbiA9IHBsdWdpbi5mcm9tW3NyY19uYW1lXVxuICAgIGlmICh0eXBlb2YgY29udmVyc2lvbiAhPT0gJ2Z1bmN0aW9uJykgdGhyb3cgbmV3IEVycm9yKCdleHBlY3RlZCAnICsgY29udmVyc2lvbiArICcgdG8gYmUgYSBmdW5jdGlvbicpO1xuICAgIGFic3RyYWN0X3NwYWNlID0gQmFzZVNwYWNlLmNyZWF0ZSh7XG4gICAgICBzcGFjZTogc3JjX25hbWUsXG4gICAgICBhYnN0cmFjdDogdHJ1ZSxcbiAgICAgIGNvbnZlcnNpb25zOiBDb252ZXJzaW9uU3RvcmUuY3JlYXRlKClcbiAgICB9KVxuXG4gICAgYWJzdHJhY3Rfc3BhY2UuY29udmVyc2lvbnMuYWRkKHBsdWdpbi5uYW1lLCBwbHVnaW4uZnJvbVtzcmNfbmFtZV0pXG4gICAgcmVzdWx0cy5hZGQoYWJzdHJhY3Rfc3BhY2UpXG4gIH1cblxuICByZXR1cm4gcmVzdWx0c1xufVxuXG5leHBvcnQgZGVmYXVsdCBwbHVnaW5zXG5cblxuXG4vKiogV0VCUEFDSyBGT09URVIgKipcbiAqKiAuL2xpYi9wbHVnaW5zLmpzXG4gKiovIiwiaW1wb3J0IFN0b3JhZ2UgZnJvbSAnLi9zdG9yYWdlJ1xuXG4vKipcbiAqIFN0b3JlcyBhIHNldCBvZiBDb2xvclNwYWNlc1xuICpcbiAqIEEgXCJDb2xvclNwYWNlXCIgaXMgYSBwYXJ0aWFsbHkgY29tcGxldGUgQ29sb3IgY29udGFpbmluZyBhIHR5cGUsIGEgY29udmVydGVyLFxuICogYW5kIGEgc2V0IG9mIGNvbnZlcnNpb25zLiBUaGUgY29udmVydGVyIGlzIHByZWZlcmFibHkgaW5oZXJpdGVkIGZyb20gYVxuICogQmFzZVNwYWNlLiBGb3IgbW9yZSBpbmZvIHNlZSB0aGUgZGVzY3JpcHRpb24gZm9yIENvbG9yLlxuICovXG5cbnZhciBDb2xvclNwYWNlU3RvcmUgPSBTdG9yYWdlLmV4dGVuZCgpXG5cbi8qKlxuICogQWRkcyBhIENvbG9yU3BhY2UgdG8gdGhlIHN0b3JlLiBUaHJvd3MgYW4gRXJyb3IgaWYgdGhlIENvbG9yU3BhY2UgYWxyZWFkeVxuICogZXhpc3RzLlxuICovXG5cbkNvbG9yU3BhY2VTdG9yZS5hZGQgPSBmdW5jdGlvbiAoY29sb3Jfc3BhY2UpIHtcbiAgdmFyIHByb3RvID0gT2JqZWN0LmdldFByb3RvdHlwZU9mKENvbG9yU3BhY2VTdG9yZSlcbiAgcHJvdG8uYWRkLmNhbGwodGhpcywgY29sb3Jfc3BhY2Uuc3BhY2UsIGNvbG9yX3NwYWNlKVxufVxuXG4vKipcbiAqIFJldHVybnMgYW4gYXJyYXkgb2YgYWRqYWNlbnQgY29udmVydGFibGUgQ29sb3JTcGFjZXMuXG4gKlxuICogSXQgZG9lcyB0aGlzIGJ5IGNvbXBhcmluZyB0aGUgYXZhaWxhYmxlIGNvbnZlcnNpb25zIG9uIGEgY29sb3Igc3BhY2VcbiAqIHRvIHRoZSBjb2xvciBzcGFjZXMgd2l0aGluIHRoZSBDb2xvclNwYWNlU3RvcmUuXG4gKi9cblxuQ29sb3JTcGFjZVN0b3JlLmZpbmROZWlnaGJvcnMgPSBmdW5jdGlvbiBmaW5kTmVpZ2hib3JzIChzcGFjZV9uYW1lKSB7XG4gIHZhciBuZWlnaGJvcnMgPSBbXVxuICB2YXIgY29sb3Jfc3BhY2UgPSB0aGlzLmZpbmQoc3BhY2VfbmFtZSlcblxuICBpZiAoY29sb3Jfc3BhY2UgPT09IG51bGwpIHtcbiAgICByZXR1cm4gbmVpZ2hib3JzO1xuICB9XG5cbiAgdmFyIGNvbnZlcnNpb25zID0gY29sb3Jfc3BhY2UuY29udmVyc2lvbnNcblxuICBjb252ZXJzaW9ucy5lYWNoKChjb252ZXJzaW9uLCB0YXJnZXRfbmFtZSkgPT4ge1xuICAgIGlmICh0eXBlb2YgY29udmVyc2lvbiAhPT0gJ3N0cmluZycpIHtcbiAgICAgIHZhciB0YXJnZXRfc3BhY2UgPSB0aGlzLmZpbmQodGFyZ2V0X25hbWUpXG4gICAgICBpZiAodGFyZ2V0X3NwYWNlICYmIHRhcmdldF9zcGFjZS5pc19jb25jcmV0ZSkge1xuICAgICAgICBuZWlnaGJvcnMucHVzaCh0YXJnZXRfbmFtZSlcbiAgICAgIH1cbiAgICB9XG4gIH0pXG5cbiAgcmV0dXJuIG5laWdoYm9yc1xufVxuXG4vKipcbiAqIE1lcmdlcyB0d28gU3RvcmVzLlxuICpcbiAqIExvb3BzIG92ZXIgdGhlIDxmb3JlaWduX3N0b3JlPiBjb21wYXJpbmcgaXRzIHZhbHVlcyB3aXRoIHRoZSBsb2NhbCBzdG9yZS4gSWZcbiAqIHRoZSA8Zm9yZWlnbl9zdG9yZT4gaGFzIGFueSBrZXlzIHRoYXQgdGhlIGxvY2FsIGRvZXMgbm90LCBpdCBhZGRzIHRoZW0uIElmXG4gKiBib3RoIHN0b3JlcyBoYXZlIHRoZSBzYW1lIGtleSwgaXQgY2FsbHMgbWVyZ2UoKSBvbiB0aGUgdmFsdWUgb2YgdGhlIGxvY2FsIGtleVxuICovXG5cbkNvbG9yU3BhY2VTdG9yZS5tZXJnZSA9IGZ1bmN0aW9uIG1lcmdlIChmb3JlaWduX3N0b3JlKSB7XG4gIGZvcmVpZ25fc3RvcmUuZWFjaCgoZm9yZWlnbl9zcGFjZSwgbmFtZSkgPT4ge1xuICAgIHZhciBsb2NhbF9zcGFjZSA9IHRoaXMuZmluZChuYW1lKVxuICAgIGlmIChsb2NhbF9zcGFjZSkgdGhpcy5tZXJnZVNwYWNlcyhsb2NhbF9zcGFjZSwgZm9yZWlnbl9zcGFjZSk7XG4gICAgZWxzZSB0aGlzLnN0b3JlW25hbWVdID0gZm9yZWlnbl9zcGFjZVxuICB9KVxufVxuXG4vKipcbiAqIE1lcmdlcyB0d28gQ29sb3JTcGFjZXNcbiAqXG4gKiBJZiB0aGUgPGZvcmVpZ25fc3BhY2U+IGlzIHN1cHBsaWVkIGFzIHRoZSBtYWluIGNvbG9yIHNwYWNlIG9mIGEgcGx1Z2luLCBpdCdzXG4gKiBjb252ZXJzaW9ucyB3aWxsIGFsd2F5cyBiZSBwcmVmZXJlZC4gT3RoZXJ3aXNlIHdlIHN0YXkgc2FmZSBhbmQga2VlcCB0aGVcbiAqIGN1cnJlbnQgY29udmVyc2lvbnNcbiAqXG4gKiBJZiBlaXRoZXIgb2YgdGhlIHBhc3NlZCBzcGFjZXMgYXJlIGNvbmNyZXRlIChyZXN1bHRpbmcgZnJvbSB0aGUgXCJ0b1wiIG9iamVjdFxuICogb2YgYSBwbHVnaW4pLCB0aGUgcmVzdWx0aW5nIHNwYWNlIHdpbGwgYWx3YXlzIGJlIGNvbmNyZXRlIGFzIHdlbGwuXG4gKi9cblxuQ29sb3JTcGFjZVN0b3JlLm1lcmdlU3BhY2VzID0gZnVuY3Rpb24gKGxvY2FsX3NwYWNlLCBmb3JlaWduX3NwYWNlKSB7XG4gIC8vIGNvbnZlcnNpb25zIGRlZmluZWQgYnkgYSBjb2xvcnNwYWNlJ3MgcGx1Z2luIGFyZSBwcmVmZXJlZCBvdmVyIGNvbnZlcnNpb25zXG4gIC8vIGRlZmluZWQgYnkgdGhlIG90aGVyIGNvbG9yc3BhY2VzXG4gIHZhciBjdXJpbmcgPSAhbG9jYWxfc3BhY2UuaXNfY29uY3JldGUgJiYgZm9yZWlnbl9zcGFjZS5pc19jb25jcmV0ZVxuXG4gIGlmIChjdXJpbmcgJiYgZm9yZWlnbl9zcGFjZS5saW1pdHMpIHtcbiAgICBsb2NhbF9zcGFjZS5saW1pdHMubWVyZ2UoZm9yZWlnbl9zcGFjZS5saW1pdHMpXG4gIH1cblxuICBsb2NhbF9zcGFjZS5jb252ZXJzaW9ucy5tZXJnZShmb3JlaWduX3NwYWNlLmNvbnZlcnNpb25zLCB7IGZvcmNlOiBjdXJpbmcgfSlcblxuICAvLyB3aGVuIHRoZSBjb252ZXJzaW9uIGlzIG92ZXIsIGlmIHRoZSBzcGFjZSB3YXMgYWJzdHJhY3QgbWFrZSBpdCBjb25jcmV0ZVxuICBpZiAoY3VyaW5nKSBsb2NhbF9zcGFjZS5pc19jb25jcmV0ZSA9IHRydWVcbn1cblxuZXhwb3J0IGRlZmF1bHQgQ29sb3JTcGFjZVN0b3JlXG5cblxuXG4vKiogV0VCUEFDSyBGT09URVIgKipcbiAqKiAuL2xpYi9jb2xvclNwYWNlU3RvcmUuanNcbiAqKi8iLCJpbXBvcnQgKiBhcyBoZWxwZXJzIGZyb20gJy4vaGVscGVycydcbmltcG9ydCBTdGF0ZWxlc3MgZnJvbSAnc3RhdGVsZXNzJ1xuXG52YXIgU3RvcmFnZSA9IFN0YXRlbGVzcy5leHRlbmQoKVxuXG4vKipcbiAqIEluaXRpYWxpemVzIFN0b3JhZ2UncyBzdGF0ZS4gSXMgY2FsbGVkIG9uIGNyZWF0ZSgpXG4gKi9cblxuU3RvcmFnZS5pbml0ID0gZnVuY3Rpb24gaW5pdCAoKSB7XG4gIHRoaXMuc3RvcmUgPSB7fVxufVxuXG4vKipcbiAqIEFkZHMgPGtleT4vPHZhbHVlPiB0byB0aGUgc3RvcmUuIDxrZXk+IHNob3VsZCBiZSBhIHVuaXF1ZSBpZGVudGlmaWVyLiBJZiBrZXlcbiAqIGlzIGFscmVhZHkgcHJlc2VudCBpbiB0aGUgc3RvcmUsIGFkZCB3aWxsIHRocm93IGFuIGVycm9yLiBUaGlzIGlzIHRvIHByZXZlbnRcbiAqIGFjY2lkZW50YWwgb3ZlcndyaXRlcy4gSW4gbW9zdCBjYXNlcyB3ZSdsbCB3YW50IHRvIHVzZSBtZXJnZSgpIGluc3RlYWQgYW55d2F5XG4gKi9cblxuU3RvcmFnZS5hZGQgPSBmdW5jdGlvbiBhZGQgKGtleSwgdmFsdWUpIHtcbiAgaWYgKHRoaXMuc3RvcmVba2V5XSkgdGhyb3cgbmV3IEVycm9yKCd0aGUga2V5IFwiJyArIGtleSArICdcIiBhbHJlYWR5IGV4aXN0cyBpbiB0aGlzIHN0b3JlJylcbiAgdGhpcy5zdG9yZVtrZXldID0gdmFsdWVcbn1cblxuLyoqXG4gKiBSZXR1cm5zIHRoZSB2YWx1ZSBhc3NvY2lhdGVkIHdpdGggPGtleT4gaWYgaXQgZXhpc3RzLCBvdGhlcndpc2UsIHJldHVybiBudWxsXG4gKi9cblxuU3RvcmFnZS5maW5kID0gZnVuY3Rpb24gZmluZCAoa2V5KSB7XG4gIHJldHVybiB0aGlzLnN0b3JlW2tleV0gfHwgbnVsbFxufVxuXG4vKipcbiAqIFJldHVybnMgdHJ1ZSBpZiB0aGUga2V5IGFscmVhZHkgZXhpc3RzLCBvdGhlcndpc2UsIGl0IHJldHVybnMgZmFsc2VcbiAqL1xuXG5TdG9yYWdlLmhhcyA9IGZ1bmN0aW9uIGhhcyAoa2V5KSB7XG4gIHJldHVybiBCb29sZWFuKHRoaXMuZmluZChrZXkpKVxufVxuXG4vKipcbiAqIFJlbW92ZXMgPGtleT4gYW5kIGl0J3MgYXNzb2NpYXRlZCB2YWx1ZSBmcm9tIHRoZSBzdG9yZVxuICovXG5cblN0b3JhZ2UucmVtb3ZlID0gZnVuY3Rpb24gcmVtb3ZlIChrZXkpIHtcbiAgZGVsZXRlIHRoaXMuc3RvcmVba2V5XVxufVxuXG4vKipcbiAqIGl0ZXJhdGVzIG92ZXIgdGhlIHN0b3JlLCBjYWxsaW5nIDxmdW5jPiBvbiBlYWNoIGl0ZXJhdGlvblxuICogaWYgdGhlIGZ1bmN0aW9uIHJldHVybnMgYW55dGhpbmcsIHRoZSBpdGVyYXRpb24gaXMgaGFsdGVkIGFuZCB0aGUgcmVzdWx0IGlzIHJldHVybmVkXG4gKi9cblxuU3RvcmFnZS5lYWNoID0gZnVuY3Rpb24gZWFjaCAoZnVuYywgY29udGV4dCkge1xuICByZXR1cm4gaGVscGVycy5lYWNoLmNhbGwodGhpcywgdGhpcy5zdG9yZSwgZnVuYywgY29udGV4dClcbn1cblxuLyoqXG4gKiBsb29wcyBvdmVyIHRoZSA8Zm9yZWlnbl9zdG9yZT4gY29tcGFyaW5nIGl0cyB2YWx1ZXMgd2l0aCB0aGUgbG9jYWwgc3RvcmUuIElmXG4gKiB0aGUgPGZvcmVpZ25fc3RvcmU+IGhhcyBhbnkga2V5cyB0aGF0IHRoZSBsb2NhbCBkb2VzIG5vdCwgaXQgYWRkcyB0aGVtLiBJZlxuICogYm90aCBzdG9yZXMgaGF2ZSB0aGUgc2FtZSBrZXksIGl0IGNhbGxzIG1lcmdlKCkgb24gdGhlIHZhbHVlIG9mIHRoZSBsb2NhbCBrZXlcbiAqL1xuXG5TdG9yYWdlLm1lcmdlID0gZnVuY3Rpb24gbWVyZ2UgKGZvcmVpZ25fc3RvcmUpIHtcbiAgZm9yZWlnbl9zdG9yZS5lYWNoKGZ1bmN0aW9uICh2YWx1ZSwga2V5KSB7XG4gICAgdmFyIGxvY2FsID0gdGhpcy5maW5kKGtleSlcbiAgICBpZiAobG9jYWwpIGxvY2FsLm1lcmdlKHZhbHVlKTtcbiAgICBlbHNlIHRoaXMuc3RvcmVba2V5XSA9IHZhbHVlXG4gIH0sIHRoaXMpXG59XG5cbmV4cG9ydCBkZWZhdWx0IFN0b3JhZ2VcblxuXG5cbi8qKiBXRUJQQUNLIEZPT1RFUiAqKlxuICoqIC4vbGliL3N0b3JhZ2UuanNcbiAqKi8iLCIvKipcbiAqIElmIDx0YXJnZXQ+IGlzIGEgU3RyaW5nIG9yIE51bWJlciBjcmVhdGUgYSBuZXcgb2JqZWN0IHdpdGggdGhvc2UgdmFsdWVzLlxuICogSWYgPHRhcmdldD4gaXMgYW4gQXJyYXksIHJlY3Vyc2l2ZWx5IGNhbGwgdGhpcyBmdW5jdGlvbiBvbiBhbGwgb2YgaXQncyBjb250ZW50c1xuICovXG5cbmV4cG9ydCBmdW5jdGlvbiBjbG9uZSAodGFyZ2V0KSB7XG4gIHZhciBjbG9uZWQ7XG5cbiAgdmFyIG9iaiA9IE9iamVjdCh0YXJnZXQpXG5cbiAgc3dpdGNoIChvYmouY29uc3RydWN0b3IpIHtcbiAgICBjYXNlIFN0cmluZzpcbiAgICAgIGNsb25lZCA9IG9iai50b1N0cmluZygpXG4gICAgICBicmVhaztcbiAgICBjYXNlIE51bWJlcjpcbiAgICAgIGNsb25lZCA9IE51bWJlcihvYmopXG4gICAgICBicmVhaztcbiAgICBjYXNlIEFycmF5OlxuICAgICAgY2xvbmVkID0gW11cbiAgICAgIGVhY2gob2JqLCBmdW5jdGlvbiAoaXRlbSwgaSkge1xuICAgICAgICBjbG9uZWRbaV0gPSBjbG9uZShpdGVtKVxuICAgICAgfSlcbiAgICAgIGJyZWFrO1xuICAgIGRlZmF1bHQ6XG4gICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCdBbGNoZW1pc3QgZG9lcyBub3Qga25vdyBob3cgdG8gY2xvbmUgJyArIHRhcmdldClcbiAgfVxuICByZXR1cm4gY2xvbmVkO1xufVxuXG4vKipcbiAqIEkgZG9uJ3QgdGhpbmsgQXJyYXkuaXNBcnJheSBpcyB3ZWxsIHN1cHBvcnRlZC4gVXNlIHRoaXMgZnVuY3Rpb24gaW5zdGVhZCBmb3JcbiAqIG5vdyBzbyB0aGF0IGlmIHdlIG5lZWQgdG8gYWRkIGEgZmFsbGJhY2sgaXQgd29uJ3QgdGFrZSBhcyBtdWNoIGVmZm9ydC5cbiAqL1xuXG5leHBvcnQgZnVuY3Rpb24gaXNBcnJheSAob2JqZWN0KSB7XG4gIHJldHVybiBBcnJheS5pc0FycmF5KG9iamVjdClcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGlzT2JqZWN0IChvYmplY3QpIHtcbiAgcmV0dXJuIEJvb2xlYW4ob2JqZWN0ICYmIHR5cGVvZiBvYmplY3QgPT09ICdvYmplY3QnKVxufVxuXG5leHBvcnQgZnVuY3Rpb24gaXNGdW5jdGlvbiAoZnVuYykge1xuICByZXR1cm4gdHlwZW9mIGZ1bmMgPT09ICdmdW5jdGlvbidcbn1cblxuLyoqXG4gKiBUZXN0cyB0byBzZWUgaWYgYW4gb2JqZWN0IGlzIGEgUGxhaW4gT2JqZWN0IHByb2R1Y2VkIGZyb20gYW4gb2JqZWN0IGxpdGVyYWwuXG4gKiBUaGlzIGlzIGdvb2QgZm9yIHRlc3RpbmcgdGhpbmdzIGxpa2UgZnVuY3Rpb24gb3B0aW9ucy5cbiAqL1xuXG5leHBvcnQgZnVuY3Rpb24gaXNQbGFpbk9iamVjdCAob2JqZWN0KSB7XG4gIGlmICghKG9iamVjdCAmJiB0b1N0cmluZy5jYWxsKG9iamVjdCkgPT09ICdbb2JqZWN0IE9iamVjdF0nKSkgcmV0dXJuIGZhbHNlXG4gIHJldHVybiBPYmplY3QuZ2V0UHJvdG90eXBlT2Yob2JqZWN0KSA9PT0gT2JqZWN0LnByb3RvdHlwZVxufVxuXG4vKipcbiAqIFRlc3RzIGlmIGFuIG9iamVjdCBpcyBhIHN0cmluZyBsaXRlcmFsXG4gKi9cblxuZXhwb3J0IGZ1bmN0aW9uIGlzU3RyaW5nIChvYmplY3QpIHtcbiAgcmV0dXJuIHR5cGVvZiBvYmplY3QgPT09ICdzdHJpbmcnXG59XG5cbi8qKlxuICogdGFrZXMgYW4gYXJyYXkgb3Igb2JqZWN0LCBpdGVyYXRlcyBvdmVyIGl0LCBhbmQgY2FsbHMgPGZ1bmM+IG9uIGVhY2ggaXRlcmF0aW9uXG4gKiBpZiB0aGUgZnVuY3Rpb24gcmV0dXJucyBhbnl0aGluZywgdGhlIGl0ZXJhdGlvbiBpcyBoYWx0ZWQgYW5kIHRoZSByZXN1bHQgaXMgcmV0dXJuZWRcbiAqL1xuXG5leHBvcnQgZnVuY3Rpb24gZWFjaCAoY29sbGVjdGlvbiwgZnVuYywgY29udGV4dCkge1xuICB2YXIgcmVzdWx0O1xuICBjb250ZXh0ID0gY29udGV4dCB8fCBudWxsXG4gIGlmIChpc0FycmF5KGNvbGxlY3Rpb24pKSB7XG4gICAgdmFyIGxlbmd0aCA9IGNvbGxlY3Rpb24ubGVuZ3RoXG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBsZW5ndGg7IGkrKykge1xuICAgICAgcmVzdWx0ID0gZnVuYy5jYWxsKGNvbnRleHQsIGNvbGxlY3Rpb25baV0sIGkpXG4gICAgICBpZiAocmVzdWx0ICE9PSB1bmRlZmluZWQpIHJldHVybiByZXN1bHRcbiAgICB9XG4gIH0gZWxzZSB7XG4gICAgZm9yICh2YXIga2V5IGluIGNvbGxlY3Rpb24pIHtcbiAgICAgIHJlc3VsdCA9IGZ1bmMuY2FsbChjb250ZXh0LCBjb2xsZWN0aW9uW2tleV0sIGtleSlcbiAgICAgIGlmIChyZXN1bHQgIT09IHVuZGVmaW5lZCkgcmV0dXJuIHJlc3VsdFxuICAgIH1cbiAgfVxuICByZXR1cm4gbnVsbFxufVxuXG4vKipcbiAqIElmIDx2YWx1ZT4gaXMgYSBudW1iZXIsIGl0IHdpbGwgcm91bmQgaXQuIElmIDx2YWx1ZT4gaXMgYW5cbiAqIEFycmF5IGl0IHdpbGwgdHJ5IHRvIHJvdW5kIGl0J3MgY29udGVudHMuIElmIDxwcmVjaXNpb24+IGlzIHByZXNlbnQsIGl0IHdpbGxcbiAqIHJvdW5kIHRvIHRoYXQgZGVjaW1hbCB2YWx1ZS4gVGhlIGRlZmF1bHQgPHByZWNpc2lvbj4gaXMgNC5cbiAqL1xuXG5leHBvcnQgZnVuY3Rpb24gcm91bmQgKHZhbHVlLCBwcmVjaXNpb24pIHtcbiAgcHJlY2lzaW9uID0gcHJlY2lzaW9uIHx8IDRcbiAgaWYgKGlzQXJyYXkodmFsdWUpKSB7XG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCB2YWx1ZS5sZW5ndGg7IGkrKykge1xuICAgICAgdmFsdWVbaV0gPSB0aGlzLnJvdW5kSWZOdW1iZXIodmFsdWVbaV0sIHByZWNpc2lvbilcbiAgICB9XG4gIH0gZWxzZSB7XG4gICAgdmFsdWUgPSByb3VuZElmTnVtYmVyKHZhbHVlLCBwcmVjaXNpb24pXG4gIH1cbiAgcmV0dXJuIHZhbHVlXG59XG5cbi8qKlxuICogSWYgPHZhbHVlPiBpcyBhIG51bWJlciwgd2Ugcm91bmQgaXQgdG8gd2hhdGV2ZXIgdGhlIGN1cnJlbnQgPHByZWNpc2lvbj4gc2V0dGluZ1xuICogaXMgYXQuXG4gKi9cblxuZXhwb3J0IGZ1bmN0aW9uIHJvdW5kSWZOdW1iZXIgKHZhbHVlLCBwcmVjaXNpb24pIHtcbiAgaWYgKHR5cGVvZiB2YWx1ZSA9PT0gJ251bWJlcicpIHtcbiAgICB2YWx1ZSA9IE51bWJlcih2YWx1ZS50b1ByZWNpc2lvbihwcmVjaXNpb24pKVxuICB9XG4gIHJldHVybiB2YWx1ZVxufVxuXG5cblxuLyoqIFdFQlBBQ0sgRk9PVEVSICoqXG4gKiogLi9saWIvaGVscGVycy5qc1xuICoqLyIsIm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZShcInN0YXRlbGVzc1wiKTtcblxuXG4vKioqKioqKioqKioqKioqKipcbiAqKiBXRUJQQUNLIEZPT1RFUlxuICoqIGV4dGVybmFsIFwic3RhdGVsZXNzXCJcbiAqKiBtb2R1bGUgaWQgPSA4XG4gKiogbW9kdWxlIGNodW5rcyA9IDBcbiAqKi8iLCJpbXBvcnQgU3RvcmFnZSBmcm9tICcuL3N0b3JhZ2UnXG5cbnZhciBDb252ZXJzaW9uU3RvcmUgPSBTdG9yYWdlLmV4dGVuZCgpXG5cbi8qKlxuICogTG9vcHMgb3ZlciB0aGUgPGZvcmVpZ25fc3RvcmU+IGNvbXBhcmluZyBpdHMgY29udmVyc2lvbnMgd2l0aCB0aGUgbG9jYWxcbiAqIHN0b3JlJ3MuIElmIHRoZSA8Zm9yZWlnbl9zdG9yZT4gaGFzIGFueSBjb252ZXJzaW9ucyB0aGF0IHRoZSBsb2NhbCBkb2VzIG5vdCxcbiAqIGl0IGFkZHMgdGhlbS4gSWYgYm90aCBzdG9yZXMgaGF2ZSB0aGUgc2FtZSBjb252ZXJzaW9uLCBpdCB1c2VzIHRoZSBjdXJyZW50XG4gKiBjb252ZXJzaW9uLiBJZiA8b3B0aW9ucy5mb3JjZT4gaXMgdHJ1dGh5IHRoZSBtZXJnZSB3aWxsIGFsd2F5cyBvdmVyd3JpdGUgdGhlXG4gKiBjdXJyZW50IGNvbnZlcnNpb24uXG4gKi9cblxuQ29udmVyc2lvblN0b3JlLm1lcmdlID0gZnVuY3Rpb24gbWVyZ2UgKGZvcmVpZ25fc3RvcmUsIG9wdGlvbnMpIHtcbiAgb3B0aW9ucyA9IG9wdGlvbnMgfHwge31cbiAgZm9yZWlnbl9zdG9yZS5lYWNoKGZ1bmN0aW9uICh2YWx1ZSwga2V5KSB7XG4gICAgdmFyIGxvY2FsID0gdGhpcy5maW5kKGtleSlcbiAgICBpZiAob3B0aW9ucy5mb3JjZSB8fCAhbG9jYWwgfHwgdHlwZW9mIGxvY2FsID09PSAnc3RyaW5nJykge1xuICAgICAgdGhpcy5zdG9yZVtrZXldID0gdmFsdWVcbiAgICB9XG4gIH0sIHRoaXMpXG59XG5cbmV4cG9ydCBkZWZhdWx0IENvbnZlcnNpb25TdG9yZVxuXG5cblxuLyoqIFdFQlBBQ0sgRk9PVEVSICoqXG4gKiogLi9saWIvY29udmVyc2lvblN0b3JlLmpzXG4gKiovIiwiaW1wb3J0ICogYXMgXyBmcm9tICcuL2hlbHBlcnMnXG5pbXBvcnQgU3RhdGVsZXNzIGZyb20gJ3N0YXRlbGVzcydcblxuLyoqXG4gKiBDb2xvciBpcyBvdXIgaGVhdnkgbGlmdGVyLiBJbiBvcmRlciBmb3IgYSBDb2xvciB0byBiZSBjb252ZXJ0YWJsZSB5b3UgbmVlZCBhXG4gKiBjb252ZXJ0ZXIsIGNvbnZlcnNpb25zLCBhIHNwYWNlLCBhbmQgYSB2YWx1ZSB0byBhbGwgYmUgZGVmaW5lZC4gVGhpcyBpcyBhIGxvdFxuICogb2YgcHJlLXJlcXVpc2l0ZXMgc28gQ29sb3Igd2FzIGRlc2lnbmVkIHRvIGJlIGJ1aWx0IG92ZXIgMyBzdGFnZXMgb2ZcbiAqIGluaGVyaXRhbmNlLCBpbmNsdWRpbmcgYSBmZXcgb2YgdGhlIHJlcXVpcmVtZW50cyBhdCBhIHRpbWUuXG4gKlxuICogQmFzZVNwYWNlIChjb252ZXJ0ZXIpXG4gKiAgIFZcbiAqIENvbG9yU3BhY2UgKGNvbnZlcnNpb25zLCBzcGFjZSlcbiAqICAgVlxuICogQ29sb3IgKHZhbHVlKVxuICpcbiAqIEV4YW1wbGU6XG4gKiAtIEFsbCBjb2xvcnMgc2hvdWxkIGhhdmUgdGhlaXIgb3duIHZhbHVlc1xuICogLSBBbGwgXCJyZ2JcIiBjb2xvcnMgc2hvdWxkIGhhdmUgdGhlIHNhbWUgc2V0IG9mIGNvbnZlcnNpb25zXG4gKiAtIEFsbCBjb2xvcnMgaW4gZ2VuZXJhbCBzaG91bGQgaGF2ZSBjb21tb24gY29udmVyc2lvbiBsb2dpYyBjb250YWluZWQgaW4gYVxuICogICBjb252ZXJ0ZXIuXG4gKlxuICogQ29sb3IgbWV0aG9kcyBzaG91bGQgYmUgZGVmaW5lZCBvbiB0aGUgQmFzZVNwYWNlIHRvIGVuc3VyZSBhbGwgY29sb3JzIHVwXG4gKiB0aGUgY2hhaW4gcmVjZWl2ZSB0aGUgc2FtZSBtZXRob2RzIHdpdGhvdXQgaGF2aW5nIHRvIGFkZCB0aGVtIG9uIHRoZSBmbHlcbiAqIGR1cmluZyBDb2xvciBjcmVhdGlvblxuICovXG5cbnZhciBDb2xvciA9IFN0YXRlbGVzcy5leHRlbmQoKVxuXG4vKipcbiAqIEluaXRpYWxpemVzIENvbG9yJ3Mgc3RhdGUuIElzIGNhbGxlZCBvbiBjcmVhdGUoKVxuICovXG5cbkNvbG9yLmluaXQgPSBmdW5jdGlvbiBpbml0ICh2YWx1ZSwgb3B0aW9ucykge1xuICBpZiAoXy5pc1BsYWluT2JqZWN0KGFyZ3VtZW50c1swXSkpIHtcbiAgICBvcHRpb25zID0gYXJndW1lbnRzWzBdXG4gIH0gZWxzZSBpZiAodmFsdWUgIT09IHVuZGVmaW5lZCkge1xuICAgIGlmICh0aGlzLmxpbWl0cykgdGhpcy52YWx1ZSA9IHRoaXMubGltaXRzLmNoZWNrKHZhbHVlKTtcbiAgICBlbHNlIHRoaXMudmFsdWUgPSB2YWx1ZTtcbiAgfVxuXG4gIG9wdGlvbnMgPSBvcHRpb25zIHx8IHt9XG5cbiAgLy8gQmFzZVNwYWNlXG4gIGlmIChvcHRpb25zLmxpbWl0ZXIpIHRoaXMubGltaXRzID0gb3B0aW9ucy5saW1pdGVyO1xuICBpZiAob3B0aW9ucy5wcmVjaXNpb24pIHRoaXMucHJlY2lzaW9uID0gb3B0aW9ucy5wcmVjaXNpb247XG4gIGlmIChvcHRpb25zLmNvbnZlcnRlcikgdGhpcy5jb252ZXJ0ZXIgPSBvcHRpb25zLmNvbnZlcnRlcjtcblxuICAvLyBDb2xvclNwYWNlXG4gIGlmIChvcHRpb25zLmNvbnZlcnNpb25zKSB0aGlzLmNvbnZlcnNpb25zID0gb3B0aW9ucy5jb252ZXJzaW9ucztcbiAgaWYgKG9wdGlvbnMuc3BhY2UpIHRoaXMuc3BhY2UgPSBvcHRpb25zLnNwYWNlO1xuXG4gIHRoaXMuaXNfY29uY3JldGUgPSAhb3B0aW9ucy5hYnN0cmFjdFxufVxuXG4vKipcbiAqIENvbnZlcnRzIGEgY29sb3IgYW5kIHJldHVybnMgaXRzIHZhbHVlc1xuICovXG5cbkNvbG9yLnRvID0gZnVuY3Rpb24gdG8gKHRhcmdldF9uYW1lLCBvcHRpb25zKSB7XG4gIG9wdGlvbnMgPSBvcHRpb25zIHx8IHt9XG4gIHZhciBjb2xvciA9IHRoaXMuYXModGFyZ2V0X25hbWUpXG4gIGlmIChvcHRpb25zLnByZWNpc2lvbiA9PT0gbnVsbCkgcmV0dXJuIGNvbG9yLnZhbDtcbiAgZWxzZSByZXR1cm4gY29sb3Iucm91bmQob3B0aW9ucy5wcmVjaXNpb24pXG59XG5cbi8qKlxuICogQ29udmVydHMgYSBjb2xvciBhbmQgcmV0dXJucyB0aGUgbmV3IGNvbG9yXG4gKi9cblxuQ29sb3IuYXMgPSBmdW5jdGlvbiBhcyAodGFyZ2V0X25hbWUpIHtcbiAgcmV0dXJuIHRoaXMuY29udmVydGVyLmNvbnZlcnQodGhpcywgdGFyZ2V0X25hbWUpXG59XG5cbi8qKlxuICogUm91bmRzIHRoZSB2YWx1ZSB0byB0aGUgZ2l2ZW4gcHJlY2lzaW9uLlxuICogSWYgYSBwcmVjaXNpb24gaXNuJ3QgcHJvdmlkZWQsIGl0IHVzZXMgdGhlIGRlZmF1bHRcbiAqL1xuXG5Db2xvci5yb3VuZCA9IGZ1bmN0aW9uIHJvdW5kIChwcmVjaXNpb24pIHtcbiAgcmV0dXJuIF8ucm91bmQodGhpcy52YWx1ZSwgcHJlY2lzaW9uIHx8IHRoaXMucHJlY2lzaW9uKVxufVxuXG5leHBvcnQgZGVmYXVsdCBDb2xvclxuXG5cblxuLyoqIFdFQlBBQ0sgRk9PVEVSICoqXG4gKiogLi9saWIvY29sb3IuanNcbiAqKi8iLCJpbXBvcnQgKiBhcyBoZWxwZXJzIGZyb20gJy4vaGVscGVycydcbmltcG9ydCBTdGF0ZWxlc3MgZnJvbSAnc3RhdGVsZXNzJ1xuXG52YXIgQ29udmVydGVyID0gU3RhdGVsZXNzLmV4dGVuZCgpXG5cbi8qKlxuICogSW5pdGlhbGl6ZXMgQ29udmVydGVyJ3Mgc3RhdGUuIElzIGNhbGxlZCBvbiBjcmVhdGUoKVxuICovXG5cbkNvbnZlcnRlci5pbml0ID0gZnVuY3Rpb24gaW5pdCAoY29sb3Jfc3BhY2VzKSB7XG4gIHRoaXMuc3BhY2VzID0gY29sb3Jfc3BhY2VzXG59XG5cbi8qKlxuICogQ29udmVydHMgPGNvbG9yPiB0byBhIHRhcmdldCBjb2xvciBzcGFjZVxuICovXG5cbkNvbnZlcnRlci5jb252ZXJ0ID0gZnVuY3Rpb24gY29udmVydCAoY29sb3IsIHRhcmdldF9uYW1lKSB7XG4gIHZhciBjdXJyZW50X25hbWUgPSBjb2xvci5zcGFjZVxuICBpZiAoY3VycmVudF9uYW1lID09PSB0YXJnZXRfbmFtZSkgcmV0dXJuIGNvbG9yO1xuXG4gIGlmICghdGhpcy5zcGFjZXMuaGFzKGN1cnJlbnRfbmFtZSkpIHRocm93IG5ldyBFcnJvcignY291bGQgbm90IGZpbmQgdGhlICcgKyBjdXJyZW50X25hbWUgKyAnIGNvbG9yIHNwYWNlJyk7XG4gIGlmICghdGhpcy5zcGFjZXMuaGFzKHRhcmdldF9uYW1lKSkgdGhyb3cgbmV3IEVycm9yKCdjb3VsZCBub3QgZmluZCB0aGUgJyArIHRhcmdldF9uYW1lICsgJyBjb2xvciBzcGFjZScpO1xuXG4gIHZhciBjb252ZXJzaW9uID0gY29sb3IuY29udmVyc2lvbnMuZmluZCh0YXJnZXRfbmFtZSlcbiAgLy8gVGVzdCB0byBzZWUgaWYgdGhlIGN1cnJlbnQgc3BhY2Uga25vd3MgaG93IHRvIGNvbnZlcnQgdG8gdGFyZ2V0XG5cbiAgaWYgKHR5cGVvZiBjb252ZXJzaW9uID09PSAnZnVuY3Rpb24nKSB7XG4gICAgcmV0dXJuIHRoaXMuYXBwbHlDb252ZXJzaW9uKGNvbG9yLCB0YXJnZXRfbmFtZSlcbiAgLy8gaWYgdGhlIGNvbnZlcnNpb24gaXMgYSBhbm90aGVyIGNvbG9yIHNwYWNlXG4gIH0gZWxzZSBpZiAodHlwZW9mIGNvbnZlcnNpb24gPT09ICdzdHJpbmcnKSB7XG4gICAgdmFyIG5leHRfY29sb3IgPSB0aGlzLmFwcGx5Q29udmVyc2lvbihjb2xvciwgY29udmVyc2lvbilcbiAgICByZXR1cm4gdGhpcy5jb252ZXJ0KG5leHRfY29sb3IsIHRhcmdldF9uYW1lKVxuICB9IGVsc2Uge1xuICAgIC8vIGF0dGVtcHQgdG8gZmluZCBwYXRoXG4gICAgdmFyIG5leHRfc3BhY2UgPSB0aGlzLm1hcENvbnZlcnNpb25QYXRoKGN1cnJlbnRfbmFtZSwgdGFyZ2V0X25hbWUpXG5cbiAgICAvLyBpZiB3ZSBmaW5kIHRoZSBwYXRoIGJlZ2luIHN0ZXBwaW5nIGRvd24gaXRcbiAgICBpZiAobmV4dF9zcGFjZSkgcmV0dXJuIHRoaXMuY29udmVydChjb2xvciwgdGFyZ2V0X25hbWUpO1xuXG4gICAgLy8gZWxzZSB0aHJvdyBhbiBlcnJvclxuICAgIGVsc2UgdGhyb3cgbmV3IEVycm9yKCdBbGNoZW1pc3QgZG9lcyBub3Qga25vdyBob3cgdG8gY29udmVydCBmcm9tICcgKyBjdXJyZW50X25hbWUgKyAnIHRvICcgKyB0YXJnZXRfbmFtZSlcbiAgfVxufVxuXG4vKipcbiAqIEZpbmRzIHRoZSB0YXJnZXQgY29sb3Igc3BhY2UgdW5kZXIgdGhlIDxjb2xvcj4ncyBjb252ZXJzaW9ucywgYXBwbGllc1xuICogdGhhdCBjb252ZXJzaW9uLCBhbmQgcmV0dXJucyBhIG5ldyBjb2xvci5cbiAqL1xuXG5Db252ZXJ0ZXIuYXBwbHlDb252ZXJzaW9uID0gZnVuY3Rpb24gYXBwbHlDb252ZXJzaW9uIChjb2xvciwgdGFyZ2V0X25hbWUpIHtcbiAgdmFyIHZhbHVlLCBuZXdfY29sb3I7XG4gIHZhciBjb252ZXJzaW9uID0gY29sb3IuY29udmVyc2lvbnMuZmluZCh0YXJnZXRfbmFtZSlcbiAgaWYgKHR5cGVvZiBjb252ZXJzaW9uICE9PSAnZnVuY3Rpb24nKSB0aHJvdyBuZXcgVHlwZUVycm9yKCdleHBlY3RlZCAnICsgY29udmVyc2lvbiArICcgdG8gYmUgYSBmdW5jdGlvbiBidXQgaW5zdGVhZCB3YXMgYSAnICsgdHlwZW9mIGNvbnZlcnNpb24pO1xuXG4gIGlmIChjb2xvci52YWx1ZSA9PT0gbnVsbCkge1xuICAgIHZhbHVlID0gY29sb3IudmFsdWVcbiAgfSBlbHNlIGlmIChoZWxwZXJzLmlzQXJyYXkoY29sb3IudmFsdWUpKSB7XG4gICAgdmFsdWUgPSBjb252ZXJzaW9uLmFwcGx5KGNvbG9yLCBoZWxwZXJzLmNsb25lKGNvbG9yLnZhbHVlKSk7XG4gIH0gZWxzZSB7XG4gICAgdmFsdWUgPSBjb252ZXJzaW9uLmNhbGwoY29sb3IsIGhlbHBlcnMuY2xvbmUoY29sb3IudmFsdWUpKVxuICB9XG5cbiAgbmV3X2NvbG9yID0gdGhpcy5zcGFjZXMuZmluZCh0YXJnZXRfbmFtZSkuY3JlYXRlKHZhbHVlKVxuXG4gIHJldHVybiBuZXdfY29sb3Jcbn1cblxuLyoqXG4gKiBMZWF2ZXMgYSB0cmFpbCBvZiBcImNvbnZlcnNpb24gcG9pbnRlcnNcIiB0aGF0IGNvbnZlcnQoKSBjYW4gZm9sbG93IGZyb20gb25lXG4gKiBjb2xvciBzcGFjZSB0byBhIHRhcmdldCBjb2xvciBzcGFjZVxuICpcbiAqIEEgXCJwb2ludGVyXCIgaXMganVzdCBhIHN0cmluZyB0aGF0IHRlbGxzIGNvbnZlcnQoKSB3aGF0IGNvbG9yIHNwYWNlIHRvIGNvbnZlcnRcbiAqIHRvIG5leHQgdG8gZ2V0IG9uZSBzdGVwIGNsb3NlciB0byB0aGUgdGFyZ2V0IHNwYWNlXG4gKi9cblxuQ29udmVydGVyLm1hcENvbnZlcnNpb25QYXRoID0gZnVuY3Rpb24gbWFwQ29udmVyc2lvblBhdGggKGN1cnJlbnRfbmFtZSwgdGFyZ2V0X25hbWUpIHtcbiAgdmFyIGNvbnZlcnNpb25cbiAgLy8gSXMgdGhlcmUgYSBwYXRoP1xuICB2YXIgcGFyZW50cyA9IHRoaXMuZmluZENvbnZlcnNpb25QYXRoKGN1cnJlbnRfbmFtZSwgdGFyZ2V0X25hbWUpXG4gIC8vIGlmIG5vdCByZXR1cm4gbnVsbFxuICBpZiAoIXBhcmVudHMpIHJldHVybiBudWxsO1xuXG4gIHZhciBuZXh0X3NwYWNlID0gcGFyZW50c1t0YXJnZXRfbmFtZV1cbiAgdmFyIHNwYWNlID0gcGFyZW50c1tuZXh0X3NwYWNlXVxuXG4gIHZhciBzdGVwc190YWtlbiA9IDBcblxuICAvLyBzdGVwIGJhY2t3YXJkcyB0aHJvdWdoIHRoZSBwYXJlbnQgYXJyYXkgYW5kIGxlYXZlIFwibmV4dCBzdGVwXCIgaW5zdHJ1Y3Rpb25zIGFsb25nIHRoZSB3YXlcbiAgd2hpbGUgKHN0ZXBzX3Rha2VuIDwgMTAwKSB7XG4gICAgY29udmVyc2lvbiA9IHRoaXMuc3BhY2VzLmZpbmQoc3BhY2UpLmNvbnZlcnNpb25zLmZpbmQodGFyZ2V0X25hbWUpXG5cbiAgICBpZiAoIWNvbnZlcnNpb24pIHtcbiAgICAgIHRoaXMuc3BhY2VzLmZpbmQoc3BhY2UpLmNvbnZlcnNpb25zLmFkZCh0YXJnZXRfbmFtZSwgbmV4dF9zcGFjZSlcbiAgICB9XG5cbiAgICAvLyBpZiB3ZSdyZSBmaW5pc2hlZCBtYXBwaW5nLCBnbyBhaGVhZCBhbmQgdGVsbCB1cyBob3cgdG8gc3RhcnQgdGhlIGNvbnZlcnNpb25cbiAgICBpZiAoc3BhY2UgPT09IGN1cnJlbnRfbmFtZSkgcmV0dXJuIG5leHRfc3BhY2U7XG4gICAgZWxzZSBpZiAoIXBhcmVudHNbc3BhY2VdKSByZXR1cm4gbnVsbDtcblxuICAgIC8vIHRha2UgYSBzdGVwIGJhY2t3YXJkc1xuICAgIG5leHRfc3BhY2UgPSBzcGFjZVxuICAgIHNwYWNlID0gcGFyZW50c1tzcGFjZV1cbiAgICBzdGVwc190YWtlbisrXG4gIH1cblxuICB0aHJvdyBuZXcgRXJyb3IoJ3NvbWV0aGluZyB3ZW50IHdyb25nIHdoaWxlIG1hcHBpbmcgdGhlIHBhdGggZnJvbScgKyBjdXJyZW50X25hbWUgKyAnIHRvICcgKyB0YXJnZXRfbmFtZSlcbn1cblxuLyoqXG4gKiBTZWFyY2hlcyBhbGwgY29udmVyc2lvbnMgdG8gZmluZCB0aGUgcXVpY2tlc3QgcGF0aCBiZXR3ZWVuIHR3byBjb2xvciBzcGFjZXMuXG4gKiBSZXR1cm5zIGFuIGFycmF5IG9mIHBhcmVudDpjaGlsZCByZWxhdGlvbnNoaXBzIHRoYXQgY2FuIGJlIHdhbGtlZCBiYWNrd2FyZHNcbiAqIHRvIGdldCB0aGUgcGF0aFxuICovXG5cbkNvbnZlcnRlci5maW5kQ29udmVyc2lvblBhdGggPSBmdW5jdGlvbiBmaW5kQ29udmVyc2lvblBhdGggKGN1cnJlbnRfbmFtZSwgdGFyZ2V0X25hbWUpIHtcbiAgdmFyIFEgPSBbXVxuICB2YXIgZXhwbG9yZWQgPSBbXVxuICB2YXIgcGFyZW50ID0ge31cbiAgUS5wdXNoKGN1cnJlbnRfbmFtZSlcbiAgZXhwbG9yZWQucHVzaChjdXJyZW50X25hbWUpXG5cbiAgd2hpbGUgKFEubGVuZ3RoKSB7XG4gICAgdmFyIHNwYWNlID0gUS5wb3AoKVxuICAgIGlmIChzcGFjZSA9PT0gdGFyZ2V0X25hbWUpIHtcbiAgICAgIHJldHVybiBwYXJlbnRcbiAgICB9XG4gICAgdmFyIG5laWdoYm9ycyA9IHRoaXMuc3BhY2VzLmZpbmROZWlnaGJvcnMoc3BhY2UpXG5cbiAgICAvLyBmb3IgZWFjaCBuZWlnaGJvclxuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgbmVpZ2hib3JzLmxlbmd0aDsgaSsrKSB7XG4gICAgICB2YXIgbmVpZ2hib3IgPSBuZWlnaGJvcnNbaV1cblxuICAgICAgLy8gaWYgdGhpcyBuZWlnaGJvciBoYXNuJ3QgYmVlbiBleHBsb3JlZCB5ZXRcbiAgICAgIGlmIChleHBsb3JlZC5pbmRleE9mKG5laWdoYm9yKSA9PT0gLTEpIHtcbiAgICAgICAgcGFyZW50W25laWdoYm9yXSA9IHNwYWNlXG4gICAgICAgIGV4cGxvcmVkLnB1c2gobmVpZ2hib3IpXG4gICAgICAgIFEucHVzaChuZWlnaGJvcilcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICByZXR1cm4gbnVsbFxufVxuXG5leHBvcnQgZGVmYXVsdCBDb252ZXJ0ZXJcblxuXG5cbi8qKiBXRUJQQUNLIEZPT1RFUiAqKlxuICoqIC4vbGliL2NvbnZlcnRlci5qc1xuICoqLyIsImltcG9ydCAqIGFzIF8gZnJvbSAnLi9oZWxwZXJzJ1xuaW1wb3J0IFN0YXRlbGVzcyBmcm9tICdzdGF0ZWxlc3MnXG5cbnZhciBMaW1pdGVyID0gU3RhdGVsZXNzLmV4dGVuZCgpXG5cbkxpbWl0ZXIuaW5pdCA9IGZ1bmN0aW9uIGluaXQgKG1pbiwgbWF4LCBoYW5kbGVyKSB7XG4gIGlmIChtaW4pIHRoaXMubWluID0gbWluXG4gIGlmIChtYXgpIHRoaXMubWF4ID0gbWF4XG4gIGlmIChoYW5kbGVyKSB0aGlzLmhhbmRsZXIgPSBoYW5kbGVyXG59XG5cbi8qKlxuICogQ2hlY2sgd2hldGhlciBhIHZhbHVlIHNldCBicmVha3MgdGhlIHByb3ZpZGVkIGxpbWl0c1xuICovXG5cbkxpbWl0ZXIuY2hlY2sgPSBmdW5jdGlvbiBjaGVjayAodmFsdWVzKSB7XG4gIHZhbHVlcyA9IHRoaXMuY2hlY2tCb3VuZGFyeSgnbWluJywgdmFsdWVzKVxuICB2YWx1ZXMgPSB0aGlzLmNoZWNrQm91bmRhcnkoJ21heCcsIHZhbHVlcylcbiAgcmV0dXJuIHZhbHVlc1xufVxuXG4vKipcbiAqIENoZWNrcyBvbmUgc2lkZSBvZiB0aGUgcHJvdmlkZWQgbGltaXRzIChlaXRoZXIgJ21heCcgb3IgJ21pbicpIGFuZCByZXR1cm5zIHRoZVxuICogcmVzdWx0aW5nIHZhbHVlcyAob3IgdGhyb3dzIGFuIGVycm9yIGluIHRoZSBjYXNlIG9mICdzdHJpY3QnKVxuICovXG5cbkxpbWl0ZXIuY2hlY2tCb3VuZGFyeSA9IGZ1bmN0aW9uIChib3VuZGFyeSwgdmFsdWVzKSB7XG4gIHZhciBsaW1pdHMgPSB0aGlzW2JvdW5kYXJ5XVxuICBpZiAoIXZhbHVlcyB8fCAhbGltaXRzIHx8IHRoaXMuaGFuZGxlciA9PT0gJ3JhdycpIHJldHVybiB2YWx1ZXM7XG5cbiAgXy5lYWNoKGxpbWl0cywgZnVuY3Rpb24gKGxpbWl0LCBpKSB7XG4gICAgaWYgKHRoaXMuYnJlYWtzKGxpbWl0LCB2YWx1ZXNbaV0sIGJvdW5kYXJ5KSkge1xuICAgICAgaWYgKHRoaXMuaGFuZGxlciA9PT0gJ2NsaXAnKSB7XG4gICAgICAgIHZhbHVlc1tpXSA9IGxpbWl0XG4gICAgICB9IGVsc2UgaWYgKHRoaXMuaGFuZGxlciA9PT0gJ251bGxpZnknKSB7XG4gICAgICAgIHZhbHVlcyA9IG51bGxcbiAgICAgICAgcmV0dXJuIHZhbHVlc1xuICAgICAgfSBlbHNlIGlmICh0aGlzLmhhbmRsZXIgPT09ICdzdHJpY3QnKSB7XG4gICAgICAgIHZhciBndF9vcl9sdCA9IHRoaXMuaGFuZGxlciA9PT0gJ21heCcgPyAnbGVzcycgOiAnZ3JlYXRlcidcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdFeHBlY3RlZCAnICsgdmFsdWVzW2ldICsgJyB0byBiZSAnICsgZ3Rfb3JfbHQgKyAnIHRoYW4gb3IgZXF1YWwgdG8gJyArIGxpbWl0KVxuICAgICAgfVxuICAgIH1cbiAgfSwgdGhpcylcbiAgcmV0dXJuIHZhbHVlc1xufVxuXG4vKipcbiAqIFJldHVybnMgdHJ1ZSBpZiA8dmFsdWU+IGJyZWFrcyBhIGdpdmVuIDxsaW1pdD5cbiAqL1xuXG5MaW1pdGVyLmJyZWFrcyA9IGZ1bmN0aW9uIGJyZWFrc0xpbWl0IChsaW1pdCwgdmFsdWUsIGJvdW5kYXJ5KSB7XG4gIGlmIChib3VuZGFyeSA9PT0gJ21heCcpIHtcbiAgICByZXR1cm4gdmFsdWUgPiBsaW1pdFxuICB9IGVsc2UgaWYgKGJvdW5kYXJ5ID09PSAnbWluJykge1xuICAgIHJldHVybiB2YWx1ZSA8IGxpbWl0XG4gIH1cbn1cblxuLyoqXG4gKiBNZXJnZXMgdHdvIExpbWl0ZXJzLiBBbHdheXMgcHJlZmVycyB0ZWggbWluL21heCBkZWZpbml0aW9ucyBvZiB0aGUgZm9yZWlnbiBzdG9yZVxuICovXG5cbkxpbWl0ZXIubWVyZ2UgPSBmdW5jdGlvbiBtZXJnZSAoZm9yZWlnbl9saW1pdGVyKSB7XG4gIGlmIChmb3JlaWduX2xpbWl0ZXIubWluICE9PSB1bmRlZmluZWQpIHRoaXMubWluID0gZm9yZWlnbl9saW1pdGVyLm1pblxuICBpZiAoZm9yZWlnbl9saW1pdGVyLm1heCAhPT0gdW5kZWZpbmVkKSB0aGlzLm1heCA9IGZvcmVpZ25fbGltaXRlci5tYXhcbn1cblxuZXhwb3J0IGRlZmF1bHQgTGltaXRlclxuXG5cblxuLyoqIFdFQlBBQ0sgRk9PVEVSICoqXG4gKiogLi9saWIvTGltaXRlci5qc1xuICoqLyJdLCJzb3VyY2VSb290IjoiIn0=