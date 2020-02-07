"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.DatePickerBase = exports["default"] = void 0;

var _handle = require("@enact/core/handle");

var _kind = _interopRequireDefault(require("@enact/core/kind"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _react = _interopRequireDefault(require("react"));

var _$L = _interopRequireDefault(require("../internal/$L"));

var _DateComponentPicker = require("../internal/DateComponentPicker");

var _ExpandableItem = require("../ExpandableItem");

var _DatePickerModule = _interopRequireDefault(require("./DatePicker.module.css"));

var _DateComponentPickerModule = require("../internal/DateComponentPicker/DateComponentPicker.module.css");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _objectWithoutProperties(source, excluded) { if (source == null) return {}; var target = _objectWithoutPropertiesLoose(source, excluded); var key, i; if (Object.getOwnPropertySymbols) { var sourceSymbolKeys = Object.getOwnPropertySymbols(source); for (i = 0; i < sourceSymbolKeys.length; i++) { key = sourceSymbolKeys[i]; if (excluded.indexOf(key) >= 0) continue; if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue; target[key] = source[key]; } } return target; }

function _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }

/**
 * A date selection component.
 *
 * This component is most often not used directly but may be composed within another component as it
 * is within [DatePicker]{@link moonstone/DatePicker.DatePicker}.
 *
 * @class DatePickerBase
 * @memberof moonstone/DatePicker
 * @extends moonstone/ExpandableItem.ExpandableItemBase
 * @ui
 * @public
 */
var DatePickerBase = (0, _kind["default"])({
  name: 'DatePickerBase',
  propTypes:
  /** @lends moonstone/DatePicker.DatePickerBase.prototype */
  {
    /**
     * The `day` component of the Date.
     *
     * The value should be a number between 1 and `maxDays`.
     *
     * @type {Number}
     * @required
     * @public
     */
    day: _propTypes["default"].number.isRequired,

    /**
     * The number of days in the month.
     *
     * @type {Number}
     * @required
     * @public
     */
    maxDays: _propTypes["default"].number.isRequired,

    /**
     * The number of months in the year.
     *
     * @type {Number}
     * @required
     * @public
     */
    maxMonths: _propTypes["default"].number.isRequired,

    /**
     * The `month` component of the Date.
     *
     * The value should be a number between 1 and `maxMonths`.
     *
     * @type {Number}
     * @required
     * @public
     */
    month: _propTypes["default"].number.isRequired,

    /**
     * The order in which the component pickers are displayed.
     *
     * The value should be an array of 3 strings containing one of `'m'`, `'d'`, and `'y'`.
     *
     * @type {String[]}
     * @required
     * @public
     */
    order: _propTypes["default"].arrayOf(_propTypes["default"].oneOf(['m', 'd', 'y'])).isRequired,

    /**
     * The primary text of the item.
     *
     * @type {String}
     * @required
     * @public
     */
    title: _propTypes["default"].string.isRequired,

    /**
     * The `year` component of the Date.
     *
     * @type {Number}
     * @required
     * @public
     */
    year: _propTypes["default"].number.isRequired,

    /**
     * Disables voice control.
     *
     * @type {Boolean}
     * @memberof moonstone/DatePicker.DatePickerBase.prototype
     * @public
     */
    'data-webos-voice-disabled': _propTypes["default"].bool,

    /**
     * The "aria-label" for the day picker.
     *
     * @type {String}
     * @default 'change a value with up down button'
     * @public
     */
    dayAriaLabel: _propTypes["default"].string,

    /**
     * The label displayed below the day picker.
     *
     * This prop will also be appended to the current value and set as "aria-valuetext" on the
     * picker when the value changes.
     *
     * @type {String}
     * @default 'day'
     * @public
     */
    dayLabel: _propTypes["default"].string,

    /**
     * The maximum selectable `year` value.
     *
     * @type {Number}
     * @default 2099
     * @public
     */
    maxYear: _propTypes["default"].number,

    /**
     * The minimum selectable `year` value.
     *
     * @type {Number}
     * @default 1900
     * @public
     */
    minYear: _propTypes["default"].number,

    /**
     * The "aria-label" for the month picker.
     *
     * @type {String}
     * @default 'change a value with up down button'
     * @public
     */
    monthAriaLabel: _propTypes["default"].string,

    /**
     * The label displayed below the month picker.
     *
     * This prop will also be appended to the current value and set as "aria-valuetext" on the
     * picker when the value changes.
     *
     * @type {String}
     * @default 'month'
     * @public
     */
    monthLabel: _propTypes["default"].string,

    /**
     * Omits the labels below the pickers.
     *
     * @type {Boolean}
     * @public
     */
    noLabels: _propTypes["default"].bool,

    /**
     * Called when the `date` component of the Date changes.
     *
     * @type {Function}
     * @public
     */
    onChangeDate: _propTypes["default"].func,

    /**
     * Called when the `month` component of the Date changes.
     *
     * @type {Function}
     * @public
     */
    onChangeMonth: _propTypes["default"].func,

    /**
     * Called when the `year` component of the Date changes.
     *
     * @type {Function}
     * @public
     */
    onChangeYear: _propTypes["default"].func,

    /**
     * Called when the user requests the expandable close.
     *
     * @type {Function}
     * @public
     */
    onClose: _propTypes["default"].func,

    /**
     * Called when the component is removed when it had focus.
     *
     * @type {Function}
     * @param {Object} event
     * @public
     */
    onSpotlightDisappear: _propTypes["default"].func,

    /**
     * Called prior to focus leaving the expandable when the 5-way left key is pressed.
     *
     * @type {Function}
     * @param {Object} event
     * @public
     */
    onSpotlightLeft: _propTypes["default"].func,

    /**
     * Called prior to focus leaving the expandable when the 5-way right key is pressed.
     *
     * @type {Function}
     * @param {Object} event
     * @public
     */
    onSpotlightRight: _propTypes["default"].func,

    /**
     * Indicates the content's text direction is right-to-left.
     *
     * @type {Boolean}
     * @private
     */
    rtl: _propTypes["default"].bool,

    /**
     * Disables 5-way spotlight from navigating into the component.
     *
     * @type {Boolean}
     * @default false
     * @public
     */
    spotlightDisabled: _propTypes["default"].bool,

    /**
     * The "aria-label" for the year picker.
     *
     * @type {String}
     * @default 'change a value with up down button'
     * @public
     */
    yearAriaLabel: _propTypes["default"].string,

    /**
     * The label displayed below the year picker.
     *
     * This prop will also be appended to the current value and set as "aria-valuetext" on the
     * picker when the value changes.
     *
     * @type {String}
     * @default 'year'
     * @public
     */
    yearLabel: _propTypes["default"].string
  },
  defaultProps: {
    maxYear: 2099,
    minYear: 1900,
    spotlightDisabled: false
  },
  styles: {
    css: _DatePickerModule["default"],
    className: 'datePicker'
  },
  handlers: {
    handlePickerKeyDown: (0, _handle.handle)((0, _handle.forKey)('enter'), (0, _handle.forward)('onClose'))
  },
  render: function render(_ref) {
    var voiceDisabled = _ref['data-webos-voice-disabled'],
        day = _ref.day,
        dayAriaLabel = _ref.dayAriaLabel,
        _ref$dayLabel = _ref.dayLabel,
        dayLabel = _ref$dayLabel === void 0 ? (0, _$L["default"])('day') : _ref$dayLabel,
        handlePickerKeyDown = _ref.handlePickerKeyDown,
        maxDays = _ref.maxDays,
        maxMonths = _ref.maxMonths,
        maxYear = _ref.maxYear,
        minYear = _ref.minYear,
        month = _ref.month,
        monthAriaLabel = _ref.monthAriaLabel,
        _ref$monthLabel = _ref.monthLabel,
        monthLabel = _ref$monthLabel === void 0 ? (0, _$L["default"])('month') : _ref$monthLabel,
        noLabels = _ref.noLabels,
        onChangeDate = _ref.onChangeDate,
        onChangeMonth = _ref.onChangeMonth,
        onChangeYear = _ref.onChangeYear,
        onSpotlightDisappear = _ref.onSpotlightDisappear,
        onSpotlightLeft = _ref.onSpotlightLeft,
        onSpotlightRight = _ref.onSpotlightRight,
        order = _ref.order,
        rtl = _ref.rtl,
        spotlightDisabled = _ref.spotlightDisabled,
        year = _ref.year,
        yearAriaLabel = _ref.yearAriaLabel,
        _ref$yearLabel = _ref.yearLabel,
        yearLabel = _ref$yearLabel === void 0 ? (0, _$L["default"])('year') : _ref$yearLabel,
        rest = _objectWithoutProperties(_ref, ["data-webos-voice-disabled", "day", "dayAriaLabel", "dayLabel", "handlePickerKeyDown", "maxDays", "maxMonths", "maxYear", "minYear", "month", "monthAriaLabel", "monthLabel", "noLabels", "onChangeDate", "onChangeMonth", "onChangeYear", "onSpotlightDisappear", "onSpotlightLeft", "onSpotlightRight", "order", "rtl", "spotlightDisabled", "year", "yearAriaLabel", "yearLabel"]);

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
    }, order.map(function (picker, index) {
      var isFirst = index === 0;
      var isLast = index === order.length - 1;
      var isLeft = isFirst && !rtl || isLast && rtl;
      var isRight = isFirst && rtl || isLast && !rtl;

      switch (picker) {
        case 'd':
          return _react["default"].createElement(_DateComponentPicker.DateComponentRangePicker, {
            accessibilityHint: dayLabel,
            "aria-label": dayAriaLabel,
            className: _DatePickerModule["default"].day,
            "data-webos-voice-disabled": voiceDisabled,
            "data-webos-voice-group-label": dayLabel,
            key: "day-picker",
            label: noLabels ? null : dayLabel,
            max: maxDays,
            min: 1,
            onChange: onChangeDate,
            onSpotlightDisappear: onSpotlightDisappear,
            onSpotlightLeft: isLeft ? onSpotlightLeft : null,
            onSpotlightRight: isRight ? onSpotlightRight : null,
            spotlightDisabled: spotlightDisabled,
            value: day,
            width: 2,
            wrap: true
          });

        case 'm':
          return _react["default"].createElement(_DateComponentPicker.DateComponentRangePicker, {
            accessibilityHint: monthLabel,
            "aria-label": monthAriaLabel,
            className: _DatePickerModule["default"].month,
            "data-webos-voice-disabled": voiceDisabled,
            "data-webos-voice-group-label": monthLabel,
            key: "month-picker",
            label: noLabels ? null : monthLabel,
            max: maxMonths,
            min: 1,
            onChange: onChangeMonth,
            onSpotlightDisappear: onSpotlightDisappear,
            onSpotlightLeft: isLeft ? onSpotlightLeft : null,
            onSpotlightRight: isRight ? onSpotlightRight : null,
            spotlightDisabled: spotlightDisabled,
            value: month,
            width: 2,
            wrap: true
          });

        case 'y':
          return _react["default"].createElement(_DateComponentPicker.DateComponentRangePicker, {
            accessibilityHint: yearLabel,
            "aria-label": yearAriaLabel,
            className: _DatePickerModule["default"].year,
            "data-webos-voice-disabled": voiceDisabled,
            "data-webos-voice-group-label": yearLabel,
            key: "year-picker",
            label: noLabels ? null : yearLabel,
            max: maxYear,
            min: minYear,
            onChange: onChangeYear,
            onSpotlightDisappear: onSpotlightDisappear,
            onSpotlightLeft: isLeft ? onSpotlightLeft : null,
            onSpotlightRight: isRight ? onSpotlightRight : null,
            spotlightDisabled: spotlightDisabled,
            value: year,
            width: 4
          });
      }

      return null;
    })));
  }
});
exports.DatePickerBase = DatePickerBase;
var _default = DatePickerBase;
exports["default"] = _default;