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
const calcOverflow = function (tooltipNode, clientNode, tooltipDirection, tooltipHeight, edgeKeepout) {
	// get the distance of space on both the right and left side of the client node. `clientNode.width / 2` because we want the tooltip to be positioned horizontally in middle of the client node.
	const rightDelta = tooltipNode.width + edgeKeepout > clientNode.left + (clientNode.width / 2);
	const leftDelta = tooltipNode.width + edgeKeepout > window.innerWidth - clientNode.right - (clientNode.width / 2);
	const isTooltipWide = (tooltipNode.width + edgeKeepout > window.innerWidth) ||
		(leftDelta && rightDelta);

	if (tooltipDirection === 'above' || tooltipDirection === 'below') {
		return {
			isOverTop: clientNode.top - tooltipNode.height - tooltipHeight < 0,
			isOverBottom: clientNode.bottom + tooltipNode.height + tooltipHeight > window.innerHeight,
			isOverLeft: clientNode.left - tooltipNode.width + edgeKeepout + clientNode.width / 2 < 0,
			isOverRight: clientNode.right + tooltipNode.width + edgeKeepout - clientNode.width / 2 > window.innerWidth,
			isOverCenterLeft: (clientNode.left + clientNode.width / 2) - (tooltipNode.width / 2) - edgeKeepout < 0,
			isOverCenterRight: (clientNode.right + clientNode.width / 2) + (tooltipNode.width / 2) - edgeKeepout > window.innerWidth,
			isOverWide: isTooltipWide
		};
	} else if (tooltipDirection === 'left' || tooltipDirection === 'right') {
		return {
			isOverTop: clientNode.top - tooltipNode.height + clientNode.height / 2 < 0,
			isOverBottom: clientNode.bottom + tooltipNode.height - clientNode.height / 2 > window.innerHeight,
			isOverLeft: clientNode.left - tooltipNode.width - edgeKeepout < 0,
			isOverRight: clientNode.right + tooltipNode.width - edgeKeepout > window.innerWidth,
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
const getLabelOffset = function (tooltipNode, tooltipDirection, tooltipPosition, overflow, rtl, edgeKeepout) {
	// This method is irrelevent to left and right anchored tooltips, skip entirely.
	if (tooltipDirection !== 'left' && tooltipDirection !== 'right') {
		const tooltipWidth = tooltipNode.width;
		const labelLeftPosition = tooltipPosition.left - tooltipWidth; // Values representing if the tooltip was at the most extreme bounds possible
		const labelRightPosition = tooltipPosition.left + tooltipWidth; // Values representing if the tooltip was at the most extreme bounds possible

		//
		//
		//
		// Figure out why the offsets don't line up and why it's not on the true edge of the moonstone space.
		//
		//
		// const edgeKeepout = ri.scale(30 + 12 + 12); // Tooltip padding-left + spotlight-offset + app-keepout.
		// const edgeKeepout = ri.scale(12 + 12); // Tooltip padding-left + spotlight-offset + app-keepout.
		// const edgeKeepout = 0; // Tooltip padding-left + spotlight-offset + app-keepout.

		// console.log('getLabelOffset:', tooltipDirection, Math.round(tooltipWidth), Math.round(labelLeftPosition), Math.round(labelRightPosition));
		if (
			overflow.isOverWide ||
			(
				((labelLeftPosition - (tooltipWidth / 2)) < 0) ||
				((labelRightPosition - (tooltipWidth / 2)) > window.innerWidth)
			)
			// ((labelLeftPosition < 0 && !rtl) ||
			// (labelRightPosition > window.innerWidth && rtl))
		) {
			let labelOffset;
			// if (
			// 	labelLeftPosition <
			// 	window.innerWidth - labelRightPosition
			// ) {
			// Position the majority of the tooltip more to the right
			// console.log('more to the right');
			labelOffset = ((labelLeftPosition + (tooltipWidth / 2) - edgeKeepout) / tooltipWidth) * -1;
			// } else {
			// 	// Position the majority of the tooltip more to the left
			// 	console.log('more to the left');
			// 	labelOffset = (((labelRightPosition - window.innerWidth) - (tooltipWidth / 2) + edgeKeepout) / tooltipWidth) * -1;
			// }

			// Uh oh! we're too near the edge!
			// determine the current percentage of the width that makes up the radius and the arrow width
			const arrowWidth = (15 / 2);
			const tooltipUnavailableEdge = ri.scale((54 / 2) + arrowWidth);
			const tooltipUnavaliablePercentage = tooltipUnavailableEdge / tooltipWidth;

			// cap the offset at 50% - that percentage
			labelOffset = Math.max(-0.5 + tooltipUnavaliablePercentage, Math.min(0.5 - tooltipUnavaliablePercentage, labelOffset));

			// const labelOffset = tooltipPosition.left / tooltipWidth * -1;
			// const labelOffset = labelLeftPosition / tooltipWidth * -1;
			// console.log('labelOffset:', (Math.round(labelOffset * 10000) / 100) + '%');

			return labelOffset;
		}
	}
	return null;
};

export {
	adjustDirection,
	adjustAnchor,
	calcOverflow,
	getLabelOffset,
	getPosition
};
