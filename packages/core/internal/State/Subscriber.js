const Subscriber = {
	create (publisher) {
		return {
			subscribe: (channel, callback) => {
				if (channel === publisher.channel) {
					publisher.addListener(callback);

					return true;
				} else if (publisher.parent) {
					return publisher.parent.subscribe(channel, callback);
				}

				return false;
			},
			unsubscribe: (channel, callback) => {
				if (channel === publisher.channel) {
					publisher.removeListener(callback);

					return true;
				} else if (publisher.parent) {
					return publisher.parent.unsubscribe(channel, callback);
				}

				return false;
			}
		};
	}
};

export default Subscriber;
export {
	Subscriber
};
