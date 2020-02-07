"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.DateComponentPickerBase = exports.DateComponentPicker = exports["default"] = void 0;

var _Changeable = _interopRequireDefault(require("@enact/ui/Changeable"));

var _kind = _interopRequireDefault(require("@enact/core/kind"));

var _react = _interopRequireDefault(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _Spottable = _interopRequireDefault(require("@enact/spotlight/Spottable"));

var _Picker = _interopRequireWildcard(require("../Picker"));

var _DateComponentPickerChrome = _interopRequireDefault(require("./DateComponentPickerChrome"));

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj["default"] = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _objectWithoutProperties(source, excluded) { if (source == null) return {}; var target = _objectWithoutPropertiesLoose(source, excluded); var key, i; if (Object.getOwnPropertySymbols) { var sourceSymbolKeys = Object.getOwnPropertySymbols(source); for (i = 0; i < sourceSymbolKeys.length; i++) { key = sourceSymbolKeys[i]; if (excluded.indexOf(key) >= 0) continue; if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue; target[key] = source[key]; } } return target; }

function _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }

var Picker = (0, _Spottable["default"])(_Picker["default"]);
/**
 * {@link moonstone/internal/DataComponentPicker.DateComponentPickerBase} allows the selection of one
 * part of the date or time using a {@link moonstone/Picker.Picker}.
 *
 * @class DateComponentPickerBase
 * @memberof moonstone/internal/DateComponentPicker
 * @ui
 * @private
 */

var DateComponentPickerBase = (0, _kind["default"])({
  name: 'DateComponentPicker',
  propTypes:
  /** @lends moonstone/internal/DateComponentPicker.DateComponentPickerBase.prototype */
  {
    /**
     * Display values representing the `value` to select
     *
     * @type {String[]}
     * @required
     * @public
     */
    children: _propTypes["default"].arrayOf(_propTypes["default"].string).isRequired,

    /**
     * The value of the date component
     *
     * @type {Number}
     * @required
     * @public
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
     * Overrides the `aria-valuetext` for the picker. By default, `aria-valuetext` is set
     * to the current selected child and accessibilityHint text.
     *
     * @type {String}
     * @memberof moonstone/internal/DateComponentPicker.DateComponentPickerBase.prototype
     * @public
     */
    'aria-valuetext': _propTypes["default"].string,

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

    /**
     * When `true`, the picker buttons operate in the reverse direction.
     *
     * @type {Boolean}
     * @public
     */
    reverse: _propTypes["default"].bool,

    /*
     * When `true`, allow the picker to continue from the opposite end of the list of options.
     *
     * @type {Boolean}
     * @public
     */
    wrap: _propTypes["default"].bool
  },
  computed: {
    children: function children(_ref) {
      var _children = _ref.children;
      return _react["default"].Children.map(_children, function (child) {
        return _react["default"].createElement(_Picker.PickerItem, {
          marqueeDisabled: true
        }, child);
      });
    },
    max: function max(_ref2) {
      var children = _ref2.children;
      return _react["default"].Children.count(children) - 1;
    },
    voiceLabel: function voiceLabel(_ref3) {
      var children = _ref3.children;
      return JSON.stringify(children);
    }
  },
  render: function render(_ref4) {
    var ariaValuetext = _ref4['aria-valuetext'],
        accessibilityHint = _ref4.accessibilityHint,
        children = _ref4.children,
        className = _ref4.className,
        label = _ref4.label,
        max = _ref4.max,
        noAnimation = _ref4.noAnimation,
        reverse = _ref4.reverse,
        value = _ref4.value,
        voiceLabel = _ref4.voiceLabel,
        wrap = _ref4.wrap,
        rest = _objectWithoutProperties(_ref4, ["aria-valuetext", "accessibilityHint", "children", "className", "label", "max", "noAnimation", "reverse", "value", "voiceLabel", "wrap"]);

    return _react["default"].createElement(_DateComponentPickerChrome["default"], {
      className: className,
      label: label
    }, _react["default"].createElement(Picker, Object.assign({}, rest, {
      accessibilityHint: accessibilityHint == null ? label : accessibilityHint,
      "aria-valuetext": accessibilityHint == null ? ariaValuetext : null,
      "data-webos-voice-labels-ext": voiceLabel,
      index: value,
      joined: true,
      max: max,
      min: 0,
      noAnimation: noAnimation,
      orientation: "vertical",
      reverse: reverse,
      step: 1,
      value: value,
      wrap: wrap
    }), children));
  }
});
/**
 * {@link moonstone/internal/DateComponentPickerBase.DateComponentPicker} allows the selection of one part of
 * the date (date, month, or year). It is a stateful component but allows updates by providing a new
 * `value` via props.
 *
 * @class DateComponentPicker
 * @memberof moonstone/internal/DateComponentPicker
 * @mixes ui/Changeable.Changeable
 * @ui
 * @private
 */

exports.DateComponentPickerBase = DateComponentPickerBase;
var DateComponentPicker = (0, _Changeable["default"])(DateComponentPickerBase);
exports.DateComponentPicker = DateComponentPicker;
var _default = DateComponentPicker;
exports["default"] = _default;