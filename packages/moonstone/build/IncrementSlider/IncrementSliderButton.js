"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.IncrementSliderButtonBase = exports.IncrementSliderButton = exports["default"] = void 0;

var _kind = _interopRequireDefault(require("@enact/core/kind"));

var _IconButton = _interopRequireDefault(require("../IconButton"));

var _onlyUpdateForKeys = _interopRequireDefault(require("recompose/onlyUpdateForKeys"));

var _react = _interopRequireDefault(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _objectWithoutProperties(source, excluded) { if (source == null) return {}; var target = _objectWithoutPropertiesLoose(source, excluded); var key, i; if (Object.getOwnPropertySymbols) { var sourceSymbolKeys = Object.getOwnPropertySymbols(source); for (i = 0; i < sourceSymbolKeys.length; i++) { key = sourceSymbolKeys[i]; if (excluded.indexOf(key) >= 0) continue; if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue; target[key] = source[key]; } } return target; }

function _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }

/**
 * An [IconButton]{@link moonstone/IconButton.IconButton} customized for
 * [IncrementSlider]{@link moonstone/IncrementSlider.IncrementSlider}. It is optimized to only
 * update when `disabled` is changed to minimize unnecessary render cycles.
 *
 * @class IncrementSliderButton
 * @memberof moonstone/IncrementSlider
 * @ui
 * @private
 */
var IncrementSliderButtonBase = (0, _kind["default"])({
  name: 'IncrementSliderButton',
  propTypes:
  /** @lends moonstone/IncrementSlider.IncrementSliderButton.prototype */
  {
    onTap: _propTypes["default"].func
  },
  render: function render(_ref) {
    var onTap = _ref.onTap,
        rest = _objectWithoutProperties(_ref, ["onTap"]);

    return _react["default"].createElement(_IconButton["default"], Object.assign({}, rest, {
      backgroundOpacity: "transparent",
      onTap: onTap,
      onHold: onTap,
      onHoldPulse: onTap,
      size: "small"
    }));
  }
});
exports.IncrementSliderButtonBase = IncrementSliderButtonBase;
var OnlyUpdate = (0, _onlyUpdateForKeys["default"])(['children', 'disabled', 'spotlightDisabled', 'aria-label']);
var IncrementSliderButton = OnlyUpdate(IncrementSliderButtonBase);
exports.IncrementSliderButton = IncrementSliderButton;
var _default = IncrementSliderButton;
exports["default"] = _default;