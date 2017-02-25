/**
 * Exports the {@link moonstone/Spinner.Spinner} component.
 *
 * @module moonstone/Spinner
 */
import FloatingLayer from '@enact/ui/FloatingLayer';
import kind from '@enact/core/kind';
import React, {Component, PropTypes} from 'react';
import Spotlight from '@enact/spotlight';
import {MarqueeText} from '../Marquee';

import css from './Spinner.less';

/**
 * {@link moonstone/Spinner.SpinnerBase} is a component that shows a spinning
 * animation to indicate that some activity is taking place.
 * {@link ui/FloatingLayer.FloatingLayer} is used to block the whole screen.
 *
 * @class SpinnerBase
 * @memberof moonstone/Spinner
 * @ui
 * @public
 */
const SpinnerBase = kind({
	name: 'Spinner',

	propTypes: /** @lends moonstone/Spinner.Spinner.prototype */ {
		/**
		 * Click event blocking type. It can be either `'screen'`, `'container'`, or `null`.
		 * 'screen' blocks entire screen; 'container' blocks up to the nearest ancestor with absolute
		 * or relative positioning
		 *
		 * @type {String}
		 * @default null
		 * @public
		 */
		blockClick: PropTypes.oneOf(['screen', 'container', null]),

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
		 * When `true`, sets visible translucent scrim behind spinner.
		 *
		 * @type {Boolean}
		 * @default true
		 * @public
		 */
		scrim: PropTypes.bool,

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
		scrim: false,
		transparent: false
	},

	styles: {
		css,
		className: 'spinner running'
	},

	computed: {
		className: ({transparent, centered, children, styler}) => {
			const content = children ? css.content : '';
			return styler.append(
				{transparent, centered, content}
			);
		},
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
		spinnerScrimDecorator: ({blockClick, centered, scrim}) => {
			const scrimDecorator = (spinner) => {
				switch (blockClick) {
					case 'screen': {
						return (
							<FloatingLayer noAutoDismiss open scrimType={scrim ? 'translucent' : 'transparent'}>
								{spinner}
							</FloatingLayer>
						);
					}
					case 'container': {
						return (
							<div className={`${centered ? css.blockClick : css.blockClickContainer}`}>
								<div className={`${css.blockClick} ${scrim ? css.scrimTranslucent : null}`} />
								{spinner}
							</div>
						);
					}
					default: {
						return spinner;
					}
				}
			};

			return scrimDecorator;
		}
	},

	render: ({marquee, spinnerScrimDecorator, ...rest}) =>  {
		delete rest.blockClick;
		delete rest.centered;
		delete rest.scrim;
		delete rest.transparent;

		const spinner = (
			<div {...rest}>
				<div className={css.ballDecorator}>
					<div className={`${css.ball} ${css.ball1}`} />
					<div className={`${css.ball} ${css.ball2}`} />
					<div className={`${css.ball} ${css.ball3}`} />
				</div>
				{marquee}
			</div>
		);

		return spinnerScrimDecorator(spinner);
	}
});

/**
 * {@link moonstone/Spinner.Spinner} wraps {@link moonstone/Spinner.SpinnerBase}
 * to make sure spotlight is paused when `blockClick` prop is `'screen'`,
 * and resume spotlight when unmounted.
 *
 * @class Spinner
 * @memberof moonstone/Spinner
 * @ui
 * @public
 */
class Spinner extends Component {
	static propTypes = {
		/**
		 * Click event blocking type. It can be either `'screen'`, `'container'`, or `null`.
		 * 'screen' pauses spotlight.
		 *
		 * @type {String}
		 * @default null
		 * @public
		 */
		blockClick: PropTypes.oneOf(['screen', 'container', null])
	}

	componentWillMount () {
		const {blockClick} = this.props;
		if (blockClick === 'screen') {
			Spotlight.pause();
		}
	}

	componentWillUnmount () {
		Spotlight.resume();
	}

	render () {
		return (
			<SpinnerBase {...this.props} />
		);
	}
}

export default Spinner;
export {Spinner, SpinnerBase};
