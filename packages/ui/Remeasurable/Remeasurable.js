/**
 * Exports the {@link ui/Remeasurable.Remeasurable} and {@link ui/Remeasurable.RemeasurableDecorator}
 * Higher-order Component (HOC). Adds the ability to broadcast remeasure changes
 * based on a callback. The default export is {@link ui/Remeasurable.Remeasurable}.
 *
 * @module ui/Remeasurable
 * @private
 */
import React from 'react';
import PropTypes from 'prop-types';
import invariant from 'invariant';
import hoc from '@enact/core/hoc';
import {forward} from '@enact/core/handle';
import {Broadcast, Subscriber} from '@enact/core/internal/Broadcast';
import {perfNow} from '@enact/core/util';

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
 * {@link ui/Remeasurable.RemeasurableDecorator} is a Higher-order Component which adds the ability
 * to broadcast remeasure changes based on a callback.
 *
 * @class RemeasurableDecorator
 * @memberof ui/Remeasurable
 * @hoc
 * @private
 */
const RemeasurableDecorator = hoc(defaultConfig, (config, Wrapped) => {
	const {trigger} = config;
	const forwardTrigger = forward(trigger);

	invariant(trigger, 'trigger is required by RemeasurableDecorator');

	return class extends React.Component {
		static displayName = 'RemeasurableDecorator'

		static propTypes = /** @lends moonstone/Remeasurable.RemeasurableDecorator.prototype */ {
			/**
			* Function to execute on the trigger event. The actual name of this
			* property is set in the config.
			*
			* @type {Function}
			* @private
			*/
			[trigger]: PropTypes.func
		}

		constructor (props) {
			super(props);
			this.state = {
				remeasure: perfNow()
			};
		}

		triggerRemeasure = (ev) => {
			forwardTrigger(ev, this.props);
			this.setState({remeasure: perfNow()});
		}

		render () {
			const props = Object.assign({}, this.props);
			props[trigger] = this.triggerRemeasure;

			// The extra subscriber to so we can keep nested Broadcasts values in sync
			return (
				<Subscriber channel="remeasure">
					{(value) => (
						<Broadcast channel="remeasure" value={this.state.remeasure > value ? this.state.remeasure : value}>
							<Wrapped {...props} />
						</Broadcast>
					)}
				</Subscriber>
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
const Remeasurable = (Wrapped) => {
	return class extends React.Component {
		static displayName = 'Remeasurable'

		constructor (props) {
			super(props);
		}

		render () {
			return (
				<Subscriber channel="remeasure">
					{(value) => <Wrapped {...this.props} remeasure={value} />}
				</Subscriber>
			);
		}
	};
};

export default Remeasurable;
export {Remeasurable, RemeasurableDecorator};
