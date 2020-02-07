"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.isSelectedValid = exports.DropdownListBase = exports.DropdownList = exports["default"] = void 0;

var _kind = _interopRequireDefault(require("@enact/core/kind"));

var _handle = require("@enact/core/handle");

var _hoc = _interopRequireDefault(require("@enact/core/hoc"));

var _propTypes = _interopRequireDefault(require("@enact/core/internal/prop-types"));

var _spotlight = _interopRequireDefault(require("@enact/spotlight"));

var _resolution = _interopRequireDefault(require("@enact/ui/resolution"));

var _propTypes2 = _interopRequireDefault(require("prop-types"));

var _compose = _interopRequireDefault(require("ramda/src/compose"));

var _react = _interopRequireDefault(require("react"));

var _reactDom = _interopRequireDefault(require("react-dom"));

var _Item = _interopRequireDefault(require("../Item"));

var _Skinnable = _interopRequireDefault(require("../Skinnable"));

var _VirtualList = _interopRequireDefault(require("../VirtualList"));

var _DropdownModule = _interopRequireDefault(require("./Dropdown.module.css"));

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

function _objectWithoutProperties(source, excluded) { if (source == null) return {}; var target = _objectWithoutPropertiesLoose(source, excluded); var key, i; if (Object.getOwnPropertySymbols) { var sourceSymbolKeys = Object.getOwnPropertySymbols(source); for (i = 0; i < sourceSymbolKeys.length; i++) { key = sourceSymbolKeys[i]; if (excluded.indexOf(key) >= 0) continue; if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue; target[key] = source[key]; } } return target; }

function _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }

var scrollOffset = 2;

var isSelectedValid = function isSelectedValid(_ref) {
  var children = _ref.children,
      selected = _ref.selected;
  return Array.isArray(children) && children[selected] != null;
};

