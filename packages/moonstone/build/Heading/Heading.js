"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.HeadingDecorator = exports.HeadingBase = exports.Heading = exports["default"] = void 0;

var _kind = _interopRequireDefault(require("@enact/core/kind"));

var _Pure = _interopRequireDefault(require("@enact/ui/internal/Pure"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _compose = _interopRequireDefault(require("ramda/src/compose"));

var _defaultProps = _interopRequireDefault(require("recompose/defaultProps"));

var _setPropTypes = _interopRequireDefault(require("recompose/setPropTypes"));

var _Heading = _interopRequireDefault(require("@enact/ui/Heading"));

var _Marquee = require("../Marquee");

var _Skinnable = _interopRequireDefault(require("../Skinnable"));

var _HeadingModule = _interopRequireDefault(require("./Heading.module.css"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { _defineProperty(target, key, source[key]); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _objectWithoutProperties(source, excluded) { if (source == null) return {}; var target = _objectWithoutPropertiesLoose(source, excluded); var key, i; if (Object.getOwnPropertySymbols) { var sourceSymbolKeys = Object.getOwnPropertySymbols(source); for (i = 0; i < sourceSymbolKeys.length; i++) { key = sourceSymbolKeys[i]; if (excluded.indexOf(key) >= 0) continue; if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue; target[key] = source[key]; } } return target; }

function _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }

/**
 * A labeled Heading component.
 *
 * This component is most often not used directly but may be composed within another component as it
 * is within [Heading]{@link moonstone/Heading.Heading}.
 *
 * @class HeadingBase
 * @memberof moonstone/Heading
 * @ui
 * @public
 */
var HeadingBase = (0, _kind["default"])({
  name: 'Heading',
  propTypes:
  /** @lends moonstone/Heading.HeadingBase.prototype */
  {
    css: _propTypes["default"].object,

    /**
     * Adds a horizontal-rule (line) under the component
     *
     * @type {Boolean}
     * @public
     */
    showLine: _propTypes["default"].bool,

    /**
     * The size of the spacing around the Heading.
     *
     * Allowed values include:
     * * `'auto'` - Value is based on the `size` prop for automatic usage.
     * * `'large'` - Specifically assign the `'large'` spacing.
     * * `'medium'` - Specifically assign the `'medium'` spacing.
     * * `'small'` - Specifically assign the `'small'` spacing.
     * * `'none'` - No spacing at all. Neighboring elements will directly touch the Heading.
     *
     * @type {('auto'|'large'|'medium'|'small'|'none')}
     * @default 'small'
     * @public
     */
    spacing: _propTypes["default"].oneOf(['auto', 'large', 'medium', 'small', 'none'])
  },
  defaultProps: {
    spacing: 'small'
  },
  styles: {
    css: _HeadingModule["default"],
    className: 'heading'
  },
  computed: {
    className: function className(_ref) {
      var showLine = _ref.showLine,
          styler = _ref.styler;
      return styler.append({
        showLine: showLine
      });
    }
  },
  render: function render(_ref2) {
    var css = _ref2.css,
        rest = _objectWithoutProperties(_ref2, ["css"]);

    delete rest.showLine;
    return _Heading["default"].inline(_objectSpread({
      css: css
    }, rest));
  }
});
/**
 * Applies Moonstone specific behaviors to [HeadingBase]{@link moonstone/Heading.HeadingBase}.
 *
 * @hoc
 * @memberof moonstone/Heading
 * @mixes moonstone/Marquee.MarqueeDecorator
 * @mixes moonstone/Skinnable.Skinnable
 * @public
 */

exports.HeadingBase = HeadingBase;
var HeadingDecorator = (0, _compose["default"])((0, _setPropTypes["default"])({
  marqueeOn: _propTypes["default"].oneOf(['hover', 'render'])
}), (0, _defaultProps["default"])({
  marqueeOn: 'render'
}), _Pure["default"], _Marquee.MarqueeDecorator, _Skinnable["default"]);
/**
 * A labeled Heading component, ready to use in Moonstone applications.
 *
 * `Heading` may be used as a header to group related components.
 *
 * Usage:
 * ```
 * <Heading
 *   spacing="medium"
 * >
 *   Related Settings
 * </Heading>
 * <CheckboxItem>A Setting</CheckboxItem>
 * <CheckboxItem>A Second Setting</CheckboxItem>
 * ```
 *
 * @class Heading
 * @memberof moonstone/Heading
 * @extends moonstone/Heading.HeadingBase
 * @mixes moonstone/Heading.HeadingDecorator
 * @ui
 * @public
 */

exports.HeadingDecorator = HeadingDecorator;
var Heading = HeadingDecorator(HeadingBase);
/**
 * Marquee animation trigger.
 *
 * Allowed values include:
 * * `'hover'` - Marquee begins when the pointer enters the component
 * * `'render'` - Marquee begins when the component is rendered
 *
 * @name marqueeOn
 * @type {String}
 * @default 'render'
 * @memberof moonstone/Heading.Heading.prototype
 * @see {@link moonstone/Marquee.Marquee}
 * @public
 */

exports.Heading = Heading;
var _default = Heading;
exports["default"] = _default;