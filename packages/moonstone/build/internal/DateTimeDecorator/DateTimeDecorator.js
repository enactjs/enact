"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.DateTimeDecorator = exports["default"] = void 0;

var _handle = _interopRequireWildcard(require("@enact/core/handle"));

var _hoc = _interopRequireDefault(require("@enact/core/hoc"));

var _util = require("@enact/core/util");

var _I18nDecorator = require("@enact/i18n/I18nDecorator");

var _Changeable = _interopRequireDefault(require("@enact/ui/Changeable"));

var _DateFactory = _interopRequireDefault(require("ilib/lib/DateFactory"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _react = _interopRequireDefault(require("react"));

var _ExpandableItem = require("../../ExpandableItem");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj["default"] = obj; return newObj; } }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

/*
 * Converts a JavaScript Date to unix time
 *
 * @param	{Date}	date	A Date to convert
 *
 * @returns	{undefined}
 */
var toTime = function toTime(date) {
  return date && date.getTime();
};
/**
 * {@link moonstone/internal/DateTimeDecorator.DateTimeDecorator} provides common behavior for
 * {@link moonstone/DatePicker.DatePicker} and {@link moonstone/TimePicker.TimePicker}.
 *
 * @class DateTimeDecorator
 * @memberof moonstone/internal/DateTimeDecorator
 * @mixes ui/Toggleable.Toggleable
 * @mixes ui/RadioDecorator.RadioDecorator
 * @mixes ui/Changeable.Changeable
 * @hoc
 * @private
 */


