"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.SelectableItemDecorator = exports.SelectableItemBase = exports.SelectableItem = exports["default"] = void 0;

var _kind = _interopRequireDefault(require("@enact/core/kind"));

var _react = _interopRequireDefault(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _ToggleItem = require("../ToggleItem");

var _SelectableIcon = _interopRequireDefault(require("./SelectableIcon"));

var _SelectableItemModule = _interopRequireDefault(require("./SelectableItem.module.css"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

/**
 * Provides a Moonstone-themed [Item]{@link moonstone/Item} with an icon that toggles on and off.
 *
 * @example
 * <SelectableItem>Click Me</SelectableItem>
 *
 * @module moonstone/SelectableItem
 * @exports SelectableItem
 * @exports SelectableItemBase
 * @exports SelectableItemDecorator
 */

/**
 * Renders an [Item]{@link moonstone/Item} with a circle icon, by default.
 *
 * @class SelectableItemBase
 * @memberof moonstone/SelectableItem
 * @extends moonstone/ToggleItem.ToggleItemBase
 * @omit iconComponent
 * @ui
 * @public
 */
var SelectableItemBase = (0, _kind["default"])({
  name: 'SelectableItem',
  propTypes:
  /** @lends moonstone/SelectableItem.SelectableItemBase.prototype */
  {
    /**
     * Customizes the component by mapping the supplied collection of CSS class names to the
     * corresponding internal Elements and states of this component.
     *
     * The following classes are supported:
     *
     * * `selectableItem` - The root class name
     *
     * @type {Object}
     * @public
     */
    css: _propTypes["default"].object
  },
  styles: {
    css: _SelectableItemModule["default"],
    className: 'selectableItem',
    publicClassNames: ['selectableItem']
  },
  render: function render(props) {
    return _react["default"].createElement(_ToggleItem.ToggleItemBase, Object.assign({
      "data-webos-voice-intent": "SelectCheckItem"
    }, props, {
      css: props.css,
      iconComponent: _SelectableIcon["default"]
    }));
  }
});
/**
 * Adds interactive toggle functionality to `SelectableItemBase`.
 *
 * @class SelectableItemDecorator
 * @memberof moonstone/SelectableItem
 * @mixes moonstone/ToggleItem.ToggleItemDecorator
 * @hoc
 * @public
 */

exports.SelectableItemBase = SelectableItemBase;
var SelectableItemDecorator = (0, _ToggleItem.ToggleItemDecorator)({
  invalidateProps: ['inline', 'selected']
});
/**
 * A Moonstone-styled item with a toggle icon, marqueed text, and `Spotlight` focus.
 *
 * @class SelectableItem
 * @memberof moonstone/SelectableItem
 * @extends moonstone/SelectableItem.SelectableItemBase
 * @mixes moonstone/SelectableItem.SelectableItemDecorator
 * @ui
 * @public
 */

exports.SelectableItemDecorator = SelectableItemDecorator;
var SelectableItem = SelectableItemDecorator(SelectableItemBase);
exports.SelectableItem = SelectableItem;
var _default = SelectableItem;
exports["default"] = _default;