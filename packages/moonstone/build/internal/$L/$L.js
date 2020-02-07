"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.$L = $L;
exports.clearResBundle = clearResBundle;
exports.createResBundle = createResBundle;
exports.setResBundle = setResBundle;
exports["default"] = void 0;

var _resBundle = require("@enact/i18n/src/resBundle");

var _ResBundle = _interopRequireDefault(require("ilib/lib/ResBundle"));

var _ilib = _interopRequireDefault(require("ilib"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { _defineProperty(target, key, source[key]); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

// The ilib.ResBundle for the active locale used by $L
var resBundle; // The ilib.data cache object for moonstone ilib usage

var cache = {};
/**
 * Returns the current ilib.ResBundle
 *
 * @returns {ilib.ResBundle} Current ResBundle
 */

function getResBundle() {
  return resBundle;
}
/**
 * Creates a new ilib.ResBundle for string translation
 *
 * @param  {ilib.Locale} locale Locale for ResBundle
 *
 * @returns {Promise|ResBundle} Resolves with a new ilib.ResBundle
 */


function createResBundle(options) {
  var opts = options;

  if (typeof ILIB_MOONSTONE_PATH !== 'undefined') {
    opts = _objectSpread({
      loadParams: {
        // Deprecated; to be removed in future
        root: ILIB_MOONSTONE_PATH
      },
      basePath: ILIB_MOONSTONE_PATH
    }, options);
  }

  if (!opts.onLoad) return; // Swap out app cache for moonstone's

  var appCache = _ilib["default"].data;
  _ilib["default"].data = global.moonstoneILibCache || cache; // eslint-disable-next-line no-new

  new _ResBundle["default"](_objectSpread({}, opts, {
    onLoad: function onLoad(bundle) {
      _ilib["default"].data = appCache;
      opts.onLoad(bundle || null);
    }
  }));
}
/**
 * Deletes the current bundle object of strings and clears the cache.
 * @returns {undefined}
 */


function clearResBundle() {
  delete _ResBundle["default"].strings;
  delete _ResBundle["default"].sysres;
  cache = {};
  resBundle = null;
}
/**
 * Set the locale for the strings that $L loads. This may reload the
 * string resources if necessary.
 *
 * @param {string} spec the locale specifier
 * @returns {ilib.ResBundle} Current ResBundle
 */


function setResBundle(bundle) {
  return resBundle = bundle;
}

function toIString(str) {
  var rb = getResBundle();

  if (!rb) {
    createResBundle({
      sync: true,
      onLoad: setResBundle
    });
  }

  return (0, _resBundle.getIStringFromBundle)(str, rb);
}
/**
 * Maps a string or key/value object to a translated string for the current locale.
 *
 * @function
 * @memberof i18n/$L
 * @param  {String|Object} str Source string
 *
 * @returns {String} The translated string
 */


function $L(str) {
  return String(toIString(str));
}

var _default = $L;
exports["default"] = _default;