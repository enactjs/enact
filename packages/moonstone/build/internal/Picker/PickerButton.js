"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.PickerButtonBase = exports.PickerButton = exports["default"] = void 0;

var _handle = require("@enact/core/handle");

var _kind = _interopRequireDefault(require("@enact/core/kind"));

var _react = _interopRequireDefault(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _MarqueeController = require("@enact/ui/Marquee/MarqueeController");

var _Pure = _interopRequireDefault(require("@enact/ui/internal/Pure"));

var _Touchable = _interopRequireDefault(require("@enact/ui/Touchable"));

var _Icon = _interopRequireDefault(require("../../Icon"));

var _IconButton = _interopRequireDefault(require("../../IconButton"));

var _PickerModule = _interopRequireDefault(require("./Picker.module.css"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _objectWithoutProperties(source, excluded) { if (source == null) return {}; var target = _objectWithoutPropertiesLoose(source, excluded); var key, i; if (Object.getOwnPropertySymbols) { var sourceSymbolKeys = Object.getOwnPropertySymbols(source); for (i = 0; i < sourceSymbolKeys.length; i++) { key = sourceSymbolKeys[i]; if (excluded.indexOf(key) >= 0) continue; if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue; target[key] = source[key]; } } return target; }

function _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }

var JoinedPickerButtonBase = (0, _kind["default"])({
  name: 'JoinedPickerButtonBase',
  propTypes: {
    disabled: _propTypes["default"].bool,
    icon: _propTypes["default"].oneOfType([_propTypes["default"].string, _propTypes["default"].object])
  },
  render: function render(_ref) {
    var disabled = _ref.disabled,
        icon = _ref.icon,
        rest = _objectWithoutProperties(_ref, ["disabled", "icon"]);

    return _react["default"].createElement("span", Object.assign({}, rest, {
      "data-webos-voice-intent": "Select",
      disabled: disabled
    }), _react["default"].createElement(_Icon["default"], {
      className: _PickerModule["default"].icon,
      disabled: disabled,
      size: "small"
    }, icon));
  }
});
var JoinedPickerButton = (0, _Touchable["default"])(JoinedPickerButtonBase);
var PickerButtonBase = (0, _kind["default"])({
  name: 'PickerButton',
  propTypes: {
    disabled: _propTypes["default"].bool,
    hidden: _propTypes["default"].bool,
    icon: _propTypes["default"].oneOfType([_propTypes["default"].string, _propTypes["default"].object]),
    joined: _propTypes["default"].bool,
    onSpotlightDisappear: _propTypes["default"].func,
    spotlightDisabled: _propTypes["default"].bool
  },
  styles: {
    css: _PickerModule["default"]
  },
  handlers: {
    onMouseEnter: (0, _handle.handle)((0, _handle.forward)('onMouseEnter'), function (ev, props, sync) {
      if (sync && sync.enter) {
        sync.enter(null);
      }
    }),
    onMouseLeave: (0, _handle.handle)((0, _handle.forward)('onMouseLeave'), function (ev, props, sync) {
      if (sync && sync.leave) {
        sync.leave(null);
      }
    })
  },
  computed: {
    className: function className(_ref2) {
      var hidden = _ref2.hidden,
          styler = _ref2.styler;
      return styler.append({
        hidden: hidden
      });
    }
  },
  render: function render(_ref3) {
    var disabled = _ref3.disabled,
        icon = _ref3.icon,
        joined = _ref3.joined,
        rest = _objectWithoutProperties(_ref3, ["disabled", "icon", "joined"]);

    delete rest.hidden;

    if (joined) {
      delete rest.onSpotlightDisappear;
      delete rest.spotlightDisabled;
      return _react["default"].createElement(JoinedPickerButton, Object.assign({}, rest, {
        icon: icon,
        disabled: disabled
      }));
    } else {
      return _react["default"].createElement(_IconButton["default"], Object.assign({}, rest, {
        backgroundOpacity: "transparent",
        disabled: disabled,
        size: "small"
      }), icon);
    }
  }
}); // This can be replaced with the kind config contextType when it's supported

exports.PickerButtonBase = PickerButtonBase;
PickerButtonBase.contextType = _MarqueeController.MarqueeControllerContext;
var PickerButton = (0, _Pure["default"])(PickerButtonBase);
exports.PickerButton = PickerButton;
var _default = PickerButton;
exports["default"] = _default;