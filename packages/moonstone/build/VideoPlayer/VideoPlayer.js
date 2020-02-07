"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
Object.defineProperty(exports, "MediaControls", {
  enumerable: true,
  get: function get() {
    return _MediaControls["default"];
  }
});
Object.defineProperty(exports, "Video", {
  enumerable: true,
  get: function get() {
    return _Video["default"];
  }
});
exports.VideoPlayerBase = exports.VideoPlayer = exports["default"] = void 0;

var _ApiDecorator = _interopRequireDefault(require("@enact/core/internal/ApiDecorator"));

var _dispatcher = require("@enact/core/dispatcher");

var _util = require("@enact/core/util");

var _handle = require("@enact/core/handle");

var _keymap = require("@enact/core/keymap");

var _platform = require("@enact/core/platform");

var _propTypes = _interopRequireDefault(require("@enact/core/internal/prop-types"));

var _I18nDecorator = require("@enact/i18n/I18nDecorator");

var _util2 = require("@enact/i18n/util");

var _spotlight = _interopRequireDefault(require("@enact/spotlight"));

var _SpotlightContainerDecorator = require("@enact/spotlight/SpotlightContainerDecorator");

var _Spottable = require("@enact/spotlight/Spottable");

var _Announce = _interopRequireDefault(require("@enact/ui/AnnounceDecorator/Announce"));

var _ComponentOverride = _interopRequireDefault(require("@enact/ui/ComponentOverride"));

var _FloatingLayer = require("@enact/ui/FloatingLayer");

var _FloatingLayerDecorator = require("@enact/ui/FloatingLayer/FloatingLayerDecorator");

var _Media = _interopRequireDefault(require("@enact/ui/Media"));

var _Slottable = _interopRequireDefault(require("@enact/ui/Slottable"));

var _Touchable = _interopRequireDefault(require("@enact/ui/Touchable"));

var _DurationFmt = _interopRequireDefault(require("ilib/lib/DurationFmt"));

var _equals = _interopRequireDefault(require("ramda/src/equals"));

var _propTypes2 = _interopRequireDefault(require("prop-types"));

var _react = _interopRequireDefault(require("react"));

var _reactDom = _interopRequireDefault(require("react-dom"));

var _shallowEqual = _interopRequireDefault(require("recompose/shallowEqual"));

var _$L = _interopRequireDefault(require("../internal/$L"));

var _Skinnable = _interopRequireDefault(require("../Skinnable"));

var _Spinner = _interopRequireDefault(require("../Spinner"));

var _util3 = require("./util");

var _Overlay = _interopRequireDefault(require("./Overlay"));

var _MediaControls = _interopRequireDefault(require("./MediaControls"));

var _MediaTitle = _interopRequireDefault(require("./MediaTitle"));

var _MediaSlider = _interopRequireDefault(require("./MediaSlider"));

var _FeedbackContent = _interopRequireDefault(require("./FeedbackContent"));

var _FeedbackTooltip = _interopRequireDefault(require("./FeedbackTooltip"));

var _Times = _interopRequireDefault(require("./Times"));

var _Video = _interopRequireDefault(require("./Video"));

var _VideoPlayerModule = _interopRequireDefault(require("./VideoPlayer.module.css"));

var _class, _temp;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _objectWithoutProperties(source, excluded) { if (source == null) return {}; var target = _objectWithoutPropertiesLoose(source, excluded); var key, i; if (Object.getOwnPropertySymbols) { var sourceSymbolKeys = Object.getOwnPropertySymbols(source); for (i = 0; i < sourceSymbolKeys.length; i++) { key = sourceSymbolKeys[i]; if (excluded.indexOf(key) >= 0) continue; if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue; target[key] = source[key]; } } return target; }

function _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance"); }

