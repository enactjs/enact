"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ScrollerNative = exports.ScrollerBase = exports.Scroller = exports["default"] = void 0;

var _spotlight = require("@enact/spotlight");

var _utils = require("@enact/spotlight/src/utils");

var _resolution = _interopRequireDefault(require("@enact/ui/resolution"));

var _Scroller = require("@enact/ui/Scroller");

var _propTypes = _interopRequireDefault(require("prop-types"));

var _react = _interopRequireWildcard(require("react"));

var _Scrollable = _interopRequireDefault(require("../Scrollable"));

var _ScrollableNative = _interopRequireDefault(require("../Scrollable/ScrollableNative"));

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj["default"] = obj; return newObj; } }

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

var dataContainerDisabledAttribute = 'data-spotlight-container-disabled';
/**
 * A Moonstone-styled base component for [Scroller]{@link moonstone/Scroller.Scroller}.
 * In most circumstances, you will want to use the
 * [SpotlightContainerDecorator]{@link spotlight/SpotlightContainerDecorator.SpotlightContainerDecorator}
 * and the Scrollable version, [Scroller]{@link moonstone/Scroller.Scroller}.
 *
 * @class ScrollerBase
 * @memberof moonstone/Scroller
 * @extends ui/Scroller.ScrollerBase
 * @ui
 * @public
 */

