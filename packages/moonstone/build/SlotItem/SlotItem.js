"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.SlotItemDecorator = exports.SlotItemBase = exports.SlotItem = exports["default"] = void 0;

var _kind = _interopRequireDefault(require("@enact/core/kind"));

var _Spottable = _interopRequireDefault(require("@enact/spotlight/Spottable"));

var _Pure = _interopRequireDefault(require("@enact/ui/internal/Pure"));

var _SlotItem = require("@enact/ui/SlotItem");

var _Item = require("@enact/ui/Item");

var _Toggleable = _interopRequireDefault(require("@enact/ui/Toggleable"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _compose = _interopRequireDefault(require("ramda/src/compose"));

var _react = _interopRequireDefault(require("react"));

var _Item2 = require("../Item");

var _Marquee = require("../Marquee");

var _Skinnable = _interopRequireDefault(require("../Skinnable"));

var _SlotItemModule = _interopRequireDefault(require("./SlotItem.module.css"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

/**
 * Provides a Moonstone-themed item component that accepts multiple positions for children.
 *
 * Using the usual `children` prop, as well as two additional props: `slotBefore`, and `slotAfter`.
 * It is customizable by a theme or application.
 *
 * @example
 * <SlotItem autoHide="both">
 * 	<slotBefore>
 * 		<Icon>flag</Icon>
 * 		<Icon>star</Icon>
 * 	</slotBefore>
 * 	An Item that will show some icons before and after this text when spotted
 * 	<Icon slot="slotAfter">trash</Icon>
 * </SlotItem>
 *
 * @module moonstone/SlotItem
 * @exports SlotItem
 * @exports SlotItemBase
 * @exports SlotItemDecorator
 */

/**
 * A moonstone-styled SlotItem without any behavior.
 *
 * @class SlotItemBase
 * @memberof moonstone/SlotItem
 * @extends ui/SlotItem.SlotItemBase
 * @omit component
 * @mixes moonstone/Item.ItemBase
 * @ui
 * @public
 */
var SlotItemBase = (0, _kind["default"])({
  name: 'SlotItem',
  propTypes:
  /** @lends moonstone/SlotItem.SlotItemBase.prototype */
  {
    /**
     * Customizes the component by mapping the supplied collection of CSS class names to the
     * corresponding internal Elements and states of this component.
     *
     * The following classes are supported:
     *
     * * `slotItem` - The root class name
     *
     * @type {Object}
     * @public
     */
    css: _propTypes["default"].object
  },
  styles: {
    css: _SlotItemModule["default"],
    publicClassNames: ['slotItem', 'slot']
  },
  render: function render(props) {
    return _react["default"].createElement(_SlotItem.SlotItemBase, Object.assign({}, props, {
      component: _Item2.ItemBase,
      css: props.css
    }));
  }
});
/**
 * Moonstone-specific item with overlay behaviors to apply to SlotItem.
 *
 * @class SlotItemDecorator
 * @memberof moonstone/SlotItem
 * @mixes ui/SlotItem.SlotItemDecorator
 * @mixes ui/Toggleable
 * @mixes spotlight.Spottable
 * @mixes moonstone/Marquee.MarqueeDecorator
 * @mixes moonstone/Skinnable
 * @hoc
 * @public
 */

exports.SlotItemBase = SlotItemBase;
var SlotItemDecorator = (0, _compose["default"])(_SlotItem.SlotItemDecorator, _Pure["default"], (0, _Toggleable["default"])({
  prop: 'remeasure',
  activate: 'onFocus',
  deactivate: 'onBlur',
  toggle: null
}), _Item.ItemDecorator, // (Touchable)
_Spottable["default"], (0, _Marquee.MarqueeDecorator)({
  className: _SlotItemModule["default"].content,
  invalidateProps: ['inline', 'autoHide', 'remeasure']
}), _Skinnable["default"]);
/**
 * A Moonstone-styled item with built-in support for overlays.
 *
 * ```
 *	<SlotItem autoHide="both">
 *		<slotBefore>
 *			<Icon>flag</Icon>
 *			<Icon>star</Icon>
 *		</slotBefore>
 *		An Item that will show some icons before and after this text when spotted
 *		<Icon slot="slotAfter">trash</Icon>
 *	</SlotItem>
 * ```
 *
 * @class SlotItem
 * @memberof moonstone/SlotItem
 * @extends moonstone/SlotItem.SlotItemBase
 * @mixes moonstone/SlotItem.SlotItemDecorator
 * @ui
 * @public
 */

exports.SlotItemDecorator = SlotItemDecorator;
var SlotItem = SlotItemDecorator(SlotItemBase);
exports.SlotItem = SlotItem;
var _default = SlotItem;
exports["default"] = _default;