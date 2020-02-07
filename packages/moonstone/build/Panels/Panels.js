"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.PanelsBase = exports.Panels = exports["default"] = void 0;

var _kind = _interopRequireDefault(require("@enact/core/kind"));

var _Measurable = _interopRequireDefault(require("@enact/ui/Measurable"));

var _Slottable = _interopRequireDefault(require("@enact/ui/Slottable"));

var _IdProvider = _interopRequireDefault(require("@enact/ui/internal/IdProvider"));

var _ViewManager = require("@enact/ui/ViewManager");

var _propTypes = _interopRequireDefault(require("prop-types"));

var _compose = _interopRequireDefault(require("ramda/src/compose"));

var _react = _interopRequireDefault(require("react"));

var _Skinnable = _interopRequireDefault(require("../Skinnable"));

var _CancelDecorator = _interopRequireDefault(require("./CancelDecorator"));

var _Controls = _interopRequireDefault(require("./Controls"));

var _Viewport = _interopRequireDefault(require("./Viewport"));

var _PanelsModule = _interopRequireDefault(require("./Panels.module.css"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _objectWithoutProperties(source, excluded) { if (source == null) return {}; var target = _objectWithoutPropertiesLoose(source, excluded); var key, i; if (Object.getOwnPropertySymbols) { var sourceSymbolKeys = Object.getOwnPropertySymbols(source); for (i = 0; i < sourceSymbolKeys.length; i++) { key = sourceSymbolKeys[i]; if (excluded.indexOf(key) >= 0) continue; if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue; target[key] = source[key]; } } return target; }

function _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { _defineProperty(target, key, source[key]); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var getControlsId = function getControlsId(id) {
  return id && "".concat(id, "-controls");
};
/**
 * Basic Panels component without breadcrumbs or default [arranger]{@link ui/ViewManager.Arranger}
 *
 * @class Panels
 * @memberof moonstone/Panels
 * @ui
 * @public
 */


var PanelsBase = (0, _kind["default"])({
  name: 'Panels',
  propTypes:
  /** @lends moonstone/Panels.Panels.prototype */
  {
    /**
     * Function that generates unique identifiers for Panel instances.
     *
     * @type {Function}
     * @required
     * @private
     */
    generateId: _propTypes["default"].func.isRequired,

    /**
     * Set of functions that control how the panels are transitioned into and out of the
     * viewport.
     *
     * @see {@link ui/ViewManager.SlideArranger}
     * @type {ui/ViewManager.Arranger}
     * @public
     */
    arranger: _ViewManager.shape,

    /**
     * An object containing properties to be passed to each child.
     *
     *`aria-owns` will be added or updated to this object to add the close button to the
     * accessibility tree of each panel.
     *
     * @type {Object}
     * @public
     */
    childProps: _propTypes["default"].object,

    /**
     * [`Panels`]{@link moonstone/Panels.Panel} to be rendered
     *
     * @type {Node}
     * @public
     */
    children: _propTypes["default"].node,

    /**
     * Sets the hint string read when focusing the application close button.
     *
     * @type {String}
     * @default 'Exit app'
     * @public
     */
    closeButtonAriaLabel: _propTypes["default"].string,

    /**
     * The background opacity of the application close button.
     *
     * * Values: `'translucent'`, `'lightTranslucent'`, `'transparent'`
     *
     * @type {String}
     * @default 'transparent'
     * @public
     */
    closeButtonBackgroundOpacity: _propTypes["default"].oneOf(['translucent', 'lightTranslucent', 'transparent']),

    /**
     * A slot to insert additional Panels-level buttons into the global-navigation area.
     *
     * @type {Node}
     * @public
     */
    controls: _propTypes["default"].node,

    /**
     * The measurement bounds of the controls node
     *
     * @type {Object}
     * @private
     */
    controlsMeasurements: _propTypes["default"].object,

    /**
     * The method which receives the reference node to the controls element, used to determine
     * the `controlsMeasurements`.
     *
     * @type {Function|Object}
     * @private
     */
    controlsRef: _propTypes["default"].oneOfType([_propTypes["default"].func, _propTypes["default"].shape({
      current: _propTypes["default"].any
    })]),

    /**
     * Unique identifier for the Panels instance.
     *
     * When defined, `Panels` will manage the presentation state of `Panel` instances in order
     * to restore it when returning to the `Panel`. See
     * [noSharedState]{@link moonstone/Panels.Panels.noSharedState} for more details on shared
     * state.
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
     * @public
     */
    index: _propTypes["default"].number,

    /**
     * Disables panel transitions.
     *
     * @type {Boolean}
     * @default false
     * @public
     */
    noAnimation: _propTypes["default"].bool,

    /**
     * Indicates the close button will not be rendered on the top right corner.
     *
     * @type {Boolean}
     * @default false
     * @public
     */
    noCloseButton: _propTypes["default"].bool,

    /**
     * Prevents maintaining shared state for framework components within this `Panels` instance.
     *
     * When `false`, each `Panel` will track the state of some framework components in order to
     * restore that state when the Panel is recreated. For example, the scroll position of a
     * `moonstone/Scroller` within a `Panel` will be saved and restored when returning to that
     * `Panel`.
     *
     * This only applied when navigating "back" (to a lower index) to `Panel`. When navigating
     * "forwards" (to a higher index), the `Panel` and its contained components will use their
     * default state.
     *
     * @type {Boolean}
     * @default false
     * @public
     */
    noSharedState: _propTypes["default"].bool,

    /**
     * Called when the app close button is clicked.
     *
     * @type {Function}
     * @public
     */
    onApplicationClose: _propTypes["default"].func,

    /**
     * Called with cancel/back key events.
     *
     * @type {Function}
     * @public
     */
    onBack: _propTypes["default"].func
  },
  defaultProps: {
    closeButtonBackgroundOpacity: 'transparent',
    index: 0,
    noAnimation: false,
    noCloseButton: false,
    noSharedState: false
  },
  styles: {
    css: _PanelsModule["default"],
    className: 'panels enact-fit'
  },
  computed: {
    className: function className(_ref) {
      var controls = _ref.controls,
          noCloseButton = _ref.noCloseButton,
          styler = _ref.styler;
      return styler.append({
        'moon-panels-hasControls': !noCloseButton || !!controls // If there is a close button or controls were specified

      });
    },
    childProps: function childProps(_ref2) {
      var _childProps = _ref2.childProps,
          controls = _ref2.controls,
          id = _ref2.id,
          noCloseButton = _ref2.noCloseButton;

      if (noCloseButton && !controls || !id) {
        return _childProps;
      }

      var updatedChildProps = Object.assign({}, _childProps);
      var controlsId = getControlsId(id);
      var owns = updatedChildProps['aria-owns'];

      if (owns) {
        updatedChildProps['aria-owns'] = "".concat(owns, " ").concat(controlsId);
      } else {
        updatedChildProps['aria-owns'] = controlsId;
      }

      return updatedChildProps;
    },
    style: function style(_ref3) {
      var controlsMeasurements = _ref3.controlsMeasurements,
          _ref3$style = _ref3.style,
          _style = _ref3$style === void 0 ? {} : _ref3$style;

      return controlsMeasurements ? _objectSpread({}, _style, {
        '--moon-panels-controls-width': controlsMeasurements.width + 'px'
      }) : _style;
    },
    viewportId: function viewportId(_ref4) {
      var id = _ref4.id;
      return id && "".concat(id, "-viewport");
    }
  },
  render: function render(_ref5) {
    var arranger = _ref5.arranger,
        childProps = _ref5.childProps,
        children = _ref5.children,
        closeButtonAriaLabel = _ref5.closeButtonAriaLabel,
        closeButtonBackgroundOpacity = _ref5.closeButtonBackgroundOpacity,
        controls = _ref5.controls,
        controlsRef = _ref5.controlsRef,
        generateId = _ref5.generateId,
        id = _ref5.id,
        index = _ref5.index,
        noAnimation = _ref5.noAnimation,
        noCloseButton = _ref5.noCloseButton,
        noSharedState = _ref5.noSharedState,
        onApplicationClose = _ref5.onApplicationClose,
        viewportId = _ref5.viewportId,
        rest = _objectWithoutProperties(_ref5, ["arranger", "childProps", "children", "closeButtonAriaLabel", "closeButtonBackgroundOpacity", "controls", "controlsRef", "generateId", "id", "index", "noAnimation", "noCloseButton", "noSharedState", "onApplicationClose", "viewportId"]);

    delete rest.controlsMeasurements;
    delete rest.onBack;
    var controlsId = getControlsId(id);
    return _react["default"].createElement("div", Object.assign({}, rest, {
      id: id
    }), _react["default"].createElement(_Controls["default"], {
      closeButtonAriaLabel: closeButtonAriaLabel,
      closeButtonBackgroundOpacity: closeButtonBackgroundOpacity,
      id: controlsId,
      spotlightId: controlsId,
      noCloseButton: noCloseButton,
      onApplicationClose: onApplicationClose,
      ref: controlsRef
    }, controls), _react["default"].createElement(_Viewport["default"], {
      arranger: arranger,
      childProps: childProps,
      generateId: generateId,
      id: viewportId,
      index: index,
      noAnimation: noAnimation,
      noSharedState: noSharedState
    }, children));
  }
});
exports.PanelsBase = PanelsBase;
var PanelsDecorator = (0, _compose["default"])((0, _Slottable["default"])({
  slots: ['controls']
}), (0, _CancelDecorator["default"])({
  cancel: 'onBack'
}), (0, _Measurable["default"])({
  refProp: 'controlsRef',
  measurementProp: 'controlsMeasurements'
}), _IdProvider["default"], _Skinnable["default"]);
var Panels = PanelsDecorator(PanelsBase);
exports.Panels = Panels;
var _default = Panels;
exports["default"] = _default;