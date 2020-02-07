"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
Object.defineProperty(exports, "ProgressBarTooltip", {
  enumerable: true,
  get: function get() {
    return _ProgressBarTooltip.ProgressBarTooltip;
  }
});
exports.ProgressBarDecorator = exports.ProgressBarBase = exports.ProgressBar = exports["default"] = void 0;

var _kind = _interopRequireDefault(require("@enact/core/kind"));

var _ComponentOverride = _interopRequireDefault(require("@enact/ui/ComponentOverride"));

var _ProgressBar = _interopRequireDefault(require("@enact/ui/ProgressBar"));

var _Pure = _interopRequireDefault(require("@enact/ui/internal/Pure"));

var _Slottable = _interopRequireDefault(require("@enact/ui/Slottable"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _compose = _interopRequireDefault(require("ramda/src/compose"));

var _react = _interopRequireDefault(require("react"));

var _Skinnable = _interopRequireDefault(require("../Skinnable"));

var _ProgressBarTooltip = require("./ProgressBarTooltip");

var _ProgressBarModule = _interopRequireDefault(require("./ProgressBar.module.css"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _objectWithoutProperties(source, excluded) { if (source == null) return {}; var target = _objectWithoutPropertiesLoose(source, excluded); var key, i; if (Object.getOwnPropertySymbols) { var sourceSymbolKeys = Object.getOwnPropertySymbols(source); for (i = 0; i < sourceSymbolKeys.length; i++) { key = sourceSymbolKeys[i]; if (excluded.indexOf(key) >= 0) continue; if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue; target[key] = source[key]; } } return target; }

function _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }

/**
 * Renders a moonstone-styled progress bar.
 *
 * @class ProgressBarBase
 * @memberof moonstone/ProgressBar
 * @ui
 * @public
 */
var ProgressBarBase = (0, _kind["default"])({
  name: 'ProgressBar',
  propTypes:
  /** @lends moonstone/ProgressBar.ProgressBarBase.prototype */
  {
    /**
     * Customizes the component by mapping the supplied collection of CSS class names to the
     * corresponding internal Elements and states of this component.
     *
     * The following classes are supported:
     *
     * * `progressBar` - The root component class
     *
     * @type {Object}
     * @public
     */
    css: _propTypes["default"].object,

    /**
     * Highlights the filled portion.
     *
     * @type {Boolean}
     * @public
     */
    highlighted: _propTypes["default"].bool,

    /**
     * Sets the orientation of the slider.
     *
     * * Values: `'horizontal'`, `'vertical'`
     *
     * @type {String}
     * @default 'horizontal'
     * @public
     */
    orientation: _propTypes["default"].oneOf(['horizontal', 'vertical']),

    /**
     * A number between `0` and `1` indicating the proportion of the filled portion of the bar.
     *
     * @type {Number}
     * @default 0
     * @public
     */
    progress: _propTypes["default"].number,

    /**
     * Enables the built-in tooltip.
     *
     * To customize the tooltip, pass either a custom tooltip component or an instance of
     * [ProgressBarTooltip]{@link moonstone/ProgressBar.ProgressBarTooltip} with additional
     * props configured.
     *
     * The provided component will receive the following props from `ProgressBar`:
     *
     * * `orientation`  - The value of `orientation`
     * * `percent`      - Always `true` indicating the value should be presented as a percentage
     *                    rather than an absolute value
     * * `progress`     - The `value` as a proportion between `min` and `max`
     * * `visible`      - Always `true` indicating that the tooltip should be visible
     *
     * Usage:
     * ```
     * <ProgressBar
     *   tooltip={
     *     <ProgressBarTooltip side="after" />
     *   }
     * />
     * ```
     *
     * The tooltip may also be passed as a child via the `"tooltip"` slot. See
     * [Slottable]{@link ui/Slottable} for more information on how slots can be used.
     *
     * Usage:
     * ```
     * <ProgressBar>
     *   <ProgressBarTooltip side="after" />
     * </ProgressBar>
     * ```
     *
     * @type {Boolean|Component|Element}
     * @public
     */
    tooltip: _propTypes["default"].oneOfType([_propTypes["default"].bool, _propTypes["default"].element, _propTypes["default"].func])
  },
  defaultProps: {
    orientation: 'horizontal',
    progress: 0
  },
  styles: {
    css: _ProgressBarModule["default"],
    publicClassNames: ['progressBar']
  },
  computed: {
    className: function className(_ref) {
      var highlighted = _ref.highlighted,
          styler = _ref.styler;
      return styler.append({
        highlighted: highlighted
      });
    },
    tooltip: function tooltip(_ref2) {
      var _tooltip = _ref2.tooltip;
      return _tooltip === true ? _ProgressBarTooltip.ProgressBarTooltip : _tooltip;
    }
  },
  render: function render(_ref3) {
    var css = _ref3.css,
        orientation = _ref3.orientation,
        progress = _ref3.progress,
        tooltip = _ref3.tooltip,
        rest = _objectWithoutProperties(_ref3, ["css", "orientation", "progress", "tooltip"]);

    delete rest.tooltip;
    delete rest.highlighted;
    return _react["default"].createElement(_ProgressBar["default"], Object.assign({}, rest, {
      orientation: orientation,
      progress: progress,
      css: css
    }), _react["default"].createElement(_ComponentOverride["default"], {
      component: tooltip,
      orientation: orientation,
      percent: true,
      proportion: progress,
      visible: true
    }));
  }
});
/**
 * Moonstone-specific behaviors to apply to [ProgressBar]{@link moonstone/ProgressBar.ProgressBarBase}.
 *
 * @hoc
 * @memberof moonstone/ProgressBar
 * @mixes moonstone/Skinnable.Skinnable
 * @public
 */

exports.ProgressBarBase = ProgressBarBase;
var ProgressBarDecorator = (0, _compose["default"])(_Pure["default"], (0, _Slottable["default"])({
  slots: ['tooltip']
}), _Skinnable["default"]);
/**
 * The ready-to-use Moonstone-styled ProgressBar.
 *
 * @class ProgressBar
 * @memberof moonstone/ProgressBar
 * @extends moonstone/ProgressBar.ProgressBarBase
 * @mixes moonstone/ProgressBar.ProgressBarDecorator
 * @ui
 * @public
 */

exports.ProgressBarDecorator = ProgressBarDecorator;
var ProgressBar = ProgressBarDecorator(ProgressBarBase);
exports.ProgressBar = ProgressBar;
var _default = ProgressBar;
exports["default"] = _default;