/**
 * Provides Moonstone-themed progress bar component.
 *
 * @example
 * <ProgressBar progress={0.5} backgroundProgress={0.75} />
 *
 * @module moonstone/ProgressBar
 * @exports ProgressBar
 * @exports ProgressBarBase
 * @exports ProgressBarDecorator
 */

import kind from '@enact/core/kind';
import UiProgressBar from '@enact/ui/ProgressBar';
import Pure from '@enact/ui/internal/Pure';
import PropTypes from 'prop-types';
import compose from 'ramda/src/compose';
import React from 'react';

import Skinnable from '../Skinnable';
import {SliderTooltip} from '../Slider';

import componentCss from './ProgressBar.less';

/**
 * Renders a moonstone-styled ProgressBar.
 *
 * @class ProgressBarBase
 * @memberof moonstone/ProgressBar
 * @ui
 * @public
 */
const ProgressBarBase = kind({
	name: 'ProgressBar',

	propTypes: /** @lends moonstone/ProgressBar.ProgressBarBase.prototype */ {
		/**
		 * Customizes the component by mapping the supplied collection of CSS class names to the
		 * corresponding internal Elements and states of this component.
		 *
		 * The following classes are supported:
		 *
		 * * `progressBar` - The root component class
		 *
		 * @type {Object}
		 * @public
		 */
		css: PropTypes.object,

		/**
		 * When `true`, adds an `emphasized` class to the progress bar.
		 *
		 * @type {Boolean}
		 * @public
		 */
		emphasized: PropTypes.bool,

		/**
		 * Enables the built-in tooltip, whose behavior can be modified by the other tooltip
		 * properties.
		 *
		 * @type {Boolean}
		 * @public
		 */
		percentageTooltip: PropTypes.bool,

		/**
		 * The proportion of the filled portion of the progress bar. Valid values are
		 * between `0` and `1`.
		 *
		 * @type {Number}
		 * @default 0
		 * @public
		 */
		progress: PropTypes.number,

		/**
		 * If `true` the progress bar will be oriented vertically.
		 *
		 * @type {Boolean}
		 * @default false
		 * @public
		 */
		vertical: PropTypes.bool
	},

	styles: {
		css: componentCss,
		publicClassNames: ['progressBar']
	},

	computed: {
		className: ({emphasized, styler}) => styler.append({emphasized})
	},

	render: ({css, progress, percentageTooltip, vertical, ...rest}) => {
		let tooltipComponent = null;

		if (percentageTooltip) {
			const percentageText = (progress * 100) + '%';
			const tooltipPosition = vertical ? {top: '0', transform: 'translate(-1rem, -50%)'} : {left: `${percentageText}`, bottom: '1rem'};

			tooltipComponent = <SliderTooltip
				style={tooltipPosition}
				vertical={vertical}
			>
				{percentageText}
			</SliderTooltip>;
		}

		return (
			<UiProgressBar
				{...rest}
				css={css}
				progress={progress}
				vertical={vertical}
			>
				{tooltipComponent}
			</UiProgressBar>
		);
	}
});

/**
 * Moonstone-specific behaviors to apply to [ProgressBar]{@link moonstone/ProgressBar.ProgressBarBase}.
 *
 * @hoc
 * @memberof moonstone/ProgressBar
 * @mixes ui/Skinnable.Skinnable
 * @public
 */
const ProgressBarDecorator = compose(
	Pure,
	Skinnable
);

/**
 * The ready-to-use Moonstone-styled ProgressBar.
 *
 * @class ProgressBar
 * @memberof moonstone/ProgressBar
 * @extends moonstone/ProgressBar.ProgressBarBase
 * @mixes moonstone/ProgressBar.ProgressBarDecorator
 * @ui
 * @public
 */
const ProgressBar = ProgressBarDecorator(ProgressBarBase);


export default ProgressBar;
export {
	ProgressBar,
	ProgressBarBase,
	ProgressBarDecorator
};
