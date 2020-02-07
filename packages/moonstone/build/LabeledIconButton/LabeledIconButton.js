"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.LabeledIconButtonDecorator = exports.LabeledIconButtonBase = exports.LabeledIconButton = exports["default"] = void 0;

var _kind = _interopRequireDefault(require("@enact/core/kind"));

var _Spottable = _interopRequireDefault(require("@enact/spotlight/Spottable"));

var _IconButton = require("@enact/ui/IconButton");

var _LabeledIcon = _interopRequireDefault(require("@enact/ui/LabeledIcon"));

var _Pure = _interopRequireDefault(require("@enact/ui/internal/Pure"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _compose = _interopRequireDefault(require("ramda/src/compose"));

var _react = _interopRequireDefault(require("react"));

var _IconButton2 = require("../IconButton");

var _Skinnable = _interopRequireDefault(require("../Skinnable"));

var _LabeledIconButtonModule = _interopRequireDefault(require("./LabeledIconButton.module.css"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { _defineProperty(target, key, source[key]); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _objectWithoutProperties(source, excluded) { if (source == null) return {}; var target = _objectWithoutPropertiesLoose(source, excluded); var key, i; if (Object.getOwnPropertySymbols) { var sourceSymbolKeys = Object.getOwnPropertySymbols(source); for (i = 0; i < sourceSymbolKeys.length; i++) { key = sourceSymbolKeys[i]; if (excluded.indexOf(key) >= 0) continue; if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue; target[key] = source[key]; } } return target; }

function _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }

var IconButton = (0, _compose["default"])(_IconButton.IconButtonDecorator, _Spottable["default"], _Skinnable["default"])(_IconButton2.IconButtonBase);
/**
 * An icon button component with a label.
 *
 * @class LabeledIconButtonBase
 * @memberof moonstone/LabeledIconButton
 * @extends ui/LabeledIcon.LabeledIcon
 * @ui
 * @public
 */

var LabeledIconButtonBase = (0, _kind["default"])({
  name: 'LabeledIconButton',
  propTypes:
  /** @lends moonstone/LabeledIconButton.LabeledIconButtonBase.prototype */
  {
    /**
     * Customizes the component by mapping the supplied collection of CSS class names to the
     * corresponding internal Elements and states of this component.
     *
     * The following classes are supported:
     *
     * * `labeledIconButton` - The root component class
     * * `icon` - The icon component class
     * * `label` - The label component class
     * * `large` - Applied to a `size='large'` button
     * * `selected` - Applied to a `selected` button
     * * `small` - Applied to a `size='small'` button
     *
     * @type {Object}
     * @public
     */
    css: _propTypes["default"].object,

    /**
     * Flip the icon horizontally, vertically or both.
     *
     * @type {('both'|'horizontal'|'vertical')}
     * @public
     */
    flip: _propTypes["default"].string,

    /**
     * The icon displayed within the button.
     *
     * @type {String}
     * @public
     */
    icon: _propTypes["default"].string,

    /**
     * Selects the component.
     *
     * Setting `selected` may be useful when the component represents a toggleable option. The
     * visual effect may be customized using the
     * [css]{@link moonstone/LabeledIconButton.LabeledIconButtonBase.css} prop.
     *
     * @type {Boolean}
     * @public
     */
    selected: _propTypes["default"].bool
  },
  styles: {
    css: _LabeledIconButtonModule["default"],
    className: 'labeledIconButton',
    publicClassNames: ['labeledIconButton', 'icon', 'label', 'large', 'selected', 'small']
  },
  render: function render(_ref) {
    var css = _ref.css,
        flip = _ref.flip,
        icon = _ref.icon,
        selected = _ref.selected,
        rest = _objectWithoutProperties(_ref, ["css", "flip", "icon", "selected"]);

    return _LabeledIcon["default"].inline(_objectSpread({}, rest, {
      icon: _react["default"].createElement(IconButton, {
        flip: flip,
        selected: selected
      }, icon),
      css: css
    }));
  }
});
/**
 * Adds Moonstone specific behaviors to [LabeledIconButtonBase]{@link moonstone/LabeledIconButton.LabeledIconButtonBase}.
 *
 * @hoc
 * @memberof moonstone/LabeledIconButton
 * @mixes moonstone/Skinnable.Skinnable
 * @public
 */

exports.LabeledIconButtonBase = LabeledIconButtonBase;
var LabeledIconButtonDecorator = (0, _compose["default"])(_Pure["default"], _Skinnable["default"]);
/**
 * A Moonstone-styled icon button component with a label.
 *
 * Usage:
 * ```
 * <LabeledIconButton icon="star" labelPosition="after">
 *   Favorite
 * </LabeledIconButton>
 * ```
 *
 * @class LabeledIconButton
 * @memberof moonstone/LabeledIconButton
 * @extends moonstone/LabeledIconButton.LabeledIconButtonBase
 * @mixes moonstone/LabeledIconButton.LabeledIconButtonDecorator
 * @ui
 * @public
 */

exports.LabeledIconButtonDecorator = LabeledIconButtonDecorator;
var LabeledIconButton = LabeledIconButtonDecorator(LabeledIconButtonBase);
exports.LabeledIconButton = LabeledIconButton;
var _default = LabeledIconButton;
exports["default"] = _default;