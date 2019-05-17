/*
 * Exports a number of pre-defined arrangers for use with {@link ui/ViewManager}.
 * note: not jsdoc on purpose
 */

import PropTypes from 'prop-types';

const slideInOut = (direction, total, orientation) => {
	const p = direction === 'out' ? total : -total;

	return	orientation === 'top'    && 'translateY(' + -p + '%)' ||
			orientation === 'bottom' && 'translateY(' + p + '%)'  ||
			orientation === 'left'   && 'translateX(' + -p + '%)' ||
			orientation === 'right'  && 'translateX(' + p + '%)';
};

export const arrange = ({duration, node, reverse}, keyframes, options) => {
	return node.animate(keyframes, {
		duration,
		direction: reverse ? 'reverse' : 'normal',
		fill: 'forwards',
		...options
	});
};

/**
 * A function that generates an animation for a given transition configuration
 *
 * @callback ArrangerCallback
 * @param {Object} config                                      - Animation configuration object.
 * @param {Number} config.duration                             - Duration of the animation in ms.
 * @param {('forwards'|'backwards'|'both'|'none')} config.fill - Animation effect should be
 *                                                               reflected by previous state or
 *                                                               retained after animation.
 * @param {Number} config.from                                 - Index from which the ViewManager is
 *                                                               transitioning.
 * @param {Node} config.node                                   - DOM node to be animated.
 * @param {Boolean} config.reverse                             - `true` when the animation should be
 *                                                               reversed.
 * @param {Number} config.to                                   - Index to which the ViewManager is
 *                                                               transitioning.
 * @returns {Animation} An `Animation`-compatible object
 * @public
 * @memberof ui/ViewManager
 */

/**
 * An object with callback functions to arrange views within {@link ui/ViewManager.ViewManager}.
 *
 * @typedef {Object} Arranger
 * @property {ArrangerCallback} enter  - Returns an array of keyframes describing the animation when
 *                                       a view is entering the viewport.
 * @property {ArrangerCallback} leave  - Returns an array of keyframes describing the animation when
 *                                       a view is leaving the viewport.
 * @property {ArrangerCallback} [stay] - Returns an array of keyframes describing the animation when
 *                                       a view is remaining in the viewport.
 * @public
 * @memberof ui/ViewManager
 */

/**
 * A basic arranger factory that must be configured with `direction` and optionally an `amount`.
 *
 * @function
 * @memberof ui/ViewManager
 * @param {Object}                          config              - Configuration object.
 * @param {Object}                          [config.amount=100] - Amount, as a whole number, to
 *                                                                "slide" where 100 is the entire
 *                                                                size of the node along the axis of
 *                                                                the `direction`.
 * @param {('bottom'|'left'|'right'|'top')} config.direction    - Direction from which the view will
 *                                                                transition.
 * @returns {Arranger}            An arranger
 * @public
 */
export const SlideArranger = ({amount = 100, direction}) => ({
	enter: (config) => arrange(config, [
		{transform: slideInOut('in', amount, direction)},
		{transform: slideInOut('in', 0, direction)}
	]),
	leave: (config) => arrange(config, [
		{transform: slideInOut('out', 0, direction)},
		{transform: slideInOut('out', amount, direction)}
	])
});

/**
 * An arranger that enters from the left and leaves to the right.
 *
 * @type {Arranger}
 * @memberof ui/ViewManager
 * @public
 */
export const SlideRightArranger = SlideArranger({direction: 'right'});

/**
 * An arranger that enters from the right and leaves to the left..
 *
 * @type {Arranger}
 * @memberof ui/ViewManager
 * @public
 */
export const SlideLeftArranger = SlideArranger({direction: 'left'});

/**
 * An arranger that enters from the bottom and leaves to the top..
 *
 * @type {Arranger}
 * @memberof ui/ViewManager
 * @public
 */
export const SlideTopArranger = SlideArranger({direction: 'top'});

/**
 * An arranger that enters from the top and leaves to the bottom..
 *
 * @type {Arranger}
 * @memberof ui/ViewManager
 * @public
 */
export const SlideBottomArranger = SlideArranger({direction: 'bottom'});

/**
 * propType validation for Arranger transitions
 * @memberof ui/ViewManager
 * @private
 */
export const shape = PropTypes.shape({
	enter: PropTypes.func,
	leave: PropTypes.func
});
