"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Video = exports["default"] = void 0;

var _handle = require("@enact/core/handle");

var _ForwardRef = _interopRequireDefault(require("@enact/ui/ForwardRef"));

var _Media = require("@enact/ui/Media");

var _propTypes = _interopRequireDefault(require("@enact/core/internal/prop-types"));

var _Slottable = _interopRequireDefault(require("@enact/ui/Slottable"));

var _compose = _interopRequireDefault(require("ramda/src/compose"));

var _react = _interopRequireDefault(require("react"));

var _VideoPlayerModule = _interopRequireDefault(require("./VideoPlayer.module.css"));

var _propTypes2 = _interopRequireDefault(require("prop-types"));

var _class, _temp;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _objectWithoutProperties(source, excluded) { if (source == null) return {}; var target = _objectWithoutPropertiesLoose(source, excluded); var key, i; if (Object.getOwnPropertySymbols) { var sourceSymbolKeys = Object.getOwnPropertySymbols(source); for (i = 0; i < sourceSymbolKeys.length; i++) { key = sourceSymbolKeys[i]; if (excluded.indexOf(key) >= 0) continue; if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue; target[key] = source[key]; } } return target; }

function _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

/**
 * Adds support for preloading a video source for `VideoPlayer`.
 *
 * @class VideoBase
 * @memberof moonstone/VideoPlayer
 * @ui
 * @private
 */
