import {forward} from '@enact/core/handle';
import hoc from '@enact/core/hoc';
import React from 'react';

import RadioContainerDecorator from './RadioContainerDecorator';

const defaultConfig = {
	activate: 'onOpen',
	activeKey: 'name',
	activeProp: 'active',
	prop: 'open'
};

const RadioDecorator = hoc(defaultConfig, (config, Wrapped) => {
	const {activate, activeKey, activeProp, prop} = config;
	const forwardActivate = forward(activate);

	return class extends React.Component {
		static displayName = 'RadioDecorator'

		onActivate = () => {
			forwardActivate({
				[activeProp]: this.props[activeKey]
			}, this.props);
		}

		render () {
			const props = {
				...this.props,
				[activate]: this.onActivate,
				[prop]: this.props[activeKey] === this.props[activeProp]
			};

			delete props[activeKey];
			delete props[activeProp];

			return <Wrapped  {...props} />;
		}
	};
});

export default RadioDecorator;
export {
	RadioContainerDecorator,
	RadioDecorator
};

