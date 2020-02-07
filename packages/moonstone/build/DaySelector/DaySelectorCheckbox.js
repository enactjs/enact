"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.DaySelectorCheckboxBase = exports.DaySelectorCheckbox = exports["default"] = void 0;

var _kind = _interopRequireDefault(require("@enact/core/kind"));

var _react = _interopRequireDefault(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _Icon = _interopRequireDefault(require("../Icon"));

var _Skinnable = _interopRequireDefault(require("../Skinnable"));

var _DaySelectorCheckboxModule = _interopRequireDefault(require("./DaySelectorCheckbox.module.css"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

/**
 * A component that represents the selected state of a day within a
 * {@link moonstone/DaySelector.DaySelector}. It has built-in spotlight support and is intended for
 * use in a specialized [Item]{@link moonstone/Item} that does not visually respond to focus, so
 * this can show focus instead.
 *
 * @class DaySelectorCheckbox
 * @memberof moonstone/DaySelector
 * @ui
 * @private
 */
var DaySelectorCheckboxBase = (0, _kind["default"])({
  name: 'DaySelectorCheckbox',
  propTypes:
  /** @lends moonstone/DaySelector.DaySelectorCheckbox.prototype */
  {
    /**
     * Sets whether this control is disabled, and non-interactive
     *
     * @type {Boolean}
     * @public
     */
    disabled: _propTypes["default"].bool,

    /**
     * Sets whether this control is in the "on" or "off" state. `true` for on, `false` for "off".
     *
     * @type {Boolean}
     * @public
     */
    selected: _propTypes["default"].bool
  },
  styles: {
    css: _DaySelectorCheckboxModule["default"],
    className: 'daySelectorCheckbox'
  },
  computed: {
    className: function className(_ref) {
      var selected = _ref.selected,
          styler = _ref.styler;
      return styler.append({
        selected: selected
      });
    }
  },
  render: function render(_ref2) {
    var rest = Object.assign({}, _ref2);
    delete rest.selected;
    return _react["default"].createElement("div", rest, _react["default"].createElement(_Icon["default"], {
      className: _DaySelectorCheckboxModule["default"].icon
    }, "check"));
  }
});
exports.DaySelectorCheckboxBase = DaySelectorCheckboxBase;
var DaySelectorCheckbox = (0, _Skinnable["default"])(DaySelectorCheckboxBase);
exports.DaySelectorCheckbox = DaySelectorCheckbox;
var _default = DaySelectorCheckbox;
exports["default"] = _default;