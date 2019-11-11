/**
 * Provides Moonstone-themed indeterminate progress indicator (spinner) components and behaviors.
 *
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
import Pause from '@enact/spotlight/Pause';
import UiSpinnerBase from '@enact/ui/Spinner';
import Spotlight from '@enact/spotlight';

import $L from '../internal/$L';
import Marquee from '../Marquee';
import Skinnable from '../Skinnable';

import componentCss from './Spinner.module.less';

/**
 * A component that shows spinning balls, with optional text as children.
 *
 * @class SpinnerCore
 * @memberof moonstone/Spinner
 * @ui
 * @private
 */
const SpinnerCore = kind({
	name: 'SpinnerCore',

	propTypes: {
		css: PropTypes.object
	},

	styles: {
		css: componentCss
	},

	computed: {
		'aria-label': ({['aria-label']: aria, children}) => {
			if (aria) {
				return aria;
			} else if (!children) {
				return $L('Loading');
			}
		}
	},

	render: ({children, css, ...rest}) => (
		<div aria-live="off" role="alert" {...rest}>
			<div className={css.bg}>
				<div className={css.decorator}>
					<div className={css.fan1} />
					<div className={css.fan2} />
					<div className={css.fan3} />
					<div className={css.fan4} />
					<div className={css.cap} />
				</div>
			</div>
			{children ?
				<Marquee className={css.client} marqueeOn="render" alignment="center">
					{children}
				</Marquee> :
				null
			}
		</div>
	)
});

/**
 * The base component, defining all of the properties.
 *
 * @class SpinnerBase
 * @memberof moonstone/Spinner
 * @extends ui/Spinner.SpinnerBase
 * @ui
 * @public
 */
const SpinnerBase = kind({
	name: 'Spinner',

	propTypes: /** @lends moonstone/Spinner.SpinnerBase.prototype */ {
		/**
		 * Customizes the component by mapping the supplied collection of CSS class names to the
		 * corresponding internal Elements and states of this component.
		 *
		 * The following classes are supported:
		 *
		 * * `spinner` - The root component class, unless there is a scrim. The scrim and floating
		 *	layer can be a sibling or parent to this root "spinner" element.
		 *
		 * @type {Object}
		 * @public
		 */
		css: PropTypes.object,

		/**
		 * Customize the size of this component.
		 *
		 * Recommended usage is "medium" (default) for standalone and popup scenarios, while "small"
		 * is best suited for use inside other elements, like {@link moonstone/SlotItem.SlotItem}.
		 *
		 * @type {('medium'|'small')}
		 * @default 'medium'
		 * @public
		 */
		size: PropTypes.oneOf(['medium', 'small']),

		/**
		 * Removes the background color (making it transparent).
		 *
		 * @type {Boolean}
		 * @default false
		 * @public
		 */
		transparent: PropTypes.bool
	},

	defaultProps: {
		size: 'medium',
		transparent: false
	},

	styles: {
		css: componentCss,
		publicClassNames: 'spinner'
	},

	computed: {
		className: ({children, size, transparent, styler}) => styler.append(
			size,
			{content: !!children, transparent}
		)
	},

	render: ({children, css, ...rest}) => {
		delete rest.transparent;

		return (
			<UiSpinnerBase
				{...rest}
				css={css}
				component={SpinnerCore}
			>
				{children}
			</UiSpinnerBase>
		);
	}
});

/**
 * A higher-order component that pauses spotlight when `blockClickOn` prop is `'screen'`.
 *
 * Resumes spotlight when unmounted. However, spotlight is not paused when `blockClickOn` prop is
 * `'container'`. Blocking spotlight within the container is up to app implementation.
 *
 * @hoc
 * @memberof moonstone/Spinner
 * @ui
 * @private
 */
const SpinnerSpotlightDecorator = hoc((config, Wrapped) => {
	return class extends React.Component {
		static displayName = 'SpinnerSpotlightDecorator';

		static propTypes = /** @lends moonstone/Spinner.Spinner.prototype */ {
			/**
			 * Determines how far the click-blocking should extend.
			 *
			 * It can be either `'screen'`, `'container'`, or `null`. `'screen'` pauses spotlight.
			 * Changing this property to `'screen'` after creation is not supported.
			 *
			 * @type {String}
			 * @default null
			 * @public
			 */
			blockClickOn: PropTypes.oneOf(['screen', 'container', null])
		}

		constructor (props) {
			super(props);

			this.paused = new Pause('Spinner');
			const {blockClickOn} = props;
			const current = Spotlight.getCurrent();

			if (blockClickOn === 'screen') {
				this.paused.pause();
				if (current) {
					current.blur();
				}
			}
		}

		componentWillUnmount () {
			const {blockClickOn} = this.props;

			if (blockClickOn === 'screen') {
				Spotlight.focus();
				this.paused.resume();
			}
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
 * @mixes moonstone/Skinnable.Skinnable
 * @public
 */
const SpinnerDecorator = compose(
	Pure,
	SpinnerSpotlightDecorator,
	Skinnable
);

/**
 * A Moonstone-styled Spinner.
 *
 * @class Spinner
 * @memberof moonstone/Spinner
 * @extends moonstone/Spinner.SpinnerBase
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
