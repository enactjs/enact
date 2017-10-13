/**
 * Exports the {@link ui/Remeasurable.Remeasurable} and {@link ui/Remeasurable.RemeasurableDecorator}
 * Higher-order Component (HOC). Adds the ability to broadcast remeasure changes
 * based on a callback. The default export is {@link ui/Remeasurable.Remeasurable}.
 *
 * @module ui/Remeasurable
 * @private
 */
import React from 'react';
import invariant from 'invariant';
import hoc from '@enact/core/hoc';
import {forward} from '@enact/core/handle';
import {contextTypes, Publisher, Subscription} from '@enact/core/internal/PubSub';

/**
 * Default config for {@link ui/Remeasurable.RemeasurableDecorator}
 *
 * @memberof ui/Remeasurable.RemeasurableDecorator
 * @hocconfig
 */
const defaultConfig = {
	/**
	 * Configures the events that trigger the component
	 *
	 * @type {Array}
	 * @memberof ui/Remeasurable.RemeasurableDecorator.defaultConfig
	 */
	events: [],

	/**
	 * Configures the prop name that triggers the component on prop change
	 *
	 * @type {String}
	 * @memberof ui/Remeasurable.RemeasurableDecorator.defaultConfig
	 */
	trigger: null
};

/**
 * {@link ui/Remeasurable.RemeasurableDecorator} is a Higher-order Component which adds the ability
 * to broadcast remeasure changes based on a callback.
 *
 * @class RemeasurableDecorator
 * @memberof ui/Remeasurable
 * @hoc
 * @private
 */
const RemeasurableDecorator = hoc(defaultConfig, (config, Wrapped) => {
	const {trigger, events} = config;

	invariant(trigger || events.length > 0, 'trigger or events are required by RemeasurableDecorator');

	return class extends React.Component {
		static displayName = 'RemeasurableDecorator'

		static contextTypes = contextTypes

		static childContextTypes = contextTypes

		constructor (props) {
			super(props);
			this.state = {
				remeasure: false
			};
			this.triggerEvents = this.attachEvents();
		}

		getChildContext () {
			return {
				Subscriber: this.publisher.getSubscriber()
			};
		}

		componentWillMount () {
			this.publisher = Publisher.create('resize', this.context.Subscriber);
			this.publisher.publish({
				remeasure: false
			});

			if (this.context.Subscriber) {
				this.context.Subscriber.subscribe('resize', this.handleSubscription);
			}
		}

		componentWillReceiveProps (nextProps) {
			if (trigger) {
				this.setState({
					remeasure: this.props[trigger] !== nextProps[trigger]
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

		handleEvent = (name) => (ev) => {
			forward(name, ev, this.props);

			this.setState({
				remeasure: !this.state.remeasure
			});
		}

		attachEvents () {
			return events.reduce((previous, current) => {
				previous[current] = this.handleEvent(current);
				return previous;
			}, {});
		}

		render () {
			return (
				<Wrapped {...this.props} {...this.triggerEvents} />
			);
		}
	};
});


/**
 * {@link ui/Remeasurable.Remeasurable} is a Higher-order Component which notifies a child of a
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
export {Remeasurable, RemeasurableDecorator};
