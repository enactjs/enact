"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.I18nFontDecorator = exports["default"] = void 0;

var _hoc = _interopRequireDefault(require("@enact/core/hoc"));

var _i18n = _interopRequireDefault(require("@enact/i18n"));

var _react = _interopRequireDefault(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _fontGenerator = require("./fontGenerator");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

var I18nFontDecorator = (0, _hoc["default"])(function (config, Wrapped) {
  var _class, _temp;

  // eslint-disable-line no-unused-vars
  return _temp = _class =
  /*#__PURE__*/
  function (_React$Component) {
    _inherits(I18nDecorator, _React$Component);

    function I18nDecorator(props) {
      var _this;

      _classCallCheck(this, I18nDecorator);

      _this = _possibleConstructorReturn(this, _getPrototypeOf(I18nDecorator).call(this, props));
      _this.state = {
        locale: props.locale || _i18n["default"].getLocale()
      };
      return _this;
    }

    _createClass(I18nDecorator, [{
      key: "componentDidMount",
      value: function componentDidMount() {
        (0, _fontGenerator.fontOverrideGenerator)(this.state.locale);
      }
    }, {
      key: "componentDidUpdate",
      value: function componentDidUpdate(_, prevState) {
        if (prevState.locale !== this.state.locale) {
          (0, _fontGenerator.fontOverrideGenerator)(this.state.locale);
        }
      }
    }, {
      key: "render",
      value: function render() {
        return _react["default"].createElement(Wrapped, this.props);
      }
    }], [{
      key: "getDerivedStateFromProps",
      value: function getDerivedStateFromProps(props, state) {
        var locale = props.locale || _i18n["default"].getLocale();

        return locale !== state.locale ? {
          locale: locale
        } : null;
      }
    }]);

    return I18nDecorator;
  }(_react["default"].Component), _class.displayName = 'I18nFontDecorator', _class.propTypes = {
    locale: _propTypes["default"].string
  }, _temp;
});
exports.I18nFontDecorator = I18nFontDecorator;
var _default = I18nFontDecorator;
exports["default"] = _default;