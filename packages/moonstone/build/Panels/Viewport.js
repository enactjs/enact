"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ViewportBase = exports.Viewport = exports["default"] = void 0;

var _classnames = _interopRequireDefault(require("classnames"));

var _handle = require("@enact/core/handle");

var _spotlight = _interopRequireDefault(require("@enact/spotlight"));

var _Pause = _interopRequireDefault(require("@enact/spotlight/Pause"));

var _ViewManager = _interopRequireWildcard(require("@enact/ui/ViewManager"));

var _invariant = _interopRequireDefault(require("invariant"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _react = _interopRequireDefault(require("react"));

var _reactDom = _interopRequireDefault(require("react-dom"));

var _SharedStateDecorator = _interopRequireWildcard(require("../internal/SharedStateDecorator"));

var _PanelsModule = _interopRequireDefault(require("./Panels.module.css"));

var _class, _temp;

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
 * The container for a set of Panels
 *
 * @class Viewport
 * @memberof moonstone/Panels
 * @private
 */
var ViewportBase = (_temp = _class =
/*#__PURE__*/
function (_React$Component) {
  _inherits(ViewportBase, _React$Component);

  function ViewportBase() {
    var _this;

    _classCallCheck(this, ViewportBase);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(ViewportBase).call(this));

    _this.addTransitioningClass = function () {
      if (_this.node) {
        _this.node.classList.add(_PanelsModule["default"].transitioning);
      }

      return true;
    };

    _this.removeTransitioningClass = function () {
      if (_this.node) {
        _this.node.classList.remove(_PanelsModule["default"].transitioning);
      }

      return true;
    };

    _this.pause = function () {
      return _this.paused.pause();
    };

    _this.resume = function () {
      return _this.paused.resume();
    };

    _this.handle = _handle.handle.bind(_assertThisInitialized(_this));
    _this.handleTransition = _this.handle((0, _handle.forward)('onTransition'), _this.removeTransitioningClass, _this.resume);
    _this.handleWillTransition = _this.handle((0, _handle.forward)('onWillTransition'), _this.addTransitioningClass, _this.pause);

    _this.mapChildren = function (children, generateId) {
      return _react["default"].Children.map(children, function (child, index) {
        if (child) {
          var _child$props$spotligh = child.props.spotlightId,
              spotlightId = _child$props$spotligh === void 0 ? generateId(index, 'panel-container', _spotlight["default"].remove) : _child$props$spotligh;
          var props = {
            spotlightId: spotlightId,
            'data-index': index
          };

          if (child.props.autoFocus == null && _this.state.direction === 'forward') {
            props.autoFocus = 'default-element';
          }

          return _react["default"].cloneElement(child, props);
        } else {
          return null;
        }
      });
    };

    _this.getEnteringProp = function (noAnimation) {
      return noAnimation ? null : 'hideChildren';
    };

    _this.paused = new _Pause["default"]('Viewport');
    _this.state = {
      prevIndex: -1,
      direction: 'forward'
    };
    return _this;
  }

  _createClass(ViewportBase, [{
    key: "componentDidMount",
    value: function componentDidMount() {
      // eslint-disable-next-line react/no-find-dom-node
      this.node = _reactDom["default"].findDOMNode(this);
    }
  }, {
    key: "componentDidUpdate",
    value: function componentDidUpdate(prevProps) {
      for (var i = prevProps.index; this.context && i > this.props.index; i--) {
        this.context["delete"](i);
      }
    }
  }, {
    key: "componentWillUnmount",
    value: function componentWillUnmount() {
      this.paused.resume();
    }
  }, {
    key: "render",
    value: function render() {
      var _this$props = this.props,
          arranger = _this$props.arranger,
          children = _this$props.children,
          generateId = _this$props.generateId,
          index = _this$props.index,
          noAnimation = _this$props.noAnimation,
          rest = _objectWithoutProperties(_this$props, ["arranger", "children", "generateId", "index", "noAnimation"]);

      var enteringProp = this.getEnteringProp(noAnimation);
      var mappedChildren = this.mapChildren(children, generateId);
      var className = (0, _classnames["default"])(_PanelsModule["default"].viewport, rest.className);

      var count = _react["default"].Children.count(mappedChildren);

      !(index === 0 && count === 0 || index < count) ? process.env.NODE_ENV !== "production" ? (0, _invariant["default"])(false, "Panels index, ".concat(index, ", is invalid for number of children, ").concat(count)) : invariant(false) : void 0;
      return _react["default"].createElement(_ViewManager["default"], Object.assign({}, rest, {
        arranger: arranger,
        className: className,
        component: "main",
        duration: 250,
        enteringDelay: 100 // TODO: Can we remove this?
        ,
        enteringProp: enteringProp,
        index: index,
        noAnimation: noAnimation,
        onTransition: this.handleTransition,
        onWillTransition: this.handleWillTransition
      }), mappedChildren);
    }
  }], [{
    key: "getDerivedStateFromProps",
    value: function getDerivedStateFromProps(props, state) {
      return {
        prevIndex: props.index,
        direction: state.prevIndex > props.index ? 'backward' : 'forward'
      };
    }
  }]);

  return ViewportBase;
}(_react["default"].Component), _class.displayName = 'Viewport', _class.contextType = _SharedStateDecorator.SharedState, _class.propTypes =
/** @lends moonstone/Panels.Viewport.prototype */
{
  /**
   * A function that generates a globally-unique identifier for a panel index
   *
   * @type {Function}
   * @required
   */
  generateId: _propTypes["default"].func.isRequired,

  /**
   * Set of functions that control how the panels are transitioned into and out of the
   * viewport
   *
   * @type {Arranger}
   */
  arranger: _ViewManager.shape,

  /**
   * Panels to be rendered
   *
   * @type {Panel}
   */
  children: _propTypes["default"].node,

  /**
   * Index of the active panel
   *
   * @type {Number}
   * @default 0
   */
  index: _propTypes["default"].number,

  /**
   * Disable panel transitions
   *
   * @type {Boolean}
   * @default false
   */
  noAnimation: _propTypes["default"].bool
}, _class.defaultProps = {
  index: 0,
  noAnimation: false
}, _temp);
exports.ViewportBase = ViewportBase;
var Viewport = (0, _SharedStateDecorator["default"])(ViewportBase);
exports.Viewport = Viewport;
var _default = Viewport;
exports["default"] = _default;