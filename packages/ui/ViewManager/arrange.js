/**
 * Exports a number of methods for use with {@link ui/ViewManager}.
 *
 * @private
 * @module ui/ViewManager/arrange
 */

import rCurry from 'ramda/src/curry';
import rApply from 'ramda/src/apply';
import r__ from 'ramda/src/__';

export const transform = rCurry((action, spec, {node}) => {
	const current = node.style.transform;
	let next = current;
	if (!current || action === 'replace') {
		next = spec;
	} else if (action === 'append') {
		next = current + ' ' + spec;
	} else if (action === 'prepend') {
		next = spec + ' ' + current;
	}

	node.style.transform = next;
});

export const appendTransform = transform('append');
export const prependTransform = transform('prepend');
export const replaceTransform = transform('replace');
export const clearTransform = transform('replace', '');

export const fadeOut = ({node, percent}) => {
	node.style.opacity = 1 - percent;
};

export const fadeIn = ({node, percent}) => {
	node.style.opacity = percent;
};

export const accelerate = prependTransform('translateZ(0)');

const slideInOut = rCurry((direction, total, orientation, config) => {
	const {percent} = config;
	const p = total * (direction === 'out' ? percent : 1 - percent);

	let spec =	orientation === 'top'    && 'translateY(' + -p + '%)' ||
				orientation === 'bottom' && 'translateY(' + p + '%)'  ||
				orientation === 'left'   && 'translateX(' + -p + '%)' ||
				orientation === 'right'  && 'translateX(' + p + '%)';

	appendTransform(spec, config);
});

export const slideInPartial = slideInOut('in');
export const slideOutPartial = slideInOut('out');

export const slideIn = slideInPartial(100);
export const slideOut = slideOutPartial(100);

export const reverse = rCurry((fn, {reverseTransition, percent, ...rest}) => {
	fn({
		...rest,
		percent: reverseTransition ? 1 - percent : percent,
		reverseTransition
	});
});

export const startAfter = rCurry((startPercent, fn, config) => {
	const {percent, ...rest} = config;
	const p = (percent >= startPercent) ? (percent - startPercent) / (1 - startPercent) : 0;
	fn({
		...rest,
		percent: p
	});
});

export const endBy = rCurry((endPercent, fn, config) => {
	const {percent, ...rest} = config;
	const p = (percent <= endPercent) ? percent / endPercent : 1;
	fn({
		...rest,
		percent: p
	});
});

export const ease = rCurry((easing, fn, config) => {
	const {percent, ...rest} = config;
	fn({
		...rest,
		percent: easing(percent)
	});
});

export const compose = (...arrangers) => (...args) => {
	arrangers.forEach(rApply(r__, args));
};