function _iterableToArrayLimit(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { _defineProperty(target, key, source[key]); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

var SpottableDiv = (0, _Touchable["default"])((0, _Spottable.Spottable)('div'));
var RootContainer = (0, _SpotlightContainerDecorator.SpotlightContainerDecorator)({
  enterTo: 'default-element',
  defaultElement: [".".concat(_VideoPlayerModule["default"].controlsHandleAbove), ".".concat(_VideoPlayerModule["default"].controlsFrame)]
}, 'div');
var ControlsContainer = (0, _SpotlightContainerDecorator.SpotlightContainerDecorator)({
  enterTo: '',
  straightOnly: true
}, 'div');
var memoGetDurFmt = (0, _util.memoize)(function () {
  return (
    /* locale */
    new _DurationFmt["default"]({
      length: 'medium',
      style: 'clock',
      useNative: false
    })
  );
});

var getDurFmt = function getDurFmt(locale) {
  if (typeof window === 'undefined') return null;
  return memoGetDurFmt(locale);
};

var forwardWithState = function forwardWithState(type) {
  return (0, _handle.adaptEvent)((0, _handle.call)('addStateToEvent'), (0, _handle.forwardWithPrevent)(type));
}; // provide forwarding of events on media controls


var forwardControlsAvailable = (0, _handle.forward)('onControlsAvailable');
var forwardPlay = forwardWithState('onPlay');
var forwardPause = forwardWithState('onPause');
var forwardRewind = forwardWithState('onRewind');
var forwardFastForward = forwardWithState('onFastForward');
var forwardJumpBackward = forwardWithState('onJumpBackward');
var forwardJumpForward = forwardWithState('onJumpForward');
var AnnounceState = {
  // Video is loaded but additional announcements have not been made
  READY: 0,
  // The title should be announced
  TITLE: 1,
  // The title has been announce
  TITLE_READ: 2,
  // The infoComponents should be announce
  INFO: 3,
  // All announcements have been made
  DONE: 4
};
/**
 * Every callback sent by [VideoPlayer]{@link moonstone/VideoPlayer} receives a status package,
 * which includes an object with the following key/value pairs as the first argument:
 *
 * @typedef {Object} videoStatus
 * @memberof moonstone/VideoPlayer
 * @property {String} type - Type of event that triggered this callback
 * @property {Number} currentTime - Playback index of the media in seconds
 * @property {Number} duration - Media's entire duration in seconds
 * @property {Boolean} paused - Playing vs paused state. `true` means the media is paused
 * @property {Number} playbackRate - Current playback rate, as a number
 * @property {Number} proportionLoaded - A value between `0` and `1` representing the proportion of the media that has loaded
 * @property {Number} proportionPlayed - A value between `0` and `1` representing the proportion of the media that has already been shown
 *
 * @public
 */

/**
 * A set of playback rates when media fast forwards, rewinds, slow-fowards, or slow-rewinds.
 *
 * The number used for each operation is proportional to the normal playing speed, 1. If the rate
 * is less than 1, it will play slower than normal speed, and, if it is larger than 1, it will play
 * faster. If it is negative, it will play backward.
 *
 * The order of numbers represents the incremental order of rates that will be used for each
 * operation. Note that all rates are expressed as strings and fractions are used rather than decimals
 * (e.g.: `'1/2'`, not `'0.5'`).
 *
 * @typedef {Object} playbackRateHash
 * @memberof moonstone/VideoPlayer
 * @property {String[]} fastForward - An array of playback rates when media fast forwards
 * @property {String[]} rewind - An array of playback rates when media rewinds
 * @property {String[]} slowForward - An array of playback rates when media slow-forwards
 * @property {String[]} slowRewind - An array of playback rates when media slow-rewinds
 *
 * @public
 */

/**
 * A player for video {@link moonstone/VideoPlayer.VideoPlayerBase}.
 *
 * @class VideoPlayerBase
 * @memberof moonstone/VideoPlayer
 * @ui
 * @public
 */

var VideoPlayerBase = (_temp = _class =
/*#__PURE__*/
function (_React$Component) {
  _inherits(VideoPlayerBase, _React$Component);

  function VideoPlayerBase(_props) {
    var _this;

    _classCallCheck(this, VideoPlayerBase);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(VideoPlayerBase).call(this, _props)); // Internal State

    _this.announceJob = new _util.Job(function (msg) {
      return _this.announceRef && _this.announceRef.announce(msg);
    }, 200);

    _this.announce = function (msg) {
      _this.announceJob.start(msg);
    };

    _this.getHeightForElement = function (elementName) {
      var element = _this.player.querySelector(".".concat(_VideoPlayerModule["default"][elementName]));

      if (element) {
        return element.offsetHeight;
      } else {
        return 0;
      }
    };

    _this.activityDetected = function () {
      // console.count('activityDetected');
      _this.startAutoCloseTimeout();
    };

    _this.startAutoCloseTimeout = function () {
      // If this.state.more is used as a reference for when this function should fire, timing for
      // detection of when "more" is pressed vs when the state is updated is mismatched. Using an
      // instance variable that's only set and used for this express purpose seems cleanest.
      if (_this.props.autoCloseTimeout && _this.state.mediaControlsVisible) {
        _this.autoCloseJob.startAfter(_this.props.autoCloseTimeout);
      }
    };

    _this.stopAutoCloseTimeout = function () {
      _this.autoCloseJob.stop();
    };

    _this.generateId = function () {
      return Math.random().toString(36).substr(2, 8);
    };

    _this.markAnnounceRead = function () {
      if (_this.state.announce === AnnounceState.TITLE) {
        _this.setState({
          announce: AnnounceState.TITLE_READ
        });
      } else if (_this.state.announce === AnnounceState.INFO) {
        _this.setState({
          announce: AnnounceState.DONE
        });
      }

      return true;
    };

    _this.showControls = function () {
      if (_this.props.disabled) {
        return;
      }

      _this.startDelayedFeedbackHide();

      _this.startDelayedTitleHide();

      _this.setState(function (_ref) {
        var announce = _ref.announce;

        if (announce === AnnounceState.READY) {
          // if we haven't read the title yet, do so this time
          announce = AnnounceState.TITLE;
        } else if (announce === AnnounceState.TITLE) {
          // if we have read the title, advance to INFO so title isn't read again
          announce = AnnounceState.TITLE_READ;
        }

        return {
          announce: announce,
          bottomControlsRendered: true,
          feedbackAction: 'idle',
          feedbackVisible: true,
          mediaControlsVisible: true,
          mediaSliderVisible: true,
          miniFeedbackVisible: false,
          titleVisible: true
        };
      });
    };

    _this.hideControls = function () {
      _this.stopDelayedFeedbackHide();

      _this.stopDelayedMiniFeedbackHide();

      _this.stopDelayedTitleHide();

      _this.stopAutoCloseTimeout();

      _this.setState({
        feedbackAction: 'idle',
        feedbackVisible: false,
        mediaControlsVisible: false,
        mediaSliderVisible: false,
        miniFeedbackVisible: false,
        infoVisible: false
      });

      _this.markAnnounceRead();
    };

    _this.toggleControls = function () {
      if (_this.state.mediaControlsVisible) {
        _this.hideControls();
      } else {
        _this.showControls();
      }
    };

    _this.doAutoClose = function () {
      _this.stopDelayedFeedbackHide();

      _this.stopDelayedTitleHide();

      _this.setState(function (_ref2) {
        var mediaSliderVisible = _ref2.mediaSliderVisible,
            miniFeedbackVisible = _ref2.miniFeedbackVisible;
        return {
          feedbackVisible: false,
          mediaControlsVisible: false,
          mediaSliderVisible: mediaSliderVisible && miniFeedbackVisible,
          infoVisible: false
        };
      });

      _this.markAnnounceRead();
    };

    _this.autoCloseJob = new _util.Job(_this.doAutoClose);

    _this.startDelayedTitleHide = function () {
      if (_this.props.titleHideDelay) {
        _this.hideTitleJob.startAfter(_this.props.titleHideDelay);
      }
    };

    _this.stopDelayedTitleHide = function () {
      _this.hideTitleJob.stop();
    };

    _this.hideTitle = function () {
      _this.setState({
        titleVisible: false
      });
    };

    _this.hideTitleJob = new _util.Job(_this.hideTitle);

    _this.startDelayedFeedbackHide = function () {
      if (_this.props.feedbackHideDelay) {
        _this.hideFeedbackJob.startAfter(_this.props.feedbackHideDelay);
      }
    };

    _this.stopDelayedFeedbackHide = function () {
      _this.hideFeedbackJob.stop();
    };

    _this.showFeedback = function () {
      if (_this.state.mediaControlsVisible) {
        _this.setState({
          feedbackVisible: true
        });
      } else {
        var shouldShowSlider = _this.pulsedPlaybackState !== null || (0, _util3.calcNumberValueOfPlaybackRate)(_this.playbackRate) !== 1;

        if (_this.showMiniFeedback && (!_this.state.miniFeedbackVisible || _this.state.mediaSliderVisible !== shouldShowSlider)) {
          _this.setState(function (_ref3) {
            var loading = _ref3.loading,
                duration = _ref3.duration,
                error = _ref3.error;
            return {
              mediaSliderVisible: shouldShowSlider && !_this.props.noMediaSliderFeedback,
              miniFeedbackVisible: !(loading || !duration || error)
            };
          });
        }
      }
    };

    _this.hideFeedback = function () {
      if (_this.state.feedbackVisible && _this.state.feedbackAction !== 'focus') {
        _this.setState({
          feedbackVisible: false,
          feedbackAction: 'idle'
        });
      }
    };

    _this.hideFeedbackJob = new _util.Job(_this.hideFeedback);

    _this.startDelayedMiniFeedbackHide = function () {
      var delay = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : _this.props.miniFeedbackHideDelay;

      if (delay) {
        _this.hideMiniFeedbackJob.startAfter(delay);
      }
    };

    _this.stopDelayedMiniFeedbackHide = function () {
      _this.hideMiniFeedbackJob.stop();
    };

    _this.hideMiniFeedback = function () {
      if (_this.state.miniFeedbackVisible) {
        _this.showMiniFeedback = false;

        _this.setState({
          mediaSliderVisible: false,
          miniFeedbackVisible: false
        });
      }
    };

    _this.hideMiniFeedbackJob = new _util.Job(_this.hideMiniFeedback);
    _this.handle = _handle.handle.bind(_assertThisInitialized(_this));

    _this.showControlsFromPointer = function () {
      _spotlight["default"].setPointerMode(false);

      _this.showControls();
    };

    _this.clearPulsedPlayback = function () {
      _this.pulsedPlaybackRate = null;
      _this.pulsedPlaybackState = null;
    };

    _this.shouldShowMiniFeedback = function (ev) {
      if (ev.type === 'keyup') {
        _this.showMiniFeedback = true;
      }

      return true;
    };

    _this.handleLoadStart = function () {
      _this.firstPlayReadFlag = true;
      _this.prevCommand = _this.props.noAutoPlay ? 'pause' : 'play';
      _this.speedIndex = 0;

      _this.setState({
        announce: AnnounceState.READY,
        currentTime: 0,
        sourceUnavailable: true,
        proportionPlayed: 0,
        proportionLoaded: 0
      });

      if (!_this.props.noAutoShowMediaControls) {
        if (!_this.state.bottomControlsRendered) {
          _this.renderBottomControl.idle();
        } else {
          _this.showControls();
        }
      }
    };

    _this.handlePlay = _this.handle(forwardPlay, _this.shouldShowMiniFeedback, function () {
      return _this.play();
    });
    _this.handlePause = _this.handle(forwardPause, _this.shouldShowMiniFeedback, function () {
      return _this.pause();
    });
    _this.handleRewind = _this.handle(forwardRewind, _this.shouldShowMiniFeedback, function () {
      return _this.rewind();
    });
    _this.handleFastForward = _this.handle(forwardFastForward, _this.shouldShowMiniFeedback, function () {
      return _this.fastForward();
    });

    _this.handleJump = function (_ref4) {
      var keyCode = _ref4.keyCode;

      if (_this.props.seekDisabled) {
        (0, _handle.forward)('onSeekFailed', {}, _this.props);
      } else {
        var jumpBy = ((0, _keymap.is)('left', keyCode) ? -1 : 1) * _this.props.jumpBy;
        var time = Math.min(_this.state.duration, Math.max(0, _this.state.currentTime + jumpBy));
        if (_this.preventTimeChange(time)) return;
        _this.showMiniFeedback = true;

        _this.jump(jumpBy);

        _this.announceJob.startAfter(500, (0, _util3.secondsToTime)(_this.video.currentTime, getDurFmt(_this.props.locale), {
          includeHour: true
        }));
      }
    };

    _this.handleGlobalKeyDown = _this.handle((0, _handle.returnsTrue)(_this.activityDetected), (0, _handle.forKey)('down'), function () {
      return !_this.state.mediaControlsVisible && !_spotlight["default"].getCurrent() && _spotlight["default"].getPointerMode() && !_this.props.spotlightDisabled;
    }, _handle.preventDefault, _handle.stopImmediate, _this.showControlsFromPointer);

    _this.handleEvent = function () {
      var el = _this.video;
      var updatedState = {
        // Standard media properties
        currentTime: el.currentTime,
        duration: el.duration,
        paused: el.playbackRate !== 1 || el.paused,
        playbackRate: el.playbackRate,
        // Non-standard state computed from properties
        error: el.error,
        loading: el.loading,
        proportionLoaded: el.proportionLoaded,
        proportionPlayed: el.proportionPlayed || 0,
        sliderTooltipTime: _this.sliderScrubbing ? _this.sliderKnobProportion * el.duration : el.currentTime,
        // note: `el.loading && this.state.sourceUnavailable == false` is equivalent to `oncanplaythrough`
        sourceUnavailable: el.loading && _this.state.sourceUnavailable || el.error
      }; // If there's an error, we're obviously not loading, no matter what the readyState is.

      if (updatedState.error) updatedState.loading = false;
      var isRewind = _this.prevCommand === 'rewind' || _this.prevCommand === 'slowRewind';
      var isForward = _this.prevCommand === 'fastForward' || _this.prevCommand === 'slowForward';

      if (_this.props.pauseAtEnd && (el.currentTime === 0 && isRewind || el.currentTime === el.duration && isForward)) {
        _this.pause();
      }

      _this.setState(updatedState);
    };

    _this.renderBottomControl = new _util.Job(function () {
      if (!_this.state.bottomControlsRendered) {
        _this.setState({
          bottomControlsRendered: true
        });
      }
    });

    _this.getMediaState = function () {
      return {
        currentTime: _this.state.currentTime,
        duration: _this.state.duration,
        paused: _this.state.paused,
        playbackRate: _this.video.playbackRate,
        proportionLoaded: _this.state.proportionLoaded,
        proportionPlayed: _this.state.proportionPlayed
      };
    };

    _this.send = function (action, props) {
      _this.clearPulsedPlayback();

      _this.showFeedback();

      _this.startDelayedFeedbackHide();

      _this.video[action](props);
    };

    _this.play = function () {
      if (_this.state.sourceUnavailable) {
        return;
      }

      _this.speedIndex = 0; // must happen before send() to ensure feedback uses the right value
      // TODO: refactor into this.state member

      _this.prevCommand = 'play';

      _this.setPlaybackRate(1);

      _this.send('play');

      _this.announce((0, _$L["default"])('Play'));

      _this.startDelayedMiniFeedbackHide(5000);
    };

    _this.pause = function () {
      if (_this.state.sourceUnavailable) {
        return;
      }

      _this.speedIndex = 0; // must happen before send() to ensure feedback uses the right value
      // TODO: refactor into this.state member

      _this.prevCommand = 'pause';

      _this.setPlaybackRate(1);

      _this.send('pause');

      _this.announce((0, _$L["default"])('Pause'));

      _this.stopDelayedMiniFeedbackHide();
    };

    _this.seek = function (timeIndex) {
      if (!_this.props.seekDisabled && !isNaN(_this.video.duration) && !_this.state.sourceUnavailable) {
        _this.video.currentTime = timeIndex;
      } else {
        (0, _handle.forward)('onSeekFailed', {}, _this.props);
      }
    };

    _this.jump = function (distance) {
      if (_this.state.sourceUnavailable) {
        return;
      }

      _this.pulsedPlaybackRate = (0, _util2.toUpperCase)(new _DurationFmt["default"]({
        length: 'long'
      }).format({
        second: _this.props.jumpBy
      }));
      _this.pulsedPlaybackState = distance > 0 ? 'jumpForward' : 'jumpBackward';

      _this.showFeedback();

      _this.startDelayedFeedbackHide();

      _this.seek(_this.state.currentTime + distance);

      _this.startDelayedMiniFeedbackHide();
    };

    _this.fastForward = function () {
      if (_this.state.sourceUnavailable) {
        return;
      }

      var shouldResumePlayback = false;

      switch (_this.prevCommand) {
        case 'slowForward':
          if (_this.speedIndex === _this.playbackRates.length - 1) {
            // reached to the end of array => fastforward
            _this.selectPlaybackRates('fastForward');

            _this.speedIndex = 0;
            _this.prevCommand = 'fastForward';
          } else {
            _this.speedIndex = _this.clampPlaybackRate(_this.speedIndex + 1);
          }

          break;

        case 'pause':
          _this.selectPlaybackRates('slowForward');

          if (_this.state.paused) {
            shouldResumePlayback = true;
          }

          _this.speedIndex = 0;
          _this.prevCommand = 'slowForward';
          break;

        case 'fastForward':
          _this.speedIndex = _this.clampPlaybackRate(_this.speedIndex + 1);
          _this.prevCommand = 'fastForward';
          break;

        default:
          _this.selectPlaybackRates('fastForward');

          _this.speedIndex = 0;
          _this.prevCommand = 'fastForward';

          if (_this.state.paused) {
            shouldResumePlayback = true;
          }

          break;
      }

      _this.setPlaybackRate(_this.selectPlaybackRate(_this.speedIndex));

      if (shouldResumePlayback) _this.send('play');

      _this.stopDelayedFeedbackHide();

      _this.stopDelayedMiniFeedbackHide();

      _this.clearPulsedPlayback();

      _this.showFeedback();
    };

    _this.rewind = function () {
      if (_this.state.sourceUnavailable) {
        return;
      }

      var rateForSlowRewind = _this.props.playbackRateHash['slowRewind'];
      var shouldResumePlayback = false,
          command = 'rewind';

      if (_this.video.currentTime === 0) {
        // Do not rewind if currentTime is 0. We're already at the beginning.
        return;
      }

      switch (_this.prevCommand) {
        case 'slowRewind':
          if (_this.speedIndex === _this.playbackRates.length - 1) {
            // reached to the end of array => go to rewind
            _this.selectPlaybackRates(command);

            _this.speedIndex = 0;
            _this.prevCommand = command;
          } else {
            _this.speedIndex = _this.clampPlaybackRate(_this.speedIndex + 1);
          }

          break;

        case 'pause':
          // If it's possible to slowRewind, do it, otherwise just leave it as normal rewind : QEVENTSEVT-17386
          if (rateForSlowRewind && rateForSlowRewind.length >= 0) {
            command = 'slowRewind';
          }

          _this.selectPlaybackRates(command);

          if (_this.state.paused && _this.state.duration > _this.state.currentTime) {
            shouldResumePlayback = true;
          }

          _this.speedIndex = 0;
          _this.prevCommand = command;
          break;

        case 'rewind':
          _this.speedIndex = _this.clampPlaybackRate(_this.speedIndex + 1);
          _this.prevCommand = command;
          break;

        default:
          _this.selectPlaybackRates(command);

          _this.speedIndex = 0;
          _this.prevCommand = command;
          break;
      }

      _this.setPlaybackRate(_this.selectPlaybackRate(_this.speedIndex));

      if (shouldResumePlayback) _this.send('play');

      _this.stopDelayedFeedbackHide();

      _this.stopDelayedMiniFeedbackHide();

      _this.clearPulsedPlayback();

      _this.showFeedback();
    };

    _this.videoProxy = typeof Proxy !== 'function' ? null : new Proxy({}, {
      get: function get(target, name) {
        var value = _this.video[name];

        if (typeof value === 'function') {
          value = value.bind(_this.video);
        }

        return value;
      },
      set: function set(target, name, value) {
        return _this.video[name] = value;
      }
    });

    _this.getVideoNode = function () {
      return _this.videoProxy || _this.video;
    };

    _this.areControlsVisible = function () {
      return _this.state.mediaControlsVisible;
    };

    _this.selectPlaybackRates = function (cmd) {
      _this.playbackRates = _this.props.playbackRateHash[cmd];
    };

    _this.clampPlaybackRate = function (idx) {
      if (!_this.playbackRates) {
        return;
      }

      return idx % _this.playbackRates.length;
    };

    _this.selectPlaybackRate = function (idx) {
      return _this.playbackRates[idx];
    };

    _this.setPlaybackRate = function (rate) {
      // Stop rewind (if happenning)
      _this.stopRewindJob(); // Make sure rate is a string


      _this.playbackRate = rate = String(rate);
      var pbNumber = (0, _util3.calcNumberValueOfPlaybackRate)(rate);

      if (!_platform.platform.webos) {
        // ReactDOM throws error for setting negative value for playbackRate
        _this.video.playbackRate = pbNumber < 0 ? 0 : pbNumber; // For supporting cross browser behavior

        if (pbNumber < 0) {
          _this.beginRewind();
        }
      } else {
        // Set native playback rate
        _this.video.playbackRate = pbNumber;
      }
    };

    _this.rewindManually = function () {
      var now = (0, _util.perfNow)(),
          distance = now - _this.rewindBeginTime,
          pbRate = (0, _util3.calcNumberValueOfPlaybackRate)(_this.playbackRate),
          adjustedDistance = distance * pbRate / 1000;

      _this.jump(adjustedDistance);

      _this.stopDelayedMiniFeedbackHide();

      _this.clearPulsedPlayback();

      _this.startRewindJob(); // Issue another rewind tick

    };

    _this.rewindJob = new _util.Job(_this.rewindManually, 100);

    _this.startRewindJob = function () {
      _this.rewindBeginTime = (0, _util.perfNow)();

      _this.rewindJob.start();
    };

    _this.stopRewindJob = function () {
      _this.rewindJob.stop();
    };

    _this.beginRewind = function () {
      _this.send('pause');

      _this.startRewindJob();
    };

    _this.addStateToEvent = function (ev) {
      return _objectSpread({
        // More props from `ev` may be added here as needed, but a full copy via `...ev`
        // overloads Storybook's Action Logger and likely has other perf fallout.
        type: ev.type
      }, _this.getMediaState());
    };

    _this.disablePointerMode = function () {
      _spotlight["default"].setPointerMode(false);

      return true;
    };

    _this.handleKeyDownFromControls = _this.handle( // onKeyDown is used as a proxy for when the title has been read because it can only occur
    // after the controls have been shown.
    _this.markAnnounceRead, (0, _handle.forKey)('down'), _this.disablePointerMode, _this.hideControls);

    _this.onVideoClick = function () {
      _this.toggleControls();
    };

    _this.onSliderChange = function (_ref5) {
      var value = _ref5.value;
      var time = value * _this.state.duration;
      if (_this.preventTimeChange(time)) return;

      _this.seek(time);

      _this.sliderScrubbing = false;
    };

    _this.sliderTooltipTimeJob = new _util.Job(function (time) {
      return _this.setState({
        sliderTooltipTime: time
      });
    }, 20);

    _this.handleKnobMove = function (ev) {
      _this.sliderScrubbing = true; // prevent announcing repeatedly when the knob is detached from the progress.
      // TODO: fix Slider to not send onKnobMove when the knob hasn't, in fact, moved

      if (_this.sliderKnobProportion !== ev.proportion) {
        _this.sliderKnobProportion = ev.proportion;
        var seconds = Math.floor(_this.sliderKnobProportion * _this.video.duration);

        if (!isNaN(seconds)) {
          _this.sliderTooltipTimeJob.throttle(seconds);

          var knobTime = (0, _util3.secondsToTime)(seconds, getDurFmt(_this.props.locale), {
            includeHour: true
          });
          (0, _handle.forward)('onScrub', _objectSpread({}, ev, {
            seconds: seconds
          }), _this.props);

          _this.announce("".concat((0, _$L["default"])('jump to'), " ").concat(knobTime));
        }
      }
    };

    _this.handleSliderFocus = function () {
      var seconds = Math.floor(_this.sliderKnobProportion * _this.video.duration);
      _this.sliderScrubbing = true;

      _this.setState({
        feedbackAction: 'focus',
        feedbackVisible: true
      });

      _this.stopDelayedFeedbackHide();

      if (!isNaN(seconds)) {
        _this.sliderTooltipTimeJob.throttle(seconds);

        var knobTime = (0, _util3.secondsToTime)(seconds, getDurFmt(_this.props.locale), {
          includeHour: true
        });
        (0, _handle.forward)('onScrub', {
          detached: _this.sliderScrubbing,
          proportion: _this.sliderKnobProportion,
          seconds: seconds
        }, _this.props);

        _this.announce("".concat((0, _$L["default"])('jump to'), " ").concat(knobTime));
      }
    };

    _this.handleSliderBlur = function () {
      _this.sliderScrubbing = false;

      _this.startDelayedFeedbackHide();

      _this.setState(function (_ref6) {
        var currentTime = _ref6.currentTime;
        return {
          feedbackAction: 'blur',
          feedbackVisible: true,
          sliderTooltipTime: currentTime
        };
      });
    };

    _this.slider5WayPressJob = new _util.Job(function () {
      _this.setState({
        slider5WayPressed: false
      });
    }, 200);

    _this.handleSliderKeyDown = function (ev) {
      var keyCode = ev.keyCode;

      if ((0, _keymap.is)('enter', keyCode)) {
        _this.setState({
          slider5WayPressed: true
        }, _this.slider5WayPressJob.start());
      } else if ((0, _keymap.is)('down', keyCode)) {
        _spotlight["default"].setPointerMode(false);

        if (_spotlight["default"].focus(_this.mediaControlsSpotlightId)) {
          (0, _handle.preventDefault)(ev);
          (0, _handle.stopImmediate)(ev);

          _this.activityDetected();
        }
      } else if ((0, _keymap.is)('up', keyCode)) {
        _spotlight["default"].setPointerMode(false);

        (0, _handle.preventDefault)(ev);
        (0, _handle.stopImmediate)(ev);

        _this.handleSliderBlur();

        _this.hideControls();
      } else {
        _this.activityDetected();
      }
    };

    _this.onJumpBackward = _this.handle(forwardJumpBackward, function () {
      return _this.jump(-1 * _this.props.jumpBy);
    });
    _this.onJumpForward = _this.handle(forwardJumpForward, function () {
      return _this.jump(_this.props.jumpBy);
    });

    _this.handleToggleMore = function (_ref7) {
      var showMoreComponents = _ref7.showMoreComponents;

      if (!showMoreComponents) {
        _this.startAutoCloseTimeout(); // Restore the timer since we are leaving "more.
        // Restore the title-hide now that we're finished with "more".


        _this.startDelayedTitleHide();
      } else {
        // Interrupt the title-hide since we don't want it hiding autonomously in "more".
        _this.stopDelayedTitleHide();
      }

      _this.setState(function (_ref8) {
        var announce = _ref8.announce;
        return {
          infoVisible: showMoreComponents,
          titleVisible: true,
          announce: announce < AnnounceState.INFO ? AnnounceState.INFO : AnnounceState.DONE
        };
      });
    };

    _this.handleMediaControlsClose = function (ev) {
      _this.hideControls();

      ev.stopPropagation();
    };

    _this.setPlayerRef = function (node) {
      // TODO: We've moved SpotlightContainerDecorator up to allow VP to be spottable but also
      // need a ref to the root node to query for children and set CSS variables.
      // eslint-disable-next-line react/no-find-dom-node
      _this.player = _reactDom["default"].findDOMNode(node);
    };

    _this.setVideoRef = function (video) {
      _this.video = video;
    };

    _this.setTitleRef = function (node) {
      _this.titleRef = node;
    };

    _this.setAnnounceRef = function (node) {
      _this.announceRef = node;
    };

    _this.video = null;
    _this.pulsedPlaybackRate = null;
    _this.pulsedPlaybackState = null;
    _this.prevCommand = _props.noAutoPlay ? 'pause' : 'play';
    _this.showMiniFeedback = false;
    _this.speedIndex = 0;
    _this.id = _this.generateId();

    _this.selectPlaybackRates('fastForward');

    _this.sliderKnobProportion = 0;
    _this.mediaControlsSpotlightId = _props.spotlightId + '_mediaControls';
    _this.moreButtonSpotlightId = _this.mediaControlsSpotlightId + '_moreButton'; // Re-render-necessary State

    _this.state = {
      announce: AnnounceState.READY,
      currentTime: 0,
      duration: 0,
      error: false,
      loading: false,
      paused: _props.noAutoPlay,
      playbackRate: 1,
      titleOffsetHeight: 0,
      bottomOffsetHeight: 0,
      // Non-standard state computed from properties
      bottomControlsRendered: false,
      feedbackAction: 'idle',
      feedbackVisible: false,
      infoVisible: false,
      mediaControlsVisible: false,
      mediaSliderVisible: false,
      miniFeedbackVisible: false,
      proportionLoaded: 0,
      proportionPlayed: 0,
      sourceUnavailable: true,
      titleVisible: true
    };

    if (_props.setApiProvider) {
      _props.setApiProvider(_assertThisInitialized(_this));
    }

    return _this;
  }

  _createClass(VideoPlayerBase, [{
    key: "componentDidMount",
    value: function componentDidMount() {
      (0, _dispatcher.on)('mousemove', this.activityDetected);

      if (_platform.platform.touch) {
        (0, _dispatcher.on)('touchmove', this.activityDetected);
      }

      (0, _dispatcher.on)('keydown', this.handleGlobalKeyDown);
      this.startDelayedFeedbackHide();

      if (this.context && typeof this.context === 'function') {
        this.floatingLayerController = this.context(function () {});
      }
    }
  }, {
    key: "shouldComponentUpdate",
    value: function shouldComponentUpdate(nextProps, nextState) {
      if ( // Use shallow props compare instead of source comparison to support possible changes
      // from mediaComponent.
      (0, _shallowEqual["default"])(this.props, nextProps) && !this.state.miniFeedbackVisible && this.state.miniFeedbackVisible === nextState.miniFeedbackVisible && !this.state.mediaSliderVisible && this.state.mediaSliderVisible === nextState.mediaSliderVisible && this.state.loading === nextState.loading && this.props.loading === nextProps.loading && (this.state.currentTime !== nextState.currentTime || this.state.proportionPlayed !== nextState.proportionPlayed || this.state.sliderTooltipTime !== nextState.sliderTooltipTime)) {
        return false;
      }

      return true;
    }
  }, {
    key: "componentDidUpdate",
    value: function componentDidUpdate(prevProps, prevState) {
      var _this2 = this;

      if (this.titleRef && this.state.infoVisible && (!prevState.infoVisible || !(0, _equals["default"])(this.props.infoComponents, prevProps.infoComponents))) {
        this.titleRef.style.setProperty('--infoComponentsOffset', "".concat(this.getHeightForElement('infoComponents'), "px"));
      }

      if (!this.state.mediaControlsVisible && prevState.mediaControlsVisible !== this.state.mediaControlsVisible || !this.state.mediaSliderVisible && prevState.mediaSliderVisible !== this.state.mediaSliderVisible) {
        this.floatingLayerController.notify({
          action: 'closeAll'
        });
      }

      if (this.props.spotlightId !== prevProps.spotlightId) {
        this.mediaControlsSpotlightId = this.props.spotlightId + '_mediaControls';
        this.moreButtonSpotlightId = this.mediaControlsSpotlightId + '_moreButton';
      }

      if (!this.state.mediaControlsVisible && prevState.mediaControlsVisible) {
        forwardControlsAvailable({
          available: false
        }, this.props);
        this.stopAutoCloseTimeout();

        if (!this.props.spotlightDisabled) {
          // If last focused item were in the media controls or slider, we need to explicitly
          // blur the element when MediaControls hide. See ENYO-5648
          var current = _spotlight["default"].getCurrent();

          var bottomControls = document.querySelector(".".concat(_VideoPlayerModule["default"].bottom));

          if (current && bottomControls && bottomControls.contains(current)) {
            current.blur();
          } // when in pointer mode, the focus call below will only update the last focused for
          // the video player and not set the active container to the video player which will
          // cause focus to land back on the media controls button when spotlight restores
          // focus.


          if (_spotlight["default"].getPointerMode()) {
            _spotlight["default"].setActiveContainer(this.props.spotlightId);
          } // Set focus to the hidden spottable control - maintaining focus on available spottable
          // controls, which prevents an addiitional 5-way attempt in order to re-show media controls


          _spotlight["default"].focus(".".concat(_VideoPlayerModule["default"].controlsHandleAbove));
        }
      } else if (this.state.mediaControlsVisible && !prevState.mediaControlsVisible) {
        forwardControlsAvailable({
          available: true
        }, this.props);
        this.startAutoCloseTimeout();

        if (!this.props.spotlightDisabled) {
          var _current = _spotlight["default"].getCurrent();

          if (!_current || this.player.contains(_current)) {
            // Set focus within media controls when they become visible.
            _spotlight["default"].focus(this.mediaControlsSpotlightId);
          }
        }
      } // Once video starts loading it queues bottom control render until idle


      if (this.state.bottomControlsRendered && !prevState.bottomControlsRendered && !this.state.mediaControlsVisible) {
        this.showControls();
      }

      if (this.state.mediaControlsVisible && prevState.infoVisible !== this.state.infoVisible) {
        var _current2 = _spotlight["default"].getCurrent();

        if (_current2 && _current2.dataset && _current2.dataset.spotlightId === this.moreButtonSpotlightId) {
          // need to blur manually to read out `infoComponent`
          _current2.blur();
        }

        setTimeout(function () {
          _spotlight["default"].focus(_this2.moreButtonSpotlightId);
        }, 1);
      }
    }
  }, {
    key: "componentWillUnmount",
    value: function componentWillUnmount() {
      (0, _dispatcher.off)('mousemove', this.activityDetected);

      if (_platform.platform.touch) {
        (0, _dispatcher.off)('touchmove', this.activityDetected);
      }

      (0, _dispatcher.off)('keydown', this.handleGlobalKeyDown);
      this.stopRewindJob();
      this.stopAutoCloseTimeout();
      this.stopDelayedTitleHide();
      this.stopDelayedFeedbackHide();
      this.stopDelayedMiniFeedbackHide();
      this.announceJob.stop();
      this.renderBottomControl.stop();
      this.sliderTooltipTimeJob.stop();
      this.slider5WayPressJob.stop();

      if (this.floatingLayerController) {
        this.floatingLayerController.unregister();
      }
    } //
    // Internal Methods
    //

  }, {
    key: "isTimeBeyondSelection",
    value: function isTimeBeyondSelection(time) {
      var selection = this.props.selection; // if selection isn't set or only contains the starting value, there isn't a valid selection
      // with which to test the time

      if (selection != null && selection.length >= 2) {
        var _selection = _slicedToArray(selection, 2),
            start = _selection[0],
            end = _selection[1];

        return time > end || time < start;
      }

      return false;
    }
  }, {
    key: "preventTimeChange",
    value: function preventTimeChange(time) {
      return this.isTimeBeyondSelection(time) && !(0, _handle.forwardWithPrevent)('onSeekOutsideSelection', {
        type: 'onSeekOutsideSelection',
        time: time
      }, this.props);
    }
    /**
     * If the announce state is either ready to read the title or ready to read info, advance the
     * state to "read".
     *
     * @returns {Boolean} Returns true to be used in event handlers
     * @private
     */

  }, {
    key: "getControlsAriaProps",
    value: function getControlsAriaProps() {
      if (this.state.announce === AnnounceState.TITLE) {
        return {
          'aria-labelledby': "".concat(this.id, "_title"),
          'aria-live': 'off',
          role: 'alert'
        };
      } else if (this.state.announce === AnnounceState.INFO) {
        return {
          'aria-labelledby': "".concat(this.id, "_info"),
          role: 'region'
        };
      }

      return null;
    }
  }, {
    key: "render",
    value: function render() {
      var _this3 = this;

      var _this$props = this.props,
          className = _this$props.className,
          disabled = _this$props.disabled,
          infoComponents = _this$props.infoComponents,
          loading = _this$props.loading,
          locale = _this$props.locale,
          mediaControlsComponent = _this$props.mediaControlsComponent,
          noAutoPlay = _this$props.noAutoPlay,
          noMiniFeedback = _this$props.noMiniFeedback,
          noSlider = _this$props.noSlider,
          noSpinner = _this$props.noSpinner,
          selection = _this$props.selection,
          spotlightDisabled = _this$props.spotlightDisabled,
          spotlightId = _this$props.spotlightId,
          style = _this$props.style,
          thumbnailComponent = _this$props.thumbnailComponent,
          thumbnailSrc = _this$props.thumbnailSrc,
          title = _this$props.title,
          VideoComponent = _this$props.videoComponent,
          mediaProps = _objectWithoutProperties(_this$props, ["className", "disabled", "infoComponents", "loading", "locale", "mediaControlsComponent", "noAutoPlay", "noMiniFeedback", "noSlider", "noSpinner", "selection", "spotlightDisabled", "spotlightId", "style", "thumbnailComponent", "thumbnailSrc", "title", "videoComponent"]);

      delete mediaProps.announce;
      delete mediaProps.autoCloseTimeout;
      delete mediaProps.children;
      delete mediaProps.feedbackHideDelay;
      delete mediaProps.jumpBy;
      delete mediaProps.miniFeedbackHideDelay;
      delete mediaProps.noAutoShowMediaControls;
      delete mediaProps.noMediaSliderFeedback;
      delete mediaProps.onControlsAvailable;
      delete mediaProps.onFastForward;
      delete mediaProps.onJumpBackward;
      delete mediaProps.onJumpForward;
      delete mediaProps.onPause;
      delete mediaProps.onPlay;
      delete mediaProps.onRewind;
      delete mediaProps.onScrub;
      delete mediaProps.onSeekFailed;
      delete mediaProps.onSeekOutsideSelection;
      delete mediaProps.pauseAtEnd;
      delete mediaProps.playbackRateHash;
      delete mediaProps.seekDisabled;
      delete mediaProps.setApiProvider;
      delete mediaProps.thumbnailUnavailable;
      delete mediaProps.titleHideDelay;
      delete mediaProps.videoPath;
      mediaProps.autoPlay = !noAutoPlay;
      mediaProps.className = _VideoPlayerModule["default"].video;
      mediaProps.controls = false;
      mediaProps.mediaComponent = 'video';
      mediaProps.onLoadStart = this.handleLoadStart;
      mediaProps.onUpdate = this.handleEvent;
      mediaProps.ref = this.setVideoRef;
      var controlsAriaProps = this.getControlsAriaProps();
      var proportionSelection = selection;

      if (proportionSelection != null && this.state.duration) {
        proportionSelection = selection.map(function (t) {
          return t / _this3.state.duration;
        });
      }

      var durFmt = getDurFmt(locale);
      return _react["default"].createElement(RootContainer, {
        className: _VideoPlayerModule["default"].videoPlayer + ' enact-fit' + (className ? ' ' + className : ''),
        onClick: this.activityDetected,
        ref: this.setPlayerRef,
        spotlightDisabled: spotlightDisabled,
        spotlightId: spotlightId,
        style: style
      }, // Duplicating logic from <ComponentOverride /> until enzyme supports forwardRef
      VideoComponent && ((typeof VideoComponent === 'function' || typeof VideoComponent === 'string') && _react["default"].createElement(VideoComponent, mediaProps) || _react["default"].isValidElement(VideoComponent) && _react["default"].cloneElement(VideoComponent, mediaProps)) || null, _react["default"].createElement(_Overlay["default"], {
        bottomControlsVisible: this.state.mediaControlsVisible,
        onClick: this.onVideoClick
      }, !noSpinner && (this.state.loading || loading) ? _react["default"].createElement(_Spinner["default"], {
        centered: true
      }) : null), this.state.bottomControlsRendered ? _react["default"].createElement("div", Object.assign({
        className: _VideoPlayerModule["default"].fullscreen
      }, controlsAriaProps), _react["default"].createElement(_FeedbackContent["default"], {
        className: _VideoPlayerModule["default"].miniFeedback,
        playbackRate: this.pulsedPlaybackRate || this.selectPlaybackRate(this.speedIndex),
        playbackState: this.pulsedPlaybackState || this.prevCommand,
        visible: this.state.miniFeedbackVisible && !noMiniFeedback
      }, (0, _util3.secondsToTime)(this.state.sliderTooltipTime, durFmt)), _react["default"].createElement(ControlsContainer, {
        className: _VideoPlayerModule["default"].bottom + (this.state.mediaControlsVisible ? '' : ' ' + _VideoPlayerModule["default"].hidden),
        spotlightDisabled: spotlightDisabled || !this.state.mediaControlsVisible
      }, this.state.mediaSliderVisible ? _react["default"].createElement("div", {
        className: _VideoPlayerModule["default"].infoFrame
      }, _react["default"].createElement(_MediaTitle["default"], {
        id: this.id,
        infoVisible: this.state.infoVisible,
        ref: this.setTitleRef,
        title: title,
        visible: this.state.titleVisible && this.state.mediaControlsVisible
      }, infoComponents), _react["default"].createElement(_Times["default"], {
        current: this.state.currentTime,
        total: this.state.duration,
        formatter: durFmt
      })) : null, noSlider ? null : _react["default"].createElement(_MediaSlider["default"], {
        backgroundProgress: this.state.proportionLoaded,
        disabled: disabled || this.state.sourceUnavailable,
        forcePressed: this.state.slider5WayPressed,
        onBlur: this.handleSliderBlur,
        onChange: this.onSliderChange,
        onFocus: this.handleSliderFocus,
        onKeyDown: this.handleSliderKeyDown,
        onKnobMove: this.handleKnobMove,
        onSpotlightUp: this.handleSpotlightUpFromSlider,
        selection: proportionSelection,
        spotlightDisabled: spotlightDisabled || !this.state.mediaControlsVisible,
        value: this.state.proportionPlayed,
        visible: this.state.mediaSliderVisible
      }, _react["default"].createElement(_FeedbackTooltip["default"], {
        action: this.state.feedbackAction,
        duration: this.state.duration,
        formatter: durFmt,
        hidden: !this.state.feedbackVisible || this.state.sourceUnavailable,
        playbackRate: this.selectPlaybackRate(this.speedIndex),
        playbackState: this.prevCommand,
        thumbnailComponent: thumbnailComponent,
        thumbnailDeactivated: this.props.thumbnailUnavailable,
        thumbnailSrc: thumbnailSrc
      })), _react["default"].createElement(_ComponentOverride["default"], {
        component: mediaControlsComponent,
        mediaDisabled: disabled || this.state.sourceUnavailable,
        moreButtonSpotlightId: this.moreButtonSpotlightId,
        onBackwardButtonClick: this.handleRewind,
        onClose: this.handleMediaControlsClose,
        onFastForward: this.handleFastForward,
        onForwardButtonClick: this.handleFastForward,
        onJump: this.handleJump,
        onJumpBackwardButtonClick: this.onJumpBackward,
        onJumpForwardButtonClick: this.onJumpForward,
        onKeyDown: this.handleKeyDownFromControls,
        onPause: this.handlePause,
        onPlay: this.handlePlay,
        onRewind: this.handleRewind,
        onToggleMore: this.handleToggleMore,
        paused: this.state.paused,
        spotlightId: this.mediaControlsSpotlightId,
        spotlightDisabled: !this.state.mediaControlsVisible || spotlightDisabled,
        visible: this.state.mediaControlsVisible
      }))) : null, _react["default"].createElement(SpottableDiv // This captures spotlight focus for use with 5-way.
      // It's non-visible but lives at the top of the VideoPlayer.
      , {
        className: _VideoPlayerModule["default"].controlsHandleAbove,
        onClick: this.showControls,
        onSpotlightDown: this.showControls,
        spotlightDisabled: this.state.mediaControlsVisible || spotlightDisabled
      }), _react["default"].createElement(_Announce["default"], {
        ref: this.setAnnounceRef
      }));
    }
  }]);

  return VideoPlayerBase;
}(_react["default"].Component), _class.displayName = 'VideoPlayerBase', _class.propTypes =
/** @lends moonstone/VideoPlayer.VideoPlayerBase.prototype */
{
  /**
   * passed by AnnounceDecorator for accessibility
   *
   * @type {Function}
   * @private
   */
  announce: _propTypes2["default"].func,

  /**
   * The time (in milliseconds) before the control buttons will hide.
   *
   * Setting this to 0 or `null` disables closing, requiring user input to open and close.
   *
   * @type {Number}
   * @default 5000
   * @public
   */
  autoCloseTimeout: _propTypes2["default"].number,

  /**
   * Removes interactive capability from this component. This includes, but is not limited to,
   * key-press events, most clickable buttons, and prevents the showing of the controls.
   *
   * @type {Boolean}
   * @public
   */
  disabled: _propTypes2["default"].bool,

  /**
   * Amount of time (in milliseconds) after which the feedback text/icon part of the slider's
   * tooltip will automatically hidden after the last action.
   * Setting this to 0 or `null` disables feedbackHideDelay; feedback will always be present.
   *
   * @type {Number}
   * @default 3000
   * @public
   */
  feedbackHideDelay: _propTypes2["default"].number,

  /**
   * Components placed below the title.
   *
   * Typically these will be media descriptor icons, like how many audio channels, what codec
   * the video uses, but can also be a description for the video or anything else that seems
   * appropriate to provide information about the video to the user.
   *
   * @type {Node}
   * @public
   */
  infoComponents: _propTypes2["default"].node,

  /**
   * The number of seconds the player should skip forward or backward when a "jump" button is
   * pressed.
   *
   * @type {Number}
   * @default 30
   * @public
   */
  jumpBy: _propTypes2["default"].number,

  /**
   * Manually set the loading state of the media, in case you have information that
   * `VideoPlayer` does not have.
   *
   * @type {Boolean}
   * @public
   */
  loading: _propTypes2["default"].bool,

  /**
   * The current locale as a
   * {@link https://tools.ietf.org/html/rfc5646|BCP 47 language tag}.
   *
   * @type {String}
   * @public
   */
  locale: _propTypes2["default"].string,

  /**
   * Overrides the default media control component to support customized behaviors.
   *
   * The provided component will receive the following props from `VideoPlayer`:
   *
   * * `mediaDisabled` - `true` when the media controls are not interactive
   * * `onBackwardButtonClick` - Called when the rewind button is pressed
   * * `onClose` - Called when cancel key is pressed when the media controls are visible
   * * `onFastForward` - Called when the media is fast forwarded via a key event
   * * `onForwardButtonClick` - Called when the fast forward button is pressed
   * * `onJump` - Called when the media jumps either forward or backward
   * * `onJumpBackwardButtonClick` - Called when the jump backward button is pressed
   * * `onJumpForwardButtonClick` - Called when the jump forward button is pressed
   * * `onKeyDown` - Called when a key is pressed
   * * `onPause` - Called when the media is paused via a key event
   * * `onPlay` - Called when the media is played via a key event
   * * `onRewind` - Called when the media is rewound via a key event
   * * `onToggleMore` - Called when the more components are hidden or shown
   * * `paused` - `true` when the media is paused
   * * `spotlightId` - The spotlight container Id for the media controls
   * * `spotlightDisabled` - `true` when spotlight is disabled for the media controls
   * * `visible` - `true` when the media controls should be displayed
   *
   * @type {Component|Element}
   * @default `moonstone/VideoPlayer.MediaControls`
   * @public
   */
  mediaControlsComponent: _propTypes["default"].componentOverride,

  /**
   * Amount of time (in milliseconds), after the last user action, that the `miniFeedback`
   * will automatically hide.
   * Setting this to 0 or `null` disables `miniFeedbackHideDelay`; `miniFeedback` will always
   * be present.
   *
   * @type {Number}
   * @default 2000
   * @public
   */
  miniFeedbackHideDelay: _propTypes2["default"].number,

  /**
   * Disable audio for this video.
   *
   * In a TV context, this is handled by the remote control, not programmatically in the
   * VideoPlayer API.
   *
   * @type {Boolean}
   * @default false
   * @public
   */
  muted: _propTypes2["default"].bool,

  /**
   * Prevents the default behavior of playing a video immediately after it's loaded.
   *
   * @type {Boolean}
   * @default false
   * @public
   */
  noAutoPlay: _propTypes2["default"].bool,

  /**
   * Prevents the default behavior of showing media controls immediately after it's loaded.
   *
   * @type {Boolean}
   * @default false
   * @public
   */
  noAutoShowMediaControls: _propTypes2["default"].bool,

  /**
   * Hides media slider feedback when fast forward or rewind while media controls are hidden.
   *
   * @type {Boolean}
   * @default false
   * @public
   */
  noMediaSliderFeedback: _propTypes2["default"].bool,

  /**
   * Removes the mini feedback.
   *
   * @type {Boolean}
   * @default false
   * @public
   */
  noMiniFeedback: _propTypes2["default"].bool,

  /**
   * Removes the media slider.
   *
   * @type {Boolean}
   * @default false
   * @public
   */
  noSlider: _propTypes2["default"].bool,

  /**
   * Removes spinner while loading.
   *
   * @type {Boolean}
   * @public
   */
  noSpinner: _propTypes2["default"].bool,

  /**
   * Called when the player's controls change availability, whether they are shown
   * or hidden.
   *
   * The current status is sent as the first argument in an object with a key `available`
   * which will be either `true` or `false`. (e.g.: `onControlsAvailable({available: true})`)
   *
   * @type {Function}
   * @public
   */
  onControlsAvailable: _propTypes2["default"].func,

  /**
   * Called when the video is fast forwarded.
   *
   * @type {Function}
   * @public
   */
  onFastForward: _propTypes2["default"].func,

  /**
   * Called when the user clicks the JumpBackward button.
   *
   * Is passed a {@link moonstone/VideoPlayer.videoStatus} as the first argument.
   *
   * @type {Function}
   * @public
   */
  onJumpBackward: _propTypes2["default"].func,

  /**
   * Called when the user clicks the JumpForward button.
   *
   * Is passed a {@link moonstone/VideoPlayer.videoStatus} as the first argument.
   *
   * @type {Function}
   * @public
   */
  onJumpForward: _propTypes2["default"].func,

  /**
   * Called when video is paused
   *
   * @type {Function}
   * @public
   */
  onPause: _propTypes2["default"].func,

  /**
   * Called when video is played
   *
   * @type {Function}
   * @public
   */
  onPlay: _propTypes2["default"].func,

  /**
   * Called when video is rewound.
   *
   * @type {Function}
   * @public
   */
  onRewind: _propTypes2["default"].func,

  /**
   * Called when the user is moving the VideoPlayer's Slider knob independently of
   * the current playback position.
   *
   * It is passed an object with a `seconds` key (float value) to indicate the current time
   * index. It can be used to update the `thumbnailSrc` to the reflect the current scrub
   * position.
   *
   * @type {Function}
   * @public
   */
  onScrub: _propTypes2["default"].func,

  /**
   * Called when seek is attempted while `seekDisabled` is true.
   *
   * @type {Function}
   */
  onSeekFailed: _propTypes2["default"].func,

  /**
   * Called when seeking outside of the current `selection` range.
   *
   * By default, the seek will still be performed. Calling `preventDefault()` on the event
   * will prevent the seek operation.
   *
   * @type {Function}
   * @public
   */
  onSeekOutsideSelection: _propTypes2["default"].func,

  /**
   * Pauses the video when it reaches either the start or the end of the video during rewind,
   * slow rewind, fast forward, or slow forward.
   *
   * @type {Boolean}
   * @default false
   * @public
   */
  pauseAtEnd: _propTypes2["default"].bool,

  /**
   * Mapping of playback rate names to playback rate values that may be set.
   *
   * @type {moonstone/VideoPlayer.playbackRateHash}
   * @default {
   *	fastForward: ['2', '4', '8', '16'],
   *	rewind: ['-2', '-4', '-8', '-16'],
   *	slowForward: ['1/4', '1/2'],
   *	slowRewind: ['-1/2', '-1']
   * }
   * @public
   */
  playbackRateHash: _propTypes2["default"].shape({
    fastForward: _propTypes2["default"].arrayOf(_propTypes2["default"].string),
    rewind: _propTypes2["default"].arrayOf(_propTypes2["default"].string),
    slowForward: _propTypes2["default"].arrayOf(_propTypes2["default"].string),
    slowRewind: _propTypes2["default"].arrayOf(_propTypes2["default"].string)
  }),

  /**
   * Disables seek function.
   *
   * Note that jump by arrow keys will also be disabled when `true`.
   *
   * @type {Boolean}
   * @public
   */
  seekDisabled: _propTypes2["default"].bool,

  /**
   * A range of the video to display as selected.
   *
   * The value of `selection` may either be:
   * * `null` or `undefined` for no selection,
   * * a single-element array with the start time of the selection
   * * a two-element array containing both the start and end time of the selection in seconds
   *
   * When the start time is specified, the media slider will show filled starting at that
   * time to the current time.
   *
   * When the end time is specified, the slider's background will be filled between the two
   * times.
   *
   * @type {Number[]}
   * @public
   */
  selection: _propTypes2["default"].arrayOf(_propTypes2["default"].number),

  /**
   * Registers the VideoPlayer component with an
   * {@link core/internal/ApiDecorator.ApiDecorator}.
   *
   * @type {Function}
   * @private
   */
  setApiProvider: _propTypes2["default"].func,

  /**
   * The video source.
   *
   * Any children `<source>` tag elements of [VideoPlayer]{@link moonstone/VideoPlayer} will
   * be sent directly to the `videoComponent` as video sources.
   *
   * @type {Node}
   * @see https://developer.mozilla.org/en-US/docs/Web/HTML/Element/source
   * @public
   */
  source: _propTypes2["default"].node,

  /**
   * Disables spotlight navigation into the component.
   *
   * @type {Boolean}
   * @public
   */
  spotlightDisabled: _propTypes2["default"].bool,

  /**
   * The spotlight container ID for the player.
   *
   * @type {String}
   * @public
   * @default 'videoPlayer'
   */
  spotlightId: _propTypes2["default"].string,

  /**
   * The thumbnail component to be used instead of the built-in version.
   *
   * The internal thumbnail style will not be applied to this component. This component
   * follows the same rules as the built-in version.
   *
   * @type {String|Component|Element}
   * @public
   */
  thumbnailComponent: _propTypes["default"].renderableOverride,

  /**
   * Thumbnail image source to show on the slider knob.
   *
   * This is a standard {@link moonstone/Image} component so it supports all of the same
   * options for the `src` property. If no `thumbnailComponent` and no `thumbnailSrc` is set,
   * no tooltip will display.
   *
   * @type {String|Object}
   * @public
   */
  thumbnailSrc: _propTypes2["default"].oneOfType([_propTypes2["default"].string, _propTypes2["default"].object]),

  /**
  * Enables the thumbnail transition from opaque to translucent.
  *
  * @type {Boolean}
  * @public
  */
  thumbnailUnavailable: _propTypes2["default"].bool,

  /**
   * Title for the video being played.
   *
   * @type {Node}
   * @public
   */
  title: _propTypes2["default"].oneOfType([_propTypes2["default"].string, _propTypes2["default"].node]),

  /**
   * The time (in milliseconds) before the title disappears from the controls.
   *
   * Setting this to `0` disables hiding.
   *
   * @type {Number}
   * @default 5000
   * @public
   */
  titleHideDelay: _propTypes2["default"].number,

  /**
   * Video component to use.
   *
   * The default renders an `HTMLVideoElement`. Custom video components must have a similar
   * API structure, exposing the following APIs:
   *
   * Properties:
   * * `currentTime` {Number} - Playback index of the media in seconds
   * * `duration` {Number} - Media's entire duration in seconds
   * * `error` {Boolean} - `true` if video playback has errored.
   * * `loading` {Boolean} - `true` if video playback is loading.
   * * `paused` {Boolean} - Playing vs paused state. `true` means the media is paused
   * * `playbackRate` {Number} - Current playback rate, as a number
   * * `proportionLoaded` {Number} - A value between `0` and `1`
   *	representing the proportion of the media that has loaded
   * * `proportionPlayed` {Number} - A value between `0` and `1` representing the
   *	proportion of the media that has already been shown
   *
   * Events:
   * * `onLoadStart` - Called when the video starts to load
   * * `onUpdate` - Sent when any of the properties were updated
   *
   * Methods:
   * * `play()` - play video
   * * `pause()` - pause video
   * * `load()` - load video
   *
   * The [`source`]{@link moonstone/VideoPlayer.VideoBase.source} property is passed to
   * the video component as a child node.
   *
   * @type {Component|Element}
   * @default {@link ui/Media.Media}
   * @public
   */
  videoComponent: _propTypes["default"].componentOverride
}, _class.contextType = _FloatingLayerDecorator.FloatingLayerContext, _class.defaultProps = {
  autoCloseTimeout: 5000,
  feedbackHideDelay: 3000,
  jumpBy: 30,
  mediaControlsComponent: _MediaControls["default"],
  miniFeedbackHideDelay: 2000,
  playbackRateHash: {
    fastForward: ['2', '4', '8', '16'],
    rewind: ['-2', '-4', '-8', '-16'],
    slowForward: ['1/4', '1/2'],
    slowRewind: ['-1/2', '-1']
  },
  spotlightId: 'videoPlayer',
  titleHideDelay: 5000,
  videoComponent: _Media["default"]
}, _temp);
/**
 * A standard HTML5 video player for Moonstone. It behaves, responds to, and operates like a
 * `<video>` tag in its support for `<source>`.  It also accepts custom tags such as
 * `<infoComponents>` for displaying additional information in the title area and `<MediaControls>`
 * for handling media playback controls and adding more controls.
 *
 * Example usage:
 * ```
 *	<VideoPlayer title="Hilarious Cat Video" poster="http://my.cat.videos/boots-poster.jpg">
 *		<source src="http://my.cat.videos/boots.mp4" type="video/mp4" />
 *		<infoComponents>A video about my cat Boots, wearing boots.</infoComponents>
 *		<MediaControls>
 *			<leftComponents><IconButton backgroundOpacity="translucent">star</IconButton></leftComponents>
 *			<rightComponents><IconButton backgroundOpacity="translucent">flag</IconButton></rightComponents>
 *
 *			<Button backgroundOpacity="translucent">Add To Favorites</Button>
 *			<IconButton backgroundOpacity="translucent">search</IconButton>
 *		</MediaControls>
 *	</VideoPlayer>
 * ```
 *
 * To invoke methods (e.g.: `fastForward()`) or get the current state (`getMediaState()`), store a
 * ref to the `VideoPlayer` within your component:
 *
 * ```
 * 	...
 *
 * 	setVideoPlayer = (node) => {
 * 		this.videoPlayer = node;
 * 	}
 *
 * 	play () {
 * 		this.videoPlayer.play();
 * 	}
 *
 * 	render () {
 * 		return (
 * 			<VideoPlayer ref={this.setVideoPlayer} />
 * 		);
 * 	}
 * ```
 *
 * @class VideoPlayer
 * @memberof moonstone/VideoPlayer
 * @mixes ui/Slottable.Slottable
 * @ui
 * @public
 */

exports.VideoPlayerBase = VideoPlayerBase;
var VideoPlayer = (0, _ApiDecorator["default"])({
  api: ['areControlsVisible', 'fastForward', 'getMediaState', 'getVideoNode', 'hideControls', 'jump', 'pause', 'play', 'rewind', 'seek', 'showControls', 'showFeedback', 'toggleControls']
}, (0, _I18nDecorator.I18nContextDecorator)({
  localeProp: 'locale'
}, (0, _Slottable["default"])({
  slots: ['infoComponents', 'mediaControlsComponent', 'source', 'thumbnailComponent', 'videoComponent']
}, (0, _FloatingLayer.FloatingLayerDecorator)({
  floatLayerId: 'videoPlayerFloatingLayer'
}, (0, _Skinnable["default"])(VideoPlayerBase)))));
exports.VideoPlayer = VideoPlayer;
var _default = VideoPlayer;
exports["default"] = _default;