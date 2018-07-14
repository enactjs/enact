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
 * @exports ProgressBarTooltip
 */

import kind from '@enact/core/kind';
import ComponentOverride from '@enact/ui/ComponentOverride';
import UiProgressBar from '@enact/ui/ProgressBar';
import Pure from '@enact/ui/internal/Pure';
import Slottable from '@enact/ui/Slottable';
import PropTypes from 'prop-types';
import compose from 'ramda/src/compose';
import React from 'react';

import Skinnable from '../Skinnable';
import {ProgressBarTooltip} from './ProgressBarTooltip';

import componentCss from './ProgressBar.less';

/**
 * Renders a moonstone-styled progress bar.
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
		 * Highlights the filled portion.
		 *
		 * @type {Boolean}
		 * @public
		 */
		highlighted: PropTypes.bool,

		/**
		 * Sets the orientation of the slider.
		 * * Values: `'horizontal'`, `'vertical'`
		 *
		 * @type {String}
		 * @default 'horizontal'
		 * @public
		 */
		orientation: PropTypes.oneOf(['horizontal', 'vertical']),

		/**
		 * The proportion of the filled portion of the bar.
		 * A value should range from `0` to `1`.
		 *
		 * @type {Number}
		 * @default 0
		 * @public
		 */
		progress: PropTypes.number,

		/**
		 * Enables the built-in tooltip.
		 *
		 * To customize the tooltip, pass either a custom tooltip component or an instance of
		 * [ProgressBarTooltip]{@link moonstone/ProgressBar.ProgressBarTooltip} with additional
		 * props configured.
		 *
		 * ```
		 * <ProgressBar
		 *   tooltip={
		 *     <ProgressBarTooltip side="after" />
		 *   }
		 * />
		 * ```
		 *
		 * The tooltip may also be passed as a child via the `"tooltip"` slot. See
		 * [Slottable]{@link ui/Slottable} for more information on how slots can be used.
		 *
		 * ```
		 * <ProgressBar>
		 *   <ProgressBarTooltip side="after" />
		 * </ProgressBar>
		 * ```
		 *
		 * @type {Boolean|Element|Function}
		 * @public
		 */
		tooltip: PropTypes.oneOfType([PropTypes.bool, PropTypes.element, PropTypes.object, PropTypes.func])
	},

	defaultProps: {
		orientation: 'horizontal',
		progress: 0
	},

	styles: {
		css: componentCss,
		publicClassNames: ['progressBar']
	},

	computed: {
		className: ({highlighted, styler}) => styler.append({highlighted}),
		tooltip: ({tooltip}) => tooltip === true ? ProgressBarTooltip : tooltip
	},

	render: ({css, orientation, progress, tooltip, ...rest}) => {
		delete rest.tooltip;
		delete rest.highlighted;

		return (
			<UiProgressBar
				{...rest}
				orientation={orientation}
				progress={progress}
				css={css}
			>
				<ComponentOverride
					component={tooltip}
					orientation={orientation}
					percent
					proportion={progress}
					visible
				/>
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
	Slottable({slots: ['tooltip']}),
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
	ProgressBarDecorator,
	ProgressBarTooltip
};
