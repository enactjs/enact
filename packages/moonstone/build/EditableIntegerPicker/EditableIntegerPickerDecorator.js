"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.EditableIntegerPickerDecorator = exports["default"] = void 0;

var _keymap = require("@enact/core/keymap");

var _handle = require("@enact/core/handle");

var _hoc = _interopRequireDefault(require("@enact/core/hoc"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _react = _interopRequireDefault(require("react"));

var _reactDom = _interopRequireDefault(require("react-dom"));

var _spotlight = _interopRequireDefault(require("@enact/spotlight"));

var _Pause = _interopRequireDefault(require("@enact/spotlight/Pause"));

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

(0, _keymap.addAll)({
  minus: [109, 189],
  numSet: [48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 96, 97, 98, 99, 100, 101, 102, 103, 104, 105],
  plus: 107
});
/**
 *{@link moonstone/EditableIntegerPicker.EditableIntegerPickerDecorator} is a higher-order component
 * which handles various functionalities of {@link moonstone/EditableIntegerPicker.EditableIntegerPicker}.
 *
 * @class EditableIntegerPickerDecorator
 * @memberof moonstone/EditableIntegerPicker
 * @hoc
 * @private
 */

var EditableIntegerPickerDecorator = (0, _hoc["default"])(function (config, Wrapped) {
  var _class, _temp;

  // eslint-disable-line no-unused-vars
  // Set-up event forwarding
  var forwardBlur = (0, _handle.forward)('onBlur');
  var forwardChange = (0, _handle.forward)('onChange');
  var forwardClick = (0, _handle.forward)('onClick');
  var forwardKeyDown = (0, _handle.forward)('onKeyDown');
  return _temp = _class =
  /*#__PURE__*/
  function (_React$Component) {
    _inherits(_class, _React$Component);

    function _class(props) {
      var _this;

      _classCallCheck(this, _class);

      _this = _possibleConstructorReturn(this, _getPrototypeOf(_class).call(this, props));

      _this.handleChange = function (ev) {
        if (!_this.state.isActive) {
          _this.setState({
            value: _this.validateValue(parseInt(ev.value)),
            noAnimation: false
          });
        }

        forwardChange(ev, _this.props);
      };

      _this.prepareInput = function () {
        _this.setState({
          isActive: true,
          noAnimation: true
        });

        _this.freezeSpotlight(true);
      };

      _this.handleClick = function (ev) {
        if (!_this.props.disabled && ev.type === 'click') {
          _this.prepareInput();
        }

        forwardClick(ev, _this.props);
      };

      _this.getInputNode = function (node) {
        if (node) {
          _this.inputNode = node;

          _this.inputNode.focus();
        }
      };

      _this.getPickerNode = function (node) {
        _this.pickerNode = _reactDom["default"].findDOMNode(node); // eslint-disable-line react/no-find-dom-node
      };

      _this.freezeSpotlight = function (freeze) {
        if (!freeze) {
          _this.paused.resume();
        } else {
          _this.paused.pause();
        }
      };

      _this.handleKeyDown = function (ev) {
        var keyCode = ev.keyCode;
        if (_this.props.disabled) return;

        if ((0, _keymap.is)('enter', keyCode) && !_this.state.isActive || (0, _keymap.is)('numSet', keyCode) && !_this.state.isActive || (0, _keymap.is)('plus', keyCode) || (0, _keymap.is)('minus', keyCode)) {
          _this.prepareInput();
        } else if (_this.state.isActive && ((0, _keymap.is)('enter', keyCode) || (0, _keymap.is)('cancel', keyCode) || (0, _keymap.is)('up', keyCode) || (0, _keymap.is)('down', keyCode))) {
          _this.handleBlur(ev);
        }

        forwardKeyDown(ev, _this.props);
      };

      _this.handleBlur = function (ev) {
        _this.setState({
          value: _this.validateValue(parseInt(ev.target.value)),
          isActive: false
        }, function () {
          _spotlight["default"].focus(_this.pickerNode);

          _this.freezeSpotlight(false);
        });

        forwardBlur(ev, _this.props);
      };

      _this.validateValue = function (value) {
        return value <= _this.props.max && value >= _this.props.min ? value : _this.state.value;
      };

      _this.paused = new _Pause["default"]('EditableIntegerPickerDecorator');
      _this.state = {
        isActive: false,
        value: props.value,
        // Animation is disabled on the picker when activating edit mode and enabled on the
        // next onChange event. The `noAnimation` prop takes precedence over this.
        noAnimation: false
      };
      return _this;
    }

    _createClass(_class, [{
      key: "render",
      value: function render() {
        return _react["default"].createElement(Wrapped, Object.assign({}, this.props, {
          editMode: this.state.isActive,
          inputRef: this.getInputNode,
          joined: true,
          noAnimation: this.props.noAnimation || this.state.noAnimation,
          onChange: this.handleChange,
          onPickerItemClick: this.handleClick,
          onInputBlur: this.handleBlur,
          onKeyDown: this.handleKeyDown,
          pickerRef: this.getPickerNode,
          value: this.state.value
        }));
      }
    }]);

    return _class;
  }(_react["default"].Component), _class.displayName = 'EditableIntegerPickerDecorator', _class.propTypes =
  /** @lends moonstone/EditableIntegerPicker.EditableIntegerPickerDecorator.prototype */
  {
    /**
    	* The maximum value selectable by the picker (inclusive).
    	*
    	* @type {Number}
    * @required
    	* @public
    	*/
    max: _propTypes["default"].number.isRequired,

    /**
     * The minimum value selectable by the picker (inclusive).
     *
     * @type {Number}
     * @required
     * @public
     */
    min: _propTypes["default"].number.isRequired,

    /**
     * Disables EditableIntegerPicker and does not generate `onChange`
     * [events]{@link /docs/developer-guide/glossary/#event}.
     *
     * @type {Boolean}
     * @public
     */
    disabled: _propTypes["default"].bool,

    /**
     * Disables transition animation.
     *
     * @type {Boolean}
     * @public
     */
    noAnimation: _propTypes["default"].bool,

    /**
     * The value displayed in the picker.
     *
     * @type {Number}
     * @default 0
     * @public
     */
    value: _propTypes["default"].number
  }, _class.defaultProps = {
    value: 0
  }, _temp;
});
exports.EditableIntegerPickerDecorator = EditableIntegerPickerDecorator;
var _default = EditableIntegerPickerDecorator;
exports["default"] = _default;