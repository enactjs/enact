"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ButtonDecorator = exports.ButtonBase = exports.Button = exports["default"] = void 0;

var _kind = _interopRequireDefault(require("@enact/core/kind"));

var _util = require("@enact/core/util");

var _Spottable = _interopRequireDefault(require("@enact/spotlight/Spottable"));

var _Button = require("@enact/ui/Button");

var _Pure = _interopRequireDefault(require("@enact/ui/internal/Pure"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _compose = _interopRequireDefault(require("ramda/src/compose"));

var _Icon = require("../Icon");

var _Marquee = require("../Marquee");

var _Skinnable = _interopRequireDefault(require("../Skinnable"));

var _ButtonModule = _interopRequireDefault(require("./Button.module.css"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { _defineProperty(target, key, source[key]); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _objectWithoutProperties(source, excluded) { if (source == null) return {}; var target = _objectWithoutPropertiesLoose(source, excluded); var key, i; if (Object.getOwnPropertySymbols) { var sourceSymbolKeys = Object.getOwnPropertySymbols(source); for (i = 0; i < sourceSymbolKeys.length; i++) { key = sourceSymbolKeys[i]; if (excluded.indexOf(key) >= 0) continue; if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue; target[key] = source[key]; } } return target; }

function _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }

// Make a basic Icon in case we need it later. This cuts `Pure` out of icon for a small gain.
var Icon = (0, _Skinnable["default"])(_Icon.IconBase);
/**
 * A button component.
 *
 * This component is most often not used directly but may be composed within another component as it
 * is within [Button]{@link moonstone/Button.Button}.
 *
 * @class ButtonBase
 * @memberof moonstone/Button
 * @extends ui/Button.ButtonBase
 * @ui
 * @public
 */

var ButtonBase = (0, _kind["default"])({
  name: 'Button',
  propTypes:
  /** @lends moonstone/Button.ButtonBase.prototype */
  {
    /**
     * The background opacity of this button.
     *
     * Valid values are:
     * * `'translucent'`,
     * * `'lightTranslucent'`, and
     * * `'transparent'`.
     *
     * @type {('translucent'|'lightTranslucent'|'transparent')}
     * @public
     */
    backgroundOpacity: _propTypes["default"].oneOf(['translucent', 'lightTranslucent', 'transparent']),

    /**
     * The color of the underline beneath button's content.
     *
     * Accepts one of the following color names, which correspond with the colored buttons on a
     * standard remote control: `'red'`, `'green'`, `'yellow'`, `'blue'`.
     *
     * @type {('red'|'green'|'yellow'|'blue')}
     * @public
     */
    color: _propTypes["default"].oneOf(['red', 'green', 'yellow', 'blue']),

    /**
     * Customizes the component by mapping the supplied collection of CSS class names to the
     * corresponding internal Elements and states of this component.
     *
     * The following classes are supported:
     *
     * * `button` - The root class name
     * * `bg` - The background node of the button
     * * `large` - Applied to a `size='large'` button
     * * `selected` - Applied to a `selected` button
     * * `small` - Applied to a `size='small'` button
     *
     * @type {Object}
     * @public
     */
    // `transparent` and `client` were intentionally excluded from the above documented
    // exported classes as they do not appear to provide value to the end-developer, but are
    // needed by IconButton internally for its design guidelines.
    // Same for `pressed` which is used by Dropdown to nullify the key-press activate animation.
    css: _propTypes["default"].object,

    /**
     * Specifies on which side (`'before'` or `'after'`) of the text the icon appears.
     *
     * @type {('before'|'after')}
     * @default 'before'
     * @public
     */
    iconPosition: _propTypes["default"].oneOf(['before', 'after']),

    /**
     * The size of the button.
     *
     * @type {('large'|'small')}
     * @default 'small'
     * @public
     */
    size: _propTypes["default"].string
  },
  defaultProps: {
    iconPosition: 'before',
    size: 'small'
  },
  styles: {
    css: _ButtonModule["default"],
    publicClassNames: ['button', 'bg', 'client', 'large', 'pressed', 'selected', 'small', 'transparent']
  },
  computed: {
    className: function className(_ref) {
      var backgroundOpacity = _ref.backgroundOpacity,
          color = _ref.color,
          iconPosition = _ref.iconPosition,
          styler = _ref.styler;
      return styler.append({
        hasColor: color
      }, backgroundOpacity, color, "icon".concat((0, _util.cap)(iconPosition)));
    }
  },
  render: function render(_ref2) {
    var css = _ref2.css,
        rest = _objectWithoutProperties(_ref2, ["css"]);

    delete rest.backgroundOpacity;
    delete rest.color;
    delete rest.iconPosition;
    return _Button.ButtonBase.inline(_objectSpread({
      'data-webos-voice-intent': 'Select'
    }, rest, {
      css: css,
      iconComponent: Icon
    }));
  }
});
/**
 * Enforces a minimum width on the Button.
 *
 * *NOTE*: This property's default is `true` and must be explicitly set to `false` to allow
 * the button to shrink to fit its contents.
 *
 * @name minWidth
 * @memberof moonstone/Button.ButtonBase.prototype
 * @type {Boolean}
 * @default true
 * @public
 */

/**
 * Applies Moonstone specific behaviors to [Button]{@link moonstone/Button.ButtonBase} components.
 *
 * @hoc
 * @memberof moonstone/Button
 * @mixes moonstone/Marquee.MarqueeDecorator
 * @mixes ui/Button.ButtonDecorator
 * @mixes spotlight/Spottable.Spottable
 * @mixes moonstone/Skinnable.Skinnable
 * @public
 */

exports.ButtonBase = ButtonBase;
var ButtonDecorator = (0, _compose["default"])(_Pure["default"], (0, _Marquee.MarqueeDecorator)({
  className: _ButtonModule["default"].marquee
}), _Button.ButtonDecorator, _Spottable["default"], _Skinnable["default"]);
/**
 * A button component, ready to use in Moonstone applications.
 *
 * Usage:
 * ```
 * <Button
 * 	backgroundOpacity="translucent"
 * 	color="blue"
 * >
 * 	Press me!
 * </Button>
 * ```
 *
 * @class Button
 * @memberof moonstone/Button
 * @extends moonstone/Button.ButtonBase
 * @mixes moonstone/Button.ButtonDecorator
 * @ui
 * @public
 */

exports.ButtonDecorator = ButtonDecorator;
var Button = ButtonDecorator(ButtonBase);
exports.Button = Button;
var _default = Button;
exports["default"] = _default;