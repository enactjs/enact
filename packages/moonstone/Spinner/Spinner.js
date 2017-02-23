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
 * {@link moonstone/Spinner.SpinnerBase} is a component that shows a spinning animation
 * to indicate that some activity is taking place.
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

/**
 * {@link moonstone/Spinner.Spinner} is an extension of {@link moonstone/Spinner.SpinnerBase} that can block click/spot events.
 * {@link ui/FloatingLayer.FloatingLayer} is used to block the whole screen.
 *
 * @class Spinner
 * @memberof moonstone/Spinner
 * @ui
 * @public
 */
class Spinner extends Component {
	static propTypes = {
		/**
		 * Click event blocking type. It can be either `'screen'`, `'container'`, or `'none'`.
		 * 'screen' blocks entire screen; 'container' blocks up to the nearest ancestor with absolute or relative positioning
		 *
		 * @type {String}
		 * @default null
		 * @public
		 */
		blockClick: PropTypes.oneOf(['screen', 'container', null]),

		/**
		 * When `true`, sets visible translucent scrim behind spinner.
		 *
		 * @type {Boolean}
		 * @default true
		 * @public
		 */
		scrim: PropTypes.bool
	}

	static defaultProps = {
		blockClick: null,
		scrim: true
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
		const {blockClick, scrim, ...rest} = this.props;
		const scrimTranslucent = scrim ? css.scrimTranslucent : '';
		const spinnerContainerPosition = rest.centered ? css.blockClick : '';

		switch (blockClick) {
			case 'screen': {
				return (
					<FloatingLayer noAutoDismiss open scrimType={scrim ? 'translucent' : 'transparent'}>
						<SpinnerBase {...rest} />
					</FloatingLayer>
				);
			}
			case 'container': {
				return (
					<div className={`${css.spinnerContainer} ${spinnerContainerPosition}`}>
						<div className={`${css.blockClick} ${scrimTranslucent}`} />
						<SpinnerBase {...rest} />
					</div>
				);
			}
			default: {
				return (
					<SpinnerBase {...rest} />
				);
			}
		}
	}
}

export default Spinner;
export {Spinner, SpinnerBase};
