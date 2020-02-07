"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ExpandablePickerDecorator = exports["default"] = void 0;

var _handle = require("@enact/core/handle");

var _hoc = _interopRequireDefault(require("@enact/core/hoc"));

var _react = _interopRequireDefault(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

var ExpandablePickerDecorator = (0, _hoc["default"])(function (config, Wrapped) {
  var _class, _temp;

  // eslint-disable-line no-unused-vars
  return _temp = _class =
  /*#__PURE__*/
  function (_React$Component) {
    _inherits(_class, _React$Component);

    function _class(props) {
      var _this;

      _classCallCheck(this, _class);

      _this = _possibleConstructorReturn(this, _getPrototypeOf(_class).call(this, props));
      _this.handle = _handle.handle.bind(_assertThisInitialized(_this));
      _this.handleOpen = _this.handle((0, _handle.forward)('onOpen'), function (ev, _ref) {
        var value = _ref.value;
        return _this.setState(function (state) {
          return state.value === value ? null : {
            value: value
          };
        });
      });

      _this.handlePick = function (ev) {
        _this.setState({
          value: ev.value
        });
      };

      _this.state = {
        value: props.value
      };
      return _this;
    }

    _createClass(_class, [{
      key: "render",
      value: function render() {
        var _ref2 = this.props.open ? this.state : this.props,
            value = _ref2.value;

        return _react["default"].createElement(Wrapped, Object.assign({}, this.props, {
          onOpen: this.handleOpen,
          onPick: this.handlePick,
          value: value
        }));
      }
    }]);

    return _class;
  }(_react["default"].Component), _class.displayName = 'ExpandablePickerDecorator', _class.propTypes = {
    open: _propTypes["default"].bool,
    value: _propTypes["default"].number
  }, _temp;
});
exports.ExpandablePickerDecorator = ExpandablePickerDecorator;
var _default = ExpandablePickerDecorator;
exports["default"] = _default;