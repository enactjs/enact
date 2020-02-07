"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.PopupBase = exports.Popup = exports["default"] = void 0;

var _keymap = require("@enact/core/keymap");

var _dispatcher = require("@enact/core/dispatcher");

var _Layout = require("@enact/ui/Layout");

var _FloatingLayer = _interopRequireDefault(require("@enact/ui/FloatingLayer"));

var _kind = _interopRequireDefault(require("@enact/core/kind"));

var _react = _interopRequireDefault(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _spotlight = _interopRequireWildcard(require("@enact/spotlight"));

var _Pause = _interopRequireDefault(require("@enact/spotlight/Pause"));

var _SpotlightContainerDecorator = _interopRequireDefault(require("@enact/spotlight/SpotlightContainerDecorator"));

var _Transition = _interopRequireDefault(require("@enact/ui/Transition"));

var _handle = require("@enact/core/handle");

var _warning = _interopRequireDefault(require("warning"));

var _$L = _interopRequireDefault(require("../internal/$L"));

var _IconButton = _interopRequireDefault(require("../IconButton"));

var _Skinnable = _interopRequireDefault(require("../Skinnable"));

var _PopupModule = _interopRequireDefault(require("./Popup.module.css"));

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj["default"] = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _objectWithoutProperties(source, excluded) { if (source == null) return {}; var target = _objectWithoutPropertiesLoose(source, excluded); var key, i; if (Object.getOwnPropertySymbols) { var sourceSymbolKeys = Object.getOwnPropertySymbols(source); for (i = 0; i < sourceSymbolKeys.length; i++) { key = sourceSymbolKeys[i]; if (excluded.indexOf(key) >= 0) continue; if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue; target[key] = source[key]; } } return target; }

function _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }

var isUp = (0, _keymap.is)('up');
var TransitionContainer = (0, _SpotlightContainerDecorator["default"])({
  enterTo: 'default-element',
  preserveId: true
}, _Transition["default"]);

var getContainerNode = function getContainerNode(containerId) {
  return document.querySelector("[data-spotlight-id='".concat(containerId, "']"));
};

var forwardHide = (0, _handle.forward)('onHide');
var forwardShow = (0, _handle.forward)('onShow');
/**
 * The base popup component.
 *
 * @class PopupBase
 * @memberof moonstone/Popup
 * @ui
 * @public
 */

