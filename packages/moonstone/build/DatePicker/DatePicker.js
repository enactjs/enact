"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
Object.defineProperty(exports, "DatePickerBase", {
  enumerable: true,
  get: function get() {
    return _DatePickerBase["default"];
  }
});
exports.DatePicker = exports["default"] = void 0;

var _Pure = _interopRequireDefault(require("@enact/ui/internal/Pure"));

var _DateFactory = _interopRequireDefault(require("ilib/lib/DateFactory"));

var _DateFmt = _interopRequireDefault(require("ilib/lib/DateFmt"));

var _DateTimeDecorator = _interopRequireDefault(require("../internal/DateTimeDecorator"));

var _Skinnable = _interopRequireDefault(require("../Skinnable"));

var _DatePickerBase = _interopRequireDefault(require("./DatePickerBase"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

/**
 * Date selection components and behaviors.
 *
 * @example
 * <DatePicker
 *   onChange={console.log}
 * 	 title="Select Date"
 * />
 *
 * @module moonstone/DatePicker
 * @exports DatePicker
 * @exports DatePickerBase
 */
var dateTimeConfig = {
  customProps: function customProps(i18n, value, props) {
    var values = {
      maxMonths: 12,
      maxDays: 31,
      year: 1900,
      month: 1,
      day: 1
    };

    if (value && i18n) {
      values.year = value.getYears();
      values.month = value.getMonths();
      values.day = value.getDays();
      values.maxMonths = i18n.formatter.cal.getNumMonths(values.year);
      values.maxDays = i18n.formatter.cal.getMonLength(values.month, values.year);
      values.maxYear = i18n.toLocalYear(props.maxYear || _DatePickerBase["default"].defaultProps.maxYear);
      values.minYear = i18n.toLocalYear(props.minYear || _DatePickerBase["default"].defaultProps.minYear);
    }

    return values;
  },
  defaultOrder: ['d', 'm', 'y'],
  handlers: {
    onChangeDate: function onChangeDate(ev, value) {
      value.day = ev.value;
      return value;
    },
    onChangeMonth: function onChangeMonth(ev, value) {
      value.month = ev.value;
      return value;
    },
    onChangeYear: function onChangeYear(ev, value) {
      value.year = ev.value;
      return value;
    }
  },
  i18n: function i18n() {
    var formatter = new _DateFmt["default"]({
      date: 'dmwy',
      length: 'full',
      timezone: 'local',
      useNative: false
    });
    var order = formatter.getTemplate().replace(/'.*?'/g, '').match(/([mdy]+)/ig).map(function (s) {
      return s[0].toLowerCase();
    });
    /*
     * Converts a gregorian year to local year
     *
     * @param	{Number}	year	gregorian year
     *
     * @returns	{Number}		local year
     */

    var toLocalYear = function toLocalYear(year) {
      return (0, _DateFactory["default"])({
        julianday: (0, _DateFactory["default"])({
          year: year,
          type: 'gregorian',
          month: 1,
          day: 1,
          timezone: 'local'
        }).getJulianDay(),
        timezone: 'local'
      }).getYears();
    };

    return {
      formatter: formatter,
      order: order,
      toLocalYear: toLocalYear
    };
  }
};
/**
 * An expand date selection component, ready to use in Moonstone applications.
 *
 * `DatePicker` may be used to select the year, month, and day. It uses a standard `Date` object for
 * its `value` which can be shared as the `value` for a
 * [TimePicker]{@link moonstone/TimePicker.TimePicker} to select both a date and time.
 *
 * By default, `DatePicker` maintains the state of its `value` property. Supply the
 * `defaultValue` property to control its initial value. If you wish to directly control updates
 * to the component, supply a value to `value` at creation time and update it in response to
 * `onChange` events.
 *
 * `DatePicker` is an expandable component and it maintains its open/closed state by default. The
 * initial state can be supplied using `defaultOpen`. In order to directly control the open/closed
 * state, supply a value for `open` at creation time and update its value in response to
 * `onClose`/`onOpen` events.
 *
 * Usage:
 * ```
 * <DatePicker
 *  defaultValue={selectedDate}
 *  onChange={handleChange}
 *  title="Select Date"
 * />
 * ```
 *
 * @class DatePicker
 * @memberof moonstone/DatePicker
 * @extends moonstone/DatePicker.DatePickerBase
 * @mixes ui/Toggleable.Toggleable
 * @mixes ui/RadioDecorator.RadioDecorator
 * @mixes ui/Changeable.Changeable
 * @omit day
 * @omit maxDays
 * @omit maxMonths
 * @omit month
 * @omit order
 * @omit year
 * @ui
 * @public
 */

var DatePicker = (0, _Pure["default"])((0, _Skinnable["default"])((0, _DateTimeDecorator["default"])(dateTimeConfig, _DatePickerBase["default"])));
/**
 * The initial value used when `open` is not set.
 *
 * @name defaultOpen
 * @type {Boolean}
 * @memberof moonstone/DatePicker.DatePicker.prototype
 * @public
 */

/**
 * The initial value used when `value` is not set.
 *
 * @name defaultValue
 * @type {Date}
 * @memberof moonstone/DatePicker.DatePicker.prototype
 * @public
 */

/**
 * Opens the component to display the date component pickers.
 *
 * @name open
 * @type {Boolean}
 * @default false
 * @memberof moonstone/DatePicker.DatePicker.prototype
 * @public
 */

/**
 * The selected date
 *
 * @name value
 * @type {Date}
 * @memberof moonstone/DatePicker.DatePicker.prototype
 * @public
 */

exports.DatePicker = DatePicker;
var _default = DatePicker;
exports["default"] = _default;