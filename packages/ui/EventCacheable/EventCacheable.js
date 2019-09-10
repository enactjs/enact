import React from 'react';
import hoc from '@enact/core/hoc';

const EventCacheable = hoc((config = {defaultEvent: null, type: null}, Wrapped) => {
	const {defaultEvent, type} = config;

	return class EventParamCacheableBase extends React.Component {
		cachedEvent = defaultEvent || null

		getEvent = () => (this.cachedEvent)

		setEvent = (event) => {
			this.cachedEvent = event;
		}

		eventHandler = (ev) => {
			this.cachedEvent = ev;
		}

		render () {
			const eventHandler = type ? {[type]: this.eventHandler} : null;

			return (
				<Wrapped
					{...this.props}
					{...eventHandler}
				/>
			);
		}
	};
});

export default EventCacheable;
