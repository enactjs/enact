"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.VirtualListBaseNative = exports.VirtualListBase = exports.ScrollableVirtualListNative = exports.ScrollableVirtualList = exports["default"] = void 0;

var _target = require("@enact/spotlight/src/target");

var _keymap = require("@enact/core/keymap");

var _spotlight = _interopRequireWildcard(require("@enact/spotlight"));

var _Accelerator = _interopRequireDefault(require("@enact/spotlight/Accelerator"));

var _Pause = _interopRequireDefault(require("@enact/spotlight/Pause"));

var _Spottable = require("@enact/spotlight/Spottable");

var _VirtualList = require("@enact/ui/VirtualList");

var _propTypes = _interopRequireDefault(require("prop-types"));

var _clamp = _interopRequireDefault(require("ramda/src/clamp"));

var _react = _interopRequireWildcard(require("react"));

var _warning = _interopRequireDefault(require("warning"));

var _Scrollable = require("../Scrollable");

var _ScrollableNative = _interopRequireDefault(require("../Scrollable/ScrollableNative"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj["default"] = obj; return newObj; } }

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

var SpotlightAccelerator = new _Accelerator["default"]();
var SpotlightPlaceholder = (0, _Spottable.Spottable)('div');

var dataContainerDisabledAttribute = 'data-spotlight-container-disabled',
    isDown = (0, _keymap.is)('down'),
    isEnter = (0, _keymap.is)('enter'),
    isLeft = (0, _keymap.is)('left'),
    isPageUp = (0, _keymap.is)('pageUp'),
    isPageDown = (0, _keymap.is)('pageDown'),
    isRight = (0, _keymap.is)('right'),
    isUp = (0, _keymap.is)('up'),
    JS = 'JS',
    Native = 'Native',
    // using 'bitwise or' for string > number conversion based on performance: https://jsperf.com/convert-string-to-number-techniques/7
getNumberValue = function getNumberValue(index) {
  return index | 0;
},
    nop = function nop() {},
    spottableSelector = ".".concat(_Spottable.spottableClass);
/**
 * The base version of [VirtualListBase]{@link moonstone/VirtualList.VirtualListBase} and
 * [VirtualListBaseNative]{@link moonstone/VirtualList.VirtualListBaseNative}.
 *
 * @class VirtualListCore
 * @memberof moonstone/VirtualList
 * @ui
 * @private
 */


