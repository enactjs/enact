"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.DialogBase = exports.Dialog = exports["default"] = void 0;

var _kind = _interopRequireDefault(require("@enact/core/kind"));

var _IdProvider = _interopRequireDefault(require("@enact/ui/internal/IdProvider"));

var _Layout = require("@enact/ui/Layout");

var _Slottable = _interopRequireDefault(require("@enact/ui/Slottable"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _react = _interopRequireDefault(require("react"));

var _Marquee = require("../Marquee");

var _Popup = _interopRequireDefault(require("../Popup"));

var _DialogModule = _interopRequireDefault(require("./Dialog.module.css"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _objectWithoutProperties(source, excluded) { if (source == null) return {}; var target = _objectWithoutPropertiesLoose(source, excluded); var key, i; if (Object.getOwnPropertySymbols) { var sourceSymbolKeys = Object.getOwnPropertySymbols(source); for (i = 0; i < sourceSymbolKeys.length; i++) { key = sourceSymbolKeys[i]; if (excluded.indexOf(key) >= 0) continue; if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue; target[key] = source[key]; } } return target; }

function _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }

var MarqueeH1 = (0, _Marquee.MarqueeDecorator)('h1');
var MarqueeH2 = (0, _Marquee.MarqueeDecorator)('h2');
/**
 * A modal dialog component.
 *
 * This component is most often not used directly but may be composed within another component as it
 * is within [Dialog]{@link moonstone/Dialog.Dialog}.
 *
 * @class DialogBase
 * @memberof moonstone/Dialog
 * @ui
 * @public
 */

var DialogBase = (0, _kind["default"])({
  name: 'Dialog',
  propTypes:
  /** @lends moonstone/Dialog.DialogBase.prototype */
  {
    /**
     * Buttons to be included within the header of the component.
     *
     * Typically, these buttons would be used to close or take action on the dialog.
     *
     * @type {Element|Element[]}
     * @public
     */
    buttons: _propTypes["default"].oneOfType([_propTypes["default"].element, _propTypes["default"].arrayOf(_propTypes["default"].element)]),

    /**
     * The contents of the body of the component.
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
     * * `dialog` - The root class name
     *
     * @type {Object}
     * @private
     */
    css: _propTypes["default"].object,

    /**
     * The id of dialog referred to when generating ids for `'title'`, `'titleBelow'`, `'children'`, and `'buttons'`.
     *
     * @type {String}
     * @private
     */
    id: _propTypes["default"].string,

    /**
     * Disables animating the dialog on or off screen.
     *
     * @type {Boolean}
     * @default false
     * @public
     */
    noAnimation: _propTypes["default"].bool,

    /**
     * Omits the dividing line between the header and body of the component.
     *
     * @type {Boolean}
     * @default false
     * @public
     */
    noDivider: _propTypes["default"].bool,

    /**
     * Called when the user requests to close the dialog.
     *
     * These actions include pressing the cancel key or tapping on the close button. It is the
     * responsibility of the callback to set the `open` property to `false`.
     *
     * @type {Function}
     * @public
     */
    onClose: _propTypes["default"].func,

    /**
     * Called after the transition to hide the dialog has finished.
     *
     * @type {Function}
     * @public
     */
    onHide: _propTypes["default"].func,

    /**
     * Opens the dialog.
     *
     * @type {Boolean}
     * @default false
     * @public
     */
    open: _propTypes["default"].bool,

    /**
     * The types of scrim shown behind the dialog.
     *
     * Allowed values include:
     * * `'transparent'` - The scrim is invisible but prevents pointer events for components
     *   below it.
     * * `'translucent'` - The scrim is visible and both obscures and prevents pointer events
     *   for components below it.
     * * `'none'` - No scrim is present and pointer events are allowed outside the dialog.
     *
     * @type {String}
     * @default 'translucent'
     * @public
     */
    scrimType: _propTypes["default"].oneOf(['transparent', 'translucent', 'none']),

    /**
     * Shows the close button within the component.
     *
     * @type {Boolean}
     * @default false
     * @public
     */
    showCloseButton: _propTypes["default"].bool,

    /**
     * The primary text displayed within the header
     *
     * @type {String}
     * @public
     */
    title: _propTypes["default"].string,

    /**
     * The secondary text displayed below the `title` within the header.
     *
     * Will not display if `title` is not set.
     *
     * @type {String}
     * @public
     */
    titleBelow: _propTypes["default"].string
  },
  defaultProps: {
    noAnimation: false,
    noDivider: false,
    open: false,
    showCloseButton: false,
    scrimType: 'translucent'
  },
  styles: {
    css: _DialogModule["default"],
    className: 'dialog',
    publicClassNames: ['dialog']
  },
  computed: {
    className: function className(_ref) {
      var noDivider = _ref.noDivider,
          styler = _ref.styler;
      return styler.append({
        showDivider: !noDivider
      });
    },
    titleBelow: function titleBelow(_ref2) {
      var title = _ref2.title,
          _titleBelow = _ref2.titleBelow;
      return title ? _titleBelow : '';
    }
  },
  render: function render(_ref3) {
    var buttons = _ref3.buttons,
        css = _ref3.css,
        children = _ref3.children,
        id = _ref3.id,
        title = _ref3.title,
        titleBelow = _ref3.titleBelow,
        rest = _objectWithoutProperties(_ref3, ["buttons", "css", "children", "id", "title", "titleBelow"]);

    delete rest.noDivider;
    return _react["default"].createElement(_Popup["default"], Object.assign({}, rest, {
      "aria-labelledby": "".concat(id, "_title ").concat(id, "_titleBelow ").concat(id, "_children ").concat(id, "_buttons"),
      css: css
    }), _react["default"].createElement("div", {
      className: css.titleWrapper
    }, _react["default"].createElement(_Layout.Layout, {
      align: "start space-between"
    }, _react["default"].createElement(_Layout.Cell, {
      component: MarqueeH1,
      marqueeOn: "render",
      marqueeOnRenderDelay: 5000,
      className: css.title,
      id: "".concat(id, "_title")
    }, title), _react["default"].createElement(_Layout.Cell, {
      className: css.buttons,
      id: "".concat(id, "_buttons"),
      shrink: true
    }, buttons)), _react["default"].createElement(MarqueeH2, {
      className: css.titleBelow,
      id: "".concat(id, "_titleBelow"),
      marqueeOn: "hover"
    }, titleBelow)), _react["default"].createElement("div", {
      className: css.dialogBody,
      id: "".concat(id, "_children")
    }, children));
  }
});
/**
 * A modal dialog component, ready to use in Moonstone applications.
 *
 * `Dialog` may be used to interrupt a workflow to receive feedback from the user. The dialong
 * consists of a title, a subtitle, a message, and an area for additional
 * [buttons]{@link moonstone/Dialog.Dialog.buttons}.
 *
 * Usage:
 * ```
 * <Dialog
 *   open={this.state.open}
 *   showCloseButton
 *   title="An Important Dialog"
 *   titleBelow="Some important context to share about the purpose"
 * >
 *   <BodyText>You can include other Moonstone components here. </BodyText>
 *   <buttons>
 *     <Button>Button 1</Button>
 *     <Button>Button 2</Button>
 *   </buttons>
 * </Dialog>
 * ```
 *
 * @class Dialog
 * @memberof moonstone/Dialog
 * @extends moonstone/Dialog.DialogBase
 * @mixes ui/Slottable.Slottable
 * @ui
 * @public
 */

exports.DialogBase = DialogBase;
var Dialog = (0, _IdProvider["default"])({
  generateProp: null,
  prefix: 'd_'
}, (0, _Slottable["default"])({
  slots: ['title', 'titleBelow', 'buttons']
}, DialogBase));
exports.Dialog = Dialog;
var _default = Dialog;
exports["default"] = _default;