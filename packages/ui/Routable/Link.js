import kind from '@enact/core/kind';
import {forProp, forward, handle, preventDefault} from '@enact/core/handle';
import hoc from '@enact/core/hoc';
import PropTypes from 'prop-types';
import React from 'react';

import {RouteContext} from './util';

const LinkBase = kind({
	name: 'Link',

	propTypes: {
		path: PropTypes.string.isRequired,
		disabled: PropTypes.bool
	},

	defaultProps: {
		disabled: false
	},

	handlers: {
		onClick: handle(
			forProp('disabled', false),
			forward('onClick'),
			preventDefault
		)
	},

	render: ({path, ...rest}) => {
		/* eslint-disable jsx-a11y/anchor-has-content */
		return (
			<a href={path} {...rest} />
		);
		/* eslint-enable jsx-a11y/anchor-has-content */
	}
});

const Linkable = hoc({navigate: 'onClick'}, (config, Wrapped) => {
	const {navigate} = config;

	return kind({
		name: 'Linkable',

		contextType: RouteContext,

		propTypes: {
			path: PropTypes.string.isRequired
		},

		handlers: {
			[navigate]: handle(
				forward(navigate),
				(ev, {path}, {navigate: nav}) => {
					if (nav) nav({path});
				}
			)
		},

		render: (props) => {
			return (
				<Wrapped {...props} />
			);
		}
	});
});

const Link = Linkable(LinkBase);

export default Link;
export {
	Link,
	LinkBase,
	Linkable
};