var VirtualListBaseFactory = function VirtualListBaseFactory(type) {
  var _class, _temp;

  var UiBase = type === JS ? _VirtualList.VirtualListBase : _VirtualList.VirtualListBaseNative;
  return _temp = _class =
  /*#__PURE__*/
  function (_Component) {
    _inherits(VirtualListCore, _Component);

    /* No displayName here. We set displayName to returned components of this factory function. */
    function VirtualListCore(props) {
      var _this;

      _classCallCheck(this, VirtualListCore);

      _this = _possibleConstructorReturn(this, _getPrototypeOf(VirtualListCore).call(this, props));
      _this.isScrolledBy5way = false;
      _this.isScrolledByJump = false;
      _this.isWrappedBy5way = false;
      _this.lastFocusedIndex = null;
      _this.nodeIndexToBeFocused = null;
      _this.preservedIndex = null;
      _this.restoreLastFocused = false;
      _this.uiRefCurrent = null;

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

      _this.configureSpotlight = function (spotlightId) {
        var spacing = _this.props.spacing;

        _spotlight["default"].set(spotlightId, {
          enterTo: 'last-focused',

          /*
           * Returns the data-index as the key for last focused
           */
          lastFocusedPersist: _this.lastFocusedPersist,

          /*
           * Restores the data-index into the placeholder if its the only element. Tries to find a
           * matching child otherwise.
           */
          lastFocusedRestore: _this.lastFocusedRestore,

          /*
           * Directs spotlight focus to favor straight elements that are within range of `spacing`
           * over oblique elements, like scroll buttons.
           */
          obliqueMultiplier: spacing > 0 ? spacing : 1
        });
      };

      _this.lastFocusedPersist = function () {
        if (_this.lastFocusedIndex != null) {
          return {
            container: false,
            element: true,
            key: _this.lastFocusedIndex
          };
        }
      };

      _this.lastFocusedRestore = function (_ref, all) {
        var key = _ref.key;
        var placeholder = all.find(function (el) {
          return 'vlPlaceholder' in el.dataset;
        });

        if (placeholder) {
          placeholder.dataset.index = key;
          return placeholder;
        }

        return all.reduce(function (focused, node) {
          return focused || Number(node.dataset.index) === key && node;
        }, null);
      };

      _this.findSpottableItem = function (indexFrom, indexTo) {
        var dataSize = _this.props.dataSize;

        if (indexFrom < 0 && indexTo < 0 || indexFrom >= dataSize && indexTo >= dataSize) {
          return -1;
        } else {
          return (0, _clamp["default"])(0, dataSize - 1, indexFrom);
        }
      };

      _this.getNextIndex = function (_ref2) {
        var index = _ref2.index,
            keyCode = _ref2.keyCode,
            repeat = _ref2.repeat;
        var _this$props = _this.props,
            dataSize = _this$props.dataSize,
            rtl = _this$props.rtl,
            wrap = _this$props.wrap;
        var _this$uiRefCurrent = _this.uiRefCurrent,
            isPrimaryDirectionVertical = _this$uiRefCurrent.isPrimaryDirectionVertical,
            dimensionToExtent = _this$uiRefCurrent.dimensionToExtent;
        var column = index % dimensionToExtent;
        var row = (index - column) % dataSize / dimensionToExtent;
        var isDownKey = isDown(keyCode);
        var isLeftMovement = !rtl && isLeft(keyCode) || rtl && isRight(keyCode);
        var isRightMovement = !rtl && isRight(keyCode) || rtl && isLeft(keyCode);
        var isUpKey = isUp(keyCode);
        var isNextRow = index + dimensionToExtent < dataSize;
        var isNextAdjacent = column < dimensionToExtent - 1 && index < dataSize - 1;
        var isBackward = isPrimaryDirectionVertical && isUpKey || !isPrimaryDirectionVertical && isLeftMovement || null;
        var isForward = isPrimaryDirectionVertical && isDownKey || !isPrimaryDirectionVertical && isRightMovement || null;
        var isWrapped = false;
        var nextIndex = -1;
        var targetIndex = -1;

        if (index >= 0) {
          if (isPrimaryDirectionVertical) {
            if (isUpKey && row) {
              targetIndex = index - dimensionToExtent;
            } else if (isDownKey && isNextRow) {
              targetIndex = index + dimensionToExtent;
            } else if (isLeftMovement && column) {
              targetIndex = index - 1;
            } else if (isRightMovement && isNextAdjacent) {
              targetIndex = index + 1;
            }
          } else if (isLeftMovement && row) {
            targetIndex = index - dimensionToExtent;
          } else if (isRightMovement && isNextRow) {
            targetIndex = index + dimensionToExtent;
          } else if (isUpKey && column) {
            targetIndex = index - 1;
          } else if (isDownKey && isNextAdjacent) {
            targetIndex = index + 1;
          }

          if (targetIndex >= 0) {
            nextIndex = targetIndex;
          }
        }

        if (!repeat && nextIndex === -1 && wrap) {
          if (isForward && _this.findSpottableItem((row + 1) * dimensionToExtent, dataSize) < 0) {
            nextIndex = _this.findSpottableItem(0, index);
            isWrapped = true;
          } else if (isBackward && _this.findSpottableItem(-1, row * dimensionToExtent - 1) < 0) {
            nextIndex = _this.findSpottableItem(dataSize, index);
            isWrapped = true;
          }
        }

        return {
          isDownKey: isDownKey,
          isUpKey: isUpKey,
          isLeftMovement: isLeftMovement,
          isRightMovement: isRightMovement,
          isWrapped: isWrapped,
          nextIndex: nextIndex
        };
      };

      _this.onAcceleratedKeyDown = function (_ref3) {
        var isWrapped = _ref3.isWrapped,
            keyCode = _ref3.keyCode,
            nextIndex = _ref3.nextIndex,
            repeat = _ref3.repeat,
            target = _ref3.target;
        var _this$props2 = _this.props,
            cbScrollTo = _this$props2.cbScrollTo,
            dataSize = _this$props2.dataSize,
            spacing = _this$props2.spacing,
            wrap = _this$props2.wrap;
        var _this$uiRefCurrent2 = _this.uiRefCurrent,
            dimensionToExtent = _this$uiRefCurrent2.dimensionToExtent,
            _this$uiRefCurrent2$p = _this$uiRefCurrent2.primary,
            clientSize = _this$uiRefCurrent2$p.clientSize,
            gridSize = _this$uiRefCurrent2$p.gridSize,
            scrollPositionTarget = _this$uiRefCurrent2.scrollPositionTarget;
        var index = getNumberValue(target.dataset.index);
        _this.isScrolledBy5way = false;
        _this.isScrolledByJump = false;

        if (nextIndex >= 0) {
          var row = Math.floor(index / dimensionToExtent),
              nextRow = Math.floor(nextIndex / dimensionToExtent),
              start = _this.uiRefCurrent.getGridPosition(nextIndex).primaryPosition,
              end = _this.uiRefCurrent.getGridPosition(nextIndex).primaryPosition + gridSize;

          var isNextItemInView = false;

          if (_this.props.itemSizes) {
            isNextItemInView = _this.uiRefCurrent.itemPositions[nextIndex].position >= scrollPositionTarget && _this.uiRefCurrent.getItemBottomPosition(nextIndex) <= scrollPositionTarget + clientSize;
          } else {
            var firstFullyVisibleIndex = Math.ceil(scrollPositionTarget / gridSize) * dimensionToExtent,
                lastFullyVisibleIndex = Math.min(dataSize - 1, Math.floor((scrollPositionTarget + clientSize + spacing) / gridSize) * dimensionToExtent - 1);
            isNextItemInView = nextIndex >= firstFullyVisibleIndex && nextIndex <= lastFullyVisibleIndex;
          }

          _this.lastFocusedIndex = nextIndex;

          if (isNextItemInView) {
            // The next item could be still out of viewport. So we need to prevent scrolling into view with `isScrolledBy5way` flag.
            _this.isScrolledBy5way = true;

            _this.focusByIndex(nextIndex);

            _this.isScrolledBy5way = false;
          } else if (row === nextRow && (start < scrollPositionTarget || end > scrollPositionTarget + clientSize)) {
            _this.focusByIndex(nextIndex);
          } else {
            _this.isScrolledBy5way = true;
            _this.isWrappedBy5way = isWrapped;

            if (isWrapped && _this.uiRefCurrent.containerRef.current.querySelector("[data-index='".concat(nextIndex, "']").concat(spottableSelector)) == null) {
              if (wrap === true) {
                _this.pause.pause();

                target.blur();
              } else {
                _this.focusByIndex(nextIndex);
              }

              _this.nodeIndexToBeFocused = nextIndex;
            } else {
              _this.focusByIndex(nextIndex);
            }

            cbScrollTo({
              index: nextIndex,
              stickTo: index < nextIndex ? 'end' : 'start',
              animate: !(isWrapped && wrap === 'noAnimation')
            });
          }
        } else if (!repeat && _spotlight["default"].move((0, _spotlight.getDirection)(keyCode))) {
          SpotlightAccelerator.reset();
        }
      };

      _this.onKeyDown = function (ev) {
        var keyCode = ev.keyCode,
            target = ev.target;
        var direction = (0, _spotlight.getDirection)(keyCode);

        if (direction) {
          _spotlight["default"].setPointerMode(false);

          if (SpotlightAccelerator.processKey(ev, nop)) {
            ev.stopPropagation();
          } else {
            var repeat = ev.repeat;
            var _this$props3 = _this.props,
                focusableScrollbar = _this$props3.focusableScrollbar,
                isHorizontalScrollbarVisible = _this$props3.isHorizontalScrollbarVisible,
                isVerticalScrollbarVisible = _this$props3.isVerticalScrollbarVisible,
                spotlightId = _this$props3.spotlightId;
            var _this$uiRefCurrent3 = _this.uiRefCurrent,
                dimensionToExtent = _this$uiRefCurrent3.dimensionToExtent,
                isPrimaryDirectionVertical = _this$uiRefCurrent3.isPrimaryDirectionVertical;
            var targetIndex = target.dataset.index;
            var isScrollButton = // if target has an index, it must be an item so can't be a scroll button
            !targetIndex && // if it lacks an index and is inside the scroller, it must be a button
            target.matches("[data-spotlight-id=\"".concat(spotlightId, "\"] *"));
            var index = !isScrollButton ? getNumberValue(targetIndex) : -1;

            var _this$getNextIndex = _this.getNextIndex({
              index: index,
              keyCode: keyCode,
              repeat: repeat
            }),
                isDownKey = _this$getNextIndex.isDownKey,
                isUpKey = _this$getNextIndex.isUpKey,
                isLeftMovement = _this$getNextIndex.isLeftMovement,
                isRightMovement = _this$getNextIndex.isRightMovement,
                isWrapped = _this$getNextIndex.isWrapped,
                nextIndex = _this$getNextIndex.nextIndex;

            var directions = {};
            var isLeaving = false;
            var isScrollbarVisible;

            if (isPrimaryDirectionVertical) {
              directions.left = isLeftMovement;
              directions.right = isRightMovement;
              directions.up = isUpKey;
              directions.down = isDownKey;
              isScrollbarVisible = isVerticalScrollbarVisible;
            } else {
              directions.left = isUpKey;
              directions.right = isDownKey;
              directions.up = isLeftMovement;
              directions.down = isRightMovement;
              isScrollbarVisible = isHorizontalScrollbarVisible;
            }

            if (!isScrollButton) {
              if (nextIndex >= 0) {
                ev.preventDefault();
                ev.stopPropagation();

                _this.onAcceleratedKeyDown({
                  isWrapped: isWrapped,
                  keyCode: keyCode,
                  nextIndex: nextIndex,
                  repeat: repeat,
                  target: target
                });
              } else {
                var dataSize = _this.props.dataSize;
                var column = index % dimensionToExtent;
                var row = (index - column) % dataSize / dimensionToExtent;
                isLeaving = directions.up && row === 0 || directions.down && row === Math.floor((dataSize - 1) % dataSize / dimensionToExtent) || directions.left && column === 0 || directions.right && (!focusableScrollbar || !isScrollbarVisible) && (column === dimensionToExtent - 1 || index === dataSize - 1 && row === 0);

                if (repeat && isLeaving) {
                  ev.preventDefault();
                  ev.stopPropagation();
                } else if (!isLeaving && _spotlight["default"].move(direction)) {
                  var nextTargetIndex = _spotlight["default"].getCurrent().dataset.index;

                  ev.preventDefault();
                  ev.stopPropagation();

                  if (typeof nextTargetIndex === 'string') {
                    _this.onAcceleratedKeyDown({
                      keyCode: keyCode,
                      nextIndex: getNumberValue(nextTargetIndex),
                      repeat: repeat,
                      target: target
                    });
                  }
                }
              }
            } else {
              var possibleTarget = (0, _target.getTargetByDirectionFromElement)(direction, target);

              if (possibleTarget && !ev.currentTarget.contains(possibleTarget)) {
                isLeaving = true;
              }
            }

            if (isLeaving) {
              SpotlightAccelerator.reset();
            }
          }
        } else if (isPageUp(keyCode) || isPageDown(keyCode)) {
          _this.isScrolledBy5way = false;
        }
      };

      _this.onKeyUp = function (_ref4) {
        var keyCode = _ref4.keyCode;

        if ((0, _spotlight.getDirection)(keyCode) || isEnter(keyCode)) {
          SpotlightAccelerator.reset();
        }
      };

      _this.handleGlobalKeyDown = function () {
        _this.setContainerDisabled(false);
      };

      _this.focusOnNode = function (node) {
        if (node) {
          _spotlight["default"].focus(node);
        }
      };

      _this.focusByIndex = function (index) {
        var item = _this.uiRefCurrent.containerRef.current.querySelector("[data-index='".concat(index, "']").concat(spottableSelector));

        if (!item && index >= 0 && index < _this.props.dataSize) {
          // Item is valid but since the the dom doesn't exist yet, we set the index to focus after the ongoing update
          _this.preservedIndex = index;
          _this.restoreLastFocused = true;
        } else {
          if (_this.isWrappedBy5way) {
            SpotlightAccelerator.reset();
            _this.isWrappedBy5way = false;
          }

          _this.pause.resume();

          _this.focusOnNode(item);

          _this.nodeIndexToBeFocused = null;
          _this.isScrolledByJump = false;
        }
      };

      _this.initItemRef = function (ref, index) {
        if (ref) {
          if (type === JS) {
            _this.focusByIndex(index);
          } else {
            // If focusing the item of VirtuallistNative, `onFocus` in Scrollable will be called.
            // Then VirtualListNative tries to scroll again differently from VirtualList.
            // So we would like to skip `focus` handling when focusing the item as a workaround.
            _this.isScrolledByJump = true;

            _this.focusByIndex(index);
          }
        }
      };

      _this.isNeededScrollingPlaceholder = function () {
        return _this.nodeIndexToBeFocused != null && _spotlight["default"].isPaused();
      };

      _this.handlePlaceholderFocus = function (ev) {
        var placeholder = ev.currentTarget;

        if (placeholder) {
          var index = placeholder.dataset.index;

          if (index) {
            _this.preservedIndex = getNumberValue(index);
            _this.restoreLastFocused = true;
          }
        }
      };

      _this.handleUpdateItems = function (_ref5) {
        var firstIndex = _ref5.firstIndex,
            lastIndex = _ref5.lastIndex;

        if (_this.restoreLastFocused && _this.preservedIndex >= firstIndex && _this.preservedIndex <= lastIndex) {
          _this.restoreFocus();
        }
      };

      _this.isPlaceholderFocused = function () {
        var current = _spotlight["default"].getCurrent();

        if (current && current.dataset.vlPlaceholder && _this.uiRefCurrent.containerRef.current.contains(current)) {
          return true;
        }

        return false;
      };

      _this.restoreFocus = function () {
        if (_this.restoreLastFocused && !_this.isPlaceholderFocused()) {
          var spotlightId = _this.props.spotlightId,
              node = _this.uiRefCurrent.containerRef.current.querySelector("[data-spotlight-id=\"".concat(spotlightId, "\"] [data-index=\"").concat(_this.preservedIndex, "\"]"));

          if (node) {
            // if we're supposed to restore focus and virtual list has positioned a set of items
            // that includes lastFocusedIndex, clear the indicator
            _this.restoreLastFocused = false; // try to focus the last focused item

            _this.isScrolledByJump = true;

            var foundLastFocused = _spotlight["default"].focus(node);

            _this.isScrolledByJump = false; // but if that fails (because it isn't found or is disabled), focus the container so
            // spotlight isn't lost

            if (!foundLastFocused) {
              _this.restoreLastFocused = true;

              _spotlight["default"].focus(spotlightId);
            }
          }
        }
      };

      _this.calculatePositionOnFocus = function (_ref6) {
        var item = _ref6.item,
            _ref6$scrollPosition = _ref6.scrollPosition,
            scrollPosition = _ref6$scrollPosition === void 0 ? _this.uiRefCurrent.scrollPosition : _ref6$scrollPosition;
        var pageScroll = _this.props.pageScroll,
            numOfItems = _this.uiRefCurrent.state.numOfItems,
            primary = _this.uiRefCurrent.primary,
            offsetToClientEnd = primary.clientSize - primary.itemSize,
            focusedIndex = getNumberValue(item.getAttribute(_Scrollable.dataIndexAttribute));

        if (!isNaN(focusedIndex)) {
          var gridPosition = _this.uiRefCurrent.getGridPosition(focusedIndex);

          if (numOfItems > 0 && focusedIndex % numOfItems !== _this.lastFocusedIndex % numOfItems) {
            var node = _this.uiRefCurrent.getItemNode(_this.lastFocusedIndex);

            if (node) {
              node.blur();
            }
          }

          _this.nodeIndexToBeFocused = null;
          _this.lastFocusedIndex = focusedIndex;

          if (primary.clientSize >= primary.itemSize) {
            if (gridPosition.primaryPosition > scrollPosition + offsetToClientEnd) {
              // forward over
              gridPosition.primaryPosition -= pageScroll ? 0 : offsetToClientEnd;
            } else if (gridPosition.primaryPosition >= scrollPosition) {
              // inside of client
              if (type === JS) {
                gridPosition.primaryPosition = scrollPosition;
              } else {
                // This code uses the trick to change the target position slightly which will not affect the actual result
                // since a browser ignore `scrollTo` method if the target position is same as the current position.
                gridPosition.primaryPosition = scrollPosition + (_this.uiRefCurrent.scrollPosition === scrollPosition ? 0.1 : 0);
              }
            } else {
              // backward over
              gridPosition.primaryPosition -= pageScroll ? offsetToClientEnd : 0;
            }
          } // Since the result is used as a target position to be scrolled,
          // scrondaryPosition should be 0 here.


          gridPosition.secondaryPosition = 0;
          return _this.uiRefCurrent.gridPositionToItemPosition(gridPosition);
        }
      };

      _this.shouldPreventScrollByFocus = function () {
        return type === JS ? _this.isScrolledBy5way : _this.isScrolledBy5way || _this.isScrolledByJump;
      };

      _this.shouldPreventOverscrollEffect = function () {
        return _this.isWrappedBy5way;
      };

      _this.setLastFocusedNode = function (node) {
        _this.lastFocusedIndex = node.dataset && getNumberValue(node.dataset.index);
      };

      _this.updateStatesAndBounds = function (_ref7) {
        var dataSize = _ref7.dataSize,
            moreInfo = _ref7.moreInfo,
            numOfItems = _ref7.numOfItems;

        var _assertThisInitialize = _assertThisInitialized(_this),
            preservedIndex = _assertThisInitialize.preservedIndex;

        return _this.restoreLastFocused && numOfItems > 0 && preservedIndex < dataSize && (preservedIndex < moreInfo.firstVisibleIndex || preservedIndex > moreInfo.lastVisibleIndex);
      };

      _this.getScrollBounds = function () {
        return _this.uiRefCurrent.getScrollBounds();
      };

      _this.getComponentProps = function (index) {
        return index === _this.nodeIndexToBeFocused ? {
          ref: function ref(_ref8) {
            return _this.initItemRef(_ref8, index);
          }
        } : {};
      };

      _this.initUiRef = function (ref) {
        if (ref) {
          _this.uiRefCurrent = ref;

          _this.props.initUiChildRef(ref);
        }
      };

      var _spotlightId = props.spotlightId;

      if (_spotlightId) {
        _this.configureSpotlight(_spotlightId);
      }

      _this.pause = new _Pause["default"]('VirtualListBase');
      return _this;
    }

    _createClass(VirtualListCore, [{
      key: "componentDidMount",
      value: function componentDidMount() {
        var _this2 = this;

        var containerNode = this.uiRefCurrent.containerRef.current;
        var scrollerNode = document.querySelector("[data-spotlight-id=\"".concat(this.props.spotlightId, "\"]"));

        if (type === JS) {
          // prevent native scrolling by Spotlight
          this.preventScroll = function () {
            containerNode.scrollTop = 0;
            containerNode.scrollLeft = _this2.props.rtl ? containerNode.scrollWidth : 0;
          };

          if (containerNode && containerNode.addEventListener) {
            containerNode.addEventListener('scroll', this.preventScroll);
          }
        }

        if (scrollerNode && scrollerNode.addEventListener) {
          scrollerNode.addEventListener('keydown', this.onKeyDown, {
            capture: true
          });
          scrollerNode.addEventListener('keyup', this.onKeyUp, {
            capture: true
          });
        }
      }
    }, {
      key: "componentDidUpdate",
      value: function componentDidUpdate(prevProps) {
        if (prevProps.spotlightId !== this.props.spotlightId) {
          this.configureSpotlight(this.props.spotlightId);
        }

        this.restoreFocus();
      }
    }, {
      key: "componentWillUnmount",
      value: function componentWillUnmount() {
        var containerNode = this.uiRefCurrent.containerRef.current;
        var scrollerNode = document.querySelector("[data-spotlight-id=\"".concat(this.props.spotlightId, "\"]"));

        if (type === JS) {
          // remove a function for preventing native scrolling by Spotlight
          if (containerNode && containerNode.removeEventListener) {
            containerNode.removeEventListener('scroll', this.preventScroll);
          }
        }

        if (scrollerNode && scrollerNode.removeEventListener) {
          scrollerNode.removeEventListener('keydown', this.onKeyDown, {
            capture: true
          });
          scrollerNode.removeEventListener('keyup', this.onKeyUp, {
            capture: true
          });
        }

        this.pause.resume();
        SpotlightAccelerator.reset();
        this.setContainerDisabled(false);
      }
    }, {
      key: "render",
      value: function render() {
        var _this3 = this;

        var _this$props4 = this.props,
            _itemRenderer = _this$props4.itemRenderer,
            _itemsRenderer = _this$props4.itemsRenderer,
            role = _this$props4.role,
            rest = _objectWithoutProperties(_this$props4, ["itemRenderer", "itemsRenderer", "role"]),
            needsScrollingPlaceholder = this.isNeededScrollingPlaceholder();

        delete rest.initUiChildRef; // not used by VirtualList

        delete rest.focusableScrollbar;
        delete rest.scrollAndFocusScrollbarButton;
        delete rest.spotlightId;
        delete rest.wrap;
        return _react["default"].createElement(UiBase, Object.assign({}, rest, {
          getComponentProps: this.getComponentProps,
          itemRenderer: function itemRenderer(_ref9) {
            var _objectSpread2;

            var index = _ref9.index,
                itemRest = _objectWithoutProperties(_ref9, ["index"]);

            return (// eslint-disable-line react/jsx-no-bind
              _itemRenderer(_objectSpread({}, itemRest, (_objectSpread2 = {}, _defineProperty(_objectSpread2, _Scrollable.dataIndexAttribute, index), _defineProperty(_objectSpread2, "index", index), _objectSpread2)))
            );
          },
          onUpdateItems: this.handleUpdateItems,
          ref: this.initUiRef,
          updateStatesAndBounds: this.updateStatesAndBounds,
          itemsRenderer: function itemsRenderer(props) {
            // eslint-disable-line react/jsx-no-bind
            return _itemsRenderer(_objectSpread({}, props, {
              handlePlaceholderFocus: _this3.handlePlaceholderFocus,
              needsScrollingPlaceholder: needsScrollingPlaceholder,
              role: role
            }));
          }
        }));
      }
    }]);

    return VirtualListCore;
  }(_react.Component), _class.propTypes =
  /** @lends moonstone/VirtualList.VirtualListBase.prototype */
  {
    /**
     * The `render` function called for each item in the list.
     *
     * > NOTE: The list does NOT always render a component whenever its render function is called
     * due to performance optimization.
     *
     * Usage:
     * ```
     * renderItem = ({index, ...rest}) => {
     * 	return (
     * 		<MyComponent index={index} {...rest} />
     * 	);
     * }
     * ```
     *
     * @type {Function}
     * @param {Object} event
     * @param {Number} event.data-index It is required for Spotlight 5-way navigation. Pass to the root element in the component.
     * @param {Number} event.index The index number of the component to render
     * @param {Number} event.key It MUST be passed as a prop to the root element in the component for DOM recycling.
     *
     * @required
     * @public
     */
    itemRenderer: _propTypes["default"].func.isRequired,

    /**
     * The render function for the items.
     *
     * @type {Function}
     * @required
     * @private
     */
    itemsRenderer: _propTypes["default"].func.isRequired,

    /**
     * Callback method of scrollTo.
     * Normally, [Scrollable]{@link ui/Scrollable.Scrollable} should set this value.
     *
     * @type {Function}
     * @private
     */
    cbScrollTo: _propTypes["default"].func,

    /**
     * Size of the data.
     *
     * @type {Number}
     * @default 0
     * @public
     */
    dataSize: _propTypes["default"].number,

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
     * Passes the instance of [VirtualList]{@link ui/VirtualList.VirtualList}.
     *
     * @type {Object}
     * @param {Object} ref
     * @private
     */
    initUiChildRef: _propTypes["default"].func,

    /**
     * Prop to check if horizontal Scrollbar exists or not.
     *
     * @type {Boolean}
     * @private
     */
    isHorizontalScrollbarVisible: _propTypes["default"].bool,

    /**
     * Prop to check if vertical Scrollbar exists or not.
     *
     * @type {Boolean}
     * @private
     */
    isVerticalScrollbarVisible: _propTypes["default"].bool,

    /**
     * The array for individually sized items.
     *
     * @type {Number[]}
     * @private
     */
    itemSizes: _propTypes["default"].array,

    /**
     * It scrolls by page when `true`, by item when `false`.
     *
     * @type {Boolean}
     * @default false
     * @private
     */
    pageScroll: _propTypes["default"].bool,

    /**
     * The ARIA role for the list.
     *
     * @type {String}
     * @default 'list'
     * @public
     */
    role: _propTypes["default"].string,

    /**
     * `true` if rtl, `false` if ltr.
     * Normally, [Scrollable]{@link ui/Scrollable.Scrollable} should set this value.
     *
     * @type {Boolean}
     * @private
     */
    rtl: _propTypes["default"].bool,

    /**
     * Spacing between items.
     *
     * @type {Number}
     * @default 0
     * @public
     */
    spacing: _propTypes["default"].number,

    /**
     * Spotlight Id. It would be the same with [Scrollable]{@link ui/Scrollable.Scrollable}'s.
     *
     * @type {String}
     * @private
     */
    spotlightId: _propTypes["default"].string,

    /**
     * When it's `true` and the spotlight focus cannot move to the given direction anymore by 5-way keys,
     * a list is scrolled with an animation to the other side and the spotlight focus moves in wraparound manner.
     *
     * When it's `'noAnimation'`, the spotlight focus moves in wraparound manner as same as when it's `true`
     * except that a list is scrolled without an animation.
     *
     * @type {Boolean|String}
     * @default false
     * @public
     */
    wrap: _propTypes["default"].oneOfType([_propTypes["default"].bool, _propTypes["default"].oneOf(['noAnimation'])])
  }, _class.defaultProps = {
    dataSize: 0,
    focusableScrollbar: false,
    pageScroll: false,
    spacing: 0,
    wrap: false
  }, _temp;
};
/**
 * A Moonstone-styled base component for [VirtualList]{@link moonstone/VirtualList.VirtualList} and
 * [VirtualGridList]{@link moonstone/VirtualList.VirtualGridList}.
 *
 * @class VirtualListBase
 * @memberof moonstone/VirtualList
 * @extends ui/VirtualList.VirtualListBase
 * @ui
 * @public
 */


