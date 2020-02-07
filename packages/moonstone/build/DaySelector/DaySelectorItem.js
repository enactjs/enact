"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.DaySelectorItem = exports["default"] = void 0;

var _kind = _interopRequireDefault(require("@enact/core/kind"));

var _react = _interopRequireDefault(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _ToggleItem = _interopRequireDefault(require("../ToggleItem"));

var _DaySelectorCheckbox = _interopRequireDefault(require("./DaySelectorCheckbox"));

var _DaySelectorItemModule = _interopRequireDefault(require("./DaySelectorItem.module.css"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

/**
 * An extension of [Item]{@link moonstone/Item.Item} that can be toggled between two states via its
 * `selected` prop.
 *
 * By default, `DaySelectorItem` maintains the state of its `selected` property. Supply the
 * `defaultSelected` property to control its initial value. If you wish to directly control updates
 * to the component, supply a value to `selected` at creation time and update it in response to
 * `onToggle` events.
 *
 * @class DaySelectorItem
 * @memberof moonstone/DaySelector
 * @ui
 * @private
 */
var DaySelectorItem = (0, _kind["default"])({
  name: 'DaySelectorItem',
  propTypes:
  /** @lends moonstone/DaySelector.DaySelectorItem.prototype */
  {
    /**
     * The string to be displayed as the main content of the checkbox item.
     *
     * @type {String}
     * @required
     * @public
     */
    children: _propTypes["default"].string.isRequired,

    /**
     * When `true`, applies a disabled style and the control becomes non-interactive.
     *
     * @type {Boolean}
     * @public
     */
    disabled: _propTypes["default"].bool,

    /**
     * Specifies on which side (`before` or `after`) of the text the icon appears.
     *
     * @type {String}
     * @default 'before'
     * @public
     */
    iconPosition: _propTypes["default"].oneOf(['before', 'after']),

    /**
     * When `true`, an inline visual effect is applied to the button.
     *
     * @type {Boolean}
     * @public
     */
    inline: _propTypes["default"].bool,

    /**
     * The handler to run when the checkbox item is toggled.
     *
     * @type {Function}
     * @param {Object} event
     * @param {String} event.selected - Selected value of item.
     * @param {*} event.value - Value passed from `value` prop.
     * @public
     */
    onToggle: _propTypes["default"].func,

    /**
     * When `true`, a check mark icon is applied to the button.
     *
     * @type {Boolean}
     * @public
     */
    selected: _propTypes["default"].bool,

    /**
     * The value that will be sent to the `onToggle` handler.
     *
     * @type {String|Number}
     * @default ''
     * @public
     */
    value: _propTypes["default"].oneOfType([_propTypes["default"].string, _propTypes["default"].number])
  },
  defaultProps: {
    iconPosition: 'before',
    value: ''
  },
  styles: {
    css: _DaySelectorItemModule["default"],
    className: 'daySelectorItem'
  },
  computed: {
    className: function className(_ref) {
      var selected = _ref.selected,
          styler = _ref.styler;
      return styler.append({
        selected: selected
      });
    }
  },
  render: function render(props) {
    return _react["default"].createElement(_ToggleItem["default"], Object.assign({}, props, {
      iconComponent: _DaySelectorCheckbox["default"]
    }));
  }
});
exports.DaySelectorItem = DaySelectorItem;
var _default = DaySelectorItem;
exports["default"] = _default;