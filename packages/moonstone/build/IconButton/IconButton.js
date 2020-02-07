"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.IconButtonDecorator = exports.IconButtonBase = exports.IconButton = exports["default"] = void 0;

var _kind = _interopRequireDefault(require("@enact/core/kind"));

var _IconButton = require("@enact/ui/IconButton");

var _Pure = _interopRequireDefault(require("@enact/ui/internal/Pure"));

var _Spottable = _interopRequireDefault(require("@enact/spotlight/Spottable"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _compose = _interopRequireDefault(require("ramda/src/compose"));

var _react = _interopRequireDefault(require("react"));

var _Button = require("../Button");

var _Icon = _interopRequireDefault(require("../Icon"));

var _Skinnable = _interopRequireDefault(require("../Skinnable"));

var _TooltipDecorator = _interopRequireDefault(require("../TooltipDecorator"));

var _IconButtonModule = _interopRequireDefault(require("./IconButton.module.css"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { _defineProperty(target, key, source[key]); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _objectWithoutProperties(source, excluded) { if (source == null) return {}; var target = _objectWithoutPropertiesLoose(source, excluded); var key, i; if (Object.getOwnPropertySymbols) { var sourceSymbolKeys = Object.getOwnPropertySymbols(source); for (i = 0; i < sourceSymbolKeys.length; i++) { key = sourceSymbolKeys[i]; if (excluded.indexOf(key) >= 0) continue; if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue; target[key] = source[key]; } } return target; }

function _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }

/**
 * A moonstone-styled icon button without any behavior.
 *
 * @class IconButtonBase
 * @memberof moonstone/IconButton
 * @extends moonstone/Button.ButtonBase
 * @extends ui/IconButton.IconButtonBase
 * @omit buttonComponent
 * @omit iconComponent
 * @ui
 * @public
 */
var IconButtonBase = (0, _kind["default"])({
  name: 'IconButton',
  propTypes:
  /** @lends moonstone/IconButton.IconButtonBase.prototype */
  {
    /**
     * The background-color opacity of this icon button.
     *
     * Valid values are:
     * * `'translucent'`,
     * * `'lightTranslucent'`, and
     * * `'transparent'`.
     *
     * @type {String}
     * @public
     */
    backgroundOpacity: _propTypes["default"].oneOf(['translucent', 'lightTranslucent', 'transparent']),

    /**
     * The color of the underline beneath the icon.
     *
     * This property accepts one of the following color names, which correspond with the
     * colored buttons on a standard remote control: `'red'`, `'green'`, `'yellow'`, `'blue'`
     *
     * @type {String}
     * @public
     */
    color: _propTypes["default"].oneOf(['red', 'green', 'yellow', 'blue']),

    /**
     * Customizes the component by mapping the supplied collection of CSS class names to the
     * corresponding internal Elements and states of this component.
     *
     * The following classes are supported:
     *
     * * `iconButton` - The root class name
     * * `bg` - The background node of the icon button
     * * `large` - Applied to a `size='large'` icon button
     * * `selected` - Applied to a `selected` icon button
     * * `small` - Applied to a `size='small'` icon button
     *
     * @type {Object}
     * @public
     */
    css: _propTypes["default"].object
  },
  defaultProps: {
    size: 'small'
  },
  styles: {
    css: _IconButtonModule["default"],
    publicClassNames: ['iconButton', 'bg', 'large', 'selected', 'small']
  },
  computed: {
    className: function className(_ref) {
      var color = _ref.color,
          styler = _ref.styler;
      return styler.append(color);
    }
  },
  render: function render(_ref2) {
    var children = _ref2.children,
        css = _ref2.css,
        rest = _objectWithoutProperties(_ref2, ["children", "css"]);

    return _IconButton.IconButtonBase.inline(_objectSpread({
      'data-webos-voice-intent': 'Select'
    }, rest, {
      buttonComponent: _react["default"].createElement(_Button.ButtonBase, {
        css: css
      }),
      css: css,
      icon: children,
      iconComponent: _Icon["default"]
    }));
  }
});
/**
 * Moonstone-specific button behaviors to apply to
 * [IconButton]{@link moonstone/IconButton.IconButtonBase}.
 *
 * @hoc
 * @memberof moonstone/IconButton
 * @mixes moonstone/TooltipDecorator.TooltipDecorator
 * @mixes ui/IconButton.IconButtonDecorator
 * @mixes spotlight/Spottable.Spottable
 * @mixes moonstone/Skinnable.Skinnable
 * @public
 */

exports.IconButtonBase = IconButtonBase;
var IconButtonDecorator = (0, _compose["default"])(_Pure["default"], (0, _TooltipDecorator["default"])({
  tooltipDestinationProp: 'decoration'
}), _IconButton.IconButtonDecorator, _Spottable["default"], _Skinnable["default"]);
/**
 * `IconButton` does not have `Marquee` like `Button` has, as it should not contain text.
 *
 * Usage:
 * ```
 * <IconButton onClick={handleClick} size="small">
 *     plus
 * </IconButton>
 * ```
 *
 * @class IconButton
 * @memberof moonstone/IconButton
 * @extends moonstone/IconButton.IconButtonBase
 * @mixes moonstone/IconButton.IconButtonDecorator
 * @ui
 * @public
 */

exports.IconButtonDecorator = IconButtonDecorator;
var IconButton = IconButtonDecorator(IconButtonBase);
exports.IconButton = IconButton;
var _default = IconButton;
exports["default"] = _default;