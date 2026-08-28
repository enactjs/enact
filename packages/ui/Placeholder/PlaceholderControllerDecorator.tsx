import {forward, handle} from '@enact/core/handle';
import hoc from '@enact/core/hoc';
import {WithRef} from '@enact/core/internal/WithRef';
import Registry, {type RegistryEvent} from '@enact/core/internal/Registry';
import {Job} from '@enact/core/util';
import {Component, createContext, createRef} from 'react';

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

const PlaceholderContext = createContext<((fn: (...args: any[]) => any) => any) | null>(null);

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
	const WrappedWithRef = WithRef(Wrapped);

	return class extends Component<Record<string, any>, Record<string, any>> {
		static displayName = 'PlaceholderControllerDecorator';

		constructor (props: Record<string, any>) {
			super(props);

			this.nodeRef = createRef();
		}

		componentDidMount () {
			this.setBounds();
			this.setThresholds(0, 0);
		}

		componentWillUnmount () {
			this.notifyAllJob.stop();
		}

		[key: string]: any;

		bounds: {height: number; width: number} | null = null;
		leftThreshold = -1;
		node: HTMLElement | null = null;
		topThreshold = -1;
		registry = Registry.create(this.handleRegister.bind(this));

		setBounds () {
			if (bounds != null) {
				this.bounds = Object.assign({}, bounds);
			} else {
				this.node = this.nodeRef.current;
				this.bounds = {
					height: this.node?.offsetHeight ?? 0,
					width: this.node?.offsetWidth ?? 0
				};
			}
		}

		handleRegister (ev: any) {
			if (ev.action === 'register') {
				// do not notify until we've initialized the thresholds
				if (this.topThreshold !== -1 && this.leftThreshold !== -1) {
					this.notifyAllJob.start(this.topThreshold, this.leftThreshold);
				}
			}
		}

		notifyAll = (topThreshold: number, leftThreshold: number) => {
			// `RegistryEvent` (from `core/internal/Registry`) requires an `action: string` field,
			// but this registry pairing (this controller <-> `PlaceholderDecorator`'s `update`) is a
			// purpose-built threshold-notification channel, not one of the `{action}`-shaped
			// register/unregister lifecycle events -- the payload here is intentionally just
			// `{leftThreshold, topThreshold}`, which is all `update()` ever reads. Worth revisiting
			// in `core` (e.g. a generic `RegistryEvent<T>`) rather than papering over it in `ui`.
			this.registry.notify({
				leftThreshold,
				topThreshold
			} as unknown as RegistryEvent);
		};

		// queue up notifications when placeholders are first created
		notifyAllJob = new Job(this.notifyAll, 32);

		setThresholds (top: number, left: number) {
			const {height, width} = this.bounds!;
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
			({scrollLeft, scrollTop}: {scrollLeft: number; scrollTop: number}) => {
				this.setThresholds(scrollTop, scrollLeft);
			}
		);

		render () {
			const props: Record<string, any> = Object.assign({}, this.props);

			if (notify) props[notify] = this.handleNotify;

			return (
				<PlaceholderContext value={this.registry.register}>
					<WrappedWithRef {...props} outermostRef={this.nodeRef} referrerName="Placeholder" />
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
