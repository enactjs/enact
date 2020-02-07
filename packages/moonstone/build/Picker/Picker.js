"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.PickerBase = exports.Picker = exports["default"] = void 0;

var _kind = _interopRequireDefault(require("@enact/core/kind"));

var _util = require("@enact/core/util");

var _Changeable = _interopRequireDefault(require("@enact/ui/Changeable"));

var _Pure = _interopRequireDefault(require("@enact/ui/internal/Pure"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _react = _interopRequireDefault(require("react"));

var _Marquee = require("../Marquee");

var _validators = require("../internal/validators");

var _Picker = _interopRequireWildcard(require("../internal/Picker"));

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj["default"] = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _objectWithoutProperties(source, excluded) { if (source == null) return {}; var target = _objectWithoutPropertiesLoose(source, excluded); var key, i; if (Object.getOwnPropertySymbols) { var sourceSymbolKeys = Object.getOwnPropertySymbols(source); for (i = 0; i < sourceSymbolKeys.length; i++) { key = sourceSymbolKeys[i]; if (excluded.indexOf(key) >= 0) continue; if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue; target[key] = source[key]; } } return target; }

function _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }

/**
 * The base `Picker` component.
 *
 * This version is not [`spottable`]{@link spotlight/Spottable.Spottable}.
 *
 * @class PickerBase
 * @memberof moonstone/Picker
 * @ui
 * @public
 */
var PickerBase = (0, _kind["default"])({
  name: 'Picker',
  propTypes:
  /** @lends moonstone/Picker.PickerBase.prototype */
  {
    /**
     * Picker value list.
     *
     * @type {Node}
     * @required
     * @public
     */
    children: _propTypes["default"].node.isRequired,

    /**
     * The `aria-valuetext` for the picker.
     *
     * By default, `aria-valuetext` is set to the current selected child text.
     *
     * @type {String}
     * @memberof moonstone/Picker.PickerBase.prototype
     * @public
     */
    'aria-valuetext': _propTypes["default"].string,

    /**
     * The voice control labels for the `children`.
     *
     * By default, `data-webos-voice-labels-ext` is generated from `children`. However, if
     * `children` is not an array of numbers or strings, `data-webos-voice-labels-ext` should be
     * set to an array of labels.
     *
     * @type {Number[]|String[]}
     * @memberof moonstone/Picker.PickerBase.prototype
     * @public
     */
    'data-webos-voice-labels-ext': _propTypes["default"].oneOfType([_propTypes["default"].arrayOf(_propTypes["default"].number), _propTypes["default"].arrayOf(_propTypes["default"].string)]),

    /**
     * A custom icon for the decrementer.
     *
     * All strings supported by [Icon]{@link moonstone/Icon.Icon} are supported. Without a
     * custom icon, the default is used, and is automatically changed when the
     * [orientation]{@link moonstone/Picker.Picker#orientation} is changed.
     *
     * @type {String}
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
     * [orientation]{@link moonstone/Picker.Picker#orientation} is changed.
     *
     * @type {String}
     * @public
     */
    incrementIcon: _propTypes["default"].string,

    /**
     * Allows the user to use the arrow keys to adjust the picker's value.
     *
     * Key presses are captured in the directions of the increment and decrement buttons but
     * others are unaffected. A non-joined Picker allows navigation in any direction, but
     * requires individual ENTER presses on the incrementer and decrementer buttons. Pointer
     * interaction is the same for both formats.
     *
     * @type {Boolean}
     * @public
     */
    joined: _propTypes["default"].bool,

    /**
     * Disables marqueeing of items.
     *
     * By default, each picker item is wrapped by a
     * [`MarqueeText`]{@link moonstone/Marquee.MarqueeText}. When this is set, the items will
     * not be wrapped.
     *
     * @type {Boolean}
     * @public
     */
    marqueeDisabled: _propTypes["default"].bool,

    /**
     * Disables transition animation.
     *
     * @type {Boolean}
     * @public
     */
    noAnimation: _propTypes["default"].bool,

    /**
     * Called when the `value` changes.
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
     * @public
     */
    orientation: _propTypes["default"].oneOf(['horizontal', 'vertical']),

    /**
     * Index of the selected child.
     *
     * @type {Number}
     * @default 0
     * @public
     */
    value: _propTypes["default"].number,

    /**
     * The width of the picker.
     *
     * A number can be used to set the minimum number of characters to be shown. Setting a
     * number to less than the number of characters in the longest value will cause the width to
     * grow for the longer values.
     *
     * A string can be used to select from pre-defined widths:
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
  defaultProps: {
    value: 0
  },
  computed: {
    max: function max(_ref) {
      var children = _ref.children;
      return children && children.length ? children.length - 1 : 0;
    },
    reverse: function reverse(_ref2) {
      var orientation = _ref2.orientation;
      return orientation === 'vertical';
    },
    children: function children(_ref3) {
      var _children = _ref3.children,
          disabled = _ref3.disabled,
          joined = _ref3.joined,
          marqueeDisabled = _ref3.marqueeDisabled;
      return _react["default"].Children.map(_children, function (child) {
        var focusOrHover = !disabled && joined ? 'focus' : 'hover';
        return _react["default"].createElement(_Picker.PickerItem, {
          marqueeDisabled: marqueeDisabled,
          marqueeOn: focusOrHover
        }, child);
      });
    },
    disabled: function disabled(_ref4) {
      var children = _ref4.children,
          _disabled = _ref4.disabled;
      return _react["default"].Children.count(children) > 1 ? _disabled : true;
    },
    value: function value(_ref5) {
      var _value = _ref5.value,
          children = _ref5.children;
      var max = children && children.length ? children.length - 1 : 0;

      if (process.env.NODE_ENV !== "production") {
        (0, _validators.validateRange)(_value, 0, max, 'Picker', 'value', 'min', 'max index');
      }

      return (0, _util.clamp)(0, max, _value);
    },
    voiceLabel: function voiceLabel(_ref6) {
      var children = _ref6.children,
          voiceLabelsExt = _ref6['data-webos-voice-labels-ext'];
      var voiceLabel;

      if (voiceLabelsExt) {
        voiceLabel = voiceLabelsExt;
      } else {
        voiceLabel = _react["default"].Children.map(children, function (child) {
          return typeof child === 'number' || typeof child === 'string' ? child : '';
        });
      }

      return JSON.stringify(voiceLabel);
    }
  },
  render: function render(_ref7) {
    var children = _ref7.children,
        max = _ref7.max,
        value = _ref7.value,
        voiceLabel = _ref7.voiceLabel,
        rest = _objectWithoutProperties(_ref7, ["children", "max", "value", "voiceLabel"]);

    delete rest.marqueeDisabled;
    return _react["default"].createElement(_Picker["default"], Object.assign({}, rest, {
      "data-webos-voice-labels-ext": voiceLabel,
      min: 0,
      max: max,
      index: value,
      step: 1,
      value: value
    }), children);
  }
});
/**
 * A Picker component that allows selecting values from a list of values.
 *
 * By default, `RangePicker` maintains the state of its `value` property. Supply the `defaultValue`
 * property to control its initial value. If you wish to directly control updates to the component,
 * supply a value to `value` at creation time and update it in response to `onChange` events.
 *
 * @class Picker
 * @memberof moonstone/Picker
 * @mixes ui/Changeable.Changeable
 * @mixes moonstone/Marquee.MarqueeController
 * @ui
 * @public
 */

exports.PickerBase = PickerBase;
var Picker = (0, _Pure["default"])((0, _Changeable["default"])((0, _Marquee.MarqueeController)({
  marqueeOnFocus: true
}, PickerBase)));
/**
 * Default index of the selected child.
 *
 * *Note*: Changing `defaultValue` after initial render has no effect.
 *
 * @name defaultValue
 * @memberof moonstone/Picker.Picker.prototype
 * @type {Number}
 * @public
 */

exports.Picker = Picker;
var _default = Picker;
exports["default"] = _default;