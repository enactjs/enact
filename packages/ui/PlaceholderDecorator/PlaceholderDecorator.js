/**
 * Exports the {@link ui/PlaceholderDecorator.PlaceholderDecorator} Higher-order Component (HOC).
 *
 * @module ui/PlaceholderDecorator
 */

import hoc from '@enact/core/hoc';
import React from 'react';

/**
 * Default config for {@link ui/PlaceholderDecorator.PlaceholderDecorator}
 *
 * @memberof ui/PlaceholderDecorator.PlaceholderDecorator
 * @hocconfig
 */
const defaultConfig = {
	/**
	 * Configures the initial height of the child element
	 *
	 * @type {Number}
	 * @default 0
	 * @memberof ui/PlaceholderDecorator.PlaceholderDecorator.defaultConfig
	 */
	initialHeight: 0
};

/**
 * The context propTypes required by `PlaceholderDecorator`. This should be set as the `childContextTypes` of a
 * container so that the container could notify when scrolling
 *
 * @type {Object}
 * @memberof ui/PlaceholderDecorator
 * @public
 */
const contextTypes = {
	attachLazyChild: React.PropTypes.func,
	detachLazyChild: React.PropTypes.func
};

/**
 * {@link ui/PlaceholderDecorator.PlaceholderDecorator} is a Higher-order Component that can be used that
 * a container notify the Wrapped component when scrolling.
 *
 * Containers must provide `attachLazyChild` and `detachLazyChild` methods via React's context in order for
 * `PlaceholderDecorator` instances.
 *
 * @class PlaceholderDecorator
 * @memberof ui/PlaceholderDecorator
 * @hoc
 * @public
 */
const PlaceholderDecorator = hoc(defaultConfig, (config, Wrapped) => {
	const dummyStyle = {height: config.initialHeight + 'px'};

	return class extends React.Component {
		static displayName = 'PlaceholderDecorator'

		constructor (props) {
			super(props);

			this.state = {
				visible: false
			};
		}

		static contextTypes = contextTypes

		update ({containerScrollTopThreshold, index}) {
			const {offsetTop} = this.childRef;

			if (offsetTop < containerScrollTopThreshold) {
				this.setState({visible: true});
				this.context.detachLazyChild({index});
			}
		}

		componentDidMount () {
			this.context.attachLazyChild(this);
		}

		componentWillUnmount () {
			this.context.detachLazyChild({observer: this});
		}

		initChildRef = (ref) => {
			this.childRef = ref;
		}

		render () {
			const
				props = Object.assign({}, this.props),
				{visible} = this.state;

			if (visible) {
				return (
					<Wrapped {...props} ref={this.initChildRef} />
				);
			} else {
				return (
					<div ref={this.initChildRef} style={dummyStyle} />
				);
			}
		}
	};
});

export default PlaceholderDecorator;
export {
	contextTypes,
	PlaceholderDecorator
};
