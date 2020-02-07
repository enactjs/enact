"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
Object.defineProperty(exports, "MarqueeBase", {
  enumerable: true,
  get: function get() {
    return _Marquee.MarqueeBase;
  }
});
Object.defineProperty(exports, "MarqueeController", {
  enumerable: true,
  get: function get() {
    return _Marquee.MarqueeController;
  }
});
exports.MarqueeDecorator = exports.Marquee = exports["default"] = void 0;

var _hoc = _interopRequireDefault(require("@enact/core/hoc"));

var _I18nDecorator = require("@enact/i18n/I18nDecorator");

var _util = require("@enact/i18n/util");

var _Marquee = require("@enact/ui/Marquee");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

/**
 * Provides components for displaying and controlling marqueed text.
 *
 * @example
 * <Marquee marqueeOn="render">Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</Marquee>
 *
 * @see ui/Marquee
 * @module moonstone/Marquee
 * @exports Marquee
 * @exports MarqueeBase
 * @exports MarqueeController
 * @exports MarqueeDecorator
 */
var MarqueeDecorator = (0, _hoc["default"])({
  marqueeDirection: function marqueeDirection(str) {
    return (0, _util.isRtlText)(str) ? 'rtl' : 'ltr';
  }
}, function (config, Wrapped) {
  return (0, _I18nDecorator.I18nContextDecorator)({
    rtlProp: 'rtl',
    localeProp: 'locale'
  }, (0, _Marquee.MarqueeDecorator)(config, Wrapped));
});
exports.MarqueeDecorator = MarqueeDecorator;
var Marquee = MarqueeDecorator('div');
exports.Marquee = Marquee;
var _default = Marquee;
exports["default"] = _default;