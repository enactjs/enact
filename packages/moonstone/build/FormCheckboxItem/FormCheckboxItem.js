"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.FormCheckboxItemBase = exports.FormCheckboxItem = exports["default"] = void 0;

var _kind = _interopRequireDefault(require("@enact/core/kind"));

var _react = _interopRequireDefault(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _FormCheckbox = _interopRequireDefault(require("../FormCheckbox"));

var _ToggleItem = require("../ToggleItem");

var _FormCheckboxItemModule = _interopRequireDefault(require("./FormCheckboxItem.module.css"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _objectWithoutProperties(source, excluded) { if (source == null) return {}; var target = _objectWithoutPropertiesLoose(source, excluded); var key, i; if (Object.getOwnPropertySymbols) { var sourceSymbolKeys = Object.getOwnPropertySymbols(source); for (i = 0; i < sourceSymbolKeys.length; i++) { key = sourceSymbolKeys[i]; if (excluded.indexOf(key) >= 0) continue; if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue; target[key] = source[key]; } } return target; }

function _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }

/**
 * Renders a form item with a checkbox component. Useful to show a selected state on an item inside a form.
 *
 * @class FormCheckboxItem
 * @memberof moonstone/FormCheckboxItem
 * @extends moonstone/ToggleItem.ToggleItem
 * @omit iconComponent
 * @ui
 * @public
 */
var FormCheckboxItemBase = (0, _kind["default"])({
  name: 'FormCheckboxItem',
  propTypes:
  /** @lends moonstone/FormCheckboxItem.FormCheckboxItem.prototype */
  {
    /**
     * Customizes the component by mapping the supplied collection of CSS class names to the
     * corresponding internal Elements and states of this component.
     *
     * The following classes are supported:
     *
     * * `formCheckboxItem` - The root class name
     *
     * @type {Object}
     * @public
     */
    css: _propTypes["default"].object
  },
  styles: {
    css: _FormCheckboxItemModule["default"],
    className: 'formCheckboxItem',
    publicClassNames: ['formCheckboxItem']
  },
  render: function render(_ref) {
    var children = _ref.children,
        css = _ref.css,
        props = _objectWithoutProperties(_ref, ["children", "css"]);

    return _react["default"].createElement(_ToggleItem.ToggleItemBase, Object.assign({
      "data-webos-voice-intent": "SelectCheckItem"
    }, props, {
      css: css,
      iconComponent: _react["default"].createElement(_FormCheckbox["default"], {
        className: _FormCheckboxItemModule["default"].toggleIcon
      })
    }), children);
  }
});
exports.FormCheckboxItemBase = FormCheckboxItemBase;
var FormCheckboxItem = (0, _ToggleItem.ToggleItemDecorator)(FormCheckboxItemBase);
exports.FormCheckboxItem = FormCheckboxItem;
var _default = FormCheckboxItem;
exports["default"] = _default;