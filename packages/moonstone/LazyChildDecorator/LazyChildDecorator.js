/**
 * Exports the {@link moonstone/LazyChildDecorator.LazyChildDecorator} Higher-order Component (HOC).
 *
 * @module moonstone/LazyChildDecorator
 */

import hoc from '@enact/core/hoc';
import React from 'react';

/**
 * Default config for {@link moonstone/LazyChildDecorator.LazyChildDecorator}
 *
 * @memberof ui/LazyChildDecorator.LazyChildDecorator
 * @hocconfig
 */
const defaultConfig = {
	/**
	 * Configures the initial height of the child element
	 *
	 * @type {Number}
	 * @default 0
	 * @memberof moonstone/LazyChildDecorator.LazyChildDecorator.defaultConfig
	 */
	initialHeight: 0
};

/**
 * The context propTypes required by `LazyChildDecorator`. This should be set as the `childContextTypes` of a
 * container so that the container could notify when scrolling
 *
 * @type {Object}
 * @memberof moonstone/LazyChildDecorator
 * @public
 */
const contextTypes = {
	attachLazyChild: React.PropTypes.func,
	detachLazyChild: React.PropTypes.func
};

/**
 * {@link moonstone/LazyChildDecorator.LazyChildDecorator} is a Higher-order Component that can be used that
 * a container notify the Wrapped component when scrolling.
 *
 * Containers must provide `attachLazyChild` and `detachLazyChild` methods via React's context in order for
 * `LazyChildDecorator` instances.
 *
 * @class LazyChildDecorator
 * @memberof moonstone/LazyChildDecorator
 * @hoc
 * @public
 */
const LazyChildDecorator = hoc(defaultConfig, (config, Wrapped) => {
	const dummyStyle = {height: config.initialHeight + 'px'};

	return class extends React.Component {
		static displayName = 'LazyChildDecorator'

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

export default LazyChildDecorator;
export {
	contextTypes,
	LazyChildDecorator
};