exports.isSelectedValid = isSelectedValid;
var DropdownListBase = (0, _kind["default"])({
  name: 'DropdownListBase',
  propTypes: {
    /*
     * The selections for Dropdown
     *
     * @type {String[]|Array.<{key: (Number|String), children: (String|Component)}>}
     */
    children: _propTypes2["default"].oneOfType([_propTypes2["default"].arrayOf(_propTypes2["default"].string), _propTypes2["default"].arrayOf(_propTypes2["default"].shape({
      children: _propTypes["default"].renderable.isRequired,
      key: _propTypes2["default"].oneOfType([_propTypes2["default"].string, _propTypes2["default"].number]).isRequired
    }))]),

    /*
     * Called when an item is selected.
     *
     * @type {Function}
     */
    onSelect: _propTypes2["default"].func,

    /*
     * Callback function that will receive the scroller's scrollTo() method
     *
     * @type {Function}
     */
    scrollTo: _propTypes2["default"].func,

    /*
     * Index of the selected item.
     *
     * @type {Number}
     */
    selected: _propTypes2["default"].number,

    /*
     * State of possible skin variants.
     *
     * Used to scale the `itemSize` of the `VirtualList` based on large-text mode
     *
     * @type {Object}
     */
    skinVariants: _propTypes2["default"].object,

    /*
     * The width of DropdownList.
     *
     * @type {('huge'|'x-large'|'large'|'medium'|'small'|'tiny')}
     */
    width: _propTypes2["default"].oneOf(['tiny', 'small', 'medium', 'large', 'x-large', 'huge'])
  },
  styles: {
    css: _DropdownModule["default"],
    className: 'dropDownList'
  },
  handlers: {
    itemRenderer: function itemRenderer(_ref2, props) {
      var index = _ref2.index,
          rest = _objectWithoutProperties(_ref2, ["index"]);

      var children = props.children,
          selected = props.selected;
      var child = children[index];

      if (typeof child === 'string') {
        child = {
          children: child
        };
      }

      var data = child.children;
      return _react["default"].createElement(_Item["default"], Object.assign({}, rest, child, {
        "data-selected": index === selected // eslint-disable-next-line react/jsx-no-bind
        ,
        onClick: function onClick() {
          return (0, _handle.forward)('onSelect', {
            data: data,
            selected: index
          }, props);
        }
      }));
    }
  },
  computed: {
    className: function className(_ref3) {
      var width = _ref3.width,
          styler = _ref3.styler;
      return styler.append(width);
    },
    dataSize: function dataSize(_ref4) {
      var children = _ref4.children;
      return children ? children.length : 0;
    },
    itemSize: function itemSize(_ref5) {
      var skinVariants = _ref5.skinVariants;
      return _resolution["default"].scale(skinVariants && skinVariants.largeText ? 72 : 60);
    }
  },
  render: function render(_ref6) {
    var dataSize = _ref6.dataSize,
        itemSize = _ref6.itemSize,
        scrollTo = _ref6.scrollTo,
        rest = _objectWithoutProperties(_ref6, ["dataSize", "itemSize", "scrollTo"]);

    delete rest.children;
    delete rest.onSelect;
    delete rest.selected;
    delete rest.skinVariants;
    delete rest.width;
    return _react["default"].createElement(_VirtualList["default"], Object.assign({}, rest, {
      cbScrollTo: scrollTo,
      dataSize: dataSize,
      itemSize: itemSize,
      role: "group",
      style: {
        height: itemSize * dataSize
      }
    }));
  }
});
exports.DropdownListBase = DropdownListBase;
var ReadyState = {
  // Initial state. Scrolling and focusing pending
  INIT: 0,
  // Scroll requested
  SCROLLED: 1,
  // Focus completed or not required
  DONE: 2
};
var DropdownListSpotlightDecorator = (0, _hoc["default"])(function (config, Wrapped) {
  var _class, _temp;

  return _temp = _class =
  /*#__PURE__*/
  function (_React$Component) {
    _inherits(_class, _React$Component);

    function _class(props) {
      var _this;

      _classCallCheck(this, _class);

      _this = _possibleConstructorReturn(this, _getPrototypeOf(_class).call(this, props));

      _this.setScrollTo = function (scrollTo) {
        _this.scrollTo = scrollTo;
      };

      _this.scrollIntoView = function () {
        var selected = _this.props.selected;
        var ready = ReadyState.DONE;

        if (isSelectedValid(_this.props)) {
          var index = selected > scrollOffset ? selected - scrollOffset : 0;

          _this.scrollTo({
            animate: false,
            index: index
          });

          ready = ReadyState.SCROLLED;
        }

        _this.setState({
          ready: ready
        });
      };

      _this.state = {
        ready: isSelectedValid(props) ? ReadyState.INIT : ReadyState.DONE
      };
      return _this;
    }

    _createClass(_class, [{
      key: "componentDidMount",
      value: function componentDidMount() {
        // eslint-disable-next-line react/no-find-dom-node
        this.node = _reactDom["default"].findDOMNode(this);

        _spotlight["default"].set(this.node.dataset.spotlightId, {
          defaultElement: '[data-selected="true"]',
          enterTo: 'default-element',
          leaveFor: {
            up: '',
            down: ''
          }
        });
      }
    }, {
      key: "componentDidUpdate",
      value: function componentDidUpdate() {
        if (this.state.ready === ReadyState.INIT) {
          this.scrollIntoView();
        } else if (this.state.ready === ReadyState.SCROLLED) {
          this.focusSelected();
        }
      }
    }, {
      key: "focusSelected",
      value: function focusSelected() {
        if (_spotlight["default"].focus(this.node.dataset.spotlightId)) {
          this.setState({
            ready: ReadyState.DONE
          });
        }
      }
    }, {
      key: "render",
      value: function render() {
        return _react["default"].createElement(Wrapped, Object.assign({}, this.props, {
          scrollTo: this.setScrollTo
        }));
      }
    }]);

    return _class;
  }(_react["default"].Component), _class.displayName = 'DropdownListSpotlightDecorator', _class.propTypes = {
    /*
     * Index of the selected item.
     *
     * @type {Number}
     */
    selected: _propTypes2["default"].number
  }, _temp;
});
var DropdownListDecorator = (0, _compose["default"])(DropdownListSpotlightDecorator, (0, _Skinnable["default"])({
  variantsProp: 'skinVariants'
}));
var DropdownList = DropdownListDecorator(DropdownListBase);
exports.DropdownList = DropdownList;
var _default = DropdownList;
exports["default"] = _default;