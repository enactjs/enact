"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.DaySelectorDecorator = exports.DaySelectorBase = exports.DaySelector = exports["default"] = void 0;

var _kind = _interopRequireDefault(require("@enact/core/kind"));

var _I18nDecorator = require("@enact/i18n/I18nDecorator");

var _Changeable = _interopRequireDefault(require("@enact/ui/Changeable"));

var _Group = _interopRequireDefault(require("@enact/ui/Group"));

var _Pure = _interopRequireDefault(require("@enact/ui/internal/Pure"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _compose = _interopRequireDefault(require("ramda/src/compose"));

var _react = _interopRequireDefault(require("react"));

var _Skinnable = _interopRequireDefault(require("../Skinnable"));

var _DaySelectorDecorator = _interopRequireDefault(require("./DaySelectorDecorator"));

var _DaySelectorItem = _interopRequireDefault(require("./DaySelectorItem"));

var _DaySelectorModule = _interopRequireDefault(require("./DaySelector.module.css"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

/**
 * Moonstone styled inline day selector components.
 *
 * @example
 * <DaySelector
 *   defaultSelected={[2, 3]}
 *   onSelect={console.log}
 * />
 *
 * @module moonstone/DaySelector
 * @exports	DaySelector
 * @exports DaySelectorBase
 * @exports DaySelectorDecorator
 */

/**
 * A Moonstone styled inline day of the week selection component.
 *
 * This component is most often not used directly but may be composed within another component as it
 * is within [DaySelector]{@link moonstone/DaySelector.DaySelector}.
 *
 * @class DaySelectorBase
 * @memberof moonstone/DaySelector
 * @ui
 * @public
 */
var DaySelectorBase = (0, _kind["default"])({
  name: 'DaySelectorBase',
  propTypes:
  /** @lends moonstone/DaySelector.DaySelectorBase.prototype */
  {
    /**
     * Disables DaySelector and the control becomes non-interactive.
     *
     * @type {Boolean}
     * @public
     */
    disabled: _propTypes["default"].bool,

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
    selected: _propTypes["default"].oneOfType([_propTypes["default"].number, _propTypes["default"].arrayOf(_propTypes["default"].number)])
  },
  defaultProps: {
    disabled: false
  },
  styles: {
    css: _DaySelectorModule["default"],
    className: 'daySelector'
  },
  render: function render(props) {
    return _react["default"].createElement(_Group["default"], Object.assign({}, props, {
      childComponent: _DaySelectorItem["default"],
      childSelect: "onToggle",
      itemProps: {
        className: _DaySelectorModule["default"].daySelectorItem,
        disabled: props.disabled
      },
      select: "multiple",
      selectedProp: "selected"
    }));
  }
}); // documented in ./DaySelectorDecorator.js

exports.DaySelectorBase = DaySelectorBase;
var DaySelectorDecorator = (0, _compose["default"])(_Pure["default"], (0, _Changeable["default"])({
  change: 'onSelect',
  prop: 'selected'
}), (0, _I18nDecorator.I18nContextDecorator)({
  localeProp: 'locale'
}), _DaySelectorDecorator["default"], _Skinnable["default"]);
/**
 * An inline day of the week selection component, ready to use in Moonstone applications.
 *
 * `DaySelector` may be used to select one or more days of the week from a horizontal list of
 * abbreviated day names.
 *
 * By default, `DaySelector` maintains the state of its `selected` property. Supply the
 * `defaultSelected` property to control its initial value. If you wish to directly control updates
 * to the component, supply a value to `selected` at creation time and update it in response to
 * `onChange` events.
 *
 * Usage:
 * ```
 * <DaySelector
 *   defaultSelected={[2, 3]}
 *   longDayLabels
 *   onSelect={handleSelect}
 * />
 * ```
 * @class DaySelector
 * @extends moonstone/DaySelector.DaySelectorBase
 * @mixes moonstone/DaySelector.DaySelectorDecorator
 * @memberof moonstone/DaySelector
 * @ui
 * @public
 */

exports.DaySelectorDecorator = DaySelectorDecorator;
var DaySelector = DaySelectorDecorator(DaySelectorBase);
exports.DaySelector = DaySelector;
var _default = DaySelector;
exports["default"] = _default;