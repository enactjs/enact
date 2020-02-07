"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.SpottablePicker = exports["default"] = void 0;

var _kind = _interopRequireDefault(require("@enact/core/kind"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _react = _interopRequireDefault(require("react"));

var _Spottable = _interopRequireDefault(require("@enact/spotlight/Spottable"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _objectWithoutProperties(source, excluded) { if (source == null) return {}; var target = _objectWithoutPropertiesLoose(source, excluded); var key, i; if (Object.getOwnPropertySymbols) { var sourceSymbolKeys = Object.getOwnPropertySymbols(source); for (i = 0; i < sourceSymbolKeys.length; i++) { key = sourceSymbolKeys[i]; if (excluded.indexOf(key) >= 0) continue; if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue; target[key] = source[key]; } } return target; }

function _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }

var Div = (0, _Spottable["default"])('div');
var SpottablePicker = (0, _kind["default"])({
  name: 'SpottablePicker',
  propTypes: {
    disabled: _propTypes["default"].bool,
    orientation: _propTypes["default"].string
  },
  computed: {
    selectionKeys: function selectionKeys(_ref) {
      var disabled = _ref.disabled,
          orientation = _ref.orientation;
      if (disabled) return;
      return orientation === 'horizontal' ? [37, 39] : [38, 40];
    }
  },
  render: function render(_ref2) {
    var selectionKeys = _ref2.selectionKeys,
        rest = _objectWithoutProperties(_ref2, ["selectionKeys"]);

    delete rest.orientation;
    return _react["default"].createElement(Div, Object.assign({}, rest, {
      selectionKeys: selectionKeys
    }));
  }
});
exports.SpottablePicker = SpottablePicker;
var _default = SpottablePicker;
exports["default"] = _default;