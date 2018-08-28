import {forward, handle} from '@enact/core/handle';
import hoc from '@enact/core/hoc';
import {Job} from '@enact/core/util';
import React from 'react';
import ReactDOM from 'react-dom';

import {contextTypes} from './PlaceholderDecorator';

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
	 * If the container is a static size, this can be specified at design-time to avoid calculating the
	 * bounds at run-time (the default behavior).
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

/**
 * A higher-order component (HOC) that can make placeholders rendered or not rendered depending on
 * `'scrollTop'` from the `'onScroll'`'s parameter.
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

		static childContextTypes = contextTypes

		getChildContext () {
			return {
				registerPlaceholder: this.handleRegister,
				unregisterPlaceholder: this.handleUnregister
			};
		}

		componentDidMount () {
			this.setBounds();
			this.setThresholds(0, 0);
		}

		componentWillUnmount () {
			this.notifyAllJob.stop();
		}

		bounds = null
		controlled = []
		leftThreshold = -1
		node = null
		topThreshold = -1

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

		handleRegister = (key, callback) => {
			this.controlled.push({callback, key});

			// do not notify until we've initialized the thresholds
			if (this.topThreshold !== -1 && this.leftThreshold !== -1) {
				this.notifyAllJob.start(this.topThreshold, this.leftThreshold);
			}
		}

		handleUnregister = (key) => {
			const length = this.controlled.length;

			for (let i = 0; i < length; i++) {
				if (this.controlled[i].key === key) {
					this.controlled.splice(i, 1);
					break;
				}
			}
		}

		notifyAll = (topThreshold, leftThreshold) => {
			for (let index = this.controlled.length - 1; index >= 0; index--) {
				const {callback} = this.controlled[index];

				callback({
					index,
					leftThreshold,
					topThreshold
				});
			}
		}

		// queue up notifications when placeholders are first created
		notifyAllJob = new Job(this.notifyAll, 32)

		setThresholds (top, left) {
			if (this.controlled.length === 0) return;

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
				<Wrapped {...props} />
			);
		}
	};
});

export default PlaceholderControllerDecorator;
