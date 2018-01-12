/**
 * Provides Moonstone-themed indeterminate progress indicator (spinner) components and behaviors.
 * Used for indicating to the user that something is busy and interaction is temporarily suspended.
 *
 * @example
 * <Spinner>Loading message...</Spinner>
 *
 * @module moonstone/Spinner
 * @exports Spinner
 * @exports SpinnerBase
 * @exports SpinnerDecorator
 */
import kind from '@enact/core/kind';
import hoc from '@enact/core/hoc';
import PropTypes from 'prop-types';
import Pure from '@enact/ui/internal/Pure';
import compose from 'ramda/src/compose';
import React from 'react';
import Spotlight from '@enact/spotlight';
import UiSpinnerBase from '@enact/ui/Spinner';

import $L from '../internal/$L';
import {MarqueeText} from '../Marquee';
import Skinnable from '../Skinnable';

import componentCss from './Spinner.less';

const ChildrenComponent = (props) => <MarqueeText {...props} className={componentCss.client} marqueeOn="render" alignment="center" />;

/**
 * {@link moonstone/Spinner.SpinnerCore} shows a spinning animation.
 *
 * @class SpinnerBase
 * @memberof moonstone/Spinner
 * @ui
 * @private
 */
const SpinnerCoreBase = kind({
	name: 'SpinnerCore',

	computed: {
		'aria-label': ({['aria-label']: aria, children}) => {
			if (aria) {
				return aria;
			} else if (!children) {
				return $L('Loading');
			}
		}
	},

	render: ({children, ...rest}) => (
		<div aria-live="off" role="alert" {...rest}>
			<div className={componentCss.ballDecorator}>
				<div className={`${componentCss.ball} ${componentCss.ball1}`} />
				<div className={`${componentCss.ball} ${componentCss.ball2}`} />
				<div className={`${componentCss.ball} ${componentCss.ball3}`} />
			</div>
			{children}
		</div>
	)
});

const SpinnerCoreDecorator = compose(
	Skinnable
);

const SpinnerCore = SpinnerCoreDecorator(SpinnerCoreBase);

/**
 * The base component, defining all of the properties.
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
		transparent: false
	},

	styles: {
		css: componentCss
	},

	computed: {
		className: ({transparent, styler}) => styler.append(
			{transparent}
		)
	},

	render: ({...rest}) => {
		delete rest.transparent;

		return (
			<UiSpinnerBase
				{...rest}
				childrenComponent={ChildrenComponent}
				css={componentCss}
				spinnerComponent={SpinnerCore}
			/>
		);
	}
});

/**
 * A HOC to make sure spotlight is paused when `blockClickOn` prop is `'screen'`, and resume
 * spotlight when unmounted. However, spotlight is not paused when `blockClickOn` prop is
 * `'container'`. Blocking spotlight within the container is up to app implementation.
 *
 * @class SpinnerSpotlightDecorator
 * @memberof moonstone/Spinner
 * @ui
 * @public
 */
const SpinnerSpotlightDecorator = hoc((config, Wrapped) => {
	return class extends React.Component {
		static displayName = 'SpinnerSpotlightDecorator';

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
				<Wrapped {...this.props} />
			);
		}
	};
});

/**
 * Moonstone-specific Spinner behaviors to apply to [Spinner]{@link moonstone/Spinner.Spinner}.
 *
 * @hoc
 * @memberof moonstone/Spinner
 * @mixes moonstone/Spinner.SpinnerSpotlightDecorator
 * @public
 */
const SpinnerDecorator = compose(
	Pure,
	SpinnerSpotlightDecorator
);

/**
 * A ready to use Moonstone-styled Spinner.
 *
 * @class Spinner
 * @memberof moonstone/Spinner
 * @mixes moonstone/Spinner.SpinnerDecorator
 * @ui
 * @public
 */
const Spinner = SpinnerDecorator(SpinnerBase);


export default Spinner;
export {
	Spinner,
	SpinnerBase,
	SpinnerDecorator
};
