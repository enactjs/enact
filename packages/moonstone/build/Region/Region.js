"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.RegionBase = exports.Region = exports["default"] = void 0;

var _kind = _interopRequireDefault(require("@enact/core/kind"));

var _react = _interopRequireDefault(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _Heading = _interopRequireDefault(require("../Heading"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _objectWithoutProperties(source, excluded) { if (source == null) return {}; var target = _objectWithoutPropertiesLoose(source, excluded); var key, i; if (Object.getOwnPropertySymbols) { var sourceSymbolKeys = Object.getOwnPropertySymbols(source); for (i = 0; i < sourceSymbolKeys.length; i++) { key = sourceSymbolKeys[i]; if (excluded.indexOf(key) >= 0) continue; if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue; target[key] = source[key]; } } return target; }

function _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }

/**
 * A component for grouping other components.
 *
 * @class Region
 * @memberof moonstone/Region
 * @ui
 * @public
 */
var RegionBase = (0, _kind["default"])({
  name: 'Region',
  propTypes:
  /** @lends moonstone/Region.Region.prototype */
  {
    /**
     * Title placed within an instance of [Heading]{@link moonstone/Heading.Heading} before the
     * children.
     *
     * @type {String}
     * @required
     * @public
     */
    title: _propTypes["default"].string.isRequired,

    /**
     * The aria-label for the region.
     *
     * If unset, it defaults to the value of `title`
     *
     * @memberof moonstone/Region.Region.prototype
     * @type {String}
     * @public
     */
    'aria-label': _propTypes["default"].string,

    /**
     * Contents of the region.
     *
     * @type {Node}
     * @public
     */
    children: _propTypes["default"].node
  },
  computed: {
    'aria-label': function ariaLabel(_ref) {
      var _ariaLabel = _ref['aria-label'],
          title = _ref.title;
      return _ariaLabel || title;
    }
  },
  render: function render(_ref2) {
    var ariaLabel = _ref2['aria-label'],
        children = _ref2.children,
        title = _ref2.title,
        rest = _objectWithoutProperties(_ref2, ["aria-label", "children", "title"]);

    return _react["default"].createElement("div", Object.assign({}, rest, {
      role: "region",
      "aria-label": ariaLabel
    }), _react["default"].createElement(_Heading["default"], {
      showLine: true
    }, title), children);
  }
});
exports.RegionBase = exports.Region = RegionBase;
var _default = RegionBase;
exports["default"] = _default;