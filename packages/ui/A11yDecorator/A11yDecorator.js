/**
 * Provides a higher-order component to add accessibility utility features to a component.
 *
 * @module ui/A11yDecorator
 * @exports A11yDecorator
 */

import hoc from '@enact/core/hoc';
import kind from '@enact/core/kind';
import PropTypes from 'prop-types';
import React from 'react';

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
 * Adds support for hint text to be read before and/or after the content.
 *
 * By default, the `children` prop is used as the source of the components content but may be
 * configured by passing a different `prop` to the HOC configuration.
 *
 * Usage:
 * ```
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

	return kind({
		name: 'A11yDecorator',

		propTypes: /** @lends ui/A11yDecorator.A11yDecorator.prototype */ {
			/**
			 * Sets the value of the `aria-label` attribute for the wrapped component.
			 *
			 * @memberof ui/A11yDecorator.A11yDecorator.prototype
			 * @type {String}
			 * @public
			 */
			'aria-label': PropTypes.string,

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
			accessibilityPreHint: PropTypes.string
		},

		computed: {
			'aria-label': ({'aria-label': aria, accessibilityPreHint: prehint, accessibilityHint: hint, [prop]: content}) => {
				if (!aria) {
					const
						prefix = content || null,
						label = prehint && prefix && hint && (prehint + ' ' + prefix + ' ' + hint) ||
							prehint && prefix && (prehint + ' ' + prefix) ||
							prehint && hint && (prehint + ' ' + hint) ||
							hint && prefix && (prefix + ' ' + hint) ||
							prehint ||
							hint ||
							null;
					return label;
				}
				return aria;
			}
		},

		render: (props) => {
			delete props.accessibilityPreHint;
			delete props.accessibilityHint;

			return (
				<Wrapped {...props} />
			);
		}
	});
});

export default A11yDecorator;
export {
	A11yDecorator
};
