"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.LabeledItemBase = exports.LabeledItem = exports["default"] = void 0;

var _kind = _interopRequireDefault(require("@enact/core/kind"));

var _react = _interopRequireDefault(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _Pure = _interopRequireDefault(require("@enact/ui/internal/Pure"));

var _Touchable = _interopRequireDefault(require("@enact/ui/Touchable"));

var _Spottable = _interopRequireDefault(require("@enact/spotlight/Spottable"));

var _Icon = _interopRequireDefault(require("../Icon"));

var _Item = require("../Item");

var _Marquee = require("../Marquee");

var _Skinnable = _interopRequireDefault(require("../Skinnable"));

var _LabeledItemModule = _interopRequireDefault(require("./LabeledItem.module.css"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _objectWithoutProperties(source, excluded) { if (source == null) return {}; var target = _objectWithoutPropertiesLoose(source, excluded); var key, i; if (Object.getOwnPropertySymbols) { var sourceSymbolKeys = Object.getOwnPropertySymbols(source); for (i = 0; i < sourceSymbolKeys.length; i++) { key = sourceSymbolKeys[i]; if (excluded.indexOf(key) >= 0) continue; if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue; target[key] = source[key]; } } return target; }

function _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }

var Controller = (0, _Marquee.MarqueeController)({
  marqueeOnFocus: true
}, (0, _Touchable["default"])((0, _Spottable["default"])(_Item.ItemBase)));

/**
 * A focusable component that combines marquee-able text content with a synchronized
 * marquee-able text label.
 *
 * @class LabeledItemBase
 * @memberof moonstone/LabeledItem
 * @extends moonstone/Item.ItemBase
 * @mixes spotlight/Spottable.Spottable
 * @mixes ui/Touchable.Touchable
 * @mixes moonstone/Marquee.MarqueeController
 * @ui
 * @public
 */
var LabeledItemBase = (0, _kind["default"])({
  name: 'LabeledItem',
  propTypes:
  /** @lends moonstone/LabeledItem.LabeledItemBase.prototype */
  {
    /**
     * The node to be displayed as the main content of the item.
     *
     * @type {Node}
     * @required
     * @public
     */
    children: _propTypes["default"].node.isRequired,

    /**
     * Customizes the component by mapping the supplied collection of CSS class names to the
     * corresponding internal Elements and states of this component.
     *
     * The following classes are supported:
     *
     * * `labeledItem` - The root class name
     * * `icon` - Applied to the icon
     * * `label` - Applied to the label
     *
     * @type {Object}
     * @public
     */
    css: _propTypes["default"].object,

    /**
     * Applies a disabled style and the control becomes non-interactive.
     *
     * @type {Boolean}
     * @public
     */
    disabled: _propTypes["default"].bool,

    /**
     * The label to be displayed along with the text.
     *
     * @type {Node}
     * @public
     */
    label: _propTypes["default"].node,

    /**
     * Determines what triggers the `LabelItem`'s marquee to start its animation.
     *
     * @type {('focus'|'hover'|'render')}
     * @default 'focus'
     * @public
     */
    marqueeOn: _propTypes["default"].oneOf(['focus', 'hover', 'render']),

    /**
     * Icon to be displayed next to the title text.
     *
     * @type {String|Object}
     * @public
     */
    titleIcon: _propTypes["default"].oneOfType([_propTypes["default"].string, _propTypes["default"].object])
  },
  styles: {
    css: _LabeledItemModule["default"],
    className: 'labeledItem',
    publicClassNames: ['labeledItem', 'icon', 'label']
  },
  render: function render(_ref) {
    var children = _ref.children,
        css = _ref.css,
        disabled = _ref.disabled,
        label = _ref.label,
        marqueeOn = _ref.marqueeOn,
        titleIcon = _ref.titleIcon,
        rest = _objectWithoutProperties(_ref, ["children", "css", "disabled", "label", "marqueeOn", "titleIcon"]);

    return _react["default"].createElement(Controller, Object.assign({
      disabled: disabled
    }, rest, {
      css: css
    }), _react["default"].createElement("div", {
      className: css.text
    }, _react["default"].createElement(_Marquee.Marquee, {
      disabled: disabled,
      className: css.title,
      marqueeOn: marqueeOn
    }, children), titleIcon != null ? _react["default"].createElement(_Icon["default"], {
      size: "small",
      className: css.icon
    }, titleIcon) : null), label != null ? _react["default"].createElement(_Marquee.Marquee, {
      disabled: disabled,
      className: css.label,
      marqueeOn: marqueeOn
    }, label) : null);
  }
});
/**
 * A Moonstone styled labeled item with built-in support for marqueed text and Spotlight focus.
 *
 * @class LabeledItem
 * @memberof moonstone/LabeledItem
 * @extends moonstone/LabeledItem.LabeledItemBase
 * @mixes moonstone/Skinnable.Skinnable
 * @ui
 * @public
 */

exports.LabeledItemBase = LabeledItemBase;
var LabeledItem = (0, _Pure["default"])((0, _Skinnable["default"])(LabeledItemBase));
exports.LabeledItem = LabeledItem;
var _default = LabeledItem;
exports["default"] = _default;