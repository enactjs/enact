/**
 * A higher-order component to cache an event.
 *
 * @module ui/EventCacheable
 * @exports EventCacheable
 */

import {forward, handle, call} from '@enact/core/handle';
import hoc from '@enact/core/hoc';
import PropTypes from 'prop-types';
import React from 'react';

/**
 * Default config for {@link ui/EventCacheable.EventCacheable}.
 *
 * @memberof ui/EventCacheable.EventCacheable
 * @hocconfig
 */
const defaultConfig = {
	/**
	 * The default event before caching an event.
	 *
	 * @type {*}
	 * @default null
	 * @memberof ui/EventCacheable.EventCacheable.defaultConfig
	 */
	defaultEvent: null,

	/**
	 * Configures the event name that cache the event in it.
	 *
	 * @type {String}
	 * @default ''
	 * @memberof ui/EventCacheable.EventCacheable.defaultConfig
	 */
	type: ''
};

/**
 * A higher-order component to cache the event as a parameter of a configured event prop.
 *
 * Its default event and event prop name can be configured when applied to a component.
 *
 * Example:
 * ```
 * const VirtualListWithCachedScrollStopEvent = EventCacheable({type: 'onScrollStop'}, VirtualList);
 * ```
 *
 * @class EventCacheable
 * @memberof ui/EventCacheable
 * @hoc
 * @public
 */
const EventCacheable = hoc(defaultConfig, (config, Wrapped) => {
	const {defaultEvent, type} = config;

	return class EventCacheableBase extends React.Component {
		static propTypes = /** @lends ui/EventCacheable.EventCacheable.prototype */ {
			/**
			 * Event callback to cache the event in it.
			 *
			 * @memberof ui/EventCacheable.EventCacheable.prototype
			 * @type {Function}
			 * @public
			 */
			[type]: PropTypes.func
		}

		cachedEvent = defaultEvent || null

		getEvent = () => (this.cachedEvent)

		setEvent = (ev) => {
			this.cachedEvent = ev;
		}

		eventHandler = handle(
			forward(type),
			call('setEvent'),
		).bindAs(this, 'eventHandler')

		render () {
			const props = {...this.props};

			if (type) {
				props[type] = this.eventHandler;
			}

			return (
				<Wrapped {...props} />
			);
		}
	};
});

export default EventCacheable;
