/**
 * Exports the {@link ui/PlaceholderDecorator.PlaceholderDecorator} Higher-order Component (HOC).
 *
 * @module ui/Placeholder.PlaceholderDecorator
 */

import hoc from '@enact/core/hoc';
import React from 'react';

/**
 * Default config for {@link ui/PlaceholderDecorator.PlaceholderDecorator}
 *
 * @memberof ui/PlaceholderDecorator.PlaceholderDecorator
 * @hocconfig
 * @public
 */
const defaultConfig = {
	/**
	 * Configures the style of the placeholder element
	 *
	 * @type {Object}
	 * @default {height: 0, width: 'auto'}
	 * @memberof ui/PlaceholderDecorator.PlaceholderDecorator.defaultConfig
	 */
	style: {height: 0, width: 'auto'},

	/**
	 * The component to use as a placeholder.
	 *
	 * @type {String}
	 * @default 'div'
	 * @memberof ui/PlaceholderDecorator.PlaceholderDecorator.defaultConfig
	 */
	placeholderComponent: 'div'
};

/**
 * The context propTypes required by `PlaceholderDecorator`. This should be set as the `childContextTypes` of a
 * container so that the container could notify when scrolling
 *
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
	const {placeholderComponent: PlaceholderComponent, style} = config;
	const placeholderStyle = Object.assign({}, defaultConfig.style, style);

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
				this.context.unregisterPlaceholder(this);
			}
		}

		update = ({leftThreshold, topThreshold}) => {
			const {offsetLeft, offsetTop} = this.placeholderRef;

			if (offsetTop < topThreshold && offsetLeft < leftThreshold) {
				this.setState({visible: true});
				this.context.unregisterPlaceholder(this);
			}
		}

		initPlaceholderRef = (ref) => {
			this.placeholderRef = ref;
		}

		render () {
			const {visible} = this.state;

			if (visible) {
				return (
					<Wrapped
						{...this.props}
						ref={this.initPlaceholderRef}
					/>
				);
			} else {
				return (
					<PlaceholderComponent
						ref={this.initPlaceholderRef}
						style={placeholderStyle}
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
