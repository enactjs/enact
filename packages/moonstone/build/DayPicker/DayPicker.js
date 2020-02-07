"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.DayPickerBase = exports.DayPicker = exports["default"] = void 0;

var _kind = _interopRequireDefault(require("@enact/core/kind"));

var _I18nDecorator = require("@enact/i18n/I18nDecorator");

var _Changeable = _interopRequireDefault(require("@enact/ui/Changeable"));

var _Pure = _interopRequireDefault(require("@enact/ui/internal/Pure"));

var _compose = _interopRequireDefault(require("ramda/src/compose"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _react = _interopRequireDefault(require("react"));

var _DaySelectorDecorator = _interopRequireDefault(require("../DaySelector/DaySelectorDecorator"));

var _ExpandableItem = require("../ExpandableItem");

var _ExpandableList = require("../ExpandableList");

var _Skinnable = _interopRequireDefault(require("../Skinnable"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _objectWithoutProperties(source, excluded) { if (source == null) return {}; var target = _objectWithoutPropertiesLoose(source, excluded); var key, i; if (Object.getOwnPropertySymbols) { var sourceSymbolKeys = Object.getOwnPropertySymbols(source); for (i = 0; i < sourceSymbolKeys.length; i++) { key = sourceSymbolKeys[i]; if (excluded.indexOf(key) >= 0) continue; if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue; target[key] = source[key]; } } return target; }

function _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }

/**
 * A day of the week selection component.
 *
 * This component is most often not used directly but may be composed within another component as it
 * is within [DayPicker]{@link moonstone/DayPicker.DayPicker}.
 *
 * @class DayPickerBase
 * @memberof moonstone/DayPicker
 * @extends moonstone/ExpandableList.ExpandableListBase
 * @omit children
 * @ui
 * @public
 */
var DayPickerBase = (0, _kind["default"])({
  name: 'DayPicker',
  propTypes:
  /** @lends moonstone/DayPicker.DayPicker.prototype */
  {
    /**
     * The primary text label for the component.
     *
     * @type {String}
     * @required
     * @public
     */
    title: _propTypes["default"].string.isRequired,

    /**
     * Called when the user requests the expandable close.
     *
     * @type {Function}
     * @public
     */
    onClose: _propTypes["default"].func,

    /**
     * Called when the user requests the expandable open.
     *
     * @type {Function}
     * @public
     */
    onOpen: _propTypes["default"].func,

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
     * Opens the component to display the day selection components.
     *
     * @type {Boolean}
     * @default false
     * @public
     */
    open: _propTypes["default"].bool,

    /**
     * An array of numbers (0-indexed) representing the selected days of the week.
     *
     * @type {Number|Number[]}
     * @public
     */
    selected: _propTypes["default"].oneOfType([_propTypes["default"].number, _propTypes["default"].arrayOf(_propTypes["default"].number)])
  },
  computed: {
    children: function children(_ref) {
      var _children = _ref.children;
      return _children.map(function (child) {
        return child['aria-label'];
      });
    }
  },
  render: function render(_ref2) {
    var title = _ref2.title,
        rest = _objectWithoutProperties(_ref2, ["title"]);

    return _react["default"].createElement(_ExpandableList.ExpandableListBase, Object.assign({}, rest, {
      "data-webos-voice-label": title,
      select: "multiple",
      title: title
    }));
  }
});
exports.DayPickerBase = DayPickerBase;
var DayPickerDecorator = (0, _compose["default"])(_Pure["default"], _ExpandableItem.Expandable, (0, _Changeable["default"])({
  change: 'onSelect',
  prop: 'selected'
}), (0, _I18nDecorator.I18nContextDecorator)({
  localeProp: 'locale'
}), _DaySelectorDecorator["default"], _Skinnable["default"]);
/**
 * An expandable day of the week selection component, ready to use in Moonstone applications.
 *
 * `DayPicker` may be used to select one or more days of the week. Upon selection, it will display
 * the short names of each day selected or customizable strings when selecting [every
 * day]{@link moonstone/DayPicker.DayPicker.everyDayText}), [every
 * weekday]{@link moonstone/DayPicker.DayPicker.everyWeekdayText}, and [every weekend
 * day]{@link moonstone/DayPicker.DayPicker.everyWeekendText}.
 *
 * By default, `DayPicker` maintains the state of its `selected` property. Supply the
 * `defaultSelected` property to control its initial value. If you wish to directly control updates
 * to the component, supply a value to `selected` at creation time and update it in response to
 * `onChange` events.
 *
 * `DayPicker` is an expandable component and it maintains its open/closed state by default. The
 * initial state can be supplied using `defaultOpen`. In order to directly control the open/closed
 * state, supply a value for `open` at creation time and update its value in response to
 * `onClose`/`OnOpen` events.
 *
 * Usage:
 * ```
 * <DayPicker
 *   defaultOpen
 *   defaultSelected={[2, 3]}
 *   onSelect={handleSelect}
 *   title="Select a Day"
 * />
 * ```
 *
 * @class DayPicker
 * @memberof moonstone/DayPicker
 * @extends moonstone/DayPicker.DayPickerBase
 * @mixes moonstone/ExpandableItem.Expandable
 * @mixes ui/Changeable.Changeable
 * @omit onChange
 * @omit value
 * @omit defaultValue
 * @ui
 * @public
 */

var DayPicker = DayPickerDecorator(DayPickerBase);
/**
 * The "aria-label" for the component.
 *
 * By default, "aria-label" is set to the title and the full names of the selected days or
 * the custom text when the weekend, week days, or all days is selected.
 *
 * @name aria-label
 * @type {String}
 * @memberof moonstone/DayPicker.DayPicker.prototype
 * @public
 */

/**
 * The initial value used when `open` is not set.
 *
 * @name defaultOpen
 * @type {Boolean}
 * @memberof moonstone/DayPicker.DayPicker.prototype
 * @public
 */

/**
 * The initial value used when `selected` is not set.
 *
 * @name defaultSelected
 * @type {Number|Number[]}
 * @memberof moonstone/DayPicker.DayPicker.prototype
 * @public
 */

/**
 * Disables DayPicker and the control becomes non-interactive.
 *
 * @name disabled
 * @type {Boolean}
 * @default false
 * @memberof moonstone/DayPicker.DayPicker.prototype
 * @public
 */

/**
 * The text displayed in the label when every day is selected
 *
 * @name everyDayText
 * @type {String}
 * @default 'Every Day'
 * @memberof moonstone/DayPicker.DayPicker.prototype
 * @public
 */

/**
 * The text displayed in the label when every weekeday is selected
 *
 * @name everyWeekdayText
 * @type {String}
 * @default 'Every Weekday'
 * @memberof moonstone/DayPicker.DayPicker.prototype
 * @public
 */

/**
 * The text displayed in the label when every weekend day is selected
 *
 * @name everyWeekendText
 * @type {String}
 * @default 'Every Weekend'
 * @memberof moonstone/DayPicker.DayPicker.prototype
 * @public
 */

exports.DayPicker = DayPicker;
var _default = DayPicker;
exports["default"] = _default;