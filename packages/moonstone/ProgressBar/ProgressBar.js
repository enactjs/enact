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
import compose from 'ramda/src/compose';
import React from 'react';

import Skinnable from '../Skinnable';

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

	styles: {
		css: componentCss,
		className: 'progressBar'
	},

	render: (props) => {
		return (
			<UiProgressBar
				{...props}
				css={componentCss}
			/>
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
