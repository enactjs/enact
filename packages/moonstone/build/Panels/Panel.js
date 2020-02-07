"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.PanelBase = exports.Panel = exports["default"] = void 0;

var _handle = require("@enact/core/handle");

var _kind = _interopRequireDefault(require("@enact/core/kind"));

var _spotlight = _interopRequireDefault(require("@enact/spotlight"));

var _SpotlightContainerDecorator = _interopRequireWildcard(require("@enact/spotlight/SpotlightContainerDecorator"));

var _Slottable = _interopRequireDefault(require("@enact/ui/Slottable"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _react = _interopRequireDefault(require("react"));

var _SharedStateDecorator = _interopRequireDefault(require("../internal/SharedStateDecorator"));

var _PanelModule = _interopRequireDefault(require("./Panel.module.css"));

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj["default"] = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _objectWithoutProperties(source, excluded) { if (source == null) return {}; var target = _objectWithoutPropertiesLoose(source, excluded); var key, i; if (Object.getOwnPropertySymbols) { var sourceSymbolKeys = Object.getOwnPropertySymbols(source); for (i = 0; i < sourceSymbolKeys.length; i++) { key = sourceSymbolKeys[i]; if (excluded.indexOf(key) >= 0) continue; if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue; target[key] = source[key]; } } return target; }

function _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }

var panelId = 0;
/**
 * A Panel is the standard view container used inside a [Panels]{@link moonstone/Panels.Panels} view
 * manager instance.
 *
 * [Panels]{@link moonstone/Panels.Panels} will typically contain several instances of these and
 * transition between them.
 *
 * @class Panel
 * @memberof moonstone/Panels
 * @ui
 * @public
 */

var PanelBase = (0, _kind["default"])({
  name: 'Panel',
  propTypes:
  /** @lends moonstone/Panels.Panel.prototype */
  {
    /**
    	 * The "aria-label" for the Panel.
     *
     * By default, the panel will be labeled by its [Header]{@link moonstone/Panels.Header}.
     * When `aria-label` is set, it will be used instead to provide an accessibility label for
     * the panel.
     *
     * @memberof moonstone/Panels.Panel.prototype
     * @type {String}
     * @public
     */
    'aria-label': _propTypes["default"].string,

    /**
     * Sets the strategy used to automatically focus an element within the panel upon render.
     *
     * * "none" - Automatic focus is disabled
     * * "last-focused" - The element last focused in the panel with be restored
     * * "default-element" - The first spottable component within the body will be focused
     * * Custom Selector - A custom CSS selector may also be provided which will be used to find
     *   the target within the Panel
     *
     * When used within [Panels]{@link moonstone/Panels.Panels}, this prop may be set by
     * `Panels` to "default-element" when navigating "forward" to a higher index. This behavior
     * may be overridden by setting `autoFocus` on the `Panel` instance as a child of `Panels`
     * or by wrapping `Panel` with a custom component and overriding the value passed by
     * `Panels`.
     *
     * ```
     * // Panel within CustomPanel will always receive "last-focused"
     * const CustomPanel = (props) => <Panel {...props} autoFocus="last-focused" />;
     *
     * // The first panel will always receive "last-focused". The second panel will receive
     * // "default-element" when navigating from the first panel but `autoFocus` will be unset
     * // when navigating from the third panel and as a result will default to "last-focused".
     * const MyPanels = () => (
     *   <Panels>
     *     <Panel autoFocus="last-focused" />
     *     <Panel />
     *     <Panel />
     *   </Panels>
     * );
     * ```
     *
     * @type {String}
     * @default 'last-focused'
     * @public
     */
    autoFocus: _propTypes["default"].string,

    /**
     * Header for the panel.
     *
     * This is usually passed by the [Slottable]{@link ui/Slottable.Slottable} API by using a
     * [Header]{@link moonstone/Panels.Header} component as a child of the Panel.
     *
     * @type {Header}
     * @public
     */
    header: _propTypes["default"].node,

    /**
     * Hides the body components.
     *
     * When a Panel is used within [`Panels`]{@link moonstone/Panels.Panels},
     * [`ActivityPanels`]{@link moonstone/Panels.ActivityPanels}, or
     * [`AlwaysViewingPanels`]{@link moonstone/Panels.AlwaysViewingPanels},
     * this property will be set automatically to `true` on render and `false` after animating
     * into view.
     *
     * @type {Boolean}
     * @default false
     * @public
     */
    hideChildren: _propTypes["default"].bool
  },
  defaultProps: {
    autoFocus: 'last-focused',
    hideChildren: false
  },
  styles: {
    css: _PanelModule["default"],
    className: 'panel'
  },
  handlers: {
    onScroll: (0, _handle.handle)((0, _handle.forward)('onScroll'), function (_ref) {
      var currentTarget = _ref.currentTarget;
      currentTarget.scrollTop = 0;
      currentTarget.scrollLeft = 0;
    }),
    spotOnRender: function spotOnRender(node, _ref2) {
      var autoFocus = _ref2.autoFocus;

      if (node && !_spotlight["default"].getCurrent()) {
        var spotlightId = node.dataset.spotlightId;
        var config = {
          enterTo: 'last-focused'
        };

        if (autoFocus !== 'last-focused') {
          config.enterTo = 'default-element';

          if (autoFocus !== 'default-element') {
            config.defaultElement = autoFocus;
          }
        }

        _spotlight["default"].set(spotlightId, config);

        _spotlight["default"].focus(spotlightId);
      }
    }
  },
  computed: {
    spotOnRender: function spotOnRender(_ref3) {
      var autoFocus = _ref3.autoFocus,
          hideChildren = _ref3.hideChildren,
          _spotOnRender = _ref3.spotOnRender;

      // In order to spot the body components, we defer spotting until !hideChildren. If the
      // Panel opts out of hideChildren support by explicitly setting it to false, it'll spot
      // on first render.
      if (hideChildren || autoFocus === 'none') {
        return null;
      }

      return _spotOnRender;
    },
    children: function children(_ref4) {
      var _children = _ref4.children,
          hideChildren = _ref4.hideChildren;
      return hideChildren ? null : _children;
    },
    bodyClassName: function bodyClassName(_ref5) {
      var header = _ref5.header,
          hideChildren = _ref5.hideChildren,
          styler = _ref5.styler;
      return styler.join({
        body: true,
        noHeader: !header,
        visible: !hideChildren
      });
    },
    // nulling headerId prevents the aria-labelledby relationship which is necessary to allow
    // aria-label to take precedence
    // (see https://www.w3.org/TR/wai-aria/states_and_properties#aria-labelledby)
    headerId: function headerId(_ref6) {
      var label = _ref6['aria-label'];
      return label ? null : "panel_".concat(++panelId, "_header");
    }
  },
  render: function render(_ref7) {
    var bodyClassName = _ref7.bodyClassName,
        children = _ref7.children,
        header = _ref7.header,
        headerId = _ref7.headerId,
        spotOnRender = _ref7.spotOnRender,
        rest = _objectWithoutProperties(_ref7, ["bodyClassName", "children", "header", "headerId", "spotOnRender"]);

    delete rest.autoFocus;
    delete rest.hideChildren;
    return _react["default"].createElement("article", Object.assign({
      role: "region"
    }, rest, {
      "aria-labelledby": headerId,
      ref: spotOnRender
    }), _react["default"].createElement("div", {
      className: _PanelModule["default"].header,
      id: headerId
    }, header), _react["default"].createElement("section", {
      className: bodyClassName
    }, children));
  }
});
/**
 * Prevents the component from restoring any framework shared state.
 *
 * When `false`, the default, Panel will store state for some framework components in order to
 * restore that state when returning to the Panel. Setting this prop to `true` will suppress that
 * behavior and not store or retrieve any framework component state.
 *
 * @name noSharedState
 * @type {Boolean}
 * @default {false}
 * @memberof moonstone/Panels.Panel.prototype
 */

exports.PanelBase = PanelBase;
var Panel = (0, _SharedStateDecorator["default"])({
  idProp: 'data-index'
}, (0, _SpotlightContainerDecorator["default"])({
  // prefer any spottable within the panel body for first render
  continue5WayHold: true,
  defaultElement: [".".concat(_SpotlightContainerDecorator.spotlightDefaultClass), ".".concat(_PanelModule["default"].body, " *")],
  enterTo: 'last-focused',
  preserveId: true
}, (0, _Slottable["default"])({
  slots: ['header']
}, PanelBase)));
exports.Panel = Panel;
var _default = Panel;
exports["default"] = _default;