"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.FeedbackContentBase = exports.FeedbackContent = exports["default"] = void 0;

var _kind = _interopRequireDefault(require("@enact/core/kind"));

var _onlyUpdateForKeys = _interopRequireDefault(require("recompose/onlyUpdateForKeys"));

var _react = _interopRequireDefault(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _Feedback = _interopRequireDefault(require("./Feedback"));

var _FeedbackIcons = _interopRequireDefault(require("./FeedbackIcons.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _objectWithoutProperties(source, excluded) { if (source == null) return {}; var target = _objectWithoutPropertiesLoose(source, excluded); var key, i; if (Object.getOwnPropertySymbols) { var sourceSymbolKeys = Object.getOwnPropertySymbols(source); for (i = 0; i < sourceSymbolKeys.length; i++) { key = sourceSymbolKeys[i]; if (excluded.indexOf(key) >= 0) continue; if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue; target[key] = source[key]; } } return target; }

function _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }

/**
 * FeedbackContent {@link moonstone/VideoPlayer}. This displays the media's playback rate and other
 * information.
 *
 * @class FeedbackContent
 * @memberof moonstone/VideoPlayer
 * @ui
 * @private
 */
var FeedbackContentBase = (0, _kind["default"])({
  name: 'FeedbackContent',
  propTypes:
  /** @lends moonstone/VideoPlayer.Feedback.prototype */
  {
    /**
     * If the current `playbackState` allows the feedback component's visibility to be changed,
     * the feedback component will be hidden. If not, setting this property will have no effect.
     * All `playbackState`s respond to this property except the following:
     * `'rewind'`, `'slowRewind'`, `'fastForward'`, `'slowForward'`.
     *
     * @type {Boolean}
     * @default true
     * @public
     */
    feedbackVisible: _propTypes["default"].bool,

    /**
     * Value of the feedback playback rate
     *
     * @type {String|Number}
     * @public
     */
    playbackRate: _propTypes["default"].oneOfType([_propTypes["default"].string, _propTypes["default"].number]),

    /**
     * Refers to one of the following possible media playback states.
     * `'play'`, `'pause'`, `'rewind'`, `'slowRewind'`, `'fastForward'`, `'slowForward'`,
     * `'jumpBackward'`, `'jumpForward'`, `'jumpToStart'`, `'jumpToEnd'`, `'stop'`.
     *
     * Each state understands where its related icon should be positioned, and whether it should
     * respond to changes to the `visible` property.
     *
     * This string feeds directly into {@link moonstone/FeedbackIcon.FeedbackIcon}.
     *
     * @type {String}
     * @public
     */
    playbackState: _propTypes["default"].oneOf(Object.keys(_FeedbackIcons["default"])),

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
    feedbackVisible: true,
    visible: true
  },
  render: function render(_ref) {
    var children = _ref.children,
        playbackRate = _ref.playbackRate,
        playbackState = _ref.playbackState,
        feedbackVisible = _ref.feedbackVisible,
        visible = _ref.visible,
        rest = _objectWithoutProperties(_ref, ["children", "playbackRate", "playbackState", "feedbackVisible", "visible"]);

    return _react["default"].createElement("div", Object.assign({}, rest, {
      style: !visible ? {
        display: 'none'
      } : null
    }), _react["default"].createElement(_Feedback["default"], {
      playbackState: playbackState,
      visible: feedbackVisible
    }, playbackRate), children);
  }
});
exports.FeedbackContentBase = FeedbackContentBase;
var FeedbackContent = (0, _onlyUpdateForKeys["default"])(['children', 'feedbackVisible', 'playbackRate', 'playbackState', 'visible'])(FeedbackContentBase);
exports.FeedbackContent = FeedbackContent;
var _default = FeedbackContent;
exports["default"] = _default;