var PopupBase = (0, _kind["default"])({
  name: 'PopupBase',
  propTypes:
  /** @lends moonstone/Popup.PopupBase.prototype */
  {
    /**
     * The contents to be displayed in the body of the popup.
     *
     * @type {Node}
     * @required
     * @public
     */
    children: _propTypes["default"].node.isRequired,

    /**
     * Sets the hint string read when focusing the popup close button.
     *
     * @type {String}
     * @default 'Close'
     * @public
     */
    closeButtonAriaLabel: _propTypes["default"].string,

    /**
     * Customizes the component by mapping the supplied collection of CSS class names to the
     * corresponding internal Elements and states of this component.
     *
     * The following classes are supported:
     *
     * * `popup` - The root class name
     * * `body` - Applied to the body content container
     * * `closeContainer` - Applied to the close button's container
     * * `reserveClose` - Applied when the close button is shown and space must be allocated for it
     *
     * @type {Object}
     * @private
     */
    css: _propTypes["default"].object,

    /**
     * Disables transition animation.
     *
     * @type {Boolean}
     * @default false
     * @public
     */
    noAnimation: _propTypes["default"].bool,

    /**
     * Called when the close button is clicked.
     *
     * @type {Function}
     * @public
     */
    onCloseButtonClick: _propTypes["default"].func,

    /**
     * Called after the popup's "hide" transition finishes.
     *
     * @type {Function}
     * @public
     */
    onHide: _propTypes["default"].func,

    /**
     * Called after the popup's "show" transition finishes.
     *
     * @type {Function}
     * @public
     */
    onShow: _propTypes["default"].func,

    /**
     * Controls the visibility of the Popup.
     *
     * By default, the Popup and its contents are not rendered until `open`.
     *
     * @type {Boolean}
     * @default false
     * @public
     */
    open: _propTypes["default"].bool,

    /**
     * Shows the close button.
     *
     * @type {Boolean}
     * @default false
     * @public
     */
    showCloseButton: _propTypes["default"].bool,

    /**
     * Tells the body element to shrink to the size of the content.
     *
     * Popup is composed of a [Layout]{@link ui/Layout.Layout} and [Cells]{@link ui/Layout.Cell}.
     * This informs the body cell to use the [shrink]{@link ui/Layout.Cell#shrink} property so
     * it will match the dimensions of its contents rather than expand to the width of the
     * Popup's assigned dimensions.
     *
     * @type {Boolean}
     * @default false
     * @private
     */
    shrinkBody: _propTypes["default"].bool,

    /**
     * The container id for {@link spotlight/Spotlight}.
     *
     * @type {String}
     * @default null
     * @public
     */
    spotlightId: _propTypes["default"].string,

    /**
     * Restricts or prioritizes navigation when focus attempts to leave the popup.
     *
     * It can be either `'none'`, `'self-first'`, or `'self-only'`.
     *
     * Note: The ready-to-use [Popup]{@link moonstone/Popup.Popup} component only supports
     * `'self-first'` and `'self-only'`.
     *
     * @type {String}
     * @default 'self-only'
     * @public
     */
    spotlightRestrict: _propTypes["default"].oneOf(['none', 'self-first', 'self-only'])
  },
  defaultProps: {
    noAnimation: false,
    open: false,
    showCloseButton: false,
    shrinkBody: false,
    spotlightRestrict: 'self-only'
  },
  styles: {
    css: _PopupModule["default"],
    className: 'popup',
    publicClassNames: ['popup', 'body', 'closeContainer', 'reserveClose']
  },
  computed: {
    className: function className(_ref) {
      var showCloseButton = _ref.showCloseButton,
          styler = _ref.styler;
      return styler.append({
        reserveClose: showCloseButton
      });
    },
    closeButton: function closeButton(_ref2) {
      var closeButtonAriaLabel = _ref2.closeButtonAriaLabel,
          css = _ref2.css,
          onCloseButtonClick = _ref2.onCloseButtonClick,
          showCloseButton = _ref2.showCloseButton;

      if (showCloseButton) {
        var ariaLabel = closeButtonAriaLabel == null ? (0, _$L["default"])('Close') : closeButtonAriaLabel;
        return _react["default"].createElement(_Layout.Cell, {
          shrink: true,
          className: css.closeContainer
        }, _react["default"].createElement(_IconButton["default"], {
          className: css.closeButton,
          backgroundOpacity: "transparent",
          size: "small",
          onTap: onCloseButtonClick,
          "aria-label": ariaLabel
        }, "closex"));
      }
    }
  },
  render: function render(_ref3) {
    var children = _ref3.children,
        closeButton = _ref3.closeButton,
        css = _ref3.css,
        noAnimation = _ref3.noAnimation,
        onHide = _ref3.onHide,
        onShow = _ref3.onShow,
        open = _ref3.open,
        shrinkBody = _ref3.shrinkBody,
        spotlightId = _ref3.spotlightId,
        spotlightRestrict = _ref3.spotlightRestrict,
        rest = _objectWithoutProperties(_ref3, ["children", "closeButton", "css", "noAnimation", "onHide", "onShow", "open", "shrinkBody", "spotlightId", "spotlightRestrict"]);

    delete rest.closeButtonAriaLabel;
    delete rest.onCloseButtonClick;
    delete rest.showCloseButton;
    return _react["default"].createElement(TransitionContainer, {
      className: css.popupTransitionContainer,
      direction: "down",
      duration: "short",
      noAnimation: noAnimation,
      onHide: onHide,
      onShow: onShow,
      spotlightDisabled: !open,
      spotlightId: spotlightId,
      spotlightRestrict: spotlightRestrict,
      type: "slide",
      visible: open
    }, _react["default"].createElement(_Layout.Row, Object.assign({
      "aria-live": "off",
      role: "alert"
    }, rest), _react["default"].createElement(_Layout.Cell, {
      className: css.body,
      shrink: shrinkBody
    }, children), closeButton));
  }
});
exports.PopupBase = PopupBase;
var SkinnedPopupBase = (0, _Skinnable["default"])({
  defaultSkin: 'light'
}, PopupBase); // Deprecate using scrimType 'none' with spotlightRestrict of 'self-only'

var checkScrimNone = function checkScrimNone(props) {
  var validScrim = !(props.scrimType === 'none' && props.spotlightRestrict === 'self-only');
  process.env.NODE_ENV !== "production" ? (0, _warning["default"])(validScrim, "Using 'spotlightRestrict' of 'self-only' without a scrim " + 'is not supported. Use a transparent scrim to prevent spotlight focus outside of the popup') : void 0;
};

var OpenState = {
  CLOSED: 0,
  OPENING: 1,
  OPEN: 2
};
/**
 * A stateful component that renders a popup in a
 * [FloatingLayer]{@link ui/FloatingLayer.FloatingLayer}.
 *
 * @class Popup
 * @memberof moonstone/Popup
 * @ui
 * @public
 */

