"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.FormCheckboxBase = exports.FormCheckbox = exports["default"] = void 0;

var _kind = _interopRequireDefault(require("@enact/core/kind"));

var _react = _interopRequireDefault(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _ToggleIcon = _interopRequireDefault(require("../ToggleIcon"));

var _FormCheckboxModule = _interopRequireDefault(require("./FormCheckbox.module.css"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _objectWithoutProperties(source, excluded) { if (source == null) return {}; var target = _objectWithoutPropertiesLoose(source, excluded); var key, i; if (Object.getOwnPropertySymbols) { var sourceSymbolKeys = Object.getOwnPropertySymbols(source); for (i = 0; i < sourceSymbolKeys.length; i++) { key = sourceSymbolKeys[i]; if (excluded.indexOf(key) >= 0) continue; if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue; target[key] = source[key]; } } return target; }

function _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }

/**
 * A component that represents a Boolean state, and looks like a check mark in a circle.
 *
 * @class FormCheckbox
 * @memberof moonstone/FormCheckbox
 * @extends moonstone/ToggleIcon.ToggleIcon
 * @ui
 * @public
 */
var FormCheckboxBase = (0, _kind["default"])({
  name: 'FormCheckbox',
  propTypes:
  /** @lends moonstone/FormCheckbox.FormCheckbox.prototype */
  {
    /**
     * The icon to be shown when selected.
     *
     * May be specified as either:
     *
     * * A string that represents an icon from the [iconList]{@link ui/Icon.IconBase.iconList},
     * * An HTML entity string, Unicode reference or hex value (in the form '0x...'),
     * * A URL specifying path to an icon image, or
     * * An object representing a resolution independent resource (See {@link ui/resolution}).
     *
     * @type {String}
     * @public
     */
    children: _propTypes["default"].string,
    css: _propTypes["default"].object
  },
  defaultProps: {
    children: 'check'
  },
  styles: {
    css: _FormCheckboxModule["default"]
  },
  render: function render(_ref) {
    var children = _ref.children,
        css = _ref.css,
        rest = _objectWithoutProperties(_ref, ["children", "css"]);

    return _react["default"].createElement(_ToggleIcon["default"], Object.assign({}, rest, {
      css: css
    }), children);
  }
});
exports.FormCheckboxBase = exports.FormCheckbox = FormCheckboxBase;
var _default = FormCheckboxBase;
exports["default"] = _default;