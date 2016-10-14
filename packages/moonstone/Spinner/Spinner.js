/**
 * Exports the {@link module:@enact/moonstone/Spinner~Spinner} component.
 *
 * @module @enact/moonstone/Spinner
 */

import kind from '@enact/core/kind';
import React, {PropTypes} from 'react';

import {MarqueeText} from '../Marquee';

import css from './Spinner.less';

/**
 * {@link module:@enact/moonstone/Spinner~Spinner} is a component that shows a spinning animation
 * to indicate that some activity is taking place.
 *
 * @class Spinner
 * @ui
 * @public
 */
const SpinnerBase = kind({
	name: 'Spinner',

	propTypes: {
		/**
		 *  When `true`, the spinner is horizontally centered, relative to its containing component.
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
		 * When `true`, the spinner is vertically centered, relative to its containing component.
		 * This option has no effect if `center` is set to `false`.
		 *
		 * @type {Boolean}
		 * @default false
		 * @public
		 */
		middle: PropTypes.bool,

		/**
		 * When `true`, the background-color is transparent.
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
		middle: false,
		transparent: false
	},

	styles: {
		css,
		className: 'spinner running'
	},

	computed: {
		marquee: ({children}) => {
			if (children) {
				return (
					<MarqueeText className={css.client} marqueeOn="render">
						{children}
					</MarqueeText>
				);
			} else {
				return null;
			}
		},
		className: ({transparent, middle, center, children, styler}) => {
			const content = children ? css.content : '';
			return styler.append(
				{transparent, middle, center, content}
			);
		}
	},

	render: ({className, marquee, ...rest}) =>  {
		delete rest.center;
		delete rest.middle;
		delete rest.transparent;

		return (
			<div {...rest} className={className}>
				<div className={css.ballDecorator}>
					<div className={`${css.ball} ${css.ball1}`} />
					<div className={`${css.ball} ${css.ball2}`} />
					<div className={`${css.ball} ${css.ball3}`} />
				</div>
				{marquee}
			</div>
		);
	}
});

export default SpinnerBase;
export {SpinnerBase as Spinner, SpinnerBase};
