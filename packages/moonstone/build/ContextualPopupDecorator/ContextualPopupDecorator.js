"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
Object.defineProperty(exports, "ContextualPopup", {
  enumerable: true,
  get: function get() {
    return _ContextualPopup.ContextualPopup;
  }
});
exports.ContextualPopupDecorator = exports["default"] = void 0;

var _ApiDecorator = _interopRequireDefault(require("@enact/core/internal/ApiDecorator"));

var _dispatcher = require("@enact/core/dispatcher");

var _handle = require("@enact/core/handle");

var _hoc = _interopRequireDefault(require("@enact/core/hoc"));

var _propTypes = _interopRequireDefault(require("@enact/core/internal/prop-types"));

var _util = require("@enact/core/util");

var _I18nDecorator = require("@enact/i18n/I18nDecorator");

var _spotlight = _interopRequireWildcard(require("@enact/spotlight"));

var _SpotlightContainerDecorator = _interopRequireDefault(require("@enact/spotlight/SpotlightContainerDecorator"));

var _FloatingLayer = _interopRequireDefault(require("@enact/ui/FloatingLayer"));

var _resolution = _interopRequireDefault(require("@enact/ui/resolution"));

var _compose = _interopRequireDefault(require("ramda/src/compose"));

var _propTypes2 = _interopRequireDefault(require("prop-types"));

var _react = _interopRequireDefault(require("react"));

var _reactDom = _interopRequireDefault(require("react-dom"));

var _ContextualPopup = require("./ContextualPopup");

var _ContextualPopupDecoratorModule = _interopRequireDefault(require("./ContextualPopupDecorator.module.css"));

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj["default"] = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _objectWithoutProperties(source, excluded) { if (source == null) return {}; var target = _objectWithoutPropertiesLoose(source, excluded); var key, i; if (Object.getOwnPropertySymbols) { var sourceSymbolKeys = Object.getOwnPropertySymbols(source); for (i = 0; i < sourceSymbolKeys.length; i++) { key = sourceSymbolKeys[i]; if (excluded.indexOf(key) >= 0) continue; if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue; target[key] = source[key]; } } return target; }

function _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

/**
 * Default config for {@link moonstone/ContextualPopupDecorator.ContextualPopupDecorator}
 *
 * @type {Object}
 * @hocconfig
 * @memberof moonstone/ContextualPopupDecorator.ContextualPopupDecorator
 */
