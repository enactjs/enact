import Subscriber from './Subscriber';

const Publisher = {
	create: (channel, parent) => {
		return {
			parent,
			channel,

			listeners: new Set(),
			addListener (callback) {
				this.listeners.add(callback);
				if (this.message) {
					callback({
						channel: this.channel,
						message: this.message
					});
				}
			},
			removeListener (callback) {
				this.listeners.remove(callback);
			},

			message: null,
			publish (message) {
				this.message = Object.freeze(message);
				for (let listener of this.listeners) {
					listener({
						channel: this.channel,
						message: this.message
					});
				}
			},

			subscriber: null,
			getSubscriber () {
				this.subscriber = this.subscriber || Subscriber.create(this);
				return this.subscriber;
			}
		};
	}
};

export default Publisher;
export {
	Publisher
};
