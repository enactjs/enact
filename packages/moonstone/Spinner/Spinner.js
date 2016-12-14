/**
 * Exports the {@link moonstone/Spinner.Spinner} component.
 *
 * @module moonstone/Spinner
 */

import kind from '@enact/core/kind';
import React, {PropTypes} from 'react';

import {MarqueeText} from '../Marquee';

import css from './Spinner.less';

/**
 * {@link moonstone/Spinner.Spinner} is a component that shows a spinning animation
 * to indicate that some activity is taking place.
 *
 * @class Spinner
 * @memberof moonstone/Spinner
 * @ui
 * @public
 */
const SpinnerBase = kind({
	name: 'Spinner',

	propTypes: /** @lends moonstone/Spinner.Spinner.prototype */ {
		/**
		 *  When `true`, the spinner is horizontally and vertically centered, relative to its
		 *  containing component.
		 *
		 * @type {Boolean}
		 * @default false
		 * @public
		 */
		centered: PropTypes.bool,

		/**
		 * The optional string to be displayed as the main content of the spinner.
		 *
		 * @type {String}
		 * @public
		 */
		children: PropTypes.string,

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
		centered: false,
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
		className: ({transparent, centered, children, styler}) => {
			const content = children ? css.content : '';
			return styler.append(
				{transparent, centered, content}
			);
		}
	},

	render: ({marquee, ...rest}) =>  {
		delete rest.centered;
		delete rest.transparent;

		return (
			<div {...rest}>
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
