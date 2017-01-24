import hoc from '@enact/core/hoc';
import kind from '@enact/core/kind';
import React from 'react';

const A11yDecorator = hoc((config, Wrapped) => kind({
	name: 'A11yDecorator',

	propTypes: {
		accessibilityHint: React.PropTypes.string,
		accessibilityPreHint: React.PropTypes.string
	},

	computed: {
		'aria-label': ({'aria-label': aria, accessibilityPreHint: prehint, accessibilityHint: hint, children: content}) => {
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
}));

export default A11yDecorator;
export {A11yDecorator};
