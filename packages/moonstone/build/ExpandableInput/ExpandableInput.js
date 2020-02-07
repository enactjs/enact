"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ExpandableInputBase = exports.ExpandableInput = exports["default"] = void 0;

var _Changeable = _interopRequireDefault(require("@enact/ui/Changeable"));

var _handle = require("@enact/core/handle");

var _react = _interopRequireDefault(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _Pure = _interopRequireDefault(require("@enact/ui/internal/Pure"));

var _Pause = _interopRequireDefault(require("@enact/spotlight/Pause"));

var _Input = require("../Input");

var _ExpandableItem = require("../ExpandableItem");

var _ExpandableInputModule = _interopRequireDefault(require("./ExpandableInput.module.css"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _objectWithoutProperties(source, excluded) { if (source == null) return {}; var target = _objectWithoutPropertiesLoose(source, excluded); var key, i; if (Object.getOwnPropertySymbols) { var sourceSymbolKeys = Object.getOwnPropertySymbols(source); for (i = 0; i < sourceSymbolKeys.length; i++) { key = sourceSymbolKeys[i]; if (excluded.indexOf(key) >= 0) continue; if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue; target[key] = source[key]; } } return target; }

function _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

var handleDeactivate = (0, _handle.handle)((0, _handle.call)('shouldClose'), (0, _handle.adaptEvent)(function () {
  return {
    type: 'onClose'
  };
}, (0, _handle.forward)('onClose'))); // Special onKeyDown handle for up and down key events

var handleUpDown = (0, _handle.handle)( // prevent InputSpotlightDecorator from attempting to move focus up/down
_handle.preventDefault, // prevent Spotlight handling up/down since closing the expandable will spot the label
_handle.stopImmediate, // trigger close to resume spotlight and emit onClose
handleDeactivate);
/**
 * A stateless component that expands to render a {@link moonstone/Input.Input}.
 *
 * @class ExpandableInputBase
 * @memberof moonstone/ExpandableInput
 * @extends moonstone/ExpandableItem.ExpandableItemBase
 * @ui
 * @public
 */

var ExpandableInputBase =
/*#__PURE__*/
function (_React$Component) {
  _inherits(ExpandableInputBase, _React$Component);

  function ExpandableInputBase(props) {
    var _this;

    _classCallCheck(this, ExpandableInputBase);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(ExpandableInputBase).call(this, props));

    _this.resetValue = function () {
      _this.paused.resume();

      (0, _handle.forward)('onChange', {
        value: _this.state.initialValue
      }, _this.props);
    };

    _this.handleInputKeyDown = (0, _handle.oneOf)([(0, _handle.forKey)('up'), handleUpDown], [(0, _handle.forKey)('down'), handleUpDown], [(0, _handle.forKey)('left'), (0, _handle.forward)('onSpotlightLeft')], [(0, _handle.forKey)('right'), (0, _handle.forward)('onSpotlightRight')], [(0, _handle.forKey)('cancel'), _this.resetValue]).bind(_assertThisInitialized(_this));

    _this.handleActivate = function () {
      _this.paused.pause();
    };

    _this.handleChange = function (val) {
      return (0, _handle.forward)('onChange', val, _this.props);
    };

    _this.handleDown = function () {
      _this.pointer = true;
    };

    _this.handleOpen = (0, _handle.handle)((0, _handle.forward)('onOpen'), function (ev, _ref) {
      var value = _ref.value;
      return _this.setState({
        initialValue: value
      });
    }).bind(_assertThisInitialized(_this));

    _this.handleUp = function () {
      _this.pointer = false;
    };

    _this.calcClassName = function (className) {
      return className ? "".concat(_ExpandableInputModule["default"].expandableInput, " ").concat(className) : _ExpandableInputModule["default"].expandableInput;
    };

    _this.paused = new _Pause["default"]('ExpandableInput');
    _this.pointer = false;
    _this.state = {
      initialValue: props.value
    };
    _this.handleUpDown = handleUpDown.bind(_assertThisInitialized(_this));
    _this.handleDeactivate = handleDeactivate.bind(_assertThisInitialized(_this));
    return _this;
  }

  _createClass(ExpandableInputBase, [{
    key: "componentDidUpdate",
    value: function componentDidUpdate(prevProps) {
      if (prevProps.open && !this.props.open) {
        this.paused.resume();
      }
    }
  }, {
    key: "componentWillUnmount",
    value: function componentWillUnmount() {
      this.paused.resume();
    }
  }, {
    key: "calcAriaLabel",
    value: function calcAriaLabel() {
      var _this$props = this.props,
          noneText = _this$props.noneText,
          title = _this$props.title,
          type = _this$props.type,
          value = _this$props.value;
      var returnVal = type === 'password' ? value : value || noneText;
      return (0, _Input.calcAriaLabel)(title, type, returnVal);
    }
  }, {
    key: "calcLabel",
    value: function calcLabel() {
      var _this$props2 = this.props,
          noneText = _this$props2.noneText,
          type = _this$props2.type,
          value = _this$props2.value;

      if (type === 'password') {
        return null;
      } else {
        return value || noneText;
      }
    }
  }, {
    key: "shouldClose",
    value: function shouldClose() {
      return this.paused.resume() && !this.pointer;
    }
  }, {
    key: "render",
    value: function render() {
      var _this$props3 = this.props,
          className = _this$props3.className,
          disabled = _this$props3.disabled,
          iconAfter = _this$props3.iconAfter,
          iconBefore = _this$props3.iconBefore,
          open = _this$props3.open,
          placeholder = _this$props3.placeholder,
          spotlightDisabled = _this$props3.spotlightDisabled,
          type = _this$props3.type,
          value = _this$props3.value,
          rest = _objectWithoutProperties(_this$props3, ["className", "disabled", "iconAfter", "iconBefore", "open", "placeholder", "spotlightDisabled", "type", "value"]);

      var inputProps = (0, _Input.extractInputProps)(rest);
      delete rest.onChange;
      return _react["default"].createElement(_ExpandableItem.ExpandableItemBase, Object.assign({}, rest, {
        "aria-label": this.calcAriaLabel(),
        className: this.calcClassName(className),
        disabled: disabled,
        label: this.calcLabel(),
        onMouseDown: this.handleDown,
        onMouseLeave: this.handleUp,
        onMouseUp: this.handleUp,
        onOpen: this.handleOpen,
        open: open,
        showLabel: type === 'password' ? 'never' : 'auto',
        spotlightDisabled: spotlightDisabled
      }), _react["default"].createElement(_Input.Input, Object.assign({}, inputProps, {
        autoFocus: true,
        className: _ExpandableInputModule["default"].decorator,
        disabled: disabled,
        dismissOnEnter: true,
        iconAfter: iconAfter,
        iconBefore: iconBefore,
        onActivate: this.handleActivate,
        onChange: this.handleChange,
        onDeactivate: this.handleDeactivate,
        onKeyDown: this.handleInputKeyDown,
        placeholder: placeholder,
        spotlightDisabled: spotlightDisabled,
        type: type,
        value: value
      })));
    }
  }]);

  return ExpandableInputBase;
}(_react["default"].Component);
/**
 * A stateful component that expands to render a {@link moonstone/Input.Input}.
 *
 * By default, `ExpandableInput` maintains the state of its `value` property. Supply the
 * `defaultValue` property to control its initial value. If you wish to directly control updates
 * to the component, supply a value to `value` at creation time and update it in response to
 * `onChange` events.
 *
 * `ExpandableInput` is an expandable component and it maintains its open/closed state by default.
 * The initial state can be supplied using `defaultOpen`. In order to directly control the
 * open/closed state, supply a value for `open` at creation time and update its value in response to
 * `onClose`/`onOpen` events.
 *
 * @class ExpandableInput
 * @memberof moonstone/ExpandableInput
 * @extends moonstone/ExpandableInput.ExpandableInputBase
 * @mixes moonstone/ExpandableItem.Expandable
 * @mixes ui/Changeable.Changeable
 * @ui
 * @public
 */


exports.ExpandableInputBase = ExpandableInputBase;
ExpandableInputBase.displayName = 'ExpandableInput';
ExpandableInputBase.propTypes =
/** @lends moonstone/ExpandableInput.ExpandableInputBase.prototype */
{
  /**
   * The primary text of the item.
   *
   * @type {String}
   * @required
   * @public
   */
  title: _propTypes["default"].string.isRequired,

  /**
   * Disables ExpandableInput and the control becomes non-interactive.
   *
   * @type {Boolean}
   * @public
   */
  disabled: _propTypes["default"].bool,

  /**
   * The icon to be placed at the end of the input.
   *
   * @see {@link moonstone/Icon.Icon}
   * @type {String}
   * @public
   */
  iconAfter: _propTypes["default"].string,

  /**
   * The icon to be placed at the beginning of the input.
   *
   * @see {@link moonstone/Icon.Icon}
   * @type {String}
   * @public
   */
  iconBefore: _propTypes["default"].string,

  /**
   * Text to display when no `value` is set.
   *
   * @type {String}
   * @public
   */
  noneText: _propTypes["default"].string,

  /**
   * Called when the expandable value is changed.
   *
   * @type {Function}
   * @param {Object} event
   * @public
   */
  onChange: _propTypes["default"].func,

  /**
   * Called when a condition occurs which should cause the expandable to close.
   *
   * @type {Function}
   * @param {Object} event
   * @public
   */
  onClose: _propTypes["default"].func,

  /**
   * Called when the component is removed while retaining focus.
   *
   * @type {Function}
   * @param {Object} event
   * @public
   */
  onSpotlightDisappear: _propTypes["default"].func,

  /**
   * Called prior to focus leaving the expandable when the 5-way left key is pressed.
   *
   * @type {Function}
   * @param {Object} event
   * @public
   */
  onSpotlightLeft: _propTypes["default"].func,

  /**
   * Called prior to focus leaving the expandable when the 5-way right key is pressed.
   *
   * @type {Function}
   * @param {Object} event
   * @public
   */
  onSpotlightRight: _propTypes["default"].func,

  /**
   * Opens the control, with the contents visible.
   *
   * @type {Boolean}
   * @public
   */
  open: _propTypes["default"].bool,

  /**
   * The placeholder text to display.
   *
   * @type {String}
   * @see {@link moonstone/Input.Input#placeholder}
   * @public
   */
  placeholder: _propTypes["default"].string,

  /**
   * Disables spotlight navigation in the component.
   *
   * @type {Boolean}
   * @default false
   * @public
   */
  spotlightDisabled: _propTypes["default"].bool,

  /**
   * The type of input. Accepted values correspond to the standard HTML5 input types.
   *
   * @type {String}
   * @see {@link moonstone/Input.Input#type}
   * @public
   */
  type: _propTypes["default"].string,

  /**
   * The value of the input.
   *
   * @type {String|Number}
   * @see {@link moonstone/Input.Input#value}
   * @public
   */
  value: _propTypes["default"].oneOfType([_propTypes["default"].string, _propTypes["default"].number])
};
ExpandableInputBase.defaultProps = {
  spotlightDisabled: false
};
var ExpandableInput = (0, _Pure["default"])((0, _ExpandableItem.Expandable)({
  noPointerMode: true
}, (0, _Changeable["default"])(ExpandableInputBase)));
exports.ExpandableInput = ExpandableInput;
var _default = ExpandableInput;
exports["default"] = _default;