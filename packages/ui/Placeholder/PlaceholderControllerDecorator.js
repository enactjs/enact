import {forward, handle} from '@enact/core/handle';
import hoc from '@enact/core/hoc';
import {Job} from '@enact/core/util';
import Registry from '@enact/core/internal/Registry';
import React from 'react';
import ReactDOM from 'react-dom';

/**
 * Default config for `PlaceholderControllerDecorator`.
 *
 * @memberof ui/Placeholder.PlaceholderControllerDecorator
 * @hocconfig
 * @public
 */
const defaultConfig = {
	/**
	 * The bounds of the container represented by an object with `height` and `width` members.
	 *
	 * If the container is a static size, this can be specified at design-time to avoid calculating
	 * the bounds at run-time (the default behavior).
	 *
	 * @type {Object}
	 * @default null
	 * @memberof ui/Placeholder.PlaceholderControllerDecorator.defaultConfig
	 */
	bounds: null,

	/**
	 * Event callback which indicates that the viewport has scrolled and placeholders should be
	 * notified.
	 *
	 * @type {String}
	 * @default onScroll
	 * @memberof ui/Placeholder.PlaceholderControllerDecorator.defaultConfig
	 */
	notify: 'onScroll',

	/**
	 * Multiplier used with the wrapped component's height and width to determine the threshold for
	 * replacing the placeholder component with the true component.
	 *
	 * @type {Number}
	 * @default 1.5
	 * @memberof ui/Placeholder.PlaceholderControllerDecorator.defaultConfig
	 */
	thresholdFactor: 1.5
};

const PlaceholderContext = React.createContext();

/**
 * A higher-order component (HOC) that render placeholder components.
 *
 * Components are rendered based on their position relative to the `'scrollTop'` from the
 * `'onScroll'`'s parameter. They are not unmounted once rendered.
 *
 * @class PlaceholderControllerDecorator
 * @memberof ui/Placeholder
 * @hoc
 * @public
 */
const PlaceholderControllerDecorator = hoc(defaultConfig, (config, Wrapped) => {
	const {bounds, notify, thresholdFactor} = config;

	return class extends React.Component {
		static displayName = 'PlaceholderControllerDecorator'

		componentDidMount () {
			this.setBounds();
			this.setThresholds(0, 0);
		}

		componentWillUnmount () {
			this.notifyAllJob.stop();
		}

		bounds = null
		leftThreshold = -1
		node = null
		topThreshold = -1
		registry = Registry.create(this.handleRegister.bind(this))

		setBounds () {
			if (bounds != null) {
				this.bounds = Object.assign({}, bounds);
			} else {
				// Allowing findDOMNode for HOCs versus adding extra ref props
				// eslint-disable-next-line	react/no-find-dom-node
				this.node = ReactDOM.findDOMNode(this);
				this.bounds = {
					height: this.node.offsetHeight,
					width: this.node.offsetWidth
				};
			}
		}

		handleRegister (ev) {
			if (ev.action === 'register') {
				// do not notify until we've initialized the thresholds
				if (this.topThreshold !== -1 && this.leftThreshold !== -1) {
					this.notifyAllJob.start(this.topThreshold, this.leftThreshold);
				}
			}
		}

		notifyAll = (topThreshold, leftThreshold) => {
			this.registry.notify({
				leftThreshold,
				topThreshold
			});
		}

		// queue up notifications when placeholders are first created
		notifyAllJob = new Job(this.notifyAll, 32)

		setThresholds (top, left) {
			const {height, width} = this.bounds;
			const topThreshold = height * thresholdFactor + top;
			const leftThreshold = width * thresholdFactor + left;

			if (this.topThreshold < topThreshold || this.leftThreshold < leftThreshold) {
				this.notifyAll(topThreshold, leftThreshold);
				this.topThreshold = topThreshold;
				this.leftThreshold = leftThreshold;
			}
		}

		handle = handle.bind(this)

		handleNotify = this.handle(
			forward(notify),
			({scrollLeft, scrollTop}) => {
				this.setThresholds(scrollTop, scrollLeft);
			}
		)

		render () {
			const props = Object.assign({}, this.props);

			if (notify) props[notify] = this.handleNotify;

			return (
				<PlaceholderContext.Provider value={this.registry.register}>
					<Wrapped {...props} />
				</PlaceholderContext.Provider>
			);
		}
	};
});

export default PlaceholderControllerDecorator;
export {
	PlaceholderContext,
	PlaceholderControllerDecorator
};
