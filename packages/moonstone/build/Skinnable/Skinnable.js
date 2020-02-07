"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.useSkinnable = exports.Skinnable = exports["default"] = void 0;

var _hoc = _interopRequireDefault(require("@enact/core/hoc"));

var _Skinnable = _interopRequireWildcard(require("@enact/ui/Skinnable"));

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj["default"] = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

/**
 * Exports the {@link moonstone/Skinnable.Skinnable} higher-order component (HOC).
 *
 * @module moonstone/Skinnable
 * @exports Skinnable
 * @public
 */
var defaultConfig = {
  skins: {
    dark: 'moonstone',
    light: 'moonstone-light'
  },
  defaultVariants: ['highContrast'],
  allowedVariants: ['highContrast', 'largeText', 'grayscale']
};
/**
 * This higher-order component is based on [ui/Skinnable]{@link ui/Skinnable.Skinnable}.
 *
 * `Skinnable` comes pre-configured for Moonstone's supported skins: "dark" (default) and "light".
 * It is used to apply the relevant skinning classes to each component and has been used to
 * pre-select specific skins for some components.
 *
 * Note: This HoC passes `className` to the wrapped component. It must be passed to the main DOM
 * node.
 *
 * @class Skinnable
 * @memberof moonstone/Skinnable
 * @extends ui/Skinnable.Skinnable
 * @hoc
 * @public
 */

var Skinnable = (0, _hoc["default"])(defaultConfig, _Skinnable["default"]);
/**
 * Select a skin by name by specifying this property.
 *
 * Available Moonstone skins are `"dark"` (default) and `"light"`. This may be changed at runtime.
 * All components already use their defaults, but a skin may be changed via this prop or by using
 * `Skinnable` directly and a config object.
 *
 * Example:
 * ```
 * <Button skin="light">
 * ```
 *
 * @name skin
 * @type {String}
 * @default 'dark'
 * @memberof moonstone/Skinnable.Skinnable
 * @instance
 * @public
 */

exports.Skinnable = Skinnable;
var useSkinnable = (0, _Skinnable.configureSkinnable)(defaultConfig);
exports.useSkinnable = useSkinnable;
var _default = Skinnable;
exports["default"] = _default;