var VideoBase = (_temp = _class =
/*#__PURE__*/
function (_React$Component) {
  _inherits(VideoBase, _React$Component);

  function VideoBase() {
    var _getPrototypeOf2;

    var _this;

    _classCallCheck(this, VideoBase);

    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    _this = _possibleConstructorReturn(this, (_getPrototypeOf2 = _getPrototypeOf(VideoBase)).call.apply(_getPrototypeOf2, [this].concat(args)));

    _this.handlePreloadLoadStart = function (ev) {
      // persist the event so we can cache it to re-emit when the preload becomes active
      ev.persist();
      _this.preloadLoadStart = ev; // prevent the from bubbling to upstream handlers

      ev.stopPropagation();
    };

    _this.setVideoRef = function (node) {
      _this.video = node;

      _this.setMedia();
    };

    _this.setPreloadRef = function (node) {
      if (node) {
        node.load();
      }

      _this.preloadVideo = node;
    };

    return _this;
  }

  _createClass(VideoBase, [{
    key: "componentDidUpdate",
    value: function componentDidUpdate(prevProps) {
      var _this$props = this.props,
          source = _this$props.source,
          preloadSource = _this$props.preloadSource;
      var prevSource = prevProps.source,
          prevPreloadSource = prevProps.preloadSource;
      var key = (0, _Media.getKeyFromSource)(source);
      var prevKey = (0, _Media.getKeyFromSource)(prevSource);
      var preloadKey = (0, _Media.getKeyFromSource)(preloadSource);
      var prevPreloadKey = (0, _Media.getKeyFromSource)(prevPreloadSource);

      if (this.props.setMedia !== prevProps.setMedia) {
        this.clearMedia(prevProps);
        this.setMedia();
      }

      if (source) {
        if (key === prevPreloadKey && preloadKey !== prevPreloadKey) {
          // if there's source and it was the preload source
          // if the preloaded video didn't error, notify VideoPlayer it is ready to reset
          if (this.preloadLoadStart) {
            (0, _handle.forward)('onLoadStart', this.preloadLoadStart, this.props);
          } // emit onUpdate to give VideoPlayer an opportunity to updates its internal state
          // since it won't receive the onLoadStart or onError event


          (0, _handle.forward)('onUpdate', {
            type: 'onUpdate'
          }, this.props);
          this.autoPlay();
        } else if (key !== prevKey) {
          // if there's source and it has changed.
          this.autoPlay();
        }
      }

      if (preloadSource && preloadKey !== prevPreloadKey) {
        this.preloadLoadStart = null; // In the case that the previous source equalled the previous preload (causing the
        // preload video node to not be created) and then the preload source was changed, we
        // need to guard against accessing the preloadVideo node.

        if (this.preloadVideo) {
          this.preloadVideo.load();
        }
      }
    }
  }, {
    key: "componentWillUnmount",
    value: function componentWillUnmount() {
      this.clearMedia();
    }
  }, {
    key: "clearMedia",
    value: function clearMedia() {
      var _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : this.props,
          setMedia = _ref.setMedia;

      if (setMedia) {
        setMedia(null);
      }
    }
  }, {
    key: "setMedia",
    value: function setMedia() {
      var _ref2 = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : this.props,
          _setMedia = _ref2.setMedia;

      if (_setMedia) {
        _setMedia(this.video);
      }
    }
  }, {
    key: "autoPlay",
    value: function autoPlay() {
      if (!this.props.autoPlay) return;
      this.video.play();
    }
  }, {
    key: "render",
    value: function render() {
      var _this$props2 = this.props,
          preloadSource = _this$props2.preloadSource,
          source = _this$props2.source,
          mediaComponent = _this$props2.mediaComponent,
          rest = _objectWithoutProperties(_this$props2, ["preloadSource", "source", "mediaComponent"]);

      delete rest.setMedia;
      var sourceKey = (0, _Media.getKeyFromSource)(source);
      var preloadKey = (0, _Media.getKeyFromSource)(preloadSource); // prevent duplicate components by suppressing preload when sources are the same

      if (sourceKey === preloadKey) {
        preloadKey = null;
      }

      return _react["default"].createElement(_react["default"].Fragment, null, sourceKey ? _react["default"].createElement(_Media.Media, Object.assign({}, rest, {
        className: _VideoPlayerModule["default"].video,
        controls: false,
        key: sourceKey,
        mediaComponent: mediaComponent,
        preload: "none",
        ref: this.setVideoRef,
        source: _react["default"].isValidElement(source) ? source : _react["default"].createElement("source", {
          src: source
        })
      })) : null, preloadKey ? _react["default"].createElement(_Media.Media, {
        autoPlay: false,
        className: _VideoPlayerModule["default"].preloadVideo,
        controls: false,
        key: preloadKey,
        mediaComponent: mediaComponent,
        onLoadStart: this.handlePreloadLoadStart,
        preload: "none",
        ref: this.setPreloadRef,
        source: _react["default"].isValidElement(preloadSource) ? preloadSource : _react["default"].createElement("source", {
          src: preloadSource
        })
      }) : null);
    }
  }]);

  return VideoBase;
}(_react["default"].Component), _class.displayName = 'Video', _class.propTypes =
/** @lends moonstone/VideoPlayer.Video.prototype */
{
  /**
   * Video plays automatically.
   *
   * @type {Boolean}
   * @default false
   * @public
   */
  autoPlay: _propTypes2["default"].bool,

  /**
   * Video component to use.
   *
   * The default (`'video'`) renders an `HTMLVideoElement`. Custom video components must have
   * a similar API structure, exposing the following APIs:
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
   * * `onPlay` - Sent when playback of the media starts after having been paused
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
   * @type {String|Component|Element}
   * @default 'video'
   * @public
   */
  mediaComponent: _propTypes["default"].renderableOverride,

  /**
   * The video source to be preloaded. Expects a `<source>` node.
   *
   * @type {Node}
   * @public
   */
  preloadSource: _propTypes2["default"].node,

  /**
   * Called with a reference to the active [Media]{@link ui/Media.Media} component.
   *
   * @type {Function}
   * @private
   */
  setMedia: _propTypes2["default"].func,

  /**
   * The video source to be played.
   *
   * Any children `<source>` elements will be sent directly to the `mediaComponent` as video
   * sources.
   *
   * See: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/source
   *
   * @type {Node}
   * @public
   */
  source: _propTypes2["default"].oneOfType([_propTypes2["default"].string, _propTypes2["default"].node])
}, _class.defaultProps = {
  mediaComponent: 'video'
}, _temp);
var VideoDecorator = (0, _compose["default"])((0, _ForwardRef["default"])({
  prop: 'setMedia'
}), (0, _Slottable["default"])({
  slots: ['source', 'preloadSource']
}));
/**
 * Provides support for more advanced video configurations for `VideoPlayer`.
 *
 * Custom Video Tag
 *
 * ```
 * <VideoPlayer>
 *   <Video mediaComponent="custom-video-element">
 *     <source src="path/to/source.mp4" />
 *   </Video>
 * </VideoPlayer>
 * ```
 *
 * Preload Video Source
 *
 * ```
 * <VideoPlayer>
 *   <Video>
 *     <source src="path/to/source.mp4" />
 *     <source src="path/to/preload-source.mp4" slot="preloadSource" />
 *   </Video>
 * </VideoPlayer>
 * ```
 *
 * @class Video
 * @mixes ui/Slottable
 * @memberof moonstone/VideoPlayer
 * @ui
 * @public
 */

var Video = VideoDecorator(VideoBase);
exports.Video = Video;
Video.defaultSlot = 'videoComponent';
var _default = Video;
exports["default"] = _default;