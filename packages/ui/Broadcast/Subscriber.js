import invariant from 'invariant';
import React from 'react';
import PropTypes from 'prop-types';

/**
 * Exports the {@link ui/Subscriber.Subscriber}. Component that will listen to
 * `Broadcast` Component changes in value.
 * The default export is {@link ui/Subscriber.Subscriber}.
 *
 * This code is taken and modified from https://github.com/ReactTraining/react-broadcast
 * from author Michael Jackson.
 *
 * @module ui/Subscriber
 * @public
 */
class Subscriber extends React.Component {
	static propTypes = {
		/**
	 	* Name of `Broadcast` channel to listen for value changes on.
		*
		* @type {String}
		* @public
		*/
		channel: PropTypes.string.isRequired,

		children: PropTypes.func.isRequired
	}

	static contextTypes = {
		broadcasts: PropTypes.object
	}

	constructor (props) {
		super(props);
		this.state = {
			value: null
		};
	}

	componentWillMount () {
		const broadcast = this.getBroadcast();

		if (broadcast) {
			this.setState({
				value: broadcast.getState()
			});
		} else {
			this.setState({
				value: null
			});
		}
	}

	componentDidMount () {
		const broadcast = this.getBroadcast();

		if (broadcast) {
			this.unsubscribe = broadcast.subscribe(value => {
				this.setState({value});
			});
		} else {
			this.unsubscribe = () => {};
		}
	}

	componentWillUnmount () {
		this.unsubscribe();
	}

	getBroadcast () {
		if (this.context.broadcasts) {
			const broadcast = this.context.broadcasts[this.props.channel];

			invariant(
				broadcast,
				'<Subscriber channel="%s"> must be rendered in the context of a <Broadcast channel="%s">',
				this.props.channel,
				this.props.channel
			);

			return broadcast;
		} else {
			return false;
		}
	}

	render () {
		return this.props.children(this.state.value);
	}
}

export default Subscriber;
