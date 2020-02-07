"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.IndexedBreadcrumbs = exports["default"] = void 0;

var _react = _interopRequireDefault(require("react"));

var _Breadcrumb = _interopRequireDefault(require("./Breadcrumb"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

/**
 * Generates an array of at most `max` breadcrumbs with zero-padded labels prefixed by <
 *
 * @param {Number} index      Index of active breadcrumb
 * @param {Number} max        Maximum number of breadcrumbs to dispaly
 * @param {Function} onSelect Handler for selecting a breadcrumb
 * @returns {React.element[]} Array of breadcrumbs
 * @private
 */
var IndexedBreadcrumbs = function IndexedBreadcrumbs(id, index, max, onSelect) {
  var breadcrumbs = new Array(index < max ? index : max);
  var start = Math.max(index - max, 0);

  for (var i = start; i < index; i++) {
    var label = (i < 9 ? '0' : '') + (i + 1);
    breadcrumbs[index - i - 1] = _react["default"].createElement(_Breadcrumb["default"], {
      onSelect: onSelect,
      id: "".concat(id, "_bc_").concat(i),
      index: i,
      key: i
    }, "< ", label);
  }

  return breadcrumbs;
};

exports.IndexedBreadcrumbs = IndexedBreadcrumbs;
var _default = IndexedBreadcrumbs;
exports["default"] = _default;