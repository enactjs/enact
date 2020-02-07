"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
Object.defineProperty(exports, "SliderTooltip", {
  enumerable: true,
  get: function get() {
    return _ProgressBar2.ProgressBarTooltip;
  }
});
exports.SliderDecorator = exports.SliderBase = exports.Slider = exports["default"] = void 0;

var _handle = require("@enact/core/handle");

var _kind = _interopRequireDefault(require("@enact/core/kind"));

var _Spottable = _interopRequireDefault(require("@enact/spotlight/Spottable"));

var _Changeable = _interopRequireDefault(require("@enact/ui/Changeable"));

var _ComponentOverride = _interopRequireDefault(require("@enact/ui/ComponentOverride"));

var _ProgressBar = _interopRequireDefault(require("@enact/ui/ProgressBar"));

var _Pure = _interopRequireDefault(require("@enact/ui/internal/Pure"));

var _Slottable = _interopRequireDefault(require("@enact/ui/Slottable"));

var _Slider = _interopRequireDefault(require("@enact/ui/Slider"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _anyPass = _interopRequireDefault(require("ramda/src/anyPass"));

var _compose = _interopRequireDefault(require("ramda/src/compose"));

var _react = _interopRequireDefault(require("react"));

var _ProgressBar2 = require("../ProgressBar");

var _Skinnable = _interopRequireDefault(require("../Skinnable"));

var _validators = require("../internal/validators");

var _SliderBehaviorDecorator = _interopRequireDefault(require("./SliderBehaviorDecorator"));

var _utils = require("./utils");

var _SliderModule = _interopRequireDefault(require("./Slider.module.css"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _objectWithoutProperties(source, excluded) { if (source == null) return {}; var target = _objectWithoutPropertiesLoose(source, excluded); var key, i; if (Object.getOwnPropertySymbols) { var sourceSymbolKeys = Object.getOwnPropertySymbols(source); for (i = 0; i < sourceSymbolKeys.length; i++) { key = sourceSymbolKeys[i]; if (excluded.indexOf(key) >= 0) continue; if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue; target[key] = source[key]; } } return target; }

function _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }

/**
 * Range-selection input component.
 *
 * @class SliderBase
 * @extends ui/Slider.SliderBase
 * @omit progressBarComponent
 * @memberof moonstone/Slider
 * @ui
 * @public
 */
var SliderBase = (0, _kind["default"])({
  name: 'Slider',
  propTypes:
  /** @lends moonstone/Slider.SliderBase.prototype */
  {
    /**
     * Activates the component when focused so that it may be manipulated via the directional
     * input keys.
     *
     * @type {Boolean}
     * @public
     */
    activateOnFocus: _propTypes["default"].bool,

    /**
     * Sets the knob to selected state and allows it to move via 5-way controls.
     *
     * @type {Boolean}
     * @public
     */
    active: _propTypes["default"].bool,

    /**
     * Customizes the component by mapping the supplied collection of CSS class names to the
     * corresponding internal Elements and states of this component.
     *
     * The following classes are supported:
     *
     * * `slider` - The root component class
     *
     * @type {Object}
     * @public
     */
    css: _propTypes["default"].object,

    /**
     * Indicates that the slider has gained focus and if the tooltip is present, it will be
     * shown.
     *
     * @type {Boolean}
     * @public
     */
    focused: _propTypes["default"].bool,

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
     * The maximum value of the slider.
     *
     * The range between `min` and `max` should be evenly divisible by
     * [step]{@link moonstone/Slider.SliderBase.step}.
     *
     * @type {Number}
     * @default 100
     * @public
     */
    max: _propTypes["default"].number,

    /**
     * The minimum value of the slider.
     *
     * The range between `min` and `max` should be evenly divisible by
     * [step]{@link moonstone/Slider.SliderBase.step}.
     *
     * @type {Number}
     * @default 0
     * @public
     */
    min: _propTypes["default"].number,

    /**
     * The handler when the knob is activated or deactivated by selecting it via 5-way
     *
     * @type {Function}
     * @public
     */
    onActivate: _propTypes["default"].func,

    /**
     * Called when a key is pressed down while the slider is focused.
     *
     * When a directional key is pressed down and the knob is active (either by first
     * pressing enter or when `activateOnFocus` is enabled), the Slider will increment or
     * decrement the current value and emit an `onChange` event. This default behavior can be
     * prevented by calling `preventDefault()` on the event passed to this callback.
     *
     * @type {Function}
     * @public
     */
    onKeyDown: _propTypes["default"].func,

    /**
     * Called when a key is released while the slider is focused.
     *
     * When the enter key is released and `activateOnFocus` is not enabled, the slider will be
     * activated to enable incrementing or decrementing the value via directional keys. This
     * default behavior can be prevented by calling `preventDefault()` on the event passed to
     * this callback.
     *
     * @type {Function}
     * @public
     */
    onKeyUp: _propTypes["default"].func,

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
     * To customize the tooltip, pass either a custom tooltip component or an instance of
     * [SliderTooltip]{@link moonstone/Slider.SliderTooltip} with additional props configured.
     *
     * ```
     * <Slider
     *   tooltip={
     *     <SliderTooltip percent side="after" />
     *   }
     * />
     * ```
     *
     * The tooltip may also be passed as a child via the `"tooltip"` slot. See
     * [Slottable]{@link ui/Slottable} for more information on how slots can be used.
     *
     * ```
     * <Slider>
     *   <SliderTooltip percent side="after" />
     * </Slider>
     * ```
     *
     * If a custom tooltip is provided, it will receive the following props:
     *
     * * `children` - The `value` prop from the slider
     * * `visible` - `true` if the tooltip should be displayed
     * * `orientation` - The value of the `orientation` prop from the slider
     * * `proportion` - A number between 0 and 1 representing the proportion of the `value` in
     *   terms of `min` and `max`
     *
     * @type {Boolean|Element|Function}
     * @public
     */
    tooltip: _propTypes["default"].oneOfType([_propTypes["default"].bool, _propTypes["default"].object, _propTypes["default"].func]),

    /**
     * The value of the slider.
     *
     * Defaults to the value of `min`.
     *
     * @type {Number}
     * @public
     */
    value: _propTypes["default"].number
  },
  defaultProps: {
    activateOnFocus: false,
    active: false,
    disabled: false,
    max: 100,
    min: 0,
    step: 1
  },
  styles: {
    css: _SliderModule["default"],
    className: 'slider',
    publicClassNames: true
  },
  handlers: {
    onBlur: (0, _handle.handle)((0, _handle.forward)('onBlur'), (0, _handle.forProp)('active', true), (0, _handle.forward)('onActivate')),
    onKeyDown: (0, _handle.handle)((0, _handle.forProp)('disabled', false), (0, _handle.forwardWithPrevent)('onKeyDown'), (0, _anyPass["default"])([_utils.handleIncrement, _utils.handleDecrement])),
    onKeyUp: (0, _handle.handle)((0, _handle.forProp)('disabled', false), (0, _handle.forwardWithPrevent)('onKeyUp'), (0, _handle.forProp)('activateOnFocus', false), (0, _handle.forKey)('enter'), (0, _handle.forward)('onActivate'))
  },
  computed: {
    className: function className(_ref) {
      var activateOnFocus = _ref.activateOnFocus,
          active = _ref.active,
          styler = _ref.styler;
      return styler.append({
        activateOnFocus: activateOnFocus,
        active: active
      });
    },
    knobStep: (0, _validators.validateSteppedOnce)(function (props) {
      return props.knobStep;
    }, {
      component: 'Slider',
      stepName: 'knobStep',
      valueName: 'max'
    }),
    step: (0, _validators.validateSteppedOnce)(function (props) {
      return props.step;
    }, {
      component: 'Slider',
      valueName: 'max'
    }),
    tooltip: function tooltip(_ref2) {
      var _tooltip = _ref2.tooltip;
      return _tooltip === true ? _ProgressBar2.ProgressBarTooltip : _tooltip;
    }
  },
  render: function render(_ref3) {
    var css = _ref3.css,
        focused = _ref3.focused,
        tooltip = _ref3.tooltip,
        rest = _objectWithoutProperties(_ref3, ["css", "focused", "tooltip"]);

    delete rest.activateOnFocus;
    delete rest.active;
    delete rest.onActivate;
    delete rest.knobStep;
    return _react["default"].createElement(_Slider["default"], Object.assign({}, rest, {
      css: css,
      progressBarComponent: _react["default"].createElement(_ProgressBar["default"], {
        css: css
      }),
      tooltipComponent: _react["default"].createElement(_ComponentOverride["default"], {
        component: tooltip,
        visible: focused
      })
    }));
  }
});
/**
 * Moonstone-specific slider behaviors to apply to [SliderBase]{@link moonstone/Slider.SliderBase}.
 *
 * @hoc
 * @memberof moonstone/Slider
 * @mixes ui/Changeable.Changeable
 * @mixes spotlight/Spottable.Spottable
 * @mixes moonstone/Skinnable.Skinnable
 * @mixes ui/Slottable.Slottable
 * @mixes ui/Slider.SliderDecorator
 * @public
 */

exports.SliderBase = SliderBase;
var SliderDecorator = (0, _compose["default"])(_Pure["default"], _Changeable["default"], _SliderBehaviorDecorator["default"], _Spottable["default"], (0, _Slottable["default"])({
  slots: ['knob', 'tooltip']
}), _Skinnable["default"]);
/**
 * Slider input with Moonstone styling, [`Spottable`]{@link spotlight/Spottable.Spottable},
 * [Touchable]{@link ui/Touchable} and [`SliderDecorator`]{@link moonstone/Slider.SliderDecorator}
 * applied.
 *
 * By default, `Slider` maintains the state of its `value` property. Supply the `defaultValue`
 * property to control its initial value. If you wish to directly control updates to the
 * component, supply a value to `value` at creation time and update it in response to `onChange`
 * events.
 *
 * @class Slider
 * @memberof moonstone/Slider
 * @mixes moonstone/Slider.SliderDecorator
 * @ui
 * @public
 */

/**
 * Overrides the `aria-valuetext` for the slider.
 *
 * By default, `aria-valuetext` is set to the current value. This should only be used when
 * the parent controls the value of the slider directly through the props.
 *
 * @name aria-valuetext
 * @memberof moonstone/Slider.Slider.prototype
 * @type {String|Number}
 * @public
 */

exports.SliderDecorator = SliderDecorator;
var Slider = SliderDecorator(SliderBase);
/**
 * A [Tooltip]{@link moonstone/TooltipDecorator.Tooltip} specifically adapted for use with
 * [IncrementSlider]{@link moonstone/IncrementSlider.IncrementSlider},
 * [ProgressBar]{@link moonstone/ProgressBar.ProgressBar}, or
 * [Slider]{@link moonstone/Slider.Slider}.
 *
 * @see {@link moonstone/ProgressBar.ProgressBarTooltip}
 * @class SliderTooltip
 * @memberof moonstone/Slider
 * @ui
 * @public
 */

exports.Slider = Slider;
var _default = Slider;
exports["default"] = _default;