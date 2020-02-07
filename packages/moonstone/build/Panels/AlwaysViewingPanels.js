"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.AlwaysViewingPanels = exports["default"] = void 0;

var _resolution = require("@enact/ui/resolution");

var _Slottable = _interopRequireDefault(require("@enact/ui/Slottable"));

var _Measurable = _interopRequireDefault(require("@enact/ui/Measurable"));

var _compose = _interopRequireDefault(require("ramda/src/compose"));

var _Skinnable = _interopRequireDefault(require("../Skinnable"));

var _Arrangers = require("./Arrangers");

var _Breadcrumb = require("./Breadcrumb");

var _BreadcrumbDecorator = _interopRequireDefault(require("./BreadcrumbDecorator"));

var _Viewport = _interopRequireDefault(require("./Viewport"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

/*
 * Calculates the number of breadcrumbs that would fit in half of the viewport
 *
 * @param {Number} viewportWidth inner width of the viewport (usually the window)
 * @param {Number} width         width of a breadcrumb
 *
 * @returns {Number} Number of breadcrumbs that can completely fit in that space
 * @private
 */
var calcMax = function calcMax() {
  if ((typeof window === "undefined" ? "undefined" : _typeof(window)) === 'object') {
    return Math.floor(window.innerWidth / 2 / (0, _resolution.scale)(_Breadcrumb.breadcrumbWidth));
  }
};

var AlwaysViewingPanelsDecorator = (0, _compose["default"])((0, _Slottable["default"])({
  slots: ['controls']
}), (0, _Measurable["default"])({
  refProp: 'controlsRef',
  measurementProp: 'controlsMeasurements'
}), _Skinnable["default"], (0, _BreadcrumbDecorator["default"])({
  className: 'panels alwaysViewing enact-fit',
  max: calcMax,
  panelArranger: _Arrangers.AlwaysViewingArranger
}));
/**
 * An instance of [`Panels`]{@link moonstone/Panels.Panels} which restricts the `Panel` to the right
 * half of the screen with the left half used for breadcrumbs that allow navigating to previous
 * panels. Typically used for overlaying panels over a screen.
 *
 * @class AlwaysViewingPanels
 * @memberof moonstone/Panels
 * @ui
 * @public
 */

var AlwaysViewingPanels = AlwaysViewingPanelsDecorator(_Viewport["default"]);
exports.AlwaysViewingPanels = AlwaysViewingPanels;
var _default = AlwaysViewingPanels;
exports["default"] = _default;