"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.GridListImageItemDecorator = exports.GridListImageItemBase = exports.GridListImageItem = exports["default"] = void 0;

var _compose = _interopRequireDefault(require("ramda/src/compose"));

var _GridListImageItem = require("@enact/ui/GridListImageItem");

var _kind = _interopRequireDefault(require("@enact/core/kind"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _react = _interopRequireDefault(require("react"));

var _Spottable = _interopRequireDefault(require("@enact/spotlight/Spottable"));

var _Icon = _interopRequireDefault(require("../Icon"));

var _Image = require("../Image");

var _Marquee = require("../Marquee");

var _Skinnable = _interopRequireDefault(require("../Skinnable"));

var _GridListImageItemModule = _interopRequireDefault(require("./GridListImageItem.module.css"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _objectWithoutProperties(source, excluded) { if (source == null) return {}; var target = _objectWithoutPropertiesLoose(source, excluded); var key, i; if (Object.getOwnPropertySymbols) { var sourceSymbolKeys = Object.getOwnPropertySymbols(source); for (i = 0; i < sourceSymbolKeys.length; i++) { key = sourceSymbolKeys[i]; if (excluded.indexOf(key) >= 0) continue; if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue; target[key] = source[key]; } } return target; }

function _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }

var defaultPlaceholder = 'data:image/svg+xml;charset=utf-8;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC' + '9zdmciPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIHN0cm9rZT0iIzU1NSIgZmlsbD0iI2FhYSIg' + 'ZmlsbC1vcGFjaXR5PSIwLjIiIHN0cm9rZS1vcGFjaXR5PSIwLjgiIHN0cm9rZS13aWR0aD0iNiIgLz48L3N2Zz' + '4NCg==',
    captionComponent = function captionComponent(props) {
  return _react["default"].createElement(_Marquee.Marquee, Object.assign({
    alignment: "center",
    marqueeOn: "hover"
  }, props));
};
/**
 * A Moonstone styled base component for [GridListImageItem]{@link moonstone/GridListImageItem.GridListImageItem}.
 *
 * @class GridListImageItemBase
 * @extends ui/GridListImageItem.GridListImageItem
 * @memberof moonstone/GridListImageItem
 * @ui
 * @public
 */


var GridListImageItemBase = (0, _kind["default"])({
  name: 'GridListImageItem',
  propTypes:
  /** @lends moonstone/GridListImageItem.GridListImageItemBase.prototype */
  {
    /**
     * Customizes the component by mapping the supplied collection of CSS class names to the
     * corresponding internal Elements and states of this component.
     *
     * The following classes are supported:
     *
     * * `icon` - The icon component class for default selection overlay
     * * `image` - The image component class
     * * `selected` - Applied when `selected` prop is `true`
     * * `caption` - The caption component class
     * * `subCaption` - The subCaption component class
     *
     * @type {Object}
     * @public
     */
    css: _propTypes["default"].object,

    /**
     * The voice control intent.
     *
     * @type {String}
     * @default 'Select'
     * @memberof moonstone/GridListImageItem.GridListImageItemBase.prototype
     * @public
     */
    'data-webos-voice-intent': _propTypes["default"].string,

    /**
     * Placeholder image used while [source]{@link ui/GridListImageItem.GridListImageItem#source}
     * is loaded.
     *
     * @type {String}
     * @default 'data:image/svg+xml;charset=utf-8;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC' +
     * '9zdmciPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIHN0cm9rZT0iIzU1NSIgZmlsbD0iI2FhYSIg' +
     * 'ZmlsbC1vcGFjaXR5PSIwLjIiIHN0cm9rZS1vcGFjaXR5PSIwLjgiIHN0cm9rZS13aWR0aD0iNiIgLz48L3N2Zz' +
     * '4NCg=='
     * @public
     */
    placeholder: _propTypes["default"].string,

    /**
     * Applies a selected visual effect to the image, but only if `selectionOverlayShowing`
     * is also `true`.
     *
     * @type {Boolean}
     * @default false
     * @public
     */
    selected: _propTypes["default"].bool,

    /**
     * The custom selection overlay component to render. A component can be a stateless functional
     * component, `kind()` or React component. The following is an example with custom selection
     * overlay kind.
     *
     * Usage:
     * ```
     * const SelectionOverlay = kind({
     * 	render: () => <div>custom overlay</div>
     * });
     *
     * <GridListImageItem selectionOverlay={SelectionOverlay} />
     * ```
     *
     * @type {Function}
     * @public
     */
    selectionOverlay: _propTypes["default"].func
  },
  defaultProps: {
    'data-webos-voice-intent': 'Select',
    placeholder: defaultPlaceholder,
    selected: false
  },
  styles: {
    css: _GridListImageItemModule["default"],
    publicClassNames: ['gridListImageItem', 'icon', 'image', 'selected', 'caption', 'subCaption']
  },
  render: function render(_ref) {
    var css = _ref.css,
        selectionOverlay = _ref.selectionOverlay,
        rest = _objectWithoutProperties(_ref, ["css", "selectionOverlay"]);

    if (selectionOverlay) {
      rest['role'] = 'checkbox';
      rest['aria-checked'] = rest.selected;
    }

    return _react["default"].createElement(_GridListImageItem.GridListImageItem, Object.assign({}, rest, {
      captionComponent: captionComponent,
      css: css,
      iconComponent: _Icon["default"],
      imageComponent: _Image.ImageBase,
      selectionOverlay: selectionOverlay
    }));
  }
});
/**
 * Moonstone-specific GridListImageItem behaviors to apply to
 * [GridListImageItem]{@link moonstone/GridListImageItem.GridListImageItem}.
 *
 * @hoc
 * @memberof moonstone/GridListImageItem
 * @mixes moonstone/Marquee.MarqueeController
 * @mixes spotlight/Spottable.Spottable
 * @mixes moonstone/Skinnable.Skinnable
 * @public
 */

exports.GridListImageItemBase = GridListImageItemBase;
var GridListImageItemDecorator = (0, _compose["default"])((0, _Marquee.MarqueeController)({
  marqueeOnFocus: true
}), _Spottable["default"], _Skinnable["default"]);
/**
 * A moonstone-styled grid list image item, Marquee and Spottable applied.
 *
 * Usage:
 * ```
 * <GridListImageItem
 * 	caption="image0"
 * 	source="http://placehold.it/300x300/9037ab/ffffff&text=Image0"
 * 	subCaption="sub-image0"
 * />
 * ```
 *
 * @class GridListImageItem
 * @memberof moonstone/GridListImageItem
 * @extends moonstone/GridListImageItem.GridListImageItemBase
 * @mixes moonstone/GridListImageItem.GridListImageItemDecorator
 * @see {@link moonstone/GridListImageItem.GridListImageItemBase}
 * @ui
 * @public
 */

exports.GridListImageItemDecorator = GridListImageItemDecorator;
var GridListImageItem = GridListImageItemDecorator(GridListImageItemBase);
exports.GridListImageItem = GridListImageItem;
var _default = GridListImageItem;
exports["default"] = _default;