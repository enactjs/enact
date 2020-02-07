"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.CheckboxItemBase = exports.CheckboxItem = exports["default"] = void 0;

var _kind = _interopRequireDefault(require("@enact/core/kind"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _react = _interopRequireDefault(require("react"));

var _Checkbox = _interopRequireDefault(require("../Checkbox"));

var _ToggleItem = _interopRequireDefault(require("../ToggleItem"));

var _CheckboxItemModule = _interopRequireDefault(require("./CheckboxItem.module.css"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

/**
 * Moonstone styled item components with a toggleable checkbox.
 *
 * @example
 * <CheckboxItem onToggle={console.log}>
 * 	Item with a Checkbox
 * </CheckboxItem>
 *
 * @module moonstone/CheckboxItem
 * @exports CheckboxItem
 * @exports CheckboxItemBase
 */

/**
 * An item with a checkbox component, ready to use in Moonstone applications.
 *
 * `CheckboxItem` may be used to allow the user to select a single option or used as part of a
 * [Group]{@link ui/Group} when multiple [selections]{@link ui/Group.Group.select} are possible.
 *
 * Usage:
 * ```
 * <CheckboxItem
 * 	defaultSelected={selected}
 * 	onToggle={handleToggle}
 * >
 *  Item with a Checkbox
 * </CheckboxItem>
 * ```
 *
 * @class CheckboxItem
 * @memberof moonstone/CheckboxItem
 * @extends moonstone/ToggleItem.ToggleItem
 * @omit iconComponent
 * @ui
 * @public
 */
var CheckboxItemBase = (0, _kind["default"])({
  name: 'CheckboxItem',
  propTypes:
  /** @lends moonstone/CheckboxItem.CheckboxItem.prototype */
  {
    /**
     * Customizes the component by mapping the supplied collection of CSS class names to the
     * corresponding internal Elements and states of this component.
     *
     * The following classes are supported:
     *
     * * `checkboxItem` - The root class name
     *
     * @type {Object}
     * @public
     */
    css: _propTypes["default"].object
  },
  styles: {
    css: _CheckboxItemModule["default"],
    className: 'checkboxItem',
    publicClassNames: ['checkboxItem']
  },
  render: function render(props) {
    return _react["default"].createElement(_ToggleItem["default"], Object.assign({
      "data-webos-voice-intent": "SelectCheckItem"
    }, props, {
      css: props.css,
      iconComponent: _Checkbox["default"]
    }));
  }
});
exports.CheckboxItemBase = exports.CheckboxItem = CheckboxItemBase;
var _default = CheckboxItemBase;
exports["default"] = _default;