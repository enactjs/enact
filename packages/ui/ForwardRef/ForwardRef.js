import hoc from '@enact/core/hoc';
import React from 'react';

const defaultConfig = {
	prop: 'forwardRef'
};

const ForwardRef = hoc(defaultConfig, (config, Wrapped) => {
	const {prop} = config;

	return React.forwardRef((props, ref) => {
		const withRef = {
			...props,
			[prop]: ref
		};

		return (
			<Wrapped {...withRef} />
		);
	});
});

export default ForwardRef;
export {
	ForwardRef
};
