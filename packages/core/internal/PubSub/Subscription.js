import PropTypes from 'prop-types';
import React from 'react';

import hoc from '../../hoc';

/**
 * Default config for {@link core/internal/PubSub.Subscription}.
 *
 * @memberof core/internal/PubSub.Subscription
 * @hocconfig
 */
const defaultConfig = {
	/**
	 * Array of channels to which the component should subscribe
	 *
	 * @type {String[]}
	 * @default null
	 * @required
	 * @memberof core/internal/PubSub.Subscription.defaultConfig
	 */
	channels: null,

	/**
	 * Function that maps a channel's message to props
	 *
	 * @type {Function}
	 * @default null
	 * @memberof core/internal/PubSub.Subscription.defaultConfig
	 */
	mapMessageToProps: null
};

const contextTypes = {
	Subscriber: PropTypes.shape({
		subscribe: PropTypes.func,
		unsubscribe: PropTypes.func
	})
};

/**
 * Subscribes to the configured `channels` and passes the received messages to the Wrapped component
 * as props. By default, if the channel has published a message, the prop will be the name of the
 * channel and the value will be the last message sent. This behavior can be overridden by providing
 * a value to `mapMessageToProps` which will be called for each channel and message and should return
 * an props object.
 *
 * ```
 * const Component = ({userId, settings}) => { ... };
 * const SubscribedComponent = Subscription(
 *     channels: ['user', 'settings'],
 *     mapMessageToProps: (channel, message) => {
 *         if (channel === 'user') {
 *             // extract user's id and pass it as userId
 *             return {
 *                 userId: message.id
 *             };
 *         }
 *
 *         // for settings, pass the message on 'as-is'
 *         return {
 *             settings: message
 *         };
 *     },
 *     Component
 * )
 * ```
 *
 * @class Subscription
 * @memberof core/internal/PubSub
 * @hoc
 * @private
 */
const Subscription = hoc(defaultConfig, (config, Wrapped) => {
	const {channels, mapMessageToProps} = config;

	return class extends React.Component {

		static displayName = 'Subscription'

		static propTypes = {}

		static contextTypes = contextTypes

		static defaultProps = {}

		constructor () {
			super();

			this.state = {};
		}

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
			// mapMessageToProps in such a way that the state is redirected into different props.

			if (typeof mapMessageToProps === 'function') {
				return Object.assign(
					{},
					...Object.keys(this.state).map(key => mapMessageToProps(key, this.state[key])),
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
