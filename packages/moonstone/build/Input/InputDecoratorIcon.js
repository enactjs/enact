"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.InputDecoratorIconBase = exports.InputDecoratorIcon = exports["default"] = void 0;

var _kind = _interopRequireDefault(require("@enact/core/kind"));

var _onlyUpdateForKeys = _interopRequireDefault(require("recompose/onlyUpdateForKeys"));

var _react = _interopRequireDefault(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _Icon = _interopRequireDefault(require("../Icon"));

var _InputModule = _interopRequireDefault(require("./Input.module.css"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _objectWithoutProperties(source, excluded) { if (source == null) return {}; var target = _objectWithoutPropertiesLoose(source, excluded); var key, i; if (Object.getOwnPropertySymbols) { var sourceSymbolKeys = Object.getOwnPropertySymbols(source); for (i = 0; i < sourceSymbolKeys.length; i++) { key = sourceSymbolKeys[i]; if (excluded.indexOf(key) >= 0) continue; if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue; target[key] = source[key]; } } return target; }

function _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }

/**
 * The stateless functional base component for {@link moonstone/Input.InputDecoratorIcon}.
 *
 * @class InputDecoratorIconBase
 * @memberof moonstone/Input
 * @ui
 * @private
 */
var InputDecoratorIconBase = (0, _kind["default"])({
  name: 'InputDecoratorIcon',
  propTypes:
  /** @lends moonstone/Input.InputDecoratorIconBase.prototype */
  {
    /**
     * The position of the icon. Either `before` or `after`.
     *
     * @type {String}
     * @required
     */
    position: _propTypes["default"].oneOf(['before', 'after']).isRequired,

    /**
     * The icon to be displayed.
     *
     * @see {@link moonstone/Icon.Icon#children}
     * @type {String|Object}
     */
    children: _propTypes["default"].oneOfType([_propTypes["default"].string, _propTypes["default"].object])
  },
  styles: {
    css: _InputModule["default"],
    className: 'decoratorIcon'
  },
  computed: {
    className: function className(_ref) {
      var position = _ref.position,
          styler = _ref.styler;
      return styler.append('icon' + (position === 'before' ? 'Before' : 'After'));
    }
  },
  render: function render(_ref2) {
    var children = _ref2.children,
        rest = _objectWithoutProperties(_ref2, ["children"]);

    delete rest.position;
    return children ? _react["default"].createElement(_Icon["default"], rest, children) : null;
  }
});
/**
 * An icon displayed either before or after the input field of an {@link moonstone/Input.Input}.
 *
 * @class InputDecoratorIcon
 * @memberof moonstone/Input
 * @ui
 * @private
 */

exports.InputDecoratorIconBase = InputDecoratorIconBase;
var InputDecoratorIcon = (0, _onlyUpdateForKeys["default"])(['children', 'small'])(InputDecoratorIconBase);
exports.InputDecoratorIcon = InputDecoratorIcon;
var _default = InputDecoratorIcon;
exports["default"] = _default;