var ScrollerBase =
/*#__PURE__*/
function (_Component) {
  _inherits(ScrollerBase, _Component);

  function ScrollerBase() {
    var _getPrototypeOf2;

    var _this;

    _classCallCheck(this, ScrollerBase);

    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    _this = _possibleConstructorReturn(this, (_getPrototypeOf2 = _getPrototypeOf(ScrollerBase)).call.apply(_getPrototypeOf2, [this].concat(args)));
    _this.uiRefCurrent = null;

    _this.getSpotlightContainerForNode = function (node) {
      do {
        if (node.dataset.spotlightId && node.dataset.spotlightContainer && !node.dataset.expandableContainer) {
          return node;
        }
      } while ((node = node.parentNode) && node !== _this.uiRefCurrent.containerRef.current);
    };

    _this.getFocusedItemBounds = function (node) {
      node = _this.getSpotlightContainerForNode(node) || node;
      return node.getBoundingClientRect();
    };

    _this.calculateScrollTop = function (item) {
      var threshold = _resolution["default"].scale(24);

      var roundToStart = function roundToStart(sb, st) {
        // round to start
        if (st < threshold) return 0;
        return st;
      };

      var roundToEnd = function roundToEnd(sb, st, sh) {
        // round to end
        if (sh - (st + sb.height) < threshold) return sh - sb.height;
        return st;
      }; // adding threshold into these determinations ensures that items that are within that are
      // near the bounds of the scroller cause the edge to be scrolled into view even when the
      // itme itself is in view (e.g. due to margins)


      var isItemBeforeView = function isItemBeforeView(ib, sb, d) {
        return ib.top + d - threshold < sb.top;
      };

      var isItemAfterView = function isItemAfterView(ib, sb, d) {
        return ib.top + d + ib.height + threshold > sb.top + sb.height;
      };

      var canItemFit = function canItemFit(ib, sb) {
        return ib.height <= sb.height;
      };

      var calcItemAtStart = function calcItemAtStart(ib, sb, st, d) {
        return ib.top + st + d - sb.top;
      };

      var calcItemAtEnd = function calcItemAtEnd(ib, sb, st, d) {
        return ib.top + ib.height + st + d - (sb.top + sb.height);
      };

      var calcItemInView = function calcItemInView(ib, sb, st, sh, d) {
        if (isItemBeforeView(ib, sb, d)) {
          return roundToStart(sb, calcItemAtStart(ib, sb, st, d));
        } else if (isItemAfterView(ib, sb, d)) {
          return roundToEnd(sb, calcItemAtEnd(ib, sb, st, d), sh);
        }

        return st;
      };

      var container = _this.getSpotlightContainerForNode(item);

      var scrollerBounds = _this.uiRefCurrent.containerRef.current.getBoundingClientRect();

      var _this$uiRefCurrent$co = _this.uiRefCurrent.containerRef.current,
          scrollHeight = _this$uiRefCurrent$co.scrollHeight,
          scrollTop = _this$uiRefCurrent$co.scrollTop;
      var scrollTopDelta = 0;

      var adjustScrollTop = function adjustScrollTop(v) {
        scrollTopDelta = scrollTop - v;
        scrollTop = v;
      };

      if (container) {
        var containerBounds = container.getBoundingClientRect(); // if the entire container fits in the scroller, scroll it into view

        if (canItemFit(containerBounds, scrollerBounds)) {
          return calcItemInView(containerBounds, scrollerBounds, scrollTop, scrollHeight, scrollTopDelta);
        } // if the container doesn't fit, adjust the scroll top ...


        if (containerBounds.top > scrollerBounds.top) {
          // ... to the top of the container if the top is below the top of the scroller
          adjustScrollTop(calcItemAtStart(containerBounds, scrollerBounds, scrollTop, scrollTopDelta));
        } // removing support for "snap to bottom" for 2.2.8
        // } else if (containerBounds.top + containerBounds.height < scrollerBounds.top + scrollerBounds.height) {
        // 	// ... to the bottom of the container if the bottom is above the bottom of the
        // 	// scroller
        // 	adjustScrollTop(calcItemAtEnd(containerBounds, scrollerBounds, scrollTop, scrollTopDelta));
        // }
        // N.B. if the container covers the scrollable area (its top is above the top of the
        // scroller and its bottom is below the bottom of the scroller), we need not adjust the
        // scroller to ensure the container is wholly in view.

      }

      var itemBounds = item.getBoundingClientRect();
      return calcItemInView(itemBounds, scrollerBounds, scrollTop, scrollHeight, scrollTopDelta);
    };

    _this.calculateScrollLeft = function (item, scrollPosition) {
      var _this$getFocusedItemB = _this.getFocusedItemBounds(item),
          itemLeft = _this$getFocusedItemB.left,
          itemWidth = _this$getFocusedItemB.width;

      var rtl = _this.props.rtl,
          clientWidth = _this.uiRefCurrent.scrollBounds.clientWidth,
          rtlDirection = rtl ? -1 : 1,
          _this$uiRefCurrent$co2 = _this.uiRefCurrent.containerRef.current.getBoundingClientRect(),
          containerLeft = _this$uiRefCurrent$co2.left,
          scrollLastPosition = scrollPosition ? scrollPosition : _this.uiRefCurrent.scrollPos.left,
          currentScrollLeft = rtl ? _this.uiRefCurrent.scrollBounds.maxLeft - scrollLastPosition : scrollLastPosition,
          newItemLeft = _this.uiRefCurrent.containerRef.current.scrollLeft + (itemLeft - containerLeft);

      var nextScrollLeft = _this.uiRefCurrent.scrollPos.left;

      if (newItemLeft + itemWidth > clientWidth + currentScrollLeft && itemWidth < clientWidth) {
        // If focus is moved to an element outside of view area (to the right), scroller will move
        // to the right just enough to show the current `focusedItem`. This does not apply to
        // `focusedItem` that has a width that is bigger than `this.scrollBounds.clientWidth`.
        nextScrollLeft += rtlDirection * (newItemLeft + itemWidth - (clientWidth + currentScrollLeft));
      } else if (newItemLeft < currentScrollLeft) {
        // If focus is outside of the view area to the left, move scroller to the left accordingly.
        nextScrollLeft += rtlDirection * (newItemLeft - currentScrollLeft);
      }

      return nextScrollLeft;
    };

    _this.calculatePositionOnFocus = function (_ref) {
      var item = _ref.item,
          scrollPosition = _ref.scrollPosition;
      var containerNode = _this.uiRefCurrent.containerRef.current;

      var horizontal = _this.uiRefCurrent.isHorizontal();

      var vertical = _this.uiRefCurrent.isVertical();

      if (!vertical && !horizontal || !item || !containerNode.contains(item)) {
        return;
      }

      var containerRect = (0, _utils.getRect)(containerNode);
      var itemRect = (0, _utils.getRect)(item);

      if (horizontal && !(itemRect.left >= containerRect.left && itemRect.right <= containerRect.right)) {
        _this.uiRefCurrent.scrollPos.left = _this.calculateScrollLeft(item, scrollPosition);
      }

      if (vertical && !(itemRect.top >= containerRect.top && itemRect.bottom <= containerRect.bottom)) {
        _this.uiRefCurrent.scrollPos.top = _this.calculateScrollTop(item);
      }

      return _this.uiRefCurrent.scrollPos;
    };

    _this.focusOnNode = function (node) {
      if (node) {
        _spotlight.Spotlight.focus(node);
      }
    };

    _this.handleGlobalKeyDown = function () {
      _this.setContainerDisabled(false);
    };

    _this.setContainerDisabled = function (bool) {
      var spotlightId = _this.props.spotlightId,
          containerNode = document.querySelector("[data-spotlight-id=\"".concat(spotlightId, "\"]"));

      if (containerNode) {
        containerNode.setAttribute(dataContainerDisabledAttribute, bool);

        if (bool) {
          document.addEventListener('keydown', _this.handleGlobalKeyDown, {
            capture: true
          });
        } else {
          document.removeEventListener('keydown', _this.handleGlobalKeyDown, {
            capture: true
          });
        }
      }
    };

    _this.handleLeaveContainer = function (_ref2) {
      var direction = _ref2.direction,
          target = _ref2.target;
      var contentsContainer = _this.uiRefCurrent.containerRef.current; // ensure we only scroll to boundary from the contents and not a scroll button which
      // lie outside of this.uiRefCurrent.containerRef but within the spotlight container

      if (contentsContainer && contentsContainer.contains(target)) {
        var _this$uiRefCurrent = _this.uiRefCurrent,
            _this$uiRefCurrent$sc = _this$uiRefCurrent.scrollBounds,
            maxLeft = _this$uiRefCurrent$sc.maxLeft,
            maxTop = _this$uiRefCurrent$sc.maxTop,
            _this$uiRefCurrent$sc2 = _this$uiRefCurrent.scrollPos,
            left = _this$uiRefCurrent$sc2.left,
            top = _this$uiRefCurrent$sc2.top,
            isVerticalDirection = direction === 'up' || direction === 'down',
            pos = isVerticalDirection ? top : left,
            max = isVerticalDirection ? maxTop : maxLeft; // If max is equal to 0, it means scroller can not scroll to the direction.

        if (pos >= 0 && pos <= max && max !== 0) {
          _this.props.scrollAndFocusScrollbarButton(direction);
        }
      }
    };

    _this.initUiRef = function (ref) {
      if (ref) {
        _this.uiRefCurrent = ref;

        _this.props.initUiChildRef(ref);
      }
    };

    return _this;
  }

  _createClass(ScrollerBase, [{
    key: "componentDidMount",
    value: function componentDidMount() {
      this.configureSpotlight();
    }
  }, {
    key: "componentDidUpdate",
    value: function componentDidUpdate(prevProps) {
      var onUpdate = this.props.onUpdate;

      if (onUpdate) {
        onUpdate();
      }

      if (prevProps.spotlightId !== this.props.spotlightId) {
        this.configureSpotlight();
      }
    }
  }, {
    key: "componentWillUnmount",
    value: function componentWillUnmount() {
      this.setContainerDisabled(false);
    }
  }, {
    key: "configureSpotlight",
    value: function configureSpotlight() {
      _spotlight.Spotlight.set(this.props.spotlightId, {
        onLeaveContainer: this.handleLeaveContainer,
        onLeaveContainerFail: this.handleLeaveContainer
      });
    }
    /**
     * Returns the first spotlight container between `node` and the scroller
     *
     * @param {Node} node A DOM node
     *
     * @returns {Node|Null} Spotlight container for `node`
     * @private
     */

  }, {
    key: "render",
    value: function render() {
      var props = Object.assign({}, this.props);
      delete props.initUiChildRef;
      delete props.onUpdate;
      delete props.scrollAndFocusScrollbarButton;
      delete props.spotlightId;
      return _react["default"].createElement(_Scroller.ScrollerBase, Object.assign({}, props, {
        ref: this.initUiRef
      }));
    }
  }]);

  return ScrollerBase;
}(_react.Component);
/**
 * Allows 5-way navigation to the scrollbar controls. By default, 5-way will
 * not move focus to the scrollbar controls.
 *
 * @name focusableScrollbar
 * @memberof moonstone/Scroller.ScrollerBase.prototype
 * @type {Boolean}
 * @default false
 * @public
 */

