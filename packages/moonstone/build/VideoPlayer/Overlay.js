"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.OverlayBase = exports.Overlay = exports["default"] = void 0;

var _kind = _interopRequireDefault(require("@enact/core/kind"));

var _Touchable = _interopRequireDefault(require("@enact/ui/Touchable"));

var _onlyUpdateForKeys = _interopRequireDefault(require("recompose/onlyUpdateForKeys"));

var _react = _interopRequireDefault(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _VideoPlayerModule = _interopRequireDefault(require("./VideoPlayer.module.css"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

/**
 * Overlay {@link moonstone/VideoPlayer}. This covers the Video piece of the
 * {@link moonstone/VideoPlayer} to prevent unnecessary VideoPlayer repaints due to mouse-moves.
 * It also acts as a container for overlaid elements, like the {@link moonstone/Spinner}.
 *
 * @class Overlay
 * @memberof moonstone/VideoPlayer
 * @ui
 * @private
 */
var OverlayBase = (0, _kind["default"])({
  name: 'Overlay',
  propTypes:
  /** @lends moonstone/VideoPlayer.Overlay.prototype */
  {
    bottomControlsVisible: _propTypes["default"].bool,
    children: _propTypes["default"].node
  },
  styles: {
    css: _VideoPlayerModule["default"],
    className: 'overlay'
  },
  computed: {
    className: function className(_ref) {
      var bottomControlsVisible = _ref.bottomControlsVisible,
          styler = _ref.styler;
      return styler.append(_defineProperty({}, 'high-contrast-scrim', bottomControlsVisible));
    }
  },
  render: function render(props) {
    delete props.bottomControlsVisible;
    return _react["default"].createElement("div", props);
  }
});
exports.OverlayBase = OverlayBase;
var Overlay = (0, _onlyUpdateForKeys["default"])(['bottomControlsVisible', 'children'])((0, _Touchable["default"])(OverlayBase));
exports.Overlay = Overlay;
var _default = Overlay;
exports["default"] = _default;