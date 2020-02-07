"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.DateComponentPickerChromeBase = exports.DateComponentPickerChrome = exports["default"] = void 0;

var _kind = _interopRequireDefault(require("@enact/core/kind"));

var _react = _interopRequireDefault(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _DateComponentPickerModule = _interopRequireDefault(require("./DateComponentPicker.module.css"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _objectWithoutProperties(source, excluded) { if (source == null) return {}; var target = _objectWithoutPropertiesLoose(source, excluded); var key, i; if (Object.getOwnPropertySymbols) { var sourceSymbolKeys = Object.getOwnPropertySymbols(source); for (i = 0; i < sourceSymbolKeys.length; i++) { key = sourceSymbolKeys[i]; if (excluded.indexOf(key) >= 0) continue; if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue; target[key] = source[key]; } } return target; }

function _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }

/**
 * {@link moonstone/internal/DataComponentPicker.DateComponentPickerChrome} provides the surrounding
 * markup and styling for a {@link moonstone/internal/DateComponentPicker.DateComponentPicker} or
 * {@link moonstone/internal/DateComponentPicker.DateComponentRangePicker}.
 *
 * @class DateComponentPickerChrome
 * @memberof moonstone/internal/DateComponentPicker
 * @ui
 * @private
 */
var DateComponentPickerChromeBase = (0, _kind["default"])({
  name: 'DateComponentPickerChrome',
  propTypes:
  /** @lends moonstone/internal/DateComponentPicker.DateComponentPickerChrome.prototype */
  {
    /**
     * The {@link moonstone/Picker.Picker} component
     *
     * @type {Element}
     */
    children: _propTypes["default"].element,

    /**
     * The label to display below the picker
     *
     * @type {String}
     */
    label: _propTypes["default"].string
  },
  styles: {
    css: _DateComponentPickerModule["default"],
    className: 'dateComponentPicker'
  },
  render: function render(_ref) {
    var children = _ref.children,
        label = _ref.label,
        rest = _objectWithoutProperties(_ref, ["children", "label"]);

    return _react["default"].createElement("div", rest, _react["default"].Children.only(children), label ? _react["default"].createElement("div", {
      className: _DateComponentPickerModule["default"].label
    }, label) : null);
  }
});
exports.DateComponentPickerChromeBase = exports.DateComponentPickerChrome = DateComponentPickerChromeBase;
var _default = DateComponentPickerChromeBase;
exports["default"] = _default;