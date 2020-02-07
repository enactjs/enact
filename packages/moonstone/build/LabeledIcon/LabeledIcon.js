"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.LabeledIconDecorator = exports.LabeledIconBase = exports.LabeledIcon = exports["default"] = void 0;

var _kind = _interopRequireDefault(require("@enact/core/kind"));

var _LabeledIcon = _interopRequireDefault(require("@enact/ui/LabeledIcon"));

var _Pure = _interopRequireDefault(require("@enact/ui/internal/Pure"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _compose = _interopRequireDefault(require("ramda/src/compose"));

var _Icon = require("../Icon");

var _Skinnable = _interopRequireDefault(require("../Skinnable"));

var _LabeledIconModule = _interopRequireDefault(require("./LabeledIcon.module.css"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { _defineProperty(target, key, source[key]); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

// Make a basic Icon. This cuts `Pure` out of icon for a small gain.
var Icon = (0, _Skinnable["default"])(_Icon.IconBase);
/**
 * A basic LabeledIcon component structure without any behaviors applied to it.
 *
 * @class LabeledIconBase
 * @memberof moonstone/LabeledIcon
 * @ui
 * @public
 */

var LabeledIconBase = (0, _kind["default"])({
  name: 'LabeledIcon',
  propTypes:
  /** @lends moonstone/LabeledIcon.LabeledIconBase.prototype */
  {
    /**
     * Customizes the component by mapping the supplied collection of CSS class names to the
     * corresponding internal Elements and states of this component.
     *
     * The following classes are supported:
     *
     * * `labeledIcon` - The root component class
     * * `label` - The label component class
     * * `icon` - The icon component class
     *
     * @type {Object}
     * @public
     */
    css: _propTypes["default"].object
  },
  styles: {
    css: _LabeledIconModule["default"],
    className: 'labeledIcon',
    publicClassNames: ['labeledIcon', 'icon', 'label']
  },
  render: function render(props) {
    return _LabeledIcon["default"].inline(_objectSpread({}, props, {
      iconComponent: Icon,
      css: props.css
    }));
  }
});
/**
 * Adds Moonstone specific behaviors to [LabeledIconBase]{@link moonstone/LabeledIcon.LabeledIconBase}.
 *
 * @hoc
 * @memberof moonstone/LabeledIcon
 * @mixes moonstone/Skinnable.Skinnable
 * @public
 */

exports.LabeledIconBase = LabeledIconBase;
var LabeledIconDecorator = (0, _compose["default"])(_Pure["default"], _Skinnable["default"]);
/**
 * A Moonstone-styled icon component with a label.
 *
 * Usage:
 * ```
 * <LabeledIcon icon="star" labelPosition="after">
 *   Favorite
 * </LabeledIcon>
 * ```
 *
 * @class LabeledIcon
 * @memberof moonstone/LabeledIcon
 * @extends moonstone/LabeledIcon.LabeledIconBase
 * @mixes moonstone/LabeledIcon.LabeledIconDecorator
 * @ui
 * @public
 */

exports.LabeledIconDecorator = LabeledIconDecorator;
var LabeledIcon = LabeledIconDecorator(LabeledIconBase);
exports.LabeledIcon = LabeledIcon;
var _default = LabeledIcon;
exports["default"] = _default;