"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
Object.defineProperty(exports, "PickerItem", {
  enumerable: true,
  get: function get() {
    return _PickerItem2["default"];
  }
});
exports.Picker = exports["default"] = void 0;

var _handle = require("@enact/core/handle");

var _keymap = require("@enact/core/keymap");

var _platform = _interopRequireDefault(require("@enact/core/platform"));

var _util = require("@enact/core/util");

var _IdProvider = _interopRequireDefault(require("@enact/ui/internal/IdProvider"));

var _Touchable = _interopRequireDefault(require("@enact/ui/Touchable"));

var _ViewManager = require("@enact/ui/ViewManager");

var _spotlight = _interopRequireWildcard(require("@enact/spotlight"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _equals = _interopRequireDefault(require("ramda/src/equals"));

var _react = _interopRequireDefault(require("react"));

var _reactDom = _interopRequireDefault(require("react-dom"));

var _shouldUpdate = _interopRequireDefault(require("recompose/shouldUpdate"));

var _Skinnable = _interopRequireDefault(require("../../Skinnable"));

var _$L = _interopRequireDefault(require("../$L"));

var _validators = require("../validators");

var _util2 = require("../util");

var _PickerButton = _interopRequireDefault(require("./PickerButton"));

var _SpottablePicker = _interopRequireDefault(require("./SpottablePicker"));

var _PickerModule = _interopRequireDefault(require("./Picker.module.css"));

var _PickerItem2 = _interopRequireDefault(require("./PickerItem"));

var _class, _temp;

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj["default"] = obj; return newObj; } }

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

var holdConfig = {
  events: [{
    name: 'hold',
    time: 800
  }]
};
var isDown = (0, _keymap.is)('down');
var isLeft = (0, _keymap.is)('left');
var isRight = (0, _keymap.is)('right');
var isUp = (0, _keymap.is)('up');
var Div = (0, _Touchable["default"])('div');
var SpottableDiv = (0, _Touchable["default"])(_SpottablePicker["default"]);
var PickerViewManager = (0, _shouldUpdate["default"])(function (props, nextProps) {
  return props.index !== nextProps.index || !(0, _equals["default"])(props.children, nextProps.children);
})(_ViewManager.ViewManager);

var wrapRange = function wrapRange(min, max, value) {
  if (value > max) {
    return min;
  } else if (value < min) {
    return max;
  } else {
    return value;
  }
};

var selectIcon = function selectIcon(icon, v, h) {
  return function (props) {
    return props[icon] || (props.orientation === 'vertical' ? v : h);
  };
};

var selectIncIcon = selectIcon('incrementIcon', 'arrowlargeup', 'arrowlargeright');
var selectDecIcon = selectIcon('decrementIcon', 'arrowlargedown', 'arrowlargeleft'); // Set-up event forwarding

var forwardBlur = (0, _handle.forward)('onBlur'),
    forwardFocus = (0, _handle.forward)('onFocus'),
    forwardKeyDown = (0, _handle.forward)('onKeyDown'),
    forwardKeyUp = (0, _handle.forward)('onKeyUp'),
    forwardWheel = (0, _handle.forward)('onWheel');
/**
 * The base component for {@link moonstone/internal/Picker.Picker}.
 *
 * @class Picker
 * @memberof moonstone/internal/Picker
 * @ui
 * @private
 */

