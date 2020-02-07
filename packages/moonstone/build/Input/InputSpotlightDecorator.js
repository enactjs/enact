"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.InputSpotlightDecorator = exports["default"] = void 0;

var _handle = require("@enact/core/handle");

var _hoc = _interopRequireDefault(require("@enact/core/hoc"));

var _keymap = require("@enact/core/keymap");

var _spotlight = require("@enact/spotlight");

var _Pause = _interopRequireDefault(require("@enact/spotlight/Pause"));

var _Spottable = _interopRequireDefault(require("@enact/spotlight/Spottable"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _react = _interopRequireDefault(require("react"));

var _pointer = require("./pointer");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

var isBubbling = function isBubbling(ev) {
  return ev.currentTarget !== ev.target;
}; // A regex to check for input types that allow selectionStart


var SELECTABLE_TYPES = /text|password|search|tel|url/;

var isSelectionAtLocation = function isSelectionAtLocation(target, location) {
  if (SELECTABLE_TYPES.test(target.type)) {
    return target.selectionStart === location;
  } else {
    return true;
  }
};

var handleKeyDown = (0, _handle.handle)((0, _handle.forwardWithPrevent)('onKeyDown'), (0, _handle.call)('onKeyDown'));
/**
 * A higher-order component that manages the
 * spotlight behavior for an {@link moonstone/Input.Input}
 *
 * @class InputSpotlightDecorator
 * @memberof moonstone/Input/InputSpotlightDecorator
 * @hoc
 * @private
 */

var InputSpotlightDecorator = (0, _hoc["default"])(function (config, Wrapped) {
  var _class, _temp;

  var Component = (0, _Spottable["default"])({
    emulateMouse: false
  }, Wrapped);
  var forwardBlur = (0, _handle.forward)('onBlur');
  var forwardMouseDown = (0, _handle.forward)('onMouseDown');
  var forwardFocus = (0, _handle.forward)('onFocus');
  var forwardKeyUp = (0, _handle.forward)('onKeyUp');
  return _temp = _class =
  /*#__PURE__*/
  function (_React$Component) {
    _inherits(_class, _React$Component);

    function _class(props) {
      var _this;

      _classCallCheck(this, _class);

      _this = _possibleConstructorReturn(this, _getPrototypeOf(_class).call(this, props));

      _this.updateFocus = function (prevState) {
        // focus node if `InputSpotlightDecorator` is pausing Spotlight or if Spotlight is paused
        if (_this.state.node && _spotlight.Spotlight.getCurrent() !== _this.state.node && (_this.paused.isPaused() || !_spotlight.Spotlight.isPaused())) {
          _this.state.node.focus();
        }

        var focusChanged = _this.state.focused !== prevState.focused;

        if (focusChanged) {
          if (_this.state.focused === 'input') {
            (0, _handle.forward)('onActivate', {
              type: 'onActivate'
            }, _this.props);
            (0, _pointer.lockPointer)(_this.state.node);

            _this.paused.pause();
          } else if (prevState.focused === 'input') {
            (0, _handle.forward)('onDeactivate', {
              type: 'onDeactivate'
            }, _this.props);
            (0, _pointer.releasePointer)(prevState.node);

            _this.paused.resume();
          }
        }
      };

      _this.focus = function (focused, node) {
        _this.setState({
          focused: focused,
          node: node
        });
      };

      _this.blur = function () {
        _this.setState(function (state) {
          return state.focused || state.node ? {
            focused: null,
            node: null
          } : null;
        });
      };

      _this.focusDecorator = function (decorator) {
        _this.focus('decorator', decorator);
      };

      _this.focusInput = function (decorator) {
        _this.focus('input', decorator.querySelector('input'));
      };

      _this.onBlur = function (ev) {
        if (!_this.props.autoFocus) {
          if (isBubbling(ev)) {
            if (_spotlight.Spotlight.getPointerMode()) {
              _this.blur();

              forwardBlur(ev, _this.props);
            } else {
              _this.focusDecorator(ev.currentTarget);

              ev.stopPropagation();
            }
          } else if (!ev.currentTarget.contains(ev.relatedTarget)) {
            // Blurring decorator but not focusing input
            forwardBlur(ev, _this.props);

            _this.blur();
          }
        } else if (isBubbling(ev)) {
          if (_this.state.focused === 'input' && _this.state.node === ev.target && ev.currentTarget !== ev.relatedTarget) {
            _this.blur();

            forwardBlur(ev, _this.props);
          } else {
            _this.focusDecorator(ev.currentTarget);

            ev.stopPropagation();

            _this.blur();
          }
        }
      };

      _this.onMouseDown = function (ev) {
        var _this$props = _this.props,
            disabled = _this$props.disabled,
            spotlightDisabled = _this$props.spotlightDisabled;

        _this.setDownTarget(ev); // focus the <input> whenever clicking on any part of the component to ensure both that
        // the <input> has focus and Spotlight is paused.


        if (!disabled && !spotlightDisabled) {
          _this.focusInput(ev.currentTarget);
        }

        forwardMouseDown(ev, _this.props);
      };

      _this.onFocus = function (ev) {
        forwardFocus(ev, _this.props); // when in autoFocus mode, focusing the decorator directly will cause it to
        // forward the focus onto the <input>

        if (!isBubbling(ev) && _this.props.autoFocus && _this.state.focused === null && !_spotlight.Spotlight.getPointerMode()) {
          _this.focusInput(ev.currentTarget);

          ev.stopPropagation();
        }
      };

      _this.onKeyUp = function (ev) {
        var dismissOnEnter = _this.props.dismissOnEnter;
        var currentTarget = ev.currentTarget,
            keyCode = ev.keyCode,
            preventDefault = ev.preventDefault,
            target = ev.target; // verify that we have a matching pair of key down/up events to avoid adjusting focus
        // when the component received focus mid-press

        if (target === _this.downTarget) {
          _this.downTarget = null;

          if (_this.state.focused === 'input' && dismissOnEnter && (0, _keymap.is)('enter', keyCode)) {
            _this.focusDecorator(currentTarget); // prevent Enter onKeyPress which triggers an onMouseDown via Spotlight


            preventDefault();
          } else if (_this.state.focused !== 'input' && (0, _keymap.is)('enter', keyCode)) {
            _this.focusInput(currentTarget);
          }
        }

        forwardKeyUp(ev, _this.props);
      };

      _this.state = {
        focused: null,
        node: null
      };
      _this.paused = new _Pause["default"]('InputSpotlightDecorator');
      _this.handleKeyDown = handleKeyDown.bind(_assertThisInitialized(_this));
      return _this;
    }

    _createClass(_class, [{
      key: "componentDidUpdate",
      value: function componentDidUpdate(_, prevState) {
        this.updateFocus(prevState);
      }
    }, {
      key: "componentWillUnmount",
      value: function componentWillUnmount() {
        this.paused.resume();

        if (this.state.focused === 'input') {
          var onSpotlightDisappear = this.props.onSpotlightDisappear;

          if (onSpotlightDisappear) {
            onSpotlightDisappear();
          }

          (0, _pointer.releasePointer)(this.state.node);
        }
      }
    }, {
      key: "onKeyDown",
      value: function onKeyDown(ev) {
        var currentTarget = ev.currentTarget,
            keyCode = ev.keyCode,
            preventDefault = ev.preventDefault,
            target = ev.target; // cache the target if this is the first keyDown event to ensure the component had focus
        // when the key interaction started

        this.setDownTarget(ev);

        if (this.state.focused === 'input') {
          var isDown = (0, _keymap.is)('down', keyCode);
          var isLeft = (0, _keymap.is)('left', keyCode);
          var isRight = (0, _keymap.is)('right', keyCode);
          var isUp = (0, _keymap.is)('up', keyCode); // move spotlight

          var shouldSpotlightMove = // on left + at beginning of selection
          isLeft && isSelectionAtLocation(target, 0) || // on right + at end of selection (note: fails on non-selectable types usually)
          isRight && isSelectionAtLocation(target, target.value.length) || // on up
          isUp || // on down
          isDown; // prevent modifying the value via 5-way for numeric fields

          if ((isUp || isDown) && target.type === 'number') {
            preventDefault();
          }

          if (shouldSpotlightMove) {
            var direction = (0, _spotlight.getDirection)(keyCode);
            var getPointerMode = _spotlight.Spotlight.getPointerMode,
                move = _spotlight.Spotlight.move,
                setPointerMode = _spotlight.Spotlight.setPointerMode;

            if (getPointerMode()) {
              setPointerMode(false);
            }

            (0, _handle.stopImmediate)(ev);
            this.paused.resume(); // Move spotlight in the keypress direction

            if (move(direction)) {
              // if successful, reset the internal state
              this.blur();
            } else {
              // if there is no other spottable elements, focus `InputDecorator` instead
              this.focusDecorator(currentTarget);
            }
          } else if (isLeft || isRight) {
            // prevent 5-way nav for left/right keys within the <input>
            (0, _handle.stopImmediate)(ev);
          }
        }
      }
    }, {
      key: "setDownTarget",
      value: function setDownTarget(ev) {
        var repeat = ev.repeat,
            target = ev.target;

        if (!repeat) {
          this.downTarget = target;
        }
      }
    }, {
      key: "render",
      value: function render() {
        var props = Object.assign({}, this.props);
        delete props.autoFocus;
        delete props.onActivate;
        delete props.onDeactivate;
        return _react["default"].createElement(Component, Object.assign({}, props, {
          onBlur: this.onBlur,
          onMouseDown: this.onMouseDown,
          onFocus: this.onFocus,
          onKeyDown: this.handleKeyDown,
          onKeyUp: this.onKeyUp
        }));
      }
    }]);

    return _class;
  }(_react["default"].Component), _class.displayName = 'InputSpotlightDecorator', _class.propTypes =
  /** @lends moonstone/Input/InputSpotlightDecorator.InputSpotlightDecorator.prototype */
  {
    /**
     * Focuses the <input> when the decorator is focused via 5-way.
     *
     * @type {Boolean}
     * @default false
     * @public
     */
    autoFocus: _propTypes["default"].bool,

    /**
     * Applies a disabled style and the control becomes non-interactive.
     *
     * @type {Boolean}
     * @default false
     * @public
     */
    disabled: _propTypes["default"].bool,

    /**
     * Blurs the input when the "enter" key is pressed.
     *
     * @type {Boolean}
     * @default false
     * @public
     */
    dismissOnEnter: _propTypes["default"].bool,

    /**
     * Called when the internal <input> is focused.
     *
     * @type {Function}
     * @param {Object} event
     * @public
     */
    onActivate: _propTypes["default"].func,

    /**
     * Called when the internal <input> loses focus.
     *
     * @type {Function}
     * @param {Object} event
     * @public
     */
    onDeactivate: _propTypes["default"].func,

    /**
     * Called when the component is removed while retaining focus.
     *
     * @type {Function}
     * @param {Object} event
     * @public
     */
    onSpotlightDisappear: _propTypes["default"].func,

    /**
     * Disables spotlight navigation into the component.
     *
     * @type {Boolean}
     * @default false
     * @public
     */
    spotlightDisabled: _propTypes["default"].bool
  }, _temp;
});
exports.InputSpotlightDecorator = InputSpotlightDecorator;
var _default = InputSpotlightDecorator;
exports["default"] = _default;