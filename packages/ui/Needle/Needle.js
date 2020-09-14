/**
 * Provides Moonstone-themed dial-like gauge component.
 *
 * @example
 * <Needle progress={0.5} backgroundProgress={0.75} />
 *
 * @module moonstone/Needle
 * @exports Needle
 * @exports NeedleBase
 * @exports NeedleDecorator
 */

import kind from '@enact/core/kind';
import UiProgressBar from '../ProgressBar';
import PropTypes from 'prop-types';
import React from 'react';

import componentCss from './Needle.module.less';

/**
 * Renders a moonstone-styled progress bar.
 *
 * @class NeedleBase
 * @memberof moonstone/Needle
 * @ui
 * @public
 */
const NeedleBase = kind({
	name: 'ui:Needle',

	propTypes: /** @lends moonstone/Needle.NeedleBase.prototype */ {
		counterclockwise: PropTypes.bool,
		/**
		 * Customizes the component by mapping the supplied collection of CSS class names to the
		 * corresponding internal Elements and states of this component.
		 *
		 * The following classes are supported:
		 *
		 * * `Needle` - The root component class
		 *
		 * @type {Object}
		 * @public
		 */
		css: PropTypes.object,

		degrees: PropTypes.number,

		/**
		 * Highlights the filled portion.
		 *
		 * @type {Boolean}
		 * @public
		 */
		highlighted: PropTypes.bool,

		/**
		 * Sets the orientation of the slider.
		 *
		 * * Values: `'horizontal'`, `'vertical'`
		 *
		 * @type {String}
		 * @default 'horizontal'
		 * @public
		 */
		orientation: PropTypes.oneOf(['radial']),

		/**
		 * A number between `0` and `1` indicating the proportion of the filled portion of the bar.
		 *
		 * @type {Number}
		 * @default 0
		 * @public
		 */
		progress: PropTypes.number,

		scale: PropTypes.number,
		src: PropTypes.string,
		startDegree: PropTypes.number
	},

	defaultProps: {
		degrees: 360,
		orientation: 'radial',
		progress: 0,
		scale: 1,
		startDegree: 0
	},

	styles: {
		css: componentCss,
		className: 'needle',
		publicClassNames: true
	},

	computed: {
		className: ({highlighted, styler}) => styler.append({highlighted}),
		style: ({counterclockwise, degrees, startDegree, scale, src, style}) => ({
			'--needle-range-degrees': (degrees * (counterclockwise ? -1 : 1)),
			'--needle-scale': scale,
			'--needle-src': (src ? `url("${src}")` : null),
			'--needle-start-degree': startDegree,
			...style
		})
	},

	render: ({css, orientation, progress, ...rest}) => {
		delete rest.counterclockwise;
		delete rest.degrees;
		delete rest.highlighted;
		delete rest.src;
		delete rest.startDegree;

		return (
			<UiProgressBar
				{...rest}
				orientation={orientation}
				progress={progress}
				css={css}
			/>
		);
	}
});

export default NeedleBase;
export {
	NeedleBase as Needle,
	NeedleBase
};
