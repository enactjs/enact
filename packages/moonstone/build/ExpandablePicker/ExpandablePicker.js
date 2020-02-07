"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ExpandablePickerBase = exports.ExpandablePicker = exports["default"] = void 0;

var _Changeable = _interopRequireDefault(require("@enact/ui/Changeable"));

var _kind = _interopRequireDefault(require("@enact/core/kind"));

var _I18nDecorator = require("@enact/i18n/I18nDecorator");

var _Pure = _interopRequireDefault(require("@enact/ui/internal/Pure"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _react = _interopRequireDefault(require("react"));

var _ExpandableItem = require("../ExpandableItem");

var _IconButton = _interopRequireDefault(require("../IconButton"));

var _Picker = _interopRequireDefault(require("../Picker"));

var _util = require("../internal/util");

var _ExpandablePickerDecorator = _interopRequireDefault(require("./ExpandablePickerDecorator"));

var _ExpandablePickerModule = _interopRequireDefault(require("./ExpandablePicker.module.css"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _objectWithoutProperties(source, excluded) { if (source == null) return {}; var target = _objectWithoutPropertiesLoose(source, excluded); var key, i; if (Object.getOwnPropertySymbols) { var sourceSymbolKeys = Object.getOwnPropertySymbols(source); for (i = 0; i < sourceSymbolKeys.length; i++) { key = sourceSymbolKeys[i]; if (excluded.indexOf(key) >= 0) continue; if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue; target[key] = source[key]; } } return target; }

function _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }

/**
 * A stateless component that renders a list of items into a picker that allows the user to select
 * only a single item at a time. It supports increment/decrement buttons for selection.
 *
 * @class ExpandablePickerBase
 * @memberof moonstone/ExpandablePicker
 * @extends moonstone/ExpandableItem.ExpandableItemBase
 * @ui
 * @public
 */
var ExpandablePickerBase = (0, _kind["default"])({
  name: 'ExpandablePicker',
  propTypes:
  /** @lends moonstone/ExpandablePicker.ExpandablePickerBase.prototype */
  {
    /**
     * Picker value list.
     *
     * @type {Node}
     * @required
     * @public
     */
    children: _propTypes["default"].node.isRequired,

    /**
     * The "aria-label" for the the check button.
     *
     * @type {String}
     * @public
     */
    checkButtonAriaLabel: _propTypes["default"].string,

    /**
     * Disables voice control.
     *
     * @type {Boolean}
     * @memberof moonstone/ExpandablePicker.ExpandablePickerBase.prototype
     * @public
     */
    'data-webos-voice-disabled': _propTypes["default"].bool,

    /**
     * The `data-webos-voice-group-label` for ExpandableItem and Picker.
     *
     * @type {String}
     * @memberof moonstone/ExpandablePicker.ExpandablePickerBase.prototype
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
     * A custom icon for the decrementer.
     *
     * All strings supported by [Icon]{@link moonstone/Icon.Icon} are supported. Without a
     * custom icon, the default is used, and is automatically changed when the
     * [orientation]{@link moonstone/Picker.Picker#orientation} is changed.
     *
     * @type {string}
     * @public
     */
    decrementIcon: _propTypes["default"].string,

    /**
     * Disables ExpandablePicker and the control becomes non-interactive.
     *
     * @type {Boolean}
     * @public
     */
    disabled: _propTypes["default"].bool,

    /**
     * The "aria-label" for the increment button.
     *
     * @type {String}
     * @default 'next item'
     * @public
     */
    incrementAriaLabel: _propTypes["default"].string,

    /**
     * A custom icon for the incrementer.
     *
     * All strings supported by [Icon]{@link moonstone/Icon.Icon} are supported. Without a
     * custom icon, the default is used, and is automatically changed when the
     * [orientation]{@link moonstone/Picker.Picker#orientation} is changed.
     *
     * @type {String}
     * @public
     */
    incrementIcon: _propTypes["default"].string,

    /**
     * Allows the user to use the arrow keys to adjust the picker's value.
     *
     * Key presses are captured in the directions of the increment and decrement buttons but
     * others are unaffected. A non-joined Picker allows navigation in any direction, but
     * requires individual ENTER presses on the incrementer and decrementer buttons. Pointer
     * interaction is the same for both formats.
     *
     * @type {Boolean}
     * @public
     */
    joined: _propTypes["default"].bool,

    /**
     * Prevents any transition animation for the component.
     *
     * @type {Boolean}
     * @public
     */
    noAnimation: _propTypes["default"].bool,

    /**
     * Called when the control should increment or decrement.
     *
     * @type {Function}
     * @public
     */
    onChange: _propTypes["default"].func,

    /**
     * Called when a condition occurs which should cause the expandable to close.
     *
     * @type {Function}
     * @public
     */
    onClose: _propTypes["default"].func,

    /**
     * Called when an item is picked.
     *
     * @type {Function}
     * @public
     */
    onPick: _propTypes["default"].func,

    /**
     * Called when the component is removed while retaining focus.
     *
     * @type {Function}
     * @param {Object} event
     * @public
     */
    onSpotlightDisappear: _propTypes["default"].func,

    /**
     * Called prior to focus leaving the expandable when the 5-way down key is pressed.
     *
     * @type {Function}
     * @param {Object} event
     * @public
     */
    onSpotlightDown: _propTypes["default"].func,

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
     * Opens ExpandablePicker with the contents visible.
     *
     * @type {Boolean}
     * @public
     */
    open: _propTypes["default"].bool,

    /**
     * Orientation of the picker.
     *
     * Controls whether the buttons are arranged horizontally or vertically around the value.
     *
     * * Values: `'horizontal'`, `'vertical'`
     *
     * @type {String}
     * @default 'horizontal'
     * @public
     */
    orientation: _propTypes["default"].oneOf(['horizontal', 'vertical']),

    /**
     * The "aria-label" for the picker.
     *
     * @type {String}
     * @public
     */
    pickerAriaLabel: _propTypes["default"].string,

    /**
     * Sets current locale to RTL.
     *
     * @type {Boolean}
     * @private
     */
    rtl: _propTypes["default"].bool,

    /**
     * Disables spotlight navigation into the component.
     *
     * @type {Boolean}
     * @default false
     * @public
     */
    spotlightDisabled: _propTypes["default"].bool,

    /**
     * Index of the selected child.
     *
     * @type {Number}
     * @default 0
     * @public
     */
    value: _propTypes["default"].number,

    /*
     * The width of the picker.
     *
     * A number can be used to set the minimum number of characters to be shown. Setting a
     * number to less than the number of characters in the longest value will cause the width to
     * grow for the longer values.
     *
     * A string can be used to select from pre-defined widths:
     * * `'small'` - numeric values
     * * `'medium'` - single or short words
     * * `'large'` - maximum-sized pickers taking full width of its parent
     *
     * By default, the picker will size according to the longest valid value.
     *
     * @type {String}
     * @public
     */
    width: _propTypes["default"].oneOf([null, 'small', 'medium', 'large']),

    /*
     * Allows picker to continue from the start of the list after it reaches the end and
     * vice-versa.
     *
     * @type {Boolean}
     * @public
     */
    wrap: _propTypes["default"].bool
  },
  defaultProps: {
    spotlightDisabled: false,
    value: 0
  },
  styles: {
    css: _ExpandablePickerModule["default"],
    className: 'expandablePicker'
  },
  handlers: {
    onChange: function onChange(ev, _ref) {
      var _onChange = _ref.onChange,
          onClose = _ref.onClose,
          value = _ref.value;

      if (onClose) {
        onClose();
      }

      if (_onChange) {
        _onChange({
          value: value
        });
      }
    }
  },
  computed: {
    label: function label(_ref2) {
      var children = _ref2.children,
          value = _ref2.value;
      return _react["default"].Children.toArray(children)[value];
    }
  },
  render: function render(props) {
    var checkButtonAriaLabel = props.checkButtonAriaLabel,
        children = props.children,
        decrementAriaLabel = props.decrementAriaLabel,
        decrementIcon = props.decrementIcon,
        disabled = props.disabled,
        incrementAriaLabel = props.incrementAriaLabel,
        incrementIcon = props.incrementIcon,
        joined = props.joined,
        noAnimation = props.noAnimation,
        onChange = props.onChange,
        onPick = props.onPick,
        onSpotlightDisappear = props.onSpotlightDisappear,
        onSpotlightDown = props.onSpotlightDown,
        onSpotlightLeft = props.onSpotlightLeft,
        onSpotlightRight = props.onSpotlightRight,
        open = props.open,
        orientation = props.orientation,
        pickerAriaLabel = props.pickerAriaLabel,
        rtl = props.rtl,
        spotlightDisabled = props.spotlightDisabled,
        value = props.value,
        width = props.width,
        wrap = props.wrap,
        rest = _objectWithoutProperties(props, ["checkButtonAriaLabel", "children", "decrementAriaLabel", "decrementIcon", "disabled", "incrementAriaLabel", "incrementIcon", "joined", "noAnimation", "onChange", "onPick", "onSpotlightDisappear", "onSpotlightDown", "onSpotlightLeft", "onSpotlightRight", "open", "orientation", "pickerAriaLabel", "rtl", "spotlightDisabled", "value", "width", "wrap"]);

    var voiceProps = (0, _util.extractVoiceProps)(rest);
    var isVoiceDisabled = voiceProps['data-webos-voice-disabled'];
    return _react["default"].createElement(_ExpandableItem.ExpandableItemBase, Object.assign({}, voiceProps, rest, {
      disabled: disabled,
      onSpotlightDisappear: onSpotlightDisappear,
      onSpotlightDown: !open ? onSpotlightDown : null,
      onSpotlightLeft: onSpotlightLeft,
      onSpotlightRight: onSpotlightRight,
      open: open,
      spotlightDisabled: spotlightDisabled
    }), _react["default"].createElement(_Picker["default"], {
      "aria-label": pickerAriaLabel,
      className: _ExpandablePickerModule["default"].picker,
      "data-webos-voice-disabled": isVoiceDisabled,
      decrementAriaLabel: decrementAriaLabel,
      decrementIcon: decrementIcon,
      disabled: disabled,
      incrementAriaLabel: incrementAriaLabel,
      incrementIcon: incrementIcon,
      joined: joined,
      noAnimation: noAnimation,
      onChange: onPick,
      onSpotlightDisappear: onSpotlightDisappear,
      onSpotlightDown: onSpotlightDown,
      onSpotlightLeft: !rtl ? onSpotlightLeft : null,
      onSpotlightRight: rtl ? onSpotlightRight : null,
      orientation: orientation,
      spotlightDisabled: spotlightDisabled,
      value: value,
      width: width,
      wrap: wrap
    }, children), _react["default"].createElement(_IconButton["default"], {
      "aria-label": checkButtonAriaLabel,
      className: _ExpandablePickerModule["default"].button,
      "data-webos-voice-disabled": isVoiceDisabled,
      onSpotlightDisappear: onSpotlightDisappear,
      onSpotlightDown: onSpotlightDown,
      onSpotlightLeft: rtl ? onSpotlightLeft : null,
      onSpotlightRight: !rtl ? onSpotlightRight : null,
      onTap: onChange,
      size: "small",
      spotlightDisabled: spotlightDisabled
    }, "check"));
  }
});
/**
 * A stateful component that renders a list of items into a picker that allows the user to select
 * only a single item at a time. It supports increment/decrement buttons for selection.
 *
 * By default, `ExpandablePicker` maintains the state of its `value` property. Supply the
 * `defaultValue` property to control its initial value. If you wish to directly control updates
 * to the component, supply a value to `value` at creation time and update it in response to
 * `onPick` events.
 *
 * `ExpandablePicker` maintains its open/closed state by default. The initial state can be supplied
 * using `defaultOpen`. In order to directly control the open/closed state, supply a value for
 * `open` at creation time and update its value in response to `onClose`/`onOpen` events.
 *
 * @class ExpandablePicker
 * @memberof moonstone/ExpandablePicker
 * @extends moonstone/ExpandablePicker.ExpandablePickerBase
 * @ui
 * @mixes moonstone/ExpandableItem.Expandable
 * @mixes ui/Changeable.Changeable
 * @public
 */

exports.ExpandablePickerBase = ExpandablePickerBase;
var ExpandablePicker = (0, _Pure["default"])((0, _I18nDecorator.I18nContextDecorator)({
  rtlProp: 'rtl'
}, (0, _ExpandableItem.Expandable)((0, _Changeable["default"])((0, _ExpandablePickerDecorator["default"])(ExpandablePickerBase)))));
exports.ExpandablePicker = ExpandablePicker;
var _default = ExpandablePicker;
exports["default"] = _default;