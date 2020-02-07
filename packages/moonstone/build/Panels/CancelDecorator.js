"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.CancelDecorator = exports["default"] = void 0;

var _hoc = _interopRequireDefault(require("@enact/core/hoc"));

var _Cancelable = _interopRequireDefault(require("@enact/ui/Cancelable"));

var _spotlight = _interopRequireDefault(require("@enact/spotlight"));

var _PanelsModule = _interopRequireDefault(require("./Panels.module.css"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var defaultConfig = {
  cancel: null
};
var CancelDecorator = (0, _hoc["default"])(defaultConfig, function (config, Wrapped) {
  var cancel = config.cancel;

  function handleCancel(ev, props) {
    var index = props.index,
        handler = props[cancel];

    if (index > 0 && handler && !document.querySelector(".".concat(_PanelsModule["default"].transitioning))) {
      // clear Spotlight focus
      var current = _spotlight["default"].getCurrent();

      if (current) {
        current.blur();
      }

      handler({
        index: index - 1
      });
      ev.stopPropagation();
    }
  }

  return (0, _Cancelable["default"])({
    modal: true,
    onCancel: handleCancel
  }, Wrapped);
});
exports.CancelDecorator = CancelDecorator;
var _default = CancelDecorator;
exports["default"] = _default;