"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.AccessibilityDecorator = exports["default"] = void 0;

var _hoc = _interopRequireDefault(require("@enact/core/hoc"));

var _Registry = _interopRequireDefault(require("@enact/core/internal/Registry"));

var _Resizable = require("@enact/ui/Resizable");

var _propTypes = _interopRequireDefault(require("prop-types"));

var _react = _interopRequireDefault(require("react"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _objectWithoutProperties(source, excluded) { if (source == null) return {}; var target = _objectWithoutPropertiesLoose(source, excluded); var key, i; if (Object.getOwnPropertySymbols) { var sourceSymbolKeys = Object.getOwnPropertySymbols(source); for (i = 0; i < sourceSymbolKeys.length; i++) { key = sourceSymbolKeys[i]; if (excluded.indexOf(key) >= 0) continue; if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue; target[key] = source[key]; } } return target; }

function _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

/**
 * A higher-order component that classifies an application with a target set of font sizing rules.
 *
 * @class AccessibilityDecorator
 * @memberof moonstone/MoonstoneDecorator
 * @hoc
 * @public
 */
var AccessibilityDecorator = (0, _hoc["default"])(function (config, Wrapped) {
  var _class, _temp;

  // eslint-disable-line no-unused-vars
  return _temp = _class =
  /*#__PURE__*/
  function (_React$Component) {
    _inherits(_class, _React$Component);

    function _class() {
      var _getPrototypeOf2;

      var _this;

      _classCallCheck(this, _class);

      for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      _this = _possibleConstructorReturn(this, (_getPrototypeOf2 = _getPrototypeOf(_class)).call.apply(_getPrototypeOf2, [this].concat(args)));
      _this.resizeRegistry = _Registry["default"].create();
      return _this;
    }

    _createClass(_class, [{
      key: "componentDidMount",
      value: function componentDidMount() {
        this.resizeRegistry.parent = this.context;
      }
    }, {
      key: "componentDidUpdate",
      value: function componentDidUpdate(prevProps) {
        if (prevProps.textSize !== this.props.textSize) {
          this.resizeRegistry.notify({});
        }
      }
    }, {
      key: "componentWillUnmount",
      value: function componentWillUnmount() {
        this.resizeRegistry.parent = null;
      }
    }, {
      key: "render",
      value: function render() {
        var _this$props = this.props,
            className = _this$props.className,
            highContrast = _this$props.highContrast,
            textSize = _this$props.textSize,
            props = _objectWithoutProperties(_this$props, ["className", "highContrast", "textSize"]);

        var accessibilityClassName = highContrast ? "enact-a11y-high-contrast enact-text-".concat(textSize) : "enact-text-".concat(textSize);
        var combinedClassName = className ? "".concat(className, " ").concat(accessibilityClassName) : accessibilityClassName;
        var variants = {};
        if (highContrast) variants.highContrast = true;
        if (textSize === 'large') variants.largeText = true;
        return _react["default"].createElement(_Resizable.ResizeContext.Provider, {
          value: this.resizeRegistry.register
        }, _react["default"].createElement(Wrapped, Object.assign({
          className: combinedClassName,
          skinVariants: variants
        }, props)));
      }
    }]);

    return _class;
  }(_react["default"].Component), _class.contextType = _Resizable.ResizeContext, _class.displayName = 'AccessibilityDecorator', _class.propTypes =
  /** @lends moonstone/MoonstoneDecorator.AccessibilityDecorator.prototype */
  {
    /**
     * Enables additional features to help users visually differentiate components.
     *
     * The UI library will be responsible for using this information to adjust
     * the components' contrast to this preset.
     *
     * @type {Boolean}
     * @public
     */
    highContrast: _propTypes["default"].bool,

    /**
     * Sets the goal size of the text.
     *
     * The UI library will be responsible for using this
     * information to adjust the components' text sizes to this preset.
     * Current presets are `'normal'` (default), and `'large'`.
     *
     * @type {String}
     * @default 'normal'
     * @public
     */
    textSize: _propTypes["default"].oneOf(['normal', 'large'])
  }, _class.defaultProps = {
    highContrast: false,
    textSize: 'normal'
  }, _temp;
});
exports.AccessibilityDecorator = AccessibilityDecorator;
var _default = AccessibilityDecorator;
exports["default"] = _default;