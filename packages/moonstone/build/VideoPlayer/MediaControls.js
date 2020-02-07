"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.MediaControlsDecorator = exports.MediaControls = exports.MediaControlsBase = exports["default"] = void 0;

var _ApiDecorator = _interopRequireDefault(require("@enact/core/internal/ApiDecorator"));

var _Cancelable = _interopRequireDefault(require("@enact/ui/Cancelable"));

var _kind = _interopRequireDefault(require("@enact/core/kind"));

var _hoc = _interopRequireDefault(require("@enact/core/hoc"));

var _keymap = require("@enact/core/keymap");

var _dispatcher = require("@enact/core/dispatcher");

var _I18nDecorator = require("@enact/i18n/I18nDecorator");

var _Pause = _interopRequireDefault(require("@enact/spotlight/Pause"));

var _Slottable = _interopRequireDefault(require("@enact/ui/Slottable"));

var _spotlight = _interopRequireDefault(require("@enact/spotlight"));

var _SpotlightContainerDecorator = require("@enact/spotlight/SpotlightContainerDecorator");

var _handle = require("@enact/core/handle");

var _onlyUpdateForKeys = _interopRequireDefault(require("recompose/onlyUpdateForKeys"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _react = _interopRequireDefault(require("react"));

var _reactDom = _interopRequireDefault(require("react-dom"));

var _$L = _interopRequireDefault(require("../internal/$L"));

var _IconButton = _interopRequireDefault(require("../IconButton"));

var _util = require("./util");

var _VideoPlayerModule = _interopRequireDefault(require("./VideoPlayer.module.css"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _objectWithoutProperties(source, excluded) { if (source == null) return {}; var target = _objectWithoutPropertiesLoose(source, excluded); var key, i; if (Object.getOwnPropertySymbols) { var sourceSymbolKeys = Object.getOwnPropertySymbols(source); for (i = 0; i < sourceSymbolKeys.length; i++) { key = sourceSymbolKeys[i]; if (excluded.indexOf(key) >= 0) continue; if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue; target[key] = source[key]; } } return target; }

function _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var OuterContainer = (0, _SpotlightContainerDecorator.SpotlightContainerDecorator)({
  defaultElement: [".".concat(_VideoPlayerModule["default"].leftComponents, " .").concat(_SpotlightContainerDecorator.spotlightDefaultClass), ".".concat(_VideoPlayerModule["default"].rightComponents, " .").concat(_SpotlightContainerDecorator.spotlightDefaultClass), ".".concat(_SpotlightContainerDecorator.spotlightDefaultClass), ".".concat(_VideoPlayerModule["default"].mediaControls, " *")]
}, 'div');
var Container = (0, _SpotlightContainerDecorator.SpotlightContainerDecorator)({
  enterTo: ''
}, 'div');
var MediaButton = (0, _onlyUpdateForKeys["default"])(['children', 'className', 'color', 'disabled', 'flip', 'onClick', 'spotlightDisabled'])(_IconButton["default"]);
var forwardToggleMore = (0, _handle.forward)('onToggleMore');
/**
 * A set of components for controlling media playback and rendering additional components.
 *
 * @class MediaControlsBase
 * @memberof moonstone/VideoPlayer
 * @ui
 * @private
 */

var MediaControlsBase = (0, _kind["default"])({
  name: 'MediaControls',
  // intentionally assigning these props to MediaControls instead of Base (which is private)
  propTypes:
  /** @lends moonstone/VideoPlayer.MediaControls.prototype */
  {
    /**
     * Reverse-playback [icon]{@link moonstone/Icon.Icon} name. Accepts any
     * [icon]{@link moonstone/Icon.Icon} component type.
     *
     * @type {String}
     * @default 'backward'
     * @public
     */
    backwardIcon: _propTypes["default"].string,

    /**
     * Forward [icon]{@link moonstone/Icon.Icon} name. Accepts any
     * [icon]{@link moonstone/Icon.Icon} component type.
     *
     * @type {String}
     * @default 'forward'
     * @public
     */
    forwardIcon: _propTypes["default"].string,

    /**
     * Jump backward [icon]{@link moonstone/Icon.Icon} name. Accepts any
     * [icon]{@link moonstone/Icon.Icon} component type.
     *
     * @type {String}
     * @default 'jumpbackward'
     * @public
     */
    jumpBackwardIcon: _propTypes["default"].string,

    /**
     * Disables state on the media "jump" buttons; the outer pair.
     *
     * @type {Boolean}
     * @public
     */
    jumpButtonsDisabled: _propTypes["default"].bool,

    /**
     * Jump forward [icon]{@link moonstone/Icon.Icon} name. Accepts any
     * [icon]{@link moonstone/Icon.Icon} component type.
     *
     * @type {String}
     * @default 'jumpforward'
     * @public
     */
    jumpForwardIcon: _propTypes["default"].string,

    /**
     * These components are placed below the title. Typically these will be media descriptor
     * icons, like how many audio channels, what codec the video uses, but can also be a
     * description for the video or anything else that seems appropriate to provide information
     * about the video to the user.
     *
     * @type {Node}
     * @public
     */
    leftComponents: _propTypes["default"].node,

    /**
     * Disables the media buttons.
     *
     * @type {Boolean}
     * @public
     */
    mediaDisabled: _propTypes["default"].bool,

    /**
     * The label for the "more" button for when the "more" tray is open.
     * This will show on the tooltip.
     *
     * @type {String}
     * @default 'Back'
     * @public
     */
    moreButtonCloseLabel: _propTypes["default"].string,

    /**
     * The color of the underline beneath more icon button.
     *
     * This property accepts one of the following color names, which correspond with the
     * colored buttons on a standard remote control: `'red'`, `'green'`, `'yellow'`, `'blue'`.
     *
     * @type {String}
     * @see {@link moonstone/IconButton.IconButtonBase.color}
     * @default 'blue'
     * @public
     */
    moreButtonColor: _propTypes["default"].oneOf(['red', 'green', 'yellow', 'blue']),

    /**
     * Disables the media "more" button.
     *
     * @type {Boolean}
     * @public
     */
    moreButtonDisabled: _propTypes["default"].bool,

    /**
     * The label for the "more" button. This will show on the tooltip.
     *
     * @type {String}
     * @default 'More'
     * @public
     */
    moreButtonLabel: _propTypes["default"].string,

    /**
     * A custom more button ID to use with Spotlight.
     *
     * @type {String}
     * @public
     */
    moreButtonSpotlightId: _propTypes["default"].string,

    /**
     * Removes the "jump" buttons. The buttons that skip forward or backward in the video.
     *
     * @type {Boolean}
     * @public
     */
    noJumpButtons: _propTypes["default"].bool,

    /**
     * Removes the "rate" buttons. The buttons that change the playback rate of the video.
     * Double speed, half speed, reverse 4x speed, etc.
     *
     * @type {Boolean}
     * @public
     */
    noRateButtons: _propTypes["default"].bool,

    /**
     * Called when the user clicks the Backward button.
     *
     * @type {Function}
     * @public
     */
    onBackwardButtonClick: _propTypes["default"].func,

    /**
     * Called when cancel/back key events are fired.
     *
     * @type {Function}
     * @public
     */
    onClose: _propTypes["default"].func,

    /**
     * Called when the user clicks the Forward button.
     *
     * @type {Function}
     * @public
     */
    onForwardButtonClick: _propTypes["default"].func,

    /**
     * Called when the user clicks the JumpBackward button
     *
     * @type {Function}
     * @public
     */
    onJumpBackwardButtonClick: _propTypes["default"].func,

    /**
     * Called when the user clicks the JumpForward button.
     *
     * @type {Function}
     * @public
     */
    onJumpForwardButtonClick: _propTypes["default"].func,

    /**
     * Called when the user clicks the More button.
     *
     * @type {Function}
     * @public
     */
    onMoreClick: _propTypes["default"].func,

    /**
     * Called when the user clicks the Play button.
     *
     * @type {Function}
     * @public
     */
    onPlayButtonClick: _propTypes["default"].func,

    /**
     * `true` when the video is paused.
     *
     * @type {Boolean}
     * @public
     */
    paused: _propTypes["default"].bool,

    /**
     * A string which is sent to the `pause` icon of the player controls. This can be
     * anything that is accepted by [Icon]{@link moonstone/Icon.Icon}. This will be temporarily replaced by
     * the [playIcon]{@link moonstone/VideoPlayer.MediaControls.playIcon} when the
     * [paused]{@link moonstone/VideoPlayer.MediaControls.paused} boolean is `false`.
     *
     * @type {String}
     * @default 'pause'
     * @public
     */
    pauseIcon: _propTypes["default"].string,

    /**
     * A string which is sent to the `play` icon of the player controls. This can be
     * anything that is accepted by {@link moonstone/Icon.Icon}. This will be temporarily replaced by
     * the [pauseIcon]{@link moonstone/VideoPlayer.MediaControls.pauseIcon} when the
     * [paused]{@link moonstone/VideoPlayer.MediaControls.paused} boolean is `true`.
     *
     * @type {String}
     * @default 'play'
     * @public
     */
    playIcon: _propTypes["default"].string,

    /**
     * Disables the media "play"/"pause" button.
     *
     * @type {Boolean}
     * @public
     */
    playPauseButtonDisabled: _propTypes["default"].bool,

    /**
     * Disables the media playback-rate control buttons; the inner pair.
     *
     * @type {Boolean}
     * @public
     */
    rateButtonsDisabled: _propTypes["default"].bool,

    /**
     * These components are placed into the slot to the right of the media controls.
     *
     * @type {Node}
     * @public
     */
    rightComponents: _propTypes["default"].node,

    /**
     * Indicates rtl locale.
     *
     * @type {Boolean}
     * @private
     */
    rtl: _propTypes["default"].bool,

    /**
     * When `true`, more components are visible.
     *
     * @type {Boolean}
     * @private
     */
    showMoreComponents: _propTypes["default"].bool,

    /**
     * `true` controls are disabled from Spotlight.
     *
     * @type {Boolean}
     * @public
     */
    spotlightDisabled: _propTypes["default"].bool,

    /**
     * The spotlight ID for the media controls container.
     *
     * @type {String}
     * @public
     * @default 'mediaControls'
     */
    spotlightId: _propTypes["default"].string,

    /**
     * The visibility of the component. When `false`, the component will be hidden.
     *
     * @type {Boolean}
     * @default true
     * @public
     */
    visible: _propTypes["default"].bool
  },
  defaultProps: {
    backwardIcon: 'backward',
    forwardIcon: 'forward',
    jumpBackwardIcon: 'jumpbackward',
    jumpForwardIcon: 'jumpforward',
    spotlightId: 'mediaControls',
    moreButtonColor: 'blue',
    pauseIcon: 'pause',
    playIcon: 'play',
    visible: true
  },
  styles: {
    css: _VideoPlayerModule["default"],
    className: 'controlsFrame'
  },
  computed: {
    className: function className(_ref) {
      var visible = _ref.visible,
          styler = _ref.styler;
      return styler.append({
        hidden: !visible
      });
    },
    centerClassName: function centerClassName(_ref2) {
      var showMoreComponents = _ref2.showMoreComponents,
          styler = _ref2.styler;
      return styler.join('centerComponents', {
        more: showMoreComponents
      });
    },
    playPauseClassName: function playPauseClassName(_ref3) {
      var showMoreComponents = _ref3.showMoreComponents;
      return showMoreComponents ? null : _SpotlightContainerDecorator.spotlightDefaultClass;
    },
    moreButtonClassName: function moreButtonClassName(_ref4) {
      var showMoreComponents = _ref4.showMoreComponents,
          styler = _ref4.styler;
      return styler.join('moreButton', _defineProperty({}, _SpotlightContainerDecorator.spotlightDefaultClass, showMoreComponents));
    },
    moreIconLabel: function moreIconLabel(_ref5) {
      var _ref5$moreButtonClose = _ref5.moreButtonCloseLabel,
          moreButtonCloseLabel = _ref5$moreButtonClose === void 0 ? (0, _$L["default"])('Back') : _ref5$moreButtonClose,
          _ref5$moreButtonLabel = _ref5.moreButtonLabel,
          moreButtonLabel = _ref5$moreButtonLabel === void 0 ? (0, _$L["default"])('More') : _ref5$moreButtonLabel,
          showMoreComponents = _ref5.showMoreComponents;
      return showMoreComponents ? moreButtonCloseLabel : moreButtonLabel;
    },
    moreIcon: function moreIcon(_ref6) {
      var showMoreComponents = _ref6.showMoreComponents;
      return showMoreComponents ? 'arrowshrinkleft' : 'ellipsis';
    }
  },
  render: function render(_ref7) {
    var backwardIcon = _ref7.backwardIcon,
        centerClassName = _ref7.centerClassName,
        children = _ref7.children,
        forwardIcon = _ref7.forwardIcon,
        jumpBackwardIcon = _ref7.jumpBackwardIcon,
        jumpButtonsDisabled = _ref7.jumpButtonsDisabled,
        jumpForwardIcon = _ref7.jumpForwardIcon,
        leftComponents = _ref7.leftComponents,
        mediaDisabled = _ref7.mediaDisabled,
        moreButtonClassName = _ref7.moreButtonClassName,
        moreButtonColor = _ref7.moreButtonColor,
        moreButtonDisabled = _ref7.moreButtonDisabled,
        moreButtonSpotlightId = _ref7.moreButtonSpotlightId,
        moreIcon = _ref7.moreIcon,
        moreIconLabel = _ref7.moreIconLabel,
        noJumpButtons = _ref7.noJumpButtons,
        noRateButtons = _ref7.noRateButtons,
        onBackwardButtonClick = _ref7.onBackwardButtonClick,
        onForwardButtonClick = _ref7.onForwardButtonClick,
        onJumpBackwardButtonClick = _ref7.onJumpBackwardButtonClick,
        onJumpForwardButtonClick = _ref7.onJumpForwardButtonClick,
        onMoreClick = _ref7.onMoreClick,
        onPlayButtonClick = _ref7.onPlayButtonClick,
        paused = _ref7.paused,
        pauseIcon = _ref7.pauseIcon,
        playIcon = _ref7.playIcon,
        playPauseButtonDisabled = _ref7.playPauseButtonDisabled,
        playPauseClassName = _ref7.playPauseClassName,
        rateButtonsDisabled = _ref7.rateButtonsDisabled,
        rightComponents = _ref7.rightComponents,
        rtl = _ref7.rtl,
        showMoreComponents = _ref7.showMoreComponents,
        spotlightDisabled = _ref7.spotlightDisabled,
        spotlightId = _ref7.spotlightId,
        rest = _objectWithoutProperties(_ref7, ["backwardIcon", "centerClassName", "children", "forwardIcon", "jumpBackwardIcon", "jumpButtonsDisabled", "jumpForwardIcon", "leftComponents", "mediaDisabled", "moreButtonClassName", "moreButtonColor", "moreButtonDisabled", "moreButtonSpotlightId", "moreIcon", "moreIconLabel", "noJumpButtons", "noRateButtons", "onBackwardButtonClick", "onForwardButtonClick", "onJumpBackwardButtonClick", "onJumpForwardButtonClick", "onMoreClick", "onPlayButtonClick", "paused", "pauseIcon", "playIcon", "playPauseButtonDisabled", "playPauseClassName", "rateButtonsDisabled", "rightComponents", "rtl", "showMoreComponents", "spotlightDisabled", "spotlightId"]);

    delete rest.moreButtonCloseLabel;
    delete rest.moreButtonLabel;
    delete rest.onClose;
    delete rest.visible;
    return _react["default"].createElement(OuterContainer, Object.assign({}, rest, {
      spotlightId: spotlightId
    }), _react["default"].createElement("div", {
      className: _VideoPlayerModule["default"].leftComponents
    }, leftComponents), _react["default"].createElement("div", {
      className: _VideoPlayerModule["default"].centerComponentsContainer
    }, _react["default"].createElement("div", {
      className: centerClassName
    }, _react["default"].createElement(Container, {
      className: _VideoPlayerModule["default"].mediaControls,
      spotlightDisabled: showMoreComponents || spotlightDisabled
    }, noJumpButtons ? null : _react["default"].createElement(MediaButton, {
      "aria-label": (0, _$L["default"])('Previous'),
      backgroundOpacity: "translucent",
      disabled: mediaDisabled || jumpButtonsDisabled,
      onClick: onJumpBackwardButtonClick,
      size: "large",
      spotlightDisabled: spotlightDisabled
    }, jumpBackwardIcon), noRateButtons ? null : _react["default"].createElement(MediaButton, {
      "aria-label": (0, _$L["default"])('Rewind'),
      backgroundOpacity: "translucent",
      disabled: mediaDisabled || rateButtonsDisabled,
      onClick: onBackwardButtonClick,
      size: "large",
      spotlightDisabled: spotlightDisabled
    }, backwardIcon), _react["default"].createElement(MediaButton, {
      "aria-label": paused ? (0, _$L["default"])('Play') : (0, _$L["default"])('Pause'),
      className: playPauseClassName,
      backgroundOpacity: "translucent",
      disabled: mediaDisabled || playPauseButtonDisabled,
      onClick: onPlayButtonClick,
      size: "large",
      spotlightDisabled: spotlightDisabled
    }, paused ? playIcon : pauseIcon), noRateButtons ? null : _react["default"].createElement(MediaButton, {
      "aria-label": (0, _$L["default"])('Fast Forward'),
      backgroundOpacity: "translucent",
      disabled: mediaDisabled || rateButtonsDisabled,
      onClick: onForwardButtonClick,
      size: "large",
      spotlightDisabled: spotlightDisabled
    }, forwardIcon), noJumpButtons ? null : _react["default"].createElement(MediaButton, {
      "aria-label": (0, _$L["default"])('Next'),
      backgroundOpacity: "translucent",
      disabled: mediaDisabled || jumpButtonsDisabled,
      onClick: onJumpForwardButtonClick,
      size: "large",
      spotlightDisabled: spotlightDisabled
    }, jumpForwardIcon)), _react["default"].createElement(Container, {
      className: _VideoPlayerModule["default"].moreControls,
      spotlightDisabled: !showMoreComponents || spotlightDisabled
    }, children))), _react["default"].createElement("div", {
      className: _VideoPlayerModule["default"].rightComponents
    }, rightComponents, (0, _util.countReactChildren)(children) ? _react["default"].createElement(MediaButton, {
      "aria-label": moreIconLabel,
      backgroundOpacity: "translucent",
      className: moreButtonClassName,
      color: moreButtonColor,
      disabled: moreButtonDisabled,
      flip: rtl ? 'horizontal' : '',
      onClick: onMoreClick,
      tooltipProps: {
        role: 'dialog'
      },
      tooltipRelative: true,
      size: "large",
      tooltipText: moreIconLabel,
      spotlightId: moreButtonSpotlightId,
      spotlightDisabled: spotlightDisabled
    }, moreIcon) : null));
  }
});
/**
 * Media control behaviors to apply to [MediaControlsBase]{@link moonstone/VideoPlayer.MediaControlsBase}.
 * Provides built-in support for showing more components and key handling for basic playback
 * controls.
 *
 * @class MediaControlsDecorator
 * @memberof moonstone/VideoPlayer
 * @mixes ui/Slottable.Slottable
 * @hoc
 * @private
 */

exports.MediaControlsBase = MediaControlsBase;
var MediaControlsDecorator = (0, _hoc["default"])(function (config, Wrapped) {
  // eslint-disable-line no-unused-vars
  var MediaControlsDecoratorHOC =
  /*#__PURE__*/
  function (_React$Component) {
    _inherits(MediaControlsDecoratorHOC, _React$Component);

    function MediaControlsDecoratorHOC(props) {
      var _this;

      _classCallCheck(this, MediaControlsDecoratorHOC);

      _this = _possibleConstructorReturn(this, _getPrototypeOf(MediaControlsDecoratorHOC).call(this, props));

      _this.handleMoreClick = function () {
        _this.toggleMoreComponents();
      };

      _this.handleKeyDown = function (ev) {
        var _this$props = _this.props,
            mediaDisabled = _this$props.mediaDisabled,
            no5WayJump = _this$props.no5WayJump,
            visible = _this$props.visible;

        var current = _spotlight["default"].getCurrent();

        if (!no5WayJump && !visible && !mediaDisabled && (!current || current.classList.contains(_VideoPlayerModule["default"].controlsHandleAbove)) && ((0, _keymap.is)('left', ev.keyCode) || (0, _keymap.is)('right', ev.keyCode))) {
          _this.paused.pause();

          _this.startListeningForPulses(ev.keyCode);
        }
      };

      _this.handleKeyUp = function (ev) {
        var _this$props2 = _this.props,
            mediaDisabled = _this$props2.mediaDisabled,
            moreButtonColor = _this$props2.moreButtonColor,
            moreButtonDisabled = _this$props2.moreButtonDisabled,
            no5WayJump = _this$props2.no5WayJump,
            noRateButtons = _this$props2.noRateButtons,
            playPauseButtonDisabled = _this$props2.playPauseButtonDisabled,
            rateButtonsDisabled = _this$props2.rateButtonsDisabled,
            visible = _this$props2.visible;
        if (mediaDisabled) return;

        if (visible && moreButtonColor && !moreButtonDisabled && (0, _keymap.is)(moreButtonColor, ev.keyCode)) {
          _this.toggleMoreComponents();
        }

        if (!playPauseButtonDisabled) {
          if ((0, _keymap.is)('play', ev.keyCode)) {
            (0, _handle.forward)('onPlay', ev, _this.props);
          } else if ((0, _keymap.is)('pause', ev.keyCode)) {
            (0, _handle.forward)('onPause', ev, _this.props);
          }
        }

        if (!no5WayJump && ((0, _keymap.is)('left', ev.keyCode) || (0, _keymap.is)('right', ev.keyCode))) {
          _this.stopListeningForPulses();

          _this.paused.resume();
        }

        if (!noRateButtons && !rateButtonsDisabled) {
          if ((0, _keymap.is)('rewind', ev.keyCode)) {
            (0, _handle.forward)('onRewind', ev, _this.props);
          } else if ((0, _keymap.is)('fastForward', ev.keyCode)) {
            (0, _handle.forward)('onFastForward', ev, _this.props);
          }
        }
      };

      _this.handleBlur = function () {
        _this.stopListeningForPulses();

        _this.paused.resume();
      };

      _this.startListeningForPulses = function (keyCode) {
        // Ignore new pulse calls if key code is same, otherwise start new series if we're pulsing
        if (_this.pulsing && keyCode !== _this.pulsingKeyCode) {
          _this.stopListeningForPulses();
        }

        if (!_this.pulsing) {
          _this.pulsingKeyCode = keyCode;
          _this.pulsing = true;
          _this.keyLoop = setTimeout(_this.handlePulse, _this.props.initialJumpDelay);
          (0, _handle.forward)('onJump', {
            keyCode: keyCode
          }, _this.props);
        }
      };

      _this.handlePulse = function () {
        (0, _handle.forward)('onJump', {
          keyCode: _this.pulsingKeyCode
        }, _this.props);
        _this.keyLoop = setTimeout(_this.handlePulse, _this.props.jumpDelay);
      };

      _this.handlePlayButtonClick = function (ev) {
        (0, _handle.forward)('onPlayButtonClick', ev, _this.props);

        if (_this.props.paused) {
          (0, _handle.forward)('onPlay', ev, _this.props);
        } else {
          (0, _handle.forward)('onPause', ev, _this.props);
        }
      };

      _this.calculateMaxComponentCount = function (leftCount, rightCount, childrenCount) {
        // If the "more" button is present, automatically add it to the right's count.
        if (childrenCount) {
          rightCount += 1;
        }

        var max = Math.max(leftCount, rightCount);

        _this.mediaControlsNode.style.setProperty('--moon-video-player-max-side-components', max);
      };

      _this.getMediaControls = function (node) {
        _this.mediaControlsNode = _reactDom["default"].findDOMNode(node); // eslint-disable-line react/no-find-dom-node
      };

      _this.areMoreComponentsAvailable = function () {
        return _this.state.showMoreComponents;
      };

      _this.showMoreComponents = function () {
        _this.setState({
          showMoreComponents: true
        });
      };

      _this.hideMoreComponents = function () {
        _this.setState({
          showMoreComponents: false
        });
      };

      _this.handleClose = function (ev) {
        if (_this.state.showMoreComponents) {
          _this.toggleMoreComponents();

          ev.stopPropagation();
        } else if (_this.props.visible) {
          (0, _handle.forward)('onClose', ev, _this.props);
        }
      };

      _this.mediaControlsNode = null;
      _this.keyLoop = null;
      _this.pulsingKeyCode = null;
      _this.pulsing = null;
      _this.paused = new _Pause["default"]('VideoPlayer');
      _this.state = {
        showMoreComponents: false
      };

      if (props.setApiProvider) {
        props.setApiProvider(_assertThisInitialized(_this));
      }

      return _this;
    }

    _createClass(MediaControlsDecoratorHOC, [{
      key: "componentDidMount",
      value: function componentDidMount() {
        this.calculateMaxComponentCount((0, _util.countReactChildren)(this.props.leftComponents), (0, _util.countReactChildren)(this.props.rightComponents), (0, _util.countReactChildren)(this.props.children));
        (0, _dispatcher.on)('keydown', this.handleKeyDown);
        (0, _dispatcher.on)('keyup', this.handleKeyUp);
        (0, _dispatcher.on)('blur', this.handleBlur, window);
      }
    }, {
      key: "componentDidUpdate",
      value: function componentDidUpdate(prevProps, prevState) {
        // Detect if the number of components has changed
        var leftCount = (0, _util.countReactChildren)(prevProps.leftComponents),
            rightCount = (0, _util.countReactChildren)(prevProps.rightComponents),
            childrenCount = (0, _util.countReactChildren)(prevProps.children);

        if ((0, _util.countReactChildren)(this.props.leftComponents) !== leftCount || (0, _util.countReactChildren)(this.props.rightComponents) !== rightCount || (0, _util.countReactChildren)(this.props.children) !== childrenCount) {
          this.calculateMaxComponentCount(leftCount, rightCount, childrenCount);
        }

        if (this.state.showMoreComponents !== prevState.showMoreComponents) {
          forwardToggleMore({
            showMoreComponents: this.state.showMoreComponents
          }, this.props);
        } // if media controls disabled, reset key loop


        if (!prevProps.mediaDisabled && this.props.mediaDisabled) {
          this.stopListeningForPulses();
          this.paused.resume();
        }
      }
    }, {
      key: "componentWillUnmount",
      value: function componentWillUnmount() {
        (0, _dispatcher.off)('keydown', this.handleKeyDown);
        (0, _dispatcher.off)('keyup', this.handleKeyUp);
        (0, _dispatcher.off)('blur', this.handleBlur, window);
        this.stopListeningForPulses();
      }
    }, {
      key: "stopListeningForPulses",
      value: function stopListeningForPulses() {
        this.pulsing = false;

        if (this.keyLoop) {
          clearTimeout(this.keyLoop);
          this.keyLoop = null;
        }
      }
    }, {
      key: "toggleMoreComponents",
      value: function toggleMoreComponents() {
        this.setState(function (prevState) {
          return {
            showMoreComponents: !prevState.showMoreComponents
          };
        });
      }
    }, {
      key: "render",
      value: function render() {
        var props = Object.assign({}, this.props);
        delete props.initialJumpDelay;
        delete props.jumpDelay;
        delete props.no5WayJump;
        delete props.onFastForward;
        delete props.onJump;
        delete props.onPause;
        delete props.onPlay;
        delete props.onRewind;
        delete props.onToggleMore;
        delete props.setApiProvider;
        return _react["default"].createElement(Wrapped, Object.assign({
          ref: this.getMediaControls
        }, props, {
          onClose: this.handleClose,
          onMoreClick: this.handleMoreClick,
          onPlayButtonClick: this.handlePlayButtonClick,
          showMoreComponents: this.state.showMoreComponents
        }));
      }
    }], [{
      key: "getDerivedStateFromProps",
      value: function getDerivedStateFromProps(props) {
        if (!props.visible) {
          return {
            showMoreComponents: false
          };
        }

        return null;
      }
    }]);

    return MediaControlsDecoratorHOC;
  }(_react["default"].Component);

  MediaControlsDecoratorHOC.displayName = 'MediaControlsDecorator';
  MediaControlsDecoratorHOC.propTypes =
  /** @lends moonstone/VideoPlayer.MediaControlsDecorator.prototype */
  {
    /**
     * The number of milliseconds that the player will pause before firing the
     * first jump event on a right or left pulse.
     *
     * @type {Number}
     * @default 400
     * @public
     */
    initialJumpDelay: _propTypes["default"].number,

    /**
     * The number of milliseconds that the player will throttle before firing a
     * jump event on a right or left pulse.
     *
     * @type {Number}
     * @default 200
     * @public
     */
    jumpDelay: _propTypes["default"].number,

    /**
     * These components are placed below the title. Typically these will be media descriptor
     * icons, like how many audio channels, what codec the video uses, but can also be a
     * description for the video or anything else that seems appropriate to provide information
     * about the video to the user.
     *
     * @type {Node}
     * @public
     */
    leftComponents: _propTypes["default"].node,

    /**
     * Disables the media buttons.
     *
     * @type {Boolean}
     * @public
     */
    mediaDisabled: _propTypes["default"].bool,

    /**
     * The color of the underline beneath more icon button.
     *
     * This property accepts one of the following color names, which correspond with the
     * colored buttons on a standard remote control: `'red'`, `'green'`, `'yellow'`, `'blue'`
     *
     * @type {String}
     * @see {@link moonstone/IconButton.IconButtonBase.color}
     * @default 'blue'
     * @public
     */
    moreButtonColor: _propTypes["default"].oneOf(['red', 'green', 'yellow', 'blue']),

    /**
     * Disables the media "more" button.
     *
     * @type {Boolean}
     * @public
     */
    moreButtonDisabled: _propTypes["default"].bool,

    /**
     * A custom more button ID to use with Spotlight.
     *
     * @type {String}
     * @default 'mediaButton'
     * @public
     */
    moreButtonSpotlightId: _propTypes["default"].string,

    /**
     * Setting this to `true` will disable left and right keys for seeking.
     *
     * @type {Boolean}
     * @public
     */
    no5WayJump: _propTypes["default"].bool,

    /**
     * Removes the "rate" buttons. The buttons that change the playback rate of the video.
     * Double speed, half speed, reverse 4x speed, etc.
     *
     * @type {Boolean}
     * @public
     */
    noRateButtons: _propTypes["default"].bool,

    /**
     * Called when media fast forwards.
     *
     * @type {Function}
     * @public
     */
    onFastForward: _propTypes["default"].func,

    /**
     * Called when media jumps.
     *
     * @type {Function}
     * @public
     */
    onJump: _propTypes["default"].func,

    /**
     * Called when media gets paused.
     *
     * @type {Function}
     * @public
     */
    onPause: _propTypes["default"].func,

    /**
     * Called when media starts playing.
     *
     * @type {Function}
     * @public
     */
    onPlay: _propTypes["default"].func,

    /**
     * Called when media rewinds.
     *
     * @type {Function}
     * @public
     */
    onRewind: _propTypes["default"].func,

    /**
     * Called when the user clicks the More button.
     *
     * @type {Function}
     * @public
     */
    onToggleMore: _propTypes["default"].func,

    /**
     * The video pause state.
     *
     * @type {Boolean}
     * @public
     */
    paused: _propTypes["default"].bool,

    /**
     * Disables state on the media "play"/"pause" button
     *
     * @type {Boolean}
     * @public
     */
    playPauseButtonDisabled: _propTypes["default"].bool,

    /**
     * Disables the media playback-rate control buttons; the inner pair.
     *
     * @type {Boolean}
     * @public
     */
    rateButtonsDisabled: _propTypes["default"].bool,

    /**
     * These components are placed into the slot to the right of the media controls.
     *
     * @type {Node}
     * @public
     */
    rightComponents: _propTypes["default"].node,

    /**
     * Registers the MediaControls component with an
     * [ApiDecorator]{@link core/internal/ApiDecorator.ApiDecorator}.
     *
     * @type {Function}
     * @private
     */
    setApiProvider: _propTypes["default"].func,

    /**
     * The visibility of the component. When `false`, the component will be hidden.
     *
     * @type {Boolean}
     * @public
     */
    visible: _propTypes["default"].bool
  };
  MediaControlsDecoratorHOC.defaultProps = {
    initialJumpDelay: 400,
    jumpDelay: 200,
    moreButtonColor: 'blue',
    moreButtonSpotlightId: 'moreButton'
  };
  return (0, _Slottable["default"])({
    slots: ['leftComponents', 'rightComponents']
  }, MediaControlsDecoratorHOC);
});
exports.MediaControlsDecorator = MediaControlsDecorator;

var handleCancel = function handleCancel(ev, _ref8) {
  var onClose = _ref8.onClose;

  if (onClose) {
    onClose(ev);
  }
};
/**
 * A set of components for controlling media playback and rendering additional components.
 *
 * This uses [Slottable]{@link ui/Slottable} to accept the custom tags, `<leftComponents>`
 * and `<rightComponents>`, to add components to the left and right of the media
 * controls. Any additional children will be rendered into the "more" controls area causing the
 * "more" button to appear. Showing the additional components is handled by `MediaControls` when the
 * user taps the "more" button.
 *
 * @class MediaControls
 * @memberof moonstone/VideoPlayer
 * @mixes ui/Cancelable.Cancelable
 * @ui
 * @public
 */


var MediaControls = (0, _ApiDecorator["default"])({
  api: ['areMoreComponentsAvailable', 'showMoreComponents', 'hideMoreComponents']
}, MediaControlsDecorator((0, _Cancelable["default"])({
  modal: true,
  onCancel: handleCancel
}, (0, _I18nDecorator.I18nContextDecorator)({
  rtlProp: 'rtl'
}, MediaControlsBase))));
exports.MediaControls = MediaControls;
MediaControls.defaultSlot = 'mediaControlsComponent';
var _default = MediaControls;
exports["default"] = _default;