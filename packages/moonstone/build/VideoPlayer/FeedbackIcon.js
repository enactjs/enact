"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.FeedbackIconBase = exports.FeedbackIcon = exports["default"] = void 0;

var _kind = _interopRequireDefault(require("@enact/core/kind"));

var _react = _interopRequireDefault(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _Skinnable = _interopRequireDefault(require("../Skinnable"));

var _Icon = _interopRequireDefault(require("../Icon"));

var _FeedbackIcons = _interopRequireDefault(require("./FeedbackIcons.js"));

var _FeedbackModule = _interopRequireDefault(require("./Feedback.module.css"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _objectWithoutProperties(source, excluded) { if (source == null) return {}; var target = _objectWithoutPropertiesLoose(source, excluded); var key, i; if (Object.getOwnPropertySymbols) { var sourceSymbolKeys = Object.getOwnPropertySymbols(source); for (i = 0; i < sourceSymbolKeys.length; i++) { key = sourceSymbolKeys[i]; if (excluded.indexOf(key) >= 0) continue; if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue; target[key] = source[key]; } } return target; }

function _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }

/**
 * Feedback Icon for {@link moonstone/VideoPlayer.Feedback}.
 *
 * @class FeedbackIcon
 * @memberof moonstone/VideoPlayer
 * @ui
 * @private
 */
var FeedbackIconBase = (0, _kind["default"])({
  name: 'FeedbackIcon',
  propTypes:
  /** @lends moonstone/VideoPlayer.FeedbackIcon.prototype */
  {
    /**
     * Refers to one of the following possible media playback states.
     * `'play'`, `'pause'`, `'rewind'`, `'slowRewind'`, `'fastForward'`, `'slowForward'`,
     * `'jumpBackward'`, `'jumpForward'`, `'jumpToStart'`, `'jumpToEnd'`, `'stop'`.
     *
     * @type {String}
     * @public
     */
    children: _propTypes["default"].oneOf(Object.keys(_FeedbackIcons["default"]))
  },
  styles: {
    css: _FeedbackModule["default"],
    className: 'icon'
  },
  computed: {
    children: function children(_ref) {
      var _children = _ref.children;
      return _children && _FeedbackIcons["default"][_children] && _FeedbackIcons["default"][_children].icon;
    }
  },
  render: function render(_ref2) {
    var children = _ref2.children,
        rest = _objectWithoutProperties(_ref2, ["children"]);

    if (children) {
      return _react["default"].createElement(_Icon["default"], rest, children);
    }

    return null;
  }
});
exports.FeedbackIconBase = FeedbackIconBase;
var FeedbackIcon = (0, _Skinnable["default"])(FeedbackIconBase);
exports.FeedbackIcon = FeedbackIcon;
var _default = FeedbackIcon;
exports["default"] = _default;