/**
 * Unique identifier for the component.
 *
 * When defined and when the `Scroller` is within a [Panel]{@link moonstone/Panels.Panel}, the
 * `Scroller` will store its scroll position and restore that position when returning to the
 * `Panel`.
 *
 * @name id
 * @memberof moonstone/Scroller.ScrollerBase.prototype
 * @type {String}
 * @public
 */

/**
 * Sets the hint string read when focusing the next button in the vertical scroll bar.
 *
 * @name scrollDownAriaLabel
 * @memberof moonstone/Scroller.ScrollerBase.prototype
 * @type {String}
 * @default $L('scroll down')
 * @public
 */

/**
 * Sets the hint string read when focusing the previous button in the horizontal scroll bar.
 *
 * @name scrollLeftAriaLabel
 * @memberof moonstone/Scroller.ScrollerBase.prototype
 * @type {String}
 * @default $L('scroll left')
 * @public
 */

/**
 * Sets the hint string read when focusing the next button in the horizontal scroll bar.
 *
 * @name scrollRightAriaLabel
 * @memberof moonstone/Scroller.ScrollerBase.prototype
 * @type {String}
 * @default $L('scroll right')
 * @public
 */

/**
 * Sets the hint string read when focusing the previous button in the vertical scroll bar.
 *
 * @name scrollUpAriaLabel
 * @memberof moonstone/Scroller.ScrollerBase.prototype
 * @type {String}
 * @default $L('scroll up')
 * @public
 */

