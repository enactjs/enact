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
	 * The property on each `childComponent` that receives the index of the item in the Repeater
	 *
	 * @type {String}
	 * @default 'data-index'
	 * @public
	 */
	indexProp: 'data-index',

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
	getPlaceholderOffsetTopThreshold: React.PropTypes.func,
	registerPlaceholder: React.PropTypes.func,
	unregisterPlaceholder: React.PropTypes.func
};

/**
 * {@link ui/PlaceholderDecorator.PlaceholderDecorator} is a Higher-order Component that can be used that
 * a container notify the Wrapped component when scrolling.
 *
 * Containers must provide `register` and `unregister` methods via React's context in order for
 * `PlaceholderDecorator` instances.
 *
 * @class PlaceholderDecorator
 * @memberof ui/PlaceholderDecorator
 * @hoc
 * @public
 */
const PlaceholderDecorator = hoc(defaultConfig, (config, Wrapped) => {
	const
		dummyStyle = {height: config.initialHeight + 'px'},
		indexProp = config.indexProp;

	return class extends React.Component {
		static displayName = 'PlaceholderDecorator'

		constructor (props, context) {
			const offsetTop = config.initialHeight * props[indexProp];

			super(props);

			this.state = {
				visible: (offsetTop < context.getPlaceholderOffsetTopThreshold())
			};
		}

		static contextTypes = contextTypes

		componentDidMount () {
			if (!this.state.visible) {
				this.context.registerPlaceholder(this);
			}
		}

		componentWillUnmount () {
			if (!this.state.visible) {
				this.context.unregisterPlaceholder({observer: this});
			}
		}

		update ({index, offsetTopThreshold}) {
			const {offsetTop} = this.placeholderRef;

			if (offsetTop < offsetTopThreshold) {
				this.setState({visible: true});
				this.context.unregisterPlaceholder({index});
			}
		}

		initPlaceholderRef = (ref) => {
			this.placeholderRef = ref;
		}

		render () {
			const
				key = this.props[indexProp],
				{visible} = this.state;

			if (visible) {
				return (
					<Wrapped {...this.props} key={key} ref={this.initPlaceholderRef} />
				);
			} else {
				return (
					<div key={key} ref={this.initPlaceholderRef} style={dummyStyle} />
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
