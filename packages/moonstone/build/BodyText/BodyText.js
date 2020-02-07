"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.BodyTextDecorator = exports.BodyTextBase = exports.BodyText = exports["default"] = void 0;

var _kind = _interopRequireDefault(require("@enact/core/kind"));

var _react = _interopRequireDefault(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _compose = _interopRequireDefault(require("ramda/src/compose"));

var _BodyText = _interopRequireDefault(require("@enact/ui/BodyText"));

var _Pure = _interopRequireDefault(require("@enact/ui/internal/Pure"));

var _Marquee = require("../Marquee");

var _Skinnable = _interopRequireDefault(require("../Skinnable"));

var _BodyTextModule = _interopRequireDefault(require("./BodyText.module.css"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _objectWithoutProperties(source, excluded) { if (source == null) return {}; var target = _objectWithoutPropertiesLoose(source, excluded); var key, i; if (Object.getOwnPropertySymbols) { var sourceSymbolKeys = Object.getOwnPropertySymbols(source); for (i = 0; i < sourceSymbolKeys.length; i++) { key = sourceSymbolKeys[i]; if (excluded.indexOf(key) >= 0) continue; if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue; target[key] = source[key]; } } return target; }

function _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }

// Create a Marquee using BodyText as the base
var MarqueeBodyText = (0, _Marquee.MarqueeDecorator)(_BodyText["default"]);
/**
 * A simple text block component.
 *
 * This component is most often not used directly but may be composed within another component as it
 * is within [BodyText]{@link moonstone/BodyText.BodyText}.
 *
 * @class BodyTextBase
 * @memberof moonstone/BodyText
 * @extends ui/BodyText.BodyText
 * @ui
 * @public
 */

var BodyTextBase = (0, _kind["default"])({
  name: 'BodyText',
  propTypes:
  /** @lends moonstone/BodyText.BodyTextBase.prototype */
  {
    /**
     * Centers the contents.
     *
     * Applies the `centered` CSS class which can be customized by
     * [theming]{@link /docs/developer-guide/theming/}.
     *
     * @type {Boolean}
     * @public
     */
    centered: _propTypes["default"].bool,

    /**
     * Customizes the component by mapping the supplied collection of CSS class names to the
     * corresponding internal Elements and states of this component.
     *
     * The following classes are supported:
     *
     * * `bodyText` - The root class name
     *
     * @type {Object}
     * @public
     */
    css: _propTypes["default"].object,

    /**
     * Toggles multi-line (`false`) vs single-line (`true`) behavior. `noWrap` mode
     * automatically enables {@link moonstone/Marquee} so long text isn't permanently occluded.
     *
     * @type {Boolean}
     * @default false
     * @public
     */
    noWrap: _propTypes["default"].bool,

    /**
     * Sets the text size to one of the preset sizes.
     * Available sizes: 'large' (default) and 'small'.
     *
     * @type {('small'|'large')}
     * @default 'large'
     * @public
     */
    size: _propTypes["default"].oneOf(['small', 'large'])
  },
  defaultProps: {
    noWrap: false,
    size: 'large'
  },
  styles: {
    css: _BodyTextModule["default"],
    publicClassNames: 'bodyText'
  },
  computed: {
    className: function className(_ref) {
      var noWrap = _ref.noWrap,
          size = _ref.size,
          styler = _ref.styler;
      return styler.append(size, {
        noWrap: noWrap
      });
    }
  },
  render: function render(_ref2) {
    var centered = _ref2.centered,
        css = _ref2.css,
        noWrap = _ref2.noWrap,
        rest = _objectWithoutProperties(_ref2, ["centered", "css", "noWrap"]);

    delete rest.size;

    if (noWrap) {
      return _react["default"].createElement(MarqueeBodyText, Object.assign({
        component: "div" // Assign a new component to BodyText, since DIV is not allowed inside a P tag (the default for BodyText)
        ,
        marqueeOn: "render"
      }, rest, {
        alignment: centered ? 'center' : null // Centering Marquee
        ,
        centered: centered // Centering UiBodyText
        ,
        css: css
      }));
    }

    return _react["default"].createElement(_BodyText["default"], Object.assign({}, rest, {
      centered: centered,
      css: css
    }));
  }
});
/**
 * Applies Moonstone specific behaviors to [BodyText]{@link moonstone/BodyText.BodyTextBase}.
 *
 * @hoc
 * @memberof moonstone/BodyText
 * @mixes moonstone/Skinnable.Skinnable
 * @public
 */

exports.BodyTextBase = BodyTextBase;
var BodyTextDecorator = (0, _compose["default"])(_Pure["default"], _Skinnable["default"]);
/**
 * A simple text block component, ready to use in Moonstone applications.
 *
 * `BodyText` may be used to display a block of text and is sized and spaced appropriately for a
 * Moonstone application.
 *
 * Usage:
 * ```
 * <BodyText>
 *  I have a Ham radio. There are many like it, but this one is mine.
 * </BodyText>
 * ```
 *
 * @class BodyText
 * @memberof moonstone/BodyText
 * @extends moonstone/BodyText.BodyTextBase
 * @mixes moonstone/BodyText.BodyTextDecorator
 * @ui
 * @public
 */

exports.BodyTextDecorator = BodyTextDecorator;
var BodyText = BodyTextDecorator(BodyTextBase);
exports.BodyText = BodyText;
var _default = BodyText;
exports["default"] = _default;