"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.DropdownDecorator = exports.DropdownBase = exports.Dropdown = exports["default"] = void 0;

var _handle = require("@enact/core/handle");

var _kind = _interopRequireDefault(require("@enact/core/kind"));

var _propTypes = _interopRequireDefault(require("@enact/core/internal/prop-types"));

var _I18nDecorator = require("@enact/i18n/I18nDecorator");

var _Changeable = _interopRequireDefault(require("@enact/ui/Changeable"));

var _Pure = _interopRequireDefault(require("@enact/ui/internal/Pure"));

var _Toggleable = _interopRequireDefault(require("@enact/ui/Toggleable"));

var _propTypes2 = _interopRequireDefault(require("prop-types"));

var _ramda = require("ramda");

var _react = _interopRequireDefault(require("react"));

var _warning = _interopRequireDefault(require("warning"));

var _Button = _interopRequireDefault(require("../Button"));

var _ContextualPopupDecorator = _interopRequireDefault(require("../ContextualPopupDecorator"));

var _DropdownList = _interopRequireWildcard(require("./DropdownList"));

var _DropdownModule = _interopRequireDefault(require("./Dropdown.module.css"));

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj["default"] = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _objectWithoutProperties(source, excluded) { if (source == null) return {}; var target = _objectWithoutPropertiesLoose(source, excluded); var key, i; if (Object.getOwnPropertySymbols) { var sourceSymbolKeys = Object.getOwnPropertySymbols(source); for (i = 0; i < sourceSymbolKeys.length; i++) { key = sourceSymbolKeys[i]; if (excluded.indexOf(key) >= 0) continue; if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue; target[key] = source[key]; } } return target; }

function _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { _defineProperty(target, key, source[key]); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

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
    } else if (!(0, _ramda.equals)(a[i], b[i])) {
      return false;
    }
  }

  return true;
};

var DropdownButton = (0, _kind["default"])({
  name: 'DropdownButton',
  render: function render(props) {
    return _react["default"].createElement(_Button["default"], Object.assign({}, props, {
      css: _DropdownModule["default"],
      iconPosition: "after"
    }));
  }
});
var ContextualButton = (0, _ContextualPopupDecorator["default"])({
  noArrow: true
}, DropdownButton);
/**
 * A stateless Dropdown component.
 *
 * @class DropdownBase
 * @memberof moonstone/Dropdown
 * @extends moonstone/Button.Button
 * @extends moonstone/ContextualPopupDecorator.ContextualPopupDecorator
 * @omit popupComponent
 * @ui
 * @public
 */

