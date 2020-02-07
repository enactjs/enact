"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.CheckboxBase = exports.Checkbox = exports["default"] = void 0;

var _kind = _interopRequireDefault(require("@enact/core/kind"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _react = _interopRequireDefault(require("react"));

var _ToggleIcon = _interopRequireDefault(require("../ToggleIcon"));

var _Icon = _interopRequireDefault(require("@enact/ui/Icon"));

var _CheckboxModule = _interopRequireDefault(require("./Checkbox.module.css"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _objectWithoutProperties(source, excluded) { if (source == null) return {}; var target = _objectWithoutPropertiesLoose(source, excluded); var key, i; if (Object.getOwnPropertySymbols) { var sourceSymbolKeys = Object.getOwnPropertySymbols(source); for (i = 0; i < sourceSymbolKeys.length; i++) { key = sourceSymbolKeys[i]; if (excluded.indexOf(key) >= 0) continue; if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue; target[key] = source[key]; } } return target; }

function _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }

/**
 * A checkbox component, ready to use in Moonstone applications.
 *
 * `Checkbox` may be used independently to represent a toggleable state but is more commonly used as
 * part of [CheckboxItem]{@link moonstone/CheckboxItem}.
 *
 * Usage:
 * ```
 * <Checkbox selected />
 * ```
 *
 * @class Checkbox
 * @memberof moonstone/Checkbox
 * @extends moonstone/ToggleIcon.ToggleIcon
 * @ui
 * @public
 */
var CheckboxBase = (0, _kind["default"])({
  name: 'Checkbox',
  propTypes:
  /** @lends moonstone/Checkbox.Checkbox.prototype */
  {
    /**
     * The icon displayed when `selected`.
     *
     * @see {@link moonstone/Icon.Icon.children}
     * @type {String|Object}
     * @default	'check'
     * @public
     */
    children: _propTypes["default"].string
  },
  defaultProps: {
    children: 'check'
  },
  render: function render(_ref) {
    var children = _ref.children,
        rest = _objectWithoutProperties(_ref, ["children"]);

    return _react["default"].createElement(_ToggleIcon["default"], Object.assign({}, rest, {
      css: _CheckboxModule["default"],
      iconComponent: _Icon["default"]
    }), children);
  }
});
exports.CheckboxBase = exports.Checkbox = CheckboxBase;
var _default = CheckboxBase;
exports["default"] = _default;