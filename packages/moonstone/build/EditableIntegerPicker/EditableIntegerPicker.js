"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.EditableIntegerPickerBase = exports.EditableIntegerPicker = exports["default"] = void 0;

var _kind = _interopRequireDefault(require("@enact/core/kind"));

var _util = require("@enact/core/util");

var _Changeable = _interopRequireDefault(require("@enact/ui/Changeable"));

var _Pure = _interopRequireDefault(require("@enact/ui/internal/Pure"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _react = _interopRequireDefault(require("react"));

var _Marquee = require("../Marquee");

var _Picker = require("../internal/Picker");

var _validators = require("../internal/validators");

var _EditableIntegerPickerModule = _interopRequireDefault(require("./EditableIntegerPicker.module.css"));

var _EditableIntegerPickerDecorator = _interopRequireDefault(require("./EditableIntegerPickerDecorator"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _objectWithoutProperties(source, excluded) { if (source == null) return {}; var target = _objectWithoutPropertiesLoose(source, excluded); var key, i; if (Object.getOwnPropertySymbols) { var sourceSymbolKeys = Object.getOwnPropertySymbols(source); for (i = 0; i < sourceSymbolKeys.length; i++) { key = sourceSymbolKeys[i]; if (excluded.indexOf(key) >= 0) continue; if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue; target[key] = source[key]; } } return target; }

function _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }

var digits = function digits(num) {
  // minor optimization
  return num > -10 && num < 10 && 1 || num > -100 && num < 100 && 2 || num > -1000 && num < 1000 && 3 || Math.floor(Math.log(Math.abs(num)) * Math.LOG10E) + 1;
};
/**
 * A picker component that lets the user select a number in between `min` and `max` numbers.
 *
 * This component is not spottable. Developers are encouraged to use
 * {@link moonstone/EditableIntegerPicker.EditableIntegerPicker}.
 *
 * @class EditableIntegerPickerBase
 * @memberof moonstone/EditableIntegerPicker
 * @ui
 * @public
 */


var EditableIntegerPickerBase = (0, _kind["default"])({
  name: 'EditableIntegerPicker',
  propTypes:
  /** @lends moonstone/EditableIntegerPicker.EditableIntegerPickerBase.prototype */
  {
    /**
     * The maximum value selectable by the picker (inclusive).
     *
     * The range between `min` and `max` should be evenly divisible by
     * [step]{@link moonstone/EditableIntegerPicker.EditableIntegerPickerBase.step}.
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
     * [step]{@link moonstone/EditableIntegerPicker.EditableIntegerPickerBase.step}.
     *
     * @type {Number}
     * @required
     * @public
     */
    min: _propTypes["default"].number.isRequired,

    /**
     * The value for the picker for accessibility read out.
     *
     * By default, `aria-valuetext` is set to the current selected child value.
     *
     * @type {String}
     * @memberof moonstone/EditableIntegerPicker.EditableIntegerPickerBase.prototype
     * @public
     */
    'aria-valuetext': _propTypes["default"].string,

    /**
     * The icon for the decrementer.
     *
     * All strings supported by [Icon]{@link moonstone/Icon.Icon} are supported. Without a
     * custom icon, the default is used.
     *
     * @type {String}
     * @public
     */
    decrementIcon: _propTypes["default"].string,

    /**
     * Disables the picker and prevents [events]{@link /docs/developer-guide/glossary/#event}
     * from firing.
     *
     * @type {Boolean}
     * @public
     */
    disabled: _propTypes["default"].bool,

    /**
     * Displays the input field instead of the picker components.
     *
     * @type {Boolean}
     * @public
     */
    editMode: _propTypes["default"].bool,

    /**
     * The icon for the incrementer.
     *
     * All strings supported by [Icon]{@link moonstone/Icon.Icon} are supported. Without a
     * custom icon, the default is used.
     *
     * @type {String}
     * @public
     */
    incrementIcon: _propTypes["default"].string,

    /**
     * Called when the input mounts witha reference to the DOM node.
     *
     * @type {Function}
     * @private
     */
    inputRef: _propTypes["default"].func,

    /**
     * Called when there the input is blurred.
     *
     * @type {Function}
     * @public
     */
    onInputBlur: _propTypes["default"].func,

    /**
     * Called when the pickerItem is clicked and `editMode` is `false`.
     *
     * In response, the `editMode` should be switched to `true` to enable editing. This is
     * automatically handled by {@link moonstone/EditableIntegerPicker.EditableIntegerPicker}.
     *
     * @type {Function}
     * @public
     */
    onPickerItemClick: _propTypes["default"].func,

    /**
     * The orientation of the picker.
     *
     * @type {('horizontal'|'vertical')}
     * @default 'horizontal'
     * @public
     */
    orientation: _propTypes["default"].oneOf(['horizontal', 'vertical']),

    /**
     * Pads the display value with zeros.
     *
     * The number of zeros used is the number of digits of the value of
     * [min]{@link moonstone/EditableIntegerPicker.EditableIntegerPickerBase.min} or
     * [max]{@link moonstone/EditableIntegerPicker.EditableIntegerPickerBase.max}, whichever is
     * greater.
     *
     * @type {Boolean}
     * @public
     */
    padded: _propTypes["default"].bool,

    /**
     * Called when the picker mounts with a reference to the picker DOM node.
     *
     * @type {Function}
     * @private
     */
    pickerRef: _propTypes["default"].func,

    /**
     * Allow the picker to only increment or decrement by a given value.
     *
     * For example, a step of `2` would cause a picker to increment from 10 to 12 to 14, etc.
     * It must evenly divide into the range designated by `min` and `max`.
     *
     * @type {Number}
     * @default 1
     * @public
     */
    step: _propTypes["default"].number,

    /**
     * Unit label to be appended to the value for display.
     *
     * @type {String}
     * @default ''
     * @public
     */
    unit: _propTypes["default"].string,

    /**
     * The current value of the Picker.
     *
     * @type {Number}
     * @default 0
     * @public
     */
    value: _propTypes["default"].number,

    /**
     * The size of the picker.
     *
     * `'small'`, `'medium'`, `'large'`, or set to `null` to assume auto-sizing. `'small'` is
     * good for numeric pickers, `'medium'` for single or short word pickers, `'large'` for
     * maximum-sized pickers.
     *
     * You may also supply a number which will determine the minumum size of the Picker.
     * Setting a number to less than the number of characters in your longest value may produce
     * unexpected results.
     *
     * @type {('small'|'medium'|'large')|Number}
     * @default 'medium'
     * @public
     */
    width: _propTypes["default"].oneOfType([_propTypes["default"].oneOf([null, 'small', 'medium', 'large']), _propTypes["default"].number]),

    /**
     * Allows the picker to increment from the max to min value and vice versa.
     *
     * @type {Boolean}
     * @public
     */
    wrap: _propTypes["default"].bool
  },
  defaultProps: {
    orientation: 'horizontal',
    step: 1,
    unit: '',
    value: 0,
    width: 'medium'
  },
  styles: {
    css: _EditableIntegerPickerModule["default"],
    className: 'editableIntegerPicker'
  },
  computed: {
    value: function value(_ref) {
      var min = _ref.min,
          max = _ref.max,
          _value = _ref.value;

      if (process.env.NODE_ENV !== "production") {
        (0, _validators.validateRange)(_value, min, max, 'EditableIntegerPicker');
      }

      return (0, _util.clamp)(min, max, _value);
    },
    width: function width(_ref2) {
      var max = _ref2.max,
          min = _ref2.min,
          _width = _ref2.width;
      return _width || Math.max(max.toString().length, min.toString().length);
    },
    children: function children(_ref3) {
      var editMode = _ref3.editMode,
          inputRef = _ref3.inputRef,
          max = _ref3.max,
          min = _ref3.min,
          onInputBlur = _ref3.onInputBlur,
          onPickerItemClick = _ref3.onPickerItemClick,
          padded = _ref3.padded,
          unit = _ref3.unit,
          value = _ref3.value;
      var label;
      value = (0, _util.clamp)(min, max, value);

      if (padded) {
        var maxDigits = digits(Math.max(Math.abs(min), Math.abs(max)));
        var valueDigits = digits(value);
        var start = value < 0 ? 0 : 1;
        var padding = '-00000000000000000000';
        label = padding.slice(start, maxDigits - valueDigits + start) + Math.abs(value);
      } else {
        label = value;
      }

      if (editMode) {
        return _react["default"].createElement("input", {
          className: _EditableIntegerPickerModule["default"].input,
          key: "edit",
          onBlur: onInputBlur,
          ref: inputRef
        });
      }

      var children = label;

      if (unit) {
        children = "".concat(label, " ").concat(unit);
      }

      return _react["default"].createElement(_Picker.PickerItem, {
        key: value,
        onClick: onPickerItemClick
      }, children);
    },
    ariaValueText: function ariaValueText(_ref4) {
      var unit = _ref4.unit,
          value = _ref4.value;
      return unit ? "".concat(value, " ").concat(unit) : null;
    },
    className: function className(_ref5) {
      var _className = _ref5.className,
          editMode = _ref5.editMode,
          styler = _ref5.styler;
      return editMode ? styler.append({
        editMode: editMode
      }) : _className;
    },
    disabled: function disabled(_ref6) {
      var _disabled = _ref6.disabled,
          max = _ref6.max,
          min = _ref6.min;
      return min >= max ? true : _disabled;
    }
  },
  render: function render(_ref7) {
    var ariaValueText = _ref7.ariaValueText,
        pickerRef = _ref7.pickerRef,
        rest = _objectWithoutProperties(_ref7, ["ariaValueText", "pickerRef"]);

    delete rest.editMode;
    delete rest.inputRef;
    delete rest.onInputBlur;
    delete rest.onPickerItemClick;
    delete rest.padded;
    delete rest.unit;
    return _react["default"].createElement(_Picker.Picker, Object.assign({
      "aria-valuetext": ariaValueText
    }, rest, {
      index: 0,
      ref: pickerRef
    }));
  }
});
/**
 * A component that lets the user select a number from a range of numbers.
 *
 * By default, `EditableIntegerPicker` maintains the state of its `value` property. Supply the
 * `defaultValue` property to control its initial value. If you wish to directly control updates to
 * the component, supply a value to `value` at creation time and update it in response to `onChange`
 * events.
 *
 * @class EditableIntegerPicker
 * @memberof moonstone/EditableIntegerPicker
 * @extends moonstone/EditableIntegerPicker.EditableIntegerPickerBase
 * @mixes ui/Changeable.Changeable
 * @ui
 * @public
 */

exports.EditableIntegerPickerBase = EditableIntegerPickerBase;
var EditableIntegerPicker = (0, _Pure["default"])((0, _Changeable["default"])((0, _EditableIntegerPickerDecorator["default"])((0, _Marquee.MarqueeController)({
  marqueeOnFocus: true
}, EditableIntegerPickerBase))));
exports.EditableIntegerPicker = EditableIntegerPicker;
var _default = EditableIntegerPicker;
exports["default"] = _default;