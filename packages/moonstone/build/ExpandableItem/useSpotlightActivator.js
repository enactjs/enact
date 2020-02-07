"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.configureSpotlightActivator = configureSpotlightActivator;
exports.useSpotlightActivator = exports.defaultConfig = exports["default"] = void 0;

var _container = require("@enact/spotlight/src/container");

var _handle = require("@enact/core/handle");

var _spotlight = _interopRequireDefault(require("@enact/spotlight"));

var _Pause = require("@enact/spotlight/Pause");

var _react = _interopRequireDefault(require("react"));

var _reactDom = _interopRequireDefault(require("react-dom"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { _defineProperty(target, key, source[key]); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

/**
 * Default config for {@link mooonstone/ExpandableItem.ExpandableSpotlightDecorator}
 *
 * @memberof moonstone/ExpandableItem.ExpandableSpotlightDecorator
 * @hocconfig
 * @private
 */
var defaultConfig = {
  /**
   * Returns the child -- either a node or a CSS selector -- to focus after expanding.
   *
   * If this function is defined, it will be passed the container node and the current set of
   * props and should return either a node or a CSS selector to be passed to
   * {@link spotlight/Spotlight.focus}.
   *
   * @type {Function}
   * @default null
   * @memberof moonstone/ExpandableItem.ExpandableSpotlightDecorator.defaultConfig
   * @private
   */
  getChildFocusTarget: null,

  /**
   * When `true` and used in conjunction with `noAutoFocus` when `false`, the contents of the
   * container will receive spotlight focus expanded, even in pointer mode.
   *
   * @type {Boolean}
   * @default false
   * @memberof moonstone/ExpandableItem.ExpandableSpotlightDecorator.defaultConfig
   * @private
   */
  noPointerMode: false
};
/**
 * Restores spotlight focus to root container when closing the container if the previously focused
 * component is contained.
 *
 * @class ExpandableSpotlightDecorator
 * @memberof moonstone/ExpandableItem
 * @private
 */

exports.defaultConfig = defaultConfig;

function configureSpotlightActivator(config) {
  var _defaultConfig$config = _objectSpread({}, defaultConfig, config),
      getChildFocusTarget = _defaultConfig$config.getChildFocusTarget,
      noPointerMode = _defaultConfig$config.noPointerMode;

  function highlightContents(containerNode, props) {
    var current = _spotlight["default"].getCurrent();

    if (containerNode.contains(current) || document.activeElement === document.body) {
      var contents = containerNode.querySelector('[data-expandable-container]');

      if (contents && !props.noAutoFocus && !contents.contains(current)) {
        var focused = false; // Attempt to retrieve the Expandable-configured child focus target

        if (getChildFocusTarget) {
          var selectedNode = getChildFocusTarget(contents, props);

          if (selectedNode) {
            focused = _spotlight["default"].focus(selectedNode);
          }
        }

        if (!focused) {
          _spotlight["default"].focus(contents.dataset.spotlightId);
        }
      }
    }
  }

  function highlightLabeledItem(containerNode) {
    var current = _spotlight["default"].getCurrent();

    var label = containerNode.querySelector('[data-expandable-label]');
    if (current === label) return;

    if (containerNode.contains(current)) {
      if (_spotlight["default"].getPointerMode()) {
        // If we don't clear the focus, switching back to 5-way before focusing anything
        // will result in what appears to be lost focus
        current.blur();
      }

      _spotlight["default"].focus(label);
    } else {
      var containerIds = (0, _container.getContainersForNode)(label); // when focus is not within the expandable (due to a cancel event or the close
      // on blur from ExpandableInput, or some quick key presses), we need to fix the last
      // focused element config so that focus can be restored to the label rather than
      // spotlight getting lost.
      //
      // If there is focus or active container somewhere else, then we only need to fix
      // the nearest containers to the label that arent also containing the currently
      // focused element.

      var node = current || _spotlight["default"].getPointerMode() && (0, _container.getContainerNode)(_spotlight["default"].getActiveContainer());

      if (node) {
        var ids = (0, _container.getContainersForNode)(node);
        containerIds = containerIds.filter(function (id) {
          return !ids.includes(id);
        });
      }

      (0, _container.setContainerLastFocusedElement)(label, containerIds);
    }
  }

  function highlight(callback) {
    return function (ev, props, context) {
      if (_spotlight["default"].isPaused()) return;

      var pointerMode = _spotlight["default"].getPointerMode();

      var changePointerMode = pointerMode && noPointerMode;

      if (changePointerMode) {
        // we temporarily set pointer mode to `false` to ensure that focus is forced away
        // from the collapsing expandable.
        _spotlight["default"].setPointerMode(false);
      } // TODO: Fix ExpandableItem pass this to the native node
      // eslint-disable-next-line react/no-find-dom-node


      callback(_reactDom["default"].findDOMNode(context.containerNode.current), props);

      if (changePointerMode) {
        _spotlight["default"].setPointerMode(pointerMode);
      }
    };
  }

  var handlePause = function handlePause(ev, props, _ref) {
    var paused = _ref.paused;
    return paused.pause();
  };

  var handleResume = function handleResume(ev, props, _ref2) {
    var paused = _ref2.paused;
    return paused.resume();
  };

  var handleHide = (0, _handle.handle)(handleResume, highlight(highlightLabeledItem));
  var handleClose = (0, _handle.handle)(handlePause);
  var handleOpen = (0, _handle.handle)(handlePause);
  var handleShow = (0, _handle.handle)(handleResume, highlight(highlightContents)); // eslint-disable-next-line no-shadow

  return function useSpotlightActivator(props) {
    var paused = (0, _Pause.usePause)('useSpotlightActivator');

    var containerNode = _react["default"].useRef(null);

    var context = {
      paused: paused,
      containerNode: containerNode
    };
    return {
      onHide: function onHide(ev) {
        return handleHide(ev, props, context);
      },
      onShow: function onShow(ev) {
        return handleShow(ev, props, context);
      },
      onOpen: function onOpen(ev) {
        return handleOpen(ev, props, context);
      },
      onClose: function onClose(ev) {
        return handleClose(ev, props, context);
      },
      setContainerNode: containerNode
    };
  };
}

var useSpotlightActivator = configureSpotlightActivator();
exports.useSpotlightActivator = useSpotlightActivator;
useSpotlightActivator.config = configureSpotlightActivator;
var _default = useSpotlightActivator;
exports["default"] = _default;