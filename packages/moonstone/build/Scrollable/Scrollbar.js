"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ScrollbarBase = exports.Scrollbar = exports["default"] = void 0;

var _ApiDecorator = _interopRequireDefault(require("@enact/core/internal/ApiDecorator"));

var _Scrollbar = require("@enact/ui/Scrollable/Scrollbar");

var _propTypes = _interopRequireDefault(require("prop-types"));

var _react = _interopRequireWildcard(require("react"));

var _ScrollButtons = _interopRequireDefault(require("./ScrollButtons"));

var _ScrollThumb = _interopRequireDefault(require("./ScrollThumb"));

var _Skinnable = _interopRequireDefault(require("../Skinnable"));

var _ScrollbarModule = _interopRequireDefault(require("./Scrollbar.module.css"));

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj["default"] = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _objectWithoutProperties(source, excluded) { if (source == null) return {}; var target = _objectWithoutPropertiesLoose(source, excluded); var key, i; if (Object.getOwnPropertySymbols) { var sourceSymbolKeys = Object.getOwnPropertySymbols(source); for (i = 0; i < sourceSymbolKeys.length; i++) { key = sourceSymbolKeys[i]; if (excluded.indexOf(key) >= 0) continue; if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue; target[key] = source[key]; } } return target; }

function _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

/**
 * A Moonstone-styled scroller base component.
 *
 * @class ScrollbarBase
 * @memberof moonstone/Scrollable
 * @extends ui/ScrollbarBase
 * @ui
 * @private
 */
var ScrollbarBase =
/*#__PURE__*/
function (_Component) {
  _inherits(ScrollbarBase, _Component);

  function ScrollbarBase(props) {
    var _this;

    _classCallCheck(this, ScrollbarBase);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(ScrollbarBase).call(this, props));

    if (props.setApiProvider) {
      props.setApiProvider(_assertThisInitialized(_this));
    }

    _this.scrollbarRef = _react["default"].createRef();
    _this.scrollButtonsRef = _react["default"].createRef();
    return _this;
  }

  _createClass(ScrollbarBase, [{
    key: "componentDidMount",
    value: function componentDidMount() {
      var _this2 = this;

      var _this$scrollbarRef$cu = this.scrollbarRef.current,
          getContainerRef = _this$scrollbarRef$cu.getContainerRef,
          showThumb = _this$scrollbarRef$cu.showThumb,
          startHidingThumb = _this$scrollbarRef$cu.startHidingThumb,
          uiUpdate = _this$scrollbarRef$cu.update;
      this.getContainerRef = getContainerRef;
      this.showThumb = showThumb;
      this.startHidingThumb = startHidingThumb;
      this.uiUpdate = uiUpdate;
      var _this$scrollButtonsRe = this.scrollButtonsRef.current,
          isOneOfScrollButtonsFocused = _this$scrollButtonsRe.isOneOfScrollButtonsFocused,
          updateButtons = _this$scrollButtonsRe.updateButtons,
          focusOnButton = _this$scrollButtonsRe.focusOnButton;
      this.isOneOfScrollButtonsFocused = isOneOfScrollButtonsFocused;

      this.update = function (bounds) {
        updateButtons(bounds);

        _this2.uiUpdate(bounds);
      };

      this.focusOnButton = focusOnButton;
    }
  }, {
    key: "render",
    value: function render() {
      var _this3 = this;

      var _this$props = this.props,
          cbAlertThumb = _this$props.cbAlertThumb,
          clientSize = _this$props.clientSize,
          corner = _this$props.corner,
          vertical = _this$props.vertical,
          rest = _objectWithoutProperties(_this$props, ["cbAlertThumb", "clientSize", "corner", "vertical"]);

      return _react["default"].createElement(_Scrollbar.ScrollbarBase, {
        corner: corner,
        clientSize: clientSize,
        css: _ScrollbarModule["default"],
        ref: this.scrollbarRef,
        vertical: vertical,
        childRenderer: function childRenderer(_ref) {
          var thumbRef = _ref.thumbRef;
          return (// eslint-disable-line react/jsx-no-bind
            _react["default"].createElement(_ScrollButtons["default"], Object.assign({}, rest, {
              ref: _this3.scrollButtonsRef,
              vertical: vertical,
              thumbRenderer: function thumbRenderer() {
                return (// eslint-disable-line react/jsx-no-bind
                  _react["default"].createElement(_ScrollThumb["default"], {
                    cbAlertThumb: cbAlertThumb,
                    key: "thumb",
                    ref: thumbRef,
                    vertical: vertical
                  })
                );
              }
            }))
          );
        }
      });
    }
  }]);

  return ScrollbarBase;
}(_react.Component);
/**
 * A Moonstone-styled scroll bar. It is used in [Scrollable]{@link moonstone/Scrollable.Scrollable}.
 *
 * @class Scrollbar
 * @memberof moonstone/Scrollable
 * @ui
 * @private
 */


ScrollbarBase.displayName = 'ScrollbarBase';
ScrollbarBase.propTypes =
/** @lends moonstone/Scrollable.Scrollbar.prototype */
{
  /**
   * Called when [ScrollThumb]{@link moonstone/Scrollable.ScrollThumb} is updated.
   *
   * @type {Function}
   * @private
   */
  cbAlertThumb: _propTypes["default"].func,

  /**
   * Client size of the container; valid values are an object that has `clientWidth` and `clientHeight`.
   *
   * @type {Object}
   * @property {Number}    clientHeight    The client height of the list.
   * @property {Number}    clientWidth    The client width of the list.
   * @public
   */
  clientSize: _propTypes["default"].shape({
    clientHeight: _propTypes["default"].number.isRequired,
    clientWidth: _propTypes["default"].number.isRequired
  }),

  /**
   * Adds the corner between vertical and horizontal scrollbars.
   *
   * @type {Booelan}
   * @default false
   * @public
   */
  corner: _propTypes["default"].bool,

  /**
   * `true` if rtl, `false` if ltr.
   * Normally, [Scrollable]{@link ui/Scrollable.Scrollable} should set this value.
   *
   * @type {Boolean}
   * @private
   */
  rtl: _propTypes["default"].bool,

  /**
   * Registers the ScrollButtons component with an
   * {@link core/internal/ApiDecorator.ApiDecorator}.
   *
   * @type {Function}
   * @private
   */
  setApiProvider: _propTypes["default"].func,

  /**
   * The scrollbar will be oriented vertically.
   *
   * @type {Boolean}
   * @default true
   * @public
   */
  vertical: _propTypes["default"].bool
};
ScrollbarBase.defaultProps = {
  corner: false,
  vertical: true
};
var Scrollbar = (0, _ApiDecorator["default"])({
  api: ['focusOnButton', 'getContainerRef', 'isOneOfScrollButtonsFocused', 'showThumb', 'startHidingThumb', 'update']
}, (0, _Skinnable["default"])(ScrollbarBase));
exports.ScrollbarBase = exports.Scrollbar = Scrollbar;
Scrollbar.displayName = 'Scrollbar';
var _default = Scrollbar;
exports["default"] = _default;