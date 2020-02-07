"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ToggleIconDecorator = exports.ToggleIconBase = exports.ToggleIcon = exports["default"] = void 0;

var _kind = _interopRequireDefault(require("@enact/core/kind"));

var _Pure = _interopRequireDefault(require("@enact/ui/internal/Pure"));

var _ToggleIcon = _interopRequireDefault(require("@enact/ui/ToggleIcon"));

var _compose = _interopRequireDefault(require("ramda/src/compose"));

var _react = _interopRequireDefault(require("react"));

var _Icon = _interopRequireDefault(require("../Icon"));

var _Skinnable = _interopRequireDefault(require("../Skinnable"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

/**
 * Provides Moonstone-themed Icon component with interactive toggleable capabilities.
 *
 * `ToggleIcon` does not implement a visual change when a user interacts with the control and must
 * be customized by the consumer using [css className
 * overrides]{@link ui/ToggleIcon.ToggleIconBase.css}.
 *
 * Often, an [Icon value]{@link moonstone/Icon.Icon} is passed as `children` to represent the
 * selected state but is not required. Omitting `children` allows the consumer to implement more
 * advanced approaches such as styling the `::before` and `::after` pseudo-elements to save a DOM
 * node.
 *
 * The following Moonstone components use `ToggleIcon`, and make good examples of various usages.
 *
 * * [Checkbox]{@link moonstone/Checkbox.Checkbox},
 * * [FormCheckbox]{@link moonstone/FormCheckbox.FormCheckbox},
 * * [Switch]{@link moonstone/Switch.Switch},
 * * [RadioItem]{@link moonstone/RadioItem.RadioItem}, and
 * * [SelectableItem]{@link moonstone/SelectableItem.SelectableItem}.
 *
 * @example
 * <ToggleIcon onToggle={(props)=> console.log(props.selected)}>
 *   check
 * </ToggleIcon>
 *
 * @module moonstone/ToggleIcon
 * @exports ToggleIcon
 * @exports ToggleIconBase
 * @exports ToggleIconDecorator
 */

/**
 * A component that indicates a boolean state.
 *
 * @class ToggleIconBase
 * @memberof moonstone/ToggleIcon
 * @extends ui/ToggleIcon.ToggleIcon
 * @ui
 * @public
 */
var ToggleIconBase = (0, _kind["default"])({
  name: 'ToggleIcon',
  render: function render(props) {
    return _react["default"].createElement(_ToggleIcon["default"], Object.assign({}, props, {
      iconComponent: _Icon["default"]
    }));
  }
});
/**
 * Moonstone-specific behaviors to apply to `ToggleIconBase`.
 *
 * @hoc
 * @memberof moonstone/ToggleIcon
 * @mixes moonstone/Skinnable.Skinnable
 * @public
 */

exports.ToggleIconBase = ToggleIconBase;
var ToggleIconDecorator = (0, _compose["default"])(_Pure["default"], _Skinnable["default"]);
/**
 * A customizable Moonstone starting point [Icon]{@link moonstone/Icon.Icon} that responds to the
 * `selected` prop.
 *
 * @class ToggleIcon
 * @memberof moonstone/ToggleIcon
 * @extends moonstone/ToggleIcon.ToggleIconBase
 * @mixes moonstone/ToggleIcon.ToggleIconDecorator
 * @ui
 * @public
 */

exports.ToggleIconDecorator = ToggleIconDecorator;
var ToggleIcon = ToggleIconDecorator(ToggleIconBase);
exports.ToggleIcon = ToggleIcon;
var _default = ToggleIcon;
exports["default"] = _default;