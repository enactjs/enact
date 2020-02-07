"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getPosition = exports.getLabelOffset = exports.calcOverflow = exports.adjustAnchor = exports.adjustDirection = void 0;

var _resolution = _interopRequireDefault(require("@enact/ui/resolution"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

// TooltipDecorator util.js
//

/**
 * Calculates the unusable space of a centered Tooltip, which the Tooltip arrow cannot be positioned,
 * as a percentage of the Tooltip's total width.
 *
 * @param  {Number} tooltipWidth        The measured width of the Tooltip
 * @return {Number}                     The percent of the width of the tooltip that the Tooltip's
 *                                      decorations allocate for themselves (on one side).
 * @private
 */
var getLabelUnavailableSpace = function getLabelUnavailableSpace(tooltipWidth) {
  // Arrow is 15px wide total, we need to know how wide half of it is, since it's centered on the anchor point.
  var arrowWidth = 15 / 2; // Tooltip is 54px tall, divide by half to get the curve radius ,add the tooltip width
  // to determine the distance that the anchor cannot progress past.

  var tooltipUnavailableEdge = _resolution["default"].scale(54 / 2 + arrowWidth); // cap the offset at 50% - that percentage


  var tooltipUnavaliablePercentage = 0.5 - tooltipUnavailableEdge / tooltipWidth;
  return tooltipUnavaliablePercentage;
};
/**
 * Adjust anchor position for `Tooltip` based on overflow and rtl.
 * Takes the output of `adjustDirection`, and `calcOverflow`.
 *
 * @method
 * @memberof moonstone/TooltipDecorator
 * @param   {String}  arrowAnchor       Initial anchor position
 * @param   {String}  tooltipDirection  Direction of tooltip; value from `adjustDirection`
 * @param   {Object}  overflow          Tooltip's calculated overflow from `calcOverflow`
 * @param   {Boolean} rtl               RTL mode
 * @returns {String}                    Adjusted anchor position
 * @private
 */


var adjustAnchor = function adjustAnchor(arrowAnchor, tooltipDirection, overflow, rtl) {
  if (tooltipDirection === 'above' || tooltipDirection === 'below') {
    if (rtl && arrowAnchor !== 'center') {
      arrowAnchor = arrowAnchor === 'left' ? 'right' : 'left';
    } // Flip sideways if it overflows to the sides


    if (arrowAnchor === 'center') {// If tooltip is anchored in the center, don't flip. We'll offset it appropriately later.
    } else if (overflow.isOverRight) {
      arrowAnchor = 'left';
    } else if (overflow.isOverLeft) {
      arrowAnchor = 'right';
    } // If tooltip is just too wide for the whole screen, switch it to a center tooltip


    if (overflow.isOverWide && tooltipDirection !== 'left' && tooltipDirection !== 'right') {
      arrowAnchor = 'center';
    }
  }

  return arrowAnchor;
};
/**
 * Adjust direction for `Tooltip` based on overflow and rtl.
 * Takes the output from `calcOverflow`.
 *
 * @method
 * @memberof moonstone/TooltipDecorator
 * @param   {String}  tooltipDirection  Direction of tooltip
 * @param   {Object}  overflow          Tooltip's calculated overflow from `calcOverflow`
 * @param   {Boolean} rtl               RTL mode
 * @returns {String}                    Adjusted tooltip direction
 * @private
 */


exports.adjustAnchor = adjustAnchor;

var adjustDirection = function adjustDirection(tooltipDirection, overflow, rtl) {
  if (rtl && (tooltipDirection === 'left' || tooltipDirection === 'right')) {
    tooltipDirection = tooltipDirection === 'left' ? 'right' : 'left';
  } // Flip tooltip if it overflows towards the tooltip direction


  if (overflow.isOverTop && tooltipDirection === 'above') {
    tooltipDirection = 'below';
  } else if (overflow.isOverBottom && tooltipDirection === 'below') {
    tooltipDirection = 'above';
  } else if (overflow.isOverLeft && tooltipDirection === 'left' && !overflow.isOverWide) {
    tooltipDirection = 'right';
  } else if (overflow.isOverRight && tooltipDirection === 'right' && !overflow.isOverWide) {
    tooltipDirection = 'left';
  }

  return tooltipDirection;
};
/**
 * Calculates the overflow of `Tooltip` — if `Tooltip` is at the edge of the viewport.
 * Return the amount of overflow in a particular direction if there is overflow (false otherwise).
 *
 * @method
 * @memberof moonstone/TooltipDecorator
 * @param   {Object} tooltipNode        The `getBoundingClientRect` values for tooltip node
 * @param   {Object} clientNode         The `getBoundingClientRect` values for client node
 * @param   {String} tooltipDirection   Direction of tooltip
 * @param   {Number} tooltipHeight      Tooltip height
 * @param   {Number} edgeKeepout        Extra margin around the screen to avoid
 * @returns {Object}                    Tooltip's calculated overflow
 * @private
 */


exports.adjustDirection = adjustDirection;

var calcOverflow = function calcOverflow(tooltipNode, clientNode, tooltipDirection, edgeKeepout) {
  // get the distance of space on both the right and left side of the client node. `clientNode.width / 2` because we want the tooltip to be positioned horizontally in middle of the client node.
  var windowWidth = window.innerWidth;
  var windowHeight = window.innerHeight;
  var clientHorizontalCenter = clientNode.left + clientNode.width / 2;
  var tooltipSafeWidth = tooltipNode.width + edgeKeepout;
  var tooltipCenterdSafeWidth = tooltipNode.width / 2 + edgeKeepout;
  var rightDelta = tooltipSafeWidth > clientHorizontalCenter;
  var leftDelta = tooltipSafeWidth > windowWidth - clientHorizontalCenter;
  var isTooltipWide = tooltipSafeWidth > windowWidth || leftDelta && rightDelta;

  if (tooltipDirection === 'above' || tooltipDirection === 'below') {
    var isOverTop = clientNode.top - tooltipNode.height - edgeKeepout;
    var isOverBottom = clientNode.bottom + tooltipNode.height + edgeKeepout;
    var isOverLeft = clientHorizontalCenter - tooltipSafeWidth;
    var isOverRight = clientHorizontalCenter + tooltipSafeWidth;
    var isOverCenterLeft = clientHorizontalCenter - tooltipCenterdSafeWidth;
    var isOverCenterRight = clientHorizontalCenter + tooltipCenterdSafeWidth;
    return {
      isOverTop: isOverTop < 0 ? isOverTop : false,
      isOverBottom: isOverBottom > windowHeight ? isOverBottom - windowHeight : false,
      isOverLeft: isOverLeft < 0 ? isOverLeft : false,
      isOverRight: isOverRight > windowWidth ? isOverRight - windowWidth : false,
      isOverCenterLeft: isOverCenterLeft < 0 ? isOverCenterLeft : false,
      isOverCenterRight: isOverCenterRight > windowWidth ? isOverCenterRight - windowWidth : false,
      isOverWide: isTooltipWide
    };
  } else if (tooltipDirection === 'left' || tooltipDirection === 'right') {
    var _isOverTop = clientNode.top - tooltipNode.height + clientNode.height - edgeKeepout;

    var _isOverBottom = clientNode.bottom + tooltipNode.height - clientNode.height / 2 + edgeKeepout;

    var _isOverLeft = clientNode.left - tooltipNode.width - edgeKeepout;

    var _isOverRight = clientNode.right + tooltipNode.width + edgeKeepout;

    return {
      isOverTop: _isOverTop < 0 ? _isOverTop : false,
      isOverBottom: _isOverBottom > windowHeight ? _isOverBottom - windowHeight : false,
      isOverLeft: _isOverLeft < 0 ? _isOverLeft : false,
      isOverRight: _isOverRight > windowWidth ? _isOverRight - windowWidth : false,
      isOverWide: isTooltipWide
    };
  }
};
/**
 * Calculates the top and left position for `Tooltip`.
 * Takes the output of `adjustAnchor`, `adjustDirection`, and `calcOverflow`.
 *
 * @method
 * @memberof moonstone/TooltipDecorator
 * @param   {Object} tooltipNode        The `getBoundingClientRect` values for tooltip node
 * @param   {Object} clientNode         The `getBoundingClientRect` values for client node
 * @param   {String} arrowAnchor        Anchor position from `adjustAnchor`
 * @param   {String} tooltipDirection   Direction of tooltip
 * @param   {Number} tooltipHeight      Tooltip height
 * @param   {Object} overflow           Tooltip's calculated overflow from `calcOverflow`
 * @param   {Boolean} rtl               RTL mode
 * @returns {Object}                    Tooltip top and left position
 * @private
 */


exports.calcOverflow = calcOverflow;

var getPosition = function getPosition(clientNode, tooltipDirection) {
  var position = {};

  switch (tooltipDirection) {
    case 'above':
      position.top = clientNode.top;
      break;

    case 'below':
      position.top = clientNode.bottom;
      break;

    case 'right':
      position.left = clientNode.right;
      break;

    case 'left':
      position.left = clientNode.left;
      break;

    default:
      position = {};
  }

  if (tooltipDirection === 'above' || tooltipDirection === 'below') {
    position.left = clientNode.left + clientNode.width / 2;
  } else if (tooltipDirection === 'left' || tooltipDirection === 'right') {
    position.top = clientNode.top + clientNode.height / 2;
  }

  return position;
};
/**
 * Adjusts the `Tooltip` arrow anchor when the tooltip is too wide.
 * Takes the output of `calcOverflow`.
 *
 * @method
 * @memberof moonstone/TooltipDecorator
 * @param   {Object}  tooltipNode       The `getBoundingClientRect` values for tooltip node
 * @param   {String}  tooltipDirection  Direction of tooltip
 * @param   {Object}  tooltipPosition   Calculated tooltip position from `getPosition`
 * @param   {Object}  overflow          Tooltip's calculated overflow from `calcOverflow`
 * @private
 */


exports.getPosition = getPosition;

var getLabelOffset = function getLabelOffset(tooltipNode, tooltipDirection, tooltipPosition, overflow) {
  // This method is irrelevent to left and right anchored tooltips, skip entirely.
  if (tooltipDirection !== 'left' && tooltipDirection !== 'right') {
    var tooltipWidth = tooltipNode.width;

    if (overflow.isOverWide || overflow.isOverCenterLeft || overflow.isOverCenterRight) {
      var pixelOffset = 0;

      if (overflow.isOverCenterLeft) {
        // Start shifting the label to the right (negative offset)
        pixelOffset = overflow.isOverCenterLeft;
      } else if (overflow.isOverCenterRight) {
        // Start shifting the label to the left (positive offset)
        pixelOffset = overflow.isOverCenterRight;
      }

      var percentageOffset = pixelOffset / tooltipWidth * -1;
      var offsetBoundaryPercentage = getLabelUnavailableSpace(tooltipWidth);
      var cappedPercentageOffset = Math.max(offsetBoundaryPercentage * -1, Math.min(offsetBoundaryPercentage, percentageOffset));
      return cappedPercentageOffset;
    }
  }

  return null;
};

exports.getLabelOffset = getLabelOffset;