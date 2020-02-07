"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _kind = _interopRequireDefault(require("@enact/core/kind"));

var _react = _interopRequireDefault(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _$L = _interopRequireDefault(require("../internal/$L"));

var _IconButton = _interopRequireDefault(require("../IconButton"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _objectWithoutProperties(source, excluded) { if (source == null) return {}; var target = _objectWithoutPropertiesLoose(source, excluded); var key, i; if (Object.getOwnPropertySymbols) { var sourceSymbolKeys = Object.getOwnPropertySymbols(source); for (i = 0; i < sourceSymbolKeys.length; i++) { key = sourceSymbolKeys[i]; if (excluded.indexOf(key) >= 0) continue; if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue; target[key] = source[key]; } } return target; }

function _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }

/**
 * An {@link moonstone/ApplicationCloseButton.ApplicationCloseButton} with `closex` icon. It is used in
 * {@link moonstone/Panels.Panels} positioned at the top right corner.
 * `onApplicationClose` callback function should be specified to close your app. The recommended
 * action to take with the event is `window.close()`, but you may also want to also do operations
 * like save user work or close database connections.
 *
 * @class ApplicationCloseButton
 * @memberof moonstone/Panels
 * @private
 */
var ApplicationCloseButton = (0, _kind["default"])({
  name: 'ApplicationCloseButton',
  propTypes:
  /** @lends moonstone/Panels.ApplicationCloseButton.prototype */
  {
    /**
    * Sets the hint string read when focusing the application close button.
    *
    * @type {String}
    * @default 'Exit app'
    * @memberof moonstone/Panels.ApplicationCloseButton.prototype
    * @public
    */
    'aria-label': _propTypes["default"].string,

    /**
     * The background-color opacity of this button; valid values are 'translucent'`,
     * `'lightTranslucent'` and `'transparent'`.
     *
     * @type {String}
     * @default 'transparent'
     * @public
     */
    backgroundOpacity: _propTypes["default"].oneOf(['translucent', 'lightTranslucent', 'transparent']),

    /**
     * A function to run when app close button is clicked
     *
     * @type {Function}
     */
    onApplicationClose: _propTypes["default"].func
  },
  defaultProps: {
    backgroundOpacity: 'transparent'
  },
  computed: {
    'aria-label': function ariaLabel(_ref) {
      var _ariaLabel = _ref['aria-label'];
      return _ariaLabel == null ? (0, _$L["default"])('Exit app') : _ariaLabel;
    }
  },
  render: function render(_ref2) {
    var backgroundOpacity = _ref2.backgroundOpacity,
        onApplicationClose = _ref2.onApplicationClose,
        rest = _objectWithoutProperties(_ref2, ["backgroundOpacity", "onApplicationClose"]);

    return _react["default"].createElement(_IconButton["default"], Object.assign({}, rest, {
      backgroundOpacity: backgroundOpacity,
      onTap: onApplicationClose,
      size: "small"
    }), "closex");
  }
});
var _default = ApplicationCloseButton;
exports["default"] = _default;