"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.BreadcrumbArranger = exports["default"] = void 0;

var _Arranger = require("@enact/ui/ViewManager/Arranger");

/**
 * Positions a breadcrumb based on its `data-index` and the current index, `to`
 *
 * @param  {Object} config  Arrangement configuration object
 * @returns {undefined}
 * @method
 * @private
 */
var positionBreadcrumb = function positionBreadcrumb(node, index) {
  var crumbIndex = node.dataset.index;
  var x = index - crumbIndex;
  var pixelOffset = -x * node.getBoundingClientRect().width;
  return "translateX(".concat(pixelOffset, "px)");
};

var enter = function enter(config) {
  var node = config.node,
      from = config.from,
      to = config.to,
      reverse = config.reverse;
  var keyframes = reverse ? [{
    transform: positionBreadcrumb(node, to)
  }, {
    transform: positionBreadcrumb(node, from),
    offset: 0.25
  }, {
    transform: positionBreadcrumb(node, from)
  }] : [{
    transform: positionBreadcrumb(node, from)
  }, {
    transform: positionBreadcrumb(node, from),
    offset: 0.75
  }, {
    transform: positionBreadcrumb(node, to)
  }];
  return (0, _Arranger.arrange)(config, keyframes);
};
/**
 * Arranger for panel breadcrumbs
 *
 * @type {Arranger}
 * @private
 */


var BreadcrumbArranger = {
  enter: enter,
  stay: enter,
  leave: enter
};
exports.BreadcrumbArranger = BreadcrumbArranger;
var _default = BreadcrumbArranger;
exports["default"] = _default;