/**
 * A Moonstone-styled Scroller, Scrollable applied.
 *
 * Usage:
 * ```
 * <Scroller>Scroll me.</Scroller>
 * ```
 *
 * @class Scroller
 * @memberof moonstone/Scroller
 * @extends moonstone/Scroller.ScrollerBase
 * @ui
 * @public
 */


exports.ScrollerBase = ScrollerBase;
ScrollerBase.displayName = 'ScrollerBase';
ScrollerBase.propTypes =
/** @lends moonstone/Scroller.ScrollerBase.prototype */
{
  /**
   * Passes the instance of [Scroller]{@link ui/Scroller.Scroller}.
   *
   * @type {Object}
   * @param {Object} ref
   * @private
   */
  initUiChildRef: _propTypes["default"].func,

  /**
   * Called when [Scroller]{@link moonstone/Scroller.Scroller} updates.
   *
   * @type {function}
   * @private
   */
  onUpdate: _propTypes["default"].func,

  /**
   * `true` if rtl, `false` if ltr.
   *
   * @type {Boolean}
   * @private
   */
  rtl: _propTypes["default"].bool,

  /**
   * Called when [Scroller]{@link moonstone/Scroller.Scroller} should be scrolled
   * and the focus should be moved to a scrollbar button.
   *
   * @type {function}
   * @private
   */
  scrollAndFocusScrollbarButton: _propTypes["default"].func,

  /**
   * The spotlight id for the component.
   *
   * @type {String}
   * @private
   */
  spotlightId: _propTypes["default"].string
};

var Scroller = function Scroller(props) {
  return _react["default"].createElement(_Scrollable["default"], Object.assign({}, props, {
    childRenderer: function childRenderer(scrollerProps) {
      // eslint-disable-line react/jsx-no-bind
      return _react["default"].createElement(ScrollerBase, scrollerProps);
    }
  }));
};

exports.Scroller = Scroller;
Scroller.propTypes =
/** @lends moonstone/Scroller.Scroller.prototype */
{
  direction: _propTypes["default"].oneOf(['both', 'horizontal', 'vertical'])
};
Scroller.defaultProps = {
  direction: 'both'
};
/**
 * A Moonstone-styled native Scroller, Scrollable applied.
 *
 * For smooth native scrolling, web engine with below Chromium 61, should be launched
 * with the flag '--enable-blink-features=CSSOMSmoothScroll' to support it.
 * The one with Chromium 61 or above, is launched to support it by default.
 *
 * Usage:
 * ```
 * <ScrollerNative>Scroll me.</ScrollerNative>
 * ```
 *
 * @class ScrollerNative
 * @memberof moonstone/Scroller
 * @extends moonstone/Scroller.ScrollerBase
 * @ui
 * @private
 */

var ScrollerNative = function ScrollerNative(props) {
  return _react["default"].createElement(_ScrollableNative["default"], Object.assign({}, props, {
    childRenderer: function childRenderer(scrollerProps) {
      // eslint-disable-line react/jsx-no-bind
      return _react["default"].createElement(ScrollerBase, scrollerProps);
    }
  }));
};

exports.ScrollerNative = ScrollerNative;
ScrollerNative.propTypes =
/** @lends moonstone/Scroller.ScrollerNative.prototype */
{
  direction: _propTypes["default"].oneOf(['both', 'horizontal', 'vertical'])
};
ScrollerNative.defaultProps = {
  direction: 'both'
};
var _default = Scroller;
exports["default"] = _default;