"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.DateComponentRangePickerBase = exports.DateComponentRangePicker = exports["default"] = void 0;

var _Changeable = _interopRequireDefault(require("@enact/ui/Changeable"));

var _kind = _interopRequireDefault(require("@enact/core/kind"));

var _react = _interopRequireDefault(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _RangePicker = _interopRequireDefault(require("../../RangePicker"));

var _DateComponentPickerChrome = _interopRequireDefault(require("./DateComponentPickerChrome"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _objectWithoutProperties(source, excluded) { if (source == null) return {}; var target = _objectWithoutPropertiesLoose(source, excluded); var key, i; if (Object.getOwnPropertySymbols) { var sourceSymbolKeys = Object.getOwnPropertySymbols(source); for (i = 0; i < sourceSymbolKeys.length; i++) { key = sourceSymbolKeys[i]; if (excluded.indexOf(key) >= 0) continue; if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue; target[key] = source[key]; } } return target; }

function _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }

/**
 * {@link moonstone/internal/DataComponentPicker.DateComponentRangePicker} allows the selection of
 * one part of the date or time using a {@link moonstone/RangePicker.RangePicker}.
 *
 * @class DateComponentRangePickerBase
 * @memberof moonstone/internal/DateComponentPicker
 * @ui
 * @private
 */
var DateComponentRangePickerBase = (0, _kind["default"])({
  name: 'DateComponentRangePicker',
  propTypes:
  /** @lends moonstone/internal/DateComponentPicker.DateComponentRangePickerBase.prototype */
  {
    /**
     * The maximum value for the date component
     *
     * @type {Number}
     * @required
     */
    max: _propTypes["default"].number.isRequired,

    /**
     * The minimum value for the date component
     *
     * @type {Number}
     * @required
     */
    min: _propTypes["default"].number.isRequired,

    /**
     * The value of the date component
     *
     * @type {Number}
     * @required
     */
    value: _propTypes["default"].number.isRequired,

    /**
     * Sets the hint string read when focusing the picker.
     *
     * @type {String}
     * @public
     */
    accessibilityHint: _propTypes["default"].string,

    /**
     * The label to display below the picker
     *
     * @type {String}
     */
    label: _propTypes["default"].string,

    /**
     * By default, the picker will animate transitions between items if it has a defined
     * `width`. Specifying `noAnimation` will prevent any transition animation for the
     * component.
     *
     * @type {Boolean}
     * @public
     */
    noAnimation: _propTypes["default"].bool,

    /*
     * When `true`, allow the picker to continue from the opposite end of the list of options.
     *
     * @type {Boolean}
     * @public
     */
    wrap: _propTypes["default"].bool
  },
  computed: {
    voiceLabel: function voiceLabel(_ref) {
      var min = _ref.min,
          max = _ref.max;
      return JSON.stringify([min, max]);
    }
  },
  render: function render(_ref2) {
    var accessibilityHint = _ref2.accessibilityHint,
        className = _ref2.className,
        label = _ref2.label,
        max = _ref2.max,
        min = _ref2.min,
        noAnimation = _ref2.noAnimation,
        value = _ref2.value,
        wrap = _ref2.wrap,
        voiceLabel = _ref2.voiceLabel,
        rest = _objectWithoutProperties(_ref2, ["accessibilityHint", "className", "label", "max", "min", "noAnimation", "value", "wrap", "voiceLabel"]);

    return _react["default"].createElement(_DateComponentPickerChrome["default"], {
      className: className,
      label: label
    }, _react["default"].createElement(_RangePicker["default"], Object.assign({}, rest, {
      accessibilityHint: accessibilityHint == null ? label : accessibilityHint,
      "data-webos-voice-labels-ext": voiceLabel,
      joined: true,
      max: max,
      min: min,
      noAnimation: noAnimation,
      orientation: "vertical",
      value: value,
      wrap: wrap
    })));
  }
});
/**
 * {@link moonstone/internal/DateComponentPicker.DateComponentRangePicker} allows the selection of one
 * part of the date (date, month, or year). It is a stateful component but allows updates by
 * providing a new `value` via props.
 *
 * @class DateComponentRangePicker
 * @memberof moonstone/internal/DateComponentPicker
 * @mixes ui/Changeable.Changeable
 * @ui
 * @private
 */

exports.DateComponentRangePickerBase = DateComponentRangePickerBase;
var DateComponentRangePicker = (0, _Changeable["default"])(DateComponentRangePickerBase);
exports.DateComponentRangePicker = DateComponentRangePicker;
var _default = DateComponentRangePicker;
exports["default"] = _default;