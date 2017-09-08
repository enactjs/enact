import hoc from '@enact/core/hoc';
import PropTypes from 'prop-types';
import React from 'react';

const defaultConfig = {
	channels: null
};

const contextTypes = {
	Subscriber: PropTypes.shape({
		subscribe: PropTypes.func,
		unsubscribe: PropTypes.func
	})
};

const Subscription = hoc(defaultConfig, (config, Wrapped) => {
	const {channels} = config;

	return class extends React.Component {
		static displayName = 'Subscription'
		static contextTypes = contextTypes

		componentWillMount () {
			if (channels && channels.length && this.context.Subscriber) {
				channels.forEach(channel => {
					this.context.Subscriber.subscribe(channel, this.handleSubscription);
				});
			}
		}

		componentWillUnmount () {
			if (channels && channels.length && this.context.Subscriber) {
				channels.forEach(channel => {
					this.context.Subscriber.unsubscribe(channel, this.handleSubscription);
				});
			}
		}

		handleSubscription = ({channel, message}) => {
			this.setState({
				[channel]: message
			});
		}

		render () {
			return (
				<Wrapped {...this.props} {...this.state} />
			);
		}
	};
});

export default Subscription;
export {
	contextTypes,
	Subscription
};
