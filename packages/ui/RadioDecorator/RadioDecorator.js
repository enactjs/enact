import {forward} from '@enact/core/handle';
import hoc from '@enact/core/hoc';
import React from 'react';

import {contextTypes, RadioContainerDecorator} from './RadioContainerDecorator';

const defaultConfig = {
	activate: 'onOpen',
	deactivate: 'onClose'
};

const RadioDecorator = hoc(defaultConfig, (config, Wrapped) => {
	const {activate, deactivate} = config;
	const forwardActivate = forward(activate);
	const forwardDeactivate = forward(deactivate);

	return class extends React.Component {
		static displayName = 'RadioDecorator'

		static contextTypes = contextTypes

		componentDidMount () {
			if (this.context.registerRadioItem) {
				this.context.registerRadioItem(this);
			}
		}

		componentWillUnount () {
			if (this.context.unregisterRadioItem) {
				this.context.unregisterRadioItem(this);
			}
		}

		deactivate = () => {
			forwardDeactivate(null, this.props);
		}

		handleActivate = () => {
			if (this.context.activateRadioItem) {
				this.context.activateRadioItem(this);
			}

			forwardActivate(null, this.props);
		}

		handleDeactivate = () => {
			if (this.context.deactivateRadioItem) {
				this.context.deactivateRadioItem(this);
			}

			forwardDeactivate(null, this.props);
		}

		render () {
			const props = {
				...this.props,
				[activate]: this.handleActivate,
				[deactivate]: this.handleDeactivate
			};

			return <Wrapped  {...props} />;
		}
	};
});

export default RadioDecorator;
export {
	RadioContainerDecorator,
	RadioDecorator
};

