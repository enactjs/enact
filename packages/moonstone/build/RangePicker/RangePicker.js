"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.RangePickerBase = exports.RangePicker = exports["default"] = void 0;

var _kind = _interopRequireDefault(require("@enact/core/kind"));

var _util = require("@enact/core/util");

var _Changeable = _interopRequireDefault(require("@enact/ui/Changeable"));

var _Pure = _interopRequireDefault(require("@enact/ui/internal/Pure"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _react = _interopRequireDefault(require("react"));

var _Picker = require("../internal/Picker");

var _validators = require("../internal/validators");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _objectWithoutProperties(source, excluded) { if (source == null) return {}; var target = _objectWithoutPropertiesLoose(source, excluded); var key, i; if (Object.getOwnPropertySymbols) { var sourceSymbolKeys = Object.getOwnPropertySymbols(source); for (i = 0; i < sourceSymbolKeys.length; i++) { key = sourceSymbolKeys[i]; if (excluded.indexOf(key) >= 0) continue; if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue; target[key] = source[key]; } } return target; }

function _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }

var digits = function digits(num) {
  // minor optimization
  return num > -10 && num < 10 && 1 || num > -100 && num < 100 && 2 || num > -1000 && num < 1000 && 3 || Math.floor(Math.log(Math.abs(num)) * Math.LOG10E) + 1;
};
/**
 * RangePicker base component.
 *
 * @class RangePickerBase
 * @memberof moonstone/RangePicker
 * @ui
 * @public
 */


var RangePickerBase = (0, _kind["default"])({
  name: 'RangePicker',
  propTypes:
  /** @lends moonstone/RangePicker.RangePickerBase.prototype */
  {
    /**
     * The maximum value selectable by the picker (inclusive).
     *
     * The range between `min` and `max` should be evenly divisible by
     * [step]{@link moonstone/RangePicker.RangePickerBase.step}.
     *
     * @type {Number}
     * @required
     * @public
     */
    max: _propTypes["default"].number.isRequired,

    /**
     * The minimum value selectable by the picker (inclusive).
     *
     * The range between `min` and `max` should be evenly divisible by
     * [step]{@link moonstone/RangePicker.RangePickerBase.step}.
     *
     * @type {Number}
     * @required
     * @public
     */
    min: _propTypes["default"].number.isRequired,

    /**
     * Current value.
     *
     * @type {Number}
     * @required
     * @public
     */
    value: _propTypes["default"].number.isRequired,

    /**
     * The `aria-valuetext` for the picker.
     *
     * By default, `aria-valuetext` is set to the current selected child value.
     *
     * @type {String}
     * @memberof moonstone/RangePicker.RangePickerBase.prototype
     * @public
     */
    'aria-valuetext': _propTypes["default"].string,

    /**
     * Children from which to pick.
     *
     * @type {Node}
     * @public
     */
    children: _propTypes["default"].node,

    /**
     * Class name for component.
     *
     * @type {String}
     * @public
     */
    className: _propTypes["default"].string,

    /**
     * A custom icon for the decrementer.
     *
     * All strings supported by [Icon]{@link moonstone/Icon.Icon} are supported. Without a
     * custom icon, the default is used, and is automatically changed when the
     * [orientation]{@link moonstone/RangePicker.RangePicker#orientation} is changed.
     *
     * @type {string}
     * @public
     */
    decrementIcon: _propTypes["default"].string,

    /**
     * Disables the picker.
     *
     * @type {Boolean}
     * @public
     */
    disabled: _propTypes["default"].bool,

    /**
     * A custom icon for the incrementer.
     *
     * All strings supported by [Icon]{@link moonstone/Icon.Icon} are supported. Without a
     * custom icon, the default is used, and is automatically changed when the
     * [orientation]{@link moonstone/RangePicker.RangePicker#orientation} is changed.
     *
     * @type {String}
     * @public
     */
    incrementIcon: _propTypes["default"].string,

    /**
     * Allows the user can use the arrow keys to adjust the picker's value.
     *
     * The user may no longer use those arrow keys to navigate while this control is focused.
     * A default control allows full navigation, but requires individual ENTER presses on the
     * incrementer and decrementer buttons. Pointer interaction is the same for both formats.
     *
     * @type {Boolean}
     * @public
     */
    joined: _propTypes["default"].bool,

    /**
     * Disables animation.
     *
     * By default, the picker will animate transitions between items, provided a `width` is
     * defined.
     *
     * @type {Boolean}
     * @public
     */
    noAnimation: _propTypes["default"].bool,

    /**
     * Called when `value` changes.
     *
     * @type {Function}
     * @public
     */
    onChange: _propTypes["default"].func,

    /**
     * Orientation of the picker.
     *
     * Controls whether the buttons are arranged horizontally or vertically around the value.
     *
     * * Values: `'horizontal'`, `'vertical'`
     *
     * @type {String}
     * @default 'horizontal'
     * @public
     */
    orientation: _propTypes["default"].oneOf(['horizontal', 'vertical']),

    /**
     * Pads the display value with zeros up to the number of digits of `min` or max`, whichever
     * is greater.
     *
     * @type {Boolean}
     * @public
     */
    padded: _propTypes["default"].bool,

    /**
     * The smallest value change allowed for the picker.
     *
     * For example, a step of `2` would cause the picker to increment from 0 to 2 to 4, etc.
     * It must evenly divide into the range designated by `min` and `max`.
     *
     * @type {Number}
     * @default 1
     * @public
     */
    step: _propTypes["default"].number,

    /**
     * The width of the picker.
     *
     * A number can be used to set the minimum number of characters to be shown. Setting a
     * number to less than the number of characters in the longest value will cause the width to
     * grow for the longer values.
     *
     * A string can be used to select from pre-defined widths:
     *
     * * `'small'` - numeric values
     * * `'medium'` - single or short words
     * * `'large'` - maximum-sized pickers taking full width of its parent
     *
     * By default, the picker will size according to the longest valid value.
     *
     * @type {String|Number}
     * @public
     */
    width: _propTypes["default"].oneOfType([_propTypes["default"].oneOf([null, 'small', 'medium', 'large']), _propTypes["default"].number]),

    /**
     * Allows picker to continue from the start of the list after it reaches the end and
     * vice-versa.
     *
     * @type {Boolean}
     * @public
     */
    wrap: _propTypes["default"].bool
  },
  computed: {
    disabled: function disabled(_ref) {
      var _disabled = _ref.disabled,
          max = _ref.max,
          min = _ref.min;
      return min >= max ? true : _disabled;
    },
    label: function label(_ref2) {
      var max = _ref2.max,
          min = _ref2.min,
          padded = _ref2.padded,
          value = _ref2.value;

      if (padded) {
        var maxDigits = digits(Math.max(Math.abs(min), Math.abs(max)));
        var valueDigits = digits(value);
        var start = value < 0 ? 0 : 1;
        var padding = '-00000000000000000000';
        return padding.slice(start, maxDigits - valueDigits + start) + Math.abs(value);
      }

      return value;
    },
    width: function width(_ref3) {
      var max = _ref3.max,
          min = _ref3.min,
          _width = _ref3.width;
      return _width || Math.max(max.toString().length, min.toString().length);
    },
    value: function value(_ref4) {
      var min = _ref4.min,
          max = _ref4.max,
          _value = _ref4.value;

      if (process.env.NODE_ENV !== "production") {
        (0, _validators.validateRange)(_value, min, max, 'RangePicker');
      }

      return (0, _util.clamp)(min, max, _value);
    },
    voiceLabel: function voiceLabel(_ref5) {
      var min = _ref5.min,
          max = _ref5.max;
      return JSON.stringify([min, max]);
    }
  },
  render: function render(_ref6) {
    var label = _ref6.label,
        value = _ref6.value,
        voiceLabel = _ref6.voiceLabel,
        rest = _objectWithoutProperties(_ref6, ["label", "value", "voiceLabel"]);

    delete rest.padded;
    return _react["default"].createElement(_Picker.Picker, Object.assign({}, rest, {
      "data-webos-voice-labels-ext": voiceLabel,
      index: 0,
      value: value,
      reverse: false
    }), _react["default"].createElement(_Picker.PickerItem, {
      key: value,
      marqueeDisabled: true,
      style: {
        direction: 'ltr'
      }
    }, label));
  }
});
/**
 * A component that lets the user select a number from a range of numbers.
 *
 * By default, `RangePicker` maintains the state of its `value` property. Supply the `defaultValue`
 * property to control its initial value. If you wish to directly control updates to the component,
 * supply a value to `value` at creation time and update it in response to `onChange` events.
 *
 * @class RangePicker
 * @memberof moonstone/RangePicker
 * @mixes ui/Changeable.Changeable
 * @ui
 * @public
 */

exports.RangePickerBase = RangePickerBase;
var RangePicker = (0, _Pure["default"])((0, _Changeable["default"])(RangePickerBase));
/**
 * Default value
 *
 * @name defaultValue
 * @memberof moonstone/RangePicker.RangePicker.prototype
 * @type {Number}
 * @public
 */

exports.RangePicker = RangePicker;
var _default = RangePicker;
exports["default"] = _default;