import Subscriber from './Subscriber';

const Publisher = {
	create: (channel, parent) => {
		return {
			parent,
			channel,

			listeners: [],
			addListener (callback) {
				if (this.listeners.indexOf(callback) === -1) {
					this.listeners.unshift(callback);
				}

				if (this.message) {
					callback({
						channel: this.channel,
						message: this.message
					});
				}
			},
			removeListener (callback) {
				const index = this.listeners.indexOf(callback);
				if (index >= 0) {
					this.listeners.splice(index, 1);
				}
			},

			message: null,
			publish (message) {
				this.message = Object.freeze(message);
				this.listeners.forEach(listener => {
					listener({
						channel: this.channel,
						message: this.message
					});
				});
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
