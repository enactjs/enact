/**
 * Exports the {@link core/Broadcast.Broadcast} component. A `Broadcast` provides a generic way for
 * descendants to "subscribe" to some value that changes over time, bypassing any intermediate
 * `shouldComponentUpdate`'s in the hierarchy. It puts all subscription functions on
 * context.broadcasts, keyed by "channel". The default export is {@link core/Broadcast.Broadcast}.
 *
 * To use it, a subscriber must opt-in to context.broadcasts. See the
 * `Subscriber` component for a reference implementation.
 *
 * This code is taken and modified from https://github.com/ReactTraining/react-broadcast
 * from author Michael Jackson, which is licensed under the MIT license.
 *
 * @module core/Broadcast
 * @private
 */
import invariant from 'invariant';
import React from 'react';
import PropTypes from 'prop-types';

/**
 * `createBroadcast` is used by Broadcast to create and keep track of listeners.
 *
 * @class createBroadcast
 * @memberof core/Broadcast
 * @private
 */
const createBroadcast = (initialState) => {
	let listeners = [];
	let currentState = initialState;

	const getState = () => currentState;

	const setState = (state) => {
		currentState = state;
		listeners.forEach(listener => listener(currentState));
	};

	const subscribe = (listener) => {
		listeners.push(listener);
		const setListeners = () => {
			listeners = listeners.filter(item => item !== listener);
		};
		return setListeners;
	};

	return {
		getState,
		setState,
		subscribe
	};
};

/**
 * `Broadcast` component that allows for context like updates without getting stopped
 * at `shouldComponentUpdate`.
 *
 * @class Broadcast
 * @memberof core/Broadcast
 * @private
 */
class Broadcast extends React.Component {
	static propTypes = {
		/**
		* Name of channel to broadcast changes on.
		*
		* @type {String}
		* @required
		* @private
		*/
		channel: PropTypes.string.isRequired,

		children: PropTypes.node.isRequired,

		/**
	 	* Value that gets broadcast to the subcriber
		*
		* @type {*}
		* @private
		*/
		value: PropTypes.any
	}

	static contextTypes = {
		broadcasts: PropTypes.object
	}

	static childContextTypes = {
		broadcasts: PropTypes.object
	}


	getChildContext () {
		return {
			broadcasts: {
				...this.context.broadcasts,
				[this.props.channel]: this.broadcast
			}
		};
	}

	componentWillReceiveProps (nextProps) {
		invariant(
			this.props.channel === nextProps.channel,
			'You cannot change <Broadcast channel>'
		);

		if (this.props.value !== nextProps.value)	{
			this.broadcast.setState(nextProps.value);
		}
	}

	broadcast = createBroadcast(this.props.value)

	render () {
		return React.Children.only(this.props.children);
	}
}

export default Broadcast;
