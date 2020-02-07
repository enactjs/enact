"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ScrollButton = exports["default"] = void 0;

var _kind = _interopRequireDefault(require("@enact/core/kind"));

var _ForwardRef = _interopRequireDefault(require("@enact/ui/ForwardRef"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _react = _interopRequireDefault(require("react"));

var _reactDom = _interopRequireDefault(require("react-dom"));

var _IconButton = _interopRequireDefault(require("../IconButton"));

var _ScrollbarModule = _interopRequireDefault(require("./Scrollbar.module.css"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _objectWithoutProperties(source, excluded) { if (source == null) return {}; var target = _objectWithoutPropertiesLoose(source, excluded); var key, i; if (Object.getOwnPropertySymbols) { var sourceSymbolKeys = Object.getOwnPropertySymbols(source); for (i = 0; i < sourceSymbolKeys.length; i++) { key = sourceSymbolKeys[i]; if (excluded.indexOf(key) >= 0) continue; if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue; target[key] = source[key]; } } return target; }

function _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

/**
 * An [IconButton]{@link moonstone/IconButton.IconButton} used within
 * a [Scrollbar]{@link moonstone/Scrollable.Scrollbar}.
 *
 * @class ScrollButton
 * @memberof moonstone/Scrollable
 * @extends moonstone/IconButton.IconButton
 * @ui
 * @private
 */
var ScrollButtonBase = (0, _kind["default"])({
  name: 'ScrollButton',
  propTypes:
  /** @lends moonstone/Scrollable.ScrollButton.prototype */
  {
    /**
     * Name of icon.
     *
     * @type {String}
     * @required
     * @public
     */
    children: _propTypes["default"].string.isRequired,

    /**
     * Sets the `aria-label`.
     *
     * @type {Boolean}
     * @default false
     * @public
     */
    active: _propTypes["default"].bool,

    /**
    * Sets the hint string read when focusing the scroll bar button.
    *
    * @type {String}
    * @memberof moonstone/Scrollable.ScrollButton.prototype
    * @public
    */
    'aria-label': _propTypes["default"].string,

    /**
     * Disables the button.
     *
     * @type {Boolean}
     * @public
     */
    disabled: _propTypes["default"].bool,

    /**
     * Returns a ref to the root node of the scroll button
     *
     * See: https://github.com/facebook/prop-types/issues/240
     *
     * @type {Function|Object}
     * @private
     */
    forwardRef: _propTypes["default"].oneOfType([_propTypes["default"].func, _propTypes["default"].shape({
      current: _propTypes["default"].any
    })])
  },
  styles: {
    css: _ScrollbarModule["default"],
    className: 'scrollButton'
  },
  handlers: {
    forwardRef: function forwardRef(node, _ref) {
      var _forwardRef = _ref.forwardRef;

      // Allowing findDOMNode in the absence of a means to retrieve a node ref through IconButton
      // eslint-disable-next-line react/no-find-dom-node
      var current = _reactDom["default"].findDOMNode(node); // Safely handle old ref functions and new ref objects


      switch (_typeof(_forwardRef)) {
        case 'object':
          _forwardRef.current = current;
          break;

        case 'function':
          _forwardRef(current);

          break;
      }
    }
  },
  computed: {
    'aria-label': function ariaLabel(_ref2) {
      var active = _ref2.active,
          _ariaLabel = _ref2['aria-label'];
      return active ? null : _ariaLabel;
    }
  },
  render: function render(_ref3) {
    var children = _ref3.children,
        disabled = _ref3.disabled,
        forwardRef = _ref3.forwardRef,
        rest = _objectWithoutProperties(_ref3, ["children", "disabled", "forwardRef"]);

    delete rest.active;
    return _react["default"].createElement(_IconButton["default"], Object.assign({}, rest, {
      backgroundOpacity: "transparent",
      disabled: disabled,
      ref: forwardRef,
      size: "small"
    }), children);
  }
});
var ScrollButton = (0, _ForwardRef["default"])(ScrollButtonBase);
exports.ScrollButton = ScrollButton;
var _default = ScrollButton;
exports["default"] = _default;