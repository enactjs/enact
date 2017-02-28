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
		 * Determines how far the click-blocking should extend. It can be `'screen'`, `'container'`,
		 * or `null`. 'screen' blocks entire screen. 'container' blocks up to the nearest ancestor
		 * with absolute or relative positioning. When blockClick is either `'screen'` or
		 * `'container'`, a translucent scrim can be added by setting
		 * [scrim]{@link moonstone/Spinner.Spinner#scrim} prop to `true`.
		 *
		 * @type {String}
		 * @public
		 */
		blockClick: PropTypes.oneOf(['screen', 'container', null]),

		/**
		 * When `true`, the spinner is horizontally and vertically centered, relative to its
		 * containing component.
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
		 * When `true`, sets visible translucent scrim behind spinner only when blockClick is
		 * `'screen'` or `'container'`. Scrim has no effect by default or when blockClick is `null`.
		 *
		 * @type {Boolean}
		 * @default false
		 * @public
		 */
		scrim: PropTypes.bool,

		/**
		 * When `true`, the background-color  of the spinner is transparent.
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
		className: ({transparent, centered, children, styler}) => styler.append(
			{transparent, centered, content: children}
		),
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
		scrimClassName: ({blockClick, scrim, styler}) => styler.join(
			{blockClick, scrim}
		),
		scrimType: ({scrim}) => scrim ? 'translucent' : 'transparent',
		spinnerContainerClassName: ({blockClick, centered, styler}) => styler.join(
			{centered, spinnerContainer: blockClick}
		)
	},

	render: ({blockClick, marquee, scrimClassName, scrimType, spinnerContainerClassName, ...rest}) =>  {
		delete rest.centered;
		delete rest.scrim;
		delete rest.transparent;

		const SpinnerCore = () => (
			<div {...rest}>
				<div className={css.ballDecorator}>
					<div className={`${css.ball} ${css.ball1}`} />
					<div className={`${css.ball} ${css.ball2}`} />
					<div className={`${css.ball} ${css.ball3}`} />
				</div>
				{marquee}
			</div>
		);

		switch (blockClick) {
			case 'screen': {
				return (
					<FloatingLayer noAutoDismiss open scrimType={scrimType}>
						<SpinnerCore />
					</FloatingLayer>
				);
			}
			case 'container': {
				return (
					<div className={spinnerContainerClassName}>
						<div className={scrimClassName} />
						<SpinnerCore />
					</div>
				);
			}
			default: {
				return <SpinnerCore />;
			}
		}
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
