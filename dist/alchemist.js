(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["alchemist"] = factory();
	else
		root["alchemist"] = factory();
})(this, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

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

	var _libIndex = __webpack_require__(8);

	var _libIndex2 = _interopRequireDefault(_libIndex);

	_libIndex2['default'].use(_alchemistCommon2['default']);

	var common = function common() {
	  return _alchemistCommon2['default'];
	};

	_libIndex2['default'].common = common;

	module.exports = _libIndex2['default'];

/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, '__esModule', {
	  value: true
	});

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

	var _alchemistRgb = __webpack_require__(3);

	var _alchemistRgb2 = _interopRequireDefault(_alchemistRgb);

	var _alchemistXyz = __webpack_require__(4);

	var _alchemistXyz2 = _interopRequireDefault(_alchemistXyz);

	var _alchemistHsl = __webpack_require__(5);

	var _alchemistHsl2 = _interopRequireDefault(_alchemistHsl);

	var _alchemistLab = __webpack_require__(6);

	var _alchemistLab2 = _interopRequireDefault(_alchemistLab);

	var _alchemistLchab = __webpack_require__(7);

	var _alchemistLchab2 = _interopRequireDefault(_alchemistLchab);

	exports['default'] = [(0, _alchemistXyz2['default'])(), (0, _alchemistRgb2['default'])(), (0, _alchemistHsl2['default'])(), (0, _alchemistLab2['default'])(), (0, _alchemistLchab2['default'])()];
	module.exports = exports['default'];

