"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.SwitchBase = exports.Switch = exports["default"] = void 0;

var _kind = _interopRequireDefault(require("@enact/core/kind"));

var _react = _interopRequireDefault(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _ToggleIcon = _interopRequireDefault(require("../ToggleIcon"));

var _SwitchModule = _interopRequireDefault(require("./Switch.module.css"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _objectWithoutProperties(source, excluded) { if (source == null) return {}; var target = _objectWithoutPropertiesLoose(source, excluded); var key, i; if (Object.getOwnPropertySymbols) { var sourceSymbolKeys = Object.getOwnPropertySymbols(source); for (i = 0; i < sourceSymbolKeys.length; i++) { key = sourceSymbolKeys[i]; if (excluded.indexOf(key) >= 0) continue; if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue; target[key] = source[key]; } } return target; }

function _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }

/**
 * Renders the base level DOM structure of the component.
 *
 * @class Switch
 * @memberof moonstone/Switch
 * @extends moonstone/ToggleIcon.ToggleIcon
 * @ui
 * @public
 */
var SwitchBase = (0, _kind["default"])({
  name: 'Switch',
  propTypes:
  /** @lends moonstone/Switch.Switch.prototype */
  {
    children: _propTypes["default"].string,
    css: _propTypes["default"].object,

    /**
     * Disables animation.
     *
     * @type {Boolean}
     * @default false
     * @public
     */
    noAnimation: _propTypes["default"].bool
  },
  defaultProps: {
    children: 'circle',
    noAnimation: false
  },
  styles: {
    css: _SwitchModule["default"]
  },
  computed: {
    className: function className(_ref) {
      var noAnimation = _ref.noAnimation,
          styler = _ref.styler;
      return styler.append({
        animated: !noAnimation
      });
    }
  },
  render: function render(_ref2) {
    var children = _ref2.children,
        css = _ref2.css,
        rest = _objectWithoutProperties(_ref2, ["children", "css"]);

    delete rest.noAnimation;
    return _react["default"].createElement(_ToggleIcon["default"], Object.assign({}, rest, {
      css: css
    }), children);
  }
});
exports.SwitchBase = exports.Switch = SwitchBase;
var _default = SwitchBase;
exports["default"] = _default;