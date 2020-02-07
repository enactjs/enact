"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
Object.defineProperty(exports, "Tooltip", {
  enumerable: true,
  get: function get() {
    return _Tooltip.Tooltip;
  }
});
Object.defineProperty(exports, "TooltipBase", {
  enumerable: true,
  get: function get() {
    return _Tooltip.TooltipBase;
  }
});
exports.TooltipDecorator = exports["default"] = void 0;

var _hoc = _interopRequireDefault(require("@enact/core/hoc"));

var _I18nDecorator = require("@enact/i18n/I18nDecorator");

var _FloatingLayer = require("@enact/ui/FloatingLayer");

var _handle = require("@enact/core/handle");

var _util = require("@enact/core/util");

var _react = _interopRequireDefault(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _resolution = _interopRequireDefault(require("@enact/ui/resolution"));

var _Tooltip = require("./Tooltip");

var _util2 = require("./util");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance"); }

function _iterableToArrayLimit(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

var currentTooltip; // needed to know whether or not we should stop a showing job when unmounting

/**
 * Default config for [TooltipDecorator]{@link moonstone/TooltipDecorator.TooltipDecorator}
 *
 * @memberof moonstone/TooltipDecorator.TooltipDecorator
 * @hocconfig
 */

var defaultConfig = {
  /**
   * The boundary around the screen which the tooltip should never cross, typically involving
   * flipping to an alternate orientation or adjusting its offset to remain on screen.
   * The default of 24 is derived from a standard 12px screen-keepout size plus the standard
   * Spotlight-outset (12px) margin/padding value which keeps elements and text aligned inside a
   * [Panel]{@link moonstone/Panels.Panel}. Note: This value will be scaled according to the
   * resolution.
   *
   * @type {Number}
   * @default 24
   * @memberof moonstone/TooltipDecorator.TooltipDecorator.defaultConfig
   */
  screenEdgeKeepout: 12 + 12,

  /**
   * The name of the property which will receive the tooltip node.
   *
   * By default, `TooltipDecorator` will add a new child to the wrapped component, following any
   * other children passed in. If a component needs to, it can specify another property to receive
   * the tooltip and the `children` property will not be modified.
   *
   * @type {String}
   * @default 'children'
   * @memberof moonstone/TooltipDecorator.TooltipDecorator.defaultConfig
   */
  tooltipDestinationProp: 'children'
};
/**
 * A higher-order component which positions [Tooltip]{@link moonstone/TooltipDecorator.Tooltip} in
 * relation to the wrapped component.
 *
 * The tooltip is automatically displayed when the decoratorated component is focused after a set
 * period of time.
 *
 * The tooltip is positioned around the decorator where there is available window space.
 *
 * Note that the direction of tooltip will be flipped horizontally in RTL locales.
 *
 * @class TooltipDecorator
 * @memberof moonstone/TooltipDecorator
 * @hoc
 * @public
 */

var TooltipDecorator = (0, _hoc["default"])(defaultConfig, function (config, Wrapped) {
  var _class, _temp;

  var tooltipDestinationProp = config.tooltipDestinationProp;
  var Decorator = (_temp = _class =
  /*#__PURE__*/
  function (_React$Component) {
    _inherits(Decorator, _React$Component);

    function Decorator(props) {
      var _this;

      _classCallCheck(this, Decorator);

      _this = _possibleConstructorReturn(this, _getPrototypeOf(Decorator).call(this, props));
      _this.showTooltipJob = new _util.Job(function () {
        if (!_this.state.showing) {
          _this.setState({
            showing: true
          });
        }
      });
      _this.setTooltipLayoutJob = new _util.Job(function () {
        _this.setTooltipLayout();
      });

      _this.startTooltipLayoutJob = function () {
        _this.setTooltipLayoutJob.startAfter(_this.props.tooltipUpdateDelay);
      };

      _this.showTooltip = function (client) {
        var _this$props = _this.props,
            tooltipDelay = _this$props.tooltipDelay,
            tooltipText = _this$props.tooltipText;

        if (tooltipText) {
          _this.clientRef = client;
          currentTooltip = _assertThisInitialized(_this);

          _this.showTooltipJob.startAfter(tooltipDelay);

          if (_this.mutationObserver) {
            _this.mutationObserver.observe(_this.clientRef, {
              attributes: true,
              childList: true
            });
          }

          if (_this.resizeObserver) {
            _this.resizeObserver.observe(_this.clientRef);
          }
        }
      };

      _this.hideTooltip = function () {
        if (_this.props.tooltipText) {
          if (_this.mutationObserver) {
            _this.mutationObserver.disconnect();
          }

          if (_this.resizeObserver) {
            _this.resizeObserver.disconnect();
          }

          _this.clientRef = null;
          currentTooltip = null;

          _this.showTooltipJob.stop();

          _this.setTooltipLayoutJob.stop();

          if (_this.state.showing) {
            _this.setState({
              showing: false
            });
          }
        }
      };

      _this.handle = _handle.handle.bind(_assertThisInitialized(_this));
      _this.handleKeyDown = _this.handle((0, _handle.forward)('onKeyDown'), (0, _handle.forProp)('disabled', false), function () {
        _this.startTooltipLayoutJob();
      });
      _this.handleMouseOver = _this.handle((0, _handle.forward)('onMouseOver'), (0, _handle.forProp)('disabled', true), function (ev) {
        _this.showTooltip(ev.target);
      });
      _this.handleMouseOut = _this.handle((0, _handle.forward)('onMouseOut'), (0, _handle.forProp)('disabled', true), function () {
        _this.hideTooltip();
      });
      _this.handleFocus = _this.handle((0, _handle.forward)('onFocus'), function (_ref) {
        var target = _ref.target;
        return _this.showTooltip(target);
      });
      _this.handleBlur = _this.handle((0, _handle.forward)('onBlur'), _this.hideTooltip);

      _this.getTooltipRef = function (node) {
        _this.tooltipRef = node;

        if (node) {
          _this.setTooltipLayout();
        }
      };

      _this.state = {
        showing: false,
        tooltipDirection: null,
        arrowAnchor: null,
        position: {
          top: 0,
          left: 0
        }
      };
      return _this;
    }

    _createClass(Decorator, [{
      key: "componentDidMount",
      value: function componentDidMount() {
        if (window.MutationObserver) {
          this.mutationObserver = new MutationObserver(this.startTooltipLayoutJob);
        }

        if (window.ResizeObserver) {
          this.resizeObserver = new ResizeObserver(this.startTooltipLayoutJob);
        }
      }
    }, {
      key: "componentDidUpdate",
      value: function componentDidUpdate(prevProps, prevState) {
        if (this.state.showing && (prevProps.tooltipText !== this.props.tooltipText || prevProps.tooltipPosition !== this.props.tooltipPosition || prevState.showing !== this.state.showing)) {
          this.setTooltipLayout();
        }
      }
    }, {
      key: "componentWillUnmount",
      value: function componentWillUnmount() {
        if (currentTooltip === this) {
          currentTooltip = null;

          if (this.mutationObserver) {
            this.mutationObserver.disconnect();
          }

          if (this.resizeObserver) {
            this.resizeObserver.disconnect();
          }

          this.showTooltipJob.stop();
          this.setTooltipLayoutJob.stop();
        }
      }
    }, {
      key: "setTooltipLayout",
      value: function setTooltipLayout() {
        if (!this.tooltipRef || !this.clientRef) return;

        var screenEdgeKeepout = _resolution["default"].scale(config.screenEdgeKeepout);

        var position = this.props.tooltipPosition;
        var arr = position.split(' ');
        var tooltipDirection = null;
        var arrowAnchor = null;

        if (arr.length === 2) {
          var _arr2 = _slicedToArray(arr, 2);

          tooltipDirection = _arr2[0];
          arrowAnchor = _arr2[1];
        } else if (position === 'above' || position === 'below') {
          tooltipDirection = position;
          arrowAnchor = 'right';
        } else {
          tooltipDirection = 'above';
          arrowAnchor = 'right';
        }

        var tooltipNode = this.tooltipRef.getBoundingClientRect(); // label bound

        var clientNode = this.clientRef.getBoundingClientRect(); // client bound

        var overflow = (0, _util2.calcOverflow)(tooltipNode, clientNode, tooltipDirection, screenEdgeKeepout);
        tooltipDirection = (0, _util2.adjustDirection)(tooltipDirection, overflow, this.props.rtl);
        arrowAnchor = (0, _util2.adjustAnchor)(arrowAnchor, tooltipDirection, overflow, this.props.rtl);
        var tooltipPosition = (0, _util2.getPosition)(clientNode, tooltipDirection);
        var labelOffset = arrowAnchor === 'center' ? (0, _util2.getLabelOffset)(tooltipNode, tooltipDirection, tooltipPosition, overflow) : null;
        var _this$state$position = this.state.position,
            top = _this$state$position.top,
            left = _this$state$position.left;

        if (tooltipPosition.top !== top || tooltipPosition.left !== left || labelOffset !== this.state.labelOffset || arrowAnchor !== this.state.arrowAnchor) {
          this.setState({
            tooltipDirection: tooltipDirection,
            arrowAnchor: arrowAnchor,
            labelOffset: labelOffset,
            position: tooltipPosition
          });
        }
      }
    }, {
      key: "renderTooltip",

      /**
       * Conditionally creates the FloatingLayer and Tooltip based on the presence of
       * `tooltipText` and returns a property bag to pass onto the Wrapped component
       *
       * @returns {Object} Prop object
       * @private
       */
      value: function renderTooltip() {
        var _this$props2 = this.props,
            children = _this$props2.children,
            tooltipRelative = _this$props2.tooltipRelative,
            tooltipProps = _this$props2.tooltipProps,
            tooltipText = _this$props2.tooltipText,
            tooltipWidth = _this$props2.tooltipWidth;

        if (tooltipText) {
          var renderedTooltip = _react["default"].createElement(_Tooltip.Tooltip, Object.assign({
            "aria-live": "off",
            role: "alert",
            labelOffset: this.state.labelOffset
          }, tooltipProps, {
            arrowAnchor: this.state.arrowAnchor,
            direction: this.state.tooltipDirection,
            position: tooltipRelative ? null : this.state.position,
            relative: tooltipRelative,
            style: {
              display: tooltipRelative && !this.state.showing ? 'none' : null
            },
            tooltipRef: this.getTooltipRef,
            width: tooltipWidth
          }), tooltipText);

          if (!tooltipRelative) {
            renderedTooltip = _react["default"].createElement(_FloatingLayer.FloatingLayerBase, {
              open: this.state.showing,
              noAutoDismiss: true,
              onDismiss: this.hideTooltip,
              scrimType: "none",
              key: "tooltipFloatingLayer"
            }, renderedTooltip);
          }

          if (tooltipDestinationProp === 'children') {
            return {
              children: [children, renderedTooltip]
            };
          } else {
            return _defineProperty({}, tooltipDestinationProp, renderedTooltip);
          }
        }

        return {
          children: children
        };
      }
    }, {
      key: "render",
      value: function render() {
        // minor optimization to merge all the props together once since we also have to delete
        // invalid props before passing downstream
        var props = Object.assign({}, this.props, this.renderTooltip(), {
          onBlur: this.handleBlur,
          onFocus: this.handleFocus,
          onMouseOut: this.handleMouseOut,
          onMouseOver: this.handleMouseOver,
          onKeyDown: this.handleKeyDown
        });
        delete props.rtl;
        delete props.tooltipDelay;
        delete props.tooltipPosition;
        delete props.tooltipProps;
        delete props.tooltipRelative;
        delete props.tooltipText;
        delete props.tooltipUpdateDelay;
        delete props.tooltipWidth;
        return _react["default"].createElement(Wrapped, props);
      }
    }]);

    return Decorator;
  }(_react["default"].Component), _class.displayName = 'TooltipDecorator', _class.propTypes =
  /** @lends moonstone/TooltipDecorator.TooltipDecorator.prototype */
  {
    /**
     * Disables the component but does not affect tooltip operation.
     *
     * @type {Boolean}
     * @default false
     * @public
     */
    disabled: _propTypes["default"].bool,

    /**
     * Indicates the tooltip text direction is right-to-left.
     *
     * @type {Boolean}
     * @private
     */
    rtl: _propTypes["default"].bool,

    /**
     * Time to wait (in milliseconds) before showing tooltip on hover.
     *
     * @type {Number}
     * @default 500
     * @public
     */
    tooltipDelay: _propTypes["default"].number,

    /**
     * Position of the tooltip with respect to the wrapped component.
     *
     * | *Value* | *Tooltip Direction* |
     * |---|---|
     * | `'above'` | Above component, flowing to the right |
     * | `'above center'` | Above component, centered |
     * | `'above left'` | Above component, flowing to the left |
     * | `'above right'` | Above component, flowing to the right |
     * | `'below'` | Below component, flowing to the right |
     * | `'below center'` | Below component, centered |
     * | `'below left'` | Below component, flowing to the left |
     * | `'below right'` | Below component, flowing to the right |
     * | `'left bottom'` | Left of the component, contents at the bottom |
     * | `'left middle'` | Left of the component, contents middle aligned |
     * | `'left top'` | Left of the component, contents at the top |
     * | `'right bottom'` | Right of the component, contents at the bottom |
     * | `'right middle'` | Right of the component, contents middle aligned |
     * | `'right top'` | Right of the component, contents at the top |
     *
     * `TooltipDectorator` attempts to choose the best direction to meet layout and language
     * requirements. Left and right directions will reverse for RTL languages. Additionally,
     * the tooltip will reverse direction if it will prevent overflowing off the viewport
     *
     * @type {('above'|'above center'|'above left'|'above right'|'below'|
     *  'below center'|'below left'|'below right'|'left bottom'|'left middle'|'left top'|
     * 	'right bottom'|'right middle'|'right top')}
     * @default 'above'
     * @public
     */
    tooltipPosition: _propTypes["default"].oneOf(['above', 'above center', 'above left', 'above right', 'below', 'below center', 'below left', 'below right', 'left bottom', 'left middle', 'left top', 'right bottom', 'right middle', 'right top']),

    /**
     * Properties to be passed to tooltip component.
     *
     * @type {Object}
     * @public
     */
    tooltipProps: _propTypes["default"].object,

    /**
     * Positions the tooltip relative to its container.
     *
     * Determines whether your tooltip should position itself relative to its container or
     * relative to the screen (absolute positioning on the floating layer). When setting to
     * `true`, to enable relative positioning, it may be important to specify the
     * `tooltipDestinationProp` key in this HoC's config object. A relatively positioned
     * Tooltip for a `Button`, for example, must be placed in the `decoration` prop.
     *
     * It may be necessary to assign the CSS rule `position` to the containing element so
     * relatively positioned Tooltip has a frame to "stick to" the edge of.
     *
     * Anchoring points can be visualized as follows:
     * ```
     * ┌───◎───┐
     * ◎       ◎
     * └───◎───┘
     * ```
     *
     * @type {Boolean}
     * @public
     */
    tooltipRelative: _propTypes["default"].bool,

    /**
     * Tooltip content.
     *
     * @type {Node}
     * @public
     */
    tooltipText: _propTypes["default"].oneOfType([_propTypes["default"].string, _propTypes["default"].node]),

    /**
     * The interval (in milliseconds) to recheck the math for a currently showing tooltip's
     * positioning and orientation. Useful if your anchor element moves.
     *
     * @type {Number}
     * @default 400
     * @public
     */
    tooltipUpdateDelay: _propTypes["default"].number,

    /**
     * The width of tooltip content in pixels (px).
     *
     * If the content goes over the given width, it will automatically wrap. When `null`,
     * content does not wrap.
     *
     * @type {Number|null}
     * @public
     */
    tooltipWidth: _propTypes["default"].number
  }, _class.defaultProps = {
    disabled: false,
    tooltipDelay: 500,
    tooltipPosition: 'above',
    tooltipUpdateDelay: 400
  }, _temp);
  return (0, _I18nDecorator.I18nContextDecorator)({
    rtlProp: 'rtl'
  }, Decorator);
});
exports.TooltipDecorator = TooltipDecorator;
var _default = TooltipDecorator;
exports["default"] = _default;