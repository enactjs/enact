/**
 * Exports the {@link ui/Remeasurable.Remeasurable} and {@link ui/Remeasurable.RemeasurableDecorator}
 * higher-order component (HOC). Adds the ability to broadcast remeasure changes
 * based on a callback. The default export is {@link ui/Remeasurable.Remeasurable}.
 *
 * @module ui/Remeasurable
 * @private
 */
import React from 'react';
import invariant from 'invariant';
import hoc from '@enact/core/hoc';
import {contextTypes, Publisher, Subscription} from '@enact/core/internal/PubSub';
import {perfNow} from '@enact/core/util';

const Resize = React.createContext();


/**
 * Default config for {@link ui/Remeasurable.RemeasurableDecorator}
 *
 * @memberof ui/Remeasurable.RemeasurableDecorator
 * @hocconfig
 */
const defaultConfig = {
	/**
	 * Configures the event name that triggers the component
	 *
	 * @type {String}
	 * @memberof ui/Remeasurable.RemeasurableDecorator.defaultConfig
	 */
	trigger: null
};

/**
 * {@link ui/Remeasurable.RemeasurableDecorator} is a higher-order component which adds the ability
 * to broadcast remeasure changes based on a callback.
 *
 * @class RemeasurableDecorator
 * @memberof ui/Remeasurable
 * @hoc
 * @private
 */
const RemeasurableDecorator = hoc(defaultConfig, (config, Wrapped) => {
	const {trigger} = config;

	invariant(trigger, 'trigger is required by RemeasurableDecorator');

	return class extends React.Component {
		static displayName = 'RemeasurableDecorator'

		static contextTypes = contextTypes

		static childContextTypes = contextTypes

		constructor (props) {
			super(props);
			this.state = {
				remeasure: null
			};
		}

		getChildContext () {
			return {
				Subscriber: this.publisher.getSubscriber()
			};
		}

		componentWillMount () {
			this.publisher = Publisher.create('resize', this.context.Subscriber);
			this.publisher.publish({
				remeasure: null
			});

			if (this.context.Subscriber) {
				this.context.Subscriber.subscribe('resize', this.handleSubscription);
			}
		}

		componentWillReceiveProps (nextProps) {
			if (this.props[trigger] !== nextProps[trigger]) {
				this.setState({
					remeasure: perfNow()
				});
			}
		}

		componentDidUpdate (prevProps, prevState) {
			if (this.state.remeasure !== prevState.remeasure) {
				this.publisher.publish(this.state);
			}
		}

		componentWillUnmount () {
			if (this.context.Subscriber) {
				this.context.Subscriber.unsubscribe('resize', this.handleSubscription);
			}
		}

		handleSubscription = ({message}) => {
			this.updateRemeasure(message);
		}

		updateRemeasure (state) {
			this.setState(state);
			this.publisher.publish(state);
		}

		render () {
			return (
				<Wrapped {...this.props} />
			);
		}
	};
});


/**
 * {@link ui/Remeasurable.Remeasurable} is a higher-order component which notifies a child of a
 * change in size from parent. This can then be used to trigger a new measurement. A `remeasure`
 * prop will be passed down to the wrapped component.
 *
 * @class Remeasurable
 * @memberof ui/Remeasurable
 * @hoc
 * @private
 */
const Remeasurable = Subscription({
	channels: ['resize'],
	mapMessageToProps: (channel, state) => state
});

export default Remeasurable;
export {Remeasurable, RemeasurableDecorator, Resize as ResizeContext};
