import {is} from '@enact/core/keymap';

const constants = {
	epsilon: 1,
	isPageDown: is('pageDown'),
	isPageUp: is('pageUp'),
	nop: () => {},
	paginationPageMultiplier: 0.8,
	scrollWheelPageMultiplierForMaxPixel: 0.2 // The ratio of the maximum distance scrolled by wheel to the size of the viewport.
};

export default constants;
