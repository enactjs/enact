"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ToggleButtonBase = exports.ToggleButton = exports["default"] = void 0;

var _kind = _interopRequireDefault(require("@enact/core/kind"));

var _react = _interopRequireDefault(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _Pure = _interopRequireDefault(require("@enact/ui/internal/Pure"));

var _Toggleable = _interopRequireDefault(require("@enact/ui/Toggleable"));

var _Button = _interopRequireDefault(require("../Button"));

var _Skinnable = _interopRequireDefault(require("../Skinnable"));

var _ToggleButtonModule = _interopRequireDefault(require("./ToggleButton.module.css"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _objectWithoutProperties(source, excluded) { if (source == null) return {}; var target = _objectWithoutPropertiesLoose(source, excluded); var key, i; if (Object.getOwnPropertySymbols) { var sourceSymbolKeys = Object.getOwnPropertySymbols(source); for (i = 0; i < sourceSymbolKeys.length; i++) { key = sourceSymbolKeys[i]; if (excluded.indexOf(key) >= 0) continue; if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue; target[key] = source[key]; } } return target; }

function _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }

/**
 * A stateless [Button]{@link moonstone/Button.Button} that can be toggled by changing its
 * `selected` property.
 *
 * @class ToggleButtonBase
 * @memberof moonstone/ToggleButton
 * @extends moonstone/Button.Button
 * @ui
 * @public
 */
var ToggleButtonBase = (0, _kind["default"])({
  name: 'ToggleButton',
  propTypes:
  /** @lends moonstone/ToggleButton.ToggleButtonBase.prototype */
  {
    /**
     * The background-color opacity of this button.
     *
     * * Values: `'translucent'`, `'lightTranslucent'`, `'transparent'`
     *
     * @type {String}
     * @public
     */
    backgroundOpacity: _propTypes["default"].oneOf(['translucent', 'lightTranslucent', 'transparent']),

    /**
     * The string to be displayed as the main content of the toggle button.
     *
     * If `toggleOffLabel` and/or `toggleOnLabel` are provided, they will be used for the
     * respective states.
     *
     * @type {Node}
     * @public
     */
    children: _propTypes["default"].node,

    /**
     * Disables the button.
     *
     * @type {Boolean}
     * @default false
     * @public
     */
    disabled: _propTypes["default"].bool,

    /**
     * Enforces a minimum width on the Button.
     *
     * *NOTE*: This property's default is `true` and must be explicitly set to `false` to allow
     * the button to shrink to fit its contents.
     *
     * @type {Boolean}
     * @default true
     * @public
     */
    minWidth: _propTypes["default"].bool,

    /**
     * Applies a pressed visual effect.
     *
     * @type {Boolean}
     * @public
     */
    pressed: _propTypes["default"].bool,

    /**
     * Indicates the button is 'on'.
     *
     * @type {Boolean}
     * @default false
     * @public
     */
    selected: _propTypes["default"].bool,

    /**
     * The size of the button.
     *
     * A `'small'` button will have a larger tap target than its apparent size to allow it to be
     * clicked more easily.
     *
     * @type {('small'|'large')}
     * @default 'large'
     * @public
     */
    size: _propTypes["default"].string,

    /**
     * Button text displayed in the 'off' state.
     *
     * If not specified, `children` will be used for 'off' button text.
     *
     * @type {String}
     * @default ''
     * @public
     */
    toggleOffLabel: _propTypes["default"].string,

    /**
     * Button text displayed in the 'on' state.
     *
     * If not specified, `children` will be used for 'on' button text.
     *
     * @type {String}
     * @default ''
     * @public
     */
    toggleOnLabel: _propTypes["default"].string
  },
  defaultProps: {
    disabled: false,
    minWidth: true,
    selected: false,
    toggleOffLabel: '',
    toggleOnLabel: ''
  },
  styles: {
    css: _ToggleButtonModule["default"],
    className: 'toggleButton'
  },
  computed: {
    className: function className(_ref) {
      var selected = _ref.selected,
          size = _ref.size,
          styler = _ref.styler;
      return styler.append({
        selected: selected
      }, size);
    },
    children: function children(_ref2) {
      var _children = _ref2.children,
          selected = _ref2.selected,
          toggleOnLabel = _ref2.toggleOnLabel,
          toggleOffLabel = _ref2.toggleOffLabel;
      var c = _children;

      if (selected && toggleOnLabel) {
        c = toggleOnLabel;
      } else if (!selected && toggleOffLabel) {
        c = toggleOffLabel;
      }

      return c;
    }
  },
  render: function render(_ref3) {
    var selected = _ref3.selected,
        rest = _objectWithoutProperties(_ref3, ["selected"]);

    delete rest.toggleOffLabel;
    delete rest.toggleOnLabel;
    return _react["default"].createElement(_Button["default"], Object.assign({
      "data-webos-voice-intent": "SetToggleItem"
    }, rest, {
      "aria-pressed": selected,
      css: _ToggleButtonModule["default"],
      decoration: _react["default"].createElement("div", {
        className: _ToggleButtonModule["default"].toggleIndicator
      }),
      selected: selected
    }));
  }
});
/**
 * A toggleable button.
 *
 * By default, `ToggleButton` maintains the state of its `selected` property.
 * Supply the `defaultSelected` property to control its initial value. If you
 * wish to directly control updates to the component, supply a value to `selected` at creation time
 * and update it in response to `onToggle` events.
 *
 * @class ToggleButton
 * @memberof moonstone/ToggleButton
 * @extends moonstone/ToggleButton.ToggleButtonBase
 * @ui
 * @mixes ui/Toggleable
 * @public
 */

exports.ToggleButtonBase = ToggleButtonBase;
var ToggleButton = (0, _Pure["default"])((0, _Toggleable["default"])({
  prop: 'selected',
  toggleProp: 'onTap'
}, (0, _Skinnable["default"])(ToggleButtonBase)));
exports.ToggleButton = ToggleButton;
var _default = ToggleButton;
exports["default"] = _default;