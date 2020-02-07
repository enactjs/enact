"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
Object.defineProperty(exports, "Expandable", {
  enumerable: true,
  get: function get() {
    return _Expandable["default"];
  }
});
exports.ExpandableItemBase = exports.ExpandableItem = exports["default"] = void 0;

var _handle = _interopRequireWildcard(require("@enact/core/handle"));

var _keymap = require("@enact/core/keymap");

var _kind = _interopRequireDefault(require("@enact/core/kind"));

var _util = require("@enact/core/util");

var _container = require("@enact/spotlight/src/container");

var _target = require("@enact/spotlight/src/target");

var _SpotlightContainerDecorator = _interopRequireDefault(require("@enact/spotlight/SpotlightContainerDecorator"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _last = _interopRequireDefault(require("ramda/src/last"));

var _react = _interopRequireDefault(require("react"));

var _LabeledItem = _interopRequireDefault(require("../LabeledItem"));

var _util2 = require("../internal/util");

var _Expandable = _interopRequireDefault(require("./Expandable"));

var _ExpandableTransitionContainer = _interopRequireDefault(require("./ExpandableTransitionContainer"));

var _ExpandableItemModule = _interopRequireDefault(require("./ExpandableItem.module.css"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj["default"] = obj; return newObj; } }

function _objectWithoutProperties(source, excluded) { if (source == null) return {}; var target = _objectWithoutPropertiesLoose(source, excluded); var key, i; if (Object.getOwnPropertySymbols) { var sourceSymbolKeys = Object.getOwnPropertySymbols(source); for (i = 0; i < sourceSymbolKeys.length; i++) { key = sourceSymbolKeys[i]; if (excluded.indexOf(key) >= 0) continue; if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue; target[key] = source[key]; } } return target; }

function _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }

var isUp = (0, _keymap.is)('up');
var isDown = (0, _keymap.is)('down');
var ContainerDiv = (0, _SpotlightContainerDecorator["default"])({
  continue5WayHold: true
}, 'div'); // Returns `true` if a directional movement would leave the same container as `srcNode` is in.
// For a more generalized implementation, there'd need to be some way to specify an upper-most
// container for dealing with cases of components that are themselves wrapped in containers.

function wouldDirectionLeaveContainer(dir, srcNode) {
  var target = (0, _target.getTargetByDirectionFromElement)(dir, srcNode); // If there's no target in the direction we won't move

  if (!target) {
    return false;
  }

  var targetContainer = (0, _last["default"])((0, _container.getContainersForNode)(target));
  var srcContainer = (0, _last["default"])((0, _container.getContainersForNode)(srcNode));
  return targetContainer !== srcContainer;
}
/**
 * A stateless component that renders a {@link moonstone/LabeledItem.LabeledItem} that can be
 * expanded to show additional contents.
 *
 * @class ExpandableItemBase
 * @memberof moonstone/ExpandableItem
 * @ui
 * @public
 */


var ExpandableItemBase = (0, _kind["default"])({
  name: 'ExpandableItem',
  propTypes:
  /** @lends moonstone/ExpandableItem.ExpandableItemBase.prototype */
  {
    /**
     * The primary text of the item.
     *
     * @type {String}
     * @required
     * @public
     */
    title: _propTypes["default"].string.isRequired,

    /**
     * Closes the expandable automatically when the user navigates to the `title`
     * of the component using 5-way controls; if `false`, the user must select/tap the title to
     * close the expandable.
     *
     * @type {Boolean}
     * @default false
     * @public
     */
    autoClose: _propTypes["default"].bool,

    /**
     * The contents of the expandable item displayed when `open` is `true`.
     *
     * @type {Node}
     * @public
     */
    children: _propTypes["default"].node,

    /**
     * Disables voice control.
     *
     * @type {Boolean}
     * @memberof moonstone/ExpandableItem.ExpandableItemBase.prototype
     * @public
     */
    'data-webos-voice-disabled': _propTypes["default"].bool,

    /**
     * The voice control group.
     *
     * @type {String}
     * @memberof moonstone/ExpandableItem.ExpandableItemBase.prototype
     * @public
     */
    'data-webos-voice-group-label': _propTypes["default"].string,

    /**
     * The voice control intent.
     *
     * @type {String}
     * @memberof moonstone/ExpandableItem.ExpandableItemBase.prototype
     * @public
     */
    'data-webos-voice-intent': _propTypes["default"].string,

    /**
     * The voice control label.
     *
     * @type {String}
     * @memberof moonstone/ExpandableItem.ExpandableItemBase.prototype
     * @public
     */
    'data-webos-voice-label': _propTypes["default"].string,

    /**
     * Disables ExpandableItem and the control becomes non-interactive.
     *
     * @type {Boolean}
     * @default false
     * @public
     */
    disabled: _propTypes["default"].bool,

    /**
     * Prevents rendering the transition container.
     *
     * @type {Boolean}
     * @default false
     * @private
     */
    hideChildren: _propTypes["default"].bool,

    /**
     * The secondary, or supportive text. Typically under the `title`, a subtitle.
     *
     * @type {Node}
     * @public
     */
    label: _propTypes["default"].node,

    /**
     * Prevents the user from moving [Spotlight] {@link /docs/developer-guide/glossary/#spotlight} past the bottom
     * of the expandable (when open) using 5-way controls.
     *
     * @type {Boolean}
     * @default false
     * @public
     */
    lockBottom: _propTypes["default"].bool,

    /**
     * Text to display when no `label` or `value` is set.
     *
     * @type {String}
     */
    noneText: _propTypes["default"].string,

    /**
     * Called when a condition occurs which should cause the expandable to close.
     *
     * @type {Function}
     * @public
     */
    onClose: _propTypes["default"].func,

    /**
     * Called when the expandable closes.
     *
     * @type {Function}
     * @private
     */
    onHide: _propTypes["default"].func,

    /**
     * Called when a condition occurs which should cause the expandable to open.
     *
     * @type {Function}
     * @public
     */
    onOpen: _propTypes["default"].func,

    /**
     * Called when the expandable opens.
     *
     * @type {Function}
     * @private
     */
    onShow: _propTypes["default"].func,

    /**
     * Called when the component is removed while retaining focus.
     *
     * @type {Function}
     * @param {Object} event
     * @public
     */
    onSpotlightDisappear: _propTypes["default"].func,

    /**
     * Called prior to focus leaving the expandable when the 5-way down key is pressed.
     *
     * @type {Function}
     * @param {Object} event
     * @public
     */
    onSpotlightDown: _propTypes["default"].func,

    /**
     * Called prior to focus leaving the expandable when the 5-way left key is pressed.
     *
     * @type {Function}
     * @param {Object} event
     * @public
     */
    onSpotlightLeft: _propTypes["default"].func,

    /**
     * Called prior to focus leaving the expandable when the 5-way right key is pressed.
     *
     * @type {Function}
     * @param {Object} event
     * @public
     */
    onSpotlightRight: _propTypes["default"].func,

    /**
     * Called prior to focus leaving the expandable when the 5-way up key is pressed.
     *
     * @type {Function}
     * @param {Object} event
     * @public
     */
    onSpotlightUp: _propTypes["default"].func,

    /**
     * Opens ExpandableItem with the contents visible.
     *
     * @type {Boolean}
     * @default false
     * @public
     */
    open: _propTypes["default"].bool,

    /**
     * Sets a reference to the root container node of the ExpandableItem.
     *
     * @type {Function}
     * @private
     */
    setContainerNode: _propTypes["default"].func,

    /**
     * Controls when `label` is shown.
     *
     * * `'always'` - The label is always visible
     * * `'never'` - The label is never visible
     * * `'auto'` - The label is visible when the expandable is closed
     *
     * @type {String}
     * @default 'auto'
     * @public
     */
    showLabel: _propTypes["default"].oneOf(['always', 'never', 'auto']),

    /**
     * Disables spotlight navigation into the component.
     *
     * @type {Boolean}
     * @default false
     * @public
     */
    spotlightDisabled: _propTypes["default"].bool
  },
  defaultProps: {
    'data-webos-voice-intent': 'Select',
    autoClose: false,
    disabled: false,
    lockBottom: false,
    open: false,
    showLabel: 'auto',
    spotlightDisabled: false
  },
  handlers: {
    handleKeyDown: function handleKeyDown(ev, _ref) {
      var autoClose = _ref.autoClose,
          lockBottom = _ref.lockBottom,
          onClose = _ref.onClose,
          onSpotlightDown = _ref.onSpotlightDown;

      if (autoClose || lockBottom || onSpotlightDown) {
        var keyCode = ev.keyCode,
            target = ev.target; // Basing first/last child on the parent of the target to support both the use
        // case here in which the children of the container are spottable and the
        // ExpandableList use case which has an intermediate child (Group) between the
        // spottable components and the container.

        if (autoClose && onClose && isUp(keyCode) && wouldDirectionLeaveContainer('up', target)) {
          onClose();
          ev.nativeEvent.stopImmediatePropagation();
          ev.preventDefault();
        } else if (isDown(keyCode) && wouldDirectionLeaveContainer('down', target)) {
          if (lockBottom) {
            ev.nativeEvent.stopImmediatePropagation();
            ev.preventDefault();
          } else if (onSpotlightDown) {
            onSpotlightDown(ev);
          }
        }
      }
    },
    handleLabelKeyDown: function handleLabelKeyDown(ev, _ref2) {
      var onSpotlightDown = _ref2.onSpotlightDown,
          open = _ref2.open;

      if (isDown(ev.keyCode) && !open && onSpotlightDown) {
        onSpotlightDown(ev);
      }
    },
    handleOpen: (0, _handle["default"])((0, _handle.forProp)('disabled', false), (0, _handle.oneOf)([(0, _handle.forProp)('open', true), (0, _handle.forward)('onClose')], [_handle.returnsTrue, (0, _handle.forward)('onOpen')]))
  },
  styles: {
    css: _ExpandableItemModule["default"],
    className: 'expandableItem'
  },
  computed: {
    className: function className(_ref3) {
      var disabled = _ref3.disabled,
          label = _ref3.label,
          noneText = _ref3.noneText,
          open = _ref3.open,
          showLabel = _ref3.showLabel,
          styler = _ref3.styler;
      return styler.append({
        open: open && !disabled,
        autoLabel: showLabel === 'auto' && (label || noneText)
      });
    },
    label: function label(_ref4) {
      var _label = _ref4.label,
          noneText = _ref4.noneText;
      return _label || noneText;
    },
    labeledItemClassName: function labeledItemClassName(_ref5) {
      var showLabel = _ref5.showLabel,
          styler = _ref5.styler;
      return styler.join(_ExpandableItemModule["default"].labeledItem, _ExpandableItemModule["default"][showLabel]);
    },
    open: function open(_ref6) {
      var disabled = _ref6.disabled,
          _open = _ref6.open;
      return _open && !disabled;
    },
    transitionSpotlightDisabled: function transitionSpotlightDisabled(_ref7) {
      var open = _ref7.open,
          spotlightDisabled = _ref7.spotlightDisabled;
      return spotlightDisabled || !open;
    }
  },
  render: function render(_ref8) {
    var children = _ref8.children,
        disabled = _ref8.disabled,
        handleKeyDown = _ref8.handleKeyDown,
        handleLabelKeyDown = _ref8.handleLabelKeyDown,
        handleOpen = _ref8.handleOpen,
        hideChildren = _ref8.hideChildren,
        label = _ref8.label,
        labeledItemClassName = _ref8.labeledItemClassName,
        open = _ref8.open,
        onHide = _ref8.onHide,
        onShow = _ref8.onShow,
        onSpotlightDisappear = _ref8.onSpotlightDisappear,
        onSpotlightLeft = _ref8.onSpotlightLeft,
        onSpotlightRight = _ref8.onSpotlightRight,
        onSpotlightUp = _ref8.onSpotlightUp,
        setContainerNode = _ref8.setContainerNode,
        spotlightDisabled = _ref8.spotlightDisabled,
        title = _ref8.title,
        transitionSpotlightDisabled = _ref8.transitionSpotlightDisabled,
        rest = _objectWithoutProperties(_ref8, ["children", "disabled", "handleKeyDown", "handleLabelKeyDown", "handleOpen", "hideChildren", "label", "labeledItemClassName", "open", "onHide", "onShow", "onSpotlightDisappear", "onSpotlightLeft", "onSpotlightRight", "onSpotlightUp", "setContainerNode", "spotlightDisabled", "title", "transitionSpotlightDisabled"]);

    delete rest.autoClose;
    delete rest.lockBottom;
    delete rest.noneText;
    delete rest.onClose;
    delete rest.onOpen;
    delete rest.onSpotlightDown;
    delete rest.showLabel;
    var ariaProps = (0, _util.extractAriaProps)(rest);
    var voiceProps = (0, _util2.extractVoiceProps)(rest);
    return _react["default"].createElement(ContainerDiv, Object.assign({}, rest, {
      "aria-disabled": disabled,
      ref: setContainerNode,
      spotlightDisabled: spotlightDisabled
    }), _react["default"].createElement(_LabeledItem["default"], Object.assign({}, ariaProps, voiceProps, {
      css: _ExpandableItemModule["default"],
      className: labeledItemClassName,
      "data-expandable-label": true,
      disabled: disabled,
      label: label,
      onTap: handleOpen,
      onKeyDown: handleLabelKeyDown,
      onSpotlightDisappear: onSpotlightDisappear,
      onSpotlightLeft: onSpotlightLeft,
      onSpotlightRight: onSpotlightRight,
      onSpotlightUp: onSpotlightUp,
      spotlightDisabled: spotlightDisabled,
      titleIcon: "arrowlargedown"
    }), title), !hideChildren ? _react["default"].createElement(_ExpandableTransitionContainer["default"], {
      "data-expandable-container": true,
      duration: "short",
      timingFunction: "ease-out-quart",
      onHide: onHide,
      onKeyDown: handleKeyDown,
      onShow: onShow,
      spotlightDisabled: transitionSpotlightDisabled,
      type: "clip",
      direction: "down",
      visible: open
    }, children) : null);
  }
});
/**
 * A component that renders a {@link moonstone/LabeledItem.LabeledItem} that can be expanded to
 * show additional contents.
 *
 * `ExpandableItem` maintains its open/closed state by default. The initial state can be supplied
 * using `defaultOpen`. In order to directly control the open/closed state, supply a value for
 * `open` at creation time and update its value in response to `onClose`/`onOpen` events.
 *
 * @class ExpandableItem
 * @memberof moonstone/ExpandableItem
 * @extends moonstone/ExpandableItem.ExpandableItemBase
 * @ui
 * @mixes moonstone/ExpandableItem.Expandable
 * @public
 */

exports.ExpandableItemBase = ExpandableItemBase;
var ExpandableItem = (0, _Expandable["default"])(ExpandableItemBase);
exports.ExpandableItem = ExpandableItem;
var _default = ExpandableItem;
exports["default"] = _default;