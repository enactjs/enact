"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.RadioItemBase = exports.RadioItem = exports["default"] = void 0;

var _kind = _interopRequireDefault(require("@enact/core/kind"));

var _react = _interopRequireDefault(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _ToggleIcon = _interopRequireDefault(require("../ToggleIcon"));

var _ToggleItem = _interopRequireDefault(require("../ToggleItem"));

var _RadioItemModule = _interopRequireDefault(require("./RadioItem.module.css"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

/**
 * Provides a Moonstone-themed Item component and interactive toggleable radio icon.
 *
 * @example
 * <RadioItem>Item</RadioItem>
 *
 * @module moonstone/RadioItem
 * @exports RadioItem
 * @exports RadioItemBase
 */

/**
 * Renders an `Item` with a radio-dot icon.
 *
 * @class RadioItem
 * @memberof moonstone/RadioItem
 * @extends moonstone/ToggleItem.ToggleItem
 * @omit iconComponent
 * @ui
 * @public
 */
var RadioItemBase = (0, _kind["default"])({
  name: 'RadioItem',
  propTypes:
  /** @lends moonstone/RadioItem.RadioItem.prototype */
  {
    /**
     * Customizes the component by mapping the supplied collection of CSS class names to the
     * corresponding internal Elements and states of this component.
     *
     * The following classes are supported:
     *
     * * `radioItem` - The root class name
     *
     * @type {Object}
     * @public
     */
    css: _propTypes["default"].object
  },
  styles: {
    css: _RadioItemModule["default"],
    className: 'radioItem',
    publicClassNames: ['radioItem']
  },
  render: function render(props) {
    return _react["default"].createElement(_ToggleItem["default"], Object.assign({
      "data-webos-voice-intent": "SelectRadioItem"
    }, props, {
      css: props.css,
      iconComponent: _react["default"].createElement(_ToggleIcon["default"], {
        css: _RadioItemModule["default"]
      })
    }));
  }
});
exports.RadioItemBase = exports.RadioItem = RadioItemBase;
var _default = RadioItemBase;
exports["default"] = _default;