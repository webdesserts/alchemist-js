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
	
	  if (color_space === null) return neighbors;
	
	  var conversions = color_space.conversions;
	
	  conversions.each(function (conversion, target_name) {
	    var target_space = _this.find(target_name);
	    if (target_space && target_space.is_concrete) {
	      neighbors.push(target_name);
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
	  if (typeof conversion !== 'function') throw new TypeError('expected ' + conversion + ' to be a function');
	
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
	
	    if (!conversion || typeof conversion !== 'function') {
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAgMTFhNDY2YmVmYjI4YTdjYzBjM2MiLCJ3ZWJwYWNrOi8vLy4vYWxjaGVtaXN0LmpzIiwid2VicGFjazovLy9leHRlcm5hbCBcImFsY2hlbWlzdC1jb21tb25cIiIsIndlYnBhY2s6Ly8vLi9saWIvaW5kZXguanMiLCJ3ZWJwYWNrOi8vLy4vbGliL3BsdWdpbnMuanMiLCJ3ZWJwYWNrOi8vLy4vbGliL2NvbG9yU3BhY2VTdG9yZS5qcyIsIndlYnBhY2s6Ly8vLi9saWIvc3RvcmFnZS5qcyIsIndlYnBhY2s6Ly8vLi9saWIvaGVscGVycy5qcyIsIndlYnBhY2s6Ly8vZXh0ZXJuYWwgXCJzdGF0ZWxlc3NcIiIsIndlYnBhY2s6Ly8vLi9saWIvY29udmVyc2lvblN0b3JlLmpzIiwid2VicGFjazovLy8uL2xpYi9jb2xvci5qcyIsIndlYnBhY2s6Ly8vLi9saWIvY29udmVydGVyLmpzIiwid2VicGFjazovLy8uL2xpYi9MaW1pdGVyLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsdUJBQWU7QUFDZjtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7O0FBR0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7Ozs7Ozs7Ozs7Ozs7Ozs7OzRDQ3RDNkIsQ0FBa0I7Ozs7cUNBQ3pCLENBQWE7Ozs7QUFFbkMsdUJBQVUsR0FBRyw4QkFBa0I7O0FBRS9CLEtBQUksTUFBTSxHQUFHLFNBQVMsTUFBTSxHQUFJO0FBQzlCLHVDQUF1QjtFQUN4Qjs7QUFFRCx1QkFBVSxNQUFNLEdBQUcsTUFBTTs7QUFFekIsT0FBTSxDQUFDLE9BQU8sd0JBQVksQzs7Ozs7O0FDWDFCLDhDOzs7Ozs7Ozs7Ozs7Ozs7O29DQ0FvQixDQUFXOzs7O2tDQUNiLEVBQVM7Ozs7c0NBQ0ws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LE9BQUksZUFBZSxDQUFDLEdBQUcsS0FBSyxTQUFTLEVBQUUsSUFBSSxDQUFDLEdBQUcsR0FBRyxlQUFlLENBQUMsR0FBRztFQUN0RTs7c0JBRWMsT0FBTyIsImZpbGUiOiJhbGNoZW1pc3QuanMiLCJzb3VyY2VzQ29udGVudCI6WyIgXHQvLyBUaGUgbW9kdWxlIGNhY2hlXG4gXHR2YXIgaW5zdGFsbGVkTW9kdWxlcyA9IHt9O1xuXG4gXHQvLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuIFx0ZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXG4gXHRcdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuIFx0XHRpZihpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSlcbiBcdFx0XHRyZXR1cm4gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0uZXhwb3J0cztcblxuIFx0XHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuIFx0XHR2YXIgbW9kdWxlID0gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0gPSB7XG4gXHRcdFx0ZXhwb3J0czoge30sXG4gXHRcdFx0aWQ6IG1vZHVsZUlkLFxuIFx0XHRcdGxvYWRlZDogZmFsc2VcbiBcdFx0fTtcblxuIFx0XHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cbiBcdFx0bW9kdWxlc1ttb2R1bGVJZF0uY2FsbChtb2R1bGUuZXhwb3J0cywgbW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cbiBcdFx0Ly8gRmxhZyB0aGUgbW9kdWxlIGFzIGxvYWRlZFxuIFx0XHRtb2R1bGUubG9hZGVkID0gdHJ1ZTtcblxuIFx0XHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuIFx0XHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG4gXHR9XG5cblxuIFx0Ly8gZXhwb3NlIHRoZSBtb2R1bGVzIG9iamVjdCAoX193ZWJwYWNrX21vZHVsZXNfXylcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubSA9IG1vZHVsZXM7XG5cbiBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlIGNhY2hlXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmMgPSBpbnN0YWxsZWRNb2R1bGVzO1xuXG4gXHQvLyBfX3dlYnBhY2tfcHVibGljX3BhdGhfX1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5wID0gXCJcIjtcblxuIFx0Ly8gTG9hZCBlbnRyeSBtb2R1bGUgYW5kIHJldHVybiBleHBvcnRzXG4gXHRyZXR1cm4gX193ZWJwYWNrX3JlcXVpcmVfXygwKTtcblxuXG5cbi8qKiBXRUJQQUNLIEZPT1RFUiAqKlxuICoqIHdlYnBhY2svYm9vdHN0cmFwIDExYTQ2NmJlZmIyOGE3Y2MwYzNjXG4gKiovIiwiaW1wb3J0IGFsY2hlbWlzdF9jb21tb24gZnJvbSAnYWxjaGVtaXN0LWNvbW1vbidcbmltcG9ydCBhbGNoZW1pc3QgZnJvbSAnLi9saWIvaW5kZXgnXG5cbmFsY2hlbWlzdC51c2UoYWxjaGVtaXN0X2NvbW1vbilcblxudmFyIGNvbW1vbiA9IGZ1bmN0aW9uIGNvbW1vbiAoKSB7XG4gIHJldHVybiBhbGNoZW1pc3RfY29tbW9uXG59XG5cbmFsY2hlbWlzdC5jb21tb24gPSBjb21tb25cblxubW9kdWxlLmV4cG9ydHMgPSBhbGNoZW1pc3RcblxuXG5cbi8qKiBXRUJQQUNLIEZPT1RFUiAqKlxuICoqIC4vYWxjaGVtaXN0LmpzXG4gKiovIiwibW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKFwiYWxjaGVtaXN0LWNvbW1vblwiKTtcblxuXG4vKioqKioqKioqKioqKioqKipcbiAqKiBXRUJQQUNLIEZPT1RFUlxuICoqIGV4dGVybmFsIFwiYWxjaGVtaXN0LWNvbW1vblwiXG4gKiogbW9kdWxlIGlkID0gMlxuICoqIG1vZHVsZSBjaHVua3MgPSAwXG4gKiovIiwiaW1wb3J0IHBsdWdpbnMgZnJvbSAnLi9wbHVnaW5zJ1xuaW1wb3J0IENvbG9yIGZyb20gJy4vY29sb3InXG5pbXBvcnQgQ29udmVydGVyIGZyb20gJy4vY29udmVydGVyJ1xuaW1wb3J0IENvbG9yU3BhY2VTdG9yZSBmcm9tICcuL2NvbG9yU3BhY2VTdG9yZSdcbmltcG9ydCBMaW1pdGVyIGZyb20gJy4vTGltaXRlcidcbmltcG9ydCAqIGFzIGhlbHBlcnMgZnJvbSAnLi9oZWxwZXJzJ1xuaW1wb3J0IFN0YXRlbGVzcyBmcm9tICdzdGF0ZWxlc3MnXG5cbi8qKlxuICogQWxjaGVtaXN0LiBUaGlzIGlzIHRoZSBvYmplY3QgdGhhdCB3aWxsIGV2ZW50dWFsbHkgYmUgZXhwb3J0ZWQuXG4gKiBJdCBjYW4gYmUgdXNlZCBib3RoIGFzIGlzLCBhbmQgYXMgYSBjb25zdHJ1Y3RvciB3aXRoIC5jcmVhdGUoKVxuICovXG5cbnZhciBBbGNoZW1pc3QgPSBTdGF0ZWxlc3MuZXh0ZW5kKClcblxuLyoqXG4gKiBJbml0aWFsaXplIGFsbCBzdGF0ZSBvbiBBbGNoZW1pc3QuIElzIGNhbGxlZCBvbiBjcmVhdGUoKVxuICovXG5cbkFsY2hlbWlzdC5pbml0ID0gZnVuY3Rpb24gaW5pdCAob3B0aW9ucykge1xuICB2YXIgY29sb3Jfc3BhY2VzID0gQ29sb3JTcGFjZVN0b3JlLmNyZWF0ZSgpXG4gIG9wdGlvbnMgPSBvcHRpb25zIHx8IHt9XG4gIHRoaXMud2hpdGUgPSBvcHRpb25zLndoaXRlIHx8IHsgWDogMC45NTA0NywgWTogMSwgWjogMS4wODg4MyB9XG4gIHRoaXMuc3BhY2VzID0gY29sb3Jfc3BhY2VzXG4gIHRoaXMuQmFzZVNwYWNlID0gQ29sb3IuY3JlYXRlKHtcbiAgICBjb252ZXJ0ZXI6IENvbnZlcnRlci5jcmVhdGUoY29sb3Jfc3BhY2VzKSxcbiAgICBwcmVjaXNpb246IG9wdGlvbnMucHJlY2lzaW9uIHx8IDksXG4gICAgbGltaXRlcjogTGltaXRlci5jcmVhdGUobnVsbCwgbnVsbCwgb3B0aW9ucy5saW1pdHMgfHwgJ251bGxpZnknKVxuICB9KVxufVxuXG4vKipcbiAqIEludGVycHJldHMgdGhlIHR5cGUgb2YgcGx1Z2luIGl0IGlzIGFuZCBjYWxscyB0aGUgYXNzb2NpYXRlZCBwbHVnaW4gaW5zdGFsbGVyXG4gKiBpZiB0aGUgcGFzc2VkIG9iamVjdCBpcyBhbiBhcnJheSwgaXQgd2lsbCB0cnkgdG8gaW50ZXJwcmV0IGVhY2ggaXRlbSBpbiB0aGF0XG4gKiBhcnJheSBhcyBhIHBsdWdpbiwgZXNzZW50aWFsbHkgYWxsb3dpbmcgeW91IHRvIGNyZWF0ZSBwbHVnaW4gYnVuZGxlcy5cbiAqL1xuXG5BbGNoZW1pc3QudXNlID0gZnVuY3Rpb24gdXNlIChwbHVnaW4pIHtcbiAgaWYgKGhlbHBlcnMuaXNBcnJheShwbHVnaW4pKSB7XG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBwbHVnaW4ubGVuZ3RoOyBpKyspIHtcbiAgICAgIHRoaXMudXNlKHBsdWdpbltpXSlcbiAgICB9XG4gIH0gZWxzZSB7XG4gICAgaWYgKHR5cGVvZiBwbHVnaW4gPT09ICdmdW5jdGlvbicpIHBsdWdpbiA9IHBsdWdpbi5jYWxsKHRoaXMsIHRoaXMpXG4gICAgc3dpdGNoIChwbHVnaW5zLmlkZW50aWZ5KHBsdWdpbikpIHtcbiAgICAgIGNhc2UgJ3NwYWNlJzogdGhpcy5hdHRhY2hDb2xvclNwYWNlKHBsdWdpbik7IGJyZWFrXG4gICAgICBjYXNlICdtZXRob2QnOiB0aGlzLmF0dGFjaENvbG9yTWV0aG9kKHBsdWdpbik7IGJyZWFrXG4gICAgfVxuICB9XG59XG5cbi8qKlxuICogU3RvcmVzIGEgdmFsaWQgY29sb3JzcGFjZSA8cGx1Z2luPiBhbmQgY3JlYXRlcyBpdCdzIG1ldGhvZHNcbiAqL1xuXG5BbGNoZW1pc3QuYXR0YWNoQ29sb3JTcGFjZSA9IGZ1bmN0aW9uIGF0dGFjaENvbG9yU3BhY2UgKHBsdWdpbikge1xuICB2YXIgZXhpc3RpbmdfcGx1Z2luID0gdGhpcy5zcGFjZXMuZmluZChwbHVnaW4ubmFtZSlcbiAgaWYgKGV4aXN0aW5nX3BsdWdpbiAmJiBleGlzdGluZ19wbHVnaW4uaXNfY29uY3JldGUpXG4gICAgdGhyb3cgbmV3IEVycm9yKCdUaGUgXCInICsgcGx1Z2luLm5hbWUgKyAnXCIgcGx1Z2luIGFscmVhZHkgZXhpc3RzJylcbiAgdmFyIHBsdWdpbl9zcGFjZXMgPSBwbHVnaW5zLnNlcmlhbGl6ZUNvbG9yU3BhY2UocGx1Z2luLCB0aGlzLkJhc2VTcGFjZSlcbiAgdGhpcy5zcGFjZXMubWVyZ2UocGx1Z2luX3NwYWNlcylcbiAgdGhpcy5zcGFjZXMuZWFjaCgoY29sb3Jfc3BhY2UpID0+IHtcbiAgICBpZiAoY29sb3Jfc3BhY2UuaXNfY29uY3JldGUpIHtcbiAgICAgIHRoaXMubWFrZUNvbnN0cnVjdG9yTWV0aG9kKGNvbG9yX3NwYWNlKVxuICAgICAgdGhpcy5tYWtlQ29udmVyc2lvbk1ldGhvZChjb2xvcl9zcGFjZSlcbiAgICB9XG4gIH0pXG59XG5cbi8qKlxuICogQXR0YWNoZXMgdGhlIG1ldGhvZHMgZm9yIGEgdmFsaWQgbWV0aG9kIDxwbHVnaW4+XG4gKi9cblxuQWxjaGVtaXN0LmF0dGFjaENvbG9yTWV0aG9kID0gZnVuY3Rpb24gKHBsdWdpbikge1xuICBpZiAocGx1Z2luLm1ldGhvZHMuY29sb3IgJiYgdGhpcy5CYXNlU3BhY2VbcGx1Z2luLm5hbWVdKSB0aHJvdyBuZXcgRXJyb3IoJ1RoZSBtZXRob2QgbmFtZSBcIicgKyBwbHVnaW4ubmFtZSArICdcIiBhbHJlYWR5IGV4aXN0cyBmb3IgY29sb3JzJyk7XG4gIGlmIChwbHVnaW4ubWV0aG9kcy5nbG9iYWwgJiYgdGhpc1twbHVnaW4ubmFtZV0pIHRocm93IG5ldyBFcnJvcignVGhlIG1ldGhvZCBuYW1lIFwiJyArIHBsdWdpbi5uYW1lICsgJ1wiIGFscmVhZHkgZXhpc3RzIG9uIGFsY2hlbWlzdCcpO1xuXG4gIGlmIChwbHVnaW4ubWV0aG9kcy5jb2xvcikge1xuICAgIHRoaXMuQmFzZVNwYWNlW3BsdWdpbi5uYW1lXSA9IHBsdWdpbi5tZXRob2RzLmNvbG9yXG4gIH1cbiAgaWYgKHBsdWdpbi5tZXRob2RzLmdsb2JhbCkge1xuICAgIHRoaXNbcGx1Z2luLm5hbWVdID0gcGx1Z2luLm1ldGhvZHMuZ2xvYmFsXG4gIH1cbn1cblxuLyoqXG4gKiBDcmVhdGVzIGEgQ29sb3IgY29uc3RydWN0b3IgbWV0aG9kIG9uIEFsY2hlbWlzdCBmb3IgdGhlIGdpdmVuIDxjb2xvcl9zcGFjZT4uXG4gKiBlLmcuIGFsY2hlbWlzdC5yZ2IoWzI1NSwgMjU1LCAyNTVdKVxuICpcbiAqIFRoaXMgZnVuY3Rpb24gd2lsbCByZXR1cm4gYSBuZXcgQ29sb3Igd2l0aCB0aGUgYXNzaWduZWQgdmFsdWVzLCBhbnlcbiAqIG5lY2Vzc2FyeSBjb25maWcsIGFuZCBhdHRhY2hlZCBjb252ZXJzaW9uIGZ1bmN0aW9ucy5cbiAqL1xuXG5BbGNoZW1pc3QubWFrZUNvbnN0cnVjdG9yTWV0aG9kID0gZnVuY3Rpb24gbWFrZUNvbnN0cnVjdG9yTWV0aG9kIChjb2xvcl9zcGFjZSkge1xuICB0aGlzW2NvbG9yX3NwYWNlLnNwYWNlXSA9IGZ1bmN0aW9uIGNyZWF0ZUNvbG9yICh2YWx1ZSkge1xuICAgIHZhciBjb2xvcl92YWx1ZTtcblxuICAgIGlmIChhcmd1bWVudHMubGVuZ3RoID4gMSkge1xuICAgICAgLy8gSSBoZWFyIHRoaXMgZGVvcHRpbWl6ZXMgdGhpbmdzLiBGaW5kIGEgd2F5IGFyb3VuZCBpZiBuZWNlc3NhcnkuXG4gICAgICBjb2xvcl92YWx1ZSA9IEFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKGFyZ3VtZW50cylcbiAgICB9IGVsc2Uge1xuICAgICAgY29sb3JfdmFsdWUgPSB2YWx1ZVxuICAgIH1cblxuICAgIHJldHVybiBjb2xvcl9zcGFjZS5jcmVhdGUoY29sb3JfdmFsdWUpXG4gIH1cbn1cblxuLyoqXG4gKiBDcmVhdGVzIGEgbWV0aG9kIG9uIHRoZSBCYXNlU3BhY2UgdGhhdCBjYW4gYmUgdXNlZCB0byBjb252ZXJ0IGRpcmVjdGx5IHRvIHRoZVxuICogZ2l2ZW4gPGNvbG9yX3NwYWNlPlxuICovXG5cbkFsY2hlbWlzdC5tYWtlQ29udmVyc2lvbk1ldGhvZCA9IGZ1bmN0aW9uIG1ha2VDb252ZXJzaW9uTWV0aG9kIChjb2xvcl9zcGFjZSkge1xuICB0aGlzLkJhc2VTcGFjZVtjb2xvcl9zcGFjZS5zcGFjZV0gPSBmdW5jdGlvbiBjb252ZXJ0VG8gKG9wdGlvbnMpIHtcbiAgICByZXR1cm4gdGhpcy50byhjb2xvcl9zcGFjZS5zcGFjZSwgb3B0aW9ucylcbiAgfVxufVxuXG5BbGNoZW1pc3QuaW5pdCgpXG5cbi8vIGV4cG9ydCBBbGNoZW1pc3QhXG5leHBvcnQgZGVmYXVsdCBBbGNoZW1pc3RcblxuXG5cbi8qKiBXRUJQQUNLIEZPT1RFUiAqKlxuICoqIC4vbGliL2luZGV4LmpzXG4gKiovIiwiaW1wb3J0IENvbG9yU3BhY2VTdG9yZSBmcm9tICcuL2NvbG9yU3BhY2VTdG9yZSdcbmltcG9ydCBDb252ZXJzaW9uU3RvcmUgZnJvbSAnLi9jb252ZXJzaW9uU3RvcmUnXG5pbXBvcnQgKiBhcyBoZWxwZXJzIGZyb20gJy4vaGVscGVycydcblxudmFyIHBsdWdpbnMgPSB7fVxuXG4vKipcbiAqIElkZW50aWZpZXMgdGhlIHR5cGUgb2YgcGx1Z2luIHBhc3NlZC4gSWYgdHlwZSgpIGNhbid0IGlkZW50aWZ5IHRoZSA8cGx1Z2luPlxuICogaXQgdGhyb3dzIGFuIGVycm9yLlxuICovXG5cbnBsdWdpbnMuaWRlbnRpZnkgPSBmdW5jdGlvbiBpZGVudGlmeSAocGx1Z2luKSB7XG4gIHRoaXMudmFsaWRhdGVQbHVnaW4ocGx1Z2luKVxuICBpZiAocGx1Z2luLnRvIHx8IHBsdWdpbi5mcm9tKSB7XG4gICAgdGhpcy52YWxpZGF0ZUNvbG9yU3BhY2VQbHVnaW4ocGx1Z2luKVxuICAgIHJldHVybiAnc3BhY2UnXG4gIH0gZWxzZSBpZiAocGx1Z2luLm1ldGhvZHMpIHtcbiAgICB0aGlzLnZhbGlkYXRlTWV0aG9kUGx1Z2luKHBsdWdpbilcbiAgICByZXR1cm4gJ21ldGhvZCdcbiAgfSBlbHNlIHRocm93IG5ldyBFcnJvcignVW5yZWNvZ25pemVkIHBsdWdpbiBmb3JtYXQnKTtcbn1cblxuLyoqXG4gKiBWYWxpZGF0ZXMgYW55IGdlbmVyaWMgcGx1Z2luXG4gKi9cblxucGx1Z2lucy52YWxpZGF0ZVBsdWdpbiA9IGZ1bmN0aW9uIHZhbGlkYXRlUGx1Z2luIChwbHVnaW4pIHtcbiAgaWYgKCFoZWxwZXJzLmlzT2JqZWN0KHBsdWdpbikpIHRocm93IG5ldyBFcnJvcignRXhwZWN0ZWQgcGx1Z2luIHRvIGJlIGFuIG9iamVjdDsgaW5zdGVhZCBnb3Q6ICcgKyBwbHVnaW4pO1xuICBpZiAoIWhlbHBlcnMuaXNTdHJpbmcocGx1Z2luLm5hbWUpKSB0aHJvdyBuZXcgRXJyb3IoJ0V4cGVjdCBwbGd1aW4ubmFtZSB0byBiZSBhIHN0cmluZzsgaW5zdGVhZCBnb3Q6ICcgKyBwbHVnaW4ubmFtZSlcbn1cblxuLyoqXG4gKiBWYWxpZGF0ZXMgYSBjb2xvcnNwYWNlLXBsdWdpblxuICovXG5cbnBsdWdpbnMudmFsaWRhdGVDb2xvclNwYWNlUGx1Z2luID0gZnVuY3Rpb24gdmFsaWRhdGVDb2xvclNwYWNlUGx1Z2luIChwbHVnaW4pIHtcbiAgaWYgKCEocGx1Z2luLnRvIHx8IHBsdWdpbi5mcm9tKSkgdGhyb3cgbmV3IEVycm9yKCdDb252ZXJzaW9ucyB3ZXJlIG5vdCBkZWZpbmVkIGZvciB0aGUgXCInICsgcGx1Z2luLm5hbWUgKyAnXCIgY29sb3JzcGFjZSBwbHVnaW4nKTtcbn1cblxuLyoqXG4gKiBWYWxpZGF0ZXMgYSBtZXRob2QtcGx1Z2luXG4gKi9cblxucGx1Z2lucy52YWxpZGF0ZU1ldGhvZFBsdWdpbiA9IGZ1bmN0aW9uIHZhbGlkYXRlTWV0aG9kUGx1Z2luIChwbHVnaW4pIHtcbiAgaWYgKCEocGx1Z2luLm1ldGhvZHMuY29sb3IgfHwgcGx1Z2luLm1ldGhvZHMuZ2xvYmFsKSkgdGhyb3cgbmV3IEVycm9yKCdNaXNzaW5nIG1ldGhvZHMgZm9yIG1ldGhvZCBwbHVnaW4nKTtcbiAgaWYgKHBsdWdpbi5tZXRob2RzLmNvbG9yICYmICFoZWxwZXJzLmlzRnVuY3Rpb24ocGx1Z2luLm1ldGhvZHMuY29sb3IpKSB0aHJvdyBuZXcgRXJyb3IoJ0V4cGVjdGVkIGNvbG9yIG1ldGhvZCB0byBiZSBhIGZ1bmN0aW9uOyBpbnN0ZWFkIGdvdCAnICsgcGx1Z2luLm1ldGhvZHMuY29sb3IpO1xuICBpZiAocGx1Z2luLm1ldGhvZHMuZ2xvYmFsICYmICFoZWxwZXJzLmlzRnVuY3Rpb24ocGx1Z2luLm1ldGhvZHMuZ2xvYmFsKSkgdGhyb3cgbmV3IEVycm9yKCdFeHBlY3RlZCBjb2xvciBtZXRob2QgdG8gYmUgYSBmdW5jdGlvbjsgaW5zdGVhZCBnb3QgJyArIHBsdWdpbi5tZXRob2RzLmNvbG9yKTtcbn1cblxuLyoqXG4gKiBDb252ZXJ0cyBhIGNvbG9yc3BhY2UgcGx1Z2luIGludG8gYSB1c2FibGUgQ29sb3JTcGFjZVN0b3JlIHRoYXQgY2FuIGJlIG1lcmdlZFxuICogd2l0aCB0aGUgbWFpbiBzdG9yZS5cbiAqXG4gKiBBbGwgY29udmVyc2lvbnMgZGVmaW5lZCBpbiB0aGUgXCJ0b1wiIG9iamVjdCB3aWxsIGJlIGFkZGVkIHVuZGVyIHRoZSBtYWluXG4gKiBjb2xvcnNwYWNlLiBBbiBhYnN0cmFjdCBjb2xvcnNwYWNlIGlzIGNyZWF0ZWQgZm9yIGVhY2ggY29udmVyc2lvbiBpbiB0aGVcbiAqIFwiZnJvbVwiIG9iamVjdC5cbiAqL1xuXG5wbHVnaW5zLnNlcmlhbGl6ZUNvbG9yU3BhY2UgPSBmdW5jdGlvbiBzZXJpYWxpemVDb2xvclNwYWNlIChwbHVnaW4sIEJhc2VTcGFjZSkge1xuICB2YXIgcmVzdWx0cywgY29sb3Jfc3BhY2UsIGFic3RyYWN0X3NwYWNlLCBjb252ZXJzaW9uO1xuXG4gIGlmICghaGVscGVycy5pc1N0cmluZyhwbHVnaW4ubmFtZSkpIHRocm93IG5ldyBFcnJvcignY29sb3Itc3BhY2UgcGx1Z2luIGlzIG1pc3NpbmcgYSBuYW1lJylcblxuICByZXN1bHRzID0gQ29sb3JTcGFjZVN0b3JlLmNyZWF0ZSgpXG4gIGNvbG9yX3NwYWNlID0gQmFzZVNwYWNlLmNyZWF0ZSh7XG4gICAgc3BhY2U6IHBsdWdpbi5uYW1lLFxuICAgIGNvbnZlcnNpb25zOiBDb252ZXJzaW9uU3RvcmUuY3JlYXRlKClcbiAgfSlcblxuICBpZiAoQmFzZVNwYWNlLmxpbWl0cyAmJiBwbHVnaW4ubGltaXRzKSB7XG4gICAgY29sb3Jfc3BhY2UubGltaXRzID0gQmFzZVNwYWNlLmxpbWl0cy5jcmVhdGUocGx1Z2luLmxpbWl0cy5taW4sIHBsdWdpbi5saW1pdHMubWF4KVxuICB9XG5cbiAgcmVzdWx0cy5hZGQoY29sb3Jfc3BhY2UpXG5cbiAgZm9yICh2YXIgZGVzdF9uYW1lIGluIHBsdWdpbi50bykge1xuICAgIGNvbnZlcnNpb24gPSBwbHVnaW4udG9bZGVzdF9uYW1lXVxuICAgIGlmICh0eXBlb2YgY29udmVyc2lvbiAhPT0gJ2Z1bmN0aW9uJykgdGhyb3cgbmV3IEVycm9yKCdleHBlY3RlZCAnICsgY29udmVyc2lvbiArICcgdG8gYmUgYSBmdW5jdGlvbicpO1xuICAgIGNvbG9yX3NwYWNlLmNvbnZlcnNpb25zLmFkZChkZXN0X25hbWUsIHBsdWdpbi50b1tkZXN0X25hbWVdKVxuICB9XG5cbiAgZm9yICh2YXIgc3JjX25hbWUgaW4gcGx1Z2luLmZyb20pIHtcbiAgICBjb252ZXJzaW9uID0gcGx1Z2luLmZyb21bc3JjX25hbWVdXG4gICAgaWYgKHR5cGVvZiBjb252ZXJzaW9uICE9PSAnZnVuY3Rpb24nKSB0aHJvdyBuZXcgRXJyb3IoJ2V4cGVjdGVkICcgKyBjb252ZXJzaW9uICsgJyB0byBiZSBhIGZ1bmN0aW9uJyk7XG4gICAgYWJzdHJhY3Rfc3BhY2UgPSBCYXNlU3BhY2UuY3JlYXRlKHtcbiAgICAgIHNwYWNlOiBzcmNfbmFtZSxcbiAgICAgIGFic3RyYWN0OiB0cnVlLFxuICAgICAgY29udmVyc2lvbnM6IENvbnZlcnNpb25TdG9yZS5jcmVhdGUoKVxuICAgIH0pXG5cbiAgICBhYnN0cmFjdF9zcGFjZS5jb252ZXJzaW9ucy5hZGQocGx1Z2luLm5hbWUsIHBsdWdpbi5mcm9tW3NyY19uYW1lXSlcbiAgICByZXN1bHRzLmFkZChhYnN0cmFjdF9zcGFjZSlcbiAgfVxuXG4gIHJldHVybiByZXN1bHRzXG59XG5cbmV4cG9ydCBkZWZhdWx0IHBsdWdpbnNcblxuXG5cbi8qKiBXRUJQQUNLIEZPT1RFUiAqKlxuICoqIC4vbGliL3BsdWdpbnMuanNcbiAqKi8iLCJpbXBvcnQgU3RvcmFnZSBmcm9tICcuL3N0b3JhZ2UnXG5cbi8qKlxuICogU3RvcmVzIGEgc2V0IG9mIENvbG9yU3BhY2VzXG4gKlxuICogQSBcIkNvbG9yU3BhY2VcIiBpcyBhIHBhcnRpYWxseSBjb21wbGV0ZSBDb2xvciBjb250YWluaW5nIGEgdHlwZSwgYSBjb252ZXJ0ZXIsXG4gKiBhbmQgYSBzZXQgb2YgY29udmVyc2lvbnMuIFRoZSBjb252ZXJ0ZXIgaXMgcHJlZmVyYWJseSBpbmhlcml0ZWQgZnJvbSBhXG4gKiBCYXNlU3BhY2UuIEZvciBtb3JlIGluZm8gc2VlIHRoZSBkZXNjcmlwdGlvbiBmb3IgQ29sb3IuXG4gKi9cblxudmFyIENvbG9yU3BhY2VTdG9yZSA9IFN0b3JhZ2UuZXh0ZW5kKClcblxuLyoqXG4gKiBBZGRzIGEgQ29sb3JTcGFjZSB0byB0aGUgc3RvcmUuIFRocm93cyBhbiBFcnJvciBpZiB0aGUgQ29sb3JTcGFjZSBhbHJlYWR5XG4gKiBleGlzdHMuXG4gKi9cblxuQ29sb3JTcGFjZVN0b3JlLmFkZCA9IGZ1bmN0aW9uIChjb2xvcl9zcGFjZSkge1xuICB2YXIgcHJvdG8gPSBPYmplY3QuZ2V0UHJvdG90eXBlT2YoQ29sb3JTcGFjZVN0b3JlKVxuICBwcm90by5hZGQuY2FsbCh0aGlzLCBjb2xvcl9zcGFjZS5zcGFjZSwgY29sb3Jfc3BhY2UpXG59XG5cbi8qKlxuICogUmV0dXJucyBhbiBhcnJheSBvZiBhZGphY2VudCBjb252ZXJ0YWJsZSBDb2xvclNwYWNlcy5cbiAqXG4gKiBJdCBkb2VzIHRoaXMgYnkgY29tcGFyaW5nIHRoZSBhdmFpbGFibGUgY29udmVyc2lvbnMgb24gYSBjb2xvciBzcGFjZVxuICogdG8gdGhlIGNvbG9yIHNwYWNlcyB3aXRoaW4gdGhlIENvbG9yU3BhY2VTdG9yZS5cbiAqL1xuXG5Db2xvclNwYWNlU3RvcmUuZmluZE5laWdoYm9ycyA9IGZ1bmN0aW9uIGZpbmROZWlnaGJvcnMgKHNwYWNlX25hbWUpIHtcbiAgdmFyIG5laWdoYm9ycyA9IFtdXG4gIHZhciBjb2xvcl9zcGFjZSA9IHRoaXMuZmluZChzcGFjZV9uYW1lKVxuXG4gIGlmIChjb2xvcl9zcGFjZSA9PT0gbnVsbCkgcmV0dXJuIG5laWdoYm9ycztcblxuICB2YXIgY29udmVyc2lvbnMgPSBjb2xvcl9zcGFjZS5jb252ZXJzaW9uc1xuXG4gIGNvbnZlcnNpb25zLmVhY2goKGNvbnZlcnNpb24sIHRhcmdldF9uYW1lKSA9PiB7XG4gICAgdmFyIHRhcmdldF9zcGFjZSA9IHRoaXMuZmluZCh0YXJnZXRfbmFtZSlcbiAgICBpZiAodGFyZ2V0X3NwYWNlICYmIHRhcmdldF9zcGFjZS5pc19jb25jcmV0ZSkge1xuICAgICAgbmVpZ2hib3JzLnB1c2godGFyZ2V0X25hbWUpXG4gICAgfVxuICB9KVxuXG4gIHJldHVybiBuZWlnaGJvcnNcbn1cblxuLyoqXG4gKiBNZXJnZXMgdHdvIFN0b3Jlcy5cbiAqXG4gKiBMb29wcyBvdmVyIHRoZSA8Zm9yZWlnbl9zdG9yZT4gY29tcGFyaW5nIGl0cyB2YWx1ZXMgd2l0aCB0aGUgbG9jYWwgc3RvcmUuIElmXG4gKiB0aGUgPGZvcmVpZ25fc3RvcmU+IGhhcyBhbnkga2V5cyB0aGF0IHRoZSBsb2NhbCBkb2VzIG5vdCwgaXQgYWRkcyB0aGVtLiBJZlxuICogYm90aCBzdG9yZXMgaGF2ZSB0aGUgc2FtZSBrZXksIGl0IGNhbGxzIG1lcmdlKCkgb24gdGhlIHZhbHVlIG9mIHRoZSBsb2NhbCBrZXlcbiAqL1xuXG5Db2xvclNwYWNlU3RvcmUubWVyZ2UgPSBmdW5jdGlvbiBtZXJnZSAoZm9yZWlnbl9zdG9yZSkge1xuICBmb3JlaWduX3N0b3JlLmVhY2goKGZvcmVpZ25fc3BhY2UsIG5hbWUpID0+IHtcbiAgICB2YXIgbG9jYWxfc3BhY2UgPSB0aGlzLmZpbmQobmFtZSlcbiAgICBpZiAobG9jYWxfc3BhY2UpIHRoaXMubWVyZ2VTcGFjZXMobG9jYWxfc3BhY2UsIGZvcmVpZ25fc3BhY2UpO1xuICAgIGVsc2UgdGhpcy5zdG9yZVtuYW1lXSA9IGZvcmVpZ25fc3BhY2VcbiAgfSlcbn1cblxuLyoqXG4gKiBNZXJnZXMgdHdvIENvbG9yU3BhY2VzXG4gKlxuICogSWYgdGhlIDxmb3JlaWduX3NwYWNlPiBpcyBzdXBwbGllZCBhcyB0aGUgbWFpbiBjb2xvciBzcGFjZSBvZiBhIHBsdWdpbiwgaXQnc1xuICogY29udmVyc2lvbnMgd2lsbCBhbHdheXMgYmUgcHJlZmVyZWQuIE90aGVyd2lzZSB3ZSBzdGF5IHNhZmUgYW5kIGtlZXAgdGhlXG4gKiBjdXJyZW50IGNvbnZlcnNpb25zXG4gKlxuICogSWYgZWl0aGVyIG9mIHRoZSBwYXNzZWQgc3BhY2VzIGFyZSBjb25jcmV0ZSAocmVzdWx0aW5nIGZyb20gdGhlIFwidG9cIiBvYmplY3RcbiAqIG9mIGEgcGx1Z2luKSwgdGhlIHJlc3VsdGluZyBzcGFjZSB3aWxsIGFsd2F5cyBiZSBjb25jcmV0ZSBhcyB3ZWxsLlxuICovXG5cbkNvbG9yU3BhY2VTdG9yZS5tZXJnZVNwYWNlcyA9IGZ1bmN0aW9uIChsb2NhbF9zcGFjZSwgZm9yZWlnbl9zcGFjZSkge1xuICAvLyBjb252ZXJzaW9ucyBkZWZpbmVkIGJ5IGEgY29sb3JzcGFjZSdzIHBsdWdpbiBhcmUgcHJlZmVyZWQgb3ZlciBjb252ZXJzaW9uc1xuICAvLyBkZWZpbmVkIGJ5IHRoZSBvdGhlciBjb2xvcnNwYWNlc1xuICB2YXIgY3VyaW5nID0gIWxvY2FsX3NwYWNlLmlzX2NvbmNyZXRlICYmIGZvcmVpZ25fc3BhY2UuaXNfY29uY3JldGVcblxuICBpZiAoY3VyaW5nICYmIGZvcmVpZ25fc3BhY2UubGltaXRzKSB7XG4gICAgbG9jYWxfc3BhY2UubGltaXRzLm1lcmdlKGZvcmVpZ25fc3BhY2UubGltaXRzKVxuICB9XG5cbiAgbG9jYWxfc3BhY2UuY29udmVyc2lvbnMubWVyZ2UoZm9yZWlnbl9zcGFjZS5jb252ZXJzaW9ucywgeyBmb3JjZTogY3VyaW5nIH0pXG5cbiAgLy8gd2hlbiB0aGUgY29udmVyc2lvbiBpcyBvdmVyLCBpZiB0aGUgc3BhY2Ugd2FzIGFic3RyYWN0IG1ha2UgaXQgY29uY3JldGVcbiAgaWYgKGN1cmluZykgbG9jYWxfc3BhY2UuaXNfY29uY3JldGUgPSB0cnVlXG59XG5cbmV4cG9ydCBkZWZhdWx0IENvbG9yU3BhY2VTdG9yZVxuXG5cblxuLyoqIFdFQlBBQ0sgRk9PVEVSICoqXG4gKiogLi9saWIvY29sb3JTcGFjZVN0b3JlLmpzXG4gKiovIiwiaW1wb3J0ICogYXMgaGVscGVycyBmcm9tICcuL2hlbHBlcnMnXG5pbXBvcnQgU3RhdGVsZXNzIGZyb20gJ3N0YXRlbGVzcydcblxudmFyIFN0b3JhZ2UgPSBTdGF0ZWxlc3MuZXh0ZW5kKClcblxuLyoqXG4gKiBJbml0aWFsaXplcyBTdG9yYWdlJ3Mgc3RhdGUuIElzIGNhbGxlZCBvbiBjcmVhdGUoKVxuICovXG5cblN0b3JhZ2UuaW5pdCA9IGZ1bmN0aW9uIGluaXQgKCkge1xuICB0aGlzLnN0b3JlID0ge31cbn1cblxuLyoqXG4gKiBBZGRzIDxrZXk+Lzx2YWx1ZT4gdG8gdGhlIHN0b3JlLiA8a2V5PiBzaG91bGQgYmUgYSB1bmlxdWUgaWRlbnRpZmllci4gSWYga2V5XG4gKiBpcyBhbHJlYWR5IHByZXNlbnQgaW4gdGhlIHN0b3JlLCBhZGQgd2lsbCB0aHJvdyBhbiBlcnJvci4gVGhpcyBpcyB0byBwcmV2ZW50XG4gKiBhY2NpZGVudGFsIG92ZXJ3cml0ZXMuIEluIG1vc3QgY2FzZXMgd2UnbGwgd2FudCB0byB1c2UgbWVyZ2UoKSBpbnN0ZWFkIGFueXdheVxuICovXG5cblN0b3JhZ2UuYWRkID0gZnVuY3Rpb24gYWRkIChrZXksIHZhbHVlKSB7XG4gIGlmICh0aGlzLnN0b3JlW2tleV0pIHRocm93IG5ldyBFcnJvcigndGhlIGtleSBcIicgKyBrZXkgKyAnXCIgYWxyZWFkeSBleGlzdHMgaW4gdGhpcyBzdG9yZScpXG4gIHRoaXMuc3RvcmVba2V5XSA9IHZhbHVlXG59XG5cbi8qKlxuICogUmV0dXJucyB0aGUgdmFsdWUgYXNzb2NpYXRlZCB3aXRoIDxrZXk+IGlmIGl0IGV4aXN0cywgb3RoZXJ3aXNlLCByZXR1cm4gbnVsbFxuICovXG5cblN0b3JhZ2UuZmluZCA9IGZ1bmN0aW9uIGZpbmQgKGtleSkge1xuICByZXR1cm4gdGhpcy5zdG9yZVtrZXldIHx8IG51bGxcbn1cblxuLyoqXG4gKiBSZXR1cm5zIHRydWUgaWYgdGhlIGtleSBhbHJlYWR5IGV4aXN0cywgb3RoZXJ3aXNlLCBpdCByZXR1cm5zIGZhbHNlXG4gKi9cblxuU3RvcmFnZS5oYXMgPSBmdW5jdGlvbiBoYXMgKGtleSkge1xuICByZXR1cm4gQm9vbGVhbih0aGlzLmZpbmQoa2V5KSlcbn1cblxuLyoqXG4gKiBSZW1vdmVzIDxrZXk+IGFuZCBpdCdzIGFzc29jaWF0ZWQgdmFsdWUgZnJvbSB0aGUgc3RvcmVcbiAqL1xuXG5TdG9yYWdlLnJlbW92ZSA9IGZ1bmN0aW9uIHJlbW92ZSAoa2V5KSB7XG4gIGRlbGV0ZSB0aGlzLnN0b3JlW2tleV1cbn1cblxuLyoqXG4gKiBpdGVyYXRlcyBvdmVyIHRoZSBzdG9yZSwgY2FsbGluZyA8ZnVuYz4gb24gZWFjaCBpdGVyYXRpb25cbiAqIGlmIHRoZSBmdW5jdGlvbiByZXR1cm5zIGFueXRoaW5nLCB0aGUgaXRlcmF0aW9uIGlzIGhhbHRlZCBhbmQgdGhlIHJlc3VsdCBpcyByZXR1cm5lZFxuICovXG5cblN0b3JhZ2UuZWFjaCA9IGZ1bmN0aW9uIGVhY2ggKGZ1bmMsIGNvbnRleHQpIHtcbiAgcmV0dXJuIGhlbHBlcnMuZWFjaC5jYWxsKHRoaXMsIHRoaXMuc3RvcmUsIGZ1bmMsIGNvbnRleHQpXG59XG5cbi8qKlxuICogbG9vcHMgb3ZlciB0aGUgPGZvcmVpZ25fc3RvcmU+IGNvbXBhcmluZyBpdHMgdmFsdWVzIHdpdGggdGhlIGxvY2FsIHN0b3JlLiBJZlxuICogdGhlIDxmb3JlaWduX3N0b3JlPiBoYXMgYW55IGtleXMgdGhhdCB0aGUgbG9jYWwgZG9lcyBub3QsIGl0IGFkZHMgdGhlbS4gSWZcbiAqIGJvdGggc3RvcmVzIGhhdmUgdGhlIHNhbWUga2V5LCBpdCBjYWxscyBtZXJnZSgpIG9uIHRoZSB2YWx1ZSBvZiB0aGUgbG9jYWwga2V5XG4gKi9cblxuU3RvcmFnZS5tZXJnZSA9IGZ1bmN0aW9uIG1lcmdlIChmb3JlaWduX3N0b3JlKSB7XG4gIGZvcmVpZ25fc3RvcmUuZWFjaChmdW5jdGlvbiAodmFsdWUsIGtleSkge1xuICAgIHZhciBsb2NhbCA9IHRoaXMuZmluZChrZXkpXG4gICAgaWYgKGxvY2FsKSBsb2NhbC5tZXJnZSh2YWx1ZSk7XG4gICAgZWxzZSB0aGlzLnN0b3JlW2tleV0gPSB2YWx1ZVxuICB9LCB0aGlzKVxufVxuXG5leHBvcnQgZGVmYXVsdCBTdG9yYWdlXG5cblxuXG4vKiogV0VCUEFDSyBGT09URVIgKipcbiAqKiAuL2xpYi9zdG9yYWdlLmpzXG4gKiovIiwiLyoqXG4gKiBJZiA8dGFyZ2V0PiBpcyBhIFN0cmluZyBvciBOdW1iZXIgY3JlYXRlIGEgbmV3IG9iamVjdCB3aXRoIHRob3NlIHZhbHVlcy5cbiAqIElmIDx0YXJnZXQ+IGlzIGFuIEFycmF5LCByZWN1cnNpdmVseSBjYWxsIHRoaXMgZnVuY3Rpb24gb24gYWxsIG9mIGl0J3MgY29udGVudHNcbiAqL1xuXG5leHBvcnQgZnVuY3Rpb24gY2xvbmUgKHRhcmdldCkge1xuICB2YXIgY2xvbmVkO1xuXG4gIHZhciBvYmogPSBPYmplY3QodGFyZ2V0KVxuXG4gIHN3aXRjaCAob2JqLmNvbnN0cnVjdG9yKSB7XG4gICAgY2FzZSBTdHJpbmc6XG4gICAgICBjbG9uZWQgPSBvYmoudG9TdHJpbmcoKVxuICAgICAgYnJlYWs7XG4gICAgY2FzZSBOdW1iZXI6XG4gICAgICBjbG9uZWQgPSBOdW1iZXIob2JqKVxuICAgICAgYnJlYWs7XG4gICAgY2FzZSBBcnJheTpcbiAgICAgIGNsb25lZCA9IFtdXG4gICAgICBlYWNoKG9iaiwgZnVuY3Rpb24gKGl0ZW0sIGkpIHtcbiAgICAgICAgY2xvbmVkW2ldID0gY2xvbmUoaXRlbSlcbiAgICAgIH0pXG4gICAgICBicmVhaztcbiAgICBkZWZhdWx0OlxuICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcignQWxjaGVtaXN0IGRvZXMgbm90IGtub3cgaG93IHRvIGNsb25lICcgKyB0YXJnZXQpXG4gIH1cbiAgcmV0dXJuIGNsb25lZDtcbn1cblxuLyoqXG4gKiBJIGRvbid0IHRoaW5rIEFycmF5LmlzQXJyYXkgaXMgd2VsbCBzdXBwb3J0ZWQuIFVzZSB0aGlzIGZ1bmN0aW9uIGluc3RlYWQgZm9yXG4gKiBub3cgc28gdGhhdCBpZiB3ZSBuZWVkIHRvIGFkZCBhIGZhbGxiYWNrIGl0IHdvbid0IHRha2UgYXMgbXVjaCBlZmZvcnQuXG4gKi9cblxuZXhwb3J0IGZ1bmN0aW9uIGlzQXJyYXkgKG9iamVjdCkge1xuICByZXR1cm4gQXJyYXkuaXNBcnJheShvYmplY3QpXG59XG5cbmV4cG9ydCBmdW5jdGlvbiBpc09iamVjdCAob2JqZWN0KSB7XG4gIHJldHVybiBCb29sZWFuKG9iamVjdCAmJiB0eXBlb2Ygb2JqZWN0ID09PSAnb2JqZWN0Jylcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGlzRnVuY3Rpb24gKGZ1bmMpIHtcbiAgcmV0dXJuIHR5cGVvZiBmdW5jID09PSAnZnVuY3Rpb24nXG59XG5cbi8qKlxuICogVGVzdHMgdG8gc2VlIGlmIGFuIG9iamVjdCBpcyBhIFBsYWluIE9iamVjdCBwcm9kdWNlZCBmcm9tIGFuIG9iamVjdCBsaXRlcmFsLlxuICogVGhpcyBpcyBnb29kIGZvciB0ZXN0aW5nIHRoaW5ncyBsaWtlIGZ1bmN0aW9uIG9wdGlvbnMuXG4gKi9cblxuZXhwb3J0IGZ1bmN0aW9uIGlzUGxhaW5PYmplY3QgKG9iamVjdCkge1xuICBpZiAoIShvYmplY3QgJiYgdG9TdHJpbmcuY2FsbChvYmplY3QpID09PSAnW29iamVjdCBPYmplY3RdJykpIHJldHVybiBmYWxzZVxuICByZXR1cm4gT2JqZWN0LmdldFByb3RvdHlwZU9mKG9iamVjdCkgPT09IE9iamVjdC5wcm90b3R5cGVcbn1cblxuLyoqXG4gKiBUZXN0cyBpZiBhbiBvYmplY3QgaXMgYSBzdHJpbmcgbGl0ZXJhbFxuICovXG5cbmV4cG9ydCBmdW5jdGlvbiBpc1N0cmluZyAob2JqZWN0KSB7XG4gIHJldHVybiB0eXBlb2Ygb2JqZWN0ID09PSAnc3RyaW5nJ1xufVxuXG4vKipcbiAqIHRha2VzIGFuIGFycmF5IG9yIG9iamVjdCwgaXRlcmF0ZXMgb3ZlciBpdCwgYW5kIGNhbGxzIDxmdW5jPiBvbiBlYWNoIGl0ZXJhdGlvblxuICogaWYgdGhlIGZ1bmN0aW9uIHJldHVybnMgYW55dGhpbmcsIHRoZSBpdGVyYXRpb24gaXMgaGFsdGVkIGFuZCB0aGUgcmVzdWx0IGlzIHJldHVybmVkXG4gKi9cblxuZXhwb3J0IGZ1bmN0aW9uIGVhY2ggKGNvbGxlY3Rpb24sIGZ1bmMsIGNvbnRleHQpIHtcbiAgdmFyIHJlc3VsdDtcbiAgY29udGV4dCA9IGNvbnRleHQgfHwgbnVsbFxuICBpZiAoaXNBcnJheShjb2xsZWN0aW9uKSkge1xuICAgIHZhciBsZW5ndGggPSBjb2xsZWN0aW9uLmxlbmd0aFxuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgbGVuZ3RoOyBpKyspIHtcbiAgICAgIHJlc3VsdCA9IGZ1bmMuY2FsbChjb250ZXh0LCBjb2xsZWN0aW9uW2ldLCBpKVxuICAgICAgaWYgKHJlc3VsdCAhPT0gdW5kZWZpbmVkKSByZXR1cm4gcmVzdWx0XG4gICAgfVxuICB9IGVsc2Uge1xuICAgIGZvciAodmFyIGtleSBpbiBjb2xsZWN0aW9uKSB7XG4gICAgICByZXN1bHQgPSBmdW5jLmNhbGwoY29udGV4dCwgY29sbGVjdGlvbltrZXldLCBrZXkpXG4gICAgICBpZiAocmVzdWx0ICE9PSB1bmRlZmluZWQpIHJldHVybiByZXN1bHRcbiAgICB9XG4gIH1cbiAgcmV0dXJuIG51bGxcbn1cblxuLyoqXG4gKiBJZiA8dmFsdWU+IGlzIGEgbnVtYmVyLCBpdCB3aWxsIHJvdW5kIGl0LiBJZiA8dmFsdWU+IGlzIGFuXG4gKiBBcnJheSBpdCB3aWxsIHRyeSB0byByb3VuZCBpdCdzIGNvbnRlbnRzLiBJZiA8cHJlY2lzaW9uPiBpcyBwcmVzZW50LCBpdCB3aWxsXG4gKiByb3VuZCB0byB0aGF0IGRlY2ltYWwgdmFsdWUuIFRoZSBkZWZhdWx0IDxwcmVjaXNpb24+IGlzIDQuXG4gKi9cblxuZXhwb3J0IGZ1bmN0aW9uIHJvdW5kICh2YWx1ZSwgcHJlY2lzaW9uKSB7XG4gIHByZWNpc2lvbiA9IHByZWNpc2lvbiB8fCA0XG4gIGlmIChpc0FycmF5KHZhbHVlKSkge1xuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgdmFsdWUubGVuZ3RoOyBpKyspIHtcbiAgICAgIHZhbHVlW2ldID0gdGhpcy5yb3VuZElmTnVtYmVyKHZhbHVlW2ldLCBwcmVjaXNpb24pXG4gICAgfVxuICB9IGVsc2Uge1xuICAgIHZhbHVlID0gcm91bmRJZk51bWJlcih2YWx1ZSwgcHJlY2lzaW9uKVxuICB9XG4gIHJldHVybiB2YWx1ZVxufVxuXG4vKipcbiAqIElmIDx2YWx1ZT4gaXMgYSBudW1iZXIsIHdlIHJvdW5kIGl0IHRvIHdoYXRldmVyIHRoZSBjdXJyZW50IDxwcmVjaXNpb24+IHNldHRpbmdcbiAqIGlzIGF0LlxuICovXG5cbmV4cG9ydCBmdW5jdGlvbiByb3VuZElmTnVtYmVyICh2YWx1ZSwgcHJlY2lzaW9uKSB7XG4gIGlmICh0eXBlb2YgdmFsdWUgPT09ICdudW1iZXInKSB7XG4gICAgdmFsdWUgPSBOdW1iZXIodmFsdWUudG9QcmVjaXNpb24ocHJlY2lzaW9uKSlcbiAgfVxuICByZXR1cm4gdmFsdWVcbn1cblxuXG5cbi8qKiBXRUJQQUNLIEZPT1RFUiAqKlxuICoqIC4vbGliL2hlbHBlcnMuanNcbiAqKi8iLCJtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoXCJzdGF0ZWxlc3NcIik7XG5cblxuLyoqKioqKioqKioqKioqKioqXG4gKiogV0VCUEFDSyBGT09URVJcbiAqKiBleHRlcm5hbCBcInN0YXRlbGVzc1wiXG4gKiogbW9kdWxlIGlkID0gOFxuICoqIG1vZHVsZSBjaHVua3MgPSAwXG4gKiovIiwiaW1wb3J0IFN0b3JhZ2UgZnJvbSAnLi9zdG9yYWdlJ1xuXG52YXIgQ29udmVyc2lvblN0b3JlID0gU3RvcmFnZS5leHRlbmQoKVxuXG4vKipcbiAqIExvb3BzIG92ZXIgdGhlIDxmb3JlaWduX3N0b3JlPiBjb21wYXJpbmcgaXRzIGNvbnZlcnNpb25zIHdpdGggdGhlIGxvY2FsXG4gKiBzdG9yZSdzLiBJZiB0aGUgPGZvcmVpZ25fc3RvcmU+IGhhcyBhbnkgY29udmVyc2lvbnMgdGhhdCB0aGUgbG9jYWwgZG9lcyBub3QsXG4gKiBpdCBhZGRzIHRoZW0uIElmIGJvdGggc3RvcmVzIGhhdmUgdGhlIHNhbWUgY29udmVyc2lvbiwgaXQgdXNlcyB0aGUgY3VycmVudFxuICogY29udmVyc2lvbi4gSWYgPG9wdGlvbnMuZm9yY2U+IGlzIHRydXRoeSB0aGUgbWVyZ2Ugd2lsbCBhbHdheXMgb3ZlcndyaXRlIHRoZVxuICogY3VycmVudCBjb252ZXJzaW9uLlxuICovXG5cbkNvbnZlcnNpb25TdG9yZS5tZXJnZSA9IGZ1bmN0aW9uIG1lcmdlIChmb3JlaWduX3N0b3JlLCBvcHRpb25zKSB7XG4gIG9wdGlvbnMgPSBvcHRpb25zIHx8IHt9XG4gIGZvcmVpZ25fc3RvcmUuZWFjaChmdW5jdGlvbiAodmFsdWUsIGtleSkge1xuICAgIHZhciBsb2NhbCA9IHRoaXMuZmluZChrZXkpXG4gICAgaWYgKG9wdGlvbnMuZm9yY2UgfHwgIWxvY2FsIHx8IHR5cGVvZiBsb2NhbCA9PT0gJ3N0cmluZycpIHtcbiAgICAgIHRoaXMuc3RvcmVba2V5XSA9IHZhbHVlXG4gICAgfVxuICB9LCB0aGlzKVxufVxuXG5leHBvcnQgZGVmYXVsdCBDb252ZXJzaW9uU3RvcmVcblxuXG5cbi8qKiBXRUJQQUNLIEZPT1RFUiAqKlxuICoqIC4vbGliL2NvbnZlcnNpb25TdG9yZS5qc1xuICoqLyIsImltcG9ydCAqIGFzIF8gZnJvbSAnLi9oZWxwZXJzJ1xuaW1wb3J0IFN0YXRlbGVzcyBmcm9tICdzdGF0ZWxlc3MnXG5cbi8qKlxuICogQ29sb3IgaXMgb3VyIGhlYXZ5IGxpZnRlci4gSW4gb3JkZXIgZm9yIGEgQ29sb3IgdG8gYmUgY29udmVydGFibGUgeW91IG5lZWQgYVxuICogY29udmVydGVyLCBjb252ZXJzaW9ucywgYSBzcGFjZSwgYW5kIGEgdmFsdWUgdG8gYWxsIGJlIGRlZmluZWQuIFRoaXMgaXMgYSBsb3RcbiAqIG9mIHByZS1yZXF1aXNpdGVzIHNvIENvbG9yIHdhcyBkZXNpZ25lZCB0byBiZSBidWlsdCBvdmVyIDMgc3RhZ2VzIG9mXG4gKiBpbmhlcml0YW5jZSwgaW5jbHVkaW5nIGEgZmV3IG9mIHRoZSByZXF1aXJlbWVudHMgYXQgYSB0aW1lLlxuICpcbiAqIEJhc2VTcGFjZSAoY29udmVydGVyKVxuICogICBWXG4gKiBDb2xvclNwYWNlIChjb252ZXJzaW9ucywgc3BhY2UpXG4gKiAgIFZcbiAqIENvbG9yICh2YWx1ZSlcbiAqXG4gKiBFeGFtcGxlOlxuICogLSBBbGwgY29sb3JzIHNob3VsZCBoYXZlIHRoZWlyIG93biB2YWx1ZXNcbiAqIC0gQWxsIFwicmdiXCIgY29sb3JzIHNob3VsZCBoYXZlIHRoZSBzYW1lIHNldCBvZiBjb252ZXJzaW9uc1xuICogLSBBbGwgY29sb3JzIGluIGdlbmVyYWwgc2hvdWxkIGhhdmUgY29tbW9uIGNvbnZlcnNpb24gbG9naWMgY29udGFpbmVkIGluIGFcbiAqICAgY29udmVydGVyLlxuICpcbiAqIENvbG9yIG1ldGhvZHMgc2hvdWxkIGJlIGRlZmluZWQgb24gdGhlIEJhc2VTcGFjZSB0byBlbnN1cmUgYWxsIGNvbG9ycyB1cFxuICogdGhlIGNoYWluIHJlY2VpdmUgdGhlIHNhbWUgbWV0aG9kcyB3aXRob3V0IGhhdmluZyB0byBhZGQgdGhlbSBvbiB0aGUgZmx5XG4gKiBkdXJpbmcgQ29sb3IgY3JlYXRpb25cbiAqL1xuXG52YXIgQ29sb3IgPSBTdGF0ZWxlc3MuZXh0ZW5kKClcblxuLyoqXG4gKiBJbml0aWFsaXplcyBDb2xvcidzIHN0YXRlLiBJcyBjYWxsZWQgb24gY3JlYXRlKClcbiAqL1xuXG5Db2xvci5pbml0ID0gZnVuY3Rpb24gaW5pdCAodmFsdWUsIG9wdGlvbnMpIHtcbiAgaWYgKF8uaXNQbGFpbk9iamVjdChhcmd1bWVudHNbMF0pKSB7XG4gICAgb3B0aW9ucyA9IGFyZ3VtZW50c1swXVxuICB9IGVsc2UgaWYgKHZhbHVlICE9PSB1bmRlZmluZWQpIHtcbiAgICBpZiAodGhpcy5saW1pdHMpIHRoaXMudmFsdWUgPSB0aGlzLmxpbWl0cy5jaGVjayh2YWx1ZSk7XG4gICAgZWxzZSB0aGlzLnZhbHVlID0gdmFsdWU7XG4gIH1cblxuICBvcHRpb25zID0gb3B0aW9ucyB8fCB7fVxuXG4gIC8vIEJhc2VTcGFjZVxuICBpZiAob3B0aW9ucy5saW1pdGVyKSB0aGlzLmxpbWl0cyA9IG9wdGlvbnMubGltaXRlcjtcbiAgaWYgKG9wdGlvbnMucHJlY2lzaW9uKSB0aGlzLnByZWNpc2lvbiA9IG9wdGlvbnMucHJlY2lzaW9uO1xuICBpZiAob3B0aW9ucy5jb252ZXJ0ZXIpIHRoaXMuY29udmVydGVyID0gb3B0aW9ucy5jb252ZXJ0ZXI7XG5cbiAgLy8gQ29sb3JTcGFjZVxuICBpZiAob3B0aW9ucy5jb252ZXJzaW9ucykgdGhpcy5jb252ZXJzaW9ucyA9IG9wdGlvbnMuY29udmVyc2lvbnM7XG4gIGlmIChvcHRpb25zLnNwYWNlKSB0aGlzLnNwYWNlID0gb3B0aW9ucy5zcGFjZTtcblxuICB0aGlzLmlzX2NvbmNyZXRlID0gIW9wdGlvbnMuYWJzdHJhY3Rcbn1cblxuLyoqXG4gKiBDb252ZXJ0cyBhIGNvbG9yIGFuZCByZXR1cm5zIGl0cyB2YWx1ZXNcbiAqL1xuXG5Db2xvci50byA9IGZ1bmN0aW9uIHRvICh0YXJnZXRfbmFtZSwgb3B0aW9ucykge1xuICBvcHRpb25zID0gb3B0aW9ucyB8fCB7fVxuICB2YXIgY29sb3IgPSB0aGlzLmFzKHRhcmdldF9uYW1lKVxuICBpZiAob3B0aW9ucy5wcmVjaXNpb24gPT09IG51bGwpIHJldHVybiBjb2xvci52YWw7XG4gIGVsc2UgcmV0dXJuIGNvbG9yLnJvdW5kKG9wdGlvbnMucHJlY2lzaW9uKVxufVxuXG4vKipcbiAqIENvbnZlcnRzIGEgY29sb3IgYW5kIHJldHVybnMgdGhlIG5ldyBjb2xvclxuICovXG5cbkNvbG9yLmFzID0gZnVuY3Rpb24gYXMgKHRhcmdldF9uYW1lKSB7XG4gIHJldHVybiB0aGlzLmNvbnZlcnRlci5jb252ZXJ0KHRoaXMsIHRhcmdldF9uYW1lKVxufVxuXG4vKipcbiAqIFJvdW5kcyB0aGUgdmFsdWUgdG8gdGhlIGdpdmVuIHByZWNpc2lvbi5cbiAqIElmIGEgcHJlY2lzaW9uIGlzbid0IHByb3ZpZGVkLCBpdCB1c2VzIHRoZSBkZWZhdWx0XG4gKi9cblxuQ29sb3Iucm91bmQgPSBmdW5jdGlvbiByb3VuZCAocHJlY2lzaW9uKSB7XG4gIHJldHVybiBfLnJvdW5kKHRoaXMudmFsdWUsIHByZWNpc2lvbiB8fCB0aGlzLnByZWNpc2lvbilcbn1cblxuZXhwb3J0IGRlZmF1bHQgQ29sb3JcblxuXG5cbi8qKiBXRUJQQUNLIEZPT1RFUiAqKlxuICoqIC4vbGliL2NvbG9yLmpzXG4gKiovIiwiaW1wb3J0ICogYXMgaGVscGVycyBmcm9tICcuL2hlbHBlcnMnXG5pbXBvcnQgU3RhdGVsZXNzIGZyb20gJ3N0YXRlbGVzcydcblxudmFyIENvbnZlcnRlciA9IFN0YXRlbGVzcy5leHRlbmQoKVxuXG4vKipcbiAqIEluaXRpYWxpemVzIENvbnZlcnRlcidzIHN0YXRlLiBJcyBjYWxsZWQgb24gY3JlYXRlKClcbiAqL1xuXG5Db252ZXJ0ZXIuaW5pdCA9IGZ1bmN0aW9uIGluaXQgKGNvbG9yX3NwYWNlcykge1xuICB0aGlzLnNwYWNlcyA9IGNvbG9yX3NwYWNlc1xufVxuXG4vKipcbiAqIENvbnZlcnRzIDxjb2xvcj4gdG8gYSB0YXJnZXQgY29sb3Igc3BhY2VcbiAqL1xuXG5Db252ZXJ0ZXIuY29udmVydCA9IGZ1bmN0aW9uIGNvbnZlcnQgKGNvbG9yLCB0YXJnZXRfbmFtZSkge1xuICB2YXIgY3VycmVudF9uYW1lID0gY29sb3Iuc3BhY2VcbiAgaWYgKGN1cnJlbnRfbmFtZSA9PT0gdGFyZ2V0X25hbWUpIHJldHVybiBjb2xvcjtcblxuICBpZiAoIXRoaXMuc3BhY2VzLmhhcyhjdXJyZW50X25hbWUpKSB0aHJvdyBuZXcgRXJyb3IoJ2NvdWxkIG5vdCBmaW5kIHRoZSAnICsgY3VycmVudF9uYW1lICsgJyBjb2xvciBzcGFjZScpO1xuICBpZiAoIXRoaXMuc3BhY2VzLmhhcyh0YXJnZXRfbmFtZSkpIHRocm93IG5ldyBFcnJvcignY291bGQgbm90IGZpbmQgdGhlICcgKyB0YXJnZXRfbmFtZSArICcgY29sb3Igc3BhY2UnKTtcblxuICB2YXIgY29udmVyc2lvbiA9IGNvbG9yLmNvbnZlcnNpb25zLmZpbmQodGFyZ2V0X25hbWUpXG4gIC8vIFRlc3QgdG8gc2VlIGlmIHRoZSBjdXJyZW50IHNwYWNlIGtub3dzIGhvdyB0byBjb252ZXJ0IHRvIHRhcmdldFxuICBpZiAodHlwZW9mIGNvbnZlcnNpb24gPT09ICdmdW5jdGlvbicpIHtcbiAgICByZXR1cm4gdGhpcy5hcHBseUNvbnZlcnNpb24oY29sb3IsIHRhcmdldF9uYW1lKVxuICAvLyBpZiB0aGUgY29udmVyc2lvbiBpcyBhIGFub3RoZXIgY29sb3Igc3BhY2VcbiAgfSBlbHNlIGlmICh0eXBlb2YgY29udmVyc2lvbiA9PT0gJ3N0cmluZycpIHtcbiAgICB2YXIgbmV4dF9jb2xvciA9IHRoaXMuYXBwbHlDb252ZXJzaW9uKGNvbG9yLCBjb252ZXJzaW9uKVxuICAgIHJldHVybiB0aGlzLmNvbnZlcnQobmV4dF9jb2xvciwgdGFyZ2V0X25hbWUpXG4gIH0gZWxzZSB7XG4gICAgLy8gYXR0ZW1wdCB0byBmaW5kIHBhdGhcbiAgICB2YXIgbmV4dF9zcGFjZSA9IHRoaXMubWFwQ29udmVyc2lvblBhdGgoY3VycmVudF9uYW1lLCB0YXJnZXRfbmFtZSlcblxuICAgIC8vIGlmIHdlIGZpbmQgdGhlIHBhdGggYmVnaW4gc3RlcHBpbmcgZG93biBpdFxuICAgIGlmIChuZXh0X3NwYWNlKSByZXR1cm4gdGhpcy5jb252ZXJ0KGNvbG9yLCB0YXJnZXRfbmFtZSk7XG5cbiAgICAvLyBlbHNlIHRocm93IGFuIGVycm9yXG4gICAgZWxzZSB0aHJvdyBuZXcgRXJyb3IoJ0FsY2hlbWlzdCBkb2VzIG5vdCBrbm93IGhvdyB0byBjb252ZXJ0IGZyb20gJyArIGN1cnJlbnRfbmFtZSArICcgdG8gJyArIHRhcmdldF9uYW1lKVxuICB9XG59XG5cbi8qKlxuICogRmluZHMgdGhlIHRhcmdldCBjb2xvciBzcGFjZSB1bmRlciB0aGUgPGNvbG9yPidzIGNvbnZlcnNpb25zLCBhcHBsaWVzXG4gKiB0aGF0IGNvbnZlcnNpb24sIGFuZCByZXR1cm5zIGEgbmV3IGNvbG9yLlxuICovXG5cbkNvbnZlcnRlci5hcHBseUNvbnZlcnNpb24gPSBmdW5jdGlvbiBhcHBseUNvbnZlcnNpb24gKGNvbG9yLCB0YXJnZXRfbmFtZSkge1xuICB2YXIgdmFsdWUsIG5ld19jb2xvcjtcbiAgdmFyIGNvbnZlcnNpb24gPSBjb2xvci5jb252ZXJzaW9ucy5maW5kKHRhcmdldF9uYW1lKVxuICBpZiAodHlwZW9mIGNvbnZlcnNpb24gIT09ICdmdW5jdGlvbicpIHRocm93IG5ldyBUeXBlRXJyb3IoJ2V4cGVjdGVkICcgKyBjb252ZXJzaW9uICsgJyB0byBiZSBhIGZ1bmN0aW9uJyk7XG5cbiAgaWYgKGNvbG9yLnZhbHVlID09PSBudWxsKSB7XG4gICAgdmFsdWUgPSBjb2xvci52YWx1ZVxuICB9IGVsc2UgaWYgKGhlbHBlcnMuaXNBcnJheShjb2xvci52YWx1ZSkpIHtcbiAgICB2YWx1ZSA9IGNvbnZlcnNpb24uYXBwbHkoY29sb3IsIGhlbHBlcnMuY2xvbmUoY29sb3IudmFsdWUpKTtcbiAgfSBlbHNlIHtcbiAgICB2YWx1ZSA9IGNvbnZlcnNpb24uY2FsbChjb2xvciwgaGVscGVycy5jbG9uZShjb2xvci52YWx1ZSkpXG4gIH1cblxuICBuZXdfY29sb3IgPSB0aGlzLnNwYWNlcy5maW5kKHRhcmdldF9uYW1lKS5jcmVhdGUodmFsdWUpXG5cbiAgcmV0dXJuIG5ld19jb2xvclxufVxuXG4vKipcbiAqIExlYXZlcyBhIHRyYWlsIG9mIFwiY29udmVyc2lvbiBwb2ludGVyc1wiIHRoYXQgY29udmVydCgpIGNhbiBmb2xsb3cgZnJvbSBvbmVcbiAqIGNvbG9yIHNwYWNlIHRvIGEgdGFyZ2V0IGNvbG9yIHNwYWNlXG4gKlxuICogQSBcInBvaW50ZXJcIiBpcyBqdXN0IGEgc3RyaW5nIHRoYXQgdGVsbHMgY29udmVydCgpIHdoYXQgY29sb3Igc3BhY2UgdG8gY29udmVydFxuICogdG8gbmV4dCB0byBnZXQgb25lIHN0ZXAgY2xvc2VyIHRvIHRoZSB0YXJnZXQgc3BhY2VcbiAqL1xuXG5Db252ZXJ0ZXIubWFwQ29udmVyc2lvblBhdGggPSBmdW5jdGlvbiBtYXBDb252ZXJzaW9uUGF0aCAoY3VycmVudF9uYW1lLCB0YXJnZXRfbmFtZSkge1xuICB2YXIgY29udmVyc2lvblxuICAvLyBJcyB0aGVyZSBhIHBhdGg/XG4gIHZhciBwYXJlbnRzID0gdGhpcy5maW5kQ29udmVyc2lvblBhdGgoY3VycmVudF9uYW1lLCB0YXJnZXRfbmFtZSlcbiAgLy8gaWYgbm90IHJldHVybiBudWxsXG4gIGlmICghcGFyZW50cykgcmV0dXJuIG51bGw7XG5cbiAgdmFyIG5leHRfc3BhY2UgPSBwYXJlbnRzW3RhcmdldF9uYW1lXVxuICB2YXIgc3BhY2UgPSBwYXJlbnRzW25leHRfc3BhY2VdXG5cbiAgdmFyIHN0ZXBzX3Rha2VuID0gMFxuXG4gIC8vIHN0ZXAgYmFja3dhcmRzIHRocm91Z2ggdGhlIHBhcmVudCBhcnJheSBhbmQgbGVhdmUgXCJuZXh0IHN0ZXBcIiBpbnN0cnVjdGlvbnMgYWxvbmcgdGhlIHdheVxuICB3aGlsZSAoc3RlcHNfdGFrZW4gPCAxMDApIHtcbiAgICBjb252ZXJzaW9uID0gdGhpcy5zcGFjZXMuZmluZChzcGFjZSkuY29udmVyc2lvbnMuZmluZCh0YXJnZXRfbmFtZSlcblxuICAgIGlmICghY29udmVyc2lvbiB8fCB0eXBlb2YgY29udmVyc2lvbiAhPT0gJ2Z1bmN0aW9uJykge1xuICAgICAgdGhpcy5zcGFjZXMuZmluZChzcGFjZSkuY29udmVyc2lvbnMuYWRkKHRhcmdldF9uYW1lLCBuZXh0X3NwYWNlKVxuICAgIH1cblxuICAgIC8vIGlmIHdlJ3JlIGZpbmlzaGVkIG1hcHBpbmcsIGdvIGFoZWFkIGFuZCB0ZWxsIHVzIGhvdyB0byBzdGFydCB0aGUgY29udmVyc2lvblxuICAgIGlmIChzcGFjZSA9PT0gY3VycmVudF9uYW1lKSByZXR1cm4gbmV4dF9zcGFjZTtcbiAgICBlbHNlIGlmICghcGFyZW50c1tzcGFjZV0pIHJldHVybiBudWxsO1xuXG4gICAgLy8gdGFrZSBhIHN0ZXAgYmFja3dhcmRzXG4gICAgbmV4dF9zcGFjZSA9IHNwYWNlXG4gICAgc3BhY2UgPSBwYXJlbnRzW3NwYWNlXVxuICAgIHN0ZXBzX3Rha2VuKytcbiAgfVxuXG4gIHRocm93IG5ldyBFcnJvcignc29tZXRoaW5nIHdlbnQgd3Jvbmcgd2hpbGUgbWFwcGluZyB0aGUgcGF0aCBmcm9tJyArIGN1cnJlbnRfbmFtZSArICcgdG8gJyArIHRhcmdldF9uYW1lKVxufVxuXG4vKipcbiAqIFNlYXJjaGVzIGFsbCBjb252ZXJzaW9ucyB0byBmaW5kIHRoZSBxdWlja2VzdCBwYXRoIGJldHdlZW4gdHdvIGNvbG9yIHNwYWNlcy5cbiAqIFJldHVybnMgYW4gYXJyYXkgb2YgcGFyZW50OmNoaWxkIHJlbGF0aW9uc2hpcHMgdGhhdCBjYW4gYmUgd2Fsa2VkIGJhY2t3YXJkc1xuICogdG8gZ2V0IHRoZSBwYXRoXG4gKi9cblxuQ29udmVydGVyLmZpbmRDb252ZXJzaW9uUGF0aCA9IGZ1bmN0aW9uIGZpbmRDb252ZXJzaW9uUGF0aCAoY3VycmVudF9uYW1lLCB0YXJnZXRfbmFtZSkge1xuICB2YXIgUSA9IFtdXG4gIHZhciBleHBsb3JlZCA9IFtdXG4gIHZhciBwYXJlbnQgPSB7fVxuICBRLnB1c2goY3VycmVudF9uYW1lKVxuICBleHBsb3JlZC5wdXNoKGN1cnJlbnRfbmFtZSlcblxuICB3aGlsZSAoUS5sZW5ndGgpIHtcbiAgICB2YXIgc3BhY2UgPSBRLnBvcCgpXG4gICAgaWYgKHNwYWNlID09PSB0YXJnZXRfbmFtZSkgeyByZXR1cm4gcGFyZW50IH1cbiAgICB2YXIgbmVpZ2hib3JzID0gdGhpcy5zcGFjZXMuZmluZE5laWdoYm9ycyhzcGFjZSlcblxuICAgIC8vIGZvciBlYWNoIG5laWdoYm9yXG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBuZWlnaGJvcnMubGVuZ3RoOyBpKyspIHtcbiAgICAgIHZhciBuZWlnaGJvciA9IG5laWdoYm9yc1tpXVxuXG4gICAgICAvLyBpZiB0aGlzIG5laWdoYm9yIGhhc24ndCBiZWVuIGV4cGxvcmVkIHlldFxuICAgICAgaWYgKGV4cGxvcmVkLmluZGV4T2YobmVpZ2hib3IpID09PSAtMSkge1xuICAgICAgICBwYXJlbnRbbmVpZ2hib3JdID0gc3BhY2VcbiAgICAgICAgZXhwbG9yZWQucHVzaChuZWlnaGJvcilcbiAgICAgICAgUS5wdXNoKG5laWdoYm9yKVxuICAgICAgfVxuICAgIH1cbiAgfVxuICByZXR1cm4gbnVsbFxufVxuXG5leHBvcnQgZGVmYXVsdCBDb252ZXJ0ZXJcblxuXG5cbi8qKiBXRUJQQUNLIEZPT1RFUiAqKlxuICoqIC4vbGliL2NvbnZlcnRlci5qc1xuICoqLyIsImltcG9ydCAqIGFzIF8gZnJvbSAnLi9oZWxwZXJzJ1xuaW1wb3J0IFN0YXRlbGVzcyBmcm9tICdzdGF0ZWxlc3MnXG5cbnZhciBMaW1pdGVyID0gU3RhdGVsZXNzLmV4dGVuZCgpXG5cbkxpbWl0ZXIuaW5pdCA9IGZ1bmN0aW9uIGluaXQgKG1pbiwgbWF4LCBoYW5kbGVyKSB7XG4gIGlmIChtaW4pIHRoaXMubWluID0gbWluXG4gIGlmIChtYXgpIHRoaXMubWF4ID0gbWF4XG4gIGlmIChoYW5kbGVyKSB0aGlzLmhhbmRsZXIgPSBoYW5kbGVyXG59XG5cbi8qKlxuICogQ2hlY2sgd2hldGhlciBhIHZhbHVlIHNldCBicmVha3MgdGhlIHByb3ZpZGVkIGxpbWl0c1xuICovXG5cbkxpbWl0ZXIuY2hlY2sgPSBmdW5jdGlvbiBjaGVjayAodmFsdWVzKSB7XG4gIHZhbHVlcyA9IHRoaXMuY2hlY2tCb3VuZGFyeSgnbWluJywgdmFsdWVzKVxuICB2YWx1ZXMgPSB0aGlzLmNoZWNrQm91bmRhcnkoJ21heCcsIHZhbHVlcylcbiAgcmV0dXJuIHZhbHVlc1xufVxuXG4vKipcbiAqIENoZWNrcyBvbmUgc2lkZSBvZiB0aGUgcHJvdmlkZWQgbGltaXRzIChlaXRoZXIgJ21heCcgb3IgJ21pbicpIGFuZCByZXR1cm5zIHRoZVxuICogcmVzdWx0aW5nIHZhbHVlcyAob3IgdGhyb3dzIGFuIGVycm9yIGluIHRoZSBjYXNlIG9mICdzdHJpY3QnKVxuICovXG5cbkxpbWl0ZXIuY2hlY2tCb3VuZGFyeSA9IGZ1bmN0aW9uIChib3VuZGFyeSwgdmFsdWVzKSB7XG4gIHZhciBsaW1pdHMgPSB0aGlzW2JvdW5kYXJ5XVxuICBpZiAoIXZhbHVlcyB8fCAhbGltaXRzIHx8IHRoaXMuaGFuZGxlciA9PT0gJ3JhdycpIHJldHVybiB2YWx1ZXM7XG5cbiAgXy5lYWNoKGxpbWl0cywgZnVuY3Rpb24gKGxpbWl0LCBpKSB7XG4gICAgaWYgKHRoaXMuYnJlYWtzKGxpbWl0LCB2YWx1ZXNbaV0sIGJvdW5kYXJ5KSkge1xuICAgICAgaWYgKHRoaXMuaGFuZGxlciA9PT0gJ2NsaXAnKSB7XG4gICAgICAgIHZhbHVlc1tpXSA9IGxpbWl0XG4gICAgICB9IGVsc2UgaWYgKHRoaXMuaGFuZGxlciA9PT0gJ251bGxpZnknKSB7XG4gICAgICAgIHZhbHVlcyA9IG51bGxcbiAgICAgICAgcmV0dXJuIHZhbHVlc1xuICAgICAgfSBlbHNlIGlmICh0aGlzLmhhbmRsZXIgPT09ICdzdHJpY3QnKSB7XG4gICAgICAgIHZhciBndF9vcl9sdCA9IHRoaXMuaGFuZGxlciA9PT0gJ21heCcgPyAnbGVzcycgOiAnZ3JlYXRlcidcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdFeHBlY3RlZCAnICsgdmFsdWVzW2ldICsgJyB0byBiZSAnICsgZ3Rfb3JfbHQgKyAnIHRoYW4gb3IgZXF1YWwgdG8gJyArIGxpbWl0KVxuICAgICAgfVxuICAgIH1cbiAgfSwgdGhpcylcbiAgcmV0dXJuIHZhbHVlc1xufVxuXG4vKipcbiAqIFJldHVybnMgdHJ1ZSBpZiA8dmFsdWU+IGJyZWFrcyBhIGdpdmVuIDxsaW1pdD5cbiAqL1xuXG5MaW1pdGVyLmJyZWFrcyA9IGZ1bmN0aW9uIGJyZWFrc0xpbWl0IChsaW1pdCwgdmFsdWUsIGJvdW5kYXJ5KSB7XG4gIGlmIChib3VuZGFyeSA9PT0gJ21heCcpIHtcbiAgICByZXR1cm4gdmFsdWUgPiBsaW1pdFxuICB9IGVsc2UgaWYgKGJvdW5kYXJ5ID09PSAnbWluJykge1xuICAgIHJldHVybiB2YWx1ZSA8IGxpbWl0XG4gIH1cbn1cblxuLyoqXG4gKiBNZXJnZXMgdHdvIExpbWl0ZXJzLiBBbHdheXMgcHJlZmVycyB0ZWggbWluL21heCBkZWZpbml0aW9ucyBvZiB0aGUgZm9yZWlnbiBzdG9yZVxuICovXG5cbkxpbWl0ZXIubWVyZ2UgPSBmdW5jdGlvbiBtZXJnZSAoZm9yZWlnbl9saW1pdGVyKSB7XG4gIGlmIChmb3JlaWduX2xpbWl0ZXIubWluICE9PSB1bmRlZmluZWQpIHRoaXMubWluID0gZm9yZWlnbl9saW1pdGVyLm1pblxuICBpZiAoZm9yZWlnbl9saW1pdGVyLm1heCAhPT0gdW5kZWZpbmVkKSB0aGlzLm1heCA9IGZvcmVpZ25fbGltaXRlci5tYXhcbn1cblxuZXhwb3J0IGRlZmF1bHQgTGltaXRlclxuXG5cblxuLyoqIFdFQlBBQ0sgRk9PVEVSICoqXG4gKiogLi9saWIvTGltaXRlci5qc1xuICoqLyJdLCJzb3VyY2VSb290IjoiIn0=