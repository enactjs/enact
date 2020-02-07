"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.SliderBehaviorDecorator = exports["default"] = void 0;

var _handle = require("@enact/core/handle");

var _hoc = _interopRequireDefault(require("@enact/core/hoc"));

var _platform = _interopRequireDefault(require("@enact/core/platform"));

var _Pause = _interopRequireDefault(require("@enact/spotlight/Pause"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _reactDom = require("react-dom");

var _react = _interopRequireDefault(require("react"));

var _$L = _interopRequireDefault(require("../internal/$L"));

var _utils = require("./utils");

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

var useHintOnActive = function useHintOnActive(_ref) {
  var active = _ref.active;
  return {
    useHintText: active
  };
};

var toggleActive = function toggleActive(_ref2) {
  var active = _ref2.active;
  return {
    active: !active
  };
};

var defaultConfig = {
  // FIXME: This is a compromise to maintain a single decorator for Slider and IncrementSlider
  // that handles both a consolidated focus state and spotlight directional event mgmt. When this
  // is unset (for Slider), this decorator will listen to onKeyDown and fire spotlight events.
  // When set (for IncrementSlider), it specifies the event that is passed down to trigger
  // spotlight events and also doesn't remove the spotlight directional callbacks from the props
  // so the Wrapped component can fire them manually or use the callback for the default behavior.
  emitSpotlightEvents: null
}; // Adds moonstone-specific slider behaviors
// * aria-valuetext handling
//   * use aria-valuetext when set
//   * defaults to current value
//   * onActivate, set to hint text
//   * on value change, reset to value or aria-valuetext
// * Spotlight
//   * Pause Spotlight when dragging to prevent spotlight from leaving when pointer enters another
//     component
//   * Forward directional spotlight events from slider
// * Managing focused state to show/hide tooltip

var SliderBehaviorDecorator = (0, _hoc["default"])(defaultConfig, function (config, Wrapped) {
  var _class, _temp;

  var emitSpotlightEvents = config.emitSpotlightEvents;
  return _temp = _class =
  /*#__PURE__*/
  function (_React$Component) {
    _inherits(_class, _React$Component);

    function _class(props) {
      var _this;

      _classCallCheck(this, _class);

      _this = _possibleConstructorReturn(this, _getPrototypeOf(_class).call(this, props));
      _this.paused = new _Pause["default"]();
      _this.handleActivate = _this.handleActivate.bind(_assertThisInitialized(_this));
      _this.handleBlur = _this.handleBlur.bind(_assertThisInitialized(_this));
      _this.handleDragEnd = _this.handleDragEnd.bind(_assertThisInitialized(_this));
      _this.handleDragStart = _this.handleDragStart.bind(_assertThisInitialized(_this));
      _this.handleFocus = _this.handleFocus.bind(_assertThisInitialized(_this));
      _this.handleSpotlightEvents = _this.handleSpotlightEvents.bind(_assertThisInitialized(_this));
      _this.bounds = {};
      _this.state = {
        active: false,
        dragging: false,
        focused: false,
        useHintText: false,
        prevValue: props.value
      };
      return _this;
    }

    _createClass(_class, [{
      key: "componentWillUnmount",
      value: function componentWillUnmount() {
        this.paused.resume();
      }
    }, {
      key: "getValueText",
      value: function getValueText() {
        var _this$props = this.props,
            ariaValueText = _this$props['aria-valuetext'],
            min = _this$props.min,
            orientation = _this$props.orientation,
            _this$props$value = _this$props.value,
            value = _this$props$value === void 0 ? min : _this$props$value;
        var useHintText = this.state.useHintText;
        var verticalHint = (0, _$L["default"])('change a value with up down button');
        var horizontalHint = (0, _$L["default"])('change a value with left right button');

        if (useHintText) {
          return orientation === 'horizontal' ? horizontalHint : verticalHint;
        }

        if (ariaValueText != null) {
          return ariaValueText;
        }

        return value;
      }
    }, {
      key: "focusSlider",
      value: function focusSlider() {
        var slider = (0, _reactDom.findDOMNode)(this); // eslint-disable-line react/no-find-dom-node

        if (slider.getAttribute('role') !== 'slider') {
          slider = slider.querySelector('[role="slider"]');
        }

        slider.focus();
      }
    }, {
      key: "handleActivate",
      value: function handleActivate() {
        (0, _handle.forward)('onActivate', {
          type: 'onActivate'
        }, this.props);
        this.setState(toggleActive);
        this.setState(useHintOnActive);
      }
    }, {
      key: "handleBlur",
      value: function handleBlur(ev) {
        (0, _handle.forward)('onBlur', ev, this.props);
        this.setState({
          focused: false
        });
      }
    }, {
      key: "handleDragStart",
      value: function handleDragStart() {
        // on platforms with a touchscreen, we want to focus slider when dragging begins
        if (_platform["default"].touchscreen) {
          this.focusSlider();
        }

        this.paused.pause();
        this.setState({
          dragging: true
        });
      }
    }, {
      key: "handleDragEnd",
      value: function handleDragEnd() {
        this.paused.resume();
        this.setState({
          dragging: false
        });
      }
    }, {
      key: "handleFocus",
      value: function handleFocus(ev) {
        (0, _handle.forward)('onFocus', ev, this.props);
        this.setState({
          focused: true
        });
      }
    }, {
      key: "handleSpotlightEvents",
      value: function handleSpotlightEvents(ev) {
        if (!emitSpotlightEvents) {
          (0, _handle.forward)('onKeyDown', ev, this.props);
        }

        (0, _utils.forwardSpotlightEvents)(ev, this.props);
      }
    }, {
      key: "render",
      value: function render() {
        var props = Object.assign({}, this.props);

        if (!emitSpotlightEvents) {
          // Remove spotlight props before hitting spottable since we've handled them uniquely
          delete props.onSpotlightLeft;
          delete props.onSpotlightRight;
          delete props.onSpotlightUp;
          delete props.onSpotlightDown;
          props.onKeyDown = this.handleSpotlightEvents;
        } else {
          props[emitSpotlightEvents] = this.handleSpotlightEvents;
        }

        return _react["default"].createElement(Wrapped, Object.assign({
          role: "slider"
        }, props, {
          active: this.state.active,
          "aria-valuetext": this.getValueText(),
          focused: this.state.focused || this.state.dragging,
          onActivate: this.handleActivate,
          onBlur: this.handleBlur,
          onDragStart: this.handleDragStart,
          onDragEnd: this.handleDragEnd,
          onFocus: this.handleFocus
        }));
      }
    }], [{
      key: "getDerivedStateFromProps",
      value: function getDerivedStateFromProps(props, state) {
        if (props.value !== state.prevValue) {
          return {
            useHintText: false,
            prevValue: props.value
          };
        }

        return null;
      }
    }]);

    return _class;
  }(_react["default"].Component), _class.displayName = 'SliderBehaviorDecorator', _class.propTypes = {
    'aria-valuetext': _propTypes["default"].oneOfType([_propTypes["default"].string, _propTypes["default"].number]),
    max: _propTypes["default"].number,
    min: _propTypes["default"].number,
    orientation: _propTypes["default"].string,
    value: _propTypes["default"].number
  }, _class.defaultProps = {
    max: 100,
    min: 0,
    orientation: 'horizontal'
  }, _temp;
});
exports.SliderBehaviorDecorator = SliderBehaviorDecorator;
var _default = SliderBehaviorDecorator;
exports["default"] = _default;