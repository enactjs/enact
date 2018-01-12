/**
 * Provides an unstyled indeterminate progress indicator (Spinner) component to be customized by a
 * theme or application. The theme using this component must supply a `spinnerComponent` element
 * which follows the requirements listed by the
 * [spinnerComponent]{@link ui/Spinner.spinnerComponent} prop documentation.
 *
 * @module ui/Spinner
 * @exports Spinner
 * @exports SpinnerBase
 * @exports SpinnerDecorator
 */

import kind from '@enact/core/kind';
import PropTypes from 'prop-types';
import React from 'react';

import FloatingLayer from '../FloatingLayer';

import componentCss from './Spinner.less';

/**
 * A component which accepts the specified props that has no additional behaviors applied
 *
 * @class SpinnerBase
 * @memberof ui/Spinner
 * @ui
 * @public
 */
const SpinnerBase = kind({
	name: 'ui:Spinner',

	propTypes: /** @lends ui/Spinner.SpinnerBase.prototype */ {
		/**
		 * An arbitrarily complex theme-supplied component that animates with the presence of a
		 * `.running` class. This element should accept a `children` prop which takes the form of
		 * an optional messagefor the user.
		 *
		 * @type {Component|String}
		 * @public
		 */
		spinnerComponent: PropTypes.oneOfType([PropTypes.func, PropTypes.string]).isRequired,

		/**
		 * Determines how far the click-blocking should extend. It can be `'screen'`, `'container'`,
		 * or `null`. 'screen' blocks entire screen. 'container' blocks up to the nearest ancestor
		 * with absolute or relative positioning. When blockClickOn is either `'screen'` or
		 * `'container'`, a translucent scrim can be added by setting
		 * [scrim]{@link ui/Spinner.Spinner#scrim} prop to `true`.
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

		childrenComponent: PropTypes.oneOfType([PropTypes.func, PropTypes.string]),

		/**
		 * Customizes the component by mapping the supplied collection of CSS class names to the
		 * corresponding internal Elements and states of this component.
		 *
		 * The following classes are supported:
		 *
		 * * `spinner` - The root component class
		 * * `spinnerContainer` - Added as a parent in the case of blockOnClick="container"
		 * * `blockClickOn` - Applied if interaction should be blocked
		 * * `centered` - Applied if the centered prop is present
		 * * `client` - The optional text portion of the Spinner
		 * * `content` - Applied if there is (children) content
		 * * `running` - Controls the playback state. Attach animation name property to this class.
		 * * `scrim` - The blocking layer behind the Spinner
		 *
		 * @type {Object}
		 * @public
		 */
		css: PropTypes.object,

		/**
		 * When `true`, sets visible translucent scrim behind spinner only when blockClickOn is
		 * `'screen'` or `'container'`. Scrim has no effect by default or when blockClickOn is `null`.
		 *
		 * @type {Boolean}
		 * @default false
		 * @public
		 */
		scrim: PropTypes.bool
	},

	defaultProps: {
		centered: false,
		childrenComponent: 'div',
		scrim: false
	},

	styles: {
		css: componentCss,
		className: 'spinner',
		publicClassNames: true
	},

	computed: {
		className: ({centered, children, styler}) => styler.append(
			{centered, content: children}
		),
		children: ({children, css, childrenComponent: ChildrenComponent}) => {
			if (children) {
				return (
					<ChildrenComponent className={css.client}>
						{children}
					</ChildrenComponent>
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

	render: ({blockClickOn, children, scrimClassName, scrimType, spinnerComponent: SpinnerComponent, spinnerContainerClassName, ...rest}) =>  {
		delete rest.centered;
		delete rest.childrenComponent;
		delete rest.scrim;

		switch (blockClickOn) {
			case 'screen': {
				return (
					<FloatingLayer noAutoDismiss open scrimType={scrimType}>
						<SpinnerComponent {...rest}>
							{children}
						</SpinnerComponent>
					</FloatingLayer>
				);
			}
			case 'container': {
				return (
					<div className={spinnerContainerClassName}>
						<div className={scrimClassName} />
						<SpinnerComponent {...rest}>
							{children}
						</SpinnerComponent>
					</div>
				);
			}
			default: {
				return (
					<SpinnerComponent {...rest}>
						{children}
					</SpinnerComponent>
				);
			}
		}
	}
});

/**
 * Adds no functionality, but is provided for export-API consistency between components
 *
 * @hoc
 * @memberof ui/Spinner
 * @public
 */
const SpinnerDecorator = (Wrapped) => Wrapped;

/**
 * A minimally-styled Spinner component. (Identical to `SpinnerBase`)
 *
 * @class Spinner
 * @extends ui/Spinner.SpinnerBase
 * @memberof ui/Spinner
 * @mixes ui/Spinner.SpinnerDecorator
 * @ui
 * @public
 */
const Spinner = SpinnerBase;


export default Spinner;
export {
	Spinner,
	SpinnerBase,
	SpinnerDecorator
};
