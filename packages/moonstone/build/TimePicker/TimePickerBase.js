"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.TimePickerBase = exports["default"] = void 0;

var _handle = require("@enact/core/handle");

var _kind = _interopRequireDefault(require("@enact/core/kind"));

var _react = _interopRequireDefault(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _$L = _interopRequireDefault(require("../internal/$L"));

var _DateComponentPicker = require("../internal/DateComponentPicker");

var _ExpandableItem = require("../ExpandableItem");

var _TimePickerModule = _interopRequireDefault(require("./TimePicker.module.css"));

var _DateComponentPickerModule = require("../internal/DateComponentPicker/DateComponentPicker.module.css");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _objectWithoutProperties(source, excluded) { if (source == null) return {}; var target = _objectWithoutPropertiesLoose(source, excluded); var key, i; if (Object.getOwnPropertySymbols) { var sourceSymbolKeys = Object.getOwnPropertySymbols(source); for (i = 0; i < sourceSymbolKeys.length; i++) { key = sourceSymbolKeys[i]; if (excluded.indexOf(key) >= 0) continue; if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue; target[key] = source[key]; } } return target; }

function _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

// values to use in hour picker for 24 and 12 hour locales
var hours24 = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23'];
var hours12 = ['12', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11'];
/**
 * {@link moonstone/TimePicker/TimePickerBase.HourPicker} is a utility component to prevent the
 * animation of the picker when the display text doesn't change for 12-hour locales.
 *
 * @class HourPicker
 * @memberof moonstone/TimePicker/TimePickerBase
 * @ui
 * @private
 */

var HourPicker =
/*#__PURE__*/
function (_React$Component) {
  _inherits(HourPicker, _React$Component);

  function HourPicker(props) {
    var _this;

    _classCallCheck(this, HourPicker);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(HourPicker).call(this, props));
    _this.state = {
      noAnimation: false,
      prevValue: props.value
    };
    return _this;
  }

  _createClass(HourPicker, [{
    key: "render",
    value: function render() {
      var _this$props = this.props,
          hasMeridiem = _this$props.hasMeridiem,
          rest = _objectWithoutProperties(_this$props, ["hasMeridiem"]);

      var hours = hasMeridiem ? hours12 : hours24;
      return _react["default"].createElement(_DateComponentPicker.DateComponentPicker, Object.assign({}, rest, {
        noAnimation: this.state.noAnimation
      }), hours);
    }
  }], [{
    key: "getDerivedStateFromProps",
    value: function getDerivedStateFromProps(props, state) {
      if (state.prevValue !== props.value) {
        var hours = props.hasMeridiem ? hours12 : hours24;
        return {
          noAnimation: hours[state.prevValue] === hours[props.value],
          prevValue: props.value
        };
      }

      return null;
    }
  }]);

  return HourPicker;
}(_react["default"].Component);
/**
* {@link moonstone/TimePicker.TimePickerBase} is the stateless functional time picker
* component. Should not be used directly but may be composed within another component as it is
* within {@link moonstone/TimePicker.TimePicker}.
*
* @class TimePickerBase
* @memberof moonstone/TimePicker
* @ui
* @public
*/


HourPicker.propTypes = {
  hasMeridiem: _propTypes["default"].bool,
  value: _propTypes["default"].number
};
var TimePickerBase = (0, _kind["default"])({
  name: 'TimePickerBase',
  propTypes:
  /** @lends moonstone/TimePicker.TimePickerBase.prototype */
  {
    /**
     * The `hour` component of the time.
     *
     * @type {Number}
     * @required
     * @public
     */
    hour: _propTypes["default"].number.isRequired,

    /**
     * The `minute` component of the time.
     *
     * @type {Number}
     * @required
     * @public
     */
    minute: _propTypes["default"].number.isRequired,

    /**
     * The order in which the component pickers are displayed.
     *
     * Should be an array of 2 or 3 strings containing one of `'h'`, `'k'`, `'m'`, and `'a'`.
     *
     * @type {String[]}
     * @required
     * @public
     */
    order: _propTypes["default"].arrayOf(_propTypes["default"].oneOf(['h', 'k', 'm', 'a'])).isRequired,

    /**
     * The primary text of the item.
     *
     * @type {String}
     * @required
     * @public
     */
    title: _propTypes["default"].string.isRequired,

    /**
     * Disables voice control.
     *
     * @type {Boolean}
     * @memberof moonstone/TimePicker.TimePickerBase.prototype
     * @public
     */
    'data-webos-voice-disabled': _propTypes["default"].bool,

    /**
     * The "aria-label" for the hour picker
     *
     * @type {String}
     * @default 'change a value with up down button'
     * @public
     */
    hourAriaLabel: _propTypes["default"].string,

    /**
     * Sets the hint string read when focusing the hour picker.
     *
     * @type {String}
     * @default 'hour'
     * @public
     */
    hourLabel: _propTypes["default"].string,

    /**
     * The `meridiem` component of the time.
     *
     * @type {Number}
     * @required
     * @public
     */
    meridiem: _propTypes["default"].number,

    /**
     * The "aria-label" for the meridiem picker.
     *
     * @type {String}
     * @default 'change a value with up down button'
     * @public
     */
    meridiemAriaLabel: _propTypes["default"].string,

    /**
     * The hint string read when focusing the meridiem picker.
     *
     * @type {String}
     * @public
     */
    meridiemLabel: _propTypes["default"].string,

    /**
     * Array of meridiem labels to display.
     *
     * @type {String[]}
     * @required
     * @public
     */
    meridiems: _propTypes["default"].arrayOf(_propTypes["default"].string),

    /**
     * The "aria-label" for the minute picker.
     *
     * @type {String}
     * @default 'change a value with up down button'
     * @public
     */
    minuteAriaLabel: _propTypes["default"].string,

    /**
     * Sets the hint string read when focusing the minute picker.
     *
     * @type {String}
     * @default 'minute'
     * @public
     */
    minuteLabel: _propTypes["default"].string,

    /**
     * Omits the labels below the pickers.
     *
     * @type {Boolean}
     * @public
     */
    noLabels: _propTypes["default"].bool,

    /**
     * Called on changes in the `hour` component of the time.
     *
     * @type {Function}
     * @public
     */
    onChangeHour: _propTypes["default"].func,

    /**
     * Called on changes in the `meridiem` component of the time.
     *
     * @type {Function}
     * @public
     */
    onChangeMeridiem: _propTypes["default"].func,

    /**
     * Called on changes in the `minute` component of the time.
     *
     * @type {Function}
     * @public
     */
    onChangeMinute: _propTypes["default"].func,

    /**
     * Called when a condition occurs which should cause the expandable to close.
     *
     * @type {Function}
     * @public
     */
    onClose: _propTypes["default"].func,

    /**
     * Called when the component is removed while retaining focus.
     *
     * @type {Function}
     * @param {Object} event
     * @public
     */
    onSpotlightDisappear: _propTypes["default"].func,

    /**
     * Called when the focus leaves the expandable when the 5-way left key is pressed.
     *
     * @type {Function}
     * @param {Object} event
     * @public
     */
    onSpotlightLeft: _propTypes["default"].func,

    /**
     * Called when the focus leaves the expandable when the 5-way right key is pressed.
     *
     * @type {Function}
     * @param {Object} event
     * @public
     */
    onSpotlightRight: _propTypes["default"].func,

    /**
     * Set content to RTL.
     *
     * @type {Boolean}
     * @private
     */
    rtl: _propTypes["default"].bool,

    /**
     * Disables spotlight navigation into the component.
     *
     * @type {Boolean}
     * @default false
     * @public
     */
    spotlightDisabled: _propTypes["default"].bool
  },
  defaultProps: {
    spotlightDisabled: false
  },
  styles: {
    css: _TimePickerModule["default"],
    className: 'timePicker'
  },
  handlers: {
    handlePickerKeyDown: (0, _handle.handle)((0, _handle.forKey)('enter'), (0, _handle.forward)('onClose'))
  },
  computed: {
    hasMeridiem: function hasMeridiem(_ref) {
      var order = _ref.order;
      return order.indexOf('a') >= 0;
    },
    meridiemPickerWidth: function meridiemPickerWidth(_ref2) {
      var meridiem = _ref2.meridiem,
          meridiems = _ref2.meridiems;
      return meridiems[meridiem].length * 2;
    }
  },
  render: function render(_ref3) {
    var voiceDisabled = _ref3['data-webos-voice-disabled'],
        handlePickerKeyDown = _ref3.handlePickerKeyDown,
        hasMeridiem = _ref3.hasMeridiem,
        hour = _ref3.hour,
        hourAriaLabel = _ref3.hourAriaLabel,
        _ref3$hourLabel = _ref3.hourLabel,
        hourLabel = _ref3$hourLabel === void 0 ? (0, _$L["default"])('hour') : _ref3$hourLabel,
        meridiem = _ref3.meridiem,
        meridiemAriaLabel = _ref3.meridiemAriaLabel,
        meridiemLabel = _ref3.meridiemLabel,
        meridiemPickerWidth = _ref3.meridiemPickerWidth,
        meridiems = _ref3.meridiems,
        minute = _ref3.minute,
        minuteAriaLabel = _ref3.minuteAriaLabel,
        _ref3$minuteLabel = _ref3.minuteLabel,
        minuteLabel = _ref3$minuteLabel === void 0 ? (0, _$L["default"])('minute') : _ref3$minuteLabel,
        noLabels = _ref3.noLabels,
        onChangeHour = _ref3.onChangeHour,
        onChangeMeridiem = _ref3.onChangeMeridiem,
        onChangeMinute = _ref3.onChangeMinute,
        onSpotlightDisappear = _ref3.onSpotlightDisappear,
        onSpotlightLeft = _ref3.onSpotlightLeft,
        onSpotlightRight = _ref3.onSpotlightRight,
        order = _ref3.order,
        rtl = _ref3.rtl,
        spotlightDisabled = _ref3.spotlightDisabled,
        rest = _objectWithoutProperties(_ref3, ["data-webos-voice-disabled", "handlePickerKeyDown", "hasMeridiem", "hour", "hourAriaLabel", "hourLabel", "meridiem", "meridiemAriaLabel", "meridiemLabel", "meridiemPickerWidth", "meridiems", "minute", "minuteAriaLabel", "minuteLabel", "noLabels", "onChangeHour", "onChangeMeridiem", "onChangeMinute", "onSpotlightDisappear", "onSpotlightLeft", "onSpotlightRight", "order", "rtl", "spotlightDisabled"]);

    return _react["default"].createElement(_ExpandableItem.ExpandableItemBase, Object.assign({}, rest, {
      showLabel: "always",
      autoClose: false,
      "data-webos-voice-disabled": voiceDisabled,
      lockBottom: false,
      onSpotlightDisappear: onSpotlightDisappear,
      onSpotlightLeft: onSpotlightLeft,
      onSpotlightRight: onSpotlightRight,
      spotlightDisabled: spotlightDisabled
    }), _react["default"].createElement("div", {
      className: _DateComponentPickerModule.dateComponentPickers,
      onKeyDown: handlePickerKeyDown
    }, _react["default"].createElement("div", {
      className: _TimePickerModule["default"].timeComponents
    }, order.map(function (picker, index) {
      // although we create a component array based on the provided
      // order, we ultimately force order in CSS for RTL
      var isFirst = index === 0;
      var isLast = index === order.length - 1; // meridiem will always be the left-most control in RTL, regardless of the provided order

      var isLeft = rtl && picker === 'a' || isFirst && !rtl; // minute will always be the right-most control in RTL, regardless of the provided order

      var isRight = rtl && picker === 'm' || isLast && !rtl;

      switch (picker) {
        case 'h':
        case 'k':
          return _react["default"].createElement(HourPicker, {
            accessibilityHint: hourLabel,
            "aria-label": hourAriaLabel,
            className: _TimePickerModule["default"].hourComponents,
            "data-webos-voice-disabled": voiceDisabled,
            "data-webos-voice-group-label": hourLabel,
            hasMeridiem: hasMeridiem,
            key: "hour-picker",
            label: noLabels ? null : hourLabel,
            onChange: onChangeHour,
            onSpotlightDisappear: onSpotlightDisappear,
            onSpotlightLeft: isLeft ? onSpotlightLeft : null,
            onSpotlightRight: isRight ? onSpotlightRight : null,
            spotlightDisabled: spotlightDisabled,
            value: hour,
            width: 2,
            wrap: true
          });

        case 'm':
          return _react["default"].createElement(_DateComponentPicker.DateComponentRangePicker, {
            accessibilityHint: minuteLabel,
            "aria-label": minuteAriaLabel,
            className: _TimePickerModule["default"].minutesComponents,
            "data-webos-voice-disabled": voiceDisabled,
            "data-webos-voice-group-label": minuteLabel,
            key: "minute-picker",
            label: noLabels ? null : minuteLabel,
            max: 59,
            min: 0,
            onChange: onChangeMinute,
            onSpotlightDisappear: onSpotlightDisappear,
            onSpotlightLeft: isLeft ? onSpotlightLeft : null,
            onSpotlightRight: isRight ? onSpotlightRight : null,
            padded: true,
            spotlightDisabled: spotlightDisabled,
            value: minute,
            width: 2,
            wrap: true
          });

        case 'a':
          return _react["default"].createElement(_DateComponentPicker.DateComponentPicker, {
            "aria-label": meridiemAriaLabel,
            "aria-valuetext": meridiems ? meridiems[meridiem] : null,
            className: _TimePickerModule["default"].meridiemComponent,
            "data-webos-voice-disabled": voiceDisabled,
            "data-webos-voice-group-label": meridiemLabel,
            key: "meridiem-picker",
            label: noLabels ? null : meridiemLabel,
            onChange: onChangeMeridiem,
            onSpotlightDisappear: onSpotlightDisappear,
            onSpotlightLeft: isLeft ? onSpotlightLeft : null,
            onSpotlightRight: isRight ? onSpotlightRight : null,
            reverse: true,
            spotlightDisabled: spotlightDisabled,
            value: meridiem,
            width: meridiemPickerWidth,
            wrap: true
          }, meridiems);
      }

      return null;
    }))));
  }
});
exports.TimePickerBase = TimePickerBase;
var _default = TimePickerBase;
exports["default"] = _default;