"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.MediaSliderDecorator = exports["default"] = void 0;

var _handle = require("@enact/core/handle");

var _hoc = _interopRequireDefault(require("@enact/core/hoc"));

var _platform = _interopRequireDefault(require("@enact/core/platform"));

var _utils = require("@enact/ui/Slider/utils");

var _clamp = _interopRequireDefault(require("ramda/src/clamp"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _react = _interopRequireDefault(require("react"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance"); }

function _iterableToArrayLimit(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

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

// decrements the MediaKnob position if we're tracking
var _decrement = function decrement(state) {
  if (state.tracking && state.x > 0) {
    var x = Math.max(0, state.x - 0.05);
    return {
      x: x
    };
  }

  return null;
}; // increments the MediaKnob position if we're tracking


var _increment = function increment(state) {
  if (state.tracking && state.x < 1) {
    var x = Math.min(1, state.x + 0.05);
    return {
      x: x
    };
  }

  return null;
};

var handleBlur = (0, _handle.handle)((0, _handle.forward)('onBlur'), (0, _handle.call)('untrack'));
var handleFocus = (0, _handle.handle)((0, _handle.forward)('onFocus'), // extract target from the event and pass it to track()
(0, _handle.adaptEvent)(function (_ref) {
  var target = _ref.target;
  return target;
}, (0, _handle.call)('track')));
var handleKeyDown = (0, _handle.handle)((0, _handle.forward)('onKeyDown'), (0, _handle.call)('isTracking'), // if tracking and the key is left/right update the preview x position
(0, _handle.oneOf)([(0, _handle.forKey)('left'), (0, _handle.returnsTrue)((0, _handle.call)('decrement'))], [(0, _handle.forKey)('right'), (0, _handle.returnsTrue)((0, _handle.call)('increment'))]), // if we handled left or right, preventDefault to prevent browser scroll behavior
_handle.preventDefault, // stopImmediate to prevent spotlight handling
_handle.stopImmediate);
var handleKeyUp = (0, _handle.handle)((0, _handle.forward)('onKeyUp'), (0, _handle.call)('isTracking'), (0, _handle.forKey)('enter'), // prevent moonstone/Slider from activating the knob
_handle.preventDefault, (0, _handle.adaptEvent)((0, _handle.call)('getEventPayload'), (0, _handle.forward)('onChange')));
/**
 * MediaSlider for {@link moonstone/VideoPlayer}.
 *
 * @class MediaSliderDecorator
 * @memberof moonstone/VideoPlayer
 * @hoc
 * @private
 */

var MediaSliderDecorator = (0, _hoc["default"])(function (config, Wrapped) {
  var _class, _temp;

  // eslint-disable-line no-unused-vars
  return _temp = _class =
  /*#__PURE__*/
  function (_React$Component) {
    _inherits(_class, _React$Component);

    function _class(props) {
      var _this;

      _classCallCheck(this, _class);

      _this = _possibleConstructorReturn(this, _getPrototypeOf(_class).call(this, props));
      _this.handleMouseOver = _this.handleMouseOver.bind(_assertThisInitialized(_this));
      _this.handleMouseOut = _this.handleMouseOut.bind(_assertThisInitialized(_this));
      _this.handleMouseMove = _this.handleMouseMove.bind(_assertThisInitialized(_this));

      if (_platform["default"].touch) {
        _this.handleTouchMove = _this.handleTouchMove.bind(_assertThisInitialized(_this));
      }

      handleBlur.bindAs(_assertThisInitialized(_this), 'handleBlur');
      handleFocus.bindAs(_assertThisInitialized(_this), 'handleFocus');
      handleKeyDown.bindAs(_assertThisInitialized(_this), 'handleKeyDown');
      handleKeyUp.bindAs(_assertThisInitialized(_this), 'handleKeyUp');
      _this.state = {
        maxX: 0,
        minX: 0,
        tracking: false,
        x: 0
      };
      return _this;
    }

    _createClass(_class, [{
      key: "componentDidUpdate",
      value: function componentDidUpdate(prevProps, prevState) {
        if (prevState.x !== this.state.x) {
          (0, _handle.forward)('onKnobMove', this.getEventPayload('onKnobMove'), this.props);
        }
      }
    }, {
      key: "getEventPayload",
      value: function getEventPayload(type) {
        return {
          type: type,
          value: this.state.x,
          proportion: this.state.x
        };
      }
    }, {
      key: "track",
      value: function track(target) {
        var bounds = target.getBoundingClientRect();
        this.setState({
          maxX: bounds.right,
          minX: bounds.left,
          tracking: true,
          x: this.props.value
        });
      }
    }, {
      key: "move",
      value: function move(clientX) {
        this.setState(function (state) {
          var value = (0, _clamp["default"])(state.minX, state.maxX, clientX);
          return {
            x: (0, _utils.calcProportion)(state.minX, state.maxX, value)
          };
        });
      }
    }, {
      key: "untrack",
      value: function untrack() {
        this.setState({
          maxX: 0,
          minX: 0,
          tracking: false
        });
      }
    }, {
      key: "decrement",
      value: function decrement() {
        this.setState(_decrement);
      }
    }, {
      key: "increment",
      value: function increment() {
        this.setState(_increment);
      }
    }, {
      key: "isTracking",
      value: function isTracking() {
        return this.state.tracking;
      }
    }, {
      key: "handleMouseOver",
      value: function handleMouseOver(ev) {
        if (ev.currentTarget.contains(ev.relatedTarget)) {
          return;
        }

        this.track(ev.currentTarget);
        this.move(ev.clientX);
      }
    }, {
      key: "handleMouseOut",
      value: function handleMouseOut(ev) {
        if (ev.currentTarget.contains(ev.relatedTarget)) {
          return;
        }

        this.untrack();
      }
    }, {
      key: "handleMouseMove",
      value: function handleMouseMove(ev) {
        this.move(ev.clientX);
      }
    }, {
      key: "handleTouchMove",
      value: function handleTouchMove(ev) {
        // ignores multi touch
        this.move(ev.touches[0].clientX);
      }
    }, {
      key: "render",
      value: function render() {
        var _this$props = this.props,
            selection = _this$props.selection,
            rest = _objectWithoutProperties(_this$props, ["selection"]);

        var backgroundProgress = this.props.backgroundProgress;
        var progressAnchor = 0;

        if (selection != null && selection.length > 0) {
          // extracts both values from selection, defaulting backgroundProgress to
          // progressAnchor if not defined
          var _selection = _slicedToArray(selection, 2);

          progressAnchor = _selection[0];
          var _selection$ = _selection[1];
          backgroundProgress = _selection$ === void 0 ? progressAnchor : _selection$;
        }

        delete rest.onKnobMove;

        if (_platform["default"].touch) {
          rest.onTouchMove = this.handleTouchMove;
        }

        return _react["default"].createElement(Wrapped, Object.assign({}, rest, {
          backgroundProgress: backgroundProgress,
          onBlur: this.handleBlur,
          onFocus: this.handleFocus,
          onKeyDown: this.handleKeyDown,
          onKeyUp: this.handleKeyUp,
          onMouseOver: this.handleMouseOver,
          onMouseOut: this.handleMouseOut,
          onMouseMove: this.handleMouseMove,
          preview: this.state.tracking,
          previewProportion: this.state.x,
          progressAnchor: progressAnchor
        }));
      }
    }]);

    return _class;
  }(_react["default"].Component), _class.displayName = 'MediaSliderDecorator', _class.propTypes = {
    backgroundProgress: _propTypes["default"].number,
    selection: _propTypes["default"].arrayOf(_propTypes["default"].number),
    value: _propTypes["default"].number
  }, _temp;
});
exports.MediaSliderDecorator = MediaSliderDecorator;
var _default = MediaSliderDecorator;
exports["default"] = _default;