"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ActivityPanels = exports["default"] = void 0;

var _Slottable = _interopRequireDefault(require("@enact/ui/Slottable"));

var _Measurable = _interopRequireDefault(require("@enact/ui/Measurable"));

var _compose = _interopRequireDefault(require("ramda/src/compose"));

var _Skinnable = _interopRequireDefault(require("../Skinnable"));

var _Arrangers = require("./Arrangers");

var _BreadcrumbDecorator = _interopRequireDefault(require("./BreadcrumbDecorator"));

var _Panels = require("./Panels");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var ActivityPanelsDecorator = (0, _compose["default"])((0, _Slottable["default"])({
  slots: ['controls']
}), (0, _Measurable["default"])({
  refProp: 'controlsRef',
  measurementProp: 'controlsMeasurements'
}), _Skinnable["default"], (0, _BreadcrumbDecorator["default"])({
  className: 'panels activity enact-fit',
  max: 1,
  panelArranger: _Arrangers.ActivityArranger
}));
/**
 * An instance of Panels in which the Panel uses the entire viewable screen with a single breadcrumb
 * for the previous panel when viewing any panel beyond the first.
 *
 * **Note** ActivityPanels requires that the `data-index` property that all panels variations add to
 * its children be applied to the root DOM node of each child in order to manage layout correctly.
 * It is recommended that you spread any extra props on the root node but you may also handle this
 * property explicitly if necessary.
 *
 * @class ActivityPanels
 * @memberof moonstone/Panels
 * @ui
 * @public
 */

var ActivityPanels = ActivityPanelsDecorator(_Panels.PanelsBase);
exports.ActivityPanels = ActivityPanels;
var _default = ActivityPanels;
exports["default"] = _default;