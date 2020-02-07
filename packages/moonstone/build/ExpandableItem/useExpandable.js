"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.configureExpandable = configureExpandable;
exports.useExpandable = exports.defaultConfig = exports["default"] = void 0;

var _Cancelable = require("@enact/ui/Cancelable");

var _RadioDecorator = require("@enact/ui/RadioDecorator");

var _Toggleable = require("@enact/ui/Toggleable");

var _useDeferChildren = _interopRequireDefault(require("./useDeferChildren"));

var _useSpotlightActivator = require("./useSpotlightActivator");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { _defineProperty(target, key, source[key]); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

// TODO: This module may not doc correctly but we'll need to wait until our doc parsing script is
// ready

/**
 * Called by {@link ui/Cancelable.Cancelable} when a cancel event occurs and calls the
 * `onClose` handler provided by the wrapping Toggleable HOC.
 *
 * @param  {Object} props Current props object
 *
 * @returns {undefined}
 * @private
 */
var handleCancel = function handleCancel(ev, props) {
  if (props.open) {
    props.onClose();
    ev.stopPropagation();
  }
};
/**
 * Default config for {@link moonstone/ExpandableItem.Expandable}.
 *
 * @memberof moonstone/ExpandableItem.Expandable
 * @hocconfig
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
   * @memberof moonstone/ExpandableItem.Expandable.defaultConfig
   * @private
   */
  getChildFocusTarget: null,

  /**
   * When `true` and used in conjunction with `noAutoFocus` when `false`, the contents of the
   * container will receive spotlight focus expanded, even in pointer mode.
   *
   * @type {Boolean}
   * @default false
   * @memberof moonstone/ExpandableItem.Expandable.defaultConfig
   * @public
   */
  noPointerMode: false
};
/**
 * A higher-order component that manages the open state of a component and adds {@link ui/Cancelable.Cancelable}
 * support to call the `onClose` handler on
 * cancel.
 *
 * @class Expandable
 * @memberof moonstone/ExpandableItem
 * @mixes ui/Toggleable.Toggleable
 * @mixes ui/RadioDecorator.RadioDecorator
 * @mixes ui/Cancelable.Cancelable
 * @hoc
 * @public
 */

exports.defaultConfig = defaultConfig;

function configureExpandable(config) {
  var _defaultConfig$config = _objectSpread({}, defaultConfig, config),
      getChildFocusTarget = _defaultConfig$config.getChildFocusTarget,
      noPointerMode = _defaultConfig$config.noPointerMode;

  var useToggle = (0, _Toggleable.configureToggle)({
    toggle: null,
    activate: 'onOpen',
    deactivate: 'onClose',
    prop: 'open'
  });
  var useCancel = (0, _Cancelable.configureCancel)({
    component: 'span',
    onCancel: handleCancel
  });
  var useSpotlightActivator = (0, _useSpotlightActivator.configureSpotlightActivator)({
    noPointerMode: noPointerMode,
    getChildFocusTarget: getChildFocusTarget
  }); // eslint-disable-next-line no-shadow

  return function useExpandable(props) {
    var toggle = useToggle(props);
    var open = toggle.open && !props.disabled;
    var radio = (0, _RadioDecorator.useRadio)(open, toggle.onClose);
    var activator = useSpotlightActivator(props);
    return _objectSpread({}, useCancel(props), (0, _useDeferChildren["default"])(!open), {
      onClose: function onClose(ev) {
        activator.onClose();
        radio.deactivate();
        toggle.onClose(ev, props);
      },
      onHide: activator.onHide,
      onOpen: function onOpen(ev) {
        activator.onOpen();
        radio.activate();
        toggle.onOpen(ev, props);
      },
      onShow: activator.onShow,
      open: open,
      setContainerNode: activator.setContainerNode
    });
  };
}

var useExpandable = configureExpandable();
exports.useExpandable = useExpandable;
useExpandable.configure = configureExpandable;
var _default = useExpandable;
exports["default"] = _default;