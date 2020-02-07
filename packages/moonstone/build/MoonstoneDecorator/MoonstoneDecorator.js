"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.MoonstoneDecorator = exports["default"] = void 0;

var _keymap = require("@enact/core/keymap");

var _hoc = _interopRequireDefault(require("@enact/core/hoc"));

var _I18nDecorator = _interopRequireDefault(require("@enact/i18n/I18nDecorator"));

var _react = _interopRequireDefault(require("react"));

var _classnames = _interopRequireDefault(require("classnames"));

var _resolution = require("@enact/ui/resolution");

var _FloatingLayer = require("@enact/ui/FloatingLayer");

var _SpotlightRootDecorator = _interopRequireDefault(require("@enact/spotlight/SpotlightRootDecorator"));

var _Skinnable = _interopRequireDefault(require("../Skinnable"));

var _I18nFontDecorator = _interopRequireDefault(require("./I18nFontDecorator"));

var _AccessibilityDecorator = _interopRequireDefault(require("./AccessibilityDecorator"));

var _screenTypes = _interopRequireDefault(require("./screenTypes.json"));

var _MoonstoneDecoratorModule = _interopRequireDefault(require("./MoonstoneDecorator.module.css"));

var _Touchable = require("@enact/ui/Touchable");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { _defineProperty(target, key, source[key]); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

/**
 * Default config for `MoonstoneDecorator`.
 *
 * @memberof moonstone/MoonstoneDecorator.MoonstoneDecorator
 * @hocconfig
 */
var defaultConfig = {
  disableFullscreen: false,
  "float": true,
  i18n: {
    sync: true
  },
  noAutoFocus: false,
  overlay: false,
  ri: {
    screenTypes: _screenTypes["default"]
  },
  skin: true,
  spotlight: true,
  textSize: true
};
/**
 * A higher-order component that applies Moonstone theming to an application.
 *
 * It also applies [floating layer]{@link ui/FloatingLayer.FloatingLayerDecorator}, [resolution
 * independence]{@link ui/resolution.ResolutionDecorator}, [skin
 * support]{@link moonstone/Skinnable}, [spotlight]{@link spotlight.SpotlightRootDecorator}, and
 * [internationalization support]{@link i18n/I18nDecorator.I18nDecorator}. It is meant to be applied
 * to the root element of an app.
 *
 * [Skins]{@link moonstone/Skinnable} provide a way to change the coloration of your app. The
 * currently supported skins for Moonstone are "moonstone" (the default, dark skin) and
 * "moonstone-light". Use the `skin` property to assign a skin. Ex: `<DecoratedApp skin="light" />`
 *
 * Note: This HoC passes `className` to the wrapped component. It must be passed to the main DOM
 * node.
 *
 * @class MoonstoneDecorator
 * @memberof moonstone/MoonstoneDecorator
 * @hoc
 * @public
 */

var MoonstoneDecorator = (0, _hoc["default"])(defaultConfig, function (config, Wrapped) {
  var _class, _temp;

  var ri = config.ri,
      i18n = config.i18n,
      spotlight = config.spotlight,
      _float = config["float"],
      noAutoFocus = config.noAutoFocus,
      overlay = config.overlay,
      textSize = config.textSize,
      skin = config.skin,
      highContrast = config.highContrast,
      disableFullscreen = config.disableFullscreen; // Apply classes depending on screen type (overlay / fullscreen)

  var bgClassName = (0, _classnames["default"])(_defineProperty({
    'enact-fit': !disableFullscreen
  }, _MoonstoneDecoratorModule["default"].bg, !overlay));
  var App = Wrapped;
  if (_float) App = (0, _FloatingLayer.FloatingLayerDecorator)({
    wrappedClassName: bgClassName
  }, App);
  if (ri) App = (0, _resolution.ResolutionDecorator)(ri, App);

  if (i18n) {
    // Apply the @enact/i18n decorator around the font decorator so the latter will update the
    // font stylesheet when the locale changes
    App = (0, _I18nDecorator["default"])(_objectSpread({}, i18n, {
      // We use the latin fonts (with non-Latin fallback) for these languages (even though
      // their scripts are non-latin)
      latinLanguageOverrides: ['ko', 'ha', 'el', 'bg', 'mk', 'mn', 'ru', 'uk', 'kk'],
      // We use the non-latin fonts for these languages (even though their scripts are
      // technically considered latin)
      nonLatinLanguageOverrides: ['en-JP']
    }), (0, _I18nFontDecorator["default"])(App));
  }

  if (spotlight) App = (0, _SpotlightRootDecorator["default"])({
    noAutoFocus: noAutoFocus
  }, App);
  if (skin) App = (0, _Skinnable["default"])({
    defaultSkin: 'dark'
  }, App);
  if (textSize || highContrast) App = (0, _AccessibilityDecorator["default"])(App); // add webOS-specific key maps

  (0, _keymap.addAll)({
    cancel: 461,
    nonModal: [461, 415, // play
    19, // pause
    403, // red
    404, // green
    405, // yellow
    406, // blue
    33, // channel up
    34 // channel down
    ],
    red: 403,
    green: 404,
    yellow: 405,
    blue: 406,
    play: 415,
    pause: 19,
    rewind: 412,
    fastForward: 417,
    pointerHide: 1537,
    pointerShow: 1536
  }); // configure the default hold time

  (0, _Touchable.configure)({
    hold: {
      events: [{
        name: 'hold',
        time: 400
      }]
    }
  });
  var Decorator = (_temp = _class =
  /*#__PURE__*/
  function (_React$Component) {
    _inherits(Decorator, _React$Component);

    function Decorator() {
      _classCallCheck(this, Decorator);

      return _possibleConstructorReturn(this, _getPrototypeOf(Decorator).apply(this, arguments));
    }

    _createClass(Decorator, [{
      key: "render",
      value: function render() {
        var _classNames2;

        var className = (0, _classnames["default"])(_MoonstoneDecoratorModule["default"].root, this.props.className, 'enact-unselectable', (_classNames2 = {}, _defineProperty(_classNames2, bgClassName, !_float), _defineProperty(_classNames2, 'enact-fit', !disableFullscreen), _classNames2));
        return _react["default"].createElement(App, Object.assign({}, this.props, {
          className: className
        }));
      }
    }]);

    return Decorator;
  }(_react["default"].Component), _class.displayName = 'MoonstoneDecorator', _temp);
  return Decorator;
});
exports.MoonstoneDecorator = MoonstoneDecorator;
var _default = MoonstoneDecorator;
exports["default"] = _default;