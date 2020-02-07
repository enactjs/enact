"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ContextualPopupBase = exports.ContextualPopup = exports["default"] = void 0;

var _kind = _interopRequireDefault(require("@enact/core/kind"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _react = _interopRequireDefault(require("react"));

var _$L = _interopRequireDefault(require("../internal/$L"));

var _IconButton = _interopRequireDefault(require("../IconButton"));

var _Skinnable = _interopRequireDefault(require("../Skinnable"));

var _ContextualPopupModule = _interopRequireDefault(require("./ContextualPopup.module.css"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _objectWithoutProperties(source, excluded) { if (source == null) return {}; var target = _objectWithoutPropertiesLoose(source, excluded); var key, i; if (Object.getOwnPropertySymbols) { var sourceSymbolKeys = Object.getOwnPropertySymbols(source); for (i = 0; i < sourceSymbolKeys.length; i++) { key = sourceSymbolKeys[i]; if (excluded.indexOf(key) >= 0) continue; if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue; target[key] = source[key]; } } return target; }

function _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }

/**
 * An SVG arrow for {@link moonstone/ContextualPopupDecorator/ContextualPopup.ContextualPopup}.
 *
 * @class ContextualPopupArrow
 * @memberof moonstone/ContextualPopupDecorator
 * @ui
 * @private
 */
var ContextualPopupArrow = (0, _kind["default"])({
  name: 'ContextualPopupArrow',
  propTypes:
  /** @lends moonstone/ContextualPopupDecorator.ContextualPopupArrow.prototype */
  {
    direction: _propTypes["default"].oneOf(['up', 'down', 'left', 'right'])
  },
  defaultProps: {
    direction: 'down'
  },
  styles: {
    css: _ContextualPopupModule["default"],
    className: 'arrow'
  },
  computed: {
    className: function className(_ref) {
      var direction = _ref.direction,
          styler = _ref.styler;
      return styler.append(direction, _ContextualPopupModule["default"].arrow);
    }
  },
  render: function render(props) {
    return _react["default"].createElement("svg", Object.assign({}, props, {
      viewBox: "0 0 30 30"
    }), _react["default"].createElement("path", {
      d: "M0 18 L15 0 L30 18",
      className: _ContextualPopupModule["default"].arrowBorder
    }), _react["default"].createElement("path", {
      d: "M15 2 L0 20 L30 20 Z",
      className: _ContextualPopupModule["default"].arrowFill
    }));
  }
});
var ContextualPopupRoot = (0, _Skinnable["default"])({
  defaultSkin: 'light'
}, 'div');
/**
 * A popup component used by
 * [ContextualPopupDecorator]{@link moonstone/ContextualPopupDecorator.ContextualPopupDecorator} to
 * wrap its [popupComponent]{@link moonstone/ContextualPopupDecorator.popupComponent}.
 *
 * `ContextualPopup` is usually not used directly but is made available for unique application use
 * cases.
 *
 * @class ContextualPopup
 * @memberof moonstone/ContextualPopupDecorator
 * @ui
 * @public
 */

var ContextualPopupBase = (0, _kind["default"])({
  name: 'ContextualPopup',
  propTypes:
  /** @lends moonstone/ContextualPopupDecorator.ContextualPopup.prototype */
  {
    /**
     * The contents of the popup.
     *
     * @type {Node}
     * @required
     * @public
     */
    children: _propTypes["default"].node.isRequired,

    /**
     * Style object for arrow position.
     *
     * @type {Object}
     * @public
     */
    arrowPosition: _propTypes["default"].shape({
      bottom: _propTypes["default"].number,
      left: _propTypes["default"].number,
      right: _propTypes["default"].number,
      top: _propTypes["default"].number
    }),

    /**
     * Style object for container position.
     *
     * @type {Object}
     * @public
     */
    containerPosition: _propTypes["default"].shape({
      bottom: _propTypes["default"].number,
      left: _propTypes["default"].number,
      right: _propTypes["default"].number,
      top: _propTypes["default"].number
    }),

    /**
     * Called with the reference to the container node.
     *
     * @type {Function}
     * @public
     */
    containerRef: _propTypes["default"].func,

    /**
     * Direction of ContextualPopup.
     *
     * Can be one of: `'up'`, `'down'`, `'left'`, or `'right'`.
     *
     * @type {('up'|'down'|'left'|'right')}
     * @default 'down'
     * @public
     */
    direction: _propTypes["default"].oneOf(['up', 'down', 'left', 'right']),

    /**
     * Called when the close button is clicked.
     *
     * @type {Function}
     * @public
     */
    onCloseButtonClick: _propTypes["default"].func,

    /**
     * Shows the arrow.
     *
     * @type {Boolean}
     * @default false
     * @public
     */
    showArrow: _propTypes["default"].bool,

    /**
     * Shows the close button.
     *
     * @type {Boolean}
     * @default false
     * @public
     */
    showCloseButton: _propTypes["default"].bool
  },
  defaultProps: {
    direction: 'down',
    showCloseButton: false
  },
  styles: {
    css: _ContextualPopupModule["default"],
    className: 'container'
  },
  computed: {
    className: function className(_ref2) {
      var showCloseButton = _ref2.showCloseButton,
          styler = _ref2.styler;
      return styler.append({
        reserveClose: showCloseButton
      });
    },
    closeButton: function closeButton(_ref3) {
      var showCloseButton = _ref3.showCloseButton,
          onCloseButtonClick = _ref3.onCloseButtonClick;

      if (showCloseButton) {
        return _react["default"].createElement(_IconButton["default"], {
          className: _ContextualPopupModule["default"].closeButton,
          backgroundOpacity: "transparent",
          size: "small",
          onTap: onCloseButtonClick,
          "aria-label": (0, _$L["default"])('Close')
        }, "closex");
      }
    }
  },
  render: function render(_ref4) {
    var arrowPosition = _ref4.arrowPosition,
        containerPosition = _ref4.containerPosition,
        containerRef = _ref4.containerRef,
        children = _ref4.children,
        className = _ref4.className,
        closeButton = _ref4.closeButton,
        direction = _ref4.direction,
        showArrow = _ref4.showArrow,
        rest = _objectWithoutProperties(_ref4, ["arrowPosition", "containerPosition", "containerRef", "children", "className", "closeButton", "direction", "showArrow"]);

    delete rest.onCloseButtonClick;
    delete rest.showCloseButton;
    return _react["default"].createElement(ContextualPopupRoot, Object.assign({
      "aria-live": "off",
      role: "alert"
    }, rest, {
      className: _ContextualPopupModule["default"].contextualPopup
    }), _react["default"].createElement("div", {
      className: className,
      style: containerPosition,
      ref: containerRef
    }, children, closeButton), showArrow ? _react["default"].createElement(ContextualPopupArrow, {
      direction: direction,
      style: arrowPosition
    }) : null);
  }
});
exports.ContextualPopupBase = exports.ContextualPopup = ContextualPopupBase;
var _default = ContextualPopupBase;
exports["default"] = _default;