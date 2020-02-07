"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ExpandableTransitionContainerBase = exports.ExpandableTransitionContainer = exports["default"] = void 0;

var _Resizable = _interopRequireDefault(require("@enact/ui/Resizable"));

var _SpotlightContainerDecorator = _interopRequireDefault(require("@enact/spotlight/SpotlightContainerDecorator"));

var _Transition = _interopRequireDefault(require("@enact/ui/Transition"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

/**
 * Changes spotlight focus to transition container when opening the container if the previously focused
 * component is contained.
 *
 * @class ExpandableTransitionContainer
 * @private
 */
var ExpandableTransitionContainerBase = (0, _SpotlightContainerDecorator["default"])((0, _Resizable["default"])({
  resize: 'onTransitionEnd',
  filter: function filter(ev) {
    return ev.propertyName === 'height';
  }
}, _Transition["default"]));
exports.ExpandableTransitionContainerBase = exports.ExpandableTransitionContainer = ExpandableTransitionContainerBase;
var _default = ExpandableTransitionContainerBase;
exports["default"] = _default;