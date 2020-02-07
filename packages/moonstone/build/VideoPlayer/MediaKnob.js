"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.MediaKnob = exports["default"] = void 0;

var _kind = _interopRequireDefault(require("@enact/core/kind"));

var _Slider = require("@enact/ui/Slider");

var _propTypes = _interopRequireDefault(require("prop-types"));

var _react = _interopRequireDefault(require("react"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _objectWithoutProperties(source, excluded) { if (source == null) return {}; var target = _objectWithoutPropertiesLoose(source, excluded); var key, i; if (Object.getOwnPropertySymbols) { var sourceSymbolKeys = Object.getOwnPropertySymbols(source); for (i = 0; i < sourceSymbolKeys.length; i++) { key = sourceSymbolKeys[i]; if (excluded.indexOf(key) >= 0) continue; if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue; target[key] = source[key]; } } return target; }

function _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { _defineProperty(target, key, source[key]); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

/**
 * Knob for the MediaSlider in {@link moonstone/VideoPlayer}.
 *
 * @class MediaKnob
 * @memberof moonstone/VideoPlayer
 * @ui
 * @private
 */
var MediaKnob = (0, _kind["default"])({
  name: 'MediaKnob',
  propTypes: {
    preview: _propTypes["default"].bool,
    previewProportion: _propTypes["default"].number,
    value: _propTypes["default"].number
  },
  computed: {
    style: function style(_ref) {
      var _style = _ref.style,
          preview = _ref.preview,
          previewProportion = _ref.previewProportion;

      if (!preview) {
        return _style;
      }

      return _objectSpread({}, _style, {
        '--ui-slider-proportion-end-knob': previewProportion
      });
    }
  },
  render: function render(_ref2) {
    var preview = _ref2.preview,
        previewProportion = _ref2.previewProportion,
        value = _ref2.value,
        rest = _objectWithoutProperties(_ref2, ["preview", "previewProportion", "value"]);

    if (preview) {
      value = previewProportion;
    }

    return _react["default"].createElement(_Slider.Knob, Object.assign({}, rest, {
      proportion: value,
      value: value
    }));
  }
});
exports.MediaKnob = MediaKnob;
var _default = MediaKnob;
exports["default"] = _default;