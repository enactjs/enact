"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ExpandableListBase = exports.ExpandableList = exports["default"] = void 0;

var _Changeable = require("@enact/ui/Changeable");

var _propTypes = _interopRequireDefault(require("@enact/core/internal/prop-types"));

var _equals = _interopRequireDefault(require("ramda/src/equals"));

var _Group = _interopRequireDefault(require("@enact/ui/Group"));

var _kind = _interopRequireDefault(require("@enact/core/kind"));

var _Pure = _interopRequireDefault(require("@enact/ui/internal/Pure"));

var _react = _interopRequireDefault(require("react"));

var _propTypes2 = _interopRequireDefault(require("prop-types"));

var _CheckboxItem = _interopRequireDefault(require("../CheckboxItem"));

var _ExpandableItem = require("../ExpandableItem");

var _RadioItem = _interopRequireDefault(require("../RadioItem"));

var _Skinnable = require("../Skinnable");

var _ExpandableListModule = _interopRequireDefault(require("./ExpandableList.module.css"));

var _Expandable = require("../ExpandableItem/Expandable");

var _Skinnable2 = require("@enact/ui/Skinnable/Skinnable");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { _defineProperty(target, key, source[key]); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _objectWithoutProperties(source, excluded) { if (source == null) return {}; var target = _objectWithoutPropertiesLoose(source, excluded); var key, i; if (Object.getOwnPropertySymbols) { var sourceSymbolKeys = Object.getOwnPropertySymbols(source); for (i = 0; i < sourceSymbolKeys.length; i++) { key = sourceSymbolKeys[i]; if (excluded.indexOf(key) >= 0) continue; if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue; target[key] = source[key]; } } return target; }

function _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

var compareChildren = function compareChildren(a, b) {
  if (!a || !b || a.length !== b.length) return false;
  var type = null;

  for (var i = 0; i < a.length; i++) {
    type = type || _typeof(a[i]);

    if (type === 'string') {
      if (a[i] !== b[i]) {
        return false;
      }
    } else if (!(0, _equals["default"])(a[i], b[i])) {
      return false;
    }
  }

  return true;
};

var PureGroup = (0, _Pure["default"])({
  propComparators: {
    children: compareChildren,
    itemProps: function itemProps(a, b) {
      return a.onSpotlightDisappear === b.onSpotlightDisappear && a.onSpotlightLeft === b.onSpotlightLeft && a.onSpotlightRight === b.onSpotlightRight && a.spotlightDisabled === b.spotlightDisabled;
    }
  }
}, _Group["default"]);
/**
 * A stateless component that renders a {@link moonstone/LabeledItem.LabeledItem} that can be
 * expanded to show a selectable list of items.
 *
 * @class ExpandableListBase
 * @memberof moonstone/ExpandableList
 * @extends moonstone/ExpandableItem.ExpandableItemBase
 * @ui
 * @public
 */

var ExpandableListBase = (0, _kind["default"])({
  name: 'ExpandableList',
  propTypes:
  /** @lends moonstone/ExpandableList.ExpandableListBase.prototype */
  {
    /**
     * The items to be displayed in the list. This supports two data types. If an array of
     * strings is provided, the strings will be used in the generated components as the readable
     * text. If an array of objects is provided, each object will be spread onto the generated
     * component with no interpretation. You'll be responsible for setting properties like
     * `disabled`, `className`, and setting the content using `children`.
     *
     * NOTE: When providing an array of objects be sure a unique `key` is assigned to each
     * item. [Read about keys](https://reactjs.org/docs/lists-and-keys.html#keys) for more
     * information.
     *
     * @type {String[]|Array.<{key: (Number|String), children: (String|Component)}>}
     * @required
     * @public
     */
    children: _propTypes2["default"].oneOfType([_propTypes2["default"].arrayOf(_propTypes2["default"].string), _propTypes2["default"].arrayOf(_propTypes2["default"].shape({
      children: _propTypes["default"].renderable.isRequired,
      key: _propTypes2["default"].oneOfType([_propTypes2["default"].string, _propTypes2["default"].number]).isRequired
    }))]).isRequired,

    /**
     * The primary text of the item.
     *
     * @type {String}
     * @required
     * @public
     */
    title: _propTypes2["default"].string.isRequired,

    /**
     * When `true` and `select` is not `'multiple'`, the expandable will be closed when an item
     * is selected.
     *
     * @type {Boolean}
     * @public
     */
    closeOnSelect: _propTypes2["default"].bool,

    /**
     * Disables voice control.
     *
     * @type {Boolean}
     * @public
     */
    'data-webos-voice-disabled': _propTypes2["default"].bool,

    /**
     * Disables ExpandableList and the control becomes non-interactive.
     *
     * @type {Boolean}
     * @public
     */
    disabled: _propTypes2["default"].bool,

    /**
     * The secondary, or supportive text. Typically under the `title`, a subtitle. If omitted,
     * the label will be generated as a comma-separated list of the selected items.
     *
     * @type {Node}
     * @default null
     * @public
     */
    label: _propTypes2["default"].node,

    /**
     * Keeps the expandable open when the user navigates to the `title` of the component using
     * 5-way controls and the user must select/tap the title to close the expandable.
     *
     * This does not affect `closeOnSelect`.
     *
     * @type {Boolean}
     * @default false
     * @public
     */
    noAutoClose: _propTypes2["default"].bool,

    /**
     * Allows the user to move [Spotlight] {@link /docs/developer-guide/glossary/#spotlight} past the bottom of the expandable
     * (when open) using 5-way controls.
     *
     * @type {Boolean}
     * @default false
     * @public
     */
    noLockBottom: _propTypes2["default"].bool,

    /**
     * Text to display when no `label` is set.
     *
     * @type {String}
     */
    noneText: _propTypes2["default"].string,

    /**
     * Called when the expandable is closing. Also called when selecting an item if
     * `closeOnSelect` is `true`.
     *
     * @type {Function}
     * @public
     */
    onClose: _propTypes2["default"].func,

    /**
     * Called when the expandable is opening.
     *
     * @type {Function}
     * @public
     */
    onOpen: _propTypes2["default"].func,

    /**
     * Called when an item is selected.
     *
     * @type {Function}
     * @public
     */
    onSelect: _propTypes2["default"].func,

    /**
     * Called when the component is removed while retaining focus.
     *
     * @type {Function}
     * @param {Object} event
     * @public
     */
    onSpotlightDisappear: _propTypes2["default"].func,

    /**
     * Called prior to focus leaving the expandable when the 5-way left key is pressed.
     *
     * @type {Function}
     * @param {Object} event
     * @public
     */
    onSpotlightLeft: _propTypes2["default"].func,

    /**
     * Called prior to focus leaving the expandable when the 5-way right key is pressed.
     *
     * @type {Function}
     * @param {Object} event
     * @public
     */
    onSpotlightRight: _propTypes2["default"].func,

    /**
     * Opens the expandable with its contents visible.
     *
     * @type {Boolean}
     * @public
     */
    open: _propTypes2["default"].bool,

    /**
     * Selection mode for the list.
     *
     * * `'single'` - Allows for 0 or 1 item to be selected. The selected item may be deselected.
     * * `'radio'` - Allows for 0 or 1 item to be selected. The selected item may only be
     *    deselected by selecting another item.
     * * `'multiple'` - Allows 0 to _n_ items to be selected. Each item may be selected or
     *    deselected.
     *
     * @type {String}
     * @default 'single'
     * @public
     */
    select: _propTypes2["default"].oneOf(['single', 'radio', 'multiple']),

    /**
     * Index or array of indices of the selected item(s).
     *
     * @type {Number|Number[]}
     * @public
     */
    selected: _propTypes2["default"].oneOfType([_propTypes2["default"].number, _propTypes2["default"].arrayOf(_propTypes2["default"].number)]),

    /**
     * Disables spotlight navigation into the component.
     *
     * @type {Boolean}
     * @default false
     * @public
     */
    spotlightDisabled: _propTypes2["default"].bool
  },
  defaultProps: {
    select: 'radio',
    spotlightDisabled: false
  },
  handlers: {
    onSelect: function onSelect(ev, _ref) {
      var closeOnSelect = _ref.closeOnSelect,
          onClose = _ref.onClose,
          _onSelect = _ref.onSelect,
          select = _ref.select;

      // Call onClose if closeOnSelect is enabled and not selecting multiple
      if (closeOnSelect && onClose && select !== 'multiple') {
        onClose();
      }

      if (_onSelect) {
        _onSelect(ev);
      }
    }
  },
  styles: {
    css: _ExpandableListModule["default"],
    className: 'expandableList'
  },
  computed: {
    'aria-multiselectable': function ariaMultiselectable(_ref2) {
      var select = _ref2.select;
      return select === 'multiple';
    },
    disabled: function disabled(_ref3) {
      var children = _ref3.children,
          _disabled = _ref3.disabled;
      return _disabled || !children || children.length === 0;
    },
    itemProps: function itemProps(_ref4) {
      var voiceDisabled = _ref4['data-webos-voice-disabled'],
          onSpotlightDisappear = _ref4.onSpotlightDisappear,
          onSpotlightLeft = _ref4.onSpotlightLeft,
          onSpotlightRight = _ref4.onSpotlightRight,
          spotlightDisabled = _ref4.spotlightDisabled;
      return {
        className: _ExpandableListModule["default"].listItem,
        onSpotlightDisappear: onSpotlightDisappear,
        onSpotlightLeft: onSpotlightLeft,
        onSpotlightRight: onSpotlightRight,
        spotlightDisabled: spotlightDisabled,
        'data-webos-voice-disabled': voiceDisabled
      };
    },
    // generate a label that concatenates the text of the selected items
    label: function label(_ref5) {
      var children = _ref5.children,
          _label = _ref5.label,
          select = _ref5.select,
          selected = _ref5.selected;

      if (_label) {
        return _label;
      } else if (children.length && (selected || selected === 0)) {
        var firstSelected = Array.isArray(selected) ? selected[0] : selected;

        if (select === 'multiple' && Array.isArray(selected)) {
          return selected.map(function (i) {
            return _typeof(children[i]) === 'object' ? children[i].children : children[i];
          }).filter(function (str) {
            return !!str;
          }).join(', ');
        } else if (_typeof(children[firstSelected]) === 'object') {
          return children[firstSelected].children;
        } else {
          return children[firstSelected];
        }
      }
    },
    // Selects the appropriate list item based on the selection mode
    ListItem: function ListItem(_ref6) {
      var select = _ref6.select;
      return (select === 'radio' || select === 'single') && _RadioItem["default"] || _CheckboxItem["default"]; // for single or multiple
    },
    role: function role(_ref7) {
      var select = _ref7.select;
      return select === 'radio' ? 'radiogroup' : 'group';
    },
    selected: function selected(_ref8) {
      var select = _ref8.select,
          _selected = _ref8.selected;
      return select === 'single' && Array.isArray(_selected) ? _selected[0] : _selected;
    }
  },
  render: function render(_ref9) {
    var children = _ref9.children,
        itemProps = _ref9.itemProps,
        ListItem = _ref9.ListItem,
        noAutoClose = _ref9.noAutoClose,
        noLockBottom = _ref9.noLockBottom,
        onSelect = _ref9.onSelect,
        select = _ref9.select,
        selected = _ref9.selected,
        rest = _objectWithoutProperties(_ref9, ["children", "itemProps", "ListItem", "noAutoClose", "noLockBottom", "onSelect", "select", "selected"]);

    delete rest.closeOnSelect;
    return _react["default"].createElement(_ExpandableItem.ExpandableItemBase, Object.assign({}, rest, {
      showLabel: "auto",
      autoClose: !noAutoClose,
      lockBottom: !noLockBottom
    }), _react["default"].createElement(PureGroup, {
      childComponent: ListItem,
      childSelect: "onToggle",
      itemProps: itemProps,
      onSelect: onSelect,
      select: select,
      selected: selected,
      selectedProp: "selected"
    }, children));
  }
});
exports.ExpandableListBase = ExpandableListBase;

function ExpandableListDecorator(Wrapped) {
  var Component = _react["default"].memo(Wrapped);

  var useChange = (0, _Changeable.configureChange)({
    change: 'onSelect',
    prop: 'selected'
  });
  var useExpandable = (0, _Expandable.configureExpandable)({
    getChildFocusTarget: function getChildFocusTarget(node, _ref10) {
      var _ref10$selected = _ref10.selected,
          selected = _ref10$selected === void 0 ? 0 : _ref10$selected;
      var selectedIndex = selected;

      if (Array.isArray(selected) && selected.length) {
        selectedIndex = selected[0];
      }

      var selectedNode = null;

      if (node) {
        selectedNode = node.querySelector("[data-index=\"".concat(selectedIndex, "\"]"));
      }

      return selectedNode;
    }
  }); // eslint-disable-next-line no-shadow

  return function ExpandableListDecorator(props) {
    var _useSkinnable = (0, _Skinnable.useSkinnable)(props),
        parentSkin = _useSkinnable.parentSkin,
        parentVariants = _useSkinnable.parentVariants,
        rest = _objectWithoutProperties(_useSkinnable, ["parentSkin", "parentVariants"]);

    var updated = _objectSpread({}, props, useChange(props), useExpandable(props), rest);

    return _react["default"].createElement(_Skinnable2.SkinContext.Provider, {
      value: {
        parentSkin: parentSkin,
        parentVariants: parentVariants
      }
    }, _react["default"].createElement(Component, updated));
  };
}
/**
 * A component that renders a {@link moonstone/LabeledItem.LabeledItem} that can be expanded to
 * show a selectable list of items.
 *
 * By default, `ExpandableList` maintains the state of its `selected` property. Supply the
 * `defaultSelected` property to control its initial value. If you wish to directly control updates
 * to the component, supply a value to `selected` at creation time and update it in response to
 * `onChange` events.
 *
 * `ExpandableList` maintains its open/closed state by default. The initial state can be supplied
 * using `defaultOpen`. In order to directly control the open/closed state, supply a value for
 * `open` at creation time and update its value in response to `onClose`/`onOpen` events.
 *
 * @class ExpandableList
 * @memberof moonstone/ExpandableList
 * @extends moonstone/ExpandableList.ExpandableListBase
 * @mixes moonstone/ExpandableItem.Expandable
 * @mixes ui/Changeable.Changeable
 * @ui
 * @public
 */


var ExpandableList = ExpandableListDecorator(ExpandableListBase);
exports.ExpandableList = ExpandableList;
var _default = ExpandableList;
exports["default"] = _default;