"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.TooltipBase = exports.Tooltip = exports["default"] = void 0;

var _kind = _interopRequireDefault(require("@enact/core/kind"));

var _react = _interopRequireDefault(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _Skinnable = _interopRequireDefault(require("../Skinnable"));

var _TooltipLabel = _interopRequireDefault(require("./TooltipLabel"));

var _TooltipModule = _interopRequireDefault(require("./Tooltip.module.css"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _objectWithoutProperties(source, excluded) { if (source == null) return {}; var target = _objectWithoutPropertiesLoose(source, excluded); var key, i; if (Object.getOwnPropertySymbols) { var sourceSymbolKeys = Object.getOwnPropertySymbols(source); for (i = 0; i < sourceSymbolKeys.length; i++) { key = sourceSymbolKeys[i]; if (excluded.indexOf(key) >= 0) continue; if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue; target[key] = source[key]; } } return target; }

function _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { _defineProperty(target, key, source[key]); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

/**
 * A stateless tooltip component with Moonstone styling applied.
 *
 * @class TooltipBase
 * @memberof moonstone/TooltipDecorator
 * @ui
 * @public
 */
var TooltipBase = (0, _kind["default"])({
  name: 'Tooltip',
  propTypes:
  /** @lends moonstone/TooltipDecorator.TooltipBase.prototype */
  {
    /**
     * The node to be displayed as the main content of the tooltip.
     *
     * @type {Node}
     * @required
     */
    children: _propTypes["default"].node.isRequired,

    /**
     * Position of tooltip arrow in relation to the activator.
     *
     * Note that `'left'`, `'center'`, `'right'` are applicable when direction is in vertical
     * orientation (i.e. `'above'`, `'below'`), and `'top'`, `'middle'`, and `'bottom'` are
     * applicable when direction is in horizontal orientation (i.e. `'left'`, `'right'`)
     *
     * @type {('left'|'center'|'right'|'top'|'middle'|'bottom')}
     * @default 'right'
     * @public
     */
    arrowAnchor: _propTypes["default"].oneOf(['left', 'center', 'right', 'top', 'middle', 'bottom']),

    /**
     * Direction of label in relation to the activator.
     *
     * @type {('above'|'below'|'left'|'right')}
     * @default 'above'
     * @public
     */
    direction: _propTypes["default"].oneOf(['above', 'below', 'left', 'right']),

    /**
     * A value representing the amount to offset the label portion of the tooltip.
     *
     * In a "center" aligned tooltip, the label may be desirable to offset to one side or the
     * other. This prop accepts a value betwen -0.5 and 0.5 (representing 50% to the left or
     * right). This defaults to 0 offset (centered). It also automatically caps the value so it
     * never positions the tooltip label past the anchored arrow. If the tooltip label or arrow
     * has non-rectangular geometry (rounded corners, a wide tail, etc), you'll need to manually
     * account for that in your provided offset value.
     *
     * @type {Number}
     * @default 0
     * @public
     */
    labelOffset: _propTypes["default"].number,

    /**
     * Style object for tooltip position.
     *
     * @type {Object}
     * @public
     */
    position: _propTypes["default"].shape({
      bottom: _propTypes["default"].number,
      left: _propTypes["default"].number,
      right: _propTypes["default"].number,
      top: _propTypes["default"].number
    }),

    /**
     * Anchors the tooltip relative to its container.
     *
     * Reconfigures the component to anchor itself to the designated edge of its container.
     * When this is not specified, the implication is that the component is "absolutely"
     * positioned, relative to the viewport, rather than its parent layer.
     *
     * @type {Boolean}
     * @public
     */
    relative: _propTypes["default"].bool,

    /**
     * Called when the tooltip mounts/unmounts, giving a reference to the DOM.
     *
     * @type {Function}
     * @public
     */
    tooltipRef: _propTypes["default"].func,

    /**
     * The width of tooltip content in pixels (px).
     *
     * If the content goes over the given width, then it will automatically wrap. When `null`,
     * content does not wrap.
     *
     * @type {Number|null}
     * @public
     */
    width: _propTypes["default"].number
  },
  defaultProps: {
    arrowAnchor: 'right',
    direction: 'above',
    labelOffset: 0
  },
  styles: {
    css: _TooltipModule["default"],
    className: 'tooltip'
  },
  computed: {
    labelOffset: function labelOffset(_ref) {
      var _labelOffset = _ref.labelOffset;

      if (_labelOffset) {
        var cappedPosition = Math.max(-0.5, Math.min(0.5, _labelOffset));
        return {
          transform: "translateX(".concat(cappedPosition * 100, "%)")
        };
      }
    },
    className: function className(_ref2) {
      var direction = _ref2.direction,
          arrowAnchor = _ref2.arrowAnchor,
          relative = _ref2.relative,
          styler = _ref2.styler;
      return styler.append(direction, "".concat(arrowAnchor, "Arrow"), {
        relative: relative,
        absolute: !relative
      });
    },
    style: function style(_ref3) {
      var position = _ref3.position,
          _style = _ref3.style;
      return _objectSpread({}, _style, position);
    }
  },
  render: function render(_ref4) {
    var children = _ref4.children,
        tooltipRef = _ref4.tooltipRef,
        width = _ref4.width,
        labelOffset = _ref4.labelOffset,
        rest = _objectWithoutProperties(_ref4, ["children", "tooltipRef", "width", "labelOffset"]);

    delete rest.arrowAnchor;
    delete rest.labelOffset;
    delete rest.direction;
    delete rest.position;
    delete rest.relative;
    return _react["default"].createElement("div", rest, _react["default"].createElement("div", {
      className: _TooltipModule["default"].tooltipAnchor,
      ref: tooltipRef
    }, _react["default"].createElement("div", {
      className: _TooltipModule["default"].tooltipArrow
    }), _react["default"].createElement(_TooltipLabel["default"], {
      width: width,
      style: labelOffset
    }, children)));
  }
});
/**
 * A tooltip component with Moonstone styling applied.
 *
 * @class Tooltip
 * @memberof moonstone/TooltipDecorator
 * @ui
 * @public
 */

exports.TooltipBase = TooltipBase;
var Tooltip = (0, _Skinnable["default"])(TooltipBase);
exports.Tooltip = Tooltip;
var _default = Tooltip;
exports["default"] = _default;