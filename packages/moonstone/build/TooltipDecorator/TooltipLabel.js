"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.TooltipLabel = exports["default"] = void 0;

var _kind = _interopRequireDefault(require("@enact/core/kind"));

var _util = require("@enact/i18n/util");

var _react = _interopRequireDefault(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _TooltipModule = _interopRequireDefault(require("./Tooltip.module.css"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _objectWithoutProperties(source, excluded) { if (source == null) return {}; var target = _objectWithoutPropertiesLoose(source, excluded); var key, i; if (Object.getOwnPropertySymbols) { var sourceSymbolKeys = Object.getOwnPropertySymbols(source); for (i = 0; i < sourceSymbolKeys.length; i++) { key = sourceSymbolKeys[i]; if (excluded.indexOf(key) >= 0) continue; if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue; target[key] = source[key]; } } return target; }

function _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { _defineProperty(target, key, source[key]); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

/**
 * {@link moonstone/TooltipDecorator.TooltipLabel} is a stateless tooltip component with
 * Moonston styling applied.
 *
 * @class TooltipLabel
 * @memberof moonstone/TooltipDecorator
 * @ui
 * @private
 */
var TooltipLabel = (0, _kind["default"])({
  name: 'TooltipLabel',
  propTypes:
  /** @lends moonstone/TooltipDecorator.TooltipLabel.prototype */
  {
    /**
     * The node to be displayed as the main content of the tooltip.
     *
     * @type {Node}
     * @required
     */
    children: _propTypes["default"].node.isRequired,

    /**
     * The width of tooltip content in pixels (px). If the content goes over the given width,
     * then it will automatically wrap. When `null`, content does not wrap.
     *
     * @type {Number}
     * @public
     */
    width: _propTypes["default"].number
  },
  styles: {
    css: _TooltipModule["default"],
    className: 'tooltipLabel'
  },
  computed: {
    className: function className(_ref) {
      var width = _ref.width,
          styler = _ref.styler;
      return styler.append({
        multi: !!width
      });
    },
    style: function style(_ref2) {
      var children = _ref2.children,
          width = _ref2.width,
          _style = _ref2.style;
      return _objectSpread({}, _style, {
        direction: (0, _util.isRtlText)(children) ? 'rtl' : 'ltr',
        width: width
      });
    }
  },
  render: function render(_ref3) {
    var children = _ref3.children,
        rest = _objectWithoutProperties(_ref3, ["children"]);

    delete rest.width;
    return _react["default"].createElement("div", rest, children);
  }
});
exports.TooltipLabel = TooltipLabel;
var _default = TooltipLabel;
exports["default"] = _default;