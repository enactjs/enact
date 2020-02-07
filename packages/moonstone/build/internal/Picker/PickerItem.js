"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.PickerItemBase = exports.PickerItem = exports["default"] = void 0;

var _kind = _interopRequireDefault(require("@enact/core/kind"));

var _react = _interopRequireDefault(require("react"));

var _Marquee = _interopRequireDefault(require("../../Marquee"));

var _PickerModule = _interopRequireDefault(require("./Picker.module.css"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var PickerItemBase = (0, _kind["default"])({
  name: 'PickerItem',
  styles: {
    css: _PickerModule["default"],
    className: 'item'
  },
  render: function render(props) {
    return _react["default"].createElement(_Marquee["default"], Object.assign({}, props, {
      alignment: "center"
    }));
  }
});
exports.PickerItemBase = exports.PickerItem = PickerItemBase;
var _default = PickerItemBase;
exports["default"] = _default;