var VirtualListBase = VirtualListBaseFactory(JS);
exports.VirtualListBase = VirtualListBase;
VirtualListBase.displayName = 'VirtualListBase';
/**
 * A Moonstone-styled base component for [VirtualListNative]{@link moonstone/VirtualList.VirtualListNative} and
 * [VirtualGridListNative]{@link moonstone/VirtualList.VirtualGridListNative}.
 *
 * @class VirtualListBaseNative
 * @memberof moonstone/VirtualList
 * @extends ui/VirtualList.VirtualListBaseNative
 * @ui
 * @private
 */

var VirtualListBaseNative = VirtualListBaseFactory(Native);
exports.VirtualListBaseNative = VirtualListBaseNative;
VirtualListBaseNative.displayName = 'VirtualListBaseNative';
/**
 * Allows 5-way navigation to the scrollbar controls. By default, 5-way will
 * not move focus to the scrollbar controls.
 *
 * @name focusableScrollbar
 * @memberof moonstone/VirtualList.VirtualListBase.prototype
 * @type {Boolean}
 * @default false
 * @public
 */

/**
 * Unique identifier for the component.
 *
 * When defined and when the `VirtualList` is within a [Panel]{@link moonstone/Panels.Panel},
 * the `VirtualList` will store its scroll position and restore that position when returning to
 * the `Panel`.
 *
 * @name id
 * @memberof moonstone/VirtualList.VirtualListBase.prototype
 * @type {String}
 * @public
 */

