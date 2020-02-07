"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.BreadcrumbBase = exports.Breadcrumb = exports["default"] = exports.breadcrumbWidth = void 0;

var _handle = require("@enact/core/handle");

var _kind = _interopRequireDefault(require("@enact/core/kind"));

var _Spottable = _interopRequireDefault(require("@enact/spotlight/Spottable"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _react = _interopRequireDefault(require("react"));

var _$L = _interopRequireDefault(require("../internal/$L"));

var _PanelsModule = _interopRequireDefault(require("./Panels.module.css"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _objectWithoutProperties(source, excluded) { if (source == null) return {}; var target = _objectWithoutPropertiesLoose(source, excluded); var key, i; if (Object.getOwnPropertySymbols) { var sourceSymbolKeys = Object.getOwnPropertySymbols(source); for (i = 0; i < sourceSymbolKeys.length; i++) { key = sourceSymbolKeys[i]; if (excluded.indexOf(key) >= 0) continue; if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue; target[key] = source[key]; } } return target; }

function _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }

// Since we expose `onSelect` to handle breadcrumb selection, we need that handler to be set on a
// component that proxies mouse events for key events so we create a spottable div that will
// get the right classes as well as handle events correctly.
var SpottableDiv = (0, _Spottable["default"])('div');
/**
 * The width of a breadcrumb which may be used to allocate space for it in a panels layout.
 *
 * @type {Number}
 * @default 96;
 * @private
 * @memberof moonstone/Panels
 */

var breadcrumbWidth = 96;
/**
 * Vertical, transparent bar used to navigate to a prior Panel.
 *
 * [`ActivityPanels`]{@link moonstone/Panels.ActivityPanels} has one breadcrumb, and
 * [`AlwaysViewingPanels`]{@link moonstone/Panels.AlwaysViewingPanels} can have multiple stacked
 * horizontally.
 *
 * @class Breadcrumb
 * @memberof moonstone/Panels
 * @ui
 * @public
 */

exports.breadcrumbWidth = breadcrumbWidth;
var BreadcrumbBase = (0, _kind["default"])({
  name: 'Breadcrumb',
  propTypes:
  /** @lends moonstone/Panels.Breadcrumb.prototype */
  {
    /**
     * Index of the associated panel.
     *
     * @type {Number}
     * @required
     */
    index: _propTypes["default"].number.isRequired,

    /**
     * Called when the breadcrumb is clicked.
     *
     * @private
     * @type {Function}
     */
    onClick: _propTypes["default"].func,

    /**
     * Called when the breadcrumb is clicked.
     *
     * The index of the clicked breadcrumb is passed in the event data.
     *
     * @type {Function}
     */
    onSelect: _propTypes["default"].func
  },
  styles: {
    css: _PanelsModule["default"],
    className: 'breadcrumb'
  },
  handlers: {
    onSelect: (0, _handle.handle)((0, _handle.forward)('onClick'), (0, _handle.adaptEvent)(function (ev, _ref) {
      var index = _ref.index;
      return {
        type: 'onSelect',
        index: index
      };
    }, (0, _handle.forward)('onSelect')))
  },
  render: function render(_ref2) {
    var children = _ref2.children,
        index = _ref2.index,
        onSelect = _ref2.onSelect,
        rest = _objectWithoutProperties(_ref2, ["children", "index", "onSelect"]);

    return _react["default"].createElement(SpottableDiv, Object.assign({}, rest, {
      "aria-label": (0, _$L["default"])('GO TO PREVIOUS'),
      "data-index": index,
      onClick: onSelect
    }), _react["default"].createElement("div", {
      className: _PanelsModule["default"].breadcrumbHeader
    }, children));
  }
});
exports.BreadcrumbBase = exports.Breadcrumb = BreadcrumbBase;
var _default = BreadcrumbBase;
exports["default"] = _default;