import {forward, handle, call} from '@enact/core/handle';
import hoc from '@enact/core/hoc';
import React from 'react';

const defaultConfig = {defaultEvent: null, type: null};

const EventCacheable = hoc(defaultConfig, (config, Wrapped) => {
	const {defaultEvent, type} = config;

	return class EventCacheableBase extends React.Component {
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