/**
 * Sets the hint string read when focusing the next button in the vertical scroll bar.
 *
 * @name scrollDownAriaLabel
 * @memberof moonstone/VirtualList.VirtualListBase.prototype
 * @type {String}
 * @default $L('scroll down')
 * @public
 */

/**
 * Sets the hint string read when focusing the previous button in the horizontal scroll bar.
 *
 * @name scrollLeftAriaLabel
 * @memberof moonstone/VirtualList.VirtualListBase.prototype
 * @type {String}
 * @default $L('scroll left')
 * @public
 */

/**
 * Sets the hint string read when focusing the next button in the horizontal scroll bar.
 *
 * @name scrollRightAriaLabel
 * @memberof moonstone/VirtualList.VirtualListBase.prototype
 * @type {String}
 * @default $L('scroll right')
 * @public
 */

/**
 * Sets the hint string read when focusing the previous button in the vertical scroll bar.
 *
 * @name scrollUpAriaLabel
 * @memberof moonstone/VirtualList.VirtualListBase.prototype
 * @type {String}
 * @default $L('scroll up')
 * @public
 */

/* eslint-disable enact/prop-types */

var listItemsRenderer = function listItemsRenderer(props) {
  var cc = props.cc,
      handlePlaceholderFocus = props.handlePlaceholderFocus,
      initUiItemContainerRef = props.itemContainerRef,
      needsScrollingPlaceholder = props.needsScrollingPlaceholder,
      primary = props.primary,
      role = props.role;
  return _react["default"].createElement(_react["default"].Fragment, null, cc.length ? _react["default"].createElement("div", {
    ref: initUiItemContainerRef,
    role: role
  }, cc) : null, primary ? null : _react["default"].createElement(SpotlightPlaceholder, {
    "data-index": 0,
    "data-vl-placeholder": true // a zero width/height element can't be focused by spotlight so we're giving
    // the placeholder a small size to ensure it is navigable
    ,
    style: {
      width: 10
    },
    onFocus: handlePlaceholderFocus
  }), needsScrollingPlaceholder ? _react["default"].createElement(SpotlightPlaceholder, null) : null);
};
/* eslint-enable enact/prop-types */


