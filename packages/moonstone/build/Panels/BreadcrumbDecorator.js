"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.BreadcrumbDecorator = exports["default"] = void 0;

var _hoc = _interopRequireDefault(require("@enact/core/hoc"));

var _kind = _interopRequireDefault(require("@enact/core/kind"));

var _util = require("@enact/core/util");

var _IdProvider = _interopRequireDefault(require("@enact/ui/internal/IdProvider"));

var _ViewManager = _interopRequireDefault(require("@enact/ui/ViewManager"));

var _spotlight = _interopRequireDefault(require("@enact/spotlight"));

var _invariant = _interopRequireDefault(require("invariant"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _react = _interopRequireDefault(require("react"));

var _Skinnable = _interopRequireDefault(require("../Skinnable"));

var _Breadcrumb = _interopRequireDefault(require("./Breadcrumb"));

var _BreadcrumbArranger = _interopRequireDefault(require("./BreadcrumbArranger"));

var _CancelDecorator = _interopRequireDefault(require("./CancelDecorator"));

var _IndexedBreadcrumbs = _interopRequireDefault(require("./IndexedBreadcrumbs"));

var _PanelsModule = _interopRequireDefault(require("./Panels.module.css"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _objectWithoutProperties(source, excluded) { if (source == null) return {}; var target = _objectWithoutPropertiesLoose(source, excluded); var key, i; if (Object.getOwnPropertySymbols) { var sourceSymbolKeys = Object.getOwnPropertySymbols(source); for (i = 0; i < sourceSymbolKeys.length; i++) { key = sourceSymbolKeys[i]; if (excluded.indexOf(key) >= 0) continue; if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue; target[key] = source[key]; } } return target; }

function _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }

// TODO: Figure out how to document private sub-module members

/**
 * Default config for {@link moonstone/Panels.BreadcrumbDecorator}
 * @hocconfig
 * @memberof moonstone/Panels.BreadcrumbDecorator
 */
var defaultConfig = {
  /**
   * Classes to be added to the root node
   *
   * @type {String}
   * @default null
   * @memberof moonstone/Panels.BreadcrumbDecorator.defaultConfig
   */
  className: null,

  /**
   * Maximum number of breadcrumbs to display. If a function, it will be called on render to
   * calculate the number of breadcrumbs
   *
   * @type {Number|Function}
   * @default 0
   * @memberof moonstone/Panels.BreadcrumbDecorator.defaultConfig
   */
  max: 0,

  /**
   * Arranger for Panels
   *
   * @type {Object}
   * @default null
   * @memberof moonstone/Panels.BreadcrumbDecorator.defaultConfig
   */
  panelArranger: null
};
/**
 * A higher-order component that adds breadcrumbs to a Panels component
 *
 * @class BreadcrumbDecorator
 * @type {Function}
 * @hoc
 * @private
 * @memberof moonstone/Panels
 */

var BreadcrumbDecorator = (0, _hoc["default"])(defaultConfig, function (config, Wrapped) {
  var max = config.max,
      panelArranger = config.panelArranger,
      cfgClassName = config.className;
  var calcMax = (0, _util.coerceFunction)(max);
  var Decorator = (0, _kind["default"])({
    name: 'BreadcrumbDecorator',
    propTypes:
    /** @lends moonstone/Panels.BreadcrumbDecorator.prototype */
    {
      /**
       * Array of breadcrumbs or a function that generates an array of breadcrumbs
       *
       * @type {Function|Node[]}
       * @default IndexedBreadcrumbs
       */
      breadcrumbs: _propTypes["default"].oneOfType([_propTypes["default"].func, // generator
      _propTypes["default"].arrayOf(_propTypes["default"].node) // static array of breadcrumbs
      ]),

      /**
       * An object containing properties to be passed to each child. `aria-owns` will be added
       * or updated to this object to add the breadcrumbs to the accessibility tree of each
       * panel.
       *
       * @type {Object}
       * @public
       */
      childProps: _propTypes["default"].object,

      /**
       * Panels to be rendered
       *
       * @type {Node}
       */
      children: _propTypes["default"].node,

      /**
       * Function that generates unique identifiers for Panel instances
       *
       * @type {Function}
       * @required
       * @private
       */
      generateId: _propTypes["default"].func,

      /**
       * Unique identifier for the Panels instance
       *
       * @type {String}
       * @public
       */
      id: _propTypes["default"].string,

      /**
       * Index of the active panel
       *
       * @type {Number}
       * @default 0
       */
      index: _propTypes["default"].number,

      /**
       * Disable breadcrumb transitions.
       *
       * @type {Boolean}
       * @default false
       */
      noAnimation: _propTypes["default"].bool,

      /**
       * Called when a breadcrumb is clicked. The payload includes the `index` of the selected
       * breadcrumb
       *
       * @type {Function}
       */
      onSelectBreadcrumb: _propTypes["default"].func
    },
    defaultProps: {
      breadcrumbs: _IndexedBreadcrumbs["default"],
      index: 0,
      noAnimation: false
    },
    styles: {
      css: _PanelsModule["default"],
      className: cfgClassName
    },
    handlers: {
      handleBreadcrumbWillTransition: function handleBreadcrumbWillTransition(ev, _ref) {
        var id = _ref.id;

        var current = _spotlight["default"].getCurrent();

        if (!current) return;
        var breadcrumbs = document.querySelector("#".concat(id, " .").concat(_PanelsModule["default"].breadcrumbs));

        if (breadcrumbs && breadcrumbs.contains(current)) {
          current.blur();
        }
      }
    },
    computed: {
      // Invokes the breadcrumb generator, if provided
      breadcrumbs: function breadcrumbs(_ref2) {
        var _breadcrumbs = _ref2.breadcrumbs,
            id = _ref2.id,
            index = _ref2.index,
            onSelectBreadcrumb = _ref2.onSelectBreadcrumb;
        var x = calcMax(index);

        if (Array.isArray(_breadcrumbs)) {
          // limit the number of breadcrumbs based on the index and config.max
          var start = Math.max(index - x, 0);

          var children = _react["default"].Children.toArray(_breadcrumbs).slice(start, start + x); // map over the children to either clone it with the appropriate props or to
          // create a Breadcrumb if passed an array of renderable primitives


          return _react["default"].Children.map(children, function (child, i) {
            var props = {
              id: "".concat(id, "_bc_").concat(i),
              index: i,
              onSelect: onSelectBreadcrumb
            };

            if (_react["default"].isValidElement(child)) {
              return _react["default"].cloneElement(child, props);
            } else {
              return _react["default"].createElement(_Breadcrumb["default"], props, child);
            }
          });
        } else {
          return _breadcrumbs(id, index, x, onSelectBreadcrumb);
        }
      },
      childProps: function childProps(_ref3) {
        var _childProps = _ref3.childProps,
            id = _ref3.id,
            index = _ref3.index;

        if (!id || index === 0) {
          return _childProps;
        }

        var start = Math.max(index - calcMax(index), 0);
        var updatedChildProps = Object.assign({}, _childProps);
        var ariaOwns = [];

        for (var i = start; i < index; i++) {
          ariaOwns.push("".concat(id, "_bc_").concat(i));
        }

        if (updatedChildProps['aria-owns']) {
          ariaOwns.unshift(updatedChildProps['aria-owns']);
        }

        updatedChildProps['aria-owns'] = ariaOwns.join(' ');
        return updatedChildProps;
      }
    },
    render: function render(_ref4) {
      var breadcrumbs = _ref4.breadcrumbs,
          childProps = _ref4.childProps,
          children = _ref4.children,
          className = _ref4.className,
          generateId = _ref4.generateId,
          handleBreadcrumbWillTransition = _ref4.handleBreadcrumbWillTransition,
          id = _ref4.id,
          index = _ref4.index,
          noAnimation = _ref4.noAnimation,
          rest = _objectWithoutProperties(_ref4, ["breadcrumbs", "childProps", "children", "className", "generateId", "handleBreadcrumbWillTransition", "id", "index", "noAnimation"]);

      delete rest.onSelectBreadcrumb;

      var count = _react["default"].Children.count(children);

      !(index === 0 && count === 0 || index < count) ? process.env.NODE_ENV !== "production" ? (0, _invariant["default"])(false, "Panels index, ".concat(index, ", is invalid for number of children, ").concat(count)) : invariant(false) : void 0;
      return _react["default"].createElement("div", {
        className: className,
        "data-index": index,
        id: id
      }, _react["default"].createElement(_ViewManager["default"], {
        arranger: _BreadcrumbArranger["default"],
        className: _PanelsModule["default"].breadcrumbs,
        duration: 300,
        end: calcMax(),
        index: index - 1,
        noAnimation: noAnimation,
        onWillTransition: handleBreadcrumbWillTransition,
        start: 0
      }, breadcrumbs), _react["default"].createElement(Wrapped, Object.assign({}, rest, {
        arranger: panelArranger,
        childProps: childProps,
        generateId: generateId,
        id: "".concat(id, "_panels"),
        index: index,
        noAnimation: noAnimation
      }), children));
    }
  });
  return (0, _CancelDecorator["default"])({
    cancel: 'onSelectBreadcrumb'
  }, (0, _IdProvider["default"])((0, _Skinnable["default"])(Decorator)));
});
exports.BreadcrumbDecorator = BreadcrumbDecorator;
var _default = BreadcrumbDecorator;
exports["default"] = _default;