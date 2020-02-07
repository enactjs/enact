"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ActivityArranger = exports.AlwaysViewingArranger = void 0;

var _resolution = require("@enact/ui/resolution");

var _Arranger = require("@enact/ui/ViewManager/Arranger");

var _Breadcrumb = require("./Breadcrumb");

var quadInOut = 'cubic-bezier(0.455, 0.030, 0.515, 0.955)';
var animationOptions = {
  easing: quadInOut
};

var getHorizontalTranslation = function getHorizontalTranslation(node) {
  var factor = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 1;
  var width = node.getBoundingClientRect().width;
  return "translateX(".concat(width * factor, "px)");
}; // Always-Viewing Arranger

/**
 * Arranger that slides panels in from the right and out to the left
 *
 * @type {Arranger}
 * @private
 */


var AlwaysViewingArranger = {
  enter: function enter(config) {
    var node = config.node,
        reverse = config.reverse;
    var transform = getHorizontalTranslation(node);
    return (0, _Arranger.arrange)(config, [{
      transform: transform,
      offset: 0
    }, reverse ? {
      transform: 'translateX(0)',
      offset: 0.75
    } : {
      transform: transform,
      offset: 0.25
    }, {
      transform: 'translateX(0)',
      offset: 1
    }], animationOptions);
  },
  leave: function leave(config) {
    var node = config.node,
        reverse = config.reverse;
    var transform = getHorizontalTranslation(node, -1);
    return (0, _Arranger.arrange)(config, [{
      transform: 'translateX(0)',
      offset: 0
    }, reverse ? {
      transform: transform,
      offset: 0.75
    } : {
      transform: 'translateX(0)',
      offset: 0.25
    }, {
      transform: transform,
      offset: 1
    }], animationOptions);
  }
}; // Actvity Arranger

/*
 * Appends a transform that accounts for a single breadcrumb
 *
 * @param  {Node} node      DOM Node
 *
 * @returns {undefined}
 * @private
 */

exports.AlwaysViewingArranger = AlwaysViewingArranger;

var offsetForBreadcrumbs = function offsetForBreadcrumbs(node) {
  var isFirst = node && node.dataset && node.dataset.index === '0';
  return "translateX(".concat(isFirst ? 0 : (0, _resolution.scale)(_Breadcrumb.breadcrumbWidth), "px)");
};
/**
 * Arranger that slides panels in from the right and out to the left allowing space for the single
 * breadcrumb when `to` index is greater than zero.
 *
 * @type {Arranger}
 * @private
 */


var ActivityArranger = {
  enter: function enter(config) {
    var node = config.node,
        reverse = config.reverse;
    var transform = getHorizontalTranslation(node);
    return (0, _Arranger.arrange)(config, [{
      transform: "".concat(offsetForBreadcrumbs(node), " ").concat(transform),
      offset: 0
    }, reverse ? {
      transform: offsetForBreadcrumbs(node),
      offset: 0.75
    } : {
      transform: "".concat(offsetForBreadcrumbs(node), " ").concat(transform),
      offset: 0.25
    }, {
      transform: offsetForBreadcrumbs(node),
      offset: 1
    }], animationOptions);
  },
  leave: function leave(config) {
    var node = config.node,
        reverse = config.reverse;
    var transform = getHorizontalTranslation(node, -1);
    return (0, _Arranger.arrange)(config, [{
      transform: offsetForBreadcrumbs(node),
      offset: 0
    }, reverse ? {
      transform: transform,
      offset: 0.75
    } : {
      transform: offsetForBreadcrumbs(node),
      offset: 0.25
    }, {
      transform: transform,
      offset: 1
    }], animationOptions);
  },
  stay: function stay(config) {
    var node = config.node;
    return (0, _Arranger.arrange)(config, [{
      transform: offsetForBreadcrumbs(node)
    }, {
      transform: offsetForBreadcrumbs(node)
    }], animationOptions);
  }
};
exports.ActivityArranger = ActivityArranger;