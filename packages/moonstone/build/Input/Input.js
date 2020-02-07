"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
Object.defineProperty(exports, "calcAriaLabel", {
  enumerable: true,
  get: function get() {
    return _util3.calcAriaLabel;
  }
});
Object.defineProperty(exports, "extractInputProps", {
  enumerable: true,
  get: function get() {
    return _util3.extractInputProps;
  }
});
exports.InputBase = exports.Input = exports["default"] = void 0;

var _kind = _interopRequireDefault(require("@enact/core/kind"));

var _I18nDecorator = require("@enact/i18n/I18nDecorator");

var _util = require("@enact/i18n/util");

var _Changeable = _interopRequireDefault(require("@enact/ui/Changeable"));

var _Pure = _interopRequireDefault(require("@enact/ui/internal/Pure"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _react = _interopRequireDefault(require("react"));

var _$L = _interopRequireDefault(require("../internal/$L"));

var _Skinnable = _interopRequireDefault(require("../Skinnable"));

var _Tooltip = _interopRequireDefault(require("../TooltipDecorator/Tooltip"));

var _util2 = require("../internal/util");

var _InputModule = _interopRequireDefault(require("./Input.module.css"));

var _InputDecoratorIcon = _interopRequireDefault(require("./InputDecoratorIcon"));

var _InputSpotlightDecorator = _interopRequireDefault(require("./InputSpotlightDecorator"));

var _util3 = require("./util");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _objectWithoutProperties(source, excluded) { if (source == null) return {}; var target = _objectWithoutPropertiesLoose(source, excluded); var key, i; if (Object.getOwnPropertySymbols) { var sourceSymbolKeys = Object.getOwnPropertySymbols(source); for (i = 0; i < sourceSymbolKeys.length; i++) { key = sourceSymbolKeys[i]; if (excluded.indexOf(key) >= 0) continue; if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue; target[key] = source[key]; } } return target; }

function _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }

/**
 * A Moonstone styled input component.
 *
 * It supports start and end icons. Note that this base component is not stateless as many other
 * base components are. However, it does not support Spotlight. Apps will want to use
 * {@link moonstone/Input.Input}.
 *
 * @class InputBase
 * @memberof moonstone/Input
 * @ui
 * @public
 */
var InputBase = (0, _kind["default"])({
  name: 'Input',
  propTypes:
  /** @lends moonstone/Input.InputBase.prototype */
  {
    /**
     * Customizes the component by mapping the supplied collection of CSS class names to the
     * corresponding internal Elements and states of this component.
     *
     * The following classes are supported:
     *
     * * `decorator` - The root class name
     * * `input` - The <input> class name
     * * `inputHighlight` - The class used to make input text appear highlighted when `.decorator` has focus, but not `.input`
     *
     * @type {Object}
     * @private
     */
    css: _propTypes["default"].object,
    // TODO: Document voice control props and make public
    'data-webos-voice-group-label': _propTypes["default"].string,
    'data-webos-voice-intent': _propTypes["default"].string,
    'data-webos-voice-label': _propTypes["default"].string,

    /**
     * Disables Input and becomes non-interactive.
     *
     * @type {Boolean}
     * @default false
     * @public
     */
    disabled: _propTypes["default"].bool,

    /**
     * Blurs the input when the "enter" key is pressed.
     *
     * @type {Boolean}
     * @default false
     * @public
     */
    dismissOnEnter: _propTypes["default"].bool,

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
     * Indicates [value]{@link moonstone/Input.InputBase.value} is invalid and shows
     * [invalidMessage]{@link moonstone/Input.InputBase.invalidMessage}, if set.
     *
     * @type {Boolean}
     * @default false
     * @public
     */
    invalid: _propTypes["default"].bool,

    /**
     * The tooltip text to be displayed when the input is
     * [invalid]{@link moonstone/Input.InputBase.invalid}.
     *
     * If this value is *falsy*, the tooltip will not be shown.
     *
     * @type {String}
     * @default ''
     * @public
     */
    invalidMessage: _propTypes["default"].string,

    /**
     * Called when blurred.
     *
     * @type {Function}
     * @param {Object} event
     * @public
     */
    onBlur: _propTypes["default"].func,

    /**
     * Called when the input value is changed.
     *
     * @type {Function}
     * @param {Object} event
     * @public
     */
    onChange: _propTypes["default"].func,

    /**
     * Called when clicked.
     *
     * @type {Function}
     * @param {Object} event
     * @public
     */
    onClick: _propTypes["default"].func,

    /**
     * Called when focused.
     *
     * @type {Function}
     * @param {Object} event
     * @public
     */
    onFocus: _propTypes["default"].func,

    /**
     * Called when a key is pressed down.
     *
     * @type {Function}
     * @param {Object} event
     * @public
     */
    onKeyDown: _propTypes["default"].func,

    /**
     * Text to display when [value]{@link moonstone/Input.InputBase.value} is not set.
     *
     * @type {String}
     * @default ''
     * @public
     */
    placeholder: _propTypes["default"].string,

    /**
     * Indicates the content's text direction is right-to-left.
     *
     * @type {Boolean}
     * @private
     */
    rtl: _propTypes["default"].bool,

    /**
     * The size of the input field.
     *
     * @type {('large'|'small')}
     * @default 'small'
     * @public
     */
    size: _propTypes["default"].string,

    /**
     * The type of input.
     *
     * Accepted values correspond to the standard HTML5 input types.
     *
     * @type {String}
     * @see [MDN input types doc]{@link https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#Form_%3Cinput%3E_types}
     * @default 'text'
     * @public
     */
    type: _propTypes["default"].string,

    /**
     * The value of the input.
     *
     * @type {String|Number}
     * @public
     */
    value: _propTypes["default"].oneOfType([_propTypes["default"].string, _propTypes["default"].number])
  },
  defaultProps: {
    disabled: false,
    dismissOnEnter: false,
    invalid: false,
    placeholder: '',
    size: 'small',
    type: 'text'
  },
  styles: {
    css: _InputModule["default"],
    className: 'decorator',
    publicClassNames: ['decorator', 'input', 'inputHighlight']
  },
  handlers: {
    onChange: function onChange(ev, _ref) {
      var _onChange = _ref.onChange;

      if (_onChange) {
        _onChange({
          value: ev.target.value
        });
      }
    }
  },
  computed: {
    'aria-label': function ariaLabel(_ref2) {
      var placeholder = _ref2.placeholder,
          type = _ref2.type,
          value = _ref2.value;
      var title = value == null || value === '' ? placeholder : '';
      return (0, _util3.calcAriaLabel)(title, type, value);
    },
    className: function className(_ref3) {
      var invalid = _ref3.invalid,
          size = _ref3.size,
          styler = _ref3.styler;
      return styler.append({
        invalid: invalid
      }, size);
    },
    dir: function dir(_ref4) {
      var value = _ref4.value,
          placeholder = _ref4.placeholder;
      return (0, _util.isRtlText)(value || placeholder) ? 'rtl' : 'ltr';
    },
    invalidTooltip: function invalidTooltip(_ref5) {
      var css = _ref5.css,
          invalid = _ref5.invalid,
          _ref5$invalidMessage = _ref5.invalidMessage,
          invalidMessage = _ref5$invalidMessage === void 0 ? (0, _$L["default"])('Please enter a valid value.') : _ref5$invalidMessage,
          rtl = _ref5.rtl;

      if (invalid && invalidMessage) {
        var direction = rtl ? 'left' : 'right';
        return _react["default"].createElement(_Tooltip["default"], {
          arrowAnchor: "top",
          className: css.invalidTooltip,
          direction: direction
        }, invalidMessage);
      }
    },
    // ensure we have a value so the internal <input> is always controlled
    value: function value(_ref6) {
      var _value = _ref6.value;
      return typeof _value === 'number' ? _value : _value || '';
    }
  },
  render: function render(_ref7) {
    var css = _ref7.css,
        dir = _ref7.dir,
        disabled = _ref7.disabled,
        iconAfter = _ref7.iconAfter,
        iconBefore = _ref7.iconBefore,
        invalidTooltip = _ref7.invalidTooltip,
        onChange = _ref7.onChange,
        placeholder = _ref7.placeholder,
        size = _ref7.size,
        type = _ref7.type,
        value = _ref7.value,
        rest = _objectWithoutProperties(_ref7, ["css", "dir", "disabled", "iconAfter", "iconBefore", "invalidTooltip", "onChange", "placeholder", "size", "type", "value"]);

    var inputProps = (0, _util3.extractInputProps)(rest);
    var voiceProps = (0, _util2.extractVoiceProps)(rest);
    delete rest.dismissOnEnter;
    delete rest.invalid;
    delete rest.invalidMessage;
    delete rest.rtl;
    return _react["default"].createElement("div", Object.assign({}, rest, {
      disabled: disabled
    }), _react["default"].createElement(_InputDecoratorIcon["default"], {
      position: "before",
      size: size
    }, iconBefore), _react["default"].createElement("span", {
      className: css.inputHighlight
    }, value ? value : placeholder), _react["default"].createElement("input", Object.assign({}, inputProps, voiceProps, {
      "aria-disabled": disabled,
      className: css.input,
      dir: dir,
      disabled: disabled,
      onChange: onChange,
      placeholder: placeholder,
      tabIndex: -1,
      type: type,
      value: value
    })), _react["default"].createElement(_InputDecoratorIcon["default"], {
      position: "after",
      size: size
    }, iconAfter), invalidTooltip);
  }
});
/**
 * A Spottable, Moonstone styled input component with embedded icon support.
 *
 * By default, `Input` maintains the state of its `value` property. Supply the `defaultValue`
 * property to control its initial value. If you wish to directly control updates to the component,
 * supply a value to `value` at creation time and update it in response to `onChange` events.
 *
 * @class Input
 * @memberof moonstone/Input
 * @extends moonstone/Input.InputBase
 * @mixes ui/Changeable.Changeable
 * @mixes spotlight/Spottable.Spottable
 * @mixes moonstone/Skinnable.Skinnable
 * @ui
 * @public
 */

exports.InputBase = InputBase;
var Input = (0, _Pure["default"])((0, _I18nDecorator.I18nContextDecorator)({
  rtlProp: 'rtl'
}, (0, _Changeable["default"])((0, _InputSpotlightDecorator["default"])((0, _Skinnable["default"])(InputBase)))));
/**
 * Focuses the internal input when the component gains 5-way focus.
 *
 * By default, the internal input is not editable when the component is focused via 5-way and must
 * be selected to become interactive. In pointer mode, the input will be editable when clicked.
 *
 * @name autoFocus
 * @memberof moonstone/Input.Input.prototype
 * @type {Boolean}
 * @default false
 * @public
 */

/**
 * Applies a disabled style and prevents interacting with the component.
 *
 * @name disabled
 * @memberof moonstone/Input.Input.prototype
 * @type {Boolean}
 * @default false
 * @public
 */

/**
 * Sets the initial value.
 *
 * @name defaultValue
 * @memberof moonstone/Input.Input.prototype
 * @type {String}
 * @public
 */

/**
 * Blurs the input when the "enter" key is pressed.
 *
 * @name dismissOnEnter
 * @memberof moonstone/Input.Input.prototype
 * @type {Boolean}
 * @default false
 * @public
 */

/**
 * Called when the internal input is focused.
 *
 * @name onActivate
 * @memberof moonstone/Input.Input.prototype
 * @type {Function}
 * @param {Object} event
 * @public
 */

/**
 * Called when the internal input loses focus.
 *
 * @name onDeactivate
 * @memberof moonstone/Input.Input.prototype
 * @type {Function}
 * @param {Object} event
 * @public
 */

/**
 * Called when the component is removed when it had focus.
 *
 * @name onSpotlightDisappear
 * @memberof moonstone/Input.Input.prototype
 * @type {Function}
 * @param {Object} event
 * @public
 */

/**
 * Disables spotlight navigation into the component.
 *
 * @name spotlightDisabled
 * @memberof moonstone/Input.Input.prototype
 * @type {Boolean}
 * @default false
 * @public
 */

exports.Input = Input;
var _default = Input;
exports["default"] = _default;