/*
 * Exports a number of methods for use with {@link ui/ViewManager}.
 */

import curry from '@enact/core/internal/fp/curry';

export const transform = curry((action, spec, {node}) => {
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

const slideInOut = curry((direction, total, orientation, config) => {
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

export const reverse = curry((fn, {reverseTransition, percent, ...rest}) => {
	fn({
		...rest,
		percent: reverseTransition ? 1 - percent : percent,
		reverseTransition
	});
});

export const startAfter = curry((startPercent, fn, config) => {
	const {percent, ...rest} = config;
	const p = (percent >= startPercent) ? (percent - startPercent) / (1 - startPercent) : 0;
	fn({
		...rest,
		percent: p
	});
});

export const endBy = curry((endPercent, fn, config) => {
	const {percent, ...rest} = config;
	const p = (percent <= endPercent) ? percent / endPercent : 1;
	fn({
		...rest,
		percent: p
	});
});

export const ease = curry((easing, fn, config) => {
	const {percent, ...rest} = config;
	fn({
		...rest,
		percent: easing(percent)
	});
});

export const compose = (...arrangers) => (...args) => {
	arrangers.forEach(fn => fn(...args));
};