var Popup =
/*#__PURE__*/
function (_React$Component) {
  _inherits(Popup, _React$Component);

  function Popup(props) {
    var _this;

    _classCallCheck(this, Popup);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(Popup).call(this, props));

    _this.handleFloatingLayerOpen = function () {
      if (!_this.props.noAnimation && _this.state.popupOpen !== OpenState.OPEN) {
        _this.setState({
          popupOpen: OpenState.OPENING
        });
      } else if (_this.state.popupOpen === OpenState.OPEN && _this.props.open) {
        _this.spotPopupContent();
      }
    };

    _this.handleKeyDown = function (ev) {
      var _this$props = _this.props,
          onClose = _this$props.onClose,
          spotlightRestrict = _this$props.spotlightRestrict;
      var keyCode = ev.keyCode;
      var direction = (0, _spotlight.getDirection)(keyCode);

      var spottables = _spotlight["default"].getSpottableDescendants(_this.state.containerId).length;

      if (direction && onClose) {
        var focusChanged;

        if (spottables && _spotlight["default"].getCurrent() && spotlightRestrict !== 'self-only') {
          focusChanged = _spotlight["default"].move(direction);

          if (focusChanged) {
            // stop propagation to prevent default spotlight behavior
            ev.stopPropagation();
          }
        }

        if (!spottables || focusChanged === false && isUp(keyCode)) {
          // prevent default page scrolling
          ev.preventDefault(); // stop propagation to prevent default spotlight behavior

          ev.stopPropagation(); // set the pointer mode to false on keydown

          _spotlight["default"].setPointerMode(false);

          onClose(ev);
        }
      }
    };

    _this.handlePopupHide = function (ev) {
      forwardHide(ev, _this.props);

      _this.setState({
        floatLayerOpen: false,
        activator: null
      });

      if (ev.currentTarget.getAttribute('data-spotlight-id') === _this.state.containerId) {
        _this.paused.resume();

        if (!_this.props.open) {
          _this.spotActivator(_this.state.activator);
        }
      }
    };

    _this.handlePopupShow = function (ev) {
      forwardShow(ev, _this.props);

      _this.setState({
        popupOpen: OpenState.OPEN
      });

      if (ev.currentTarget.getAttribute('data-spotlight-id') === _this.state.containerId) {
        _this.paused.resume();

        if (_this.props.open) {
          _this.spotPopupContent();
        }
      }
    };

    _this.spotActivator = function (activator) {
      var current = _spotlight["default"].getCurrent();

      var containerNode = getContainerNode(_this.state.containerId);
      (0, _dispatcher.off)('keydown', _this.handleKeyDown); // if there is no currently-spotted control or it is wrapped by the popup's container, we
      // know it's safe to change focus

      if (!current || containerNode && containerNode.contains(current)) {
        // attempt to set focus to the activator, if available
        if (!_spotlight["default"].focus(activator)) {
          _spotlight["default"].focus();
        }
      }
    };

    _this.spotPopupContent = function () {
      var containerId = _this.state.containerId;
      (0, _dispatcher.on)('keydown', _this.handleKeyDown);

      if (!_spotlight["default"].focus(containerId)) {
        var current = _spotlight["default"].getCurrent(); // In cases where the container contains no spottable controls or we're in pointer-mode, focus
        // cannot inherently set the active container or blur the active control, so we must do that
        // here.


        if (current) {
          current.blur();
        }

        _spotlight["default"].setActiveContainer(containerId);
      }
    };

    _this.paused = new _Pause["default"]('Popup');
    _this.state = {
      floatLayerOpen: _this.props.open,
      popupOpen: _this.props.open ? OpenState.OPEN : OpenState.CLOSED,
      prevOpen: _this.props.open,
      containerId: _spotlight["default"].add(),
      activator: null
    };
    checkScrimNone(_this.props);
    return _this;
  }

  _createClass(Popup, [{
    key: "componentDidMount",
    // Spot the content after it's mounted.
    value: function componentDidMount() {
      if (this.props.open && getContainerNode(this.state.containerId)) {
        this.spotPopupContent();
      }
    }
  }, {
    key: "componentDidUpdate",
    value: function componentDidUpdate(prevProps, prevState) {
      if (this.props.open !== prevProps.open) {
        if (!this.props.noAnimation) {
          this.paused.pause();
        } else if (this.props.open) {
          forwardShow({}, this.props);
          this.spotPopupContent();
        } else if (prevProps.open) {
          forwardHide({}, this.props);
          this.spotActivator(prevState.activator);
        }
      }

      checkScrimNone(this.props);
    }
  }, {
    key: "componentWillUnmount",
    value: function componentWillUnmount() {
      if (this.props.open) {
        (0, _dispatcher.off)('keydown', this.handleKeyDown);
      }

      _spotlight["default"].remove(this.state.containerId);
    }
  }, {
    key: "render",
    value: function render() {
      var _this$props2 = this.props,
          noAutoDismiss = _this$props2.noAutoDismiss,
          onClose = _this$props2.onClose,
          scrimType = _this$props2.scrimType,
          rest = _objectWithoutProperties(_this$props2, ["noAutoDismiss", "onClose", "scrimType"]);

      delete rest.spotlightRestrict;
      return _react["default"].createElement(_FloatingLayer["default"], {
        noAutoDismiss: noAutoDismiss,
        open: this.state.floatLayerOpen,
        onOpen: this.handleFloatingLayerOpen,
        onDismiss: onClose,
        scrimType: scrimType
      }, _react["default"].createElement(SkinnedPopupBase, Object.assign({}, rest, {
        "data-webos-voice-exclusive": true,
        onCloseButtonClick: onClose,
        onHide: this.handlePopupHide,
        onShow: this.handlePopupShow,
        open: this.state.popupOpen >= OpenState.OPENING,
        spotlightId: this.state.containerId,
        spotlightRestrict: "self-only"
      })));
    }
  }], [{
    key: "getDerivedStateFromProps",
    value: function getDerivedStateFromProps(props, state) {
      if (props.open !== state.prevOpen) {
        if (props.open) {
          return {
            popupOpen: props.noAnimation || state.floatLayerOpen ? OpenState.OPEN : OpenState.CLOSED,
            floatLayerOpen: true,
            activator: _spotlight["default"].getCurrent(),
            prevOpen: props.open
          };
        } else {
          return {
            popupOpen: OpenState.CLOSED,
            floatLayerOpen: state.popupOpen !== OpenState.CLOSED ? !props.noAnimation : false,
            activator: props.noAnimation ? null : state.activator,
            prevOpen: props.open
          };
        }
      }

      return null;
    }
  }]);

  return Popup;
}(_react["default"].Component);

