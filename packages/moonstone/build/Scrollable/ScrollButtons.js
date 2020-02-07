"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ScrollButtons = exports["default"] = void 0;

var _handle = require("@enact/core/handle");

var _target = require("@enact/spotlight/src/target");

var _keymap = require("@enact/core/keymap");

var _AnnounceDecorator = require("@enact/ui/AnnounceDecorator");

var _spotlight = _interopRequireWildcard(require("@enact/spotlight"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _react = _interopRequireWildcard(require("react"));

var _reactDom = _interopRequireDefault(require("react-dom"));

var _$L = _interopRequireDefault(require("../internal/$L"));

var _ScrollButton = _interopRequireDefault(require("./ScrollButton"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj["default"] = obj; return newObj; } }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { _defineProperty(target, key, source[key]); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

var nop = function nop() {},
    prepareButton = function prepareButton(isPrev) {
  return function (isVertical) {
    var direction;

    if (isVertical) {
      direction = isPrev ? 'up' : 'down';
    } else {
      direction = isPrev ? 'left' : 'right';
    }

    return 'arrowsmall' + direction;
  };
},
    preparePrevButton = prepareButton(true),
    prepareNextButton = prepareButton(false),
    isPageUp = (0, _keymap.is)('pageUp'),
    isPageDown = (0, _keymap.is)('pageDown'),
    consumeEvent = function consumeEvent(ev) {
  ev.preventDefault();
  ev.stopPropagation();
};
/**
 * A Moonstone-styled scroll buttons. It is used in [Scrollbar]{@link moonstone/Scrollable.Scrollbar}.
 *
 * @class ScrollButtons
 * @memberof moonstone/Scrollable
 * @ui
 * @private
 */


var ScrollButtons =
/*#__PURE__*/
function (_Component) {
  _inherits(ScrollButtons, _Component);

  function ScrollButtons(props) {
    var _this;

    _classCallCheck(this, ScrollButtons);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(ScrollButtons).call(this, props));

    _this.updateButtons = function (bounds) {
      var vertical = _this.props.vertical,
          currentPos = vertical ? bounds.scrollTop : bounds.scrollLeft,
          maxPos = vertical ? bounds.maxTop : bounds.maxLeft,
          shouldDisablePrevButton = currentPos <= 0,
          shouldDisableNextButton = maxPos - currentPos <= 1;
      var updatePrevButton = _this.state.prevButtonDisabled !== shouldDisablePrevButton,
          updateNextButton = _this.state.nextButtonDisabled !== shouldDisableNextButton;

      if (updatePrevButton || updateNextButton) {
        _this.setState(function () {
          if (updatePrevButton && updateNextButton) {
            return {
              prevButtonDisabled: shouldDisablePrevButton,
              nextButtonDisabled: shouldDisableNextButton
            };
          } else if (updatePrevButton) {
            return {
              prevButtonDisabled: shouldDisablePrevButton
            };
          } else if (updateNextButton) {
            return {
              nextButtonDisabled: shouldDisableNextButton
            };
          }
        });
      }
    };

    _this.isOneOfScrollButtonsFocused = function () {
      var current = _spotlight["default"].getCurrent();

      return current === _this.prevButtonRef.current || current === _this.nextButtonRef.current;
    };

    _this.onDownPrev = function () {
      if (_this.announceRef.current.announce) {
        var _this$props = _this.props,
            rtl = _this$props.rtl,
            vertical = _this$props.vertical;

        _this.announceRef.current.announce(vertical && (0, _$L["default"])('UP') || rtl && (0, _$L["default"])('RIGHT') || (0, _$L["default"])('LEFT'));
      }
    };

    _this.onDownNext = function () {
      if (_this.announceRef.current.announce) {
        var _this$props2 = _this.props,
            rtl = _this$props2.rtl,
            vertical = _this$props2.vertical;

        _this.announceRef.current.announce(vertical && (0, _$L["default"])('DOWN') || rtl && (0, _$L["default"])('LEFT') || (0, _$L["default"])('RIGHT'));
      }
    };

    _this.onClickPrev = function (ev) {
      var _this$props3 = _this.props,
          onPrevScroll = _this$props3.onPrevScroll,
          vertical = _this$props3.vertical;
      onPrevScroll(_objectSpread({}, ev, {
        isPreviousScrollButton: true,
        isVerticalScrollBar: vertical
      }));
    };

    _this.onClickNext = function (ev) {
      var _this$props4 = _this.props,
          onNextScroll = _this$props4.onNextScroll,
          vertical = _this$props4.vertical;
      onNextScroll(_objectSpread({}, ev, {
        isPreviousScrollButton: false,
        isVerticalScrollBar: vertical
      }));
    };

    _this.focusOnButton = function (isPrev) {
      _spotlight["default"].focus(isPrev ? _this.prevButtonRef.current : _this.nextButtonRef.current);
    };

    _this.focusOnOppositeScrollButton = function (ev, direction) {
      var buttonNode = ev.target === _this.nextButtonRef.current ? _this.prevButtonRef.current : _this.nextButtonRef.current;

      if (!_spotlight["default"].focus(buttonNode)) {
        _spotlight["default"].move(direction);
      }
    };

    _this.onKeyDownButton = function (ev, position) {
      var _this$props5 = _this.props,
          focusableScrollButtons = _this$props5.focusableScrollButtons,
          vertical = _this$props5.vertical,
          preventBubblingOnKeyDown = _this$props5.preventBubblingOnKeyDown,
          keyCode = ev.keyCode,
          direction = (0, _spotlight.getDirection)(ev.keyCode),
          preventBubbling = preventBubblingOnKeyDown === 'programmatic',
          isNextButton = position === 'next',
          isPrevButton = position === 'prev',
          nextButton = {
        disabled: _this.state.nextButtonDisabled,
        ref: _this.nextButtonRef.current,
        click: _this.onClickNext
      },
          prevButton = {
        disabled: _this.state.prevButtonDisabled,
        ref: _this.prevButtonRef.current,
        click: _this.onClickPrev
      },
          currentButton = isPrevButton ? prevButton : nextButton,
          oppositeButton = isPrevButton ? nextButton : prevButton;

      if (isPageDown(keyCode) || isPageUp(keyCode)) {
        if (!vertical) {
          // should not call stopPropagation() here
          ev.preventDefault();
          return;
        }

        if (isPrevButton && isPageDown(keyCode) || isNextButton && isPageUp(keyCode)) {
          if (focusableScrollButtons && !_spotlight["default"].getPointerMode()) {
            consumeEvent(ev);

            _spotlight["default"].setPointerMode(false);

            _spotlight["default"].focus(_reactDom["default"].findDOMNode(oppositeButton.ref)); // eslint-disable-line react/no-find-dom-node

          } else if (!oppositeButton.disabled) {
            consumeEvent(ev);
            oppositeButton.click(ev);
          }
        } else if (!currentButton.disabled) {
          consumeEvent(ev);
          currentButton.click(ev);
        }
      } else if (direction) {
        var rtl = _this.props.rtl,
            isDown = direction === 'down',
            isLeftMovement = direction === (rtl ? 'right' : 'left'),
            isRightMovement = direction === (rtl ? 'left' : 'right'),
            isUp = direction === 'up',
            fromNextToPrev = vertical ? isUp : isLeftMovement,
            fromPrevToNext = vertical ? isDown : isRightMovement;

        _spotlight["default"].setPointerMode(false);

        if (isNextButton && fromNextToPrev || isPrevButton && fromPrevToNext) {
          if (focusableScrollButtons) {
            consumeEvent(ev);

            _this.focusOnOppositeScrollButton(ev, direction);

            if (!preventBubbling) {
              (0, _handle.forward)('onKeyDownButton', ev, _this.props);
            }
          }
        } else {
          var // If it is vertical `Scrollable`, move focus to the left for ltr or to the right for rtl
          // If is is horizontal `Scrollable`, move focus to the up
          directionToContent = !vertical && 'up' || rtl && 'right' || 'left',
              isLeavingDown = vertical && isNextButton && isDown,
              isLeavingUp = vertical && isPrevButton && isUp,
              isLeavingLeft = !vertical && isPrevButton && isLeftMovement,
              isLeavingRight = !vertical && isNextButton && isRightMovement,
              isDirectionToLeave = vertical && isRightMovement || isLeavingUp || isLeavingDown || !vertical && isDown || isLeavingLeft || isLeavingRight;

          if (isDirectionToLeave) {
            if (!focusableScrollButtons && !(0, _target.getTargetByDirectionFromElement)(direction, ev.target)) {
              if (preventBubbling && isLeavingDown || isLeavingUp || isLeavingLeft || isLeavingRight) {
                consumeEvent(ev);
              } // move focus into contents and allow bubbling


              _spotlight["default"].move(directionToContent);
            }
          } else if (preventBubbling) {
            // move focus directly to stop bubbling
            consumeEvent(ev);

            _spotlight["default"].move(direction);
          }
        }
      }
    };

    _this.onKeyDownPrev = function (ev) {
      _this.onKeyDownButton(ev, 'prev');
    };

    _this.onKeyDownNext = function (ev) {
      _this.onKeyDownButton(ev, 'next');
    };

    _this.state = {
      prevButtonDisabled: true,
      nextButtonDisabled: true
    };
    _this.announceRef = _react["default"].createRef();
    _this.nextButtonRef = _react["default"].createRef();
    _this.prevButtonRef = _react["default"].createRef();
    return _this;
  }

  _createClass(ScrollButtons, [{
    key: "componentDidMount",
    value: function componentDidMount() {
      this.nextButtonRef.current.addEventListener('keydown', this.onKeyDownNext);
      this.prevButtonRef.current.addEventListener('keydown', this.onKeyDownPrev);
    }
  }, {
    key: "componentWillUnmount",
    value: function componentWillUnmount() {
      this.nextButtonRef.current.removeEventListener('keydown', this.onKeyDownNext);
      this.prevButtonRef.current.removeEventListener('keydown', this.onKeyDownPrev);
    }
  }, {
    key: "render",
    value: function render() {
      var _this$props6 = this.props,
          disabled = _this$props6.disabled,
          nextButtonAriaLabel = _this$props6.nextButtonAriaLabel,
          previousButtonAriaLabel = _this$props6.previousButtonAriaLabel,
          rtl = _this$props6.rtl,
          thumbRenderer = _this$props6.thumbRenderer,
          vertical = _this$props6.vertical,
          _this$state = this.state,
          prevButtonDisabled = _this$state.prevButtonDisabled,
          nextButtonDisabled = _this$state.nextButtonDisabled,
          prevIcon = preparePrevButton(vertical),
          nextIcon = prepareNextButton(vertical);
      return [_react["default"].createElement(_ScrollButton["default"], {
        "aria-label": rtl && !vertical ? nextButtonAriaLabel : previousButtonAriaLabel,
        "data-spotlight-overflow": "ignore",
        disabled: disabled || prevButtonDisabled,
        key: "prevButton",
        onClick: this.onClickPrev,
        onDown: this.onDownPrev,
        onHoldPulse: this.onClickPrev,
        ref: this.prevButtonRef
      }, prevIcon), thumbRenderer(), _react["default"].createElement(_ScrollButton["default"], {
        "aria-label": rtl && !vertical ? previousButtonAriaLabel : nextButtonAriaLabel,
        "data-spotlight-overflow": "ignore",
        disabled: disabled || nextButtonDisabled,
        key: "nextButton",
        onClick: this.onClickNext,
        onDown: this.onDownNext,
        onHoldPulse: this.onClickNext,
        ref: this.nextButtonRef
      }, nextIcon), _react["default"].createElement(_AnnounceDecorator.Announce, {
        key: "announce",
        ref: this.announceRef
      })];
    }
  }]);

  return ScrollButtons;
}(_react.Component);

exports.ScrollButtons = ScrollButtons;
ScrollButtons.displayName = 'ScrollButtons';
ScrollButtons.propTypes =
/** @lends moonstone/Scrollable.ScrollButtons.prototype */
{
  /**
   * The render function for thumb.
   *
   * @type {Function}
   * @required
   * @private
   */
  thumbRenderer: _propTypes["default"].func.isRequired,

  /**
   * Called to alert the user for accessibility notifications.
   *
   * @type {Function}
   * @public
   */
  announce: _propTypes["default"].func,

  /**
   * Specifies to reflect scrollbar's disabled property to the paging controls.
   * When it is `true`, both prev/next buttons are going to be disabled.
   *
   * @type {Boolean}
   * @public
   */
  disabled: _propTypes["default"].bool,

  /**
   * When it is `true`, it allows 5 way navigation to the ScrollButtons.
   * This value is set by `Scrollable`.
   *
   * @type {Boolean}
   * @default false
   * @private
   */
  focusableScrollButtons: _propTypes["default"].bool,

  /**
  * Sets the hint string read when focusing the next button in the scroll bar.
  *
  * @type {String}
  * @public
  */
  nextButtonAriaLabel: _propTypes["default"].string,

  /**
   * Called when the scrollbar's button is pressed and needs to be bubbled.
   *
   * @type {Function}
   * @private
   */
  onKeyDownButton: _propTypes["default"].func,

  /**
   * Called when the scrollbar's down/right button is pressed.
   *
   * @type {Function}
   * @public
   */
  onNextScroll: _propTypes["default"].func,

  /**
   * Called when the scrollbar's up/left button is pressed.
   *
   * @type {Function}
   * @public
   */
  onPrevScroll: _propTypes["default"].func,

  /**
   * Specifies preventing keydown events from bubbling up to applications.
   * Valid values are `'none'`, and `'programmatic'`.
   *
   * When it is `'none'`, every keydown event is bubbled.
   * When it is `'programmatic'`, an event bubbling is not allowed for a keydown input
   * which invokes programmatic spotlight moving.
   *
   * @type {String}
   * @private
   */
  preventBubblingOnKeyDown: _propTypes["default"].oneOf(['none', 'programmatic']),

  /**
   * Sets the hint string read when focusing the previous button in the scroll bar.
   *
   * @type {String}
   * @public
   */
  previousButtonAriaLabel: _propTypes["default"].string,

  /**
   * `true` if rtl, `false` if ltr.
   *
   * @type {Boolean}
   * @private
   */
  rtl: _propTypes["default"].bool,

  /**
   * The scrollbar will be oriented vertically.
   *
   * @type {Boolean}
   * @default true
   * @public
   */
  vertical: _propTypes["default"].bool
};
ScrollButtons.defaultProps = {
  focusableScrollButtons: false,
  onKeyDownButton: nop,
  onNextScroll: nop,
  onPrevScroll: nop
};
var _default = ScrollButtons;
exports["default"] = _default;