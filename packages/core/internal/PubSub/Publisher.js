
/**
 * `Publisher` publishes messages for a single `channel` to any subscribers. A new `Publisher` is
 * created using the factory method, {@link core/internal/PubSub.Publisher#create}.
 *
 * ```
 * import {Publisher} from '@enact/core/internal/PubSub';
 *
 * // Create a new Publisher for 'user' messages
 * const user = Publisher.create('user');
 * const userSub = user.getSubscriber();
 *
 * userSub.subscribe('user', handleUserSubscription);
 *
 * // Elsewhere down the component tree, create a new Publisher for 'settings' messages. By passing
 * // `userSub` as the parent, we support "bubbling" subscriptions up the tree for other channels.
 * const settings = Publisher.create('settings', userSub);
 *
 * const settingsSub = settings.getSubscriber();
 * const settingsSub.subscribe('settings', handleSettingsSubscription);
 * const settingsSub.subscribe('user', handleUserSubscription);
 * ```
 *
 * @class Publisher
 * @private
 * @memberof core/internal/PubSub
 */
const Publisher = {
	/**
	 * Creates a new {@link core/internal/PubSub.Publisher} for the given `channel`. If `parent` is
	 * provided, subscriptions for other channels will be forwarded to the parent allowing multiple
	 * channels from different publishers in the chain.
	 *
	 * @param   {String}                          channel  Channel name
	 * @param   {core/internal/PubSub.Subscriber} parent   Subscriber instance from an upstream
	 *                                                     publisher
	 *
	 * @returns {core/internal/PubSub/Publisher}           New Publisher instance
	 * @private
	 * @static
	 * @memberof core/internal/PubSub/Publisher
	 */
	create: (channel, parent) => {

		// cache the last message sent so it can be rebroadcast to new subscribers
		let lastMessage = null;

		// @TODO Replace with Set when unit testing supports it
		// All known subscribers to this channel
		const listeners = [];

		/**
		 * Adds a listener (if it isn't already added) and republishes the last message (if one
		 * exists) to the new subscriber.
		 *
		 * @param {Function} callback New listener
		 * @private
		 * @memberof core/internal/PubSub.Publisher
		 */
		function addListener (callback) {
			if (listeners.indexOf(callback) >= 0) return;

			listeners.unshift(callback);

			if (lastMessage) {
				callback({
					channel,
					message: lastMessage
				});
			}
		}

		/**
		 * Removes a listener from this publisher
		 *
		 * @param {Function} callback Listener
		 * @private
		 * @memberof core/internal/PubSub.Publisher
		 */
		function removeListener (callback) {
			const index = listeners.indexOf(callback);
			if (index >= 0) {
				listeners.splice(index, 1);
			}
		}

		/**
		 * Subscribers can `subscribe` to a channel to be notified of messages or events as
		 * determined by the publisher. They must `unsubscribe` with the same `channel` and
		 * `callback` to avoid invocations after the subscriber has been destroyed.
		 *
		 * @class Subscriber
		 * @private
		 * @memberof core/internal/PubSub
		 */
		const subscriber = {
			/**
			 * Subscribes to a `channel`
			 *
			 * @param   {String}   channel   Channel name
			 * @param   {Function} callback  Handler for channel messages
			 *
			 * @returns {Boolean}            `true` if a publisher exists for the `channel` and the
			 *                               subscription was successful
			 * @private
			 * @memberof core/internal/PubSub.Subscriber.protoptype
			 */
			subscribe (channelName, callback) {
				if (channelName === channel) {
					addListener(callback);

					return true;
				} else if (parent) {
					return parent.subscribe(channelName, callback);
				}

				return false;
			},

			/**
			 * Unsubscribes from a `channel`
			 *
			 * @param   {String}   channel   Channel name
			 * @param   {Function} callback  Handler for channel messages
			 *
			 * @returns {Boolean}            `true` if a publisher exists for the `channel` and the
			 *                               unsubscription was successful
			 * @private
			 * @memberof core/internal/PubSub.Subscriber.protoptype
			 */
			unsubscribe (channelName, callback) {
				if (channelName === channel) {
					removeListener(callback);

					return true;
				} else if (parent) {
					return parent.unsubscribe(channelName, callback);
				}

				return false;
			}
		};

		return {
			/**
			 * Publishes `message` to the `Publisher`'s Subscribers
			 *
			 * @param   {Object} message  An arbitrary message body which cannot be mutated by
			 *                            subscribers
			 *
			 * @private
			 * @memberof core/internal/PubSub.Publisher.prototype
			 */
			publish (message) {
				lastMessage = Object.freeze(message);
				listeners.forEach(listener => {
					listener({
						channel,
						message: lastMessage
					});
				});
			},


			/**
			 * Returns a @{link core/internal/PubSub.Subscriber} that can be used to add subscribers
			 * to this publisher.
			 *
			 * @private
			 * @memberof core/internal/PubSub.Publisher.prototype
			 */
			getSubscriber () {
				return subscriber;
			}
		};
	}
};

export default Publisher;
export {
	Publisher
};
