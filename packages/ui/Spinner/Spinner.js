/**
 * An unstyled indeterminate progress indicator (Spinner) component to be customized by a
 * theme or application.
 *
 * Basically, this positions your `Spinner` component where you want it on the
 * screen, and hooks into the interaction blocking code and scrim management.
 *
 * The theme using this component must supply a `component` element which follows the requirements
 * listed by the [component]{@link ui/Spinner.Spinner.component} prop documentation.
 *
 * @module ui/Spinner
 * @exports Spinner
 */

import kind from '@enact/core/kind';
import EnactPropTypes from '@enact/core/internal/prop-types';
import PropTypes from 'prop-types';
import React from 'react';

import FloatingLayer from '../FloatingLayer';
import ForwardRef from '../ForwardRef';

import componentCss from './Spinner.module.less';

/**
 * A minimally styled component that controls `Spinner` positioning and interaction states.
 *
 * @class Spinner
 * @memberof ui/Spinner
 * @ui
 * @public
 */
const SpinnerBase = kind({
	name: 'ui:Spinner',

	propTypes: /** @lends ui/Spinner.Spinner.prototype */ {
		/**
		 * A theme-supplied component that performs the animation.
		 *
		 * Theme authors can use the `css.running` class to attach the animation CSS.
		 * This element should accept a `children` prop which takes the form of an optional message
		 * for the user.
		 *
		 * Unlike most other components, this does *not* represent the root rendered element, and
		 * instead refers to the "spinner" part of this component. The presence of `blockClickOn`
		 * changes the rendering tree and where this is used.
		 *
		 * @type {String|Component}
		 * @required
		 * @public
		 */
		component: EnactPropTypes.renderable.isRequired,

		/**
		 * Determines how far the click-blocking should extend.
		 *
		 * * `null` does not block clicking
		 * * 'screen' blocks entire screen
		 * * 'container' blocks up to the nearest ancestor with absolute or relative positioning
		 *
		 * When `blockClickOn` is either `'screen'` or `'container'`, a translucent scrim can be added
		 * by setting [scrim]{@link ui/Spinner.Spinner#scrim} prop to `true`.
		 *
		 * @type {String|null}
		 * @public
		 */
		blockClickOn: PropTypes.oneOf(['screen', 'container', null]),

		/**
		 * Centers the spinner horizontally and vertically relative to its containing component.
		 *
		 * @type {Boolean}
		 * @default false
		 * @public
		 */
		centered: PropTypes.bool,

		/**
		 * Called with a reference to [component]{@link ui/Spinner.Spinner#component}
		 *
		 * @private
		 */
		componentRef: PropTypes.func,

		/**
		 * Customizes the component by mapping the supplied collection of CSS class names to the
		 * corresponding internal Elements and states of this component.
		 *
		 * The following classes are supported:
		 *
		 * * `spinner` - The root `component` class
		 * * `spinnerContainer` - Added as a parent in the case of `blockOnClick="container"
		 * * `blockClickOn` - Applied if interaction should be blocked
		 * * `centered` - Applied if the `centered` prop is present
		 * * `running` - Always applied to `component`. Attach animation name property to this class.
		 * * `scrim` - The blocking layer behind the Spinner
		 *
		 * @type {Object}
		 * @public
		 */
		css: PropTypes.object,

		/**
		 * Halts the animation of the spinner
		 *
		 * @type {Boolean}
		 * @default false
		 * @public
		 */
		paused: PropTypes.bool,

		/**
		 * Sets a scrim behind the spinner with the `css.scrim` class applied.
		 *
		 * Only has an effect when `blockClickOn` is `'screen'` or `'container'` and has no effect
		 * by default or when blockClickOn is `null`.
		 *
		 * @type {Boolean}
		 * @default false
		 * @public
		 */
		scrim: PropTypes.bool
	},

	defaultProps: {
		centered: false,
		paused: false,
		scrim: false
	},

	styles: {
		css: componentCss,
		className: 'spinner',
		publicClassNames: true
	},

	computed: {
		className: ({centered, paused, styler}) => styler.append(
			{centered, running: !paused}
		),
		scrimClassName: ({blockClickOn, scrim, styler}) => styler.join(
			{blockClickOn, scrim}
		),
		scrimType: ({scrim}) => scrim ? 'translucent' : 'transparent',
		spinnerContainerClassName: ({blockClickOn, centered, styler}) => styler.join(
			{centered, spinnerContainer: blockClickOn}
		)
	},

	render: ({blockClickOn, component: Component, componentRef, scrimClassName, scrimType, spinnerContainerClassName, ...rest}) =>  {
		delete rest.centered;
		delete rest.paused;
		delete rest.scrim;

		switch (blockClickOn) {
			case 'screen': {
				return (
					<FloatingLayer noAutoDismiss open scrimType={scrimType}>
						<Component ref={componentRef} {...rest} />
					</FloatingLayer>
				);
			}
			case 'container': {
				return (
					<div className={spinnerContainerClassName}>
						<div className={scrimClassName} />
						<Component ref={componentRef} {...rest} />
					</div>
				);
			}
			default: {
				return (
					<Component ref={componentRef} {...rest} />
				);
			}
		}
	}
});

const Spinner = ForwardRef({prop: 'componentRef'}, SpinnerBase);

export default Spinner;
export {
	Spinner,
	SpinnerBase
};
