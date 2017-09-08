import hoc from '@enact/core/hoc';
import PropTypes from 'prop-types';
import React from 'react';

const defaultConfig = {
	channels: null,
	mapStateToProps: null
};

const contextTypes = {
	Subscriber: PropTypes.shape({
		subscribe: PropTypes.func,
		unsubscribe: PropTypes.func
	})
};

const Subscription = hoc(defaultConfig, (config, Wrapped) => {
	const {channels, mapStateToProps} = config;

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

		combinePropsAndState () {
			// Choosing to overwrite state with props to provide a simple way to allow localized
			// overrides. This can be prevented by a Subscription instance by implementing
			// mapStateToProps in such a way that the state is redirected into different props.

			if (typeof mapStateToProps === 'function') {
				return Object.assign(
					{},
					...Object.keys(this.state).map(key => mapStateToProps(key, this.state[key])),
					this.props
				);
			}

			return Object.assign({}, this.state, this.props);
		}

		render () {
			const props = this.combinePropsAndState();

			return (
				<Wrapped {...props} />
			);
		}
	};
});

export default Subscription;
export {
	contextTypes,
	Subscription
};