/***/ },
/* 3 */
/***/ function(module, exports) {

	/*
	 * Alchemist-rgb
	 *
	 * Author: Michael C. Mullins
	 * License: MIT
	 *
	 * This RGB implementation uses sRGB companding. There are other forms
	 * such as L* and Gamma companding. If you would like to see these
	 * implemented, post an issue on github and I'll try to work it in.
	 *
	 * Special thanks to Bruce Lindbloom not only for his color formulas
	 * but for his color converter as well, both of which played a major
	 * role in this module.
	 *
	 * You can find his site here:
	 * http://www.brucelindbloom.com/
	 *
	 */

	'use strict';

	Object.defineProperty(exports, '__esModule', {
	  value: true
	});
	exports['default'] = rgb;

	function rgb() {
	  return function initializer(alchemist) {
	    var inverseCompand = function inverseCompand(companded) {
	      return companded <= 0.04045 ? companded / 12.92 : Math.pow((companded + 0.055) / 1.055, 2.4);
	    };

	    var compand = function compand(linear) {
	      return linear <= 0.0031308 ? linear * 12.92 : 1.055 * Math.pow(linear, 1.0 / 2.4) - 0.055;
	    };

	    var determinant3x3 = function determinant3x3(m) {
	      var left_product, right_product, lr, lc, rr, rc, c;
	      var size = 3;
	      var left_diags = 0;
	      var right_diags = 0;

	      for (var col = 0; col < size; col++) {
	        left_product = 1;
	        right_product = 1;
	        for (var row = 0; row < size; row++) {
	          lr = row;
	          rr = size - row - 1;
	          c = col + row;
	          if (c >= size) c -= size;
	          left_product *= m[lr][c];
	          right_product *= m[rr][c];
	        }
	        left_diags += left_product;
	        right_diags -= right_product;
	      }

	      return left_diags + right_diags;
	    };

	    var invert3x3 = function invert3x3(m) {
	      var im = [[], [], []];
	      var scale = 1 / determinant3x3(m);

	      im[0][0] = scale * (m[2][2] * m[1][1] - m[2][1] * m[1][2]);
	      im[0][1] = -scale * (m[2][2] * m[0][1] - m[2][1] * m[0][2]);
	      im[0][2] = scale * (m[1][2] * m[0][1] - m[1][1] * m[0][2]);

	      im[1][0] = -scale * (m[2][2] * m[1][0] - m[2][0] * m[1][2]);
	      im[1][1] = scale * (m[2][2] * m[0][0] - m[2][0] * m[0][2]);
	      im[1][2] = -scale * (m[1][2] * m[0][0] - m[1][0] * m[0][2]);

	      im[2][0] = scale * (m[2][1] * m[1][0] - m[2][0] * m[1][1]);
	      im[2][1] = -scale * (m[2][1] * m[0][0] - m[2][0] * m[0][1]);
	      im[2][2] = scale * (m[1][1] * m[0][0] - m[1][0] * m[0][1]);

	      return im;
	    };

	    var transformationMatrix = function computeMatrix(r, g, b, white) {
	      var m = [[r.x / r.y, g.x / g.y, b.x / b.y], [1.0, 1.0, 1.0], [(1 - r.x - r.y) / r.y, (1 - g.x - g.y) / g.y, (1 - b.x - b.y) / b.y]];
	      var mi = invert3x3(m);

	      var sr = white.X * mi[0][0] + white.Y * mi[0][1] + white.Z * mi[0][2];
	      var sg = white.X * mi[1][0] + white.Y * mi[1][1] + white.Z * mi[1][2];
	      var sb = white.X * mi[2][0] + white.Y * mi[2][1] + white.Z * mi[2][2];

	      m[0][0] *= sr;
	      m[0][1] *= sg;
	      m[0][2] *= sb;

	      m[1][0] *= sr;
	      m[1][1] *= sg;
	      m[1][2] *= sb;

	      m[2][0] *= sr;
	      m[2][1] *= sg;
	      m[2][2] *= sb;

	      return m;
	    };

	    // chromacity cooridinates
	    var rc = { x: 0.64, y: 0.33 };
	    var gc = { x: 0.30, y: 0.60 };
	    var bc = { x: 0.15, y: 0.06 };

	    var m = transformationMatrix(rc, gc, bc, alchemist.white);
	    var im = invert3x3(m);

	    return {
	      name: 'rgb',
	      limits: {
	        max: [255, 255, 255],
	        min: [0, 0, 0]
	      },
	      to: { 'xyz': function xyz(R, G, B) {
	          var r = inverseCompand(R / 255);
	          var g = inverseCompand(G / 255);
	          var b = inverseCompand(B / 255);
	          var X = r * m[0][0] + g * m[0][1] + b * m[0][2];
	          var Y = r * m[1][0] + g * m[1][1] + b * m[1][2];
	          var Z = r * m[2][0] + g * m[2][1] + b * m[2][2];
	          return [X, Y, Z];
	        } },
	      from: { 'xyz': function xyz(X, Y, Z) {
	          var R = compand(X * im[0][0] + Y * im[0][1] + Z * im[0][2]) * 255;
	          var G = compand(X * im[1][0] + Y * im[1][1] + Z * im[1][2]) * 255;
	          var B = compand(X * im[2][0] + Y * im[2][1] + Z * im[2][2]) * 255;
	          return [R, G, B];
	        } }
	    };
	  };
	}

	module.exports = exports['default'];

/***/ },
/* 4 */
/***/ function(module, exports) {

	'use strict';

	Object.defineProperty(exports, '__esModule', {
	  value: true
	});
	exports['default'] = xyz;

	function xyz() {
	  return {
	    name: 'xyz',
	    to: {}
	  };
	}

	module.exports = exports['default'];

/***/ },
/* 5 */
/***/ function(module, exports) {

	/*
	 * Alchemist-hsl
	 *
	 * Author: Michael C. Mullins
	 * License: MIT
	 *
	 * Even though I am technically the author of this module, these conversions
	 * were blatantly copied form harthor's color-convert project. Many thanks
	 * to her and all of that project's contributers!
	 *
	 * You can find color-convert here: https://github.com/harthur/color-convert
	 */

	'use strict';

	Object.defineProperty(exports, '__esModule', {
	  value: true
	});
	exports['default'] = hsl;

	function hsl() {
	  return {
	    name: 'hsl',
	    limits: {
	      max: [360, 1, 1],
	      min: [0, 0, 0]
	    },
	    to: {
	      'rgb': function hsl2rgb(h, s, l) {
	        var t1, t2, t3, rgb, val;

	        h /= 360;

	        if (s == 0) {
	          val = l * 255;
	          return [val, val, val];
	        }

	        if (l < 0.5) t2 = l * (1 + s);else t2 = l + s - l * s;
	        t1 = 2 * l - t2;

	        rgb = [0, 0, 0];

	        for (var i = 0; i < 3; i++) {
	          t3 = h + 1 / 3 * -(i - 1);
	          t3 < 0 && t3++;
	          t3 > 1 && t3--;
	          if (6 * t3 < 1) val = t1 + (t2 - t1) * 6 * t3;else if (2 * t3 < 1) val = t2;else if (3 * t3 < 2) val = t1 + (t2 - t1) * (2 / 3 - t3) * 6;else val = t1;

	          rgb[i] = val * 255;
	        }
	        return rgb;
	      }
	    },

	    from: {
	      'rgb': function rgb2hsl(r, g, b) {
	        var h, s, l, min, max, delta;

	        r /= 255;
	        g /= 255;
	        b /= 255;

	        min = Math.min(r, g, b);
	        max = Math.max(r, g, b);
	        delta = max - min;

	        if (max == min) h = 0;else if (r == max) h = (g - b) / delta;else if (g == max) h = 2 + (b - r) / delta;else if (b == max) h = 4 + (r - g) / delta;
	        h = Math.min(h * 60, 360);

	        if (h < 0) h += 360;
	        l = (min + max) / 2;
	        if (max == min) s = 0;else if (l <= 0.5) s = delta / (max + min);else s = delta / (2 - max - min);

	        return [h, s, l];
	      }
	    }
	  };
	}

	module.exports = exports['default'];

/***/ },
/* 6 */
/***/ function(module, exports) {

	/*
	 * Alchemist-lab
	 *
	 * Author: Michael C. Mullins
	 * License: MIT
	 *
	 * Special thanks to Bruce Lindbloom not only for his color formulas
	 * but for his color converter as well, both of which played a major
	 * role in this module.
	 *
	 * You can find his site here:
	 * http://www.brucelindbloom.com/
	 *
	 */

	'use strict';

	Object.defineProperty(exports, '__esModule', {
	  value: true
	});
	exports['default'] = lab;

	function lab() {
	  return function Initializer(alchemist) {
	    var kE = 216 / 24389; // 0.08856
	    var kK = 24389 / 27; // 903.3
	    var kKE = 8;
	    var rW = alchemist.white;

	    return {
	      name: 'lab',
	      to: {
	        'xyz': function xyz(L, a, b) {
	          var fy = (L + 16.0) / 116.0;
	          var fx = 0.002 * a + fy;
	          var fz = fy - 0.005 * b;

	          var fx3 = fx * fx * fx;
	          var fz3 = fz * fz * fz;

	          var xr = fx3 > kE ? fx3 : (116.0 * fx - 16.0) / kK;
	          var yr = L > kKE ? Math.pow((L + 16.0) / 116.0, 3.0) : L / kK;
	          var zr = fz3 > kE ? fz3 : (116.0 * fz - 16.0) / kK;

	          var X = xr * rW.X;
	          var Y = yr * rW.Y;
	          var Z = zr * rW.Z;

	          return [X, Y, Z];
	        }
	      },
	      from: {
	        'xyz': function xyz(X, Y, Z) {
	          var f = function f(x) {
	            return x > kE ? Math.pow(x, 1 / 3) : (kK * x + 16) / 116;
	          };

	          // Values adjusted to reference white and ran through adjustment curve
	          var fx = f(X / rW.X);
	          var fy = f(Y / rW.Y);
	          var fz = f(Z / rW.Z);

	          var L = 116 * fy - 16;
	          var a = 500 * (fx - fy);
	          var b = 200 * (fy - fz);

	          return [L, a, b];
	        }
	      }
	    };
	  };
	}

	module.exports = exports['default'];

/***/ },
/* 7 */
/***/ function(module, exports) {

	/*
	 * Alchemist-lchab
	 *
	 * Author: Michael C. Mullins
	 * License: MIT
	 *
	 * Special thanks to Bruce Lindbloom not only for his color formulas
	 * but for his color converter as well, both of which played a major
	 * role in this module.
	 *
	 * You can find his site here:
	 * http://www.brucelindbloom.com/
	 *
	 */

	'use strict';

	Object.defineProperty(exports, '__esModule', {
	  value: true
	});
	exports['default'] = lchab;

	function lchab() {
	  return {
	    name: 'lchab',
	    to: { 'lab': function lab(L, C, H) {
	        var a = C * Math.cos(H * Math.PI / 180);
	        var b = C * Math.sin(H * Math.PI / 180);

	        return [L, a, b];
	      } },
	    from: { 'lab': function lab(L, a, b) {
	        var C = Math.sqrt(a * a + b * b);
	        var H = 180 * Math.atan2(b, a) / Math.PI;
	        if (H < 0) H += 360;
	        return [L, C, H];
	      } }
	  };
	}

	module.exports = exports['default'];

/***/ },
/* 8 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, '__esModule', {
	  value: true
	});

	function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj['default'] = obj; return newObj; } }

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

	var _plugins = __webpack_require__(9);

	var _plugins2 = _interopRequireDefault(_plugins);

	var _color = __webpack_require__(15);

	var _color2 = _interopRequireDefault(_color);

	var _converter = __webpack_require__(16);

	var _converter2 = _interopRequireDefault(_converter);

	var _colorSpaceStore = __webpack_require__(10);

	var _colorSpaceStore2 = _interopRequireDefault(_colorSpaceStore);

	var _Limiter = __webpack_require__(17);

	var _Limiter2 = _interopRequireDefault(_Limiter);

	var _helpers = __webpack_require__(12);

	var helpers = _interopRequireWildcard(_helpers);

	var _stateless = __webpack_require__(13);

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
/* 9 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, '__esModule', {
	  value: true
	});

	function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj['default'] = obj; return newObj; } }

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

	var _colorSpaceStore = __webpack_require__(10);

	var _colorSpaceStore2 = _interopRequireDefault(_colorSpaceStore);

	var _conversionStore = __webpack_require__(14);

	var _conversionStore2 = _interopRequireDefault(_conversionStore);

	var _helpers = __webpack_require__(12);

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
/* 10 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, '__esModule', {
	  value: true
	});

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

	var _storage = __webpack_require__(11);

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
/* 11 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, '__esModule', {
	  value: true
	});

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

	function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj['default'] = obj; return newObj; } }

	var _helpers = __webpack_require__(12);

	var helpers = _interopRequireWildcard(_helpers);

	var _stateless = __webpack_require__(13);

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
/* 12 */
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
/* 13 */
/***/ function(module, exports) {

	'use strict';

	module.exports = Object.defineProperties({
	  create: function create() {
	    var obj = Object.create(this);
	    obj.init.apply(obj, arguments);
	    return obj;
	  },

	  extend: function extend() {
	    return Object.create(this);
	  },

	  init: function init() {
	    Object.defineProperty(this, '_keep', {
	      configurable: true,
	      enumerable: false,
	      writable: true,
	      value: Object.getOwnPropertyNames(this)
	    });
	    if (this.initializer) this.initializer.apply(this, arguments);
	    return this;
	  },

	  reset: function reset() {
	    var keys = Object.keys(this);
	    newKeys = keys.filter(isNotIn(this._keep));
	    newKeys_len = newKeys.length;
	    for (var i = 0; i < newKeys_len; i++) {
	      delete this[newKeys[i]];
	    }
	    return this;
	  }

	}, {
	  proto: {
	    get: function get() {
	      return Object.getPrototypeOf(this);
	    },
	    set: function set(object) {
	      if (Object.setPrototypeOf) Object.setPrototypeOf(object);else this.__proto__ = object;
	    },
	    configurable: true,
	    enumerable: true
	  }
	});

	function isNotIn(array) {
	  return function isNew(key) {
	    arr_len = array.length;
	    return array.indexOf(key) < 0;
	  };
	}

/***/ },
/* 14 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, '__esModule', {
	  value: true
	});

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

	var _storage = __webpack_require__(11);

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
/* 15 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, '__esModule', {
	  value: true
	});

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

	function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj['default'] = obj; return newObj; } }

	var _helpers = __webpack_require__(12);

	var _ = _interopRequireWildcard(_helpers);

	var _stateless = __webpack_require__(13);

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
/* 16 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, '__esModule', {
	  value: true
	});

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

	function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj['default'] = obj; return newObj; } }

	var _helpers = __webpack_require__(12);

	var helpers = _interopRequireWildcard(_helpers);

	var _stateless = __webpack_require__(13);

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
/* 17 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, '__esModule', {
	  value: true
	});

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

	function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj['default'] = obj; return newObj; } }

	var _helpers = __webpack_require__(12);

	var _ = _interopRequireWildcard(_helpers);

	var _stateless = __webpack_require__(13);

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
/******/ ])
});
;