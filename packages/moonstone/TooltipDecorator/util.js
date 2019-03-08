// TooltipDecorator util.js
//

/**
 * Adjust anchor position for `Tooltip` based on overflow and rtl.
 * Takes the output of `adjustDirection`, and `calcOverflow`.
 *
 * @method
 * @memberof moonstone/TooltipDecorator
 * @param   {String}  arrowAnchor		Initial anchor position
 * @param   {String}  tooltipDirection	Direction of tooltip; value from `adjustDirection`
 * @param   {Object}  overflow			Tooltip's calculated overflow from `calcOverflow`
 * @param   {Boolean} rtl				RTL mode
 * @returns {String}					Adjusted anchor position
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
 * @param   {Object}  overflow			Tooltip's calculated overflow from `calcOverflow`
 * @param   {Boolean} rtl				RTL mode
 * @returns {String}					Adjusted tooltip direction
 * @private
 */
const adjustDirection = function (tooltipDirection, overflow, rtl) {
	if (rtl && (tooltipDirection === 'left' || tooltipDirection === 'right')) {
		tooltipDirection = tooltipDirection === 'left' ? 'right' : 'left';
	}

	// Flip tooltip if it overlows towards the tooltip direction
	if (overflow.isOverTop && tooltipDirection === 'above') {
		tooltipDirection = 'below';
	} else if (overflow.isOverBottom && tooltipDirection === 'below') {
		tooltipDirection = 'above';
	} else if (overflow.isOverLeft && tooltipDirection === 'left') {
		tooltipDirection = 'right';
	} else if (overflow.isOverRight && tooltipDirection === 'right') {
		tooltipDirection = 'left';
	}

	return tooltipDirection;
};

/**
 * Calculates the overflow of `Tooltip` — if `Tooltip` is at the edge of the viewport.
 *
 * @method
 * @memberof moonstone/TooltipDecorator
 * @param   {Object} tooltipNode		The `getBoundingClientRect` values for tooltip node
 * @param   {Object} clientNode			The `getBoundingClientRect` values for client node
 * @param   {String} tooltipDirection	Direction of tooltip
 * @param   {Number} tooltipHeight		Tooltip height
 * @returns {Object} 					Tooltip's calculated overflow
 * @private
 */
const calcOverflow = function (tooltipNode, clientNode, tooltipDirection, tooltipHeight) {
	if (tooltipDirection === 'above' || tooltipDirection === 'below') {
		return {
			isOverTop: clientNode.top - tooltipNode.height - tooltipHeight < 0,
			isOverBottom: clientNode.bottom + tooltipNode.height + tooltipHeight > window.innerHeight,
			isOverLeft: clientNode.left - tooltipNode.width + clientNode.width / 2 < 0,
			isOverRight: clientNode.right + tooltipNode.width - clientNode.width / 2 > window.innerWidth
		};
	} else if (tooltipDirection === 'left' || tooltipDirection === 'right') {
		return {
			isOverTop: clientNode.top - tooltipNode.height + clientNode.height / 2 < 0,
			isOverBottom: clientNode.bottom + tooltipNode.height - clientNode.height / 2 > window.innerHeight,
			isOverLeft: clientNode.left - tooltipNode.width < 0,
			isOverRight: clientNode.right + tooltipNode.width > window.innerWidth
		};
	}
};

/**
 * Calculates the top and left position for `Tooltip`.
 * Takes the output of `adjustAnchor`, `adjustDirection`, and `calcOverflow`.
 *
 * @method
 * @memberof moonstone/TooltipDecorator
 * @param   {Object} tooltipNode		The `getBoundingClientRect` values for tooltip node
 * @param   {Object} clientNode			The `getBoundingClientRect` values for client node
 * @param   {String} arrowAnchor		Anchor position from `adjustAnchor`
 * @param   {String} tooltipDirection	Direction of tooltip
 * @param   {Number} tooltipHeight		Tooltip height
 * @returns {Object}					Tooltip top and left position
 * @private
 */
const getPosition = function (tooltipNode, clientNode, arrowAnchor, tooltipDirection, tooltipHeight) {
	let position = {};

	switch (tooltipDirection) {
		case 'above':
			position.top = clientNode.top - tooltipNode.height - tooltipHeight;
			break;
		case 'below':
			position.top = clientNode.bottom + tooltipHeight;
			break;
		case 'right':
			position.left = clientNode.right + tooltipHeight;
			break;
		case 'left':
			position.left = clientNode.left - tooltipNode.width - tooltipHeight;
			break;
		default:
			position = {};
	}

	if (tooltipDirection === 'above' || tooltipDirection === 'below') {
		position.left = clientNode.left + clientNode.width / 2;

		if (arrowAnchor === 'left') {
			position.left -= tooltipNode.width;
		} else if (arrowAnchor === 'center') {
			position.left -= tooltipNode.width / 2;
		}
	} else if (tooltipDirection === 'left' || tooltipDirection === 'right') {
		position.top = clientNode.top + clientNode.height / 2;

		if (arrowAnchor === 'top') {
			position.top -= tooltipNode.height;
		} else if (arrowAnchor === 'middle') {
			position.top -= tooltipNode.height / 2;
		}
	}

	return position;
};

export {
	adjustDirection,
	adjustAnchor,
	calcOverflow,
	getPosition
};