var ScrollableVirtualList = function ScrollableVirtualList(_ref10) {
  var role = _ref10.role,
      rest = _objectWithoutProperties(_ref10, ["role"]);

  // eslint-disable-line react/jsx-no-bind
  process.env.NODE_ENV !== "production" ? (0, _warning["default"])(!rest.itemSizes || !rest.cbScrollTo, 'VirtualList with `minSize` in `itemSize` prop does not support `cbScrollTo` prop') : void 0;
  return _react["default"].createElement(_Scrollable.Scrollable, Object.assign({}, rest, {
    childRenderer: function childRenderer(childProps) {
      return (// eslint-disable-line react/jsx-no-bind
        _react["default"].createElement(VirtualListBase, Object.assign({}, childProps, {
          focusableScrollbar: rest.focusableScrollbar,
          itemsRenderer: listItemsRenderer,
          role: role
        }))
      );
    }
  }));
};

exports.ScrollableVirtualList = ScrollableVirtualList;
ScrollableVirtualList.propTypes =
/** @lends moonstone/VirtualList.VirtualListBase.prototype */
{
  cbScrollTo: _propTypes["default"].func,
  direction: _propTypes["default"].oneOf(['horizontal', 'vertical']),
  focusableScrollbar: _propTypes["default"].bool,
  itemSizes: _propTypes["default"].array,
  preventBubblingOnKeyDown: _propTypes["default"].oneOf(['none', 'programmatic']),
  role: _propTypes["default"].string
};
ScrollableVirtualList.defaultProps = {
  direction: 'vertical',
  focusableScrollbar: false,
  preventBubblingOnKeyDown: 'programmatic',
  role: 'list'
};

