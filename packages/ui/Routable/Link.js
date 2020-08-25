import kind from '@enact/core/kind';
import {forProp, forward, handle, preventDefault} from '@enact/core/handle';
import hoc from '@enact/core/hoc';
import useHandlers from '@enact/core/useHandlers';
import PropTypes from 'prop-types';
import React from 'react';

import {resolve, RouteContext} from './util';

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

function useLink ({path: currentPath, navigate}) {
	const handleNavigate = React.useCallback(
		({path}) => {
			if (!navigate) return;

			navigate({
				path: resolve(currentPath, path)
			});
		},
		// omitting currentPath in order to cache the value used a mount time to avoid evaluating
		// relative paths against updated currentPath values
		// eslint-disable-next-line react-hooks/exhaustive-deps
		[navigate]
	);

	return {
		navigate: handleNavigate
	};
}

const Linkable = hoc({navigate: 'onClick'}, (config, Wrapped) => {
	const {navigate} = config;

	const navHandlers = {
		[navigate]: handle(
			forward(navigate),
			(ev, props, hook) => {
				hook.navigate(props);
			}
		)
	};

	// eslint-disable-next-line no-shadow
	function Linkable (props) {
		const ctx = React.useContext(RouteContext);
		const link = useLink(ctx);
		const handlers = useHandlers(navHandlers, props, link);

		return (
			<Wrapped {...props} {...handlers} />
		);
	}

	return class LinkableAdapter extends React.Component {
		render () {
			return (
				<Linkable {...this.props} />
			);
		}
	};
});

const Link = Linkable(LinkBase);

export default Link;
export {
	Link,
	LinkBase,
	Linkable
};
