"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.SwitchItemBase = exports.SwitchItem = exports["default"] = void 0;

var _kind = _interopRequireDefault(require("@enact/core/kind"));

var _ComponentOverride = _interopRequireDefault(require("@enact/ui/ComponentOverride"));

var _propTypes = _interopRequireDefault(require("@enact/core/internal/prop-types"));

var _react = _interopRequireDefault(require("react"));

var _propTypes2 = _interopRequireDefault(require("prop-types"));

var _Switch = _interopRequireDefault(require("../Switch"));

var _ToggleItem = _interopRequireDefault(require("../ToggleItem"));

var _SwitchItemModule = _interopRequireDefault(require("./SwitchItem.module.css"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

/**
 * Provides Moonstone-themed item component and interactive toggleable switch.
 *
 * @example
 * <SwitchItem>
 * 	Item
 * </SwitchItem>
 *
 * @module moonstone/SwitchItem
 * @exports SwitchItem
 * @exports SwitchItemBase
 */

/**
 * Renders an item with a [Switch]{@link moonstone/Switch}.
 *
 * @class SwitchItem
 * @memberof moonstone/SwitchItem
 * @extends moonstone/ToggleItem.ToggleItem
 * @omit iconComponent
 * @ui
 * @public
 */
var SwitchItemBase = (0, _kind["default"])({
  name: 'SwitchItem',
  propTypes:
  /** @lends moonstone/SwitchItem.SwitchItem.prototype */
  {
    /**
     * Customizes the component by mapping the supplied collection of CSS class names to the
     * corresponding internal Elements and states of this component.
     *
     * The following classes are supported:
     *
     * * `switchItem` - The root class name
     *
     * @type {Object}
     * @public
     */
    css: _propTypes2["default"].object,

    /**
     * Customize the component used as the switch.
     *
     * @type {Element|Component}
     * @default {@link moonstone/Switch.Switch}
     * @private
     */
    iconComponent: _propTypes["default"].componentOverride
  },
  defaultProps: {
    iconComponent: _Switch["default"]
  },
  styles: {
    css: _SwitchItemModule["default"],
    className: 'switchItem',
    publicClassNames: ['switchItem']
  },
  computed: {
    iconComponent: function iconComponent(_ref) {
      var css = _ref.css,
          _iconComponent = _ref.iconComponent;
      return _react["default"].createElement(_ComponentOverride["default"], {
        component: _iconComponent,
        className: css["switch"]
      });
    }
  },
  render: function render(props) {
    return _react["default"].createElement(_ToggleItem["default"], Object.assign({
      "data-webos-voice-intent": "SetToggleItem"
    }, props, {
      css: props.css,
      iconPosition: "after"
    }));
  }
});
exports.SwitchItemBase = exports.SwitchItem = SwitchItemBase;
var _default = SwitchItemBase;
exports["default"] = _default;