exports.Popup = Popup;
Popup.propTypes =
/** @lends moonstone/Popup.Popup.prototype */
{
  /**
   * Hint string read when focusing the popup close button.
   *
   * @type {String}
   * @default 'Close'
   * @public
   */
  closeButtonAriaLabel: _propTypes["default"].string,

  /**
   * Disables transition animation.
   *
   * @type {Boolean}
   * @default false
   * @public
   */
  noAnimation: _propTypes["default"].bool,

  /**
   * Indicates that the popup will not trigger `onClose` on the *ESC* key press.
   *
   * @type {Boolean}
   * @default false
   * @public
   */
  noAutoDismiss: _propTypes["default"].bool,

  /**
   * Called on:
   *
   * * pressing `ESC` key,
   * * clicking on the close button, or
   * * moving spotlight focus outside the boundary of the popup when `spotlightRestrict` is
   *   `'self-first'`.
   *
   * It is the responsibility of the callback to set the `open` property to `false`.
   *
   * @type {Function}
   * @public
   */
  onClose: _propTypes["default"].func,

  /**
   * Called after hide transition has completed, and immediately with no transition.
   *
   * @type {Function}
   * @public
   */
  onHide: _propTypes["default"].func,

  /**
   * Called when a key is pressed.
   *
   * @type {Function}
   * @public
   */
  onKeyDown: _propTypes["default"].func,

  /**
   * Called after show transition has completed, and immediately with no transition.
   *
   * Note: The function does not run if Popup is initially opened and
   * [noAnimation]{@link moonstone/Popup.PopupBase#noAnimation} is `true`.
   *
   * @type {Function}
   * @public
   */
  onShow: _propTypes["default"].func,

  /**
   * Controls the visibility of the Popup.
   *
   * By default, the Popup and its contents are not rendered until `open`.
   *
   * @type {Boolean}
   * @default false
   * @public
   */
  open: _propTypes["default"].bool,

  /**
   * Scrim type.
   *
   * * Values: `'transparent'`, `'translucent'`, or `'none'`.
   *
   * `'none'` is not compatible with `spotlightRestrict` of `'self-only'`, use a transparent scrim
   * to prevent mouse focus when using popup.
   *
   * @type {String}
   * @default 'translucent'
   * @public
   */
  scrimType: _propTypes["default"].oneOf(['transparent', 'translucent', 'none']),

  /**
   * Shows a close button.
   *
   * @type {Boolean}
   * @default false
   * @public
   */
  showCloseButton: _propTypes["default"].bool,

  /**
   * Restricts or prioritizes navigation when focus attempts to leave the popup.
   *
   * * Values: `'self-first'`, or `'self-only'`.
   *
   * Note: If `onClose` is not set, then this has no effect on 5-way navigation. If the popup
   * has no spottable children, 5-way navigation will cause the Popup to fire `onClose`.
   *
   * @type {String}
   * @default 'self-only'
   * @public
   */
  spotlightRestrict: _propTypes["default"].oneOf(['self-first', 'self-only'])
};
Popup.defaultProps = {
  noAnimation: false,
  noAutoDismiss: false,
  open: false,
  scrimType: 'translucent',
  showCloseButton: false,
  spotlightRestrict: 'self-only'
};
var _default = Popup;
exports["default"] = _default;