var DropdownBase = (0, _kind["default"])({
  name: 'Dropdown',
  propTypes:
  /** @lends moonstone/Dropdown.DropdownBase.prototype */
  {
    /**
     * The selection items to be displayed in the `Dropdown` when `open`.
     *
     * Takes either an array of strings or an array of objects. When strings, the values will be
     * used in the generated components as the readable text. When objects, the properties will
     * be passed onto an `Item` component and `children` as well as a unique `key` property are
     * required.
     *
     * @type {String[]|Array.<{key: (Number|String), children: (String|Component)}>}
     * @public
     */
    children: _propTypes2["default"].oneOfType([_propTypes2["default"].arrayOf(_propTypes2["default"].string), _propTypes2["default"].arrayOf(_propTypes2["default"].shape({
      children: _propTypes["default"].renderable.isRequired,
      key: _propTypes2["default"].oneOfType([_propTypes2["default"].string, _propTypes2["default"].number]).isRequired
    }))]),

    /**
     * Disables Dropdown and becomes non-interactive.
     *
     * @type {Boolean}
     * @public
     */
    disabled: _propTypes2["default"].bool,

    /**
     * Called when the Dropdown is closing.
     *
     * @type {Function}
     * @public
     */
    onClose: _propTypes2["default"].func,

    /**
     * Called when the Dropdown is opening.
     *
     * @type {Function}
     * @public
     */
    onOpen: _propTypes2["default"].func,

    /**
     * Called when an item is selected.
     *
     * The event payload will be an object with the following members:
     * * `data` - The value for the option as received in the `children` prop
     * * `selected` - Number representing the selected option, 0 indexed
     *
     * @type {Function}
     * @public
     */
    onSelect: _propTypes2["default"].func,

    /**
     * Displays the items.
     *
     * @type {Boolean}
     * @default false
     * @public
     */
    open: _propTypes2["default"].bool,

    /**
     * Index of the selected item.
     *
     * @type {Number}
     * @public
     */
    selected: _propTypes2["default"].number,

    /**
     * The primary title text of Dropdown.
     * The title will be replaced if an item is selected.
     *
     * @type {String}
     * @required
     * @public
     */
    title: _propTypes2["default"].string,

    /**
     * The width of Dropdown.
     *
     * @type {('huge'|'large'|'x-large'|'medium'|'small'|'tiny')}
     * @default 'medium'
     * @public
     */
    width: _propTypes2["default"].oneOf(['tiny', 'small', 'medium', 'large', 'x-large', 'huge'])
  },
  defaultProps: {
    direction: 'down',
    open: false,
    width: 'medium'
  },
  handlers: {
    onKeyDown: (0, _handle.handle)((0, _handle.forward)('onKeyDown'), function (ev, props) {
      var rtl = props.rtl;
      var isLeft = (0, _handle.forKey)('left', ev, props);
      var isRight = (0, _handle.forKey)('right', ev, props);
      var isLeftMovement = !rtl && isLeft || rtl && isRight;
      var isRightMovement = !rtl && isRight || rtl && isLeft;
      return isLeftMovement && typeof ev.target.dataset.index !== 'undefined' || isRightMovement;
    }, (0, _handle.forward)('onClose')),
    onSelect: (0, _handle.handle)((0, _handle.forward)('onSelect'), (0, _handle.forward)('onClose')),
    onOpen: (0, _handle.handle)((0, _handle.forward)('onClick'), (0, _handle.forProp)('open', false), (0, _handle.forward)('onOpen'))
  },
  styles: {
    css: _DropdownModule["default"],
    className: 'dropdown'
  },
  computed: {
    children: function children(_ref) {
      var _children = _ref.children,
          selected = _ref.selected;
      if (!Array.isArray(_children)) return [];
      return _children.map(function (child, i) {
        var aria = {
          role: 'checkbox',
          'aria-checked': selected === i,
          'aria-posinset': i + 1,
          'aria-setsize': _children.length
        };
        process.env.NODE_ENV !== "production" ? (0, _warning["default"])(child != null, "Unsupported null or undefined child provided at index ".concat(i, " which will not be visible when rendered.")) : void 0;

        if (typeof child === 'string') {
          return _objectSpread({}, aria, {
            children: child,
            key: "item".concat(i)
          });
        }

        return _objectSpread({}, aria, child);
      });
    },
    className: function className(_ref2) {
      var width = _ref2.width,
          styler = _ref2.styler;
      return styler.append("".concat(width, "Width"));
    },
    title: function title(_ref3) {
      var children = _ref3.children,
          selected = _ref3.selected,
          _title = _ref3.title;

      if ((0, _DropdownList.isSelectedValid)({
        children: children,
        selected: selected
      })) {
        var child = children[selected];
        return _typeof(child) === 'object' ? child.children : child;
      }

      return _title;
    }
  },
  render: function render(_ref4) {
    var children = _ref4.children,
        disabled = _ref4.disabled,
        onKeyDown = _ref4.onKeyDown,
        onOpen = _ref4.onOpen,
        onSelect = _ref4.onSelect,
        open = _ref4.open,
        selected = _ref4.selected,
        width = _ref4.width,
        title = _ref4.title,
        rest = _objectWithoutProperties(_ref4, ["children", "disabled", "onKeyDown", "onOpen", "onSelect", "open", "selected", "width", "title"]);

    var popupProps = {
      children: children,
      onKeyDown: onKeyDown,
      onSelect: onSelect,
      selected: selected,
      width: width,
      role: ''
    }; // `ui/Group`/`ui/Repeater` will throw an error if empty so we disable the Dropdown and
    // prevent Dropdown to open if there are no children.

    var hasChildren = children.length > 0;
    var openDropdown = hasChildren && !disabled && open;
    delete rest.width;
    return _react["default"].createElement(ContextualButton, Object.assign({}, rest, {
      disabled: hasChildren ? disabled : true,
      icon: openDropdown ? 'arrowlargeup' : 'arrowlargedown',
      popupProps: popupProps,
      popupComponent: _DropdownList["default"],
      onClick: onOpen,
      open: openDropdown
    }), title);
  }
});
/**
 * Applies Moonstone specific behaviors and functionality to
 * [DropdownBase]{@link moonstone/Dropdown.DropdownBase}.
 *
 * @hoc
 * @memberof moonstone/Dropdown
 * @mixes ui/Changeable.Changeable
 * @mixes ui/Toggleable.Toggleable
 * @omit selected
 * @omit defaultSelected
 * @omit value
 * @omit defaultValue
 * @omit onChange
 * @public
 */

exports.DropdownBase = DropdownBase;
var DropdownDecorator = (0, _ramda.compose)((0, _Pure["default"])({
  propComparators: {
    children: compareChildren
  }
}), (0, _I18nDecorator.I18nContextDecorator)({
  rtlProp: 'rtl'
}), (0, _Changeable["default"])({
  change: 'onSelect',
  prop: 'selected'
}), (0, _Toggleable["default"])({
  activate: 'onOpen',
  deactivate: 'onClose',
  prop: 'open',
  toggle: null
}));
/**
 * Displays the items.
 *
 * @name open
 * @memberof moonstone/Dropdown.DropdownDecorator.prototype
 * @type {Boolean}
 * @default false
 * @public
 */

/**
 * Index of the selected item.
 *
 * @name selected
 * @memberof moonstone/Dropdown.DropdownDecorator.prototype
 * @type {Number}
 * @public
 */

/**
 * The initial selected index when `selected` is not defined.
 *
 * @name defaultSelected
 * @memberof moonstone/Dropdown.DropdownDecorator.prototype
 * @type {Number}
 * @public
 */

/**
 * A Moonstone Dropdown component.
 *
 * By default, `Dropdown` maintains the state of its `selected` property. Supply the
 * `defaultSelected` property to control its initial value. If you wish to directly control updates
 * to the component, supply a value to `selected` at creation time and update it in response to
 * `onSelected` events.
 *
 * @class Dropdown
 * @memberof moonstone/Dropdown
 * @extends moonstone/Dropdown.DropdownBase
 * @ui
 * @public
 */

exports.DropdownDecorator = DropdownDecorator;
var Dropdown = DropdownDecorator(DropdownBase);
exports.Dropdown = Dropdown;
var _default = Dropdown;
exports["default"] = _default;