var defaultConfig = {
  /**
   * `ContextualPopup` without the arrow.
   *
   * @type {Boolean}
   * @default false
   * @memberof moonstone/ContextualPopupDecorator.ContextualPopupDecorator.defaultConfig
   * @public
   */
  noArrow: false,

  /**
   * Disables passing the `skin` prop to the wrapped component.
   *
   * @see {@link moonstone/Skinnable.Skinnable.skin}
   * @type {Boolean}
   * @default false
   * @memberof moonstone/ContextualPopupDecorator.ContextualPopupDecorator.defaultConfig
   * @public
   */
  noSkin: false,

  /**
   * The prop in which to pass the value of `open` state of ContextualPopupDecorator to the
   * wrapped component.
   *
   * @type {String}
   * @default 'selected'
   * @memberof moonstone/ContextualPopupDecorator.ContextualPopupDecorator.defaultConfig
   * @public
   */
  openProp: 'selected'
};
var ContextualPopupContainer = (0, _SpotlightContainerDecorator["default"])({
  enterTo: 'default-element',
  preserveId: true
}, _ContextualPopup.ContextualPopup);
var Decorator = (0, _hoc["default"])(defaultConfig, function (config, Wrapped) {
  var _class, _temp;

  var noArrow = config.noArrow,
      noSkin = config.noSkin,
      openProp = config.openProp;
  return _temp = _class =
  /*#__PURE__*/
  function (_React$Component) {
    _inherits(_class, _React$Component);

    function _class(props) {
      var _this;

      _classCallCheck(this, _class);

      _this = _possibleConstructorReturn(this, _getPrototypeOf(_class).call(this, props));

      _this.positionContextualPopup = function () {
        if (_this.containerNode && _this.clientNode) {
          var containerNode = _this.containerNode.getBoundingClientRect();

          var _this$clientNode$getB = _this.clientNode.getBoundingClientRect(),
              top = _this$clientNode$getB.top,
              left = _this$clientNode$getB.left,
              bottom = _this$clientNode$getB.bottom,
              right = _this$clientNode$getB.right,
              width = _this$clientNode$getB.width,
              height = _this$clientNode$getB.height;

          var clientNode = {
            top: top,
            left: left,
            bottom: bottom,
            right: right,
            width: width,
            height: height
          };
          clientNode.left = _this.props.rtl ? window.innerWidth - right : left;
          clientNode.right = _this.props.rtl ? window.innerWidth - left : right;

          _this.calcOverflow(containerNode, clientNode);

          _this.adjustDirection();

          _this.setState({
            direction: _this.adjustedDirection,
            arrowPosition: _this.getArrowPosition(clientNode),
            containerPosition: _this.getContainerPosition(containerNode, clientNode)
          });
        }
      };

      _this.getContainerNode = function (node) {
        _this.containerNode = node;
      };

      _this.getClientNode = function (node) {
        _this.clientNode = _reactDom["default"].findDOMNode(node); // eslint-disable-line react/no-find-dom-node
      };

      _this.handle = _handle.handle.bind(_assertThisInitialized(_this));
      _this.handleKeyUp = _this.handle((0, _handle.forProp)('open', true), (0, _handle.forKey)('enter'), function () {
        return _spotlight["default"].getCurrent() === _this.state.activator;
      }, _handle.stop, (0, _handle.forward)('onClose'));

      _this.handleOpen = function (ev) {
        (0, _handle.forward)('onOpen', ev, _this.props);

        _this.positionContextualPopup();

        var current = _spotlight["default"].getCurrent();

        _this.updateLeaveFor(current);

        _this.setState({
          activator: current
        });

        _this.spotPopupContent();
      };

      _this.handleClose = function () {
        _this.updateLeaveFor(null);

        _this.setState({
          activator: null
        });
      };

      _this.handleKeyDown = function (ev) {
        var _this$state = _this.state,
            activator = _this$state.activator,
            containerId = _this$state.containerId;
        var spotlightRestrict = _this.props.spotlightRestrict;

        var current = _spotlight["default"].getCurrent();

        var direction = (0, _spotlight.getDirection)(ev.keyCode);
        if (!direction) return;
        var hasSpottables = _spotlight["default"].getSpottableDescendants(containerId).length > 0;
        var spotlessSpotlightModal = spotlightRestrict === 'self-only' && !hasSpottables;
        var shouldSpotPopup = current === activator && direction === _this.adjustedDirection && hasSpottables;

        if (shouldSpotPopup || spotlessSpotlightModal) {
          _this.handleDirectionalKey(ev); // we guard against attempting a focus change by verifying the case where a
          // spotlightModal popup contains no spottable components


          if (!spotlessSpotlightModal && shouldSpotPopup) {
            _this.spotPopupContent();
          }
        }
      };

      _this.handleContainerKeyDown = function (ev) {
        // Note: Container will be only rendered if `open`ed, therefore no need to check for `open`
        var direction = (0, _spotlight.getDirection)(ev.keyCode);
        if (!direction) return;

        _this.handleDirectionalKey(ev); // if focus moves outside the popup's container, issue the `onClose` event


        if (_spotlight["default"].move(direction) && !_this.containerNode.contains(_spotlight["default"].getCurrent())) {
          (0, _handle.forward)('onClose', ev, _this.props);
        }
      };

      _this.spotActivator = function (activator) {
        if (activator && activator === _spotlight["default"].getCurrent()) {
          activator.blur();
        }

        if (!_spotlight["default"].focus(activator)) {
          _spotlight["default"].focus();
        }
      };

      _this.spotPopupContent = function () {
        var spotlightRestrict = _this.props.spotlightRestrict;
        var containerId = _this.state.containerId;

        var spottableDescendants = _spotlight["default"].getSpottableDescendants(containerId);

        if (spotlightRestrict === 'self-only' && spottableDescendants.length && _spotlight["default"].getCurrent()) {
          _spotlight["default"].getCurrent().blur();
        }

        if (!_spotlight["default"].focus(containerId)) {
          _spotlight["default"].setActiveContainer(containerId);
        }
      };

      _this.state = {
        arrowPosition: {
          top: 0,
          left: 0
        },
        containerPosition: {
          top: 0,
          left: 0
        },
        containerId: _spotlight["default"].add(_this.props.popupSpotlightId),
        activator: null
      };
      _this.overflow = {};
      _this.adjustedDirection = _this.props.direction;
      _this.ARROW_WIDTH = _resolution["default"].scale(30); // svg arrow width. used for arrow positioning

      _this.ARROW_OFFSET = noArrow ? 0 : _resolution["default"].scale(18); // actual distance of the svg arrow displayed to offset overlaps with the container. Offset is when `noArrow` is false.

      _this.MARGIN = noArrow ? _resolution["default"].scale(3) : _resolution["default"].scale(9); // margin from an activator to the contextual popup.

      _this.KEEPOUT = _resolution["default"].scale(12); // keep out distance on the edge of the screen

      if (props.setApiProvider) {
        props.setApiProvider(_assertThisInitialized(_this));
      }

      return _this;
    }

    _createClass(_class, [{
      key: "componentDidMount",
      value: function componentDidMount() {
        if (this.props.open) {
          (0, _dispatcher.on)('keydown', this.handleKeyDown);
          (0, _dispatcher.on)('keyup', this.handleKeyUp);
        }
      }
    }, {
      key: "getSnapshotBeforeUpdate",
      value: function getSnapshotBeforeUpdate(prevProps, prevState) {
        if (prevProps.open && !this.props.open) {
          var current = _spotlight["default"].getCurrent();

          return {
            shouldSpotActivator: // isn't set
            !current || // is on the activator and we want to re-spot it so a11y read out can occur
            current === prevState.activator || // is within the popup
            this.containerNode.contains(current)
          };
        }

        return null;
      }
    }, {
      key: "componentDidUpdate",
      value: function componentDidUpdate(prevProps, prevState, snapshot) {
        if (prevProps.direction !== this.props.direction) {
          this.adjustedDirection = this.props.direction; // NOTE: `setState` is called and will cause re-render

          this.positionContextualPopup();
        }

        if (this.props.open && !prevProps.open) {
          (0, _dispatcher.on)('keydown', this.handleKeyDown);
          (0, _dispatcher.on)('keyup', this.handleKeyUp);
        } else if (!this.props.open && prevProps.open) {
          (0, _dispatcher.off)('keydown', this.handleKeyDown);
          (0, _dispatcher.off)('keyup', this.handleKeyUp);

          if (snapshot && snapshot.shouldSpotActivator) {
            this.spotActivator(prevState.activator);
          }
        }
      }
    }, {
      key: "componentWillUnmount",
      value: function componentWillUnmount() {
        if (this.props.open) {
          (0, _dispatcher.off)('keydown', this.handleKeyDown);
          (0, _dispatcher.off)('keyup', this.handleKeyUp);
        }

        _spotlight["default"].remove(this.state.containerId);
      }
    }, {
      key: "updateLeaveFor",
      value: function updateLeaveFor(activator) {
        _spotlight["default"].set(this.state.containerId, {
          leaveFor: {
            up: activator,
            down: activator,
            left: activator,
            right: activator
          }
        });
      }
    }, {
      key: "getContainerPosition",
      value: function getContainerPosition(containerNode, clientNode) {
        var position = this.centerContainerPosition(containerNode, clientNode);

        switch (this.adjustedDirection) {
          case 'up':
            position.top = clientNode.top - this.ARROW_OFFSET - containerNode.height - this.MARGIN;
            break;

          case 'down':
            position.top = clientNode.bottom + this.ARROW_OFFSET + this.MARGIN;
            break;

          case 'right':
            position.left = this.props.rtl ? clientNode.left - containerNode.width - this.ARROW_OFFSET - this.MARGIN : clientNode.right + this.ARROW_OFFSET + this.MARGIN;
            break;

          case 'left':
            position.left = this.props.rtl ? clientNode.right + this.ARROW_OFFSET + this.MARGIN : clientNode.left - containerNode.width - this.ARROW_OFFSET - this.MARGIN;
            break;
        }

        return this.adjustRTL(position);
      }
    }, {
      key: "centerContainerPosition",
      value: function centerContainerPosition(containerNode, clientNode) {
        var pos = {};

        if (this.adjustedDirection === 'up' || this.adjustedDirection === 'down') {
          if (this.overflow.isOverLeft) {
            // anchor to the left of the screen
            pos.left = this.KEEPOUT;
          } else if (this.overflow.isOverRight) {
            // anchor to the right of the screen
            pos.left = window.innerWidth - containerNode.width - this.KEEPOUT;
          } else {
            // center horizontally
            pos.left = clientNode.left + (clientNode.width - containerNode.width) / 2;
          }
        } else if (this.adjustedDirection === 'left' || this.adjustedDirection === 'right') {
          if (this.overflow.isOverTop) {
            // anchor to the top of the screen
            pos.top = this.KEEPOUT;
          } else if (this.overflow.isOverBottom) {
            // anchor to the bottom of the screen
            pos.top = window.innerHeight - containerNode.height - this.KEEPOUT;
          } else {
            // center vertically
            pos.top = clientNode.top - (containerNode.height - clientNode.height) / 2;
          }
        }

        return pos;
      }
    }, {
      key: "getArrowPosition",
      value: function getArrowPosition(clientNode) {
        var position = {};

        if (this.adjustedDirection === 'up' || this.adjustedDirection === 'down') {
          position.left = clientNode.left + (clientNode.width - this.ARROW_WIDTH) / 2;
        } else {
          position.top = clientNode.top + (clientNode.height - this.ARROW_WIDTH) / 2;
        }

        switch (this.adjustedDirection) {
          case 'up':
            position.top = clientNode.top - this.ARROW_WIDTH - this.MARGIN;
            break;

          case 'down':
            position.top = clientNode.bottom + this.MARGIN;
            break;

          case 'left':
            position.left = this.props.rtl ? clientNode.left + clientNode.width + this.MARGIN : clientNode.left - this.ARROW_WIDTH - this.MARGIN;
            break;

          case 'right':
            position.left = this.props.rtl ? clientNode.left - this.ARROW_WIDTH - this.MARGIN : clientNode.left + clientNode.width + this.MARGIN;
            break;

          default:
            return {};
        }

        return this.adjustRTL(position);
      }
    }, {
      key: "calcOverflow",
      value: function calcOverflow(container, client) {
        var containerHeight, containerWidth;

        if (this.adjustedDirection === 'up' || this.adjustedDirection === 'down') {
          containerHeight = container.height;
          containerWidth = (container.width - client.width) / 2;
        } else {
          containerHeight = (container.height - client.height) / 2;
          containerWidth = container.width;
        }

        this.overflow = {
          isOverTop: client.top - containerHeight - this.ARROW_OFFSET - this.MARGIN - this.KEEPOUT < 0,
          isOverBottom: client.bottom + containerHeight + this.ARROW_OFFSET + this.MARGIN + this.KEEPOUT > window.innerHeight,
          isOverLeft: client.left - containerWidth - this.ARROW_OFFSET - this.MARGIN - this.KEEPOUT < 0,
          isOverRight: client.right + containerWidth + this.ARROW_OFFSET + this.MARGIN + this.KEEPOUT > window.innerWidth
        };
      }
    }, {
      key: "adjustDirection",
      value: function adjustDirection() {
        if (this.overflow.isOverTop && !this.overflow.isOverBottom && this.adjustedDirection === 'up') {
          this.adjustedDirection = 'down';
        } else if (this.overflow.isOverBottom && !this.overflow.isOverTop && this.adjustedDirection === 'down') {
          this.adjustedDirection = 'up';
        } else if (this.overflow.isOverLeft && !this.overflow.isOverRight && this.adjustedDirection === 'left' && !this.props.rtl) {
          this.adjustedDirection = 'right';
        } else if (this.overflow.isOverRight && !this.overflow.isOverLeft && this.adjustedDirection === 'right' && !this.props.rtl) {
          this.adjustedDirection = 'left';
        }
      }
    }, {
      key: "adjustRTL",
      value: function adjustRTL(position) {
        var pos = position;

        if (this.props.rtl) {
          var tmpLeft = pos.left;
          pos.left = pos.right;
          pos.right = tmpLeft;
        }

        return pos;
      }
      /**
       * Position the popup in relation to the activator.
       *
       * Position is based on the dimensions of the popup and its activator. If the popup does not
       * fit in the specified direction, it will automatically flip to the opposite direction.
       *
       * @method
       * @memberof moonstone/ContextualPopupDecorator.ContextualPopupDecorator.prototype
       * @public
       * @returns {undefined}
       */

    }, {
      key: "handleDirectionalKey",
      value: function handleDirectionalKey(ev) {
        // prevent default page scrolling
        ev.preventDefault(); // stop propagation to prevent default spotlight behavior

        ev.stopPropagation(); // set the pointer mode to false on keydown

        _spotlight["default"].setPointerMode(false);
      } // handle key event from outside (i.e. the activator) to the popup container

    }, {
      key: "render",
      value: function render() {
        var _this$props = this.props,
            voiceExclusive = _this$props['data-webos-voice-exclusive'],
            showCloseButton = _this$props.showCloseButton,
            PopupComponent = _this$props.popupComponent,
            popupClassName = _this$props.popupClassName,
            noAutoDismiss = _this$props.noAutoDismiss,
            open = _this$props.open,
            onClose = _this$props.onClose,
            popupProps = _this$props.popupProps,
            skin = _this$props.skin,
            spotlightRestrict = _this$props.spotlightRestrict,
            rest = _objectWithoutProperties(_this$props, ["data-webos-voice-exclusive", "showCloseButton", "popupComponent", "popupClassName", "noAutoDismiss", "open", "onClose", "popupProps", "skin", "spotlightRestrict"]);

        var scrimType = spotlightRestrict === 'self-only' ? 'transparent' : 'none';
        var popupPropsRef = Object.assign({}, popupProps);
        var ariaProps = (0, _util.extractAriaProps)(popupPropsRef);

        if (!noSkin) {
          rest.skin = skin;
        }

        delete rest.onOpen;
        delete rest.popupSpotlightId;
        delete rest.rtl;
        delete rest.setApiProvider;
        if (openProp) rest[openProp] = open;
        return _react["default"].createElement("div", {
          className: _ContextualPopupDecoratorModule["default"].contextualPopupDecorator
        }, _react["default"].createElement(_FloatingLayer["default"], {
          noAutoDismiss: noAutoDismiss,
          onClose: this.handleClose,
          onDismiss: onClose,
          onOpen: this.handleOpen,
          open: open,
          scrimType: scrimType
        }, _react["default"].createElement(ContextualPopupContainer, Object.assign({}, ariaProps, {
          className: popupClassName,
          showCloseButton: showCloseButton,
          onCloseButtonClick: onClose,
          onKeyDown: this.handleContainerKeyDown,
          direction: this.state.direction,
          arrowPosition: this.state.arrowPosition,
          containerPosition: this.state.containerPosition,
          containerRef: this.getContainerNode,
          "data-webos-voice-exclusive": voiceExclusive,
          showArrow: !noArrow,
          skin: skin,
          spotlightId: this.state.containerId,
          spotlightRestrict: spotlightRestrict
        }), _react["default"].createElement(PopupComponent, popupPropsRef))), _react["default"].createElement(Wrapped, Object.assign({
          ref: this.getClientNode
        }, rest)));
      }
    }]);

    return _class;
  }(_react["default"].Component), _class.displayName = 'ContextualPopupDecorator', _class.propTypes =
  /** @lends moonstone/ContextualPopupDecorator.ContextualPopupDecorator.prototype */
  {
    /**
     * The component rendered within the
     * [ContextualPopup]{@link moonstone/ContextualPopupDecorator.ContextualPopup}.
     *
     * @type {Component}
     * @required
     * @public
     */
    popupComponent: _propTypes["default"].component.isRequired,

    /**
     * Limits the range of voice control to the popup.
     *
     * @memberof moonstone/ContextualPopupDecorator.ContextualPopupDecorator.prototype
     * @type {Boolean}
     * @default true
     * @public
     */
    'data-webos-voice-exclusive': _propTypes2["default"].bool,

    /**
     * Direction of popup with respect to the wrapped component.
     *
     * @type {String}
     * @default 'down'
     * @public
     */
    direction: _propTypes2["default"].oneOf(['up', 'down', 'left', 'right']),

    /**
     * Disables closing the popup when the user presses the cancel key or taps outside the
     * popup.
     *
     * @type {Boolean}
     * @default false
     * @public
     */
    noAutoDismiss: _propTypes2["default"].bool,

    /**
     * Called when the user has attempted to close the popup.
     *
     * This may occur either when the close button is clicked or when spotlight focus
     * moves outside the boundary of the popup. Setting `spotlightRestrict` to `'self-only'`
     * will prevent Spotlight focus from leaving the popup.
     *
     * @type {Function}
     * @public
     */
    onClose: _propTypes2["default"].func,

    /**
     * Called when the popup is opened.
     *
     * @type {Function}
     * @public
     */
    onOpen: _propTypes2["default"].func,

    /**
     * Displays the contextual popup.
     *
     * @type {Boolean}
     * @default false
     * @public
     */
    open: _propTypes2["default"].bool,

    /**
     * CSS class name to pass to the
     * [ContextualPopup]{@link moonstone/ContextualPopupDecorator.ContextualPopup}.
     *
     * This is commonly used to set width and height of the popup.
     *
     * @type {String}
     * @public
     */
    popupClassName: _propTypes2["default"].string,

    /**
     * An object containing properties to be passed to popup component.
     *
     * @type {Object}
     * @public
     */
    popupProps: _propTypes2["default"].object,

    /**
     * The container ID to use with Spotlight.
     *
     * The spotlight container for the popup isn't created until it is open. To configure
     * the container using `Spotlight.set()`, handle the `onOpen` event which is fired after
     * the popup has been created and opened.
     *
     * @type {String}
     * @public
     */
    popupSpotlightId: _propTypes2["default"].string,

    /**
     * Indicates the content's text direction is right-to-left.
     *
     * @type {Boolean}
     * @private
     */
    rtl: _propTypes2["default"].bool,

    /**
     * Registers the ContextualPopupDecorator component with an [ApiDecorator]
     * {@link core/internal/ApiDecorator.ApiDecorator}.
     *
     * @type {Function}
     * @private
     */
    setApiProvider: _propTypes2["default"].func,

    /**
     * Shows the close button.
     *
     * @type {Boolean}
     * @default false
     * @public
     */
    showCloseButton: _propTypes2["default"].bool,

    /**
     * The current skin for this component.
     *
     * When `noSkin` is set on the config object, `skin` will only be applied to the
     * [ContextualPopup]{@link moonstone/ContextualPopupDecorator.ContextualPopup} and not
     * to the popup's activator component.
     *
     * @see {@link moonstone/Skinnable.Skinnable.skin}
     * @type {String}
     * @public
     */
    skin: _propTypes2["default"].string,

    /**
     * Restricts or prioritizes spotlight navigation.
     *
     * Allowed values are:
     * * `'none'` - Spotlight can move freely within and beyond the popup
     * * `'self-first'` - Spotlight should prefer components within the popup over
     *   components beyond the popup, or
     * * `'self-only'` - Spotlight can only be set within the popup
     *
     * @type {String}
     * @default 'self-first'
     * @public
     */
    spotlightRestrict: _propTypes2["default"].oneOf(['none', 'self-first', 'self-only'])
  }, _class.defaultProps = {
    'data-webos-voice-exclusive': true,
    direction: 'down',
    noAutoDismiss: false,
    open: false,
    showCloseButton: false,
    spotlightRestrict: 'self-first'
  }, _temp;
});
/**
 * Adds support for positioning a
 * [ContextualPopup]{@link moonstone/ContextualPopupDecorator.ContextualPopup} relative to the
 * wrapped component.
 *
 * `ContextualPopupDecorator` may be used to show additional settings or actions rendered within a
 * small floating popup.
 *
 * Usage:
 * ```
 * const ButtonWithPopup = ContextualPopupDecorator(Button);
 * <ButtonWithPopup
 *   direction="up"
 *   open={this.state.open}
 *   popupComponent={CustomPopupComponent}
 * >
 *   Open Popup
 * </ButtonWithPopup>
 * ```
 *
 * @hoc
 * @memberof moonstone/ContextualPopupDecorator
 * @public
 */

var ContextualPopupDecorator = (0, _compose["default"])((0, _ApiDecorator["default"])({
  api: ['positionContextualPopup']
}), (0, _I18nDecorator.I18nContextDecorator)({
  rtlProp: 'rtl'
}), Decorator);
exports.ContextualPopupDecorator = ContextualPopupDecorator;
var _default = ContextualPopupDecorator;
exports["default"] = _default;