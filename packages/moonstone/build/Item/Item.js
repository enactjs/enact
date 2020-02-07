"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ItemDecorator = exports.ItemBase = exports.Item = exports["default"] = void 0;

var _kind = _interopRequireDefault(require("@enact/core/kind"));

var _Spottable = _interopRequireDefault(require("@enact/spotlight/Spottable"));

var _Item = require("@enact/ui/Item");

var _Pure = _interopRequireDefault(require("@enact/ui/internal/Pure"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _compose = _interopRequireDefault(require("ramda/src/compose"));

var _react = _interopRequireDefault(require("react"));

var _Marquee = require("../Marquee");

var _Skinnable = _interopRequireDefault(require("../Skinnable"));

var _ItemModule = _interopRequireDefault(require("./Item.module.css"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _objectWithoutProperties(source, excluded) { if (source == null) return {}; var target = _objectWithoutPropertiesLoose(source, excluded); var key, i; if (Object.getOwnPropertySymbols) { var sourceSymbolKeys = Object.getOwnPropertySymbols(source); for (i = 0; i < sourceSymbolKeys.length; i++) { key = sourceSymbolKeys[i]; if (excluded.indexOf(key) >= 0) continue; if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue; target[key] = source[key]; } } return target; }

function _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }

/**
 * A Moonstone styled item without any behavior.
 *
 * @class ItemBase
 * @memberof moonstone/Item
 * @extends ui/Item.ItemBase
 * @ui
 * @public
 */
var ItemBase = (0, _kind["default"])({
  name: 'Item',
  propTypes:
  /** @lends moonstone/Item.ItemBase.prototype */
  {
    /**
     * Customizes the component by mapping the supplied collection of CSS class names to the
     * corresponding internal Elements and states of this component.
     *
     * The following classes are supported:
     *
     * * `item` - The root class name
     *
     * @type {Object}
     * @public
     */
    css: _propTypes["default"].object
  },
  styles: {
    css: _ItemModule["default"],
    publicClassNames: 'item'
  },
  render: function render(_ref) {
    var css = _ref.css,
        rest = _objectWithoutProperties(_ref, ["css"]);

    return _react["default"].createElement(_Item.ItemBase, Object.assign({
      "data-webos-voice-intent": "Select"
    }, rest, {
      css: css
    }));
  }
});
/**
 * Moonstone specific item behaviors to apply to [Item]{@link moonstone/Item.ItemBase}.
 *
 * @class ItemDecorator
 * @hoc
 * @memberof moonstone/Item
 * @mixes spotlight.Spottable
 * @mixes moonstone/Marquee.MarqueeDecorator
 * @mixes moonstone/Skinnable
 * @ui
 * @public
 */

exports.ItemBase = ItemBase;
var ItemDecorator = (0, _compose["default"])(_Pure["default"], _Item.ItemDecorator, _Spottable["default"], (0, _Marquee.MarqueeDecorator)({
  invalidateProps: ['inline', 'autoHide']
}), _Skinnable["default"]);
/**
 * A Moonstone styled item with built-in support for marqueed text, and Spotlight focus.
 *
 * Usage:
 * ```
 * <Item>Item Content</Item>
 * ```
 *
 * @class Item
 * @memberof moonstone/Item
 * @extends moonstone/Item.ItemBase
 * @mixes moonstone/Item.ItemDecorator
 * @ui
 * @public
 */

exports.ItemDecorator = ItemDecorator;
var Item = ItemDecorator(ItemBase);
exports.Item = Item;
var _default = Item;
exports["default"] = _default;