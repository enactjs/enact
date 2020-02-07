"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.SelectableIconBase = exports.Selectable = exports["default"] = void 0;

var _kind = _interopRequireDefault(require("@enact/core/kind"));

var _react = _interopRequireDefault(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _ToggleIcon = _interopRequireDefault(require("../ToggleIcon"));

var _SelectableIconModule = _interopRequireDefault(require("./SelectableIcon.module.css"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _objectWithoutProperties(source, excluded) { if (source == null) return {}; var target = _objectWithoutPropertiesLoose(source, excluded); var key, i; if (Object.getOwnPropertySymbols) { var sourceSymbolKeys = Object.getOwnPropertySymbols(source); for (i = 0; i < sourceSymbolKeys.length; i++) { key = sourceSymbolKeys[i]; if (excluded.indexOf(key) >= 0) continue; if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue; target[key] = source[key]; } } return target; }

function _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }

/**
 * Renders a circle shaped component which supports a Boolean state.
 *
 * @class SelectableIconBase
 * @memberof moonstone/SelectableIcon
 * @extends moonstone/ToggleIcon.ToggleIcon
 * @ui
 * @private
 */
var SelectableIconBase = (0, _kind["default"])({
  name: 'SelectableIcon',
  propTypes: {
    children: _propTypes["default"].string
  },
  defaultProps: {
    children: 'circle'
  },
  render: function render(_ref) {
    var children = _ref.children,
        rest = _objectWithoutProperties(_ref, ["children"]);

    return _react["default"].createElement(_ToggleIcon["default"], Object.assign({}, rest, {
      css: _SelectableIconModule["default"]
    }), children);
  }
});
exports.SelectableIconBase = exports.Selectable = SelectableIconBase;
var _default = SelectableIconBase;
exports["default"] = _default;