"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
Object.defineProperty(exports, "TimePickerBase", {
  enumerable: true,
  get: function get() {
    return _TimePickerBase["default"];
  }
});
exports.TimePicker = exports["default"] = void 0;

var _Pure = _interopRequireDefault(require("@enact/ui/internal/Pure"));

var _DateFactory = _interopRequireDefault(require("ilib/lib/DateFactory"));

var _DateFmt = _interopRequireDefault(require("ilib/lib/DateFmt"));

var _LocaleInfo = _interopRequireDefault(require("ilib/lib/LocaleInfo"));

var _DateTimeDecorator = _interopRequireDefault(require("../internal/DateTimeDecorator"));

var _Skinnable = _interopRequireDefault(require("../Skinnable"));

var _TimePickerBase = _interopRequireDefault(require("./TimePickerBase"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

/**
 * Provides a Moonstone-themed time selection component.
 *
 * @example
 * <TimePicker title="Open me" value={new Date()}></TimePicker>
 *
 * @module moonstone/TimePicker
 * @exports TimePicker
 * @exports TimePickerBase
 */

/*
 * Converts a string representation of time into minutes
 *
 * @param	{String}	time	Time in the format `HH:mm`
 *
 * @returns	{Number}			Time in minute
 * @private
 */
var toMinutes = function toMinutes(time) {
  var colon = time.indexOf(':');
  var hour = parseInt(time.substring(0, colon));
  var minute = parseInt(time.substring(colon + 1));
  return hour * 60 + minute;
};
/*
 * Converts the `start` and `end` string representations (e.g. '12:00') into a numerical
 * representation.
 *
 * @param	{Object}	options			Time options
 * @param	{String}	options.start	Start time of meridiem
 * @param	{String}	options.end		End time of meridiem
 *
 * @returns	{Object}					Contains start and end time in minutes
 * @private
 */


var calcMeridiemRange = function calcMeridiemRange(_ref) {
  var start = _ref.start,
      end = _ref.end;
  return {
    start: toMinutes(start),
    end: toMinutes(end)
  };
};
/*
 * Finds the index of the meridiem which contains `time`
 *
 * @param	{Number}	time		Time in minutes
 * @param	{Object[]}	meridiems	Array of meridiems with `start` and `end` members in minutes
 *
 * @returns {Number}				Index of `time` in `meridiems`
 * @private
 */


var indexOfMeridiem = function indexOfMeridiem(time, meridiems) {
  var minutes = time.getHours() * 60 + time.getMinutes();

  for (var i = 0; i < meridiems.length; i++) {
    var m = meridiems[i];

    if (minutes >= m.start && minutes <= m.end) {
      return i;
    }
  }

  return -1;
};

var dateTimeConfig = {
  customProps: function customProps(i18n, value, _ref2) {
    var meridiemLabel = _ref2.meridiemLabel;
    var values = {
      // i18n props
      meridiems: i18n.meridiemLabels,
      meridiemLabel: meridiemLabel,
      // date components
      hour: 12,
      minute: 0,
      meridiem: 0
    };

    if (i18n.meridiemEnabled && meridiemLabel == null) {
      if (values.meridiems.length > 2) {
        values.meridiemLabel = "".concat(values.meridiems[0], " / ").concat(values.meridiems[1], " ...");
      } else {
        values.meridiemLabel = values.meridiems.join(' / ');
      }
    }

    if (value) {
      if (i18n.meridiemEnabled) {
        values.meridiem = indexOfMeridiem(value, i18n.meridiemRanges);
      }

      values.hour = value.getHours();
      values.minute = value.getMinutes();
    }

    return values;
  },
  defaultOrder: ['h', 'm', 'a'],
  handlers: {
    onChangeHour: function onChangeHour(ev, value) {
      var currentTime = (0, _DateFactory["default"])(value).getTimeExtended();
      var currentHour = value.hour;
      value.hour = ev.value; // In the case of navigating onto the skipped hour of DST, ilib will return the same
      // value so we skip that hour and update the value again.

      var newTime = (0, _DateFactory["default"])(value).getTimeExtended();

      if (newTime === currentTime) {
        value.hour = ev.value * 2 - currentHour;
      }

      return value;
    },
    onChangeMinute: function onChangeMinute(ev, value) {
      value.minute = ev.value;
      return value;
    },
    onChangeMeridiem: function onChangeMeridiem(ev, value, i18n) {
      var meridiemRanges = i18n.meridiemRanges;
      var meridiem = meridiemRanges[ev.value];

      if (meridiemRanges.length === 2) {
        // In the common case of 2 meridiems, we'll offset hours by 12 so that picker stays
        // the same.
        value.hour = (value.getHours() + 12) % 24;
      } else {
        // In the rarer case of > 2 meridiems (e.g. am-ET), try to set hours only first
        var hours = Math.floor(meridiem.start / 60);
        value.hour = hours; // but check if it is still out of bounds and update the minutes as well

        var minutes = hours * 60 + value.getMinutes();

        if (minutes > meridiem.end) {
          value.minute = meridiem.end % 60;
        } else if (minutes < meridiem.start) {
          value.minute = meridiem.start % 60;
        }
      }

      return value;
    }
  },
  i18n: function i18n() {
    // Filters used to extract the order of pickers from the ilib template
    var includeMeridiem = /([khma])(?!\1)/ig;
    var excludeMeridiem = /([khm])(?!\1)/ig; // Label formatter

    var formatter = new _DateFmt["default"]({
      type: 'time',
      useNative: false,
      timezone: 'local',
      length: 'full',
      date: 'dmwy'
    }); // Meridiem localization

    var merFormatter = new _DateFmt["default"]({
      template: 'a',
      useNative: false,
      timezone: 'local'
    });
    var meridiems = merFormatter.getMeridiemsRange();
    var meridiemRanges = meridiems.map(calcMeridiemRange);
    var meridiemLabels = meridiems.map(function (obj) {
      return obj.name;
    }); // Picker ordering

    var li = new _LocaleInfo["default"]();
    var clockPref = li.getClock();
    var meridiemEnabled = clockPref === '12';
    var filter = meridiemEnabled ? includeMeridiem : excludeMeridiem;
    var order = formatter.getTemplate().replace(/'.*?'/g, '').match(filter).map(function (s) {
      return s[0].toLowerCase();
    });
    return {
      formatter: formatter,
      meridiemEnabled: meridiemEnabled,
      meridiemLabels: meridiemLabels,
      meridiemRanges: meridiemRanges,
      order: order
    };
  }
};
/**
 * A component that allows displaying or selecting time.
 *
 * Set the [value]{@link moonstone/TimePicker.TimePicker#value} property to a standard JavaScript
 * [Date] {@link /docs/developer-guide/glossary/#date} object to initialize the picker.
 *
 * By default, `TimePicker` maintains the state of its `value` property. Supply the
 * `defaultValue` property to control its initial value. If you wish to directly control updates
 * to the component, supply a value to `value` at creation time and update it in response to
 * `onChange` events.
 *
 * It is expandable and it maintains its open/closed state by default. `defaultOpen` can be used to
 * set the initial state. For the direct control of its open/closed state, supply a value for
 * `open` at creation time and update its value in response to `onClose`/`onOpen` events.
 *
 * @class TimePicker
 * @memberof moonstone/TimePicker
 * @mixes ui/Toggleable.Toggleable
 * @mixes ui/RadioDecorator.RadioDecorator
 * @mixes ui/Changeable.Changeable
 * @ui
 * @public
 */

/**
 * Default value
 *
 * @name defaultValue
 * @memberof moonstone/TimePicker.TimePicker.prototype
 * @type {Number}
 * @public
 */

var TimePicker = (0, _Pure["default"])((0, _Skinnable["default"])((0, _DateTimeDecorator["default"])(dateTimeConfig, _TimePickerBase["default"])));
/**
 * The primary text of the item.
 *
 * @name title
 * @memberof moonstone/TimePicker.TimePicker
 * @instance
 * @type {String}
 * @required
 * @public
 */

/**
 * Omits the labels below the pickers.
 *
 * @name noLabels
 * @memberof moonstone/TimePicker.TimePicker
 * @instance
 * @type {Boolean}
 * @public
 */

/**
 * Called when a condition occurs which should cause the expandable to close.
 *
 * @name onClose
 * @memberof moonstone/TimePicker.TimePicker
 * @instance
 * @type {Function}
 * @public
 */

/**
 * The selected date.
 *
 * @name value
 * @memberof moonstone/TimePicker.TimePicker
 * @instance
 * @type {Date}
 * @public
 */

exports.TimePicker = TimePicker;
var _default = TimePicker;
exports["default"] = _default;