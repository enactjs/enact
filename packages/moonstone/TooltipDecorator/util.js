// TooltipDecorator util.js
//

import ri from '@enact/ui/resolution';

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
const adjustAnchor = function (arrowAnchor, tooltipDirection, overflow, rtl) {
	if (tooltipDirection === 'above' || tooltipDirection === 'below') {
		if (rtl && arrowAnchor !== 'center') {
			arrowAnchor = arrowAnchor === 'left' ? 'right' : 'left';
		}

		// Flip sideways if it overflows to the sides
		if (overflow.isOverRight) {
			arrowAnchor = 'left';
		} else if (overflow.isOverLeft) {
			arrowAnchor = 'right';
		}

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
const adjustDirection = function (tooltipDirection, overflow, rtl) {
	if (rtl && (tooltipDirection === 'left' || tooltipDirection === 'right')) {
		tooltipDirection = tooltipDirection === 'left' ? 'right' : 'left';
	}

	// Flip tooltip if it overflows towards the tooltip direction
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
 *
 * @method
 * @memberof moonstone/TooltipDecorator
 * @param   {Object} tooltipNode        The `getBoundingClientRect` values for tooltip node
 * @param   {Object} clientNode         The `getBoundingClientRect` values for client node
 * @param   {String} tooltipDirection   Direction of tooltip
 * @param   {Number} tooltipHeight      Tooltip height
 * @returns {Object}                    Tooltip's calculated overflow
 * @private
 */
const calcOverflow = function (tooltipNode, clientNode, tooltipDirection, tooltipHeight) {
	// get the distance of space on both the right and left side of the client node. `clientNode.width / 2` because we want the tooltip to be positioned horizontally in middle of the client node.
	const rightDelta = tooltipNode.width > clientNode.left + (clientNode.width / 2);
	const leftDelta = tooltipNode.width > window.innerWidth - clientNode.right - (clientNode.width / 2);
	const isTooltipWide = (tooltipNode.width > window.innerWidth) ||
		(leftDelta && rightDelta);

	if (tooltipDirection === 'above' || tooltipDirection === 'below') {
		return {
			isOverTop: clientNode.top - tooltipNode.height - tooltipHeight < 0,
			isOverBottom: clientNode.bottom + tooltipNode.height + tooltipHeight > window.innerHeight,
			isOverLeft: clientNode.left - tooltipNode.width + clientNode.width / 2 < 0,
			isOverRight: clientNode.right + tooltipNode.width - clientNode.width / 2 > window.innerWidth,
			isOverWide: isTooltipWide
		};
	} else if (tooltipDirection === 'left' || tooltipDirection === 'right') {
		return {
			isOverTop: clientNode.top - tooltipNode.height + clientNode.height / 2 < 0,
			isOverBottom: clientNode.bottom + tooltipNode.height - clientNode.height / 2 > window.innerHeight,
			isOverLeft: clientNode.left - tooltipNode.width < 0,
			isOverRight: clientNode.right + tooltipNode.width > window.innerWidth,
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
const getPosition = function (clientNode, tooltipDirection) {
	let position = {};

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
 * @param   {Object}  tooltipNode        The `getBoundingClientRect` values for tooltip node
 * @param   {Object}  tooltipDirection   Direction of tooltip
 * @param   {Object}  tooltipPosition    Calculated tooltip position from `getPosition`
 * @param   {Object}  overflow           Tooltip's calculated overflow from `calcOverflow`
 * @param   {Boolean} rtl                RTL mode
 * @returns {Number}                     Tooltip anchor's left transform position in percentage between 0 and 1 relative to the tooltip
 * @private
 */
const getArrowPosition = function (tooltipNode, tooltipDirection, tooltipPosition, overflow, rtl) {
	const tooltipWidth = tooltipNode.width;
	const labelLeftPosition = tooltipPosition.left - (tooltipWidth / 2);
	const labelRightPosition = tooltipPosition.right + (tooltipWidth / 2) > window.innerWidth;

	if (
		overflow.isOverWide &&
		tooltipDirection !== 'left' &&
		tooltipDirection !== 'right' &&
		((labelLeftPosition < 0 && !rtl) ||
		(labelRightPosition > window.innerWidth && rtl))
	) {
		const percentageDelta = labelLeftPosition / tooltipWidth * -1;

		return percentageDelta;
	}
	return null;
};

export {
	adjustDirection,
	adjustAnchor,
	calcOverflow,
	getArrowPosition,
	getPosition
};
