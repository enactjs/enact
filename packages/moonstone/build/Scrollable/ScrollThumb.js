"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ScrollThumbBase = exports.ScrollThumb = exports["default"] = void 0;

var _Scrollbar = require("@enact/ui/Scrollable/Scrollbar");

var _propTypes = _interopRequireDefault(require("prop-types"));

var _react = _interopRequireWildcard(require("react"));

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj["default"] = obj; return newObj; } }

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

var nop = function nop() {};
/**
 * A Moonstone-styled scroll thumb with moonstone behavior
 *
 * @class ScrollThumb
 * @memberof moonstone/Scrollable
 * @extends ui/Scrollable/ScrollThumb
 * @ui
 * @private
 */


var ScrollThumb =
/*#__PURE__*/
function (_Component) {
  _inherits(ScrollThumb, _Component);

  function ScrollThumb() {
    _classCallCheck(this, ScrollThumb);

    return _possibleConstructorReturn(this, _getPrototypeOf(ScrollThumb).apply(this, arguments));
  }

  _createClass(ScrollThumb, [{
    key: "componentDidUpdate",
    value: function componentDidUpdate() {
      this.props.cbAlertThumb();
    }
  }, {
    key: "render",
    value: function render() {
      var props = Object.assign({}, this.props);
      delete props.cbAlertThumb;
      return _react["default"].createElement(_Scrollbar.ScrollThumb, props);
    }
  }]);

  return ScrollThumb;
}(_react.Component);

exports.ScrollThumbBase = exports.ScrollThumb = ScrollThumb;
ScrollThumb.propTypes =
/** @lends moonstone/Scrollable.ScrollThumb.prototype */
{
  /**
   * Called when [ScrollThumb]{@link moonstone/Scrollable.ScrollThumb} is updated.
   *
   * @type {Function}
   * @private
   */
  cbAlertThumb: _propTypes["default"].func
};
ScrollThumb.defaultProps = {
  cbAlertThumb: nop
};
var _default = ScrollThumb;
exports["default"] = _default;