var DateTimeDecorator = (0, _hoc["default"])(function (config, Wrapped) {
  var _class, _temp;

  var customProps = config.customProps,
      defaultOrder = config.defaultOrder,
      handlers = config.handlers,
      i18n = config.i18n;
  var memoizedI18nConfig = (0, _util.memoize)(function ()
  /* locale */
  {
    // Guard for isomorphic builds
    if (typeof window !== 'undefined' && i18n) {
      return i18n();
    }

    return null;
  });
  var Decorator = (_temp = _class =
  /*#__PURE__*/
  function (_React$Component) {
    _inherits(Decorator, _React$Component);

    function Decorator(props) {
      var _this;

      _classCallCheck(this, Decorator);

      _this = _possibleConstructorReturn(this, _getPrototypeOf(Decorator).call(this, props));

      _this.updateValue = function (value) {
        var day = value.day,
            month = value.month,
            year = value.year;
        var maxDays = value.cal.getMonLength(month, year);
        value.day = day <= maxDays ? day : maxDays;
        var date = (0, _DateFactory["default"])(value);
        var newValue = date.getTimeExtended();
        var changed = _this.props.value == null || _this.props.value !== newValue;

        _this.setState({
          value: newValue
        });

        if (changed) {
          _this.emitChange(date);
        }

        return newValue;
      };

      _this.emitChange = function (date) {
        (0, _handle.forward)('onChange', {
          value: date ? date.getJSDate() : null
        }, _this.props);
      };

      _this.handleOpen = function (ev) {
        (0, _handle.forward)('onOpen', ev, _this.props);
        var newValue = toTime(_this.props.value);
        var value = newValue || Date.now(); // if we're opening, store the current value as the initial value for cancellation

        _this.setState({
          initialValue: newValue,
          pickerValue: null,
          value: value
        }); // if no value was provided, we need to emit the onChange event for the generated value


        if (!newValue) {
          _this.emitChange(_this.toIDate(value));
        }
      };

      _this.handleClose = function (ev) {
        (0, _handle.forward)('onClose', ev, _this.props);
        var newValue = toTime(_this.props.value);

        _this.setState({
          value: newValue
        });
      };

      _this.handlePickerChange = function (handler, ev) {
        var value = _this.toIDate(_this.state.value);

        handler(ev, value, memoizedI18nConfig(_this.props.locale));

        _this.updateValue(value);
      };

      _this.handleCancel = function () {
        var _this$state = _this.state,
            initialValue = _this$state.initialValue,
            value = _this$state.value; // if we're cancelling, reset our state and emit an onChange with the initial value

        _this.setState({
          value: null,
          initialValue: null,
          pickerValue: value
        });

        if (initialValue !== value) {
          _this.emitChange(_this.toIDate(initialValue));
        }
      };

      _this.handleKeyDown = (0, _handle["default"])((0, _handle.forward)('onKeyDown'), (0, _handle.forProp)('open', true), (0, _handle.forKey)('cancel'), (0, _handle.call)('handleCancel')).bindAs(_assertThisInitialized(_this), 'handleKeyDown');
      _this.state = {
        initialValue: null,
        value: null
      };
      _this.handlers = {};

      if (handlers) {
        Object.keys(handlers).forEach(function (name) {
          _this.handlers[name] = _this.handlePickerChange.bind(_assertThisInitialized(_this), handlers[name]);
        });
      }

      return _this;
    }

    _createClass(Decorator, [{
      key: "toIDate",

      /**
       * Converts a Date to an IDate
       *
       * @param	{Date}	time	Date object
       *
       * @returns	{IDate}			ilib Date object
       */
      value: function toIDate(time) {
        if (time && this.props.locale) {
          return (0, _DateFactory["default"])({
            unixtime: time,
            timezone: 'local'
          });
        }
      }
      /**
       * Updates the internal value in state
       *
       * @param	{IDate}		value	ilib Date object
       *
       * @returns {Number}			Updated internal value
       */

    }, {
      key: "render",
      value: function render() {
        var value = this.toIDate(this.state.value); // pickerValue is only set when cancelling to prevent the unexpected changing of the
        // picker values before closing.

        var pickerValue = this.state.pickerValue ? this.toIDate(this.state.pickerValue) : value;
        var label = null;
        var props = null;
        var order = defaultOrder;
        var i18nConfig = memoizedI18nConfig(this.props.locale);

        if (i18nConfig) {
          if (value) {
            label = i18nConfig.formatter.format(value);
          }

          props = customProps(i18nConfig, pickerValue, this.props);
          order = i18nConfig.order;
        }

        return _react["default"].createElement(Wrapped, Object.assign({}, this.props, props, this.handlers, {
          label: label,
          onKeyDown: this.handleKeyDown,
          onClose: this.handleClose,
          onOpen: this.handleOpen,
          order: order,
          value: value
        }));
      }
    }], [{
      key: "getDerivedStateFromProps",
      value: function getDerivedStateFromProps(props, state) {
        var value = toTime(props.value);

        if (props.open && !props.disabled && state.initialValue == null && state.value == null) {
          // when the expandable opens, we cache the prop value so it can be restored on
          // cancel and set value to be the current time if unset in order to initialize the
          // pickers
          return {
            initialValue: value,
            value: value || Date.now()
          };
        } else if (state.value !== value) {
          // always respect a value change from props
          return {
            value: value
          };
        }

        return null;
      }
    }]);

    return Decorator;
  }(_react["default"].Component), _class.displayName = 'DateTimeDecorator', _class.propTypes =
  /** @lends moonstone/internal/DateTimeDecorator.DateTimeDecorator.prototype */
  {
    /**
     * The current locale as a
     * {@link https://tools.ietf.org/html/rfc5646|BCP 47 language tag}.
     *
     * @type {String}
     * @public
     */
    locale: _propTypes["default"].string,

    /**
     * Handler for `onChange` events
     *
     * @type {Function}
     * @public
     */
    onChange: _propTypes["default"].func,

    /**
     * When `true`, the date picker is expanded to select a new date.
     *
     * @type {Boolean}
     * @public
     */
    open: _propTypes["default"].bool,

    /**
     * The selected date
     *
     * @type {Date}
     * @public
     */
    value: _propTypes["default"].instanceOf(Date)
  }, _temp);
  return (0, _I18nDecorator.I18nContextDecorator)({
    rtlProp: 'rtl',
    localeProp: 'locale'
  }, (0, _ExpandableItem.Expandable)((0, _Changeable["default"])(Decorator)));
});
exports.DateTimeDecorator = DateTimeDecorator;
var _default = DateTimeDecorator;
exports["default"] = _default;