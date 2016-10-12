/**
 * Exports the {@link module:@enact/moonstone/Spinner~Spinner}
 *
 * @module @enact/moonstone/Spinner
 */

import kind from '@enact/core/kind';
import React, {PropTypes} from 'react';
import {MarqueeText} from '../Marquee';

import css from './Spinner.less';

/**
 * {@link module:@enact/moonstone/Spinner~Spinner} is a component that shows a
 * spinning animation indicate that some activity is taking place.
 *
 * @class Spinner
 * @ui
 * @public
 */
const SpinnerBase = kind({
	name: 'Spinner',

	propTypes: {
		/**
		 * Sets the spinner to be vertically centered, relative to its containing
		 * control.
		 *
		 * @type {Boolean}
		 * @default false
		 * @public
		 */
		center: PropTypes.bool,

		/**
		 * The optional string to be displayed as the main content of the spinner.
		 *
		 * @type {String}
		 * @public
		 */
		children: PropTypes.string,

		/**
		 * Sets the spinner to be vertically centered, relative to its containing
		 * control.
		 *
		 * @type {Boolean}
		 * @default true
		 * @public
		 */
		middle: PropTypes.bool,

		/**
		 * Sets the background-color to transparent
		 *
		 *
		 * @type {Boolean}
		 * @default false
		 * @public
		 */
		transparent: PropTypes.bool
	},

	defaultProps: {
		center: false,
		middle: true,
		transparent: false
	},

	styles: {
		css,
		className: 'spinner running'
	},

	computed: {
		displayMarquee: ({children}) => children ? {} : {display: 'none'},
		className: ({transparent, middle, center, children, styler}) => {
			const content = children ? css.content : '';
			return styler.append(
				{transparent, middle, center, content},
			);
		}
	},

	render: ({className, children, displayMarquee}) =>  (
		<div className={className}>
			<div className={css.spinnerBallDecorator}>
				<div className={`${css.spinnerBall} ${css.spinnerBall1}`} />
				<div className={`${css.spinnerBall} ${css.spinnerBall2}`} />
				<div className={`${css.spinnerBall} ${css.spinnerBall3}`} />
			</div>
			<MarqueeText
				style={displayMarquee}
				className={css.spinnerClient}
			>
				{children}
			</MarqueeText>
		</div>
	)
});

export default SpinnerBase;
export {SpinnerBase as Spinner, SpinnerBase};