var PickerBase = (_temp = _class =
/*#__PURE__*/
function (_React$Component) {
  _inherits(PickerBase, _React$Component);

  function PickerBase(props) {
    var _this;

    _classCallCheck(this, PickerBase);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(PickerBase).call(this, props));

    _this.computeNextValue = function (delta) {
      var _this$props = _this.props,
          min = _this$props.min,
          max = _this$props.max,
          value = _this$props.value,
          wrap = _this$props.wrap;
      return wrap ? wrapRange(min, max, value + delta) : (0, _util.clamp)(min, max, value + delta);
    };

    _this.adjustDirection = function (dir) {
      return _this.props.reverse ? -dir : dir;
    };

    _this.hasReachedBound = function (delta) {
      var value = _this.props.value;
      return _this.computeNextValue(_this.adjustDirection(delta)) === value;
    };

    _this.updateValue = function (dir) {
      var _this$props2 = _this.props,
          disabled = _this$props2.disabled,
          onChange = _this$props2.onChange,
          step = _this$props2.step;
      dir = _this.adjustDirection(dir);

      _this.setTransitionDirection(dir);

      if (!disabled && onChange) {
        var value = _this.computeNextValue(dir * step);

        onChange({
          value: value
        });
      }
    };

    _this.handleBlur = function (ev) {
      forwardBlur(ev, _this.props);

      _this.setState({
        active: false
      });
    };

    _this.handleFocus = function (ev) {
      forwardFocus(ev, _this.props);

      _this.setState({
        active: true
      });
    };

    _this.setTransitionDirection = function (dir) {
      // change the transition direction based on the button press
      _this.reverseTransition = !(dir > 0);
    };

    _this.handleDecrement = function () {
      if (!_this.hasReachedBound(-_this.props.step)) {
        _this.updateValue(-1);

        _this.setPressedState(-1);
      }
    };

    _this.handleIncrement = function () {
      if (!_this.hasReachedBound(_this.props.step)) {
        _this.updateValue(1);

        _this.setPressedState(1);
      }
    };

    _this.setPressedState = function (pressed) {
      var joined = _this.props.joined;

      if (joined) {
        _this.setState({
          pressed: pressed
        });
      }
    };

    _this.clearPressedState = function () {
      _this.pickerButtonPressed = 0;

      _this.setState({
        pressed: 0
      });
    };

    _this.emulateMouseUp = new _util.Job(_this.clearPressedState, 175);

    _this.handleUp = function () {
      if (_this.props.joined && (_this.pickerButtonPressed !== 0 || _this.state.pressed !== 0)) {
        _this.emulateMouseUp.start();
      }
    };

    _this.handleDown = function () {
      var joined = _this.props.joined;

      if (joined && _this.pickerButtonPressed === 1) {
        _this.handleIncrement();

        _this.emulateMouseUp.start();
      } else if (joined && _this.pickerButtonPressed === -1) {
        _this.handleDecrement();

        _this.emulateMouseUp.start();
      }
    };

    _this.handleIncDown = function () {
      _this.pickerButtonPressed = true;

      _this.handleIncrement();
    };

    _this.handleWheel = function (ev) {
      var step = _this.props.step;
      forwardWheel(ev, _this.props);

      var isContainerSpotted = _this.containerRef === _spotlight["default"].getCurrent();

      if (isContainerSpotted) {
        var dir = -Math.sign(ev.deltaY); // We'll sometimes get a 0/-0 wheel event we need to ignore or the wheel event has reached
        // the bounds of the picker

        if (dir && !_this.hasReachedBound(step * dir)) {
          // fire the onChange event
          if (dir > 0) {
            _this.throttleWheelInc.throttle();
          } else if (dir < 0) {
            _this.throttleWheelDec.throttle();
          } // simulate mouse down


          _this.setPressedState(dir); // set a timer to simulate the mouse up


          _this.emulateMouseUp.start(); // prevent the default scroll behavior to avoid bounce back


          ev.preventDefault();
          ev.stopPropagation();
        }
      }
    };

    _this.throttleWheelInc = new _util.Job(_this.handleIncrement, 100);
    _this.throttleWheelDec = new _util.Job(_this.handleDecrement, 100);

    _this.setDecPickerButtonPressed = function () {
      _this.pickerButtonPressed = -1;
    };

    _this.setIncPickerButtonPressed = function () {
      _this.pickerButtonPressed = 1;
    };

    _this.handleHoldPulse = function () {
      var joined = _this.props.joined;

      if (joined && _this.pickerButtonPressed === 1) {
        _this.handleIncrement();
      } else if (joined && _this.pickerButtonPressed === -1) {
        _this.handleDecrement();
      }
    };

    _this.handleKeyDown = function (ev) {
      var _this$props3 = _this.props,
          joined = _this$props3.joined,
          onSpotlightDown = _this$props3.onSpotlightDown,
          onSpotlightLeft = _this$props3.onSpotlightLeft,
          onSpotlightRight = _this$props3.onSpotlightRight,
          onSpotlightUp = _this$props3.onSpotlightUp,
          orientation = _this$props3.orientation;
      var keyCode = ev.keyCode;
      forwardKeyDown(ev, _this.props);

      if (joined && !_this.props.disabled) {
        var direction = (0, _spotlight.getDirection)(keyCode);
        var directions = {
          up: _this.setIncPickerButtonPressed,
          down: _this.setDecPickerButtonPressed,
          right: _this.setIncPickerButtonPressed,
          left: _this.setDecPickerButtonPressed
        };
        var isVertical = orientation === 'vertical' && (isUp(keyCode) || isDown(keyCode));
        var isHorizontal = orientation === 'horizontal' && (isRight(keyCode) || isLeft(keyCode));

        if (isVertical || isHorizontal) {
          directions[direction]();
        } else if (orientation === 'horizontal' && isDown(keyCode) && onSpotlightDown) {
          onSpotlightDown(ev);
        } else if (orientation === 'horizontal' && isUp(keyCode) && onSpotlightUp) {
          onSpotlightUp(ev);
        } else if (orientation === 'vertical' && isLeft(keyCode) && onSpotlightLeft) {
          onSpotlightLeft(ev);
        } else if (orientation === 'vertical' && isRight(keyCode) && onSpotlightRight) {
          onSpotlightRight(ev);
        }
      }
    };

    _this.handleKeyUp = function (ev) {
      var _this$props4 = _this.props,
          joined = _this$props4.joined,
          orientation = _this$props4.orientation;
      var keyCode = ev.keyCode;
      forwardKeyUp(ev, _this.props);

      if (joined && !_this.props.disabled) {
        var isVertical = orientation === 'vertical' && (isUp(keyCode) || isDown(keyCode));
        var isHorizontal = orientation === 'horizontal' && (isRight(keyCode) || isLeft(keyCode));

        if (isVertical || isHorizontal) {
          _this.pickerButtonPressed = 0;
        }
      }
    };

    _this.handleDecKeyDown = function (ev) {
      var keyCode = ev.keyCode;
      var direction = (0, _spotlight.getDirection)(keyCode);

      if (direction) {
        var _this$props5 = _this.props,
            orientation = _this$props5.orientation,
            step = _this$props5.step;

        if (!_this.hasReachedBound(step) && (isRight(keyCode) && orientation === 'horizontal' || isUp(keyCode) && orientation === 'vertical')) {
          ev.preventDefault(); // prevent default spotlight behavior

          (0, _handle.stopImmediate)(ev); // set the pointer mode to false on keydown

          _spotlight["default"].setPointerMode(false);

          _spotlight["default"].focus(_this.containerRef.querySelector(".".concat(_PickerModule["default"].incrementer)));
        } else {
          (0, _handle.forward)("onSpotlight".concat((0, _util.cap)(direction)), ev, _this.props);
        }
      }
    };

    _this.handleIncKeyDown = function (ev) {
      var keyCode = ev.keyCode;
      var direction = (0, _spotlight.getDirection)(keyCode);

      if (direction) {
        var _this$props6 = _this.props,
            orientation = _this$props6.orientation,
            step = _this$props6.step;

        if (!_this.hasReachedBound(step * -1) && (isLeft(keyCode) && orientation === 'horizontal' || isDown(keyCode) && orientation === 'vertical')) {
          ev.preventDefault(); // prevent default spotlight behavior

          (0, _handle.stopImmediate)(ev); // set the pointer mode to false on keydown

          _spotlight["default"].setPointerMode(false);

          _spotlight["default"].focus(_this.containerRef.querySelector(".".concat(_PickerModule["default"].decrementer)));
        } else {
          (0, _handle.forward)("onSpotlight".concat((0, _util.cap)(direction)), ev, _this.props);
        }
      }
    };

    _this.handleVoice = function (ev) {
      var voiceIndex = ev && ev.detail && typeof ev.detail.matchedIndex !== 'undefined' && Number(ev.detail.matchedIndex);

      if (Number.isInteger(voiceIndex)) {
        var _this$props7 = _this.props,
            max = _this$props7.max,
            min = _this$props7.min,
            onChange = _this$props7.onChange,
            value = _this$props7.value;
        var voiceValue = min + voiceIndex;

        if (onChange && voiceValue >= min && voiceValue <= max && voiceValue !== value) {
          onChange({
            value: voiceValue
          });
          ev.preventDefault();
        }
      }
    };

    _this.state = {
      // Set to `true` onFocus and `false` onBlur to prevent setting aria-valuetext (which
      // will notify the user) when the component does not have focus
      active: false,
      pressed: 0
    };
    _this.initContainerRef = _this.initRef('containerRef'); // Pressed state for this.handleUp

    _this.pickerButtonPressed = 0;
    return _this;
  }

  _createClass(PickerBase, [{
    key: "componentDidMount",
    value: function componentDidMount() {
      if (this.props.joined) {
        this.containerRef.addEventListener('wheel', this.handleWheel);
      }

      if (_platform["default"].webos) {
        this.containerRef.addEventListener('webOSVoice', this.handleVoice);
      }
    }
  }, {
    key: "componentDidUpdate",
    value: function componentDidUpdate(prevProps) {
      if (this.props.joined && !prevProps.joined) {
        this.containerRef.addEventListener('wheel', this.handleWheel);
      } else if (prevProps.joined && !this.props.joined) {
        this.containerRef.removeEventListener('wheel', this.handleWheel);
      }
    }
  }, {
    key: "componentWillUnmount",
    value: function componentWillUnmount() {
      this.emulateMouseUp.stop();
      this.throttleWheelInc.stop();
      this.throttleWheelDec.stop();

      if (this.props.joined) {
        this.containerRef.removeEventListener('wheel', this.handleWheel);
      }

      if (_platform["default"].webos) {
        this.containerRef.removeEventListener('webOSVoice', this.handleVoice);
      }
    }
  }, {
    key: "determineClasses",
    value: function determineClasses(decrementerDisabled, incrementerDisabled) {
      var _this$props8 = this.props,
          joined = _this$props8.joined,
          orientation = _this$props8.orientation,
          width = _this$props8.width;
      var pressed = this.state.pressed;
      return [_PickerModule["default"].picker, _PickerModule["default"][orientation], _PickerModule["default"][width], joined ? _PickerModule["default"].joined : null, !decrementerDisabled && pressed === -1 ? _PickerModule["default"].decrementing : null, !incrementerDisabled && pressed === 1 ? _PickerModule["default"].incrementing : null, this.props.className].join(' ');
    }
  }, {
    key: "calcValueText",
    value: function calcValueText() {
      var _this$props9 = this.props,
          accessibilityHint = _this$props9.accessibilityHint,
          children = _this$props9.children,
          index = _this$props9.index,
          value = _this$props9.value;
      var valueText = value; // Sometimes this.props.value is not equal to node text content. For example, when `PM`
      // is shown in AM/PM picker, its value is `1` and its node.textContent is `PM`. In this
      // case, Screen readers should read `PM` instead of `1`.

      if (children && Array.isArray(children)) {
        valueText = children[index] ? children[index].props.children : value;
      } else if (children && children.props && !children.props.children) {
        valueText = children.props.children;
      }

      if (accessibilityHint) {
        valueText = "".concat(valueText, " ").concat(accessibilityHint);
      }

      return valueText;
    }
  }, {
    key: "calcButtonLabel",
    value: function calcButtonLabel(next, valueText) {
      var _this$props10 = this.props,
          decrementAriaLabel = _this$props10.decrementAriaLabel,
          incrementAriaLabel = _this$props10.incrementAriaLabel;
      var label = next ? incrementAriaLabel : decrementAriaLabel;

      if (label != null) {
        return label;
      }

      return "".concat(valueText, " ").concat(next ? (0, _$L["default"])('next item') : (0, _$L["default"])('previous item'));
    }
  }, {
    key: "calcDecrementLabel",
    value: function calcDecrementLabel(valueText) {
      return !this.props.joined ? this.calcButtonLabel(this.props.reverse, valueText) : null;
    }
  }, {
    key: "calcIncrementLabel",
    value: function calcIncrementLabel(valueText) {
      return !this.props.joined ? this.calcButtonLabel(!this.props.reverse, valueText) : null;
    }
  }, {
    key: "calcAriaLabel",
    value: function calcAriaLabel(valueText) {
      var _this$props11 = this.props,
          ariaLabel = _this$props11['aria-label'],
          joined = _this$props11.joined,
          orientation = _this$props11.orientation,
          hint = orientation === 'horizontal' ? (0, _$L["default"])('change a value with left right button') : (0, _$L["default"])('change a value with up down button');

      if (!joined || ariaLabel != null) {
        return ariaLabel;
      }

      return "".concat(valueText, " ").concat(hint);
    }
  }, {
    key: "initRef",
    value: function initRef(prop) {
      var _this2 = this;

      return function (ref) {
        // need a way, for now, to get a DOM node ref ~and~ use onUp. Likely should rework the
        // wheel handler to avoid this requirement
        // eslint-disable-next-line react/no-find-dom-node
        _this2[prop] = ref && _reactDom["default"].findDOMNode(ref);
      };
    }
  }, {
    key: "render",
    value: function render() {
      var active = this.state.active;

      var _this$props12 = this.props,
          ariaValueText = _this$props12['aria-valuetext'],
          children = _this$props12.children,
          disabled = _this$props12.disabled,
          id = _this$props12.id,
          index = _this$props12.index,
          joined = _this$props12.joined,
          max = _this$props12.max,
          min = _this$props12.min,
          onSpotlightDisappear = _this$props12.onSpotlightDisappear,
          orientation = _this$props12.orientation,
          reverse = _this$props12.reverse,
          spotlightDisabled = _this$props12.spotlightDisabled,
          step = _this$props12.step,
          value = _this$props12.value,
          width = _this$props12.width,
          rest = _objectWithoutProperties(_this$props12, ["aria-valuetext", "children", "disabled", "id", "index", "joined", "max", "min", "onSpotlightDisappear", "orientation", "reverse", "spotlightDisabled", "step", "value", "width"]);

      var voiceProps = (0, _util2.extractVoiceProps)(rest);
      var voiceLabelsExt = voiceProps['data-webos-voice-labels-ext'];
      delete voiceProps['data-webos-voice-label'];
      delete voiceProps['data-webos-voice-labels'];
      delete voiceProps['data-webos-voice-labels-ext'];

      if (process.env.NODE_ENV !== "production") {
        (0, _validators.validateRange)(value, min, max, PickerBase.displayName);
        (0, _validators.validateStepped)(value, min, step, PickerBase.displayName);
        (0, _validators.validateStepped)(max, min, step, PickerBase.displayName, 'max');
      }

      delete rest['aria-label'];
      delete rest.accessibilityHint;
      delete rest.decrementAriaLabel;
      delete rest.decrementIcon;
      delete rest.incrementAriaLabel;
      delete rest.incrementIcon;
      delete rest.noAnimation;
      delete rest.onChange;
      delete rest.onSpotlightDown;
      delete rest.onSpotlightLeft;
      delete rest.onSpotlightRight;
      delete rest.onSpotlightUp;
      delete rest.wrap;
      var incrementIcon = selectIncIcon(this.props);
      var decrementIcon = selectDecIcon(this.props);
      var reachedStart = this.hasReachedBound(step * -1);
      var decrementerDisabled = disabled || reachedStart;
      var reachedEnd = this.hasReachedBound(step);
      var incrementerDisabled = disabled || reachedEnd;
      var classes = this.determineClasses(decrementerDisabled, incrementerDisabled);
      var arranger = orientation === 'vertical' ? _ViewManager.SlideTopArranger : _ViewManager.SlideLeftArranger;
      var noAnimation = this.props.noAnimation || disabled;
      var sizingPlaceholder = null;

      if (typeof width === 'number' && width > 0) {
        sizingPlaceholder = _react["default"].createElement("div", {
          "aria-hidden": true,
          className: _PickerModule["default"].sizingPlaceholder
        }, '0'.repeat(width));
      }

      var valueText = ariaValueText != null ? ariaValueText : this.calcValueText();
      var decrementerAriaControls = !incrementerDisabled ? id : null;
      var incrementerAriaControls = !decrementerDisabled ? id : null;
      var spottablePickerProps = {};
      var Component;

      if (joined) {
        Component = SpottableDiv;
        spottablePickerProps.onSpotlightDisappear = onSpotlightDisappear;
        spottablePickerProps.orientation = orientation;
        spottablePickerProps.spotlightDisabled = spotlightDisabled;
      } else {
        Component = Div;
      }

      return _react["default"].createElement(Component, Object.assign({}, voiceProps, rest, {
        "aria-controls": joined ? id : null,
        "aria-disabled": disabled,
        "aria-label": this.calcAriaLabel(valueText),
        className: classes,
        "data-webos-voice-intent": "Select",
        "data-webos-voice-labels-ext": voiceLabelsExt,
        disabled: disabled,
        holdConfig: holdConfig,
        onBlur: this.handleBlur,
        onDown: this.handleDown,
        onFocus: this.handleFocus,
        onHoldPulse: this.handleHoldPulse,
        onKeyDown: this.handleKeyDown,
        onKeyUp: this.handleKeyUp,
        onUp: this.handleUp,
        onMouseLeave: this.clearPressedState,
        ref: this.initContainerRef
      }, spottablePickerProps), _react["default"].createElement(_PickerButton["default"], Object.assign({}, voiceProps, {
        "aria-controls": !joined ? incrementerAriaControls : null,
        "aria-label": this.calcIncrementLabel(valueText),
        className: _PickerModule["default"].incrementer,
        "data-webos-voice-label": joined ? this.calcButtonLabel(!reverse, valueText) : null,
        disabled: incrementerDisabled,
        hidden: reachedEnd,
        holdConfig: holdConfig,
        icon: incrementIcon,
        joined: joined,
        onDown: this.handleIncrement,
        onHoldPulse: this.handleIncrement,
        onKeyDown: this.handleIncKeyDown,
        onSpotlightDisappear: onSpotlightDisappear,
        spotlightDisabled: spotlightDisabled
      })), _react["default"].createElement("div", {
        "aria-disabled": disabled,
        "aria-hidden": !active,
        "aria-valuetext": valueText,
        className: _PickerModule["default"].valueWrapper,
        id: id,
        role: "spinbutton"
      }, sizingPlaceholder, _react["default"].createElement(PickerViewManager, {
        "aria-hidden": true,
        arranger: arranger,
        duration: 100,
        index: index,
        noAnimation: noAnimation,
        reverseTransition: this.reverseTransition
      }, children)), _react["default"].createElement(_PickerButton["default"], Object.assign({}, voiceProps, {
        "aria-controls": !joined ? decrementerAriaControls : null,
        "aria-label": this.calcDecrementLabel(valueText),
        className: _PickerModule["default"].decrementer,
        "data-webos-voice-label": joined ? this.calcButtonLabel(reverse, valueText) : null,
        disabled: decrementerDisabled,
        hidden: reachedStart,
        holdConfig: holdConfig,
        icon: decrementIcon,
        joined: joined,
        onDown: this.handleDecrement,
        onHoldPulse: this.handleDecrement,
        onKeyDown: this.handleDecKeyDown,
        onSpotlightDisappear: onSpotlightDisappear,
        spotlightDisabled: spotlightDisabled
      })));
    }
  }]);

  return PickerBase;
}(_react["default"].Component), _class.displayName = 'Picker', _class.propTypes =
/** @lends moonstone/internal/Picker.Picker.prototype */
{
  /**
   * Index for internal ViewManager
   *
   * @type {Number}
   * @required
   * @public
   */
  index: _propTypes["default"].number.isRequired,

  /**
   * The maximum value selectable by the picker (inclusive).
   *
   * The range between `min` and `max` should be evenly divisible by
   * [step]{@link moonstone/internal/Picker.PickerBase.step}.
   *
   * @type {Number}
   * @required
   * @public
   */
  max: _propTypes["default"].number.isRequired,

  /**
   * The minimum value selectable by the picker (inclusive).
   *
   * The range between `min` and `max` should be evenly divisible by
   * [step]{@link moonstone/internal/Picker.PickerBase.step}.
   *
   * @type {Number}
   * @required
   * @public
   */
  min: _propTypes["default"].number.isRequired,

  /**
   * Accessibility hint
   *
   * For example, `hour`, `year`, and `meridiem`
   *
   * @type {String}
   * @default ''
   * @public
   */
  accessibilityHint: _propTypes["default"].string,

  /**
   * The "aria-label" for the picker.
   *
   * While the `aria-label` will always be set on the root node, that node is only focusable
   * when the picker is `joined`.
   *
   * @type {String}
   * @memberof moonstone/internal/Picker.PickerBase.prototype
   * @public
   */
  'aria-label': _propTypes["default"].string,

  /**
   * Overrides the `aria-valuetext` for the picker.
   *
   * By default, `aria-valuetext` is set to the current selected child and `accessibilityHint`
   * text.
   *
   * @type {String}
   * @memberof moonstone/internal/Picker.PickerBase.prototype
   * @public
   */
  'aria-valuetext': _propTypes["default"].string,

  /**
   * Children from which to pick
   *
   * @type {Node}
   * @public
   */
  children: _propTypes["default"].node,

  /**
   * Class name for component
   *
   * @type {String}
   * @public
   */
  className: _propTypes["default"].string,

  /**
   * Disables voice control.
   *
   * @type {Boolean}
   * @memberof moonstone/internal/Picker.PickerBase.prototype
   * @public
   */
  'data-webos-voice-disabled': _propTypes["default"].bool,

  /**
   * The `data-webos-voice-group-label` for the IconButton of Picker.
   *
   * @type {String}
   * @memberof moonstone/internal/Picker.PickerBase.prototype
   * @public
   */
  'data-webos-voice-group-label': _propTypes["default"].string,

  /**
   * The "aria-label" for the decrement button.
   *
   * @type {String}
   * @default 'previous item'
   * @public
   */
  decrementAriaLabel: _propTypes["default"].string,

  /**
   * Assign a custom icon for the decrementer. All strings supported by [Icon]{@link moonstone/Icon.Icon} are
   * supported. Without a custom icon, the default is used, and is automatically changed when
   * the [orientation]{@link moonstone/Icon.Icon#orientation} is changed.
   *
   * @type {String}
   * @public
   */
  decrementIcon: _propTypes["default"].string,

  /**
   * When `true`, the Picker is shown as disabled and does not generate `onChange`
   * [events]{@link /docs/developer-guide/glossary/#event}.
   *
   * @type {Boolean}
   * @public
   */
  disabled: _propTypes["default"].bool,

  /**
   * The picker id reference for setting aria-controls.
   *
   * @type {String}
   * @private
   */
  id: _propTypes["default"].string,

  /**
   * The "aria-label" for the increment button.
   *
   * @type {String}
   * @default 'next item'
   * @public
   */
  incrementAriaLabel: _propTypes["default"].string,

  /**
   * Assign a custom icon for the incrementer. All strings supported by [Icon]{@link moonstone/Icon.Icon} are
   * supported. Without a custom icon, the default is used, and is automatically changed when
   * the [orientation]{@link moonstone/Icon.Icon#orientation} is changed.
   *
   * @type {String}
   * @public
   */
  incrementIcon: _propTypes["default"].string,

  /**
   * Determines the user interaction of the control. A joined picker allows the user to use
   * the arrow keys to adjust the picker's value. The user may no longer use those arrow keys
   * to navigate, while this control is focused. A split control allows full navigation,
   * but requires individual ENTER presses on the incrementer and decrementer buttons.
   * Pointer interaction is the same for both formats.
   *
   * @type {Boolean}
   * @public
   */
  joined: _propTypes["default"].bool,

  /**
   * By default, the picker will animate transitions between items if it has a defined
   * `width`. Specifying `noAnimation` will prevent any transition animation for the
   * component.
   *
   * @type {Boolean}
   * @public
   */
  noAnimation: _propTypes["default"].bool,

  /**
   * A function to run when the control should increment or decrement.
   *
   * @type {Function}
   * @public
   */
  onChange: _propTypes["default"].func,

  /**
   * A function to run when the picker is removed while retaining focus.
   *
   * @type {Function}
   * @private
   */
  onSpotlightDisappear: _propTypes["default"].func,

  /**
   * The handler to run prior to focus leaving the picker when the 5-way down key is pressed.
   *
   * @type {Function}
   * @param {Object} event
   * @public
   */
  onSpotlightDown: _propTypes["default"].func,

  /**
   * The handler to run prior to focus leaving the picker when the 5-way left key is pressed.
   *
   * @type {Function}
   * @param {Object} event
   * @public
   */
  onSpotlightLeft: _propTypes["default"].func,

  /**
   * The handler to run prior to focus leaving the picker when the 5-way right key is pressed.
   *
   * @type {Function}
   * @param {Object} event
   * @public
   */
  onSpotlightRight: _propTypes["default"].func,

  /**
   * The handler to run prior to focus leaving the picker when the 5-way up key is pressed.
   *
   * @type {Function}
   * @param {Object} event
   * @public
   */
  onSpotlightUp: _propTypes["default"].func,

  /**
   * Sets the orientation of the picker, whether the buttons are above and below or on the
   * sides of the value. Must be either `'horizontal'` or `'vertical'`.
   *
   * @type {String}
   * @default 'horizontal'
   * @public
   */
  orientation: _propTypes["default"].oneOf(['horizontal', 'vertical']),

  /**
   * When `true`, the picker buttons operate in the reverse direction such that pressing
   * up/left decrements the value and down/right increments the value. This is more natural
   * for vertical lists of text options where "up" implies a spatial change rather than
   * incrementing the value.
   *
   * @type {Boolean}
   * @public
   */
  reverse: _propTypes["default"].bool,

  /**
   * When `true`, the component cannot be navigated using spotlight.
   *
   * @type {Boolean}
   * @default false
   * @public
   */
  spotlightDisabled: _propTypes["default"].bool,

  /**
   * Allow the picker to only increment or decrement by a given value.
   *
   * A step of `2` would cause a picker to increment from 10 to 12 to 14, etc. It must evenly
   * divide into the range designated by `min` and `max`.
   *
   * @type {Number}
   * @default 1
   * @public
   */
  step: _propTypes["default"].number,

  /**
   * Index of the selected child
   *
   * @type {Number}
   * @default 0
   * @public
   */
  value: _propTypes["default"].number,

  /**
   * Choose a specific size for your picker. `'small'`, `'medium'`, `'large'`, or set to `null` to
   * assume auto-sizing. `'small'` is good for numeric pickers, `'medium'` for single or short
   * word pickers, `'large'` for maximum-sized pickers.
   *
   * You may also supply a number. This number will determine the minumum size of the Picker.
   * Setting a number to less than the number of characters in your longest value may produce
   * unexpected results.
   *
   * @type {String|Number}
   * @public
   */
  width: _propTypes["default"].oneOfType([_propTypes["default"].oneOf([null, 'small', 'medium', 'large']), _propTypes["default"].number]),

  /**
   * Should the picker stop incrementing when the picker reaches the last element? Set `wrap`
   * to `true` to allow the picker to continue from the opposite end of the list of options.
   *
   * @type {Boolean}
   * @public
   */
  wrap: _propTypes["default"].bool
}, _class.defaultProps = {
  accessibilityHint: '',
  orientation: 'horizontal',
  spotlightDisabled: false,
  step: 1,
  value: 0
}, _temp);
var Picker = (0, _IdProvider["default"])({
  generateProp: null,
  prefix: 'p_'
}, (0, _Skinnable["default"])(PickerBase));
exports.Picker = Picker;
var _default = Picker;
exports["default"] = _default;