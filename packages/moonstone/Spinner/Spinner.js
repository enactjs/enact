/**
 * Exports the {@link moonstone/Spinner.Spinner} and {@link moonstone/Spinner.SpinnerBase} components.
 * The default export is {@link moonstone/Spinner.Spinner}.
 *
 * @module moonstone/Spinner
 */
import FloatingLayer from '@enact/ui/FloatingLayer';
import kind from '@enact/core/kind';
import PropTypes from 'prop-types';
import React, {Component} from 'react';
import Spotlight from '@enact/spotlight';

import {MarqueeText} from '../Marquee';

import css from './Spinner.less';

/**
 * {@link moonstone/Spinner.SpinnerCore} shows a spinning animation.
 *
 * @class SpinnerBase
 * @memberof moonstone/Spinner
 * @ui
 * @private
 */
const SpinnerCore = kind({
	name: 'SpinnerCore',

	render: ({children, ...rest}) => (
		<div aria-live="off" role="alert" {...rest}>
			<div className={css.ballDecorator}>
				<div className={`${css.ball} ${css.ball1}`} />
				<div className={`${css.ball} ${css.ball2}`} />
				<div className={`${css.ball} ${css.ball3}`} />
			</div>
			{children}
		</div>
	)
});

/**
 * {@link moonstone/Spinner.SpinnerBase} is a component that shows a spinning
 * animation to indicate that some activity is taking place.
 * Optionally, a scrim may be applied and clicks to underlying components may be blocked.
 *
 * @class SpinnerBase
 * @memberof moonstone/Spinner
 * @ui
 * @public
 */
const SpinnerBase = kind({
	name: 'Spinner',

	propTypes: /** @lends moonstone/Spinner.SpinnerBase.prototype */ {
		/**
		 * Determines how far the click-blocking should extend. It can be `'screen'`, `'container'`,
		 * or `null`. 'screen' blocks entire screen. 'container' blocks up to the nearest ancestor
		 * with absolute or relative positioning. When blockClickOn is either `'screen'` or
		 * `'container'`, a translucent scrim can be added by setting
		 * [scrim]{@link moonstone/Spinner.Spinner#scrim} prop to `true`.
		 *
		 * @type {String}
		 * @public
		 */
		blockClickOn: PropTypes.oneOf(['screen', 'container', null]),

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
		 * When `true`, sets visible translucent scrim behind spinner only when blockClickOn is
		 * `'screen'` or `'container'`. Scrim has no effect by default or when blockClickOn is `null`.
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
		scrimClassName: ({blockClickOn, scrim, styler}) => styler.join(
			{blockClickOn, scrim}
		),
		scrimType: ({scrim}) => scrim ? 'translucent' : 'transparent',
		spinnerContainerClassName: ({blockClickOn, centered, styler}) => styler.join(
			{centered, spinnerContainer: blockClickOn}
		)
	},

	render: ({blockClickOn, marquee, scrimClassName, scrimType, spinnerContainerClassName, ...rest}) =>  {
		delete rest.centered;
		delete rest.scrim;
		delete rest.transparent;

		switch (blockClickOn) {
			case 'screen': {
				return (
					<FloatingLayer noAutoDismiss open scrimType={scrimType}>
						<SpinnerCore {...rest}>
							{marquee}
						</SpinnerCore>
					</FloatingLayer>
				);
			}
			case 'container': {
				return (
					<div className={spinnerContainerClassName}>
						<div className={scrimClassName} />
						<SpinnerCore {...rest}>
							{marquee}
						</SpinnerCore>
					</div>
				);
			}
			default: {
				return (
					<SpinnerCore {...rest}>
						{marquee}
					</SpinnerCore>
				);
			}
		}
	}
});

/**
 * {@link moonstone/Spinner.Spinner} wraps {@link moonstone/Spinner.SpinnerBase}
 * to make sure spotlight is paused when `blockClickOn` prop is `'screen'`,
 * and resume spotlight when unmounted.
 * However, spotlight is not paused when `blockClickOn` prop is `'container'`. Blocking spotlight
 * within the container is up to app implementation.
 *
 * @class Spinner
 * @memberof moonstone/Spinner
 * @ui
 * @public
 */
class Spinner extends Component {
	static propTypes = /** @lends moonstone/Spinner.Spinner.prototype */ {
		/**
		 * Click event blocking type. It can be either `'screen'`, `'container'`, or `null`.
		 * 'screen' pauses spotlight.
		 *
		 * @type {String}
		 * @default null
		 * @public
		 */
		blockClickOn: PropTypes.oneOf(['screen', 'container', null])
	}

	componentWillMount () {
		const {blockClickOn} = this.props;
		if (blockClickOn === 'screen') {
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
