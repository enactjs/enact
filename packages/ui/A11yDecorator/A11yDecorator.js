/**
 * Provides a higher-order component to add accessibility utility features to a component.
 *
 * @module ui/A11yDecorator
 * @exports A11yDecorator
 */

import hoc from '@enact/core/hoc';
import PropTypes from 'prop-types';
import React from 'react';

import useA11y from './useA11y';

/**
 * Default config for {@link ui/A11yDecorator.A11yDecorator}.
 *
 * @memberof ui/A11yDecorator.A11yDecorator
 * @hocconfig
 */
const defaultConfig = {
	/**
	 * Configures the prop for the source of the component's content
	 *
	 * @type {String}
	 * @default 'children'
	 * @memberof ui/A11yDecorator.A11yDecorator.defaultConfig
	 */
	prop: 'children'
};

/**
 * A higher-order component that adds support for hint text to be read before and/or after the
 * content.
 *
 * By default, the `children` prop is used as the source of the components content but may be
 * configured by passing a different `prop` to the HOC configuration.
 *
 * Note: This HoC passes a number of props to the wrapped component that should be passed to the
 * main DOM node.
 *
 * Usage:
 * ```
 * const MyComponentBase = ({myProp, ...rest}) => (
 *    <div {...rest}>{myProp}</div>
 *  );
 * ...
 * const MyComponent = A11yDecorator(MyComponentBase);
 *
 * // passes an aria-label property to MyComponentBase with accessibilityPreHint and
 * // accessibilityHint wrapping children
 * <MyComponent accessibilityPreHint="before children" accessibilityHint="after children">
 *   {children}
 * </MyComponent>
 * ```
 *
 * @class A11yDecorator
 * @memberof ui/A11yDecorator
 * @hoc
 * @public
 */
const A11yDecorator = hoc(defaultConfig, (config, Wrapped) => {
	const {prop} = config;

	// eslint-disable-next-line no-shadow
	function A11yDecorator ({'aria-label': ariaLabel, accessibilityHint, accessibilityPreHint, [prop]: content, ...rest}) {
		const a11y = useA11y({
			accessibilityHint,
			accessibilityPreHint,
			'aria-label': ariaLabel,
			content
		});

		return (
			<Wrapped {...rest} {...a11y} />
		);
	}

	A11yDecorator.propTypes = /** @lends ui/A11yDecorator.A11yDecorator.prototype */ {
		/**
		 * Sets the hint text to be read after the content.
		 *
		 * @type {String}
		 * @public
		 */
		accessibilityHint: PropTypes.string,

		/**
		 * Sets the hint text to be read before the content.
		 *
		 * @type {String}
		 * @public
		 */
		accessibilityPreHint: PropTypes.string,

		/**
		 * Sets the value of the `aria-label` attribute for the wrapped component.
		 *
		 * @memberof ui/A11yDecorator.A11yDecorator.prototype
		 * @type {String}
		 * @public
		 */
		'aria-label': PropTypes.string
	};

	return A11yDecorator;
});

export default A11yDecorator;
export {
	A11yDecorator,
	useA11y
};
