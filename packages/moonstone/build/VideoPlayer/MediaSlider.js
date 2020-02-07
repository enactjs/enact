"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.MediaSliderBase = exports.MediaSlider = exports["default"] = void 0;

var _kind = _interopRequireDefault(require("@enact/core/kind"));

var _react = _interopRequireDefault(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _Slider = _interopRequireDefault(require("../Slider"));

var _MediaKnob = _interopRequireDefault(require("./MediaKnob"));

var _MediaSliderDecorator = _interopRequireDefault(require("./MediaSliderDecorator"));

var _VideoPlayerModule = _interopRequireDefault(require("./VideoPlayer.module.css"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _objectWithoutProperties(source, excluded) { if (source == null) return {}; var target = _objectWithoutPropertiesLoose(source, excluded); var key, i; if (Object.getOwnPropertySymbols) { var sourceSymbolKeys = Object.getOwnPropertySymbols(source); for (i = 0; i < sourceSymbolKeys.length; i++) { key = sourceSymbolKeys[i]; if (excluded.indexOf(key) >= 0) continue; if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue; target[key] = source[key]; } } return target; }

function _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }

/**
 * The base component to render a customized [Slider]{@link moonstone/Slider.Slider} for use in
 * [VideoPlayer]{@link moonstone/VideoPlayer.VideoPlayer}.
 *
 * @class MediaSliderBase
 * @memberof moonstone/VideoPlayer
 * @ui
 * @private
 */
var MediaSliderBase = (0, _kind["default"])({
  name: 'MediaSlider',
  propTypes:
  /** @lends moonstone/VideoPlayer.MediaSliderBase.prototype */
  {
    /**
     * When `true`, the knob will expand. Note that Slider is a controlled
     * component. Changing the value would only affect pressed visual and
     * not the state.
     *
     * @type {Boolean}
     * @public
     */
    forcePressed: _propTypes["default"].bool,

    /**
     * Allow moving the knob via pointer or 5-way without emitting `onChange` events
     *
     * @type {Boolean}
     * @default false
     * @public
     */
    preview: _propTypes["default"].bool,

    /**
     * The position of the knob when in `preview` mode
     *
     * @type {Number}
     * @public
     */
    previewProportion: _propTypes["default"].number,

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
    preview: false,
    visible: true
  },
  styles: {
    css: _VideoPlayerModule["default"],
    className: 'sliderFrame'
  },
  computed: {
    className: function className(_ref) {
      var styler = _ref.styler,
          visible = _ref.visible;
      return styler.append({
        hidden: !visible
      });
    },
    sliderClassName: function sliderClassName(_ref2) {
      var styler = _ref2.styler,
          forcePressed = _ref2.forcePressed;
      return styler.join({
        pressed: forcePressed,
        mediaSlider: true
      });
    }
  },
  render: function render(_ref3) {
    var className = _ref3.className,
        preview = _ref3.preview,
        previewProportion = _ref3.previewProportion,
        sliderClassName = _ref3.sliderClassName,
        rest = _objectWithoutProperties(_ref3, ["className", "preview", "previewProportion", "sliderClassName"]);

    delete rest.forcePressed;
    delete rest.visible;
    return _react["default"].createElement("div", {
      className: className
    }, _react["default"].createElement(_Slider["default"], Object.assign({}, rest, {
      "aria-hidden": "true",
      className: sliderClassName,
      css: _VideoPlayerModule["default"],
      knobComponent: _react["default"].createElement(_MediaKnob["default"], {
        preview: preview,
        previewProportion: previewProportion
      }),
      max: 1,
      min: 0,
      step: 0.00001
    })));
  }
});
/**
 * A customized slider suitable for use within
 * [VideoPlayer]{@link moonstone/VideoPlayer.VideoPlayer}.
 *
 * @class MediaSlider
 * @memberof moonstone/VideoPlayer
 * @ui
 * @private
 */

exports.MediaSliderBase = MediaSliderBase;
var MediaSlider = (0, _MediaSliderDecorator["default"])(MediaSliderBase);
exports.MediaSlider = MediaSlider;
var _default = MediaSlider;
exports["default"] = _default;