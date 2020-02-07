"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.FeedbackBase = exports.Feedback = exports["default"] = void 0;

var _kind = _interopRequireDefault(require("@enact/core/kind"));

var _onlyUpdateForKeys = _interopRequireDefault(require("recompose/onlyUpdateForKeys"));

var _react = _interopRequireDefault(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _FeedbackIcon = _interopRequireDefault(require("./FeedbackIcon"));

var _FeedbackIcons = _interopRequireDefault(require("./FeedbackIcons.js"));

var _FeedbackModule = _interopRequireDefault(require("./Feedback.module.css"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _objectWithoutProperties(source, excluded) { if (source == null) return {}; var target = _objectWithoutPropertiesLoose(source, excluded); var key, i; if (Object.getOwnPropertySymbols) { var sourceSymbolKeys = Object.getOwnPropertySymbols(source); for (i = 0; i < sourceSymbolKeys.length; i++) { key = sourceSymbolKeys[i]; if (excluded.indexOf(key) >= 0) continue; if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue; target[key] = source[key]; } } return target; }

function _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }

/**
 * Feedback {@link moonstone/VideoPlayer}. This displays the media's playback rate and other
 * information.
 *
 * @class Feedback
 * @memberof moonstone/VideoPlayer
 * @ui
 * @private
 */
var FeedbackBase = (0, _kind["default"])({
  name: 'Feedback',
  propTypes:
  /** @lends moonstone/VideoPlayer.Feedback.prototype */
  {
    children: _propTypes["default"].oneOfType([_propTypes["default"].string, _propTypes["default"].number]),

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
     * If the current `playbackState` allows this component's visibility to be changed,
     * this component will be hidden. If not, setting this property will have no effect.
     * All `playbackState`s respond to this property except the following:
     * `'rewind'`, `'slowRewind'`, `'fastForward'`, `'slowForward'`.
     *
     * @type {Boolean}
     * @default true
     * @public
     */
    visible: _propTypes["default"].bool
  },
  defaultProps: {
    visible: true
  },
  styles: {
    css: _FeedbackModule["default"],
    className: 'feedback'
  },
  computed: {
    className: function className(_ref) {
      var styler = _ref.styler,
          visible = _ref.visible;
      return styler.append({
        hidden: !visible
      });
    },
    children: function children(_ref2) {
      var _children = _ref2.children,
          s = _ref2.playbackState;

      if (_FeedbackIcons["default"][s]) {
        // Working with a known state, treat `children` as playbackRate
        if (_FeedbackIcons["default"][s].message && _children !== 1) {
          // `1` represents a playback rate of 1:1
          return _children.toString().replace(/^-/, '') + _FeedbackIcons["default"][s].message;
        }
      } else {
        // Custom Message
        return _children;
      }
    }
  },
  render: function render(_ref3) {
    var children = _ref3.children,
        playbackState = _ref3.playbackState,
        rest = _objectWithoutProperties(_ref3, ["children", "playbackState"]);

    delete rest.visible;
    return _react["default"].createElement("div", rest, _FeedbackIcons["default"][playbackState] && _FeedbackIcons["default"][playbackState].position === 'before' ? _react["default"].createElement(_FeedbackIcon["default"], null, playbackState) : null, children ? _react["default"].createElement("div", {
      className: _FeedbackModule["default"].message
    }, children) : null, _FeedbackIcons["default"][playbackState] && _FeedbackIcons["default"][playbackState].position === 'after' ? _react["default"].createElement(_FeedbackIcon["default"], null, playbackState) : null);
  }
});
exports.FeedbackBase = FeedbackBase;
var Feedback = (0, _onlyUpdateForKeys["default"])(['children', 'playbackState', 'visible'])(FeedbackBase);
exports.Feedback = Feedback;
var _default = Feedback;
exports["default"] = _default;