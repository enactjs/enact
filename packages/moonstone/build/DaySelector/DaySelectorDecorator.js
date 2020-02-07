"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.DaySelectorDecorator = exports["default"] = void 0;

var _handle = require("@enact/core/handle");

var _hoc = _interopRequireDefault(require("@enact/core/hoc"));

var _util = require("@enact/core/util");

var _i18n = _interopRequireDefault(require("@enact/i18n"));

var _DateFmt = _interopRequireDefault(require("ilib/lib/DateFmt"));

var _LocaleInfo = _interopRequireDefault(require("ilib/lib/LocaleInfo"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _react = _interopRequireDefault(require("react"));

var _$L = _interopRequireDefault(require("../internal/$L"));

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

var forwardSelect = (0, _handle.forward)('onSelect');
var SELECTED_DAY_TYPES = {
  EVERY_DAY: 0,
  EVERY_WEEKDAY: 1,
  EVERY_WEEKEND: 2,
  SELECTED_DAYS: 3,
  SELECTED_NONE: 4
};

function adjustWeekends(firstDayOfWeek, day) {
  return (day - firstDayOfWeek + 7) % 7;
}

var memoLocaleState = (0, _util.memoize)(function (key, dayNameLength) {
  var df = new _DateFmt["default"]({
    length: 'full'
  });
  var sdf = new _DateFmt["default"]({
    length: dayNameLength
  });
  var li = new _LocaleInfo["default"](_i18n["default"].getLocale());
  var daysOfWeek = df.getDaysOfWeek();
  var days = sdf.getDaysOfWeek();
  var firstDayOfWeek = li.getFirstDayOfWeek();
  var state = {
    abbreviatedDayNames: [],
    firstDayOfWeek: 0,
    fullDayNames: [],
    weekendEnd: 0,
    weekendStart: 6
  };

  if (li.getWeekEndStart) {
    state.weekendStart = adjustWeekends(firstDayOfWeek, li.getWeekEndStart());
  }

  if (li.getWeekEndEnd) {
    state.weekendEnd = adjustWeekends(firstDayOfWeek, li.getWeekEndEnd());
  }

  for (var i = 0; i < 7; i++) {
    var index = (i + firstDayOfWeek) % 7;
    state.fullDayNames[i] = daysOfWeek[index];
    state.abbreviatedDayNames[i] = days[index];
  }

  return state;
});

function getLocaleState(dayNameLength, locale) {
  if (typeof window === 'undefined') {
    return {
      abbreviatedDayNames: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
      firstDayOfWeek: 0,
      fullDayNames: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
      weekendEnd: 0,
      weekendStart: 6
    };
  }

  return memoLocaleState(dayNameLength + locale, dayNameLength);
}
/**
 * Applies Moonstone specific behaviors to
 * [DaySelector]{@link moonstone/DaySelector.DaySelectorBase}.
 *
 * @hoc
 * @memberof moonstone/DaySelector
 * @mixes ui/Changeable.Changeable
 * @mixes moonstone/Skinnable.Skinnable
 * @omit onChange
 * @omit value
 * @omit defaultValue
 * @public
 */


var DaySelectorDecorator = (0, _hoc["default"])(function (config, Wrapped) {
  var _class, _temp;

  // eslint-disable-line no-unused-vars
  return _temp = _class =
  /*#__PURE__*/
  function (_React$Component) {
    _inherits(_class, _React$Component);

    function _class() {
      var _getPrototypeOf2;

      var _this;

      _classCallCheck(this, _class);

      for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      _this = _possibleConstructorReturn(this, (_getPrototypeOf2 = _getPrototypeOf(_class)).call.apply(_getPrototypeOf2, [this].concat(args)));

      _this.handleSelect = function (_ref) {
        var selected = _ref.selected;
        var _this$props = _this.props,
            dayNameLength = _this$props.dayNameLength,
            locale = _this$props.locale;

        var _getLocaleState = getLocaleState(dayNameLength, locale),
            labels = _getLocaleState.abbreviatedDayNames;

        var content = _this.getSelectedDayString(selected, labels);

        forwardSelect({
          selected: selected,
          content: content
        }, _this.props);
      };

      return _this;
    }

    _createClass(_class, [{
      key: "calcSelectedDayType",
      value: function calcSelectedDayType(selected) {
        if (selected == null) return SELECTED_DAY_TYPES.SELECTED_NONE;
        var state = getLocaleState(this.props.dayNameLength, this.props.locale);
        var weekendStart = false,
            weekendEnd = false,
            index;
        var length = selected.length,
            weekendLength = state.weekendStart === state.weekendEnd ? 1 : 2;
        if (length === 7) return SELECTED_DAY_TYPES.EVERY_DAY;

        for (var i = 0; i < 7; i++) {
          index = selected[i];
          weekendStart = weekendStart || state.weekendStart === index;
          weekendEnd = weekendEnd || state.weekendEnd === index;
        }

        if (weekendStart && weekendEnd && length === weekendLength) {
          return SELECTED_DAY_TYPES.EVERY_WEEKEND;
        } else if (!weekendStart && !weekendEnd && length === 7 - weekendLength) {
          return SELECTED_DAY_TYPES.EVERY_WEEKDAY;
        } else {
          return SELECTED_DAY_TYPES.SELECTED_DAYS;
        }
      }
      /*
       * Determines whether it should return "Every Day", "Every Weekend", "Every Weekday" or list of
       * days for a given selected day type.
       *
       * @param {Number} type of selected days
       * @param {Number[]} Array of day indexes
       * @param {String[]} Array of long or short day strings
       *
       * @returns {String} "Every Day", "Every Weekend", "Every Week" or list of days
       */

    }, {
      key: "getSelectedDayString",
      value: function getSelectedDayString(selected, selectDayStrings) {
        var _this2 = this;

        var _this$props2 = this.props,
            _this$props2$everyDay = _this$props2.everyDayText,
            everyDayText = _this$props2$everyDay === void 0 ? (0, _$L["default"])('Every Day') : _this$props2$everyDay,
            _this$props2$everyWee = _this$props2.everyWeekdayText,
            everyWeekdayText = _this$props2$everyWee === void 0 ? (0, _$L["default"])('Every Weekday') : _this$props2$everyWee,
            _this$props2$everyWee2 = _this$props2.everyWeekendText,
            everyWeekendText = _this$props2$everyWee2 === void 0 ? (0, _$L["default"])('Every Weekend') : _this$props2$everyWee2;

        if (selected != null) {
          selected = (0, _util.coerceArray)(selected);
        }

        var type = this.calcSelectedDayType(selected);

        var format = function format(list) {
          var separator = _this2.props.locale === 'fa-IR' ? '، ' : ', ';
          return list.join(separator);
        };

        switch (type) {
          case SELECTED_DAY_TYPES.EVERY_DAY:
            return everyDayText;

          case SELECTED_DAY_TYPES.EVERY_WEEKEND:
            return everyWeekendText;

          case SELECTED_DAY_TYPES.EVERY_WEEKDAY:
            return everyWeekdayText;

          case SELECTED_DAY_TYPES.SELECTED_DAYS:
            return format(selected.sort().map(function (dayIndex) {
              return selectDayStrings[dayIndex];
            }));

          case SELECTED_DAY_TYPES.SELECTED_NONE:
            return '';
        }
      }
    }, {
      key: "getAriaLabel",
      value: function getAriaLabel() {
        var _this$props3 = this.props,
            ariaLabel = _this$props3['aria-label'],
            dayNameLength = _this$props3.dayNameLength,
            locale = _this$props3.locale,
            selected = _this$props3.selected,
            title = _this$props3.title;

        var _getLocaleState2 = getLocaleState(dayNameLength, locale),
            fullDayNames = _getLocaleState2.fullDayNames;

        if (ariaLabel != null || title == null || selected == null || selected.length === 0) {
          return ariaLabel;
        }

        var label = this.getSelectedDayString(selected, fullDayNames);
        return "".concat(title, " ").concat(label);
      }
    }, {
      key: "render",
      value: function render() {
        var _this$props4 = this.props,
            dayNameLength = _this$props4.dayNameLength,
            locale = _this$props4.locale,
            selected = _this$props4.selected,
            rest = _objectWithoutProperties(_this$props4, ["dayNameLength", "locale", "selected"]);

        var _getLocaleState3 = getLocaleState(dayNameLength, locale),
            abbreviatedDayNames = _getLocaleState3.abbreviatedDayNames,
            fullDayNames = _getLocaleState3.fullDayNames;

        var content = this.getSelectedDayString(selected, abbreviatedDayNames);
        delete rest.everyDayText;
        delete rest.everyWeekdayText;
        delete rest.everyWeekendText;
        return _react["default"].createElement(Wrapped, Object.assign({}, rest, {
          "aria-label": this.getAriaLabel(),
          label: content,
          onSelect: this.handleSelect,
          selected: selected
        }), abbreviatedDayNames.map(function (children, index) {
          return {
            children: children,
            // "short" dayNameLength can result in the same name so adding index
            key: "".concat(index, " ").concat(children),
            'aria-label': fullDayNames[index]
          };
        }));
      }
    }]);

    return _class;
  }(_react["default"].Component), _class.displayName = 'DaySelectorDecorator', _class.propTypes =
  /** @lends moonstone/DaySelector.DaySelectorDecorator.prototype */
  {
    /**
     * The "aria-label" for the selector.
     *
     * @memberof moonstone/DaySelector.DaySelectorDecorator.prototype
     * @type {String}
     * @private
     */
    'aria-label': _propTypes["default"].string,

    /**
     * The format for names of days used in the label.
     *
     * @type {String}
     * @default 'long'
     * @public
     */
    dayNameLength: _propTypes["default"].oneOf(['short', 'medium', 'long', 'full']),

    /**
     * Applies a disabled style and prevents interacting with the component.
     *
     * @type {Boolean}
     * @default false
     * @public
     */
    disabled: _propTypes["default"].bool,

    /**
     * The text displayed in the label when every day is selected.
     *
     * @type {String}
     * @default 'Every Day'
     * @public
     */
    everyDayText: _propTypes["default"].string,

    /**
     * The text displayed in the label when every weekeday is selected.
     *
     * @type {String}
     * @default 'Every Weekday'
     * @public
     */
    everyWeekdayText: _propTypes["default"].string,

    /**
     * The text displayed in the label when every weekend day is selected.
     *
     * @type {String}
     * @default 'Every Weekend'
     * @public
     */
    everyWeekendText: _propTypes["default"].string,
    locale: _propTypes["default"].string,

    /**
     * Called when an day is selected or unselected.
     *
     * The event payload will be an object with the following members:
     * * `selected` - An array of numbers representing the selected days, 0 indexed
     * * `content` - Localized string representing the selected days
     *
     * @type {Function}
     * @public
     */
    onSelect: _propTypes["default"].func,

    /**
     * An array of numbers (0-indexed) representing the selected days of the week.
     *
     * @type {Number|Number[]}
     * @public
     */
    selected: _propTypes["default"].oneOfType([_propTypes["default"].number, _propTypes["default"].arrayOf(_propTypes["default"].number)]),

    /**
     * Used by DayPicker to generate the aria-label.
     *
     * Type set to "any" to avoid warnings if passed in some other unknown scenario
     *
     * @type {Node}
     * @private
     */
    title: _propTypes["default"].any
  }, _class.defaultProps = {
    dayNameLength: 'long',
    disabled: false
    /*
     * Determines which day type should be returned, based on the selected indices.
     *
     * @param {Number[]} [selected] Array of day indexes
     *
     * @returns {Number}
     */

  }, _temp;
});
exports.DaySelectorDecorator = DaySelectorDecorator;
var _default = DaySelectorDecorator;
exports["default"] = _default;