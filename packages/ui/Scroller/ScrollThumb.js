import kind from '@enact/core/kind';
import React from 'react';
import PropTypes from 'prop-types';

import css from './ScrollThumb.less';

/**
 * {@link ui/Scroller.ScrollThumb} is a stateless ScrollThumb.
 *
 * @class ScrollThumb
 * @memberof ui/Scroller
 * @ui
 * @public
 */
const ScrollThumb = kind({
	name: 'ScrollThumb',

	propTypes: /** @lends ui/Scroller.ScrollThumb.prototype */ {
		orientation: PropTypes.oneOf(['horizontal', 'vertical']).isRequired,
		ratio: PropTypes.number.isRequired,
		value: PropTypes.number.isRequired,
		minRatio: PropTypes.number,
		onJump: PropTypes.func,
		style: PropTypes.object
	},

	defaultProps: {
		minRatio: 0.05
	},

	styles: {
		css,
		className: 'scrollThumb'
	},

	computed: {
		className: ({orientation, styler}) => styler.append(orientation),
		style: ({minRatio, ratio, style, value}) => {
			ratio = Math.max(minRatio, ratio);

			// calculates a postive or negative translate value from its center point relative to
			// the scale of the knob
			const translateValue = (value - 0.5) * (1 - ratio);

			return {
				...style,
				'--scroller-thumb-value': translateValue,
				'--scroller-thumb-ratio': ratio
			};
		}
	},

	render: ({...rest}) => {
		delete rest.orientation;
		delete rest.onJump;

		return <div {...rest} />;
	}
});

export default ScrollThumb;
export {
	ScrollThumb
};
