/**
 * Exports the {@link ui/A11yDecorator.A11yDecorator} Higher-order Component (HOC).
 *
 * @module ui/A11yDecorator
 */

import hoc from '@enact/core/hoc';
import kind from '@enact/core/kind';
import React from 'react';
import PropTypes from 'prop-types';

/**
 * Creates accessibility message for applying specific aria attribute.
 *
 * @function
 * @memberof ui/A11yDecorator
 * @param  {String} aria		aria attribute for applying hint
 * @param  {String}	hint		hint label
 * @param  {String}	prehint		pre-hint label
 * @param  {String}	content		base content for appending label
 * @returns {String} result of combined label.
 * @public
 */
const hintComposer = function (aria, hint, prehint, content) {
	if (!aria) {
		const
			prefix = content || null,
			label = prehint && prefix && hint && (prehint + ' ' + prefix + ' ' + hint) ||
				prehint && prefix && (prehint + ' ' + prefix) ||
				prehint && hint && (prehint + ' ' + hint) ||
				hint && prefix && (prefix + ' ' + hint) ||
				prehint ||
				hint ||
				prefix;
		return label;
	}
	return aria;
};

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
	prop: 'children',

	/**
	 * Specifies the aria attribute for the component's hint message
	 *
	 * @type {String}
	 * @default 'aria-label'
	 * @memberof ui/A11yDecorator.A11yDecorator.defaultConfig
	 */
	ariaTarget: 'aria-label'
};

/**
 * {@link ui/A11yDecorator.A11yDecorator} is a Higher-order Component that adds support for hint
 * text to be read before and/or after the content. By default, the `children` prop is used as the
 * source of the components content but may be configured by passing a different `prop` to the HOC
 * configuration.
 *
 * @class A11yDecorator
 * @memberof ui/A11yDecorator
 * @hoc
 * @public
 */
const A11yDecorator = hoc(defaultConfig, (config, Wrapped) => {
	const {prop, ariaTarget} = config;

	return kind({
		name: 'A11yDecorator',

		propTypes: {
			accessibilityHint: React.PropTypes.string,
			accessibilityPreHint: React.PropTypes.string
		},

		computed: {
			[ariaTarget]: ({[ariaTarget]: aria, accessibilityHint: hint, accessibilityPreHint: prehint, [prop]: content}) => hintComposer(aria, hint, prehint, content)
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
export {A11yDecorator, hintComposer};
