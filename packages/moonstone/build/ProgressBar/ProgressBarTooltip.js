"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ProgressBarTooltipBase = exports.ProgressBarTooltip = exports["default"] = void 0;

var _propTypes = _interopRequireDefault(require("@enact/core/internal/prop-types"));

var _kind = _interopRequireDefault(require("@enact/core/kind"));

var _util = require("@enact/core/util");

var _i18n = _interopRequireDefault(require("@enact/i18n"));

var _I18nDecorator = require("@enact/i18n/I18nDecorator");

var _NumFmt = _interopRequireDefault(require("ilib/lib/NumFmt"));

var _react = _interopRequireDefault(require("react"));

var _propTypes2 = _interopRequireDefault(require("prop-types"));

var _warning = _interopRequireDefault(require("warning"));

var _Tooltip = _interopRequireDefault(require("../TooltipDecorator/Tooltip"));

var _ProgressBarTooltipModule = _interopRequireDefault(require("./ProgressBarTooltip.module.css"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _objectWithoutProperties(source, excluded) { if (source == null) return {}; var target = _objectWithoutPropertiesLoose(source, excluded); var key, i; if (Object.getOwnPropertySymbols) { var sourceSymbolKeys = Object.getOwnPropertySymbols(source); for (i = 0; i < sourceSymbolKeys.length; i++) { key = sourceSymbolKeys[i]; if (excluded.indexOf(key) >= 0) continue; if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue; target[key] = source[key]; } } return target; }

function _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { _defineProperty(target, key, source[key]); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance"); }

function _iterableToArrayLimit(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

// prop-type validator that warns on invalid orientation + position

/* istanbul ignore next */
var validatePosition = function validatePosition(base) {
  return function (props, key, componentName, location, propFullName) {
    var position = props.position;

    for (var _len = arguments.length, rest = new Array(_len > 5 ? _len - 5 : 0), _key = 5; _key < _len; _key++) {
      rest[_key - 5] = arguments[_key];
    }

    var result = base.apply(void 0, [props, key, componentName, location, propFullName].concat(rest));

    if (!result && position) {
      var orientation = props.orientation || 'horizontal';
      var hasVerticalValue = ['before', 'after', 'left', 'right'].includes(position);

      if (orientation === 'vertical' && !hasVerticalValue || orientation === 'horizontal' && hasVerticalValue) {
        result = new Error("'".concat(key, "' value '").concat(position, "' is not a valid value for the orientation '").concat(orientation, "'"));
      }
    }

    return result;
  };
};

var memoizedPercentFormatter = (0, _util.memoize)(function () {
  return (
    /* locale */
    new _NumFmt["default"]({
      type: 'percentage',
      useNative: false
    })
  );
});

var getDefaultPosition = function getDefaultPosition(orientation) {
  return orientation === 'horizontal' ? 'above' : 'before';
}; // Returns an array of keywords with horizontal first and vetical second


var getSide = function getSide(orientation, side, position) {
  if (position || !side) {
    position = position || getDefaultPosition(orientation);

    if (orientation === 'horizontal') {
      switch (position) {
        case 'above':
        case 'below':
          return ['auto', position];

        case 'above after':
        case 'above before':
        case 'above left':
        case 'above right':
        case 'below after':
        case 'below before':
        case 'below left':
        case 'below right':
          return position.split(' ').reverse();

        default:
          // invalid values for horizontal so use defaults
          return ['auto', 'above'];
      }
    } else {
      switch (position) {
        case 'after':
        case 'before':
        case 'left':
        case 'right':
          return [position, 'above'];

        default:
          // invalid values for horizontal so use defaults
          return ['before', 'auto'];
      }
    }
  } else {
    var valid = orientation === 'vertical' || orientation === 'horizontal' && (side === 'before' || side === 'after');
    process.env.NODE_ENV !== "production" ? (0, _warning["default"])(valid, 'The value of `side` must be either "after" or "before" when `orientation` is "horizontal"') : void 0;

    if (orientation === 'horizontal') {
      // Testing for 'after' so if side === left or right, we default to "above"
      return ['auto', side === 'after' ? 'below' : 'above'];
    }

    return [side, 'auto'];
  }
};
/**
 * A [Tooltip]{@link moonstone/TooltipDecorator.Tooltip} specifically adapted for use with
 * [IncrementSlider]{@link moonstone/IncrementSlider.IncrementSlider},
 * [ProgressBar]{@link moonstone/ProgressBar.ProgressBar}, or
 * [Slider]{@link moonstone/Slider.Slider}.
 *
 * @class ProgressBarTooltip
 * @memberof moonstone/ProgressBar
 * @ui
 * @public
 */


var ProgressBarTooltipBase = (0, _kind["default"])({
  name: 'ProgressBarTooltip',
  propTypes:
  /** @lends moonstone/ProgressBar.ProgressBarTooltip.prototype */
  {
    /**
     * Sets the orientation of the tooltip based on the orientation of the bar.
     *
     * 'vertical' sends the tooltip to one of the sides, 'horizontal'  positions it above the bar.
     * * Values: `'horizontal'`, `'vertical'`
     *
     * @type {String}
     * @default 'horizontal'
     * @public
     */
    orientation: _propTypes2["default"].oneOf(['horizontal', 'vertical']),

    /**
     * Displays the value as a percentage.
     *
     * @type {Boolean}
     * @default false
     * @public
     */
    percent: _propTypes2["default"].bool,

    /**
     * Position of the tooltip with respect to the progress bar.
     *
     * * For `orientation="horizontal"` progress bars, the default value is `'above'`.
     * * For `orientation="vertical"` progress bars, the default value is `'before'`.
     *
     * When using `'before'` or `'after'` alone or in any of the below combinations, `'before'`
     * will position the tooltip on the side of the current locale's text directionality. In LTR
     * locales, it will be on the left; in RTL locales, it will be on the right. Similarly,
     * `'after'` will position the tooltip on the oppoosite side: the right side for LTR and
     * left for RTL.
     *
     * Valid values when `orientation="horizontal"`
     *
     * | *Value* | *Tooltip Direction* |
     * |---|---|
     * | `'above'` | Above component, flowing to the nearest end |
     * | `'above left'` | Above component, flowing to the left |
     * | `'above before'` | Above component, flowing to the start of text |
     * | `'above right'` | Above component, flowing to the right |
     * | `'above after'` | Above component, flowing to the end of text |
     * | `'below'` | Below component, flowing to the nearest end |
     * | `'below left'` | Below component, flowing to the left |
     * | `'below before'` | Below component, flowing to the start of text |
     * | `'below right'` | Below component, flowing to the right |
     * | `'below after'` | Below component, flowing to the end of text |
     *
     * Valid values when `orientation="vertical"`
     *
     * | *Value* | *Tooltip Direction* |
     * |---|---|
     * | `'left'` | Left of the component, contents middle aligned |
     * | `'before'` | Start of text side of the component, contents middle aligned |
     * | `'right'` | right of the component, contents middle aligned |
     * | `'after'` | End of text side of the component, contents middle aligned |
     *
     * @type {('above'|'above before'|'above left'|'above after'|'above right'|'below'|'below left'|'below before'|'below right'|'below after'|'left'|'before'|'right'|'after')}
     * @public
     */
    position: validatePosition(_propTypes2["default"].oneOf([// horizontal
    'above', 'above before', 'above left', 'above after', 'above right', 'below', 'below left', 'below before', 'below right', 'below after', // vertical
    'left', 'before', 'right', 'after'])),

    /**
     * The proportion of the filled part of the bar.
     *
     * * Should be a number between 0 and 1.
     *
     * @type {Number}
     * @default 0
     * @public
     */
    proportion: _propTypes2["default"].number,

    /**
     * Sets the text direction to be right-to-left
     *
     * @type {Boolean}
     * @private
     */
    rtl: _propTypes2["default"].bool,

    /**
     * Specify where the tooltip should appear in relation to the ProgressBar/Slider bar.
     *
     * Allowed values are:
     *
     * * `'after'` renders below a `horizontal` ProgressBar/Slider and after (respecting the
     *   current locale's text direction) a `vertical` ProgressBar/Slider
     * * `'before'` renders above a `horizontal` ProgressBar/Slider and before (respecting the
     *   current locale's text direction) a `vertical` ProgressBar/Slider
     * * `'left'` renders to the left of a `vertical` ProgressBar/Slider regardless of locale
     * * `'right'` renders to the right of a `vertical` ProgressBar/Slider regardless of locale
     *
     * @type {String}
     * @deprecated Deprecated since 3.1 until 4.0 in favor of `position`
     * @public
     */
    side: _propTypes["default"].deprecated(_propTypes2["default"].oneOf(['after', 'before', 'left', 'right']), {
      name: 'side',
      since: '3.1.0',
      until: '4.0.0',
      replacedBy: 'position'
    }),

    /**
     * Visibility of the tooltip
     *
     * @type {Boolean}
     * @default false
     * @public
     */
    visible: _propTypes2["default"].bool
  },
  defaultProps: {
    orientation: 'horizontal',
    percent: false,
    proportion: 0,
    visible: false
  },
  styles: {
    css: _ProgressBarTooltipModule["default"],
    className: 'tooltip'
  },
  computed: {
    children: function children(_ref) {
      var _children = _ref.children,
          proportion = _ref.proportion,
          percent = _ref.percent;

      if (percent) {
        var formatter = memoizedPercentFormatter(_i18n["default"].getLocale());
        return formatter.format(Math.round(proportion * 100));
      }

      return _children;
    },
    className: function className(_ref2) {
      var orientation = _ref2.orientation,
          position = _ref2.position,
          proportion = _ref2.proportion,
          side = _ref2.side,
          styler = _ref2.styler;

      var _getSide = getSide(orientation, side, position),
          _getSide2 = _slicedToArray(_getSide, 2),
          h = _getSide2[0],
          v = _getSide2[1];

      return styler.append(orientation, {
        above: v === 'above',
        below: v === 'below',
        before: h === 'before',
        after: h === 'after',
        left: h === 'left' || h === 'auto' && proportion <= 0.5,
        right: h === 'right' || h === 'auto' && proportion > 0.5
      });
    },
    arrowAnchor: function arrowAnchor(_ref3) {
      var orientation = _ref3.orientation,
          position = _ref3.position,
          proportion = _ref3.proportion,
          rtl = _ref3.rtl;
      if (orientation === 'vertical') return 'middle';

      var _getSide3 = getSide(orientation, false, position),
          _getSide4 = _slicedToArray(_getSide3, 1),
          h = _getSide4[0];

      switch (h) {
        case 'auto':
          return proportion > 0.5 ? 'left' : 'right';

        case 'before':
          return rtl ? 'right' : 'left';

        case 'after':
          return rtl ? 'left' : 'right';

        case 'left':
        case 'right':
          return h;
      }
    },
    direction: function direction(_ref4) {
      var orientation = _ref4.orientation,
          position = _ref4.position,
          rtl = _ref4.rtl,
          side = _ref4.side;

      var _getSide5 = getSide(orientation, side, position),
          _getSide6 = _slicedToArray(_getSide5, 2),
          h = _getSide6[0],
          v = _getSide6[1];

      var dir = 'right';

      if (orientation === 'vertical') {
        if ( // forced to the left
        h === 'left' || // LTR before
        !rtl && h === 'before' || // RTL after
        rtl && h === 'after') {
          dir = 'left';
        }
      } else {
        dir = v !== 'below' ? 'above' : 'below';
      }

      return dir;
    },
    style: function style(_ref5) {
      var proportion = _ref5.proportion,
          _style = _ref5.style;
      return _objectSpread({}, _style, {
        '--tooltip-progress-proportion': proportion
      });
    }
  },
  render: function render(_ref6) {
    var children = _ref6.children,
        visible = _ref6.visible,
        rest = _objectWithoutProperties(_ref6, ["children", "visible"]);

    if (!visible) return null;
    delete rest.orientation;
    delete rest.percent;
    delete rest.position;
    delete rest.proportion;
    delete rest.rtl;
    delete rest.side;
    return _react["default"].createElement(_Tooltip["default"], rest, children);
  }
});
exports.ProgressBarTooltipBase = ProgressBarTooltipBase;
var ProgressBarTooltip = (0, _I18nDecorator.I18nContextDecorator)({
  rtlProp: 'rtl'
}, ProgressBarTooltipBase);
exports.ProgressBarTooltip = ProgressBarTooltip;
ProgressBarTooltip.defaultSlot = 'tooltip';
var _default = ProgressBarTooltip;
exports["default"] = _default;