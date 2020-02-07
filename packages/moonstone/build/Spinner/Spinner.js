"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.SpinnerDecorator = exports.SpinnerBase = exports.Spinner = exports["default"] = void 0;

var _kind = _interopRequireDefault(require("@enact/core/kind"));

var _hoc = _interopRequireDefault(require("@enact/core/hoc"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _Pure = _interopRequireDefault(require("@enact/ui/internal/Pure"));

var _compose = _interopRequireDefault(require("ramda/src/compose"));

var _react = _interopRequireDefault(require("react"));

var _Pause = _interopRequireDefault(require("@enact/spotlight/Pause"));

var _Spinner = _interopRequireDefault(require("@enact/ui/Spinner"));

var _spotlight = _interopRequireDefault(require("@enact/spotlight"));

var _$L = _interopRequireDefault(require("../internal/$L"));

var _Marquee = _interopRequireDefault(require("../Marquee"));

var _Skinnable = _interopRequireDefault(require("../Skinnable"));

var _SpinnerModule = _interopRequireDefault(require("./Spinner.module.css"));

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

function _objectWithoutProperties(source, excluded) { if (source == null) return {}; var target = _objectWithoutPropertiesLoose(source, excluded); var key, i; if (Object.getOwnPropertySymbols) { var sourceSymbolKeys = Object.getOwnPropertySymbols(source); for (i = 0; i < sourceSymbolKeys.length; i++) { key = sourceSymbolKeys[i]; if (excluded.indexOf(key) >= 0) continue; if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue; target[key] = source[key]; } } return target; }

function _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }

/**
 * A component that shows spinning balls, with optional text as children.
 *
 * @class SpinnerCore
 * @memberof moonstone/Spinner
 * @ui
 * @private
 */
var SpinnerCore = (0, _kind["default"])({
  name: 'SpinnerCore',
  propTypes: {
    css: _propTypes["default"].object
  },
  styles: {
    css: _SpinnerModule["default"]
  },
  computed: {
    'aria-label': function ariaLabel(_ref) {
      var aria = _ref['aria-label'],
          children = _ref.children;

      if (aria) {
        return aria;
      } else if (!children) {
        return (0, _$L["default"])('Loading');
      }
    }
  },
  render: function render(_ref2) {
    var children = _ref2.children,
        css = _ref2.css,
        rest = _objectWithoutProperties(_ref2, ["children", "css"]);

    return _react["default"].createElement("div", Object.assign({
      "aria-live": "off",
      role: "alert"
    }, rest), _react["default"].createElement("div", {
      className: css.bg
    }, _react["default"].createElement("div", {
      className: css.decorator
    }, _react["default"].createElement("div", {
      className: css.fan1
    }), _react["default"].createElement("div", {
      className: css.fan2
    }), _react["default"].createElement("div", {
      className: css.fan3
    }), _react["default"].createElement("div", {
      className: css.fan4
    }), _react["default"].createElement("div", {
      className: css.cap
    }))), children ? _react["default"].createElement(_Marquee["default"], {
      className: css.client,
      marqueeOn: "render",
      alignment: "center"
    }, children) : null);
  }
});
/**
 * The base component, defining all of the properties.
 *
 * @class SpinnerBase
 * @memberof moonstone/Spinner
 * @extends ui/Spinner.SpinnerBase
 * @ui
 * @public
 */

var SpinnerBase = (0, _kind["default"])({
  name: 'Spinner',
  propTypes:
  /** @lends moonstone/Spinner.SpinnerBase.prototype */
  {
    /**
     * Customizes the component by mapping the supplied collection of CSS class names to the
     * corresponding internal Elements and states of this component.
     *
     * The following classes are supported:
     *
     * * `spinner` - The root component class, unless there is a scrim. The scrim and floating
     *	layer can be a sibling or parent to this root "spinner" element.
     *
     * @type {Object}
     * @public
     */
    css: _propTypes["default"].object,

    /**
     * Customize the size of this component.
     *
     * Recommended usage is "medium" (default) for standalone and popup scenarios, while "small"
     * is best suited for use inside other elements, like {@link moonstone/SlotItem.SlotItem}.
     *
     * @type {('medium'|'small')}
     * @default 'medium'
     * @public
     */
    size: _propTypes["default"].oneOf(['medium', 'small']),

    /**
     * Removes the background color (making it transparent).
     *
     * @type {Boolean}
     * @default false
     * @public
     */
    transparent: _propTypes["default"].bool
  },
  defaultProps: {
    size: 'medium',
    transparent: false
  },
  styles: {
    css: _SpinnerModule["default"],
    publicClassNames: 'spinner'
  },
  computed: {
    className: function className(_ref3) {
      var children = _ref3.children,
          size = _ref3.size,
          transparent = _ref3.transparent,
          styler = _ref3.styler;
      return styler.append(size, {
        content: !!children,
        transparent: transparent
      });
    }
  },
  render: function render(_ref4) {
    var children = _ref4.children,
        css = _ref4.css,
        rest = _objectWithoutProperties(_ref4, ["children", "css"]);

    delete rest.transparent;
    return _react["default"].createElement(_Spinner["default"], Object.assign({}, rest, {
      css: css,
      component: SpinnerCore
    }), children);
  }
});
/**
 * A higher-order component that pauses spotlight when `blockClickOn` prop is `'screen'`.
 *
 * Resumes spotlight when unmounted. However, spotlight is not paused when `blockClickOn` prop is
 * `'container'`. Blocking spotlight within the container is up to app implementation.
 *
 * @hoc
 * @memberof moonstone/Spinner
 * @ui
 * @private
 */

exports.SpinnerBase = SpinnerBase;
var SpinnerSpotlightDecorator = (0, _hoc["default"])(function (config, Wrapped) {
  var _class, _temp;

  return _temp = _class =
  /*#__PURE__*/
  function (_React$Component) {
    _inherits(_class, _React$Component);

    function _class(props) {
      var _this;

      _classCallCheck(this, _class);

      _this = _possibleConstructorReturn(this, _getPrototypeOf(_class).call(this, props));
      _this.paused = new _Pause["default"]('Spinner');
      var blockClickOn = props.blockClickOn;

      var current = _spotlight["default"].getCurrent();

      if (blockClickOn === 'screen') {
        _this.paused.pause();

        if (current) {
          current.blur();
        }
      }

      return _this;
    }

    _createClass(_class, [{
      key: "componentWillUnmount",
      value: function componentWillUnmount() {
        var blockClickOn = this.props.blockClickOn;

        if (blockClickOn === 'screen') {
          _spotlight["default"].focus();

          this.paused.resume();
        }
      }
    }, {
      key: "render",
      value: function render() {
        return _react["default"].createElement(Wrapped, this.props);
      }
    }]);

    return _class;
  }(_react["default"].Component), _class.displayName = 'SpinnerSpotlightDecorator', _class.propTypes =
  /** @lends moonstone/Spinner.Spinner.prototype */
  {
    /**
     * Determines how far the click-blocking should extend.
     *
     * It can be either `'screen'`, `'container'`, or `null`. `'screen'` pauses spotlight.
     * Changing this property to `'screen'` after creation is not supported.
     *
     * @type {String}
     * @default null
     * @public
     */
    blockClickOn: _propTypes["default"].oneOf(['screen', 'container', null])
  }, _temp;
});
/**
 * Moonstone-specific Spinner behaviors to apply to [Spinner]{@link moonstone/Spinner.Spinner}.
 *
 * @hoc
 * @memberof moonstone/Spinner
 * @mixes moonstone/Skinnable.Skinnable
 * @public
 */

var SpinnerDecorator = (0, _compose["default"])(_Pure["default"], SpinnerSpotlightDecorator, _Skinnable["default"]);
/**
 * A Moonstone-styled Spinner.
 *
 * @class Spinner
 * @memberof moonstone/Spinner
 * @extends moonstone/Spinner.SpinnerBase
 * @mixes moonstone/Spinner.SpinnerDecorator
 * @ui
 * @public
 */

exports.SpinnerDecorator = SpinnerDecorator;
var Spinner = SpinnerDecorator(SpinnerBase);
exports.Spinner = Spinner;
var _default = Spinner;
exports["default"] = _default;