"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
Object.defineProperty(exports, "configureExpandable", {
  enumerable: true,
  get: function get() {
    return _useExpandable.configureExpandable;
  }
});
Object.defineProperty(exports, "useExpandable", {
  enumerable: true,
  get: function get() {
    return _useExpandable.useExpandable;
  }
});
exports.Expandable = exports["default"] = void 0;

var _hoc = _interopRequireDefault(require("@enact/core/hoc"));

var _react = _interopRequireDefault(require("react"));

var _useExpandable = require("./useExpandable");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

/**
 * A higher-order component that manages the open state of a component and adds {@link ui/Cancelable.Cancelable}
 * support to call the `onClose` handler on
 * cancel.
 *
 * @class Expandable
 * @memberof moonstone/ExpandableItem
 * @mixes ui/Toggleable.Toggleable
 * @mixes ui/RadioDecorator.RadioDecorator
 * @mixes ui/Cancelable.Cancelable
 * @hoc
 * @public
 */
var Expandable = (0, _hoc["default"])(_useExpandable.defaultConfig, function (config, Wrapped) {
  var hook = (0, _useExpandable.configureExpandable)(config); // eslint-disable-next-line no-shadow

  return function Expandable(props) {
    return _react["default"].createElement(Wrapped, Object.assign({}, props, hook(props)));
  };
});
exports.Expandable = Expandable;
var _default = Expandable;
exports["default"] = _default;