var ScrollableVirtualListNative = function ScrollableVirtualListNative(_ref11) {
  var role = _ref11.role,
      rest = _objectWithoutProperties(_ref11, ["role"]);

  process.env.NODE_ENV !== "production" ? (0, _warning["default"])(!rest.itemSizes || !rest.cbScrollTo, 'VirtualList with `minSize` in `itemSize` prop does not support `cbScrollTo` prop') : void 0;
  return _react["default"].createElement(_ScrollableNative["default"], Object.assign({}, rest, {
    childRenderer: function childRenderer(childProps) {
      return (// eslint-disable-line react/jsx-no-bind
        _react["default"].createElement(VirtualListBaseNative, Object.assign({}, childProps, {
          focusableScrollbar: rest.focusableScrollbar,
          itemsRenderer: listItemsRenderer,
          role: role
        }))
      );
    }
  }));
};

exports.ScrollableVirtualListNative = ScrollableVirtualListNative;
ScrollableVirtualListNative.propTypes =
/** @lends moonstone/VirtualList.VirtualListBaseNative.prototype */
{
  cbScrollTo: _propTypes["default"].func,
  direction: _propTypes["default"].oneOf(['horizontal', 'vertical']),
  focusableScrollbar: _propTypes["default"].bool,
  itemSizes: _propTypes["default"].array,
  preventBubblingOnKeyDown: _propTypes["default"].oneOf(['none', 'programmatic']),
  role: _propTypes["default"].string
};
ScrollableVirtualListNative.defaultProps = {
  direction: 'vertical',
  focusableScrollbar: false,
  preventBubblingOnKeyDown: 'programmatic',
  role: 'list'
};
var _default = VirtualListBase;
exports["default"] = _default;