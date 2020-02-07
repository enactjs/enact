"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
Object.defineProperty(exports, "IncrementSliderTooltip", {
  enumerable: true,
  get: function get() {
    return _ProgressBar.ProgressBarTooltip;
  }
});
exports.IncrementSliderDecorator = exports.IncrementSliderBase = exports.IncrementSlider = exports["default"] = void 0;

var _handle = require("@enact/core/handle");

var _keymap = require("@enact/core/keymap");

var _kind = _interopRequireDefault(require("@enact/core/kind"));

var _util = require("@enact/core/util");

var _Spottable = _interopRequireDefault(require("@enact/spotlight/Spottable"));

var _Changeable = _interopRequireDefault(require("@enact/ui/Changeable"));

var _IdProvider = _interopRequireDefault(require("@enact/ui/internal/IdProvider"));

var _Slottable = _interopRequireDefault(require("@enact/ui/Slottable"));

var _Pure = _interopRequireDefault(require("@enact/ui/internal/Pure"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _compose = _interopRequireDefault(require("ramda/src/compose"));

var _react = _interopRequireDefault(require("react"));

var _$L = _interopRequireDefault(require("../internal/$L"));

var _ProgressBar = require("../ProgressBar");

var _Skinnable = _interopRequireDefault(require("../Skinnable"));

var _Slider = require("../Slider");

var _utils = require("../Slider/utils");

var _SliderBehaviorDecorator = _interopRequireDefault(require("../Slider/SliderBehaviorDecorator"));

var _util2 = require("../internal/util");

var _IncrementSliderButton = _interopRequireDefault(require("./IncrementSliderButton"));

var _IncrementSliderModule = _interopRequireDefault(require("./IncrementSlider.module.css"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _objectWithoutProperties(source, excluded) { if (source == null) return {}; var target = _objectWithoutPropertiesLoose(source, excluded); var key, i; if (Object.getOwnPropertySymbols) { var sourceSymbolKeys = Object.getOwnPropertySymbols(source); for (i = 0; i < sourceSymbolKeys.length; i++) { key = sourceSymbolKeys[i]; if (excluded.indexOf(key) >= 0) continue; if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue; target[key] = source[key]; } } return target; }

function _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }

var isDown = (0, _keymap.is)('down');
var isLeft = (0, _keymap.is)('left');
var isRight = (0, _keymap.is)('right');
var isUp = (0, _keymap.is)('up');
var Slider = (0, _Spottable["default"])((0, _Skinnable["default"])(_Slider.SliderBase));

var forwardWithType = function forwardWithType(type, props) {
  return (0, _handle.forward)(type, {
    type: type
  }, props);
};
/**
 * A stateless Slider with IconButtons to increment and decrement the value. In most circumstances,
 * you will want to use the stateful version: {@link moonstone/IncrementSlider.IncrementSlider}.
 *
 * @class IncrementSliderBase
 * @memberof moonstone/IncrementSlider
 * @extends moonstone/Slider.SliderBase
 * @mixes moonstone/Skinnable.Skinnable
 * @mixes spotlight/Spottable.Spottable
 * @ui
 * @public
 */


var IncrementSliderBase = (0, _kind["default"])({
  name: 'IncrementSlider',
  propTypes:
  /** @lends moonstone/IncrementSlider.IncrementSliderBase.prototype */
  {
    /**
     * Sets the knob to selected state and allows it to move via 5-way controls.
     *
     * @type {Boolean}
     * @public
     */
    active: _propTypes["default"].bool,

    /**
     * Prevents read out of both the slider and the increment and decrement
     * buttons.
     *
     * @type {Boolean}
     * @memberof moonstone/IncrementSlider.IncrementSliderBase.prototype
     * @public
     */
    'aria-hidden': _propTypes["default"].bool,

    /**
     * Overrides the `aria-valuetext` for the slider. By default, `aria-valuetext` is set
     * to the current value. This should only be used when the parent controls the value of
     * the slider directly through the props.
     *
     * @type {String|Number}
     * @memberof moonstone/IncrementSlider.IncrementSliderBase.prototype
     * @public
     */
    'aria-valuetext': _propTypes["default"].oneOfType([_propTypes["default"].string, _propTypes["default"].number]),

    /**
     * Background progress, as a proportion between `0` and `1`.
     *
     * @type {Number}
     * @default 0
     * @public
     */
    backgroundProgress: _propTypes["default"].number,

    /**
     * Customizes the component by mapping the supplied collection of CSS class names to the
     * corresponding internal Elements and states of this component.
     *
     * @type {Object}
     * @private
     */
    css: _propTypes["default"].object,

    /**
     * Disables voice control.
     *
     * @type {Boolean}
     * @memberof moonstone/IncrementSlider.IncrementSliderBase.prototype
     * @public
     */
    'data-webos-voice-disabled': _propTypes["default"].bool,

    /**
     * The `data-webos-voice-group-label` for the IconButton of IncrementSlider.
     *
     * @type {String}
     * @memberof moonstone/IncrementSlider.IncrementSliderBase.prototype
     * @public
     */
    'data-webos-voice-group-label': _propTypes["default"].string,

    /**
    * Sets the hint string read when focusing the decrement button.
    *
    * @default 'press ok button to decrease the value'
    * @type {String}
    * @public
    */
    decrementAriaLabel: _propTypes["default"].string,

    /**
     * Assign a custom icon for the decrementer. All strings supported by [Icon]{@link moonstone/Icon.Icon} are
     * supported. Without a custom icon, the default is used, and is automatically changed when
     * [vertical]{@link moonstone/IncrementSlider.IncrementSlider#vertical} is changed.
     *
     * @type {String}
     * @public
     */
    decrementIcon: _propTypes["default"].string,

    /**
     * Disables the slider and prevents events from firing.
     *
     * @type {Boolean}
     * @public
     */
    disabled: _propTypes["default"].bool,

    /**
     * Shows the tooltip, when present.
     * @type {Boolean}
     * @public
     */
    focused: _propTypes["default"].bool,

    /**
     * The slider id reference for setting aria-controls.
     *
     * @type {String}
     * @private
     */
    id: _propTypes["default"].string,

    /**
    * Sets the hint string read when focusing the increment button.
    *
    * @default 'press ok button to increase the value'
    * @type {String}
    * @public
    */
    incrementAriaLabel: _propTypes["default"].string,

    /**
     * Assign a custom icon for the incrementer. All strings supported by [Icon]{@link moonstone/Icon.Icon} are
     * supported. Without a custom icon, the default is used, and is automatically changed when
     * [vertical]{@link moonstone/IncrementSlider.IncrementSlider#vertical} is changed.
     *
     * @type {String}
     * @public
     */
    incrementIcon: _propTypes["default"].string,

    /**
     * The amount to increment or decrement the position of the knob via 5-way controls.
     *
     * It must evenly divide into the range designated by `min` and `max`. If not specified,
     * `step` is used for the default value.
     *
     * @type {Number}
     * @public
     */
    knobStep: _propTypes["default"].number,

    /**
     * The maximum value of the increment slider.
     *
     * The range between `min` and `max` should be evenly divisible by
     * [step]{@link moonstone/IncrementSlider.IncrementSliderBase.step}.
     *
     * @type {Number}
     * @default 100
     * @public
     */
    max: _propTypes["default"].number,

    /**
     * The minimum value of the increment slider.
     *
     * The range between `min` and `max` should be evenly divisible by
     * [step]{@link moonstone/IncrementSlider.IncrementSliderBase.step}.
     *
     * @type {Number}
     * @default 0
     * @public
     */
    min: _propTypes["default"].number,

    /**
     * Hides the slider bar fill and prevents highlight when spotted.
     *
     * @type {Boolean}
     * @public
     */
    noFill: _propTypes["default"].bool,

    /**
     * Called when the knob is activated or deactivated by selecting it via 5-way.
     *
     * @type {Function}
     * @public
     */
    onActivate: _propTypes["default"].func,

    /**
     * Called when the value is changed.
     *
     * @type {Function}
     * @param {Object} event
     * @param {Number} event.value The current value
     * @public
     */
    onChange: _propTypes["default"].func,

    /**
     * Called run when the decrement button becomes disabled.
     *
     * @type {Function}
     * @private
     */
    onDecrementSpotlightDisappear: _propTypes["default"].func,

    /**
     * Forwarded from SliderBehaviorDecorator onto the internal slider.
     *
     * @type {Function}
     * @private
     */
    onDragEnd: _propTypes["default"].func,

    /**
     * Forwarded from SliderBehaviorDecorator onto the internal slider.
     *
     * @type {Function}
     * @private
     */
    onDragStart: _propTypes["default"].func,

    /**
     * Called when the increment button becomes disabled.
     *
     * @type {Function}
     * @private
     */
    onIncrementSpotlightDisappear: _propTypes["default"].func,

    /**
     * Called when the increment button becomes disabled.
     *
     * @type {Function}
     * @private
     */
    onSpotlightDirection: _propTypes["default"].func,

    /**
     * Called when the component is removed while retaining focus.
     *
     * @type {Function}
     * @param {Object} event
     * @public
     */
    onSpotlightDisappear: _propTypes["default"].func,

    /**
     * Called prior to focus leaving the component when the 5-way down key is pressed.
     *
     * @type {Function}
     * @param {Object} event
     * @public
     */
    onSpotlightDown: _propTypes["default"].func,

    /**
     * Called prior to focus leaving the component when the 5-way left key is pressed.
     *
     * @type {Function}
     * @param {Object} event
     * @public
     */
    onSpotlightLeft: _propTypes["default"].func,

    /**
     * Called prior to focus leaving the component when the 5-way right key is pressed.
     *
     * @type {Function}
     * @param {Object} event
     * @public
     */
    onSpotlightRight: _propTypes["default"].func,

    /**
     * Called prior to focus leaving the component when the 5-way up key is pressed.
     *
     * @type {Function}
     * @param {Object} event
     * @public
     */
    onSpotlightUp: _propTypes["default"].func,

    /**
     * Sets the orientation of the slider, whether the slider moves left and right or up and
     * down. Must be either `'horizontal'` or `'vertical'`.
     *
     * @type {String}
     * @default 'horizontal'
     * @public
     */
    orientation: _propTypes["default"].oneOf(['horizontal', 'vertical']),

    /**
     * Disables spotlight navigation into the component.
     *
     * @type {Boolean}
     * @public
     */
    spotlightDisabled: _propTypes["default"].bool,

    /**
     * The amount to increment or decrement the value.
     *
     * It must evenly divide into the range designated by `min` and `max`.
     *
     * @type {Number}
     * @default 1
     * @public
     */
    step: _propTypes["default"].number,

    /**
     * Enables the built-in tooltip
     *
     * To customize the tooltip, pass either a custom Tooltip component or an instance of
     * [IncrementSliderTooltip]{@link moonstone/IncrementSlider.IncrementSliderTooltip} with
     * additional props configured.
     *
     * ```
     * <IncrementSlider
     *   tooltip={
     *     <IncrementSliderTooltip percent side="after" />
     *   }
     * />
     * ```
     *
     * The tooltip may also be passed as a child via the `"tooltip"` slot. See
     * [Slottable]{@link ui/Slottable} for more information on how slots can be used.
     *
     * ```
     * <IncrementSlider>
     *   <IncrementSliderTooltip percent side="after" />
     * </IncrementSlider>
     * ```
     *
     * @type {Boolean|Element|Function}
     * @public
     */
    tooltip: _propTypes["default"].oneOfType([_propTypes["default"].bool, _propTypes["default"].object, _propTypes["default"].func]),

    /**
     * The value of the increment slider.
     *
     * Defaults to the value of `min`.
     *
     * @type {Number}
     * @public
     */
    value: _propTypes["default"].number
  },
  defaultProps: {
    backgroundProgress: 0,
    max: 100,
    min: 0,
    noFill: false,
    orientation: 'horizontal',
    spotlightDisabled: false,
    step: 1,
    tooltip: false
  },
  handlers: {
    onDecrement: (0, _utils.emitChange)(-1),
    onIncrement: (0, _utils.emitChange)(1),
    onKeyDown: function onKeyDown(ev, props) {
      var orientation = props.orientation;
      (0, _handle.forward)('onKeyDown', ev, props); // if the source of the event is the slider, forward it along

      if (ev.target.classList.contains(_IncrementSliderModule["default"].slider)) {
        (0, _handle.forward)('onSpotlightDirection', ev, props);
        return;
      }

      var isIncrement = ev.target.classList.contains(_IncrementSliderModule["default"].incrementButton);
      var isDecrement = ev.target.classList.contains(_IncrementSliderModule["default"].decrementButton);

      if (isRight(ev.keyCode) && (isIncrement || orientation === 'vertical')) {
        forwardWithType('onSpotlightRight', props);
      } else if (isLeft(ev.keyCode) && (isDecrement || orientation === 'vertical')) {
        forwardWithType('onSpotlightLeft', props);
      } else if (isUp(ev.keyCode) && (isIncrement || orientation === 'horizontal')) {
        forwardWithType('onSpotlightUp', props);
      } else if (isDown(ev.keyCode) && (isDecrement || orientation === 'horizontal')) {
        forwardWithType('onSpotlightDown', props);
      }
    }
  },
  styles: {
    css: _IncrementSliderModule["default"],
    className: 'incrementSlider',
    publicClassNames: ['incrementSlider']
  },
  computed: {
    className: function className(_ref) {
      var orientation = _ref.orientation,
          styler = _ref.styler;
      return styler.append(orientation);
    },
    decrementDisabled: function decrementDisabled(_ref2) {
      var disabled = _ref2.disabled,
          min = _ref2.min,
          _ref2$value = _ref2.value,
          value = _ref2$value === void 0 ? min : _ref2$value;
      return disabled || value <= min;
    },
    incrementDisabled: function incrementDisabled(_ref3) {
      var disabled = _ref3.disabled,
          max = _ref3.max,
          min = _ref3.min,
          _ref3$value = _ref3.value,
          value = _ref3$value === void 0 ? min : _ref3$value;
      return disabled || value >= max;
    },
    decrementIcon: function decrementIcon(_ref4) {
      var _decrementIcon = _ref4.decrementIcon,
          orientation = _ref4.orientation;
      return _decrementIcon || (orientation === 'vertical' ? 'arrowlargedown' : 'arrowlargeleft');
    },
    incrementIcon: function incrementIcon(_ref5) {
      var _incrementIcon = _ref5.incrementIcon,
          orientation = _ref5.orientation;
      return _incrementIcon || (orientation === 'vertical' ? 'arrowlargeup' : 'arrowlargeright');
    },
    decrementAriaLabel: function decrementAriaLabel(_ref6) {
      var valueText = _ref6['aria-valuetext'],
          _decrementAriaLabel = _ref6.decrementAriaLabel,
          min = _ref6.min,
          _ref6$value = _ref6.value,
          value = _ref6$value === void 0 ? min : _ref6$value;

      if (_decrementAriaLabel == null) {
        _decrementAriaLabel = (0, _$L["default"])('press ok button to decrease the value');
      }

      return "".concat(valueText != null ? valueText : value, " ").concat(_decrementAriaLabel);
    },
    incrementAriaLabel: function incrementAriaLabel(_ref7) {
      var valueText = _ref7['aria-valuetext'],
          _incrementAriaLabel = _ref7.incrementAriaLabel,
          min = _ref7.min,
          _ref7$value = _ref7.value,
          value = _ref7$value === void 0 ? min : _ref7$value;

      if (_incrementAriaLabel == null) {
        _incrementAriaLabel = (0, _$L["default"])('press ok button to increase the value');
      }

      return "".concat(valueText != null ? valueText : value, " ").concat(_incrementAriaLabel);
    }
  },
  render: function render(_ref8) {
    var active = _ref8.active,
        ariaHidden = _ref8['aria-hidden'],
        backgroundProgress = _ref8.backgroundProgress,
        css = _ref8.css,
        decrementAriaLabel = _ref8.decrementAriaLabel,
        decrementDisabled = _ref8.decrementDisabled,
        decrementIcon = _ref8.decrementIcon,
        disabled = _ref8.disabled,
        focused = _ref8.focused,
        id = _ref8.id,
        incrementAriaLabel = _ref8.incrementAriaLabel,
        incrementDisabled = _ref8.incrementDisabled,
        incrementIcon = _ref8.incrementIcon,
        knobStep = _ref8.knobStep,
        max = _ref8.max,
        min = _ref8.min,
        noFill = _ref8.noFill,
        onActivate = _ref8.onActivate,
        onChange = _ref8.onChange,
        onDecrement = _ref8.onDecrement,
        onDecrementSpotlightDisappear = _ref8.onDecrementSpotlightDisappear,
        onDragEnd = _ref8.onDragEnd,
        onDragStart = _ref8.onDragStart,
        onIncrement = _ref8.onIncrement,
        onIncrementSpotlightDisappear = _ref8.onIncrementSpotlightDisappear,
        onSpotlightDisappear = _ref8.onSpotlightDisappear,
        orientation = _ref8.orientation,
        spotlightDisabled = _ref8.spotlightDisabled,
        step = _ref8.step,
        tooltip = _ref8.tooltip,
        value = _ref8.value,
        rest = _objectWithoutProperties(_ref8, ["active", "aria-hidden", "backgroundProgress", "css", "decrementAriaLabel", "decrementDisabled", "decrementIcon", "disabled", "focused", "id", "incrementAriaLabel", "incrementDisabled", "incrementIcon", "knobStep", "max", "min", "noFill", "onActivate", "onChange", "onDecrement", "onDecrementSpotlightDisappear", "onDragEnd", "onDragStart", "onIncrement", "onIncrementSpotlightDisappear", "onSpotlightDisappear", "orientation", "spotlightDisabled", "step", "tooltip", "value"]);

    var ariaProps = (0, _util.extractAriaProps)(rest);
    var voiceProps = (0, _util2.extractVoiceProps)(rest);
    delete voiceProps['data-webos-voice-label'];
    delete voiceProps['data-webos-voice-labels'];
    delete rest.onSpotlightDirection;
    delete rest.onSpotlightDown;
    delete rest.onSpotlightLeft;
    delete rest.onSpotlightRight;
    delete rest.onSpotlightUp;
    return _react["default"].createElement("div", rest, _react["default"].createElement(_IncrementSliderButton["default"], Object.assign({}, voiceProps, {
      "aria-controls": !incrementDisabled ? id : null,
      "aria-hidden": ariaHidden,
      "aria-label": decrementAriaLabel,
      className: css.decrementButton,
      disabled: decrementDisabled,
      onTap: onDecrement,
      onSpotlightDisappear: onDecrementSpotlightDisappear,
      spotlightDisabled: spotlightDisabled
    }), decrementIcon), _react["default"].createElement(Slider, Object.assign({}, ariaProps, {
      active: active,
      "aria-hidden": ariaHidden,
      backgroundProgress: backgroundProgress,
      className: css.slider,
      disabled: disabled,
      focused: focused,
      id: id,
      knobStep: knobStep,
      max: max,
      min: min,
      noFill: noFill,
      onActivate: onActivate,
      onChange: onChange,
      onDragEnd: onDragEnd,
      onDragStart: onDragStart,
      onSpotlightDisappear: onSpotlightDisappear,
      orientation: orientation,
      spotlightDisabled: spotlightDisabled,
      step: step,
      tooltip: tooltip,
      value: value
    })), _react["default"].createElement(_IncrementSliderButton["default"], Object.assign({}, voiceProps, {
      "aria-controls": !decrementDisabled ? id : null,
      "aria-hidden": ariaHidden,
      "aria-label": incrementAriaLabel,
      className: css.incrementButton,
      disabled: incrementDisabled,
      onTap: onIncrement,
      onSpotlightDisappear: onIncrementSpotlightDisappear,
      spotlightDisabled: spotlightDisabled
    }), incrementIcon));
  }
});
exports.IncrementSliderBase = IncrementSliderBase;
var IncrementSliderDecorator = (0, _compose["default"])(_Pure["default"], _Changeable["default"], (0, _IdProvider["default"])({
  generateProp: null,
  prefix: 's_'
}), (0, _SliderBehaviorDecorator["default"])({
  emitSpotlightEvents: 'onSpotlightDirection'
}), _Skinnable["default"], (0, _Slottable["default"])({
  slots: ['knob', 'tooltip']
}));
/**
 * An IncrementSlider with Moonstone styling and SliderDecorator applied with IconButtons to
 * increment and decrement the value.
 *
 * By default, `IncrementSlider` maintains the state of its `value` property. Supply the
 * `defaultValue` property to control its initial value. If you wish to directly control updates
 * to the component, supply a value to `value` at creation time and update it in response to
 * `onChange` events.
 *
 * @class IncrementSlider
 * @memberof moonstone/IncrementSlider
 * @extends moonstone/IncrementSlider.IncrementSliderBase
 * @ui
 * @public
 */

exports.IncrementSliderDecorator = IncrementSliderDecorator;
var IncrementSlider = IncrementSliderDecorator(IncrementSliderBase);
/**
 * A [Tooltip]{@link moonstone/TooltipDecorator.Tooltip} specifically adapted for use with
 * [IncrementSlider]{@link moonstone/IncrementSlider.IncrementSlider},
 * [ProgressBar]{@link moonstone/ProgressBar.ProgressBar}, or
 * [Slider]{@link moonstone/Slider.Slider}.
 *
 * See {@link moonstone/ProgressBar.ProgressBarTooltip}
 *
 * @class IncrementSliderTooltip
 * @memberof moonstone/IncrementSlider
 * @ui
 * @public
 */

exports.IncrementSlider = IncrementSlider;
var _default = IncrementSlider;
exports["default"] = _default;