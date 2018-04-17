import hoc from '@enact/core/hoc';
import React from 'react';
import PropTypes from 'prop-types';

/**
 * Default config for [PlaceholderDecorator]{@link ui/Placeholder.PlaceholderDecorator}
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
 * The context propTypes required by `PlaceholderDecorator`. This should be set as the `childContextTypes` of a
 * container so that the container could notify when scrolling
 *
 * @memberof ui/Placeholder.PlaceholderDecorator
 * @public
 */
const contextTypes = {
	invalidateBounds: PropTypes.func,
	registerPlaceholder: PropTypes.func,
	unregisterPlaceholder: PropTypes.func
};

/**
 * [PlaceholderDecorator]{@link ui/Placeholder.PlaceholderDecorator} is a Higher-order Component that can be used that
 * a container notify the Wrapped component when scrolling.
 *
 * Containers must provide `registerPlaceholder`, `unregisterPlaceholder`, and `invalidateBounds` methods via React's context for
 * `PlaceholderDecorator` instances.
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

		componentDidUpdate (prevProps, prevState) {
			if (this.state.visible && prevState.visible !== this.state.visible) {
				this.context.invalidateBounds();
				this.context.unregisterPlaceholder(this);
			}
		}

		componentWillUnmount () {
			if (!this.state.visible) {
				this.context.unregisterPlaceholder(this);
			}
		}

		update = ({leftThreshold, topThreshold}) => {
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
	contextTypes,
	PlaceholderDecorator
};
