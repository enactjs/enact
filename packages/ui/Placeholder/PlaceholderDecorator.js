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
	 * The property which has an index.
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
	initialHeight: 0,

	placeholderComponent: 'div'
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
	registerPlaceholder: React.PropTypes.func,
	unregisterPlaceholder: React.PropTypes.func
};

/**
 * {@link ui/PlaceholderDecorator.PlaceholderDecorator} is a Higher-order Component that can be used that
 * a container notify the Wrapped component when scrolling.
 *
 * Containers must provide `registerPlaceholder` and `unregisterPlaceholder` methods via React's context in order for
 * `PlaceholderDecorator` instances.
 *
 * @class PlaceholderDecorator
 * @memberof ui/PlaceholderDecorator
 * @hoc
 * @public
 */
const PlaceholderDecorator = hoc(defaultConfig, (config, Wrapped) => {
	const {placeholderComponent: PlaceholderComponent, indexProp, initialHeight} = config;
	const placeholderBounds = {height: initialHeight + 'px'};

	return class extends React.Component {
		static displayName = 'PlaceholderDecorator'

		static contextTypes = contextTypes

		constructor () {
			super();

			this.state = {
				visible: false
			};
		}

		componentDidMount () {
			if (!this.state.visible) {
				this.context.registerPlaceholder(this, this.update);
			}
		}

		componentWillUnmount () {
			if (!this.state.visible) {
				this.context.unregisterPlaceholder({key: this});
			}
		}

		update = ({index, offsetTopThreshold}) => {
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
					<Wrapped
						{...this.props}
						key={key}
						ref={this.initPlaceholderRef}
					/>
				);
			} else {
				return (
					<PlaceholderComponent
						key={key}
						ref={this.initPlaceholderRef}
						style={placeholderBounds}
					/>
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
