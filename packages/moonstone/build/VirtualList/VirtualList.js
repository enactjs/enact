"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
Object.defineProperty(exports, "VirtualListBase", {
  enumerable: true,
  get: function get() {
    return _VirtualListBase.VirtualListBase;
  }
});
Object.defineProperty(exports, "VirtualListBaseNative", {
  enumerable: true,
  get: function get() {
    return _VirtualListBase.VirtualListBaseNative;
  }
});
exports.VirtualListNative = exports.VirtualList = exports.VirtualGridListNative = exports.VirtualGridList = exports["default"] = void 0;

var _kind = _interopRequireDefault(require("@enact/core/kind"));

var _VirtualList = require("@enact/ui/VirtualList");

var _propTypes = _interopRequireDefault(require("prop-types"));

var _react = _interopRequireDefault(require("react"));

var _VirtualListBase = require("./VirtualListBase");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _objectWithoutProperties(source, excluded) { if (source == null) return {}; var target = _objectWithoutPropertiesLoose(source, excluded); var key, i; if (Object.getOwnPropertySymbols) { var sourceSymbolKeys = Object.getOwnPropertySymbols(source); for (i = 0; i < sourceSymbolKeys.length; i++) { key = sourceSymbolKeys[i]; if (excluded.indexOf(key) >= 0) continue; if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue; target[key] = source[key]; } } return target; }

function _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }

/**
 * A Moonstone-styled scrollable and spottable virtual list component.
 *
 * @class VirtualList
 * @memberof moonstone/VirtualList
 * @extends moonstone/VirtualList.VirtualListBase
 * @ui
 * @public
 */
var VirtualList = (0, _kind["default"])({
  name: 'VirtualList',
  propTypes:
  /** @lends moonstone/VirtualList.VirtualList.prototype */
  {
    /**
     * Size of an item for the VirtualList; valid value is a number generally.
     * For different item size, value is an object that has `minSize`
     * and `size` as properties.
     * If the direction for the list is vertical, itemSize means the height of an item.
     * For horizontal, it means the width of an item.
     *
     * Usage:
     * ```
     * <VirtualList itemSize={ri.scale(72)} />
     * ```
     *
     * @type {Number|ui/VirtualList.itemSizesShape}
     * @required
     * @public
     */
    itemSize: _propTypes["default"].oneOfType([_propTypes["default"].number, _VirtualList.itemSizesShape]).isRequired
  },
  render: function render(_ref) {
    var itemSize = _ref.itemSize,
        rest = _objectWithoutProperties(_ref, ["itemSize"]);

    var props = itemSize && itemSize.minSize ? {
      itemSize: itemSize.minSize,
      itemSizes: itemSize.size
    } : {
      itemSize: itemSize
    };
    return _react["default"].createElement(_VirtualListBase.ScrollableVirtualList, Object.assign({}, rest, props));
  }
});
/**
 * A Moonstone-styled scrollable and spottable virtual grid list component.
 *
 * @class VirtualGridList
 * @memberof moonstone/VirtualList
 * @extends moonstone/VirtualList.VirtualListBase
 * @ui
 * @public
 */

exports.VirtualList = VirtualList;
var VirtualGridList = (0, _kind["default"])({
  name: 'VirtualGridList',
  propTypes:
  /** @lends moonstone/VirtualList.VirtualGridList.prototype */
  {
    /**
     * Size of an item for the VirtualGridList; valid value is an object that has `minWidth`
     * and `minHeight` as properties.
     *
     * Usage:
     * ```
     * <VirtualGridList
     * 	itemSize={{
     * 		minWidth: ri.scale(180),
     * 		minHeight: ri.scale(270)
     * 	}}
     * />
     * ```
     *
     * @type {ui/VirtualList.gridListItemSizeShape}
     * @required
     * @public
     */
    itemSize: _VirtualList.gridListItemSizeShape.isRequired
  },
  render: function render(props) {
    return _react["default"].createElement(_VirtualListBase.ScrollableVirtualList, props);
  }
});
/**
 * A Moonstone-styled scrollable and spottable virtual native list component.
 * For smooth native scrolling, web engine with below Chromium 61, should be launched
 * with the flag '--enable-blink-features=CSSOMSmoothScroll' to support it.
 * The one with Chromium 61 or above, is launched to support it by default.
 *
 * @class VirtualListNative
 * @memberof moonstone/VirtualList
 * @extends moonstone/VirtualList.VirtualListBaseNative
 * @ui
 * @private
 */

exports.VirtualGridList = VirtualGridList;
var VirtualListNative = (0, _kind["default"])({
  name: 'VirtualListNative',
  propTypes:
  /** @lends moonstone/VirtualList.VirtualListNative.prototype */
  {
    /**
     * Size of an item for the VirtualList; valid value is a number.
     * For different item size, value is an object that has `minSize`
     * and `size` as properties.
     * If the direction for the list is vertical, itemSize means the height of an item.
     * For horizontal, it means the width of an item.
     *
     * Usage:
     * ```
     * <VirtualListNative itemSize={ri.scale(72)} />
     * ```
     *
     * @type {Number|ui/VirtualList.itemSizesShape}
     * @required
     * @public
     */
    itemSize: _propTypes["default"].oneOfType([_propTypes["default"].number, _VirtualList.itemSizesShape]).isRequired
  },
  render: function render(_ref2) {
    var itemSize = _ref2.itemSize,
        rest = _objectWithoutProperties(_ref2, ["itemSize"]);

    var props = itemSize && itemSize.minSize ? {
      itemSize: itemSize.minSize,
      itemSizes: itemSize.size
    } : {
      itemSize: itemSize
    };
    return _react["default"].createElement(_VirtualListBase.ScrollableVirtualListNative, Object.assign({}, rest, props));
  }
});
/**
 * A Moonstone-styled scrollable and spottable virtual grid native list component.
 * For smooth native scrolling, web engine with below Chromium 61, should be launched
 * with the flag '--enable-blink-features=CSSOMSmoothScroll' to support it.
 * The one with Chromium 61 or above, is launched to support it by default.
 *
 * @class VirtualGridListNative
 * @memberof moonstone/VirtualList
 * @extends moonstone/VirtualList.VirtualListBaseNative
 * @ui
 * @private
 */

exports.VirtualListNative = VirtualListNative;
var VirtualGridListNative = (0, _kind["default"])({
  name: 'VirtualGridListNative',
  propTypes:
  /** @lends moonstone/VirtualList.VirtualGridListNative.prototype */
  {
    /**
     * Size of an item for the VirtualGridList; valid value is an object that has `minWidth`
     * and `minHeight` as properties.
     *
     * Usage:
     * ```
     * <VirtualGridListNative
     * 	itemSize={{
     * 		minWidth: ri.scale(180),
     * 		minHeight: ri.scale(270)
     * 	}}
     * />
     * ```
     *
     * @type {ui/VirtualList.gridListItemSizeShape}
     * @required
     * @public
     */
    itemSize: _VirtualList.gridListItemSizeShape.isRequired
  },
  render: function render(props) {
    return _react["default"].createElement(_VirtualListBase.ScrollableVirtualListNative, props);
  }
});
exports.VirtualGridListNative = VirtualGridListNative;
var _default = VirtualList;
exports["default"] = _default;