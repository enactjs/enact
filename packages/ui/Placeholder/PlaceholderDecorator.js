import hoc from '@enact/core/hoc';
import React from 'react';

import {PlaceholderContext} from './PlaceholderControllerDecorator';

/**
 * Default config for PlaceholderDecorator.
 *
 * @memberof ui/Placeholder.PlaceholderDecorator
 * @hocconfig
 * @public
 */
const defaultConfig = {
	/**
	 * Configures the style of the placeholder element
	 *
	 * @type {Object}
	 * @default {height: 0, width: 'auto'}
	 * @memberof ui/Placeholder.PlaceholderDecorator.defaultConfig
	 */
	style: {height: 0, width: 'auto'},

	/**
	 * The component to use as a placeholder.
	 *
	 * @type {String}
	 * @default 'div'
	 * @memberof ui/Placeholder.PlaceholderDecorator.defaultConfig
	 */
	placeholderComponent: 'div'
};

/**
 * A higher-order component that enables a container to notify the wrapped component when scrolling.
 *
 * Containers must provide `registerPlaceholder`, `unregisterPlaceholder`, and `invalidateBounds`
 * methods via React's context for `PlaceholderDecorator` instances.
 *
 * @class PlaceholderDecorator
 * @memberof ui/Placeholder
 * @hoc
 * @public
 */
const PlaceholderDecorator = hoc(defaultConfig, (config, Wrapped) => {
	const {placeholderComponent: PlaceholderComponent, style} = config;
	const placeholderStyle = Object.assign({}, defaultConfig.style, style);

	return class extends React.PureComponent {
		static displayName = 'PlaceholderDecorator'

		static contextType = PlaceholderContext

		constructor () {
			super();

			this.state = {
				visible: false
			};
		}

		componentDidMount () {
			if (!this.state.visible && this.context) {
				this.controller = this.context(this.update.bind(this));
			}
		}

		componentDidUpdate (prevProps, prevState) {
			if (this.controller && this.state.visible && prevState.visible !== this.state.visible) {
				// also need invalidateBounds() for scroller :(
				this.controller.unregister();
			}
		}

		componentWillUnmount () {
			if (this.controller && !this.state.visible) {
				this.controller.unregister();
			}
		}

		update ({leftThreshold, topThreshold}) {
			const {offsetLeft, offsetTop, offsetHeight, offsetWidth} = this.placeholderRef;

			if (offsetTop < topThreshold + offsetHeight && offsetLeft < leftThreshold + offsetWidth) {
				this.setState((state) => state.visible ? null : {visible: true});
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
	PlaceholderDecorator
};
