"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.FeedbackTooltipBase = exports.FeedbackTooltip = exports["default"] = void 0;

var _kind = _interopRequireDefault(require("@enact/core/kind"));

var _ComponentOverride = _interopRequireDefault(require("@enact/ui/ComponentOverride"));

var _propTypes = _interopRequireDefault(require("@enact/core/internal/prop-types"));

var _propTypes2 = _interopRequireDefault(require("prop-types"));

var _react = _interopRequireDefault(require("react"));

var _onlyUpdateForKeys = _interopRequireDefault(require("recompose/onlyUpdateForKeys"));

var _Image = _interopRequireDefault(require("../Image"));

var _Skinnable = _interopRequireDefault(require("../Skinnable"));

var _FeedbackContent = _interopRequireDefault(require("./FeedbackContent"));

var _FeedbackIcons = _interopRequireDefault(require("./FeedbackIcons.js"));

var _util = require("./util");

var _FeedbackTooltipModule = _interopRequireDefault(require("./FeedbackTooltip.module.css"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _objectWithoutProperties(source, excluded) { if (source == null) return {}; var target = _objectWithoutPropertiesLoose(source, excluded); var key, i; if (Object.getOwnPropertySymbols) { var sourceSymbolKeys = Object.getOwnPropertySymbols(source); for (i = 0; i < sourceSymbolKeys.length; i++) { key = sourceSymbolKeys[i]; if (excluded.indexOf(key) >= 0) continue; if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue; target[key] = source[key]; } } return target; }

function _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }

/**
 * FeedbackTooltip {@link moonstone/VideoPlayer}. This displays the media's playback rate and
 * time information.
 *
 * @class FeedbackTooltip
 * @memberof moonstone/VideoPlayer
 * @ui
 * @private
 */
var FeedbackTooltipBase = (0, _kind["default"])({
  name: 'FeedbackTooltip',
  propTypes:
  /** @lends moonstone/VideoPlayer.FeedbackTooltip.prototype */
  {
    /**
     * Invoke action to display or hide tooltip.
     *
     * @type {String}
     * @default 'idle'
     */
    action: _propTypes2["default"].oneOf(['focus', 'blur', 'idle']),

    /**
     * Duration of the curent media in seconds
     *
     * @type {Number}
     * @default 0
     * @public
     */
    duration: _propTypes2["default"].number,

    /**
     * Instance of `NumFmt` to format the time
     *
     * @type {Objct}
     * @public
     */
    formatter: _propTypes2["default"].object,

    /**
     * If the current `playbackState` allows this component's visibility to be changed,
     * this component will be hidden. If not, setting this property will have no effect.
     * All `playbackState`s respond to this property except the following:
     * `'rewind'`, `'slowRewind'`, `'fastForward'`, `'slowForward'`.
     *
     * @type {Boolean}
     * @default false
     * @public
     */
    hidden: _propTypes2["default"].bool,

    /**
     * Part of the API required by `ui/Slider` but not used by FeedbackTooltip which only
     * supports horizontal orientation
     *
     * @type {String}
     * @private
     */
    orientation: _propTypes2["default"].string,

    /**
     * Value of the feedback playback rate
     *
     * @type {String|Number}
     * @public
     */
    playbackRate: _propTypes2["default"].oneOfType([_propTypes2["default"].string, _propTypes2["default"].number]),

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
    playbackState: _propTypes2["default"].oneOf(Object.keys(_FeedbackIcons["default"])),

    /**
     * A number between 0 and 1 representing the proportion of the `value` in terms of `min`
     * and `max` props of the slider
     *
     * @type {Boolean}
     * @public
     */
    proportion: _propTypes2["default"].number,

    /**
     * This component will be used instead of the built-in version. The internal thumbnail style
     * will be applied to this component. This component follows the same rules as the built-in
     * version; hiding and showing according to the state of `action`.
     *
     * This can be a tag name as a string, a rendered DOM node, a component, or a component
     * instance.
     *
     * @type {String|Component|Element}
     * @public
     */
    thumbnailComponent: _propTypes["default"].renderableOverride,

    /**
     * `true` if Slider knob is scrubbing.
     *
     * @type {Boolean}
     * @public
     */
    thumbnailDeactivated: _propTypes2["default"].bool,

    /**
     * Set a thumbnail image source to show on VideoPlayer's Slider knob. This is a standard
     * {@link moonstone/Image} component so it supports all of the same options for the `src`
     * property. If no `thumbnailSrc` is set, no tooltip will display.
     *
     * @type {String|Object}
     * @public
     */
    thumbnailSrc: _propTypes2["default"].oneOfType([_propTypes2["default"].string, _propTypes2["default"].object]),

    /**
     * Required by the interface for moonstone/Slider.tooltip but not used here
     *
     * @type {Boolean}
     * @default true
     * @public
     */
    visible: _propTypes2["default"].bool
  },
  defaultProps: {
    action: 'idle',
    thumbnailDeactivated: false,
    hidden: false
  },
  styles: {
    css: _FeedbackTooltipModule["default"],
    className: 'feedbackTooltip'
  },
  computed: {
    children: function children(_ref) {
      var _children = _ref.children,
          duration = _ref.duration,
          formatter = _ref.formatter;
      return (0, _util.secondsToTime)(_children * duration, formatter);
    },
    className: function className(_ref2) {
      var hidden = _ref2.hidden,
          s = _ref2.playbackState,
          proportion = _ref2.proportion,
          thumbnailDeactivated = _ref2.thumbnailDeactivated,
          styler = _ref2.styler;
      return styler.append({
        afterMidpoint: proportion > 0.5,
        hidden: hidden && _FeedbackIcons["default"][s] && _FeedbackIcons["default"][s].allowHide,
        thumbnailDeactivated: thumbnailDeactivated
      });
    },
    feedbackVisible: function feedbackVisible(_ref3) {
      var action = _ref3.action,
          playbackState = _ref3.playbackState;
      return (action !== 'focus' || action === 'idle') && !(action === 'blur' && playbackState === 'play');
    },
    thumbnailComponent: function thumbnailComponent(_ref4) {
      var action = _ref4.action,
          _thumbnailComponent = _ref4.thumbnailComponent,
          thumbnailSrc = _ref4.thumbnailSrc;

      if (action === 'focus') {
        if (_thumbnailComponent) {
          return _react["default"].createElement(_ComponentOverride["default"], {
            component: _thumbnailComponent,
            className: _FeedbackTooltipModule["default"].thumbnail
          });
        } else if (thumbnailSrc) {
          return _react["default"].createElement("div", {
            className: _FeedbackTooltipModule["default"].thumbnail
          }, _react["default"].createElement(_Image["default"], {
            src: thumbnailSrc,
            className: _FeedbackTooltipModule["default"].image
          }));
        }
      }
    }
  },
  render: function render(_ref5) {
    var children = _ref5.children,
        feedbackVisible = _ref5.feedbackVisible,
        playbackState = _ref5.playbackState,
        playbackRate = _ref5.playbackRate,
        thumbnailComponent = _ref5.thumbnailComponent,
        rest = _objectWithoutProperties(_ref5, ["children", "feedbackVisible", "playbackState", "playbackRate", "thumbnailComponent"]);

    delete rest.action;
    delete rest.duration;
    delete rest.formatter;
    delete rest.hidden;
    delete rest.orientation;
    delete rest.proportion;
    delete rest.thumbnailDeactivated;
    delete rest.thumbnailSrc;
    delete rest.visible;
    return _react["default"].createElement("div", rest, thumbnailComponent, _react["default"].createElement(_FeedbackContent["default"], {
      className: _FeedbackTooltipModule["default"].content,
      feedbackVisible: feedbackVisible,
      playbackRate: playbackRate,
      playbackState: playbackState
    }, children));
  }
});
exports.FeedbackTooltipBase = FeedbackTooltipBase;
var FeedbackTooltip = (0, _onlyUpdateForKeys["default"])(['action', 'children', 'hidden', 'playbackState', 'playbackRate', 'thumbnailComponent', 'thumbnailDeactivated', 'thumbnailSrc', 'visible'])((0, _Skinnable["default"])(FeedbackTooltipBase));
exports.FeedbackTooltip = FeedbackTooltip;
FeedbackTooltip.defaultSlot = 'tooltip';
var _default = FeedbackTooltip;
exports["default"] = _default;