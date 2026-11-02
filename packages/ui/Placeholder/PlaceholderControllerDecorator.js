/* global ResizeObserver */

import {forward, handle} from '@enact/core/handle';
import hoc from '@enact/core/hoc';
import {Job} from '@enact/core/util';
import Registry from '@enact/core/internal/Registry';
import {Component, Fragment, createContext, createRef} from 'react';

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

const PlaceholderContext = createContext();

// Initial estimate from rendered boxes. CSS transforms change these values.
// The resize observer below replaces them with the layout border box.
const getFragmentBounds = (fragment) => {
	const rects = fragment?.getClientRects?.();
	if (!rects || rects.length === 0) {
		return {height: 0, width: 0};
	}

	let top = Infinity;
	let right = -Infinity;
	let bottom = -Infinity;
	let left = Infinity;

	for (let i = 0; i < rects.length; i++) {
		const rect = rects[i];
		top = Math.min(top, rect.top);
		right = Math.max(right, rect.right);
		bottom = Math.max(bottom, rect.bottom);
		left = Math.min(left, rect.left);
	}

	return {
		// offsetWidth and offsetHeight, which this measurement replaces, are rounded integers.
		height: Math.round(bottom - top),
		width: Math.round(right - left)
	};
};

// Layout size, so a scaled ancestor does not shrink the placeholder threshold.
const getBorderBoxBounds = (entries) => {
	let height = 0;
	let width = 0;
	let found = false;

	for (let i = 0; i < entries.length; i++) {
		const box = entries[i].borderBoxSize && entries[i].borderBoxSize[0];
		if (!box) {
			continue;
		}

		found = true;
		// inlineSize and blockSize match width and height in horizontal writing mode,
		// which is what offsetWidth and offsetHeight reported.
		height = Math.max(height, Math.round(box.blockSize));
		width = Math.max(width, Math.round(box.inlineSize));
	}

	if (!found) {
		return null;
	}

	return {height, width};
};

/**
 * A higher-order component (HOC) that renders placeholder components.
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

	return class extends Component {
		static displayName = 'PlaceholderControllerDecorator';

		constructor (props) {
			super(props);

			this.nodeRef = createRef();
		}

		componentDidMount () {
			this.setBounds();
			this.setThresholds(0, 0);
			this.observeBounds();
		}

		componentWillUnmount () {
			this.notifyAllJob.stop();
			this.disconnectBounds();
		}

		bounds = null;
		leftThreshold = -1;
		topThreshold = -1;
		scrollLeft = 0;
		scrollTop = 0;
		resizeObserver = null;
		registry = Registry.create(this.handleRegister.bind(this));

		setBounds () {
			if (bounds != null) {
				this.bounds = Object.assign({}, bounds);
			} else {
				this.bounds = getFragmentBounds(this.nodeRef.current);
			}
		}

		observeBounds () {
			const fragment = this.nodeRef.current;
			if (
				bounds != null ||
				!fragment ||
				typeof fragment.observeUsing !== 'function' ||
				typeof ResizeObserver !== 'function'
			) {
				return;
			}

			this.resizeObserver = new ResizeObserver((entries) => {
				const next = getBorderBoxBounds(entries);
				if (!next || (this.bounds && next.height === this.bounds.height && next.width === this.bounds.width)) {
					return;
				}

				this.bounds = next;
				// Measured size changed, so the thresholds from the client-rect estimate are stale.
				this.topThreshold = -1;
				this.leftThreshold = -1;
				this.setThresholds(this.scrollTop, this.scrollLeft);
			});
			fragment.observeUsing(this.resizeObserver);
		}

		disconnectBounds () {
			const fragment = this.nodeRef.current;
			if (this.resizeObserver && fragment && typeof fragment.unobserveUsing === 'function') {
				fragment.unobserveUsing(this.resizeObserver);
			}
			if (this.resizeObserver) {
				this.resizeObserver.disconnect();
				this.resizeObserver = null;
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
		};

		// queue up notifications when placeholders are first created
		notifyAllJob = new Job(this.notifyAll, 32);

		setThresholds (top, left) {
			this.scrollTop = top;
			this.scrollLeft = left;
			const {height, width} = this.bounds;
			const topThreshold = height * thresholdFactor + top;
			const leftThreshold = width * thresholdFactor + left;

			if (this.topThreshold < topThreshold || this.leftThreshold < leftThreshold) {
				this.notifyAll(topThreshold, leftThreshold);
				this.topThreshold = topThreshold;
				this.leftThreshold = leftThreshold;
			}
		}

		handle = handle.bind(this);

		handleNotify = this.handle(
			forward(notify),
			({scrollLeft, scrollTop}) => {
				this.setThresholds(scrollTop, scrollLeft);
			}
		);

		render () {
			const props = Object.assign({}, this.props);

			if (notify) props[notify] = this.handleNotify;

			return (
				<PlaceholderContext value={this.registry.register}>
					<Fragment ref={this.nodeRef}>
						<Wrapped {...props} />
					</Fragment>
				</PlaceholderContext>
			);
		}
	};
});

export default PlaceholderControllerDecorator;
export {
	PlaceholderContext,
	PlaceholderControllerDecorator
};
