"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ToggleItemDecorator = exports.ToggleItemBase = exports.ToggleItem = exports["default"] = void 0;

var _hoc = _interopRequireDefault(require("@enact/core/hoc"));

var _kind = _interopRequireDefault(require("@enact/core/kind"));

var _propTypes = _interopRequireDefault(require("@enact/core/internal/prop-types"));

var _Pure = _interopRequireDefault(require("@enact/ui/internal/Pure"));

var _react = _interopRequireDefault(require("react"));

var _propTypes2 = _interopRequireDefault(require("prop-types"));

var _ToggleItem = require("@enact/ui/ToggleItem");

var _Spottable = _interopRequireDefault(require("@enact/spotlight/Spottable"));

var _compose = _interopRequireDefault(require("ramda/src/compose"));

var _Marquee = require("../Marquee");

var _Skinnable = _interopRequireDefault(require("../Skinnable"));

var _SlotItem = require("../SlotItem");

var _ToggleItemModule = _interopRequireDefault(require("./ToggleItem.module.css"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

/**
 * A Moonstone-themed [Item]{@link moonstone/Item} used as the basis for other stylized toggle item
 * components.
 *
 * Note: This is not intended to be used directly, but should be extended by a component that will
 * customize this component's appearance by supplying an
 * [iconComponent prop]{@link moonstone/ToggleItem.ToggleItemBase#iconComponent}.
 *
 * @example
 * <ToggleItem
 * 	iconComponent={Checkbox}
 * 	iconPosition='before'>
 * 	Toggle me
 * </ToggleItem>
 *
 * @module moonstone/ToggleItem
 * @exports ToggleItem
 * @exports ToggleItemBase
 * @exports ToggleItemDecorator
 */

/**
 * A Moonstone-styled toggle [Item]{@link moonstone/Item} without any behavior.
 *
 * @class ToggleItemBase
 * @memberof moonstone/ToggleItem
 * @ui
 * @public
 */
var ToggleItemBase = (0, _kind["default"])({
  name: 'ToggleItem',
  propTypes:
  /** @lends moonstone/ToggleItem.ToggleItemBase.prototype */
  {
    /**
     * The content to be displayed as the main content of the toggle item.
     *
     * @type {Node}
     * @required
     * @public
     */
    children: _propTypes2["default"].node.isRequired,

    /**
     * The icon component to render in this item.
     *
     * This component receives the `selected` prop and value, and must therefore respond to it in some
     * way. It is recommended to use [ToggleIcon]{@link moonstone/ToggleIcon} for this.
     *
     * @type {Component|Element}
     * @required
     * @public
     */
    iconComponent: _propTypes["default"].componentOverride.isRequired,

    /**
     * Customizes the component by mapping the supplied collection of CSS class names to the
     * corresponding internal Elements and states of this component.
     *
     * The following classes are supported:
     *
     * * `toggleItem` - The root class name
     *
     * @type {Object}
     * @public
     */
    css: _propTypes2["default"].object,

    /**
     * Overrides the icon of the `iconComponent` component.
     *
     * This accepts any string that the [Icon]{@link moonstone/Icon.Icon} component supports,
     * provided the recommendations of `iconComponent` are followed.
     *
     * @type {String}
     * @public
     */
    icon: _propTypes2["default"].string
  },
  styles: {
    css: _ToggleItemModule["default"],
    publicClassNames: ['toggleItem', 'slot']
  },
  render: function render(props) {
    return _react["default"].createElement(_ToggleItem.ToggleItemBase, Object.assign({
      role: "checkbox"
    }, props, {
      component: _SlotItem.SlotItemBase,
      css: props.css
    }));
  }
});
/**
 * Default config for {@link moonstone/ToggleItem.ToggleItemDecorator}.
 *
 * @memberof moonstone/ToggleItem.ToggleItemDecorator
 * @hocconfig
 */

exports.ToggleItemBase = ToggleItemBase;
var defaultConfig = {
  /**
   * Invalidate the distance of marquee text if any property (like 'inline') changes.
   * Expects an array of props which on change trigger invalidateMetrics.
   *
   * @type {String[]}
   * @default ['inline']
   * @memberof moonstone/ToggleItem.ToggleItemDecorator.defaultConfig
   */
  invalidateProps: ['inline']
};
/**
 * Adds interactive functionality to `ToggleItemBase`.
 *
 * @class ToggleItemDecorator
 * @memberof moonstone/ToggleItem
 * @mixes ui/ToggleItem.ToggleItemDecorator
 * @mixes spotlight/Spottable.Spottable
 * @mixes moonstone/Marquee.MarqueeDecorator
 * @mixes moonstone/Skinnable
 * @hoc
 * @public
 */

var ToggleItemDecorator = (0, _hoc["default"])(defaultConfig, function (_ref, Wrapped) {
  var invalidateProps = _ref.invalidateProps;
  return (0, _compose["default"])(_Pure["default"], _ToggleItem.ToggleItemDecorator, _Spottable["default"], (0, _Marquee.MarqueeDecorator)({
    className: _ToggleItemModule["default"].content,
    invalidateProps: invalidateProps
  }), _Skinnable["default"])(Wrapped);
});
/**
 * A Moonstone-styled item with built-in support for toggling, marqueed text, and `Spotlight` focus.
 *
 * This is not intended to be used directly, but should be extended by a component that will
 * customize this component's appearance by supplying an `iconComponent` prop.
 *
 * @class ToggleItem
 * @memberof moonstone/ToggleItem
 * @extends moonstone/ToggleItem.ToggleItemBase
 * @mixes moonstone/ToggleItem.ToggleItemDecorator
 * @ui
 * @public
 */

exports.ToggleItemDecorator = ToggleItemDecorator;
var ToggleItem = ToggleItemDecorator(ToggleItemBase);
/**
 * The Icon to render in this item.
 *
 * This component receives the `selected` prop and value, and must therefore respond to it in some
 * way. It is recommended to use [ToggleIcon]{@link moonstone/ToggleIcon} for this.
 *
 * @name iconComponent
 * @memberof moonstone/ToggleItem.ToggleItem.prototype
 * @type {Component|Element}
 * @default null
 * @required
 * @public
 */

exports.ToggleItem = ToggleItem;
var _default = ToggleItem;
exports["default"] = _default;