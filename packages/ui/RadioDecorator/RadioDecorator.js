import {forward} from '@enact/core/handle';
import hoc from '@enact/core/hoc';
import React from 'react';

import RadioContainerDecorator from './RadioContainerDecorator';

const defaultConfig = {
	activate: 'onOpen',
	activeKey: 'name',
	activeProp: 'active',
	deactivate: 'onClose',
	prop: 'open'
};

const RadioDecorator = hoc(defaultConfig, (config, Wrapped) => {
	const {activate, activeKey, activeProp, deactivate, prop} = config;
	const forwardActivate = forward(activate);
	const forwardDeactivate = forward(deactivate);

	return class extends React.Component {
		static displayName = 'RadioDecorator'

		handleActivate = () => {
			forwardActivate({
				[activeProp]: this.props[activeKey]
			}, this.props);
		}

		handleDeactivate = () => {
			forwardDeactivate({
				[activeProp]: null
			});
		}

		render () {
			const props = {
				...this.props,
				[activate]: this.handleActivate,
				[deactivate]: this.handleDeactivate,
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

