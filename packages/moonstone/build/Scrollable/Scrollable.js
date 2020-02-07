"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ScrollableBase = exports.Scrollable = exports.dataIndexAttribute = exports["default"] = void 0;

var _classnames = _interopRequireDefault(require("classnames"));

var _handle = _interopRequireWildcard(require("@enact/core/handle"));

var _platform = _interopRequireDefault(require("@enact/core/platform"));

var _snapshot = require("@enact/core/snapshot");

var _util = require("@enact/core/util");

var _I18nDecorator = require("@enact/i18n/I18nDecorator");

var _Scrollable = require("@enact/ui/Scrollable");

var _spotlight = _interopRequireWildcard(require("@enact/spotlight"));

var _Spottable = require("@enact/spotlight/Spottable");

var _target = require("@enact/spotlight/src/target");

var _utils = require("@enact/spotlight/src/utils");

var _SpotlightContainerDecorator = _interopRequireDefault(require("@enact/spotlight/SpotlightContainerDecorator"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _react = _interopRequireWildcard(require("react"));

var _$L = _interopRequireDefault(require("../internal/$L"));

var _SharedStateDecorator = require("../internal/SharedStateDecorator");

var _Scrollbar = _interopRequireDefault(require("./Scrollbar"));

var _Skinnable = _interopRequireDefault(require("../Skinnable"));

var _OverscrollEffectModule = _interopRequireDefault(require("./OverscrollEffect.module.css"));

var _ScrollbarModule = _interopRequireDefault(require("./Scrollbar.module.css"));

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj["default"] = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { _defineProperty(target, key, source[key]); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

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

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance"); }

function _iterableToArrayLimit(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

var animationDuration = _Scrollable.constants.animationDuration,
    isPageDown = _Scrollable.constants.isPageDown,
    isPageUp = _Scrollable.constants.isPageUp,
    overscrollTypeDone = _Scrollable.constants.overscrollTypeDone,
    overscrollTypeNone = _Scrollable.constants.overscrollTypeNone,
    overscrollTypeOnce = _Scrollable.constants.overscrollTypeOnce,
    paginationPageMultiplier = _Scrollable.constants.paginationPageMultiplier,
    overscrollRatioPrefix = '--scrollable-overscroll-ratio-',
    overscrollTimeout = 300,
    reverseDirections = {
  down: 'up',
  up: 'down'
};
/**
 * The name of a custom attribute which indicates the index of an item in
 * [VirtualList]{@link moonstone/VirtualList.VirtualList} or
 * [VirtualGridList]{@link moonstone/VirtualList.VirtualGridList}.
 *
 * @constant dataIndexAttribute
 * @memberof moonstone/Scrollable
 * @type {String}
 * @private
 */

var dataIndexAttribute = 'data-index';
exports.dataIndexAttribute = dataIndexAttribute;

var navigableFilter = function navigableFilter(elem) {
  if (!_spotlight["default"].getPointerMode() && // ignore containers passed as their id
  typeof elem !== 'string' && elem.classList.contains(_ScrollbarModule["default"].scrollButton)) {
    return false;
  }
};

var configureSpotlightContainer = function configureSpotlightContainer(_ref) {
  var spotlightId = _ref['data-spotlight-id'],
      focusableScrollbar = _ref.focusableScrollbar;

  _spotlight["default"].set(spotlightId, {
    navigableFilter: focusableScrollbar ? null : navigableFilter
  });
};
/*
 * Track the last position of the pointer to check if a list should scroll by
 * page up/down keys when the pointer is on a list without any focused node.
 * `keydown` event does not occur if there is no focus on the node and
 * its descendants, we add `keydown` handler to `document` also.
 */


var lastPointer = {
  x: 0,
  y: 0
},
    pointerTracker = function pointerTracker(ev) {
  lastPointer.x = ev.clientX;
  lastPointer.y = ev.clientY;
};

var // An app could have lists and/or scrollers more than one,
// so we should test all of them when page up/down key is pressed.
scrollables = new Map(),
    pageKeyHandler = function pageKeyHandler(ev) {
  var keyCode = ev.keyCode;

  if (_spotlight["default"].getPointerMode() && !_spotlight["default"].getCurrent() && (isPageUp(keyCode) || isPageDown(keyCode))) {
    var x = lastPointer.x,
        y = lastPointer.y,
        elem = document.elementFromPoint(x, y);

    if (elem) {
      var _iteratorNormalCompletion = true;
      var _didIteratorError = false;
      var _iteratorError = undefined;

      try {
        for (var _iterator = scrollables[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
          var _step$value = _slicedToArray(_step.value, 2),
              key = _step$value[0],
              value = _step$value[1];

          if (value.contains(elem)) {
            /* To handle page keys in nested scrollable components,
             * break the loop only when `scrollByPageOnPointerMode` returns `true`.
             * This approach assumes that an inner scrollable component is
             * mounted earlier than an outer scrollable component.
             */
            if (key.scrollByPageOnPointerMode(ev)) {
              break;
            }
          }
        }
      } catch (err) {
        _didIteratorError = true;
        _iteratorError = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion && _iterator["return"] != null) {
            _iterator["return"]();
          }
        } finally {
          if (_didIteratorError) {
            throw _iteratorError;
          }
        }
      }
    }
  }
};

(0, _snapshot.onWindowReady)(function () {
  document.addEventListener('mousemove', pointerTracker);
  document.addEventListener('keydown', pageKeyHandler);
});

var isIntersecting = function isIntersecting(elem, container) {
  return elem && (0, _utils.intersects)((0, _utils.getRect)(container), (0, _utils.getRect)(elem));
};

var getIntersectingElement = function getIntersectingElement(elem, container) {
  return isIntersecting(elem, container) && elem;
};

var getTargetInViewByDirectionFromPosition = function getTargetInViewByDirectionFromPosition(direction, position, container) {
  var target = (0, _target.getTargetByDirectionFromPosition)(direction, position, _spotlight["default"].getActiveContainer());
  return getIntersectingElement(target, container);
};
/**
 * A Moonstone-styled component that provides horizontal and vertical scrollbars.
 *
 * @class ScrollableBase
 * @memberof moonstone/Scrollable
 * @extends ui/Scrollable.ScrollableBase
 * @ui
 * @public
 */


var ScrollableBase =
/*#__PURE__*/
function (_Component) {
  _inherits(ScrollableBase, _Component);

  function ScrollableBase(props) {
    var _this;

    _classCallCheck(this, ScrollableBase);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(ScrollableBase).call(this, props));
    _this.isWheeling = false;
    _this.lastScrollPositionOnFocus = null;
    _this.indexToFocus = null;
    _this.nodeToFocus = null;
    _this.pointToFocus = null;
    _this.isVoiceControl = false;
    _this.voiceControlDirection = 'vertical';
    _this.overscrollJobs = {
      horizontal: {
        before: null,
        after: null
      },
      vertical: {
        before: null,
        after: null
      } // Only intended to be used within componentDidMount, this method will fetch the last stored
      // scroll position from SharedState and scroll (without animation) to that position

    };

    _this.onFlick = function (_ref2) {
      var direction = _ref2.direction;

      var bounds = _this.uiRef.current.getScrollBounds();

      var focusedItem = _spotlight["default"].getCurrent();

      if (focusedItem) {
        focusedItem.blur();
      }

      if ((direction === 'vertical' && _this.uiRef.current.canScrollVertically(bounds) || direction === 'horizontal' && _this.uiRef.current.canScrollHorizontally(bounds)) && !_this.props['data-spotlight-container-disabled']) {
        _this.childRef.current.setContainerDisabled(true);
      }
    };

    _this.onMouseDown = function (ev) {
      if (_this.isScrollButtonFocused()) {
        ev.preventDefault();
      }

      if (_this.props['data-spotlight-container-disabled']) {
        ev.preventDefault();
      }
    };

    _this.onTouchStart = function () {
      var focusedItem = _spotlight["default"].getCurrent();

      if (!_spotlight["default"].isPaused() && focusedItem && !_this.isScrollButtonFocused()) {
        focusedItem.blur();
      }
    };

    _this.onWheel = function (_ref3) {
      var delta = _ref3.delta;

      var focusedItem = _spotlight["default"].getCurrent();

      if (focusedItem && !_this.isScrollButtonFocused()) {
        focusedItem.blur();
      }

      if (delta !== 0) {
        _this.isWheeling = true;

        if (!_this.props['data-spotlight-container-disabled']) {
          _this.childRef.current.setContainerDisabled(true);
        }
      }
    };

    _this.isContent = function (element) {
      return element && _this.uiRef.current && _this.uiRef.current.childRefCurrent.containerRef.current.contains(element);
    };

    _this.startScrollOnFocus = function (pos) {
      if (pos) {
        var top = pos.top,
            left = pos.left,
            bounds = _this.uiRef.current.getScrollBounds(),
            scrollHorizontally = bounds.maxLeft > 0 && left !== _this.uiRef.current.scrollLeft,
            scrollVertically = bounds.maxTop > 0 && top !== _this.uiRef.current.scrollTop;

        if (scrollHorizontally || scrollVertically) {
          _this.uiRef.current.start({
            targetX: left,
            targetY: top,
            animate: animationDuration > 0 && _this.animateOnFocus,
            overscrollEffect: _this.props.overscrollEffectOn[_this.uiRef.current.lastInputType] && (!_this.childRef.current.shouldPreventOverscrollEffect || !_this.childRef.current.shouldPreventOverscrollEffect())
          });

          _this.lastScrollPositionOnFocus = pos;
        }
      }
    };

    _this.calculateAndScrollTo = function () {
      var spotItem = _spotlight["default"].getCurrent(),
          positionFn = _this.childRef.current.calculatePositionOnFocus,
          containerNode = _this.uiRef.current.childRefCurrent.containerRef.current;

      if (spotItem && positionFn && containerNode && containerNode.contains(spotItem)) {
        var lastPos = _this.lastScrollPositionOnFocus;
        var pos; // If scroll animation is ongoing, we need to pass last target position to
        // determine correct scroll position.

        if (_this.uiRef.current.animator.isAnimating() && lastPos) {
          var containerRect = (0, _utils.getRect)(containerNode);
          var itemRect = (0, _utils.getRect)(spotItem);
          var scrollPosition;

          if (_this.props.direction === 'horizontal' || _this.props.direction === 'both' && !(itemRect.left >= containerRect.left && itemRect.right <= containerRect.right)) {
            scrollPosition = lastPos.left;
          } else if (_this.props.direction === 'vertical' || _this.props.direction === 'both' && !(itemRect.top >= containerRect.top && itemRect.bottom <= containerRect.bottom)) {
            scrollPosition = lastPos.top;
          }

          pos = positionFn({
            item: spotItem,
            scrollPosition: scrollPosition
          });
        } else {
          // scrollInfo passes in current `scrollHeight` and `scrollTop` before calculations
          var scrollInfo = {
            previousScrollHeight: _this.uiRef.current.bounds.scrollHeight,
            scrollTop: _this.uiRef.current.scrollTop
          };
          pos = positionFn({
            item: spotItem,
            scrollInfo: scrollInfo
          });
        }

        if (pos && (pos.left !== _this.uiRef.current.scrollLeft || pos.top !== _this.uiRef.current.scrollTop)) {
          _this.startScrollOnFocus(pos);
        } // update `scrollHeight`


        _this.uiRef.current.bounds.scrollHeight = _this.uiRef.current.getScrollBounds().scrollHeight;
      }
    };

    _this.onFocus = function (ev) {
      var isDragging = _this.uiRef.current.isDragging,
          shouldPreventScrollByFocus = _this.childRef.current.shouldPreventScrollByFocus ? _this.childRef.current.shouldPreventScrollByFocus() : false;

      if (_this.isWheeling) {
        _this.uiRef.current.stop();

        _this.animateOnFocus = false;
      }

      if (!_spotlight["default"].getPointerMode()) {
        _this.alertThumb();
      }

      if (!(shouldPreventScrollByFocus || _spotlight["default"].getPointerMode() || isDragging)) {
        var item = ev.target,
            spotItem = _spotlight["default"].getCurrent();

        if (item && item === spotItem) {
          _this.calculateAndScrollTo();
        }
      } else if (_this.childRef.current.setLastFocusedNode) {
        _this.childRef.current.setLastFocusedNode(ev.target);
      }
    };

    _this.scrollByPage = function (direction) {
      var _this$uiRef$current = _this.uiRef.current,
          childRefCurrent = _this$uiRef$current.childRefCurrent,
          scrollTop = _this$uiRef$current.scrollTop,
          focusedItem = _spotlight["default"].getCurrent(),
          bounds = _this.uiRef.current.getScrollBounds(),
          isUp = direction === 'up',
          directionFactor = isUp ? -1 : 1,
          pageDistance = directionFactor * bounds.clientHeight * paginationPageMultiplier,
          scrollPossible = isUp ? scrollTop > 0 : bounds.maxTop > scrollTop;

      _this.uiRef.current.lastInputType = 'pageKey';

      if (directionFactor !== _this.uiRef.current.wheelDirection) {
        _this.uiRef.current.isScrollAnimationTargetAccumulated = false;
        _this.uiRef.current.wheelDirection = directionFactor;
      }

      if (scrollPossible) {
        if (focusedItem) {
          var contentNode = childRefCurrent.containerRef.current; // Should do nothing when focusedItem is paging control button of Scrollbar

          if (contentNode.contains(focusedItem)) {
            var contentRect = contentNode.getBoundingClientRect(),
                clientRect = focusedItem.getBoundingClientRect(),
                yAdjust = isUp ? 1 : -1,
                x = (0, _util.clamp)(contentRect.left, contentRect.right, (clientRect.right + clientRect.left) / 2),
                y = bounds.maxTop <= scrollTop + pageDistance || 0 >= scrollTop + pageDistance ? contentRect[isUp ? 'top' : 'bottom'] + yAdjust : (0, _util.clamp)(contentRect.top, contentRect.bottom, (clientRect.bottom + clientRect.top) / 2);
            focusedItem.blur();

            if (!_this.props['data-spotlight-container-disabled']) {
              _this.childRef.current.setContainerDisabled(true);
            }

            _this.pointToFocus = {
              direction: direction,
              x: x,
              y: y
            };
          }
        } else {
          _this.pointToFocus = {
            direction: direction,
            x: lastPointer.x,
            y: lastPointer.y
          };
        }

        _this.uiRef.current.scrollToAccumulatedTarget(pageDistance, true, _this.props.overscrollEffectOn.pageKey);
      }
    };

    _this.checkAndApplyOverscrollEffectByDirection = function (direction) {
      var orientation = direction === 'up' || direction === 'down' ? 'vertical' : 'horizontal',
          bounds = _this.uiRef.current.getScrollBounds(),
          scrollability = orientation === 'vertical' ? _this.uiRef.current.canScrollVertically(bounds) : _this.uiRef.current.canScrollHorizontally(bounds);

      if (scrollability) {
        var isRtl = _this.uiRef.current.props.rtl,
            edge = direction === 'up' || !isRtl && direction === 'left' || isRtl && direction === 'right' ? 'before' : 'after';

        _this.uiRef.current.checkAndApplyOverscrollEffect(orientation, edge, overscrollTypeOnce);
      }
    };

    _this.scrollByPageOnPointerMode = function (ev) {
      var keyCode = ev.keyCode,
          repeat = ev.repeat;
      (0, _handle.forward)('onKeyDown', ev, _this.props);
      ev.preventDefault();
      _this.animateOnFocus = true;

      if (!repeat && (_this.props.direction === 'vertical' || _this.props.direction === 'both')) {
        var direction = isPageUp(keyCode) ? 'up' : 'down';

        _this.scrollByPage(direction);

        if (_this.props.overscrollEffectOn.pageKey) {
          /* if the spotlight focus will not move */
          _this.checkAndApplyOverscrollEffectByDirection(direction);
        }

        return true; // means consumed
      }

      return false; // means to be propagated
    };

    _this.onKeyDown = function (ev) {
      var keyCode = ev.keyCode,
          repeat = ev.repeat,
          target = ev.target;
      (0, _handle.forward)('onKeyDown', ev, _this.props);

      if (isPageUp(keyCode) || isPageDown(keyCode)) {
        ev.preventDefault();
      }

      _this.animateOnFocus = true;

      if (!repeat && _this.hasFocus()) {
        var overscrollEffectOn = _this.props.overscrollEffectOn;
        var direction = null;

        if (isPageUp(keyCode) || isPageDown(keyCode)) {
          if (_this.props.direction === 'vertical' || _this.props.direction === 'both') {
            direction = isPageUp(keyCode) ? 'up' : 'down';

            if (_this.isContent(target)) {
              ev.stopPropagation();

              _this.scrollByPage(direction);
            }

            if (overscrollEffectOn.pageKey) {
              _this.checkAndApplyOverscrollEffectByDirection(direction);
            }
          }
        } else if ((0, _spotlight.getDirection)(keyCode)) {
          var element = _spotlight["default"].getCurrent();

          _this.uiRef.current.lastInputType = 'arrowKey';
          direction = (0, _spotlight.getDirection)(keyCode);

          if (overscrollEffectOn.arrowKey && !(element ? (0, _target.getTargetByDirectionFromElement)(direction, element) : null)) {
            var _this$uiRef$current2 = _this.uiRef.current,
                horizontalScrollbarRef = _this$uiRef$current2.horizontalScrollbarRef,
                verticalScrollbarRef = _this$uiRef$current2.verticalScrollbarRef;

            if (!(horizontalScrollbarRef.current && horizontalScrollbarRef.current.getContainerRef().current.contains(element)) && !(verticalScrollbarRef.current && verticalScrollbarRef.current.getContainerRef().current.contains(element))) {
              _this.checkAndApplyOverscrollEffectByDirection(direction);
            }
          }
        }
      }
    };

    _this.onScrollbarButtonClick = function (_ref4) {
      var isPreviousScrollButton = _ref4.isPreviousScrollButton,
          isVerticalScrollBar = _ref4.isVerticalScrollBar;

      var bounds = _this.uiRef.current.getScrollBounds(),
          direction = isPreviousScrollButton ? -1 : 1,
          pageDistance = direction * (isVerticalScrollBar ? bounds.clientHeight : bounds.clientWidth) * paginationPageMultiplier;

      _this.uiRef.current.lastInputType = 'scrollbarButton';

      if (direction !== _this.uiRef.current.wheelDirection) {
        _this.uiRef.current.isScrollAnimationTargetAccumulated = false;
        _this.uiRef.current.wheelDirection = direction;
      }

      _this.uiRef.current.scrollToAccumulatedTarget(pageDistance, isVerticalScrollBar, _this.props.overscrollEffectOn.scrollbarButton);
    };

    _this.scrollAndFocusScrollbarButton = function (direction) {
      if (_this.uiRef.current) {
        var _this$props = _this.props,
            focusableScrollbar = _this$props.focusableScrollbar,
            directionProp = _this$props.direction,
            uiRefCurrent = _this.uiRef.current,
            isRtl = uiRefCurrent.props.rtl,
            isPreviousScrollButton = direction === 'up' || (isRtl ? direction === 'right' : direction === 'left'),
            isHorizontalDirection = direction === 'left' || direction === 'right',
            isVerticalDirection = direction === 'up' || direction === 'down',
            canScrollHorizontally = isHorizontalDirection && (directionProp === 'horizontal' || directionProp === 'both'),
            canScrollingVertically = isVerticalDirection && (directionProp === 'vertical' || directionProp === 'both');

        if (canScrollHorizontally || canScrollingVertically) {
          _this.onScrollbarButtonClick({
            isPreviousScrollButton: isPreviousScrollButton,
            isVerticalScrollBar: canScrollingVertically
          });

          if (focusableScrollbar) {
            _this.focusOnScrollButton(canScrollingVertically ? uiRefCurrent.verticalScrollbarRef : uiRefCurrent.horizontalScrollbarRef, isPreviousScrollButton);
          }
        }
      }
    };

    _this.stop = function () {
      if (!_this.props['data-spotlight-container-disabled']) {
        _this.childRef.current.setContainerDisabled(false);
      }

      _this.focusOnItem();

      _this.lastScrollPositionOnFocus = null;
      _this.isWheeling = false;

      if (_this.isVoiceControl) {
        _this.isVoiceControl = false;

        _this.updateFocusAfterVoiceControl();
      }
    };

    _this.scrollTo = function (opt) {
      _this.indexToFocus = opt.focus && typeof opt.index === 'number' ? opt.index : null;
      _this.nodeToFocus = opt.focus && opt.node instanceof Object && opt.node.nodeType === 1 ? opt.node : null;
    };

    _this.alertThumb = function () {
      var bounds = _this.uiRef.current.getScrollBounds();

      _this.uiRef.current.showThumb(bounds);

      _this.uiRef.current.startHidingThumb();
    };

    _this.alertThumbAfterRendered = function () {
      var spotItem = _spotlight["default"].getCurrent();

      if (!_spotlight["default"].getPointerMode() && _this.isContent(spotItem) && _this.uiRef.current.isUpdatedScrollThumb) {
        _this.alertThumb();
      }
    };

    _this.handleResizeWindow = function () {
      var focusedItem = _spotlight["default"].getCurrent();

      if (focusedItem) {
        focusedItem.blur();
      }
    };

    _this.handleScrollerUpdate = function () {
      if (_this.uiRef.current.scrollToInfo === null) {
        var scrollHeight = _this.uiRef.current.getScrollBounds().scrollHeight;

        if (scrollHeight !== _this.uiRef.current.bounds.scrollHeight) {
          _this.calculateAndScrollTo();
        }
      } // oddly, Scroller manages this.uiRef.current.bounds so if we don't update it here (it is also
      // updated in calculateAndScrollTo but we might not have made it to that point), it will be
      // out of date when we land back in this method next time.


      _this.uiRef.current.bounds.scrollHeight = _this.uiRef.current.getScrollBounds().scrollHeight;
    };

    _this.clearOverscrollEffect = function (orientation, edge) {
      _this.overscrollJobs[orientation][edge].startAfter(overscrollTimeout, orientation, edge, overscrollTypeNone, 0);

      _this.uiRef.current.setOverscrollStatus(orientation, edge, overscrollTypeNone, 0);
    };

    _this.applyOverscrollEffect = function (orientation, edge, type, ratio) {
      var nodeRef = _this.overscrollRefs[orientation].current;

      if (nodeRef) {
        nodeRef.style.setProperty(overscrollRatioPrefix + orientation + edge, ratio);

        if (type === overscrollTypeOnce) {
          _this.overscrollJobs[orientation][edge].start(orientation, edge, overscrollTypeDone, 0);
        }
      }
    };

    _this.createOverscrollJob = function (orientation, edge) {
      if (!_this.overscrollJobs[orientation][edge]) {
        _this.overscrollJobs[orientation][edge] = new _util.Job(_this.applyOverscrollEffect.bind(_assertThisInitialized(_this)), overscrollTimeout);
      }
    };

    _this.stopOverscrollJob = function (orientation, edge) {
      var job = _this.overscrollJobs[orientation][edge];

      if (job) {
        job.stop();
      }
    };

    _this.addEventListeners = function (childContainerRef) {
      if (childContainerRef.current && childContainerRef.current.addEventListener) {
        childContainerRef.current.addEventListener('focusin', _this.onFocus);

        if (_platform["default"].webos) {
          childContainerRef.current.addEventListener('webOSVoice', _this.onVoice);
          childContainerRef.current.setAttribute('data-webos-voice-intent', 'Scroll');
        }
      }
    };

    _this.removeEventListeners = function (childContainerRef) {
      if (childContainerRef.current && childContainerRef.current.removeEventListener) {
        childContainerRef.current.removeEventListener('focusin', _this.onFocus);

        if (_platform["default"].webos) {
          childContainerRef.current.removeEventListener('webOSVoice', _this.onVoice);
          childContainerRef.current.removeAttribute('data-webos-voice-intent');
        }
      }
    };

    _this.updateFocusAfterVoiceControl = function () {
      var spotItem = _spotlight["default"].getCurrent();

      if (spotItem && _this.uiRef.current.containerRef.current.contains(spotItem)) {
        var viewportBounds = _this.uiRef.current.containerRef.current.getBoundingClientRect(),
            spotItemBounds = spotItem.getBoundingClientRect(),
            nodes = _spotlight["default"].getSpottableDescendants(_this.uiRef.current.containerRef.current.dataset.spotlightId),
            first = _this.voiceControlDirection === 'vertical' ? 'top' : 'left',
            last = _this.voiceControlDirection === 'vertical' ? 'bottom' : 'right';

        if (spotItemBounds[last] < viewportBounds[first] || spotItemBounds[first] > viewportBounds[last]) {
          for (var i = 0; i < nodes.length; i++) {
            var nodeBounds = nodes[i].getBoundingClientRect();

            if (nodeBounds[first] > viewportBounds[first] && nodeBounds[last] < viewportBounds[last]) {
              _spotlight["default"].focus(nodes[i]);

              break;
            }
          }
        }
      }
    };

    _this.isReachedEdge = function (scrollPos, ltrBound, rtlBound) {
      var isRtl = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : false;
      var bound = isRtl ? rtlBound : ltrBound;
      return bound === 0 && scrollPos === 0 || bound > 0 && scrollPos >= bound - 1;
    };

    _this.onVoice = function (e) {
      var isHorizontal = _this.props.direction === 'horizontal',
          isRtl = _this.uiRef.current.props.rtl,
          _this$uiRef$current3 = _this.uiRef.current,
          scrollTop = _this$uiRef$current3.scrollTop,
          scrollLeft = _this$uiRef$current3.scrollLeft,
          _this$uiRef$current$g = _this.uiRef.current.getScrollBounds(),
          maxLeft = _this$uiRef$current$g.maxLeft,
          maxTop = _this$uiRef$current$g.maxTop,
          verticalDirection = ['up', 'down', 'top', 'bottom'],
          horizontalDirection = isRtl ? ['right', 'left', 'rightmost', 'leftmost'] : ['left', 'right', 'leftmost', 'rightmost'],
          movement = ['previous', 'next', 'first', 'last'];

      var scroll = e && e.detail && e.detail.scroll,
          index = movement.indexOf(scroll);

      if (index > -1) {
        scroll = isHorizontal ? horizontalDirection[index] : verticalDirection[index];
      }

      _this.voiceControlDirection = verticalDirection.includes(scroll) && 'vertical' || horizontalDirection.includes(scroll) && 'horizontal' || null; // Case 1. Invalid direction

      if (_this.voiceControlDirection === null) {
        _this.isVoiceControl = false; // Case 2. Cannot scroll
      } else if (['up', 'top'].includes(scroll) && _this.isReachedEdge(scrollTop, 0) || ['down', 'bottom'].includes(scroll) && _this.isReachedEdge(scrollTop, maxTop) || ['left', 'leftmost'].includes(scroll) && _this.isReachedEdge(scrollLeft, 0, maxLeft, isRtl) || ['right', 'rightmost'].includes(scroll) && _this.isReachedEdge(scrollLeft, maxLeft, 0, isRtl)) {
        if (window.webOSVoiceReportActionResult) {
          window.webOSVoiceReportActionResult({
            voiceUi: {
              exception: 'alreadyCompleted'
            }
          });
          e.preventDefault();
        } // Case 3. Can scroll

      } else {
        _this.isVoiceControl = true;

        if (['up', 'down', 'left', 'right'].includes(scroll)) {
          var isPreviousScrollButton = scroll === 'up' || scroll === 'left' && !isRtl || scroll === 'right' && isRtl;

          _this.onScrollbarButtonClick({
            isPreviousScrollButton: isPreviousScrollButton,
            isVerticalScrollBar: verticalDirection.includes(scroll)
          });
        } else {
          // ['top', 'bottom', 'leftmost', 'rightmost'].includes(scroll)
          _this.uiRef.current.scrollTo({
            align: verticalDirection.includes(scroll) && scroll || (scroll === 'leftmost' && isRtl || scroll === 'rightmost' && !isRtl) && 'right' || 'left'
          });
        }

        e.preventDefault();
      }
    };

    _this.handleScroll = (0, _handle["default"])((0, _handle.forward)('onScroll'), function (ev, _ref5, context) {
      var id = _ref5.id;
      return id && context && context.set;
    }, function (_ref6, _ref7, context) {
      var x = _ref6.scrollLeft,
          y = _ref6.scrollTop;
      var id = _ref7.id;
      context.set("".concat(id, ".scrollPosition"), {
        x: x,
        y: y
      });
    }).bindAs(_assertThisInitialized(_this), 'handleScroll');
    _this.scrollbarProps = {
      cbAlertThumb: _this.alertThumbAfterRendered,
      onNextScroll: _this.onScrollbarButtonClick,
      onPrevScroll: _this.onScrollbarButtonClick
    };
    _this.overscrollRefs = {
      horizontal: _react["default"].createRef(),
      vertical: _react["default"].createRef()
    };
    _this.childRef = _react["default"].createRef();
    _this.uiRef = _react["default"].createRef();
    configureSpotlightContainer(props);
    return _this;
  }

  _createClass(ScrollableBase, [{
    key: "componentDidMount",
    value: function componentDidMount() {
      this.createOverscrollJob('horizontal', 'before');
      this.createOverscrollJob('horizontal', 'after');
      this.createOverscrollJob('vertical', 'before');
      this.createOverscrollJob('vertical', 'after');
      this.restoreScrollPosition();
      scrollables.set(this, this.uiRef.current.containerRef.current);
    }
  }, {
    key: "componentDidUpdate",
    value: function componentDidUpdate(prevProps) {
      if (prevProps['data-spotlight-id'] !== this.props['data-spotlight-id'] || prevProps.focusableScrollbar !== this.props.focusableScrollbar) {
        configureSpotlightContainer(this.props);
      }
    }
  }, {
    key: "componentWillUnmount",
    value: function componentWillUnmount() {
      scrollables["delete"](this);
      this.stopOverscrollJob('horizontal', 'before');
      this.stopOverscrollJob('horizontal', 'after');
      this.stopOverscrollJob('vertical', 'before');
      this.stopOverscrollJob('vertical', 'after');
    } // status

  }, {
    key: "restoreScrollPosition",
    value: function restoreScrollPosition() {
      var id = this.props.id;

      if (id && this.context && this.context.get) {
        var scrollPosition = this.context.get("".concat(id, ".scrollPosition"));

        if (scrollPosition) {
          this.uiRef.current.scrollTo({
            position: scrollPosition,
            animate: false
          });
        }
      }
    }
  }, {
    key: "isScrollButtonFocused",
    value: function isScrollButtonFocused() {
      var _this$uiRef$current4 = this.uiRef.current,
          h = _this$uiRef$current4.horizontalScrollbarRef,
          v = _this$uiRef$current4.verticalScrollbarRef;
      return h.current && h.current.isOneOfScrollButtonsFocused() || v.current && v.current.isOneOfScrollButtonsFocused();
    }
  }, {
    key: "hasFocus",
    value: function hasFocus() {
      var current = _spotlight["default"].getCurrent();

      if (!current) {
        var spotlightId = _spotlight["default"].getActiveContainer();

        current = document.querySelector("[data-spotlight-id=\"".concat(spotlightId, "\"]"));
      }

      return current && this.uiRef.current && this.uiRef.current.containerRef.current.contains(current);
    }
  }, {
    key: "focusOnScrollButton",
    value: function focusOnScrollButton(scrollbarRef, isPreviousScrollButton) {
      if (scrollbarRef.current) {
        scrollbarRef.current.focusOnButton(isPreviousScrollButton);
      }
    }
  }, {
    key: "focusOnItem",
    value: function focusOnItem() {
      var childRef = this.childRef;

      if (this.indexToFocus !== null && typeof childRef.current.focusByIndex === 'function') {
        childRef.current.focusByIndex(this.indexToFocus);
        this.indexToFocus = null;
      }

      if (this.nodeToFocus !== null && typeof childRef.current.focusOnNode === 'function') {
        childRef.current.focusOnNode(this.nodeToFocus);
        this.nodeToFocus = null;
      }

      if (this.pointToFocus !== null) {
        // no need to focus on pointer mode
        if (!_spotlight["default"].getPointerMode()) {
          var _this$pointToFocus = this.pointToFocus,
              direction = _this$pointToFocus.direction,
              x = _this$pointToFocus.x,
              y = _this$pointToFocus.y;
          var position = {
            x: x,
            y: y
          };
          var current = this.uiRef.current.containerRef.current;
          var elemFromPoint = document.elementFromPoint(x, y);
          var target = elemFromPoint && elemFromPoint.closest && getIntersectingElement(elemFromPoint.closest(".".concat(_Spottable.spottableClass)), current) || getTargetInViewByDirectionFromPosition(direction, position, current) || getTargetInViewByDirectionFromPosition(reverseDirections[direction], position, current);

          if (target) {
            _spotlight["default"].focus(target);
          }
        }

        this.pointToFocus = null;
      }
    }
  }, {
    key: "render",
    value: function render() {
      var _this2 = this;

      var _this$props2 = this.props,
          childRenderer = _this$props2.childRenderer,
          spotlightContainer = _this$props2['data-spotlight-container'],
          spotlightContainerDisabled = _this$props2['data-spotlight-container-disabled'],
          spotlightId = _this$props2['data-spotlight-id'],
          focusableScrollbar = _this$props2.focusableScrollbar,
          preventBubblingOnKeyDown = _this$props2.preventBubblingOnKeyDown,
          scrollDownAriaLabel = _this$props2.scrollDownAriaLabel,
          scrollLeftAriaLabel = _this$props2.scrollLeftAriaLabel,
          scrollRightAriaLabel = _this$props2.scrollRightAriaLabel,
          scrollUpAriaLabel = _this$props2.scrollUpAriaLabel,
          rest = _objectWithoutProperties(_this$props2, ["childRenderer", "data-spotlight-container", "data-spotlight-container-disabled", "data-spotlight-id", "focusableScrollbar", "preventBubblingOnKeyDown", "scrollDownAriaLabel", "scrollLeftAriaLabel", "scrollRightAriaLabel", "scrollUpAriaLabel"]),
          downButtonAriaLabel = scrollDownAriaLabel == null ? (0, _$L["default"])('scroll down') : scrollDownAriaLabel,
          upButtonAriaLabel = scrollUpAriaLabel == null ? (0, _$L["default"])('scroll up') : scrollUpAriaLabel,
          rightButtonAriaLabel = scrollRightAriaLabel == null ? (0, _$L["default"])('scroll right') : scrollRightAriaLabel,
          leftButtonAriaLabel = scrollLeftAriaLabel == null ? (0, _$L["default"])('scroll left') : scrollLeftAriaLabel;

      return _react["default"].createElement(_Scrollable.ScrollableBase, Object.assign({
        noScrollByDrag: !_platform["default"].touchscreen
      }, rest, {
        addEventListeners: this.addEventListeners,
        applyOverscrollEffect: this.applyOverscrollEffect,
        clearOverscrollEffect: this.clearOverscrollEffect,
        handleResizeWindow: this.handleResizeWindow,
        onFlick: this.onFlick,
        onKeyDown: this.onKeyDown,
        onMouseDown: this.onMouseDown,
        onScroll: this.handleScroll,
        onWheel: this.onWheel,
        ref: this.uiRef,
        removeEventListeners: this.removeEventListeners,
        scrollTo: this.scrollTo,
        stop: this.stop,
        containerRenderer: function containerRenderer(_ref8) {
          var childComponentProps = _ref8.childComponentProps,
              ChildWrapper = _ref8.childWrapper,
              _ref8$childWrapperPro = _ref8.childWrapperProps,
              contentClassName = _ref8$childWrapperPro.className,
              restChildWrapperProps = _objectWithoutProperties(_ref8$childWrapperPro, ["className"]),
              className = _ref8.className,
              componentCss = _ref8.componentCss,
              uiContainerRef = _ref8.containerRef,
              handleScroll = _ref8.handleScroll,
              horizontalScrollbarProps = _ref8.horizontalScrollbarProps,
              initUiChildRef = _ref8.initChildRef,
              isHorizontalScrollbarVisible = _ref8.isHorizontalScrollbarVisible,
              isVerticalScrollbarVisible = _ref8.isVerticalScrollbarVisible,
              rtl = _ref8.rtl,
              scrollTo = _ref8.scrollTo,
              style = _ref8.style,
              verticalScrollbarProps = _ref8.verticalScrollbarProps;

          return _react["default"].createElement("div", {
            className: (0, _classnames["default"])(className, _OverscrollEffectModule["default"].scrollable),
            "data-spotlight-container": spotlightContainer,
            "data-spotlight-container-disabled": spotlightContainerDisabled,
            "data-spotlight-id": spotlightId,
            onTouchStart: _this2.onTouchStart,
            ref: uiContainerRef,
            style: style
          }, _react["default"].createElement("div", {
            className: (0, _classnames["default"])(componentCss.container, _OverscrollEffectModule["default"].overscrollFrame, _OverscrollEffectModule["default"].vertical, isHorizontalScrollbarVisible ? _OverscrollEffectModule["default"].horizontalScrollbarVisible : null),
            ref: _this2.overscrollRefs.vertical
          }, _react["default"].createElement(ChildWrapper, Object.assign({
            className: (0, _classnames["default"])(contentClassName, _OverscrollEffectModule["default"].overscrollFrame, _OverscrollEffectModule["default"].horizontal),
            ref: _this2.overscrollRefs.horizontal
          }, restChildWrapperProps), childRenderer(_objectSpread({}, childComponentProps, {
            cbScrollTo: scrollTo,
            className: componentCss.scrollableFill,
            initUiChildRef: initUiChildRef,
            isHorizontalScrollbarVisible: isHorizontalScrollbarVisible,
            isVerticalScrollbarVisible: isVerticalScrollbarVisible,
            onScroll: handleScroll,
            onUpdate: _this2.handleScrollerUpdate,
            ref: _this2.childRef,
            rtl: rtl,
            scrollAndFocusScrollbarButton: _this2.scrollAndFocusScrollbarButton,
            spotlightId: spotlightId
          }))), isVerticalScrollbarVisible ? _react["default"].createElement(_Scrollbar["default"], Object.assign({}, verticalScrollbarProps, _this2.scrollbarProps, {
            disabled: !isVerticalScrollbarVisible,
            focusableScrollButtons: focusableScrollbar,
            nextButtonAriaLabel: downButtonAriaLabel,
            onKeyDownButton: _this2.onKeyDown,
            preventBubblingOnKeyDown: preventBubblingOnKeyDown,
            previousButtonAriaLabel: upButtonAriaLabel,
            rtl: rtl
          })) : null), isHorizontalScrollbarVisible ? _react["default"].createElement(_Scrollbar["default"], Object.assign({}, horizontalScrollbarProps, _this2.scrollbarProps, {
            corner: isVerticalScrollbarVisible,
            disabled: !isHorizontalScrollbarVisible,
            focusableScrollButtons: focusableScrollbar,
            nextButtonAriaLabel: rightButtonAriaLabel,
            onKeyDownButton: _this2.onKeyDown,
            preventBubblingOnKeyDown: preventBubblingOnKeyDown,
            previousButtonAriaLabel: leftButtonAriaLabel,
            rtl: rtl
          })) : null);
        }
      }));
    }
  }]);

  return ScrollableBase;
}(_react.Component);
/**
 * A Moonstone-styled component that provides horizontal and vertical scrollbars.
 *
 * @class Scrollable
 * @memberof moonstone/Scrollable
 * @mixes spotlight/SpotlightContainerDecorator
 * @extends moonstone/Scrollable.ScrollableBase
 * @ui
 * @public
 */


exports.ScrollableBase = ScrollableBase;
ScrollableBase.displayName = 'Scrollable';
ScrollableBase.contextType = _SharedStateDecorator.SharedState;
ScrollableBase.propTypes =
/** @lends moonstone/Scrollable.Scrollable.prototype */
{
  /**
   * Render function.
   *
   * @type {Function}
   * @required
   * @private
   */
  childRenderer: _propTypes["default"].func.isRequired,

  /**
   * This is set to `true` by SpotlightContainerDecorator
   *
   * @type {Boolean}
   * @private
   */
  'data-spotlight-container': _propTypes["default"].bool,

  /**
   * `false` if the content of the list or the scroller could get focus
   *
   * @type {Boolean}
   * @default false
   * @private
   */
  'data-spotlight-container-disabled': _propTypes["default"].bool,

  /**
   * This is passed onto the wrapped component to allow
   * it to customize the spotlight container for its use case.
   *
   * @type {String}
   * @private
   */
  'data-spotlight-id': _propTypes["default"].string,

  /**
   * Direction of the list or the scroller.
   * `'both'` could be only used for[Scroller]{@link moonstone/Scroller.Scroller}.
   *
   * Valid values are:
   * * `'both'`,
   * * `'horizontal'`, and
   * * `'vertical'`.
   *
   * @type {String}
   * @private
   */
  direction: _propTypes["default"].oneOf(['both', 'horizontal', 'vertical']),

  /**
   * Allows 5-way navigation to the scrollbar controls. By default, 5-way will
   * not move focus to the scrollbar controls.
   *
   * @type {Boolean}
   * @default false
   * @public
   */
  focusableScrollbar: _propTypes["default"].bool,

  /**
   * A unique identifier for the scrollable component.
   *
   * When specified and when the scrollable is within a SharedStateDecorator, the scroll
   * position will be shared and restored on mount if the component is destroyed and
   * recreated.
   *
   * @type {String}
   * @public
   */
  id: _propTypes["default"].string,

  /**
   * Specifies overscroll effects shows on which type of inputs.
   *
   * @type {Object}
   * @default {
   *	arrowKey: false,
   *	drag: false,
   *	pageKey: false,
   *	scrollbarButton: false,
   *	wheel: true
   * }
   * @private
   */
  overscrollEffectOn: _propTypes["default"].shape({
    arrowKey: _propTypes["default"].bool,
    drag: _propTypes["default"].bool,
    pageKey: _propTypes["default"].bool,
    scrollbarButton: _propTypes["default"].bool,
    wheel: _propTypes["default"].bool
  }),

  /**
   * Specifies preventing keydown events from bubbling up to applications.
   * Valid values are `'none'`, and `'programmatic'`.
   *
   * When it is `'none'`, every keydown event is bubbled.
   * When it is `'programmatic'`, an event bubbling is not allowed for a keydown input
   * which invokes programmatic spotlight moving.
   *
   * @type {String}
   * @default 'none'
   * @private
   */
  preventBubblingOnKeyDown: _propTypes["default"].oneOf(['none', 'programmatic']),

  /**
   * Sets the hint string read when focusing the next button in the vertical scroll bar.
   *
   * @type {String}
   * @default $L('scroll down')
   * @public
   */
  scrollDownAriaLabel: _propTypes["default"].string,

  /**
   * Sets the hint string read when focusing the previous button in the horizontal scroll bar.
   *
   * @type {String}
   * @default $L('scroll left')
   * @public
   */
  scrollLeftAriaLabel: _propTypes["default"].string,

  /**
   * Sets the hint string read when focusing the next button in the horizontal scroll bar.
   *
   * @type {String}
   * @default $L('scroll right')
   * @public
   */
  scrollRightAriaLabel: _propTypes["default"].string,

  /**
   * Sets the hint string read when focusing the previous button in the vertical scroll bar.
   *
   * @type {String}
   * @default $L('scroll up')
   * @public
   */
  scrollUpAriaLabel: _propTypes["default"].string
};
ScrollableBase.defaultProps = {
  'data-spotlight-container-disabled': false,
  focusableScrollbar: false,
  overscrollEffectOn: {
    arrowKey: false,
    drag: false,
    pageKey: false,
    scrollbarButton: false,
    wheel: true
  },
  preventBubblingOnKeyDown: 'none'
};
var Scrollable = (0, _Skinnable["default"])((0, _SpotlightContainerDecorator["default"])({
  overflow: true,
  preserveId: true,
  restrict: 'self-first'
}, (0, _I18nDecorator.I18nContextDecorator)({
  rtlProp: 'rtl'
}, ScrollableBase)));
exports.Scrollable = Scrollable;
var _default = Scrollable;
exports["default"] = _default;