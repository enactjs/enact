"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ControlsBase = exports.Controls = exports["default"] = void 0;

var _kind = _interopRequireDefault(require("@enact/core/kind"));

var _SpotlightContainerDecorator = _interopRequireDefault(require("@enact/spotlight/SpotlightContainerDecorator"));

var _ForwardRef = _interopRequireDefault(require("@enact/ui/ForwardRef"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _react = _interopRequireDefault(require("react"));

var _ApplicationCloseButton = _interopRequireDefault(require("./ApplicationCloseButton"));

var _PanelsModule = _interopRequireDefault(require("./Panels.module.css"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _objectWithoutProperties(source, excluded) { if (source == null) return {}; var target = _objectWithoutPropertiesLoose(source, excluded); var key, i; if (Object.getOwnPropertySymbols) { var sourceSymbolKeys = Object.getOwnPropertySymbols(source); for (i = 0; i < sourceSymbolKeys.length; i++) { key = sourceSymbolKeys[i]; if (excluded.indexOf(key) >= 0) continue; if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue; target[key] = source[key]; } } return target; }

function _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }

/**
 * Group of controls shared across Panel instances
 *
 * @class ControlsBase
 * @memberof moonstone/Panels
 * @ui
 * @private
 */
var ControlsBase = (0, _kind["default"])({
  name: 'Controls',
  propTypes:
  /** @lends moonstone/Panels.ControlsBase.prototype */
  {
    /**
     * Additional controls displayed before the close button.
     *
     * @type {Node}
     * @public
     */
    children: _propTypes["default"].node,

    /**
     * Sets the hint string read when focusing the application close button.
     *
     * @type {String}
     * @public
     */
    closeButtonAriaLabel: _propTypes["default"].string,

    /**
     * The background opacity of the application close button.
     *
     * * Values: `'translucent'`, `'lightTranslucent'`, `'transparent'`
     *
     * @type {String}
     * @public
     */
    closeButtonBackgroundOpacity: _propTypes["default"].oneOf(['translucent', 'lightTranslucent', 'transparent']),

    /**
     * Called with a reference to the root DOM node of this component.
     *
     * @type {Function|Object}
     * @public
     */
    forwardRef: _propTypes["default"].oneOfType([_propTypes["default"].func, _propTypes["default"].shape({
      current: _propTypes["default"].any
    })]),

    /**
     * Indicates the close button will not be rendered on the top right corner.
     *
     * @type {Boolean}
     * @public
     */
    noCloseButton: _propTypes["default"].bool,

    /**
     * Called when the app close button is clicked.
     *
     * @type {Function}
     * @public
     */
    onApplicationClose: _propTypes["default"].func
  },
  styles: {
    css: _PanelsModule["default"],
    className: 'controls'
  },
  render: function render(_ref) {
    var children = _ref.children,
        closeButtonAriaLabel = _ref.closeButtonAriaLabel,
        closeButtonBackgroundOpacity = _ref.closeButtonBackgroundOpacity,
        forwardRef = _ref.forwardRef,
        noCloseButton = _ref.noCloseButton,
        onApplicationClose = _ref.onApplicationClose,
        rest = _objectWithoutProperties(_ref, ["children", "closeButtonAriaLabel", "closeButtonBackgroundOpacity", "forwardRef", "noCloseButton", "onApplicationClose"]);

    if (!children && noCloseButton) return null;
    return _react["default"].createElement("div", Object.assign({}, rest, {
      ref: forwardRef
    }), children, noCloseButton ? null : _react["default"].createElement(_ApplicationCloseButton["default"], {
      "aria-label": closeButtonAriaLabel,
      backgroundOpacity: closeButtonBackgroundOpacity,
      className: _PanelsModule["default"].close,
      onApplicationClose: onApplicationClose
    }));
  }
});
/**
 * Group of controls shared across Panel instances.
 *
 * ```
 * // remove the close button and use a star icon button
 * <Controls noCloseButton>
 *   <IconButton>star</IconButton>
 * </Controls>
 * ```
 *
 * @class Controls
 * @mixes spotlight/SpotlightContainerDecorator
 * @memberof moonstone/Panels
 * @ui
 * @private
 */

exports.ControlsBase = ControlsBase;
var Controls = (0, _ForwardRef["default"])((0, _SpotlightContainerDecorator["default"])(ControlsBase));
exports.Controls = Controls;
var _default = Controls;
exports["default"] = _default;