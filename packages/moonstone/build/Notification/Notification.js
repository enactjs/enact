"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.NotificationBase = exports.Notification = exports["default"] = void 0;

var _kind = _interopRequireDefault(require("@enact/core/kind"));

var _react = _interopRequireDefault(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _Slottable = _interopRequireDefault(require("@enact/ui/Slottable"));

var _Popup = _interopRequireDefault(require("../Popup"));

var _NotificationModule = _interopRequireDefault(require("./Notification.module.css"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _objectWithoutProperties(source, excluded) { if (source == null) return {}; var target = _objectWithoutPropertiesLoose(source, excluded); var key, i; if (Object.getOwnPropertySymbols) { var sourceSymbolKeys = Object.getOwnPropertySymbols(source); for (i = 0; i < sourceSymbolKeys.length; i++) { key = sourceSymbolKeys[i]; if (excluded.indexOf(key) >= 0) continue; if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue; target[key] = source[key]; } } return target; }

function _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }

// ENYO-5691: Workaround to fix a text rendering issue by aligning the content to the pixel grid
var fixTransform = function fixTransform(node) {
  if (!node) return;
  var parent = node.parentNode;

  var _parent$getBoundingCl = parent.getBoundingClientRect(),
      left = _parent$getBoundingCl.left,
      top = _parent$getBoundingCl.top;

  var deltaY = Math.round(top) - top;
  var deltaX = Math.round(left) - left;

  if (deltaY !== 0 || deltaX !== 0) {
    // on webOS, the layer promotion is necessary to resolve the text rendering issue
    parent.style.transform = "translate3d(".concat(deltaX, "px, ").concat(deltaY, "px, 0)");
    parent.style.willChange = 'transform';
  }
};
/**
 * A Moonstone styled notification component.
 *
 * It provides a notification modal which can be opened and closed, overlaying an app. Apps will
 * want to use {@link moonstone/Notification.Notification}.
 *
 * @class NotificationBase
 * @memberof moonstone/Notification
 * @ui
 * @public
 */


var NotificationBase = (0, _kind["default"])({
  name: 'Notification',
  propTypes:
  /** @lends moonstone/Notification.NotificationBase.prototype */
  {
    /**
     * Buttons for the Notification.
     *
     * These typically close or take action in the Notification. Buttons must have their
     * `size` property set to `'small'` and will be coerced to `'small'` if not specified.
     *
     * @type {Element|Element[]}
     * @public
     */
    buttons: _propTypes["default"].oneOfType([_propTypes["default"].element, _propTypes["default"].arrayOf(_propTypes["default"].element)]),

    /**
     * The contents for the body of the Notification.
     *
     * @type {Node}
     * @public
     */
    children: _propTypes["default"].node,

    /**
     * Customizes the component by mapping the supplied collection of CSS class names to the
     * corresponding internal Elements and states of this component.
     *
     * The following classes are supported:
     *
     * * `notification` - The root class name
     *
     * @type {Object}
     * @public
     */
    css: _propTypes["default"].object,

    /**
     * Indicates that the notification will not trigger `onClose` on the *ESC* key press.
     *
     * @type {Boolean}
     * @default false
     * @public
     */
    noAutoDismiss: _propTypes["default"].bool,

    /**
     * Called when a closing action is invoked by the user.
     *
     * These actions include pressing *ESC* key or clicking on the close button. It is the
     * responsibility of the callback to set the `open` state to `false`.
     *
     * @type {Function}
     * @public
     */
    onClose: _propTypes["default"].func,

    /**
     * Controls the visibility of the Notification.
     *
     * By default, the Notification and its contents are not rendered until `open`.
     *
     * @type {Boolean}
     * @default false
     * @public
     */
    open: _propTypes["default"].bool,

    /**
     * Determines the technique used to cover the screen when the notification is present.
     *
     * * Values: `'transparent'`, `'translucent'`, or `'none'`.
     *
     * @type {String}
     * @default 'transparent'
     * @public
     */
    scrimType: _propTypes["default"].oneOf(['transparent', 'translucent', 'none'])
  },
  defaultProps: {
    open: false,
    scrimType: 'transparent'
  },
  styles: {
    css: _NotificationModule["default"],
    className: 'notification',
    publicClassNames: ['notification']
  },
  computed: {
    className: function className(_ref) {
      var buttons = _ref.buttons,
          styler = _ref.styler;
      return styler.append({
        wide: buttons && _react["default"].Children.toArray(buttons).filter(Boolean).length > 2
      });
    },
    buttons: function buttons(_ref2) {
      var _buttons = _ref2.buttons;
      return _react["default"].Children.map(_buttons, function (button) {
        if (button && button.props && !button.props.small) {
          return _react["default"].cloneElement(button, {
            size: 'small'
          });
        } else {
          return button;
        }
      });
    }
  },
  render: function render(_ref3) {
    var buttons = _ref3.buttons,
        children = _ref3.children,
        css = _ref3.css,
        rest = _objectWithoutProperties(_ref3, ["buttons", "children", "css"]);

    return _react["default"].createElement(_Popup["default"], Object.assign({
      noAnimation: true
    }, rest, {
      css: css,
      shrinkBody: true
    }), _react["default"].createElement("div", {
      className: css.notificationBody,
      ref: fixTransform
    }, children), buttons ? _react["default"].createElement("div", {
      className: css.buttons
    }, buttons) : null);
  }
});
/**
 * A Moonstone styled modal component with a message, and an area for additional controls.
 *
 * @class Notification
 * @memberof moonstone/Notification
 * @mixes ui/Slottable.Slottable
 * @ui
 * @public
 */

exports.NotificationBase = NotificationBase;
var Notification = (0, _Slottable["default"])({
  slots: ['buttons']
}, NotificationBase);
exports.Notification = Notification;
var _default = Notification;